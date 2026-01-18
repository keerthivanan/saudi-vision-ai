import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.rag_service import rag_service

# Configure Logging
logger = logging.getLogger(__name__)

class LegalAnalysisResult(BaseModel):
    """Structured output for legal analysis to ensure consistency."""
    summary: str = Field(description="A concise summary of the legal answer.")
    detailed_analysis: str = Field(description="The comprehensive legal analysis and reasoning.")
    key_points: List[str] = Field(description="List of critical legal points or takeaways.")
    citations: List[str] = Field(description="References to Saudi laws, regulations, or uploaded documents.")
    confidence_score: float = Field(description="Confidence score between 0.0 and 1.0")

# Smart Registry: Defines the "Personality" and "Constraints" of each model.
MODEL_REGISTRY = {
    # The Genius (High IQ, Strict Params)
    "gpt-5.2-chat-latest": {
        "tiktoken_fallback": "gpt-5",
        "supports_temperature": False, # Forces default (1)
        "description": "Best for complex reasoning and final answers."
    },
    # The Workhorse (Balanced)
    "gpt-5": {
        "tiktoken_fallback": "gpt-5",
        "supports_temperature": True,
        "default_temp": 0.7,
        "description": "Good baseline."
    },
    # The Intern (Fast, Cheap)
    "gpt-5-nano": {
        "tiktoken_fallback": "gpt-5-nano",
        "supports_temperature": True,
        "default_temp": 0.0,
        "description": "Best for routing and simple classification."
    }
}

class AIService:
    """
    State-of-the-Art AI Service for Saudi Legal Enterprise.
    Uses 'Reasoning' patterns and structured outputs for maximum reliability.
    """
    
    def __init__(self):
        # Use Singleton to prevent Qdrant Lock issues
        self.rag_service = rag_service
        self.output_parser = JsonOutputParser(pydantic_object=LegalAnalysisResult)
        
        # Check for valid API Key
        if not settings.OPENAI_API_KEY or "YOUR_SUPER_SECRET" in settings.OPENAI_API_KEY or "sk-..." in settings.OPENAI_API_KEY:
            logger.warning("⚠️ No valid OpenAI API Key found. Switching to SIMULATION MODE.")
            self.llm = None
            self.fast_llm = None
            self.is_simulation = True
        else:
            try:
                # Initialize Main Brain (The "Genius")
                self.llm = self._create_client("gpt-5.2-chat-latest")
                
                # Initialize Fast Router (The "Intern") - Optimized for Cost
                self.fast_llm = self._create_client("gpt-5-nano")
                
                self.is_simulation = False
            except Exception as e:
                logger.error(f"Failed to init OpenAI: {e}")
                self.llm = None
                self.fast_llm = None
                self.is_simulation = True

    def _create_client(self, model_name: str) -> ChatOpenAI:
        """
        Factory method to create a properly configured OpenAI Client.
        Reference: MODEL_REGISTRY
        """
        config = MODEL_REGISTRY.get(model_name, MODEL_REGISTRY["gpt-5"])
        
        params = {
            "model": model_name,
            "api_key": settings.OPENAI_API_KEY,
            "streaming": True,
            "tiktoken_model_name": config["tiktoken_fallback"]
        }
        
        # Only add temperature if the model supports it
        if config["supports_temperature"]:
            params["temperature"] = config.get("default_temp", 0.7)
            
        return ChatOpenAI(**params)

    async def _detect_and_translate(self, query: str) -> Dict[str, Any]:
        """
        Smart Logic: 
        1. Detects language.
        2. Returns dictionary with BOTH English and Arabic versions for Dual-Path Search.
        """
        try:
            # Check if input is Arabic
            is_arabic = any('\u0600' <= char <= '\u06FF' for char in query)
            
            target_language = "English"

            # Use FAST LLM for translation to avoid latency
            translator = self.fast_llm or self.llm

            if is_arabic:
                target_language = "Arabic"
                # Translate to English for English Docs
                prompt = f"Translate this Arabic query to strictly English. Output ONLY the translation.\nQuery: {query}"
                response = await translator.ainvoke([HumanMessage(content=prompt)])
                translated_en = response.content.strip()
                
                return {
                    "language": "Arabic",
                    "queries": [query, translated_en] # Search Original (Ar) + Translated (En)
                }
            else:
                target_language = "English"
                # Translate to Arabic for Arabic Docs (Optional but "Best of All Time")
                prompt = f"Translate this English query to strictly Arabic. Output ONLY the translation.\nQuery: {query}"
                response = await translator.ainvoke([HumanMessage(content=prompt)])
                translated_ar = response.content.strip()
                
                return {
                    "language": "English",
                    "queries": [query, translated_ar] # Search Original (En) + Translated (Ar)
                }
            
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            return {"language": "English", "queries": [query]} # Fallback

    async def _needs_rag(self, query: str) -> bool:
        """
        Smart Router: Determines if the query actually needs Retrieval vs General Chat.
        Uses fast_llm (GPT-4o-Mini) for <0.2s decision.
        """
        try:
            # Simple keyword heuristic first (0ms)
            q_lower = query.lower()
            keywords = ["saudi", "vision 2030", "neom", "law", "regulation", "project", "scheme", "housing", "ministry", "royal", "decree", "stats", "number", "percentage"]
            if any(k in q_lower for k in keywords):
                return True # Definitely RAG

            # If ambiguous, ask the Brain
            prompt = f"""Classify if this query requires searching an external Knowledge Base (PDFs about Saudi Vision 2030, Laws, Housing).
            Query: "{query}"
            Reply ONLY "YES" or "NO".
            """
            translator = self.fast_llm or self.llm
            response = await translator.ainvoke([HumanMessage(content=prompt)])
            decision = response.content.strip().upper()
            return "YES" in decision
            
        except:
            return True # Fallback to searching just in case

    async def generate_response_stream(
        self, 
        query: str, 
        history: List[Dict[str, str]], 
        db_session: AsyncSession,
        language: str = "en",
        model: str = "gpt-4o",
        user_id: Optional[str] = None 
    ) -> AsyncGenerator[str, None]:
        """
        Generates a streaming response with RAG augmentation and reasoning.
        Streams structured events (Thinking -> Sourcing -> Generating).
        """
        try:
            # 0. SMART ROUTING (The "Traffic Controller")
            yield json.dumps({"event": "status", "data": "🧠 Analyzing Intent..."}) + "\n"
            
            should_search = await self._needs_rag(query)
            
            # Init basics
            target_language = "English"
            queries_to_search = [query]
            relevant_docs = []

            if should_search:
                # 0.5 SMART TRANSLATION (Only if searching)
                yield json.dumps({"event": "status", "data": "🌍 Analyzing Language..."}) + "\n"
                
                lang_data = await self._detect_and_translate(query)
                queries_to_search = lang_data["queries"]
                target_language = lang_data["language"]
                
                # 1. RETRIEVAL (The "Memory") - DUAL PATH
                yield json.dumps({"event": "status", "data": f"🔍 Searching Knowledge Base ({len(queries_to_search)} Languages)..."}) + "\n"
                
                try:
                    # Search with ALL query variations (En + Ar)
                    seen_sources = set()
                    
                    for q in queries_to_search:
                        docs = await self.rag_service.search(q, top_k=5, user_id=user_id)
                        for d in docs:
                            # Deduplicate by content or source
                            src = d.get('source', '')
                            if src not in seen_sources:
                                relevant_docs.append(d)
                                seen_sources.add(src)
                    
                    # Yield Sources to Client
                    if relevant_docs:
                        sources = [doc.get("source", "Unknown") for doc in relevant_docs if isinstance(doc, dict)]
                        unique_sources = list(set(sources))
                        
                        yield json.dumps({"event": "status", "data": f"📑 Reading {len(unique_sources)} Bilingual Documents..."}) + "\n"
                        yield json.dumps({"event": "sources", "data": unique_sources}) + "\n"

                except Exception as e:
                    logger.error(f"RAG Search failed: {e}")
                    pass
            else:
                 yield json.dumps({"event": "status", "data": "💬 General Conversation Detected (Skipping Search)..."}) + "\n"

            # 2. REASONING (The "Brain")
            yield json.dumps({"event": "status", "data": "🤔 Synthesizing Strategic Insights..."}) + "\n"
            
            # SIMULATION / FALLBACK CHECK
            if self.is_simulation or not self.llm:
                yield json.dumps({"event": "status", "data": "✨ Drafting Response (Simulation)..."}) + "\n"
                
                # Canned "Intelligent" Responses based on keywords
                simulated_response = "As the Vision 2030 AI Assistant, I can confirm that "
                
                if "neom" in query.lower():
                    simulated_response += "NEOM is progressing rapidly as a cognitive city..."
                elif "economy" in query.lower() or "gdp" in query.lower():
                    simulated_response += "the Kingdom is successfully moving towards economic diversification..."
                else:
                    simulated_response += "Saudi Vision 2030 is built on three pillars..."

                # Stream the simulated text character by character to mimic AI
                import asyncio
                words = simulated_response.split(" ")
                for word in words:
                    yield json.dumps({"event": "token", "data": word + " "}) + "\n"
                    await asyncio.sleep(0.02) # Faster Typing effect
                return


            # REAL AI GENERATION
            current_time = datetime.now().strftime("%A, %B %d, %Y")
            
            context_text = ""
            for doc in relevant_docs:
                if isinstance(doc, dict):
                    context_text += f"Source: {doc.get('source', 'Unknown')}\nContent: {doc.get('content', '')}\n\n"
                else:
                    context_text += f"Content: {doc.page_content}\n\n"

            system_prompt = f"""You are the Official Strategic AI Consultant for Saudi Vision 2030.
            Your goal is to provide world-class, executive-level insights that "WOW" the user.

            CURRENT DATE: {current_time}
            TARGET LANGUAGE: {target_language} (You MUST output in this language)

            ---
            CORE INTELLIGENCE INSTRUCTIONS:
            
            1. **PRIORITIZE THE SOURCE (RAG)**:
               - The "STRATEGIC BRIEFING" below contains highly specific knowledge.
               - **CRITICAL**: If the user asks about specific details (project codes, stats, laws), use this data. It is your "Ground Truth".
            
            2. **BILINGUAL SYNTHESIS PROTOCOL (CRITICAL)**:
               - You have access to a **GLOBAL KNOWLEDGE BASE** containing both **English** and **Arabic** documents.
               - **IF User asks in English**: You MUST check the Arabic context chunks. If the answer is there, **TRANSLATE IT** and include it.
               - **IF User asks in Arabic**: You MUST check the English context chunks. If the answer is there, **TRANSLATE IT** and include it.
               - **Unified Answer**: Never say "The Arabic document says...". Just synthesize the facts into one seamless answer.

            3. **STRICT KNOWLEDGE BOUNDARY (CRITICAL)**:
               - **NO OUTSIDE KNOWLEDGE**: You are NOT a general purpose AI. You are a **Document Analyst**.
               - **IF** the answer is not in the "STRATEGIC BRIEFING" below, you must politely REFUSE.
               - Say: "I apologize, but this information is not available in the official Saudi Vision 2030 documents I have access to."
               - **EXCEPTION**: You may answer basic greetings (Hello, Hi) and questions about YOU (Who are you?).
               - **DO NOT** answer questions about history, world events (e.g. World Cup), or general trivia unless it is explicitly in             4. **STYLE & TONE (STRICT PROFESSIONAL)**:
                 - **VOICE**: Formal, Objective, Government Briefing style.
                 - **NO FLUFF**: Do not use phrases like "Beautiful question", "Here is the answer", "I hope this helps".
                 - **NO EMOJIS**: Do not use emojis in the headers or text. Keep it clean.
                 - **NO STORYTELLING**: Do not weave a narrative. Just report the facts found in the documents.
                 - **DIRECTNESS**: Start the answer immediately with the information.

             5. **ZERO LOCATION HALLUCINATION**:
                - You are a STRICT Document Analyst.
                - **ONLY** use facts present in the "STRATEGIC BRIEFING".
                - **CITATION REQUIRED**: Every claim must be backed by the source text.
                - If the document lists specific schemes, list them EXACTLY as they appear.

             6. **FORMATTING**:
                - Use standard Markdown (Bold keywords, bullet points).
                - Do NOT use "Did You Know?" sections.
                - Do NOT use "2026 Update" unless explicitly necessary for fact correction.
             
             ---
             STRATEGIC BRIEFING (INTERNAL KNOWLEDGE):
             {context_text}
             ---
             """

            messages = [
                SystemMessage(content=system_prompt),
            ]
            
            for msg in history[-5:]: 
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                else:
                    messages.append(AIMessage(content=msg["content"]))
                    
            # Use ORIGINAL query in message history context, but System Prompt handles the RAG injection
            messages.append(HumanMessage(content=query))

            # 3. GENERATION
            yield json.dumps({"event": "status", "data": "✨ Drafting Response..."}) + "\n"
            
            # Dynamic Model Switching (e.g. for high-tier users or fallbacks)
            client = self.llm
            if model != self.llm.model_name:
                 # Create temp client using strict factory logic
                 client = self._create_client(model)

            async for chunk in client.astream(messages):
                if chunk.content:
                    yield json.dumps({"event": "token", "data": chunk.content}) + "\n"

        except Exception as e:
            logger.error(f"AI Generation Error: {e}")
            # FALLBACK IN CASE OF CRASH
            error_msg = f"I apologize, but I am currently updating my strategic database. (Error: {str(e)})"
            yield json.dumps({"event": "token", "data": error_msg}) + "\n"

    async def get_chat_completion(self, messages: List[Dict[str, str]]) -> str:
        """
        Non-streaming helper for scripts and simple checks.
        Uses the same prompt logic but returns full text.
        """
        # Unwrap query from messages
        query = messages[-1]["content"] if messages else ""
        
        # Collect full stream response
        full_text = ""
        # Mock empty DB session/history for simple verification
        async for chunk_str in self.generate_response_stream(query, [], None):
            chunk = json.loads(chunk_str)
            if chunk.get("event") == "token":
                full_text += chunk.get("data", "")
                
        return full_text

    async def analyze_document(self, document_content: str) -> LegalAnalysisResult:
        """
        Performs a deep structured analysis of a legal document.
        Returns a strongly typed object, not just text.
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert Saudi Legal Contract Analyst. Extract key information into JSON."),
            ("human", "Analyze this legal text:\n{text}\n\n{format_instructions}")
        ])
        
        chain = prompt | self.llm | self.output_parser
        
        try:
            result = await chain.ainvoke({
                "text": document_content[:20000], # Token limit safety
                "format_instructions": self.output_parser.get_format_instructions()
            })
            return result
        except Exception as e:
            logger.error(f"Document Analysis Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to analyze document structure.")

# Singleton Instance
ai_service = AIService()

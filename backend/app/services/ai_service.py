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
    # Primary Reasoning Model (High IQ, Strict Params)
    "gpt-5.2-chat-latest": {
        "tiktoken_fallback": "gpt-5",
        "supports_temperature": False, # Forces default (1)
        "description": "Optimized for complex reasoning and final outputs."
    },
    # Standard Model (Balanced)
    "gpt-5": {
        "tiktoken_fallback": "gpt-5",
        "supports_temperature": True,
        "default_temp": 0.7,
        "description": "Balanced baseline performance."
    },
    # High-Efficiency Router (Fast, Cost-Effective)
    "gpt-5-nano": {
        "tiktoken_fallback": "gpt-5-nano",
        "supports_temperature": True,
        "default_temp": 0.0,
        "description": "Optimized for routing and classification."
    }
}

class AIService:
    """
    Enterprise-Grade AI Service for Saudi Vision 2030.
    Utilizes 'Reasoning' patterns and structured outputs for maximum reliability.
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
                # Initialize Main Brain (Primary Model)
                self.llm = self._create_client("gpt-5.2-chat-latest")
                
                # Initialize Fast Router (Efficiency Model)
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
            yield json.dumps({"event": "status", "data": "🧠 Analyzing User Intent..."}) + "\n"
            
            should_search = await self._needs_rag(query)
            
            # Init basics
            target_language = "English"
            queries_to_search = [query]
            relevant_docs = []

            if should_search:
                # 0.5 SMART TRANSLATION (Only if searching)
                yield json.dumps({"event": "status", "data": "🌍 Detecting Language Context..."}) + "\n"
                
                lang_data = await self._detect_and_translate(query)
                queries_to_search = lang_data["queries"]
                target_language = lang_data["language"]
                
                # 1. RETRIEVAL (The "Memory") - DUAL PATH
                yield json.dumps({"event": "status", "data": f"🔍 Scanning Knowledge Base ({len(queries_to_search)} Languages)..."}) + "\n"
                
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
                        
                        yield json.dumps({"event": "status", "data": f"📑 Analyzing {len(unique_sources)} Official Documents..."}) + "\n"
                        yield json.dumps({"event": "sources", "data": unique_sources}) + "\n"

                except Exception as e:
                    logger.error(f"RAG Search failed: {e}")
                    pass
            else:
                 yield json.dumps({"event": "status", "data": "💬 Engaging General Conversation..."}) + "\n"

            # 2. REASONING (The "Brain")
            yield json.dumps({"event": "status", "data": "🤔 Synthesizing Strategic Insights..."}) + "\n"
            
            # SIMULATION / FALLBACK CHECK
            if self.is_simulation or not self.llm:
                yield json.dumps({"event": "status", "data": "✨ Simulation Mode Active..."}) + "\n"
                
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
            Your role is to provide executive-level, document-based insights.

            CURRENT DATE: {current_time}
            TARGET LANGUAGE: {target_language} (Output strictly in this language)

            ---
            CORE OPERATIONAL DIRECTIVES:

            0. **KINGDOM LEADERSHIP & DEFINITIONS (AXIOMS)**:
               - **Sovereign**: The Kingdom of Saudi Arabia is a Monarchy.
                 * **King**: Custodian of the Two Holy Mosques, King Salman bin Abdulaziz Al Saud.
                 * **Crown Prince**: His Royal Highness Prince Mohammed bin Salman Al Saud (MBS), Prime Minister and Chairman of CEDA (Vision 2030 Architecture).
               - **Protocol**: If asked for a "President", politely correct that it is a Kingdom led by the King and Crown Prince.
               - **Definitions**: Answer "What is Vision 2030?" or "Who are you?" instantly using general knowledge aligned with official narratives.

            1. **STRICT RAG PRIORITY**:
               - The "STRATEGIC BRIEFING" below is your absolute Ground Truth.
               - Used for: Specific projects, statistics, laws, and regulations.

            2. **BILINGUAL SYNTHESIS**:
               - **Cross-Reference**: Check BOTH Arabic and English context chunks.
               - **Translation**: Translate findings across languages to answer the user's specific query language.
               - **Integration**: Synthesize facts seamlessly; do not explicitly state "The Arabic doc says...".

            3. **KNOWLEDGE BOUNDARIES**:
               - **Role**: You are a DOCUMENT ANALYST, not a general chatbot.
               - **Refusal**: IF the answer is not in the text AND not covered by Axioms (Rule 0), state:
                 "I apologize, but this information is not available in the official Saudi Vision 2030 documents I have access to."
               - **Prohibitions**: Do not answer questions on unrelated global events (e.g., sports results) or general trivia.

            4. **RESPONSE QUALITY**:
               - **Format**: Use professional, comprehensive paragraphs. Avoid excessive bullet points unless listing distinct data.
               - **Tone**: Formal, Executive, and Insightful.

            5. **ZERO HALLUCINATION**:
               - Citations are implicit but must be factual based *only* on the provided text.
               - List schemes/projects exactly as named in the source.

            6. **CONTEXTUAL WISDOM (FOOTER)**:
               - **Update Logic**: If listing outdated targets (e.g., 2020), append a footer:
                 "**📅 2026 Update:** [Brief status update based on general knowledge]."
               - **Value Add**: If data is current, append a relevant fact:
                 "**💎 Insight:** [Relevant context to enhance the answer]."
             
             ---
             STRATEGIC BRIEFING:
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
            yield json.dumps({"event": "status", "data": "✨ Generating Strategic Output..."}) + "\n"
            
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

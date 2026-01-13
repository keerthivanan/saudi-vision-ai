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
from app.services.rag_service import RAGService

# Configure Logging
logger = logging.getLogger(__name__)

class LegalAnalysisResult(BaseModel):
    """Structured output for legal analysis to ensure consistency."""
    summary: str = Field(description="A concise summary of the legal answer.")
    detailed_analysis: str = Field(description="The comprehensive legal analysis and reasoning.")
    key_points: List[str] = Field(description="List of critical legal points or takeaways.")
    citations: List[str] = Field(description="References to Saudi laws, regulations, or uploaded documents.")
    confidence_score: float = Field(description="Confidence score between 0.0 and 1.0")

class AIService:
    """
    State-of-the-Art AI Service for Saudi Legal Enterprise.
    Uses 'Reasoning' patterns and structured outputs for maximum reliability.
    """
    
    def __init__(self):
        self.rag_service = RAGService()
        self.output_parser = JsonOutputParser(pydantic_object=LegalAnalysisResult)
        
        # Check for valid API Key
        if not settings.OPENAI_API_KEY or "YOUR_SUPER_SECRET" in settings.OPENAI_API_KEY or "sk-..." in settings.OPENAI_API_KEY:
            logger.warning("⚠️ No valid OpenAI API Key found. Switching to SIMULATION MODE.")
            self.llm = None
            self.is_simulation = True
        else:
            try:
                self.llm = ChatOpenAI(
                    model="gpt-4o", 
                    temperature=0.2,
                    api_key=settings.OPENAI_API_KEY,
                    streaming=True
                )
                self.is_simulation = False
            except Exception as e:
                logger.error(f"Failed to init OpenAI: {e}")
                self.llm = None
                self.is_simulation = True

    async def _detect_and_translate(self, query: str) -> Dict[str, str]:
        """
        Smart Logic: 
        1. Detects if query is Arabic (or other).
        2. Translates to English for RAG search (to maximize hits).
        3. Returns user language so we can reply in it.
        """
        try:
            # Quick check for Arabic chars to avoid API call if obviously English
            has_arabic = any('\u0600' <= char <= '\u06FF' for char in query)
            
            if not has_arabic:
                return {"language": "English", "search_query": query}
            
            # If Arabic, use fast LLM to translate
            prompt = f"Translate this Arabic query to strictly English for a search engine. Output ONLY the English translation.\nQuery: {query}"
            
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            translated = response.content.strip()
            
            logger.info(f"🌍 Native: {query} -> Translated: {translated}")
            return {"language": "Arabic", "search_query": translated}
            
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            return {"language": "English", "search_query": query} # Fallback

    async def generate_response_stream(
        self, 
        query: str, 
        history: List[Dict[str, str]], 
        db_session: AsyncSession,
        language: str = "en" # Frontend hint, but we will auto-detect to be sure
    ) -> AsyncGenerator[str, None]:
        """
        Generates a streaming response with RAG augmentation and reasoning.
        Streams structured events (Thinking -> Sourcing -> Generating).
        """
        try:
            # 0. SMART TRANSLATION (The "Translator")
            yield json.dumps({"event": "status", "data": "🌍 Analyzing Language & Intent..."}) + "\n"
            
            lang_data = await self._detect_and_translate(query)
            search_query = lang_data["search_query"]
            target_language = lang_data["language"]
            
            # 1. RETRIEVAL (The "Memory")
            yield json.dumps({"event": "status", "data": f"🔍 Searching Knowledge Base ('{search_query}')..."}) + "\n"
            relevant_docs = []
            
            # Only run RAG if not in simple simulation/fallback mode for speed, 
            # or keep it if we want to simulate search time.
            # let's try to search even in sim mode if possible, but safely.
            try:
                # USE TRANSLATED QUERY FOR SEARCH
                relevant_docs = await self.rag_service.search(search_query, top_k=10)
                
                # Yield Sources to Client
                if relevant_docs:
                    sources = [doc.get("source", "Unknown") for doc in relevant_docs if isinstance(doc, dict)]
                    # Deduplicate
                    unique_sources = list(set(sources))
                    
                    # USER EXPERIENCE: Tell them EXACTLY what we found so they trust it.
                    yield json.dumps({"event": "status", "data": f"📑 Reading {len(unique_sources)} Official Documents..."}) + "\n"
                    # yield json.dumps({"event": "sources", "data": unique_sources}) + "\n" # Send sources event separately or frontend handles it? 
                    # Usually frontend handles "sources" event to display chips.
                    yield json.dumps({"event": "sources", "data": unique_sources}) + "\n"

            except Exception:
                pass # Ignore RAG errors in fallback

            # 2. REASONING (The "Brain")
            yield json.dumps({"event": "status", "data": "🤔 Synthesizing Strategic Insights..."}) + "\n"
            
            # SIMULATION / FALLBACK CHECK
            if self.is_simulation or not self.llm:
                yield json.dumps({"event": "status", "data": "✨ Drafting Response (Simulation)..."}) + "\n"
                
                # Canned "Intelligent" Responses based on keywords
                simulated_response = "As the Vision 2030 AI Assistant, I can confirm that "
                q_lower = search_query.lower() # Use translated for keyword match
                
                if "neom" in q_lower:
                    simulated_response += "NEOM is progressing rapidly as a cognitive city..."
                elif "economy" in q_lower or "gdp" in q_lower:
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
            
            # ... (Rest of context construction) ...
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
               - The "STRATEGIC BRIEFING" below contains highly specific, private, or uploaded knowledge.
               - **CRITICAL**: If the user asks about specific details found in the Briefing (e.g., project codes, stats, specific laws), you MUST use this data. It is your "Ground Truth".
            
            2. **INTELLIGENT HYBRID REASONING**:
               - **Understanding Intent**: If the user asks a general question (e.g., "How are you?", "What is 2+2?", "Explain AI"), do NOT force a connection to the documents if none exists. Use your general intelligence.
               - **Synthesizing**: If the user asks a complex question (e.g., "How does NEOM impact the economy?"), COMBINE the specific facts from the Briefing with your broader economic knowledge to create a rich, comprehensive answer.

            3. **STYLE & TONE (The "Amazing" Factor)**:
               - Voice: "Royal Enterprise" (Formal, Ambitious, Visionary, yet Warm).
               - Structure: Use clear headings, rich formatting (bolding), and concise bullet points.
               - **Stealth Integration**: Do NOT say "According to the uploaded documents". Present the facts as your own expert knowledge. You are the expert.

            4. **STRICT FACT-VERIFICATION (ZERO HALLUCINATION)**:
               - You are a STRICT Document Analyst.
               - **DO NOT** use your own outside knowledge about Vision 2030 (e.g., do not invent pillars or targets if they are not in the text below).
               - **ONLY** use facts present in the "STRATEGIC BRIEFING".
               - If the answer is NOT in the Briefing, say: "The provided document does not contain specific details about [topic], but generally..."
               - **CITATION REQUIRED**: Every claim must be backed by the source text.
            
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
            
            async for chunk in self.llm.astream(messages):
                if chunk.content:
                    yield json.dumps({"event": "token", "data": chunk.content}) + "\n"

        except Exception as e:
            logger.error(f"AI Generation Error: {e}")
            # FALLBACK IN CASE OF CRASH
            yield json.dumps({"event": "token", "data": "I apologize, but I am currently updating my strategic database. \n\nHowever, I can confirm that Vision 2030 continues to drive progress across all sectors."}) + "\n"

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

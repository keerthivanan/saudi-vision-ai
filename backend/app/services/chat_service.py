from typing import List, Dict, Any, AsyncGenerator, Optional
import json
import logging
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from openai import AsyncOpenAI
from app.core.config import settings
from app.services.rag_service import rag_service
from app.core.security import redact_pii
from app.models.chat import Conversation, Message

logger = logging.getLogger("chat_service")

class ChatService:
    """
    Enterprise Chat Service
    Handles LLM interaction, RAG context injection, and Streaming Responses.
    Also manages Conversation state in DB.
    """
    
    def __init__(self):
        try:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI Client: {e}")
            self.client = None
            
        self.model = "gpt-4-turbo"

    async def create_conversation(self, db: AsyncSession, user_id: UUID, title: str) -> Conversation:
        """Create a new conversation entry."""
        conv = Conversation(user_id=user_id, title=title)
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
        return conv

    async def add_message(self, db: AsyncSession, conversation_id: UUID, role: str, content: str) -> Message:
        """Add a message to the conversation history."""
        msg = Message(conversation_id=conversation_id, role=role, content=content)
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        return msg

    async def get_history(self, db: AsyncSession, conversation_id: UUID, limit: int = 10) -> List[Message]:
        """Retrieve recent messages for context."""
        query = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(desc(Message.timestamp)).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()

    async def get_user_conversations(self, db: AsyncSession, user_id: str, limit: int = 50) -> List[Conversation]:
        """Retrieve all conversations for a user."""
        query = select(Conversation).where(
            Conversation.user_id == user_id
        ).order_by(desc(Conversation.created_at)).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()

    async def _should_use_rag(self, message: str) -> bool:
        """Determines if the query requires document context (RAG)."""
        if not self.client:
            return False
            
        system_router_prompt = """You are a query router. Analyze the user question and determine if it requires information specifically from Saudi Legal, Investment, or Vision 2030 documents.
        - REPLY 'YES' only if the question is about laws, vision 2030 stats, business regulations, or specific document content.
        - REPLY 'NO' if the question is general (greetings, weather, coding, general AI chat, etc).
        Reply ONLY with 'YES' or 'NO'."""
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo", # Use faster model for routing
                messages=[
                    {"role": "system", "content": system_router_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=2,
                temperature=0
            )
            decision = response.choices[0].message.content.strip().upper()
            logger.info(f"Routing decision for '{message[:30]}...': {decision}")
            return "YES" in decision
        except Exception as e:
            logger.error(f"Routing error: {e}")
            return True # Fallback to RAG if error

    async def process_message(
        self, 
        message: str, 
        history: List[Dict[str, str]], 
        use_rag: bool = True
    ) -> AsyncGenerator[str, None]:
        """
        Enterprise-grade message processing with intelligent routing.
        """
        # 1. PII Redaction
        safe_message = redact_pii(message)
        
        context_text = ""
        sources = []

        # 2. Intelligent Routing Check
        # Only use RAG if use_rag is True AND the router thinks it's needed
        final_use_rag = False
        if use_rag:
            final_use_rag = await self._should_use_rag(safe_message)

        # 3. RAG Retrieval
        if final_use_rag:
            results = await rag_service.search(safe_message, top_k=8)
            if results:
                sources = [res["source"] for res in results]
                # Send source metadata first as special JSON chunk
                yield json.dumps({"type": "sources", "data": sources}) + "\n"
                
                context_blocks = [
                    f"source: {res['source']}\ncontent: {res['content']}" 
                    for res in results
                ]
                context_text = "\n\n".join(context_blocks)

        # 3. Prompt Engineering
        system_prompt = f"""You are SaudiAI, a state-of-the-art enterprise assistant for Saudi Arabia.
        
        CONTEXT:
        {context_text}
        
        CRITICAL INSTRUCTIONS:
        1. **Language Matching**: ALWAYS reply in the SAME language as the user's last message.
           - If user asks in **Arabic** -> Reply in **Arabic** (even if context is English).
           - If user asks in **English** -> Reply in **English**.
        2. **Cultural Usage**: 
           - When speaking Arabic, use professional/formal tone (Modern Standard Arabic).
           - Respect Islamic values and Saudi Vision 2030 themes.
        3. **Accuracy**: Use the provided CONTEXT to answer. If the answer is not in the context, say "I don't have that information" in the appropriate language.
        """

        messages = [
            {"role": "system", "content": system_prompt},
            *history[-5:],
            {"role": "user", "content": message}
        ]

        if not self.client:
            yield "System Error: OpenAI Client failed to initialize."
            return

        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
                temperature=0.3
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"LLM Error: {e}")
            yield "I apologize, but I encountered a temporary error."

chat_service = ChatService()

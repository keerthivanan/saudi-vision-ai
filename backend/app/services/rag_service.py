from typing import List, Dict, Any, Optional
import os
import json
import logging
from pathlib import Path
from datetime import datetime

# Langchain Imports
from langchain_core.documents import Document as LangchainDocument
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from openai import AsyncOpenAI

from app.core.config import settings
from app.services.document_service import ProcessedDocument

logger = logging.getLogger("rag_service")

class RAGService:
    """
    Enterprise RAG Service (Retrieval Augmented Generation)
    Manages Vector Database (FAISS) and Document Indexing.
    """
    
    def __init__(self):
        self.index_path = Path(settings.VECTOR_DB_PATH)
        self.embeddings = None
        self.vectorstore: Optional[FAISS] = None
        
        try:
            self.embeddings = OpenAIEmbeddings(
                model="text-embedding-3-large",
                openai_api_key=settings.OPENAI_API_KEY
            )
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI Embeddings: {e}")
            # Do NOT fallback to mock. If this fails, RAG should fail (so we know).
            self.embeddings = None
            
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n## ", "\n\n# ", "\n\n", "\n", " ", ""]
        )
        if self.embeddings:
            self._load_index()

    def _load_index(self):
        """Load FAISS index from disk if exists"""
        if self.index_path.exists():
            try:
                self.vectorstore = FAISS.load_local(
                    str(self.index_path), 
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                logger.info("✅ FAISS Index loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load index: {e}")
        else:
            logger.info("⚠️ No existing index found. Starting fresh.")

    async def ingest_document(self, doc: ProcessedDocument):
        """Wrapper for single document ingestion"""
        await self.add_documents([doc])

    async def add_documents(self, docs: List[ProcessedDocument]):
        """Index new documents into the Vector Store"""
        if not docs:
            return

        langchain_docs = [
            LangchainDocument(
                page_content=doc.content,
                metadata={
                    "filename": doc.filename,
                    "type": doc.doc_type,
                    **doc.metadata
                }
            ) for doc in docs
        ]

        chunks = self.text_splitter.split_documents(langchain_docs)
        logger.info(f"Split {len(docs)} docs into {len(chunks)} chunks")

        if self.vectorstore:
            self.vectorstore.add_documents(chunks)
        else:
            self.vectorstore = FAISS.from_documents(chunks, self.embeddings)
            
        # Persist to disk
        self.vectorstore.save_local(str(self.index_path))
        logger.info("💾 Index saved to disk")

    async def generate_queries(self, original_query: str) -> List[str]:
        """Generate variations of the query to improve retrieval coverage."""
        try:
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            prompt = f"""You are an AI language model assistant. Your task is to generate 3 different versions of the given user question to retrieve relevant documents from a vector database. By generating multiple perspectives, your goal is to help the user overcome some of the limitations of distance-based similarity search. 
            Provide these alternative questions separated by newlines.
            Original question: {original_query}"""
            
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=100
            )
            
            content = response.choices[0].message.content
            queries = [q.strip() for q in content.split('\n') if q.strip()]
            queries.append(original_query) # Always include original
            
            logger.info(f"Generated {len(queries)} query variations: {queries}")
            return list(set(queries)) # Unique only
            
        except Exception as e:
            logger.error(f"Multi-query generation failed: {e}")
            return [original_query]

    async def search(self, query: str, top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Ultimate RAG Search:
        1. Multi-Query Generation (3+ variations)
        2. Broad Parallel Retrieval
        3. Reciprocal Rank Fusion & Deduplication
        4. Keyword-Weighted Re-ranking
        """
        if not self.vectorstore:
            logger.warning("Search attempted on empty index")
            return []

        # 1. OPTIMIZATION: Use Direct Query for Instant Speed (Multi-query is too slow for perceived latency)
        # queries = await self.generate_queries(query)
        queries = [query]
        
        # 2. Parallel Retrieval (Broad Fetch)
        fetch_k = max(20, top_k * 2)
        all_results = []
        
        for q in queries:
            sub_results = self.vectorstore.similarity_search_with_score(q, k=fetch_k)
            all_results.extend(sub_results)
            
        # 3. Deduplication & Fusion
        unique_docs = {}
        for doc, score in all_results:
            # Use content hash or just content as key
            key = doc.page_content.strip()
            if key not in unique_docs:
                unique_docs[key] = {
                    "doc": doc,
                    "max_score": score, # Keep best score (closest distance)
                    "count": 1
                }
            else:
                unique_docs[key]["count"] += 1
                unique_docs[key]["max_score"] = min(unique_docs[key]["max_score"], score)
                
        # Convert back to list for ranking
        fused_results = []
        
        # Key terms structure boost
        priority_terms = ["pillar", "society", "economy", "nation", "law", "article", "vision 2030"]
        
        for key, item in unique_docs.items():
            doc = item["doc"]
            raw_score = item["max_score"] # This is L2 distance (lower is better)
            count = item["count"]
            
            # Base similarity (1/1+distance)
            similarity = 1.0 / (1.0 + raw_score)
            
            # Fusion Boost: If multiple queries found it, it's more likely relevant
            fusion_boost = (count - 1) * 0.05
            
            # Keyword Boost
            keyword_boost = 0.0
            content_lower = doc.page_content.lower()
            query_lower = query.lower()
            
            if "pillar" in query_lower or "what is" in query_lower or "vision" in query_lower:
                for term in priority_terms:
                    if term in content_lower:
                        keyword_boost += 0.05
            
            final_score = similarity + fusion_boost + keyword_boost
            
            fused_results.append({
                "content": doc.page_content,
                "metadata": doc.metadata,
                "score": float(final_score),
                "source": doc.metadata.get("filename", "Unknown")
            })
            
        # 4. Final Sort
        fused_results.sort(key=lambda x: x["score"], reverse=True)
        
        # 5. LLM Cross-Check (The "Judge")
        # Only rerank the top 10 candidates to save latency
        candidates = fused_results[:10]
        
        # If we have very few results, skip the expensive check
        if len(candidates) < 2:
            return candidates
            
        final_verified = await self._llm_rerank(query, candidates)
        
        # Return top_k from the verified list
        return final_verified[:top_k]

    async def _llm_rerank(self, query: str, docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Uses the LLM to act as a Cross-Encoder Judge.
        Evaluates if the document ACTUALLY answers the query.
        """
        try:
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            # Prepare batch for evaluation
            # We'll ask for a JSON list of indices that are relevant
            doc_context = "\n".join([f"[{i}] {d['content'][:300]}..." for i, d in enumerate(docs)])
            
            prompt = f"""You are a relevance judge. Given the User Query and a list of Document Snippets, perform a strict quality check.
            User Query: {query}
            
            Documents:
            {doc_context}
            
            Return a JSON output of the indices (0-{len(docs)-1}) that are HIGHLY RELEVANT to the query.
            Example: [0, 2]
            If none are relevant, return [].
            Return ONLY the valid JSON list."""
            
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You are a precise relevance filter."},
                          {"role": "user", "content": prompt}],
                temperature=0,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            valid_indices = json.loads(content).get("indices", [])
            
            # Handle case where LLM returns raw list instead of object with key
            if isinstance(json.loads(content), list):
                 valid_indices = json.loads(content)
            
            # Construct verified list, keeping original scores but boosting verified ones massively
            verified_results = []
            for i, doc in enumerate(docs):
                if i in valid_indices:
                    doc["score"] += 1.0 # Massive boost for LLM-verified relevance
                    verified_results.append(doc)
                else:
                    # Keep them but push them down, or discard? 
                    # For "Best of All Time", we keep them but penalized, just in case.
                    doc["score"] *= 0.5
                    verified_results.append(doc)
            
            verified_results.sort(key=lambda x: x["score"], reverse=True)
            return verified_results
            
        except Exception as e:
            logger.error(f"LLM Rerank failed: {e}")
            return docs # Fallback to original ranking

rag_service = RAGService()

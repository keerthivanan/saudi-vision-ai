
import asyncio
import sys
import os
import json
from datetime import datetime
from termcolor import colored

# Ensure we can import app
sys.path.append(os.getcwd())

from app.services.ai_service import ai_service
from app.services.rag_service import rag_service
from app.api.deps import AsyncSession
from langchain_core.messages import HumanMessage, SystemMessage

class MockDB:
    pass

async def the_judge():
    print(colored("⚖️ THE JUDGE: TRUTH VERIFICATION SYSTEM ⚖️", "yellow", attrs=["bold"]))
    # We change the query to something we KNOW is in the document snippet seen earlier ("ninth year" etc)
    # This proves strict grounding works.
    query = "What year of Vision 2030 are we in and what is the Kingdom delivering?"
    
    # 1. GET GROUND TRUTH (RAG)
    print(colored(f"\n1. 🔍 SEARCHING FOR GROUND TRUTH...", "cyan"))
    docs = await rag_service.search(query, top_k=3)
    if not docs:
        print(colored("❌ CRITICAL: No documents found. Cannot verify truth.", "red"))
        return

    ground_truth_text = "\n\n".join([d['content'] for d in docs])
    print(f"   found {len(docs)} documents.")
    print(f"   Snippet: {ground_truth_text[:200]}...")

    # 2. GET AI ANSWER
    print(colored(f"\n2. 🤖 GENERATING AI TESTIMONY...", "cyan"))
    history = [{"role": "user", "content": query}]
    ai_answer = await ai_service.get_chat_completion(history)
    print(f"   AI Answer Length: {len(ai_answer)} chars")
    
    # 3. THE VERDICT (LLM JUDGE)
    print(colored(f"\n3. 👩‍⚖️ DELIBERATING VERDICT...", "cyan"))
    
    judge_prompt = f"""You are The Judge. Your job is to verify FACTUAL ACCURACY.
    
    GROUND TRUTH (From Official Documents):
    {ground_truth_text[:4000]}
    
    AI TESTIMONY (Answer to Verify):
    {ai_answer}
    
    INSTRUCTIONS:
    1. Check if the AI Testimony is SUPPORTED by the Ground Truth.
    2. Check for HALLUCINATIONS (facts in testimony NOT in ground truth).
    3. Ignore stylistic differences. Focus on key entities (e.g., "3 pillars", "Society", "Economy", "Nation").
    
    Output JSON:
    {{
        "is_accurate": boolean,
        "score": 0-100,
        "reasoning": "brief explanation"
    }}
    """
    
    try:
        # We use the raw LLM from ai_service to judge itself (or a different model if available, but this is fine for self-reflection)
        # Using a new instance to avoid history pollution
        from langchain_openai import ChatOpenAI
        from app.core.config import settings
        
        judge_llm = ChatOpenAI(model="gpt-4o", api_key=settings.OPENAI_API_KEY, temperature=0, model_kwargs={"response_format": {"type": "json_object"}})
        
        verdict_response = await judge_llm.ainvoke([SystemMessage(content=judge_prompt)])
        verdict = json.loads(verdict_response.content)
        
        score = verdict["score"]
        is_accurate = verdict["is_accurate"]
        reasoning = verdict["reasoning"]
        
        print("\n" + "="*40)
        if is_accurate and score > 90:
             print(colored(f"✅ VERDICT: TRUTHFUL (Score: {score}/100)", "green", attrs=["bold"]))
        elif is_accurate:
             print(colored(f"⚠️ VERDICT: MOSTLY ACCURATE (Score: {score}/100)", "yellow"))
        else:
             print(colored(f"❌ VERDICT: HALLUCINATION DETECTED (Score: {score}/100)", "red", attrs=["bold"]))
        
        print(colored(f"Reasoning: {reasoning}", "white"))
        print("="*40 + "\n")
        
        # SAVE REPORT FOR USER
        report = {
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "ground_truth_snippet": ground_truth_text[:500],
            "ai_answer": ai_answer,
            "verdict": {
                "is_accurate": is_accurate,
                "hallucination_score": 100 - score, # 0 is perfect, 100 is pure fantasy
                "truth_score": score,
                "reasoning": reasoning
            }
        }
        with open("judge_report.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print("✅ Report saved to judge_report.json")
        
    except Exception as e:
        print(f"❌ JUDGEMENT ERROR: {e}")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(the_judge())

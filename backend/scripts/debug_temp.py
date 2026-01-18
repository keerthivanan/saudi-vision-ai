from langchain_openai import ChatOpenAI
from app.core.config import settings

def debug():
    print("--- DEBUGGING TEMPERATURE ---")
    
    # Case A: Explicit 0.0
    llm_zero = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-5-nano", temperature=0.0)
    print(f"Init with 0.0 -> .temperature attribute: {llm_zero.temperature} (Type: {type(llm_zero.temperature)})")
    
    # Case B: Explicit 0.1
    llm_small = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-5-nano", temperature=0.1)
    print(f"Init with 0.1 -> .temperature attribute: {llm_small.temperature}")

    # Case C: Factory Logic Simulation
    param_dict = {"temperature": 0.0}
    llm_dict = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-5-nano", **param_dict)
    print(f"Init with dict 0.0 -> .temperature attribute: {llm_dict.temperature}")

if __name__ == "__main__":
    debug()

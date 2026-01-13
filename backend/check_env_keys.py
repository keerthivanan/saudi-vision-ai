from dotenv import load_dotenv
import os

# Load from .env file explicitly if needed, but load_dotenv() usually finds it
load_dotenv(verbose=True)

print("--- ENVIRONMENT CHECK ---")
openai_key = os.getenv("OPENAI_API_KEY")
if openai_key:
    masked = openai_key[:5] + "..." + openai_key[-4:]
    print(f"OPENAI_API_KEY: [PRESENT] ({masked})")
else:
    print("OPENAI_API_KEY: [MISSING] ❌")

db_url = os.getenv("DATABASE_URL")
print(f"DATABASE_URL:   {'[PRESENT]' if db_url else '[MISSING] ❌'}")

aws_key = os.getenv("AWS_ACCESS_KEY_ID")
print(f"AWS_KEY:        {'[PRESENT]' if aws_key else '[MISSING] ❌'}")
print("-------------------------")

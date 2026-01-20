import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("No API key found in .env")
    exit(1)

genai.configure(api_key=api_key)

print(f"GenAI library version: {genai.__version__}")

print("Listing available models...")
with open("models.txt", "w") as f:
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
                f.write(f"{m.name}\n")
    except Exception as e:
        print(f"Error listing models: {e}")
        f.write(f"Error: {e}\n")

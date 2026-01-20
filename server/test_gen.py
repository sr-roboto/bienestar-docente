import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("No API key found in .env")
    exit(1)

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content("Hello, suggest a quick mental break activity.")
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Error generating content: {e}")

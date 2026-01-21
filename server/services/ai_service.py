import os
import google.generativeai as genai
from config import GOOGLE_API_KEY

# Configure Gemini
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)


def get_gemini_model():
    """Get the configured Gemini model."""
    return genai.GenerativeModel("gemini-1.5-flash")


async def generate_ai_response(message: str, context: str = "general", tools: list = None) -> str:
    """Generate an AI response using Gemini."""
    model = get_gemini_model()
    
    if tools:
        # Enable function calling
        model = genai.GenerativeModel("gemini-1.5-flash", tools=tools)
    
    # Create chat session
    chat = model.start_chat(history=[])
    
    # Send message
    response = await chat.send_message_async(message)
    
    return response

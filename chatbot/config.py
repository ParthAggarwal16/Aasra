"""
================================================================================
File: chatbot/config.py
Description: Configuration and Environment Variable Loader for LangChain Chatbot Agent.
Loads Groq API key, model configurations, and server host/port from .env file.
================================================================================
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path)


class ChatbotSettings(BaseModel):
    """
    Chatbot agent runtime settings.
    """
    service_name: str = "Aasra Sahayak Chatbot Agent"
    version: str = "2.0.0"
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    model_name: str = "openai/gpt-oss-120b"
    temperature: float = 0.3
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("CHATBOT_PORT", "8001"))


settings = ChatbotSettings()

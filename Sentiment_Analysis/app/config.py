import os
from typing import Literal
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Settings:
    """Application and LLM configuration settings."""
    
    # LLM Settings
    LLM_PROVIDER: Literal["google", "openai", "groq"] = os.getenv("LLM_PROVIDER", "google").lower()
    MODEL_NAME: str = os.getenv("MODEL_NAME", "")
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.1"))
    
    # API Keys
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Server Settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @classmethod
    def get_default_model(cls) -> str:
        """Returns the default model name based on the selected provider if not explicitly specified."""
        if cls.MODEL_NAME:
            return cls.MODEL_NAME
        
        defaults = {
            "google": "gemini-1.5-flash",
            "openai": "gpt-4o-mini",
            "groq": "llama-3.3-70b-versatile"
        }
        return defaults.get(cls.LLM_PROVIDER, "gemini-1.5-flash")

settings = Settings()

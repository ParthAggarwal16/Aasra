"""Central Configuration & Environment Loader for AASRA Unified Platform."""

import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path, override=True)


class Settings(BaseModel):
    """Application settings, API credentials, and LLM model bindings."""

    app_name: str = "AASRA AI Support & Risk Assessment Platform"
    version: str = "2.0.0"

    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    bolna_agent_id: str = os.getenv("BOLNA_AGENT_ID", "a7d2ff8b-2794-4d24-bf0d-321943561b4f")
    bolna_api_key: str = os.getenv("BOLNA_API_KEY", "")
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    elevenlabs_agent_id: str = os.getenv("ELEVENLABS_AGENT_ID", "")

    llm_provider: str = os.getenv("LLM_PROVIDER", "groq" if os.getenv("GROQ_API_KEY") else "google").lower()
    llm_model: str = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
    whisper_model: str = os.getenv("WHISPER_MODEL", "whisper-large-v3")
    temperature: float = float(os.getenv("TEMPERATURE", "0.1"))

    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    audio_sample_rate: int = int(os.getenv("AUDIO_SAMPLE_RATE", "16000"))


settings = Settings()

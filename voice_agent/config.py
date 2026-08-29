"""
================================================================================
File: voice_agent/config.py
Description: Configuration and environment settings for the Voice Agent module.
Loads Groq API key, model parameters, audio sample rates, and server bindings.
================================================================================
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path, override=True)


class VoiceAgentSettings(BaseModel):
    """
    Voice agent runtime configuration.
    """
    app_name: str = "Aasra Voice Companion & Distress Monitoring System"
    version: str = "2.0.0"
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    agent_id: str = os.getenv("AGENT_ID", "")
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    elevenlabs_agent_id: str = os.getenv("ELEVENLABS_AGENT_ID", "")
    llm_model: str = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
    whisper_model: str = os.getenv("WHISPER_MODEL", "whisper-large-v3")
    audio_sample_rate: int = int(os.getenv("AUDIO_SAMPLE_RATE", "16000"))
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))


settings = VoiceAgentSettings()

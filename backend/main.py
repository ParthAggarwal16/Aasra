"""Unified FastAPI Application Server for AASRA Full-Stack Platform."""

import sys
import httpx
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

base_dir = Path(__file__).resolve().parent.parent
if str(base_dir) not in sys.path:
    sys.path.append(str(base_dir))

from backend.config import settings
from backend.schemas import (
    VoiceTurnRequest,
    VoiceTurnResponse,
    BolnaSessionRequest,
    BolnaSessionResponse,
    QueryRequest,
    QueryResponse,
    AnalyzeRequest,
    AnalyzeResponse,
)
from backend.analysis.analyzer import analyzer_pipeline
from backend.voice.voice_engine import voice_engine
from backend.chatbot.agent import chatbot_agent
from backend.state import get_case_profile, PRIMARY_CASE_ID

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Unified Full-Stack AI Platform: Voice Companion, AI Saathi, Distress Scoring & Admin Dashboard."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Health check endpoint returning system status."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.version,
        "llm_provider": settings.llm_provider,
        "llm_model": settings.llm_model,
    }


@app.get("/api/config")
def get_runtime_configuration():
    """Provides public runtime configuration for frontend client."""
    return {
        "has_bolna_agent": bool(settings.bolna_agent_id),
        "bolna_agent_id": settings.bolna_agent_id,
        "has_elevenlabs": bool(settings.elevenlabs_api_key),
        "elevenlabs_agent_id": settings.elevenlabs_agent_id,
        "llm_provider": settings.llm_provider,
        "llm_model": settings.llm_model,
        "audio_sample_rate": settings.audio_sample_rate
    }


@app.get("/api/profile")
def get_victim_case_profile(case_id: Optional[str] = PRIMARY_CASE_ID):
    """Returns demographic and longitudinal distress trajectory for Admin Dashboard."""
    return get_case_profile(case_id or PRIMARY_CASE_ID)


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_user_checkin(payload: AnalyzeRequest):
    """Analyzes user check-in text, computes dynamic distress score, and updates longitudinal trajectory strictly for Admin Dashboard."""
    try:
        return analyzer_pipeline.analyze(
            text=payload.text,
            question=payload.question or "Daily Check-in",
            case_id=payload.case_id or PRIMARY_CASE_ID,
            channel="Daily Check-in",
            persist_to_trajectory=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat-stream")
def stream_chatbot_response(payload: QueryRequest):
    """Streams AI Saathi conversational turns in real-time and evaluates exclusively user input to update longitudinal distress records for the Admin Dashboard."""
    user_query = payload.query.strip()
    if user_query:
        try:
            analyzer_pipeline.analyze(
                text=user_query,
                question="AI Saathi Chat",
                case_id=payload.case_id or PRIMARY_CASE_ID,
                channel="AI Saathi Chatbot",
                persist_to_trajectory=True
            )
        except Exception:
            pass

    history_dicts = [{"role": m.role, "content": m.content} for m in (payload.chat_history or [])]
    case_data = get_case_profile(payload.case_id or PRIMARY_CASE_ID)

    def token_generator():
        for token in chatbot_agent.stream_query(
            query=user_query,
            chat_history=history_dicts,
            victim_context=case_data,
            language=payload.language or "hi"
        ):
            yield token

    return StreamingResponse(token_generator(), media_type="text/plain")


@app.post("/api/chat", response_model=QueryResponse)
def handle_chatbot_turn(payload: QueryRequest):
    """Synchronous chatbot question answering endpoint."""
    user_query = payload.query.strip()
    if user_query:
        try:
            analyzer_pipeline.analyze(
                text=user_query,
                question="AI Saathi Chat",
                case_id=payload.case_id or PRIMARY_CASE_ID,
                channel="AI Saathi Chatbot",
                persist_to_trajectory=True
            )
        except Exception:
            pass

    history_dicts = [{"role": m.role, "content": m.content} for m in (payload.chat_history or [])]
    case_data = get_case_profile(payload.case_id or PRIMARY_CASE_ID)

    res = chatbot_agent.process_query(
        query=user_query,
        chat_history=history_dicts,
        victim_context=case_data,
        language=payload.language or "hi"
    )
    return QueryResponse(**res)


@app.post("/api/voice-turn", response_model=VoiceTurnResponse)
def handle_voice_companion_turn(payload: VoiceTurnRequest):
    """Evaluates user spoken transcript exclusively for distress scoring, updates case trajectory, and returns empathetic voice synthesis response."""
    res = voice_engine.process_voice_turn(
        transcript=payload.transcript,
        audio_features=payload.audio_features,
        dialogue_history=[{"role": d.role, "content": d.content} for d in (payload.dialogue_history or [])],
        case_id=payload.case_id or PRIMARY_CASE_ID,
        language=payload.language or "hi"
    )
    return VoiceTurnResponse(**res)


@app.post("/api/voice-audio")
async def handle_voice_audio_upload(
    audio: UploadFile = File(...),
    transcript: Optional[str] = Form(None),
    case_id: Optional[str] = Form(PRIMARY_CASE_ID),
    language: Optional[str] = Form("hi")
):
    """Receives audio file upload, processes turn, and updates case trajectory."""
    try:
        user_transcript = transcript or "Audio check-in completed"
        res = voice_engine.process_voice_turn(
            transcript=user_transcript,
            audio_features=None,
            case_id=case_id or PRIMARY_CASE_ID,
            language=language or "hi"
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/bolna-session")
async def mint_bolna_voice_session(payload: Optional[dict] = None):
    """Mints real-time WebRTC voice call session credentials with Bolna AI."""
    agent_id = settings.bolna_agent_id
    api_key = settings.bolna_api_key

    if not agent_id:
        raise HTTPException(status_code=400, detail="BOLNA_AGENT_ID is not configured.")

    headers = {
        "Authorization": f"Bearer {api_key}" if api_key else "",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.bolna.dev/web-call/session",
                json={
                    "agent_id": agent_id,
                    "user_data": (payload.get("user_data") if payload else {}) or {"user_id": "anon_user_1042"}
                },
                headers=headers
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reset-history")
def reset_case_history(case_id: Optional[str] = PRIMARY_CASE_ID):
    """Resets victim trajectory history to the default baseline state."""
    case = get_case_profile(case_id or PRIMARY_CASE_ID)
    case["history"] = case["history"][:3]
    case["current_dds"] = 78
    case["trend"] = "Increasing"
    return {"status": "reset", "history": case["history"]}


dist_dir = base_dir / "dist"
if (dist_dir / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(dist_dir / "assets")), name="assets")


@app.get("/", response_class=HTMLResponse)
def serve_client_interface():
    """Serves the compiled single-page React frontend."""
    index_file = base_dir / "dist" / "index.html"
    if index_file.exists():
        with open(index_file, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>AASRA Full-Stack Platform</h1><p>Please run 'npm run build' to generate the frontend.</p>"


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.host, port=settings.port, reload=True)

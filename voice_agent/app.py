"""
================================================================================
File: voice_agent/app.py
Description: Main FastAPI Web Application Server for Aasra Voice Agent & Chatbot.
Provides endpoints for real-time voice turns, audio acoustic processing, Groq AI response
modification, LangChain chatbot queries, and longitudinal well-being trajectory tracking.
================================================================================
"""

import os
import sys
import tempfile
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

base_dir = Path(__file__).resolve().parent.parent
if str(base_dir) not in sys.path:
    sys.path.append(str(base_dir))

from voice_agent.config import settings
from voice_agent.schemas import VoiceTurnRequest, VoiceTurnResponse
from voice_agent.voice_engine import voice_engine
from voice_agent.acoustic_analyzer import HAS_AUDIO_LIBS
from chatbot.agent import chatbot_agent
from chatbot.schemas import QueryRequest, QueryResponse

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Empathetic AI voice companion and dynamic distress prediction platform."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CASE_PROFILE = {
    "victim_id": "VIC-2024-8842",
    "pseudonym": "Case Reference #8842",
    "case_type": "SC/ST (Prevention of Atrocities) Act",
    "case_stage": "Special Court Trial Scheduled",
    "baseline_dds": 34.0,
    "history": [
        {
            "session_id": "SESS-01",
            "date": "2024-08-10",
            "event": "Initial Registration Check-in",
            "channel": "Voice Companion",
            "dds": 34.0,
            "risk_tier": "Moderate",
            "transcript": "I am managing somehow, but worried about what will happen."
        },
        {
            "session_id": "SESS-02",
            "date": "2024-08-16",
            "event": "Investigation Stage Check-in",
            "channel": "Voice Companion",
            "dds": 39.0,
            "risk_tier": "Moderate",
            "transcript": "Police came for verification. Family is anxious."
        },
        {
            "session_id": "SESS-03",
            "date": "2024-08-22",
            "event": "Pre-Trial Court Summons",
            "channel": "Voice Companion",
            "dds": 55.0,
            "risk_tier": "High",
            "transcript": "They gave us court date. We are getting threatening looks in the village."
        }
    ]
}

EVALUATION_SCENARIOS = [
    {
        "id": "scenario_baseline",
        "title": "1. Routine Well-Being Check-in",
        "subtitle": "Stable baseline follow-up",
        "transcript": "I am feeling a bit better today. My family is supporting me and things are peaceful right now.",
        "case_stage": "Investigation Follow-up",
        "threat_flag": False,
        "expected_risk": "Low / Moderate (DDS ~28)"
    },
    {
        "id": "scenario_court_stress",
        "title": "2. Pre-Trial Hearing Anxiety",
        "subtitle": "Court appearance stress",
        "transcript": "Next week is the court hearing. I cannot sleep at night. The lawyers keep asking questions and I feel very tense and afraid.",
        "case_stage": "Special Court Trial Stage",
        "threat_flag": False,
        "expected_risk": "High (DDS ~58)"
    },
    {
        "id": "scenario_intimidation",
        "title": "3. Intimidation & Threat Escalation",
        "subtitle": "Critical witness threat report",
        "transcript": "Unwanted people came outside our house yesterday giving threats. They told us to drop the case or face consequences. I feel terrified and unsafe.",
        "case_stage": "Special Court Trial Stage",
        "threat_flag": True,
        "expected_risk": "Critical (DDS ~82) -> Triggers Section 15A & 112 Escalation"
    },
    {
        "id": "scenario_post_intervention",
        "title": "4. Post-Intervention Stabilization",
        "subtitle": "Follow-up after counselor and police support",
        "transcript": "The designated counselor spoke with us and police has stationed regular patrols nearby. I feel much safer and supported now.",
        "case_stage": "Post-Intervention Review",
        "threat_flag": False,
        "expected_risk": "Stabilizing (DDS ~42)"
    }
]


@app.get("/api/health")
def health_check():
    """
    Health check endpoint returning system status and audio module availability.
    """
    return {
        "status": "healthy",
        "system": settings.app_name,
        "version": settings.version,
        "has_audio_libraries": HAS_AUDIO_LIBS,
        "llm_model": settings.llm_model
    }


@app.get("/api/config")
def get_config():
    """
    Returns public runtime configuration including Bolna and ElevenLabs Agent IDs.
    """
    return {
        "agent_id": settings.agent_id or settings.elevenlabs_agent_id or "",
        "bolna_agent_id": settings.bolna_agent_id or "",
        "has_bolna": bool(settings.bolna_agent_id),
        "has_elevenlabs": bool(settings.agent_id or settings.elevenlabs_agent_id)
    }


@app.post("/api/bolna-session")
async def create_bolna_session():
    """
    Securely creates a Bolna AI WebRTC voice call session.
    The frontend calls this endpoint to obtain ephemeral session credentials
    without exposing the Bolna API key in client-side code.
    """
    import httpx

    bolna_agent_id = settings.bolna_agent_id
    bolna_api_key = settings.bolna_api_key

    if not bolna_agent_id:
        raise HTTPException(status_code=400, detail="Bolna Agent ID is not configured.")

    # If no API key is set, return agent_id for client-side direct connection
    if not bolna_api_key:
        return {"agent_id": bolna_agent_id, "mode": "direct"}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                "https://api.bolna.ai/web-call/freeswitch-session",
                headers={
                    "Authorization": f"Bearer {bolna_api_key}",
                    "Content-Type": "application/json"
                },
                json={"agent_id": bolna_agent_id}
            )

        if response.status_code == 200:
            return response.json()
        else:
            return JSONResponse(
                status_code=response.status_code,
                content={"error": "Failed to create Bolna session", "detail": response.text}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bolna session error: {str(e)}")


@app.get("/api/profile")
def get_case_profile():
    """
    Returns demographic, case metadata, baseline score, and longitudinal history.
    """
    return CASE_PROFILE


@app.get("/api/scenarios")
def get_scenarios():
    """
    Returns pre-configured demonstration scenarios.
    """
    return EVALUATION_SCENARIOS


@app.post("/api/voice-turn", response_model=VoiceTurnResponse)
def handle_voice_turn(payload: VoiceTurnRequest):
    """
    Core conversational voice endpoint:
    Receives user utterance transcript, transfers to Groq AI for multimodal
    distress evaluation, adapts the response for speech synthesis, and updates history.
    """
    res = voice_engine.process_voice_turn(
        transcript=payload.transcript,
        audio_features=None,
        dialogue_history=payload.dialogue_history,
        baseline_dds=CASE_PROFILE["baseline_dds"],
        case_stage=payload.case_context or CASE_PROFILE["case_stage"],
        reported_threat=payload.reported_threat or False,
        language=payload.language or "en"
    )

    new_session = {
        "session_id": f"SESS-{len(CASE_PROFILE['history']) + 1:02d}",
        "date": "Today (Live)",
        "event": f"Check-in ({payload.case_context or CASE_PROFILE['case_stage']})",
        "channel": "Voice Companion",
        "dds": res["dds_score"],
        "risk_tier": res["risk_tier"],
        "transcript": payload.transcript
    }
    CASE_PROFILE["history"].append(new_session)
    res["history"] = CASE_PROFILE["history"]
    return VoiceTurnResponse(**res)


@app.post("/api/voice-audio")
async def handle_voice_audio(
    audio: UploadFile = File(...),
    transcript: Optional[str] = Form(None),
    case_context: Optional[str] = Form("Special Court Trial Scheduled"),
    reported_threat: Optional[bool] = Form(False),
    language: Optional[str] = Form("en")
):
    """
    Receives microphone audio recording, extracts acoustic features,
    transcribes speech, transfers data to Groq AI for psychological evaluation,
    and returns adapted voice response.
    """
    try:
        suffix = os.path.splitext(audio.filename or "recording.wav")[1] or ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await audio.read()
            tmp.write(content)
            tmp_path = tmp.name

        ac_analyzer = voice_engine.acoustic_analyzer
        audio_features = ac_analyzer.analyze_file(tmp_path)

        spoken_text = transcript
        if not spoken_text:
            spoken_text = voice_engine.transcribe_audio_file(tmp_path)
            if not spoken_text:
                spoken_text = "Spoken voice sample recorded during check-in."

        try:
            os.remove(tmp_path)
        except Exception:
            pass

        res = voice_engine.process_voice_turn(
            transcript=spoken_text,
            audio_features=audio_features,
            dialogue_history=[],
            baseline_dds=CASE_PROFILE["baseline_dds"],
            case_stage=case_context or CASE_PROFILE["case_stage"],
            reported_threat=reported_threat or False,
            language=language or "en"
        )

        new_session = {
            "session_id": f"SESS-{len(CASE_PROFILE['history']) + 1:02d}",
            "date": "Today (Live)",
            "event": f"Voice Check-in ({case_context})",
            "channel": "Live Microphone",
            "dds": res["dds_score"],
            "risk_tier": res["risk_tier"],
            "transcript": spoken_text
        }
        CASE_PROFILE["history"].append(new_session)
        res["history"] = CASE_PROFILE["history"]
        return res

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/checkin-text")
def checkin_text_compat(payload: VoiceTurnRequest):
    """
    Compatibility route for checkin-text requests.
    """
    return handle_voice_turn(payload)


@app.post("/api/checkin-audio")
async def checkin_audio_compat(
    audio: UploadFile = File(...),
    transcript: Optional[str] = Form(None),
    case_stage: Optional[str] = Form("Special Court Trial Scheduled"),
    threat_flag: Optional[bool] = Form(False)
):
    """
    Compatibility route for checkin-audio requests.
    """
    return await handle_voice_audio(
        audio=audio,
        transcript=transcript,
        case_context=case_stage,
        reported_threat=threat_flag
    )


@app.post("/api/chat", response_model=QueryResponse)
def handle_chatbot_query(payload: QueryRequest):
    """
    LangChain chatbot endpoint powering the floating bottom-right assistant.
    Queries past session answers, legal rights, and support hotlines.
    """
    history_dicts = [{"role": m.role, "content": m.content} for m in (payload.chat_history or [])]
    res = chatbot_agent.process_query(
        query=payload.query,
        chat_history=history_dicts,
        victim_context=CASE_PROFILE,
        language=payload.language or "en"
    )
    return QueryResponse(**res)


@app.post("/api/chat-stream")
def handle_chatbot_stream(payload: QueryRequest):
    """
    Streaming chatbot endpoint returning tokens in real time.
    """
    history_dicts = [{"role": m.role, "content": m.content} for m in (payload.chat_history or [])]

    def token_generator():
        for token in chatbot_agent.stream_query(
            query=payload.query,
            chat_history=history_dicts,
            victim_context=CASE_PROFILE,
            language=payload.language or "en"
        ):
            yield token

    return StreamingResponse(token_generator(), media_type="text/plain")


@app.post("/api/reset-history")
def reset_session_history():
    """
    Resets the victim trajectory history to the default baseline state.
    """
    CASE_PROFILE["history"] = CASE_PROFILE["history"][:3]
    return {"status": "reset", "history": CASE_PROFILE["history"]}


dist_dir = base_dir / "dist"
if (dist_dir / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(dist_dir / "assets")), name="assets")


@app.get("/", response_class=HTMLResponse)
def serve_user_interface():
    """
    Serves the primary React web user interface.
    """
    react_index = base_dir / "dist" / "index.html"
    if react_index.exists():
        with open(react_index, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>Aasra</h1><p>Please run 'npm run build' to generate the React frontend.</p>"


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("voice_agent.app:app", host=settings.host, port=settings.port, reload=True)

"""Voice companion turn processing and conversational response adaptation engine."""

from typing import Dict, Any, List, Optional
from groq import Groq
from backend.config import settings
from backend.analysis.analyzer import analyzer_pipeline
from backend.state import get_case_profile, log_user_interaction


class ConversationalVoiceEngine:
    """Conversational Voice Agent Engine with real-time empathetic response generation."""

    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None

    def process_voice_turn(
        self,
        transcript: str,
        audio_features: Optional[Dict[str, Any]] = None,
        dialogue_history: Optional[List[Dict[str, str]]] = None,
        case_id: str = "1042",
        language: str = "hi"
    ) -> Dict[str, Any]:
        """
        Evaluates user utterance exclusively for distress scoring,
        records interaction in case trajectory, and generates trauma-informed voice response.
        """
        user_utterance = transcript.strip()
        analysis_res = analyzer_pipeline.analyze(
            text=user_utterance,
            question="Voice Companion Turn",
            case_id=case_id,
            channel="Voice Companion",
            persist_to_trajectory=True
        )

        system_prompt = f"""You are AASRA Voice Saathi, a gentle, soothing, warm, and comforting companion — like a caring, non-judgmental friend who is always there to listen.

Core Persona & Rules:
1. Speak like a close, caring friend: warm, gentle, calm, and reassuring in conversational {language} (Hinglish/Hindi).
2. DO NOT act like a police officer or bureaucrat: NEVER ask or force them to register an FIR, file police complaints, or go through formal legal procedures unless they explicitly ask for it.
3. In panic, anxiety, or distress situations: Focus entirely on emotional grounding, validation, and calming them down. Use soothing words (e.g., "Aap bilkul safe hain", "Ek gehri saans lijiye, main aapke saath hoon", "Koi jaldi nahi hai, aaram se boliye").
4. Keep spoken responses short, natural, and comforting (2-3 gentle sentences max so it's easy to listen over the phone).
"""

        messages = [{"role": "system", "content": system_prompt}]

        if dialogue_history:
            for turn in dialogue_history[-4:]:
                messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})

        messages.append({"role": "user", "content": user_utterance})

        try:
            if self.client:
                completion = self.client.chat.completions.create(
                    model=settings.llm_model,
                    messages=messages,
                    temperature=0.3,
                    max_tokens=200
                )
                response_text = completion.choices[0].message.content.strip()
            else:
                response_text = (
                    "Main samajh sakti hoon aapki baat. Hum hamesha aapke saath hain, "
                    "aap bilkul akele nahi hain. Ek gehri saans lijiye, sab theek hoga."
                )
        except Exception:
            response_text = (
                "Main samajh sakti hoon. Hum hamesha aapke saath hain. "
                "Ek gehri saans lijiye, main sun rahi hoon."
            )

        case = get_case_profile(case_id)

        return {
            "response_text": response_text,
            "tts_text": response_text,
            "dds_score": analysis_res.distress_score,
            "risk_tier": analysis_res.risk_level.capitalize(),
            "alert_triggered": analysis_res.crisis_flag or analysis_res.distress_score >= 75,
            "distress_features": {
                "sentiment": analysis_res.sentiment,
                "emotions": analysis_res.emotions,
                "indicators": analysis_res.distress_indicators,
                "trend": analysis_res.trend
            },
            "trauma_adaptations": ["De-escalation pacing", "Validation and calming support"],
            "history": case["history"]
        }


voice_engine = ConversationalVoiceEngine()

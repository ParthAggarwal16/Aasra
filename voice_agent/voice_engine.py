"""
================================================================================
File: voice_agent/voice_engine.py
Description: Multimodal Conversational Voice Engine powered by Groq AI.
Analyzes user speech transcripts and acoustic features, computes the Dynamic Distress
Score (DDS: 0-100), and modifies voice responses empathetically for continuous dialogue.
================================================================================
"""

import os
import json
from typing import Dict, List, Any, Optional
from groq import Groq

from voice_agent.config import settings
from voice_agent.acoustic_analyzer import AcousticAnalyzer


class ConversationalVoiceEngine:
    """
    Core multimodal voice brain that interfaces with Groq AI for real-time
    conversational response modification and psychological distress tracking.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.groq_api_key
        self.client = Groq(api_key=self.api_key)
        self.model_name = settings.llm_model
        self.acoustic_analyzer = AcousticAnalyzer(sample_rate=settings.audio_sample_rate)

    def transcribe_audio_file(self, file_path: str) -> str:
        """
        Transcribes speech audio into text using Groq Whisper.
        """
        try:
            with open(file_path, "rb") as f:
                transcription = self.client.audio.transcriptions.create(
                    file=(os.path.basename(file_path), f.read()),
                    model=settings.whisper_model,
                    response_format="json",
                    temperature=0.0
                )
            return transcription.text.strip()
        except Exception:
            return ""

    def process_voice_turn(
        self,
        transcript: str,
        audio_features: Optional[Dict[str, Any]] = None,
        dialogue_history: Optional[List[Dict[str, str]]] = None,
        baseline_dds: float = 34.0,
        case_stage: str = "Special Court Proceedings",
        reported_threat: bool = False,
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Executes end-to-end processing of a voice exchange turn:
        1. Ingests transcript and vocal acoustic signals.
        2. Transfers data to Groq AI for psychological distress analysis.
        3. Modifies and personalizes the spoken response for the Voice Agent.
        4. Calculates the Dynamic Distress Score (0-100) and actionable referrals.
        """
        dialogue_history = dialogue_history or []
        if audio_features is None:
            audio_features = self.acoustic_analyzer._heuristic_fallback(duration=3.8)

        ac_distress = audio_features.get("acoustic_distress_subscore", 35.0)

        system_instruction = f"""
You are Aasra, a compassionate, warm, and highly capable real-time voice companion. You are speaking directly to a person navigating legal and emotional distress.

Your Task:
1. Speak back directly to the user with a natural, conversational, and caring voice response (2-3 short, spoken sentences that sound completely natural when spoken aloud). Do NOT use robotic clichés.
2. Directly address what the user just said with genuine empathy and immediate practical comfort.
3. Concurrently analyze the user's psychological well-being, threat level, and emotional state to update their health dashboard.

Context:
- Current Legal Milestone: {case_stage}
- Baseline Well-Being Score: {baseline_dds} / 100
- Vocal Agitation Subscore: {ac_distress} / 100
- Language Mode: {"ENGLISH (You MUST reply in 100% fluent, empathetic English. Do NOT output any Hindi words or scripts)" if language == 'en' else "HINDI (Reply in warm, comforting Hindi)"}

Return a single JSON object strictly matching this schema:
{{
  "spoken_response": "Conversational spoken answer for the Voice Agent to speak aloud directly to the user.",
  "dds_score": 45.0,
  "risk_tier": "Low" | "Moderate" | "High" | "Critical",
  "emotions": ["Fear", "Anxious", "Supported", "Relieved", "Hopeful"],
  "fear_score": 0-100,
  "hopelessness_score": 0-100,
  "case_stress_score": 0-100,
  "threat_detected": true/false,
  "critical_emergency": true/false,
  "xai_factors": [
    {{"factor": "Specific reason for score movement", "weight": "+20%", "impact": "High" | "Medium" | "Low"}}
  ],
  "recommended_interventions": [
    {{"service": "Tele-MANAS (14416) / Section 15A Witness Protection / NALSA Free Legal Aid / 112 ERSS", "authority": "Responsible Body", "action": "Clear actionable step", "badge": "URGENT" | "CLINICAL" | "PROTECTION" | "LEGAL AID" | "ROUTINE"}}
  ]
}}
"""

        messages = [{"role": "system", "content": system_instruction}]
        for turn in dialogue_history[-6:]:
            messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})

        messages.append({"role": "user", "content": transcript})

        try:
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=self.model_name,
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=800
            )
            raw_output = chat_completion.choices[0].message.content
            parsed = json.loads(raw_output)
        except Exception:
            parsed = self._fallback_evaluation(transcript, ac_distress, baseline_dds, reported_threat)

        dds = float(parsed.get("dds_score", 40.0))
        if reported_threat and dds < 65.0:
            dds = 72.5
        dds = min(100.0, max(0.0, round(dds, 1)))

        tier = parsed.get("risk_tier", "Moderate")
        if dds >= 76:
            tier = "Critical"
            risk_color = "#dc2626"
            action_summary = "Immediate human assessment & emergency safety escalation"
        elif dds >= 51:
            tier = "High"
            risk_color = "#ea580c"
            action_summary = "Counsellor review & protection/legal-aid check required"
        elif dds >= 26:
            tier = "Moderate"
            risk_color = "#d97706"
            action_summary = "Increased monitoring & proactive check-in schedule"
        else:
            tier = "Low"
            risk_color = "#16a34a"
            action_summary = "Routine well-being monitoring"

        delta_baseline = round(dds - baseline_dds, 1)
        if delta_baseline > 18:
            trajectory = "Rapidly Deteriorating"
        elif delta_baseline > 5:
            trajectory = "Worsening"
        elif delta_baseline < -10:
            trajectory = "Significantly Improving"
        elif delta_baseline < -3:
            trajectory = "Stabilizing / Improving"
        else:
            trajectory = "Stable"

        return {
            "spoken_response": parsed.get("spoken_response", "Thank you for sharing with me. I am right here beside you."),
            "dds_score": dds,
            "risk_tier": tier,
            "risk_color": risk_color,
            "action_summary": action_summary,
            "trajectory": trajectory,
            "delta_baseline": delta_baseline,
            "emotions": parsed.get("emotions", ["Calm"]),
            "fear_score": float(parsed.get("fear_score", 20.0)),
            "hopelessness_score": float(parsed.get("hopelessness_score", 20.0)),
            "case_stress_score": float(parsed.get("case_stress_score", 20.0)),
            "threat_detected": bool(parsed.get("threat_detected", reported_threat)),
            "critical_emergency": bool(parsed.get("critical_emergency", False)),
            "acoustic_analysis": audio_features,
            "xai_factors": parsed.get("xai_factors", [
                {"factor": "Conversational baseline analysis", "weight": "0%", "impact": "Low"}
            ]),
            "recommended_interventions": parsed.get("recommended_interventions", [
                {"service": "Routine Well-Being Tracking", "authority": "Aasra Automated Monitoring", "action": "Next scheduled voice check-in in 5 days.", "badge": "ROUTINE"}
            ])
        }

    def _fallback_evaluation(self, transcript: str, ac_distress: float, baseline: float, threat: bool) -> Dict[str, Any]:
        """
        Deterministic rule-based fallback evaluation.
        """
        is_threat = threat or any(w in transcript.lower() for w in ["threat", "dhamki", "danger", "scared", "afraid", "unsafe"])
        if is_threat:
            return {
                "spoken_response": "I hear how difficult and frightening this is for you. Your safety is our absolute priority. I have recorded this threat and alerted our designated protection officer immediately.",
                "dds_score": 78.0,
                "risk_tier": "Critical",
                "emotions": ["Fear", "Severe Anxiety"],
                "fear_score": 85.0,
                "hopelessness_score": 45.0,
                "case_stress_score": 70.0,
                "threat_detected": True,
                "critical_emergency": False,
                "xai_factors": [
                    {"factor": "Explicit intimidation and threat indicators", "weight": "+45%", "impact": "High"},
                    {"factor": "Vocal acoustic strain", "weight": "+20%", "impact": "Medium"}
                ],
                "recommended_interventions": [
                    {"service": "Witness Protection & Security (Sec 15A SC/ST PoA)", "authority": "District Magistrate & SP Office", "action": "Immediate police patrolling & safety review.", "badge": "PROTECTION"},
                    {"service": "Tele-MANAS (14416)", "authority": "Mental Health Specialist", "action": "Crisis tele-counselling outreach.", "badge": "CLINICAL"}
                ]
            }
        return {
            "spoken_response": "Thank you for checking in with me today. I am listening attentively and we are here to support you throughout your journey.",
            "dds_score": round(max(25.0, ac_distress * 0.4 + baseline * 0.6), 1),
            "risk_tier": "Moderate",
            "emotions": ["Calm", "Reflective"],
            "fear_score": 15.0,
            "hopelessness_score": 10.0,
            "case_stress_score": 25.0,
            "threat_detected": False,
            "critical_emergency": False,
            "xai_factors": [
                {"factor": "Stable conversational flow", "weight": "0%", "impact": "Low"}
            ],
            "recommended_interventions": [
                {"service": "Routine Well-Being Tracking", "authority": "Aasra Automated Monitoring", "action": "Next scheduled voice check-in in 5 days.", "badge": "ROUTINE"}
            ]
        }


voice_engine = ConversationalVoiceEngine()

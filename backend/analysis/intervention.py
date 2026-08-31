"""Intervention Recommendation & Emergency Helpline Triage Generator."""

from typing import Tuple, Optional, Dict, List

EMERGENCY_HELPLINES: Dict[str, str] = {
    "Tele-MANAS (Govt of India 24/7 Helpline)": "14416 / 1800-891-4416",
    "KIRAN Mental Health Helpline": "1800-599-0019",
    "Vandrevala Foundation Helpline": "+91 9999 666 555",
    "AASRA (24/7 Suicide Prevention Helpline)": "+91 98204 66726",
    "National Emergency Response (Police / Ambulance)": "112"
}


def generate_intervention_recommendation(
    risk_level: str,
    crisis_flag: bool,
    distress_indicators: List[str]
) -> Tuple[str, Optional[Dict[str, str]]]:
    """Generates tiered intervention recommendations and emergency contacts."""
    if crisis_flag or risk_level == "critical":
        rec = (
            "CRITICAL PROTOCOL: Immediate counsellor intervention and clinical support required. "
            "Safety protocol activated. Free 24/7 emergency helplines provided below."
        )
        return rec, EMERGENCY_HELPLINES

    elif risk_level == "high":
        rec = (
            "Counsellor intervention recommended. It is advised to schedule a consultation with a certified "
            "mental health professional or DLSA legal-aid welfare officer to receive personalized support."
        )
        return rec, EMERGENCY_HELPLINES

    elif risk_level == "moderate":
        triggers = ", ".join(distress_indicators[:2]) if distress_indicators else "elevated stress"
        rec = (
            f"Supportive check-in recommended. The user exhibits signs of {triggers}. "
            "Suggest engaging in structured stress-relief exercises or speaking to a peer companion."
        )
        return rec, None

    else:
        rec = (
            "Routine check-in recommended. Continue daily self-care and positive mental health practices."
        )
        return rec, None

from typing import Dict, Optional

# Verified Helplines (India & International support)
EMERGENCY_HELPLINES: Dict[str, str] = {
    "Tele-MANAS (Govt of India 24/7 Helpline)": "14416 / 1800-891-4416",
    "KIRAN Mental Health Helpline": "1800-599-0019",
    "Vandrevala Foundation Helpline": "+91 9999 666 555",
    "AASRA (24/7 Suicide Prevention Helpline)": "+91 98204 66726",
    "National Suicide & Crisis Lifeline (US/Global standard reference)": "988"
}

def generate_intervention_recommendation(
    risk_level: str,
    crisis_flag: bool,
    distress_indicators: list
) -> tuple[str, Optional[Dict[str, str]]]:
    """
    Generates actionable, safe, and tiered intervention recommendations.
    
    Returns:
        recommendation: Human-readable intervention guidance.
        helplines: Dictionary of relevant emergency helplines if high/critical risk.
    """
    if crisis_flag or risk_level == "critical":
        recommendation = (
            "CRITICAL ALERT: Immediate Human Counsellor / Crisis Intervention Recommended. "
            "Please connect with emergency services, a designated campus counsellor, or call a 24/7 mental health crisis helpline immediately."
        )
        return recommendation, EMERGENCY_HELPLINES

    elif risk_level == "high":
        recommendation = (
            "Counsellor intervention recommended. It is advised to schedule a consultation "
            "with a certified mental health counsellor or student welfare officer to receive personalized support."
        )
        return recommendation, EMERGENCY_HELPLINES

    elif risk_level == "moderate":
        indicators_str = ", ".join(distress_indicators[:2]) if distress_indicators else "elevated stress"
        recommendation = (
            f"Supportive check-in recommended. The user exhibits signs of {indicators_str}. "
            "Suggest engaging in structured stress-relief exercises, connecting with peer support groups, or speaking to a mentor."
        )
        return recommendation, None

    else:  # low
        recommendation = (
            "Self-guided wellness and positive reinforcement recommended. "
            "Encourage maintaining daily routines, mindfulness/breathing exercises, and regular sleep hygiene."
        )
        return recommendation, None

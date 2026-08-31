"""Longitudinal Case Profile, Distress Trajectory, and State Store."""

from typing import Dict, Any, List
from datetime import datetime

PRIMARY_CASE_ID = "1042"

CASE_PROFILES: Dict[str, Dict[str, Any]] = {
    "1042": {
        "case_id": "1042",
        "case_number": "SPL-SCST-2024-0891",
        "anonymous_label": "Anonymous #1042",
        "act": "SC/ST (Prevention of Atrocities) Act, 1989",
        "sections": ["Section 3(1)(r)", "Section 3(1)(s)", "Section 15A"],
        "case_stage": "Special Court Trial Scheduled",
        "baseline_dds": 48,
        "current_dds": 78,
        "trend": "Increasing",
        "history": [
            {
                "session_id": "SESS-01",
                "date": "14 Aug 2026",
                "event": "FIR Registered & Legal Aid Assigned",
                "channel": "DLSA Legal Aid",
                "dds": 48,
                "risk_tier": "Moderate",
                "user_text": "FIR darj ho gayi hai, ab aage kya hoga?",
                "trend": "Baseline"
            },
            {
                "session_id": "SESS-02",
                "date": "21 Aug 2026",
                "event": "Chargesheet Filed by Special Investigation",
                "channel": "Daily Check-in",
                "dds": 54,
                "risk_tier": "Moderate",
                "user_text": "Thodi chinta ho rahi hai investigation ke baare mein.",
                "trend": "Stable"
            },
            {
                "session_id": "SESS-03",
                "date": "28 Aug 2026",
                "event": "Trial Summons Issued (Threat Reported)",
                "channel": "Voice Companion",
                "dds": 78,
                "risk_tier": "High",
                "user_text": "Bohot dar lag raha hai gawah dene mein, raat ko neend nahi aati.",
                "trend": "Increasing"
            },
        ],
        "assigned_support": {
            "legal_aid": "DLSA Special Counsel Appointed",
            "witness_protection": "Section 15A Security Protocol Active",
            "tele_manas_registered": True
        }
    }
}


def get_case_profile(case_id: str = PRIMARY_CASE_ID) -> Dict[str, Any]:
    """Retrieves case profile by ID, defaulting to primary demo case."""
    return CASE_PROFILES.get(case_id, CASE_PROFILES[PRIMARY_CASE_ID])


def calculate_longitudinal_trend(previous_dds: int, current_dds: int) -> str:
    """Computes trajectory trend based on previous baseline vs current interaction."""
    delta = current_dds - previous_dds
    if delta <= -6:
        return "Improving"
    elif delta >= 6:
        return "Increasing"
    return "Stable"


def log_user_interaction(
    case_id: str,
    channel: str,
    user_text: str,
    dds_score: int,
    risk_tier: str,
    emotions: List[str] = None
) -> Dict[str, Any]:
    """Records exclusively the user's utterance into the longitudinal case profile and updates trajectory trend."""
    case = get_case_profile(case_id)
    history = case["history"]
    previous_dds = history[-1]["dds"] if history else case["baseline_dds"]

    trend = calculate_longitudinal_trend(previous_dds, dds_score)

    now_str = datetime.now().strftime("%d %b (Live)")
    new_session = {
        "session_id": f"SESS-{len(history) + 1:02d}",
        "date": now_str,
        "event": f"Active Interaction ({channel})",
        "channel": channel,
        "dds": dds_score,
        "risk_tier": risk_tier,
        "user_text": user_text,
        "emotions": emotions or [],
        "trend": trend
    }

    history.append(new_session)
    case["current_dds"] = dds_score
    case["trend"] = trend

    return new_session

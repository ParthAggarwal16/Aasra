from typing import Tuple, List, Set
from app.schemas import LLMExtractedSignals, ScoreBreakdown

# Emotion Lexicon with Weighted Severity
HIGH_SEVERITY_EMOTIONS: Set[str] = {
    "hopelessness", "despair", "agony", "panic", "terror", "worthlessness", "self-loathing", "emptiness"
}
MODERATE_SEVERITY_EMOTIONS: Set[str] = {
    "sadness", "anxiety", "fear", "guilt", "loneliness", "grief", "shame", "depression", "dread", "isolation"
}
MILD_SEVERITY_EMOTIONS: Set[str] = {
    "anger", "frustration", "irritation", "stress", "confusion", "overwhelm", "exhaustion", "nervousness"
}
PROTECTIVE_EMOTIONS: Set[str] = {
    "joy", "happiness", "calm", "gratitude", "relief", "contentment", "hope", "optimism", "peace"
}

# Distress Indicator Keywords & Severity
HIGH_SEVERITY_INDICATORS: Set[str] = {
    "hopelessness", "social withdrawal", "feelings of worthlessness", "anhedonia",
    "loss of interest", "wanting to disappear", "emotional numbness", "severe insomnia",
    "complete isolation", "self-neglect"
}
MODERATE_SEVERITY_INDICATORS: Set[str] = {
    "insomnia", "sleep disturbance", "feeling overwhelmed", "burnout", "academic stress",
    "exam anxiety", "panic attacks", "appetite change", "crying spells", "relationship conflict",
    "chronic fatigue", "overthinking", "imposter syndrome"
}

def calculate_distress_score(signals: LLMExtractedSignals) -> Tuple[int, ScoreBreakdown, str, bool]:
    """
    Computes a transparent, deterministic distress score (0-100) based on extracted LLM signals.
    
    Returns:
        final_score: Integer between 0 and 100.
        breakdown: Detailed ScoreBreakdown model showing point contributions.
        risk_level: 'low', 'moderate', 'high', or 'critical'.
        crisis_flag: Boolean indicating if immediate crisis override was triggered.
    """
    # 1. Sentiment Component
    sentiment = signals.sentiment.lower()
    if sentiment == "negative":
        sentiment_pts = 20
    elif sentiment == "neutral":
        sentiment_pts = 5
    else: # positive
        sentiment_pts = 0

    # 2. Emotion Component
    raw_emotion_pts = 0
    for emo in signals.emotions:
        emo_clean = emo.lower().strip()
        matched = False
        
        # Check against emotion clusters
        for high_emo in HIGH_SEVERITY_EMOTIONS:
            if high_emo in emo_clean:
                raw_emotion_pts += 16
                matched = True
                break
        if matched:
            continue

        for mod_emo in MODERATE_SEVERITY_EMOTIONS:
            if mod_emo in emo_clean:
                raw_emotion_pts += 10
                matched = True
                break
        if matched:
            continue

        for mild_emo in MILD_SEVERITY_EMOTIONS:
            if mild_emo in emo_clean:
                raw_emotion_pts += 6
                matched = True
                break
        if matched:
            continue

        for prot_emo in PROTECTIVE_EMOTIONS:
            if prot_emo in emo_clean:
                raw_emotion_pts -= 10
                break
    
    # Bound emotion contribution between -10 and 35
    emotion_pts = max(-10, min(35, raw_emotion_pts))

    # 3. Distress Indicators Component
    raw_indicator_pts = 0
    for indicator in signals.distress_indicators:
        ind_clean = indicator.lower().strip()
        matched = False
        
        for high_ind in HIGH_SEVERITY_INDICATORS:
            if high_ind in ind_clean:
                raw_indicator_pts += 15
                matched = True
                break
        if matched:
            continue

        for mod_ind in MODERATE_SEVERITY_INDICATORS:
            if mod_ind in ind_clean:
                raw_indicator_pts += 10
                matched = True
                break
        if matched:
            continue
            
        # Unmatched default indicator
        raw_indicator_pts += 6

    # Bound indicator contribution between 0 and 40
    indicator_pts = min(40, raw_indicator_pts)

    # 4. Crisis Signals Bonus
    crisis_signals_count = len(signals.crisis_signals)
    has_crisis_signals = crisis_signals_count > 0
    crisis_bonus = 50 if has_crisis_signals else 0

    # 5. Total Raw and Clamped Score Calculation
    raw_total = sentiment_pts + emotion_pts + indicator_pts + crisis_bonus
    final_score = max(0, min(100, raw_total))

    # If crisis signals are present, guarantee minimum high-risk floor (>= 80)
    if has_crisis_signals and final_score < 80:
        final_score = 80

    # 6. Risk Level Categorization
    if has_crisis_signals or final_score >= 76:
        risk_level = "critical" if (has_crisis_signals or final_score >= 85) else "high"
    elif final_score >= 51:
        risk_level = "high"
    elif final_score >= 26:
        risk_level = "moderate"
    else:
        risk_level = "low"

    breakdown = ScoreBreakdown(
        sentiment_component=sentiment_pts,
        emotions_component=emotion_pts,
        indicators_component=indicator_pts,
        crisis_bonus=crisis_bonus,
        total_raw_score=raw_total,
        final_score=final_score
    )

    return final_score, breakdown, risk_level, has_crisis_signals

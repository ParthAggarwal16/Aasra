from typing import List, Literal, Optional, Dict, Any
from pydantic import BaseModel, Field

class LLMExtractedSignals(BaseModel):
    """Structured signals extracted directly by the LLM from user text."""
    sentiment: Literal["positive", "neutral", "negative"] = Field(
        description="Overall polarity of the user's response."
    )
    emotions: List[str] = Field(
        default_factory=list,
        description="List of detected emotional states (e.g., sadness, anxiety, fear, anger, loneliness, guilt, grief, joy, calm, exhaustion)."
    )
    distress_indicators: List[str] = Field(
        default_factory=list,
        description="Identified behavioral, cognitive, or situational distress markers (e.g., social withdrawal, insomnia, hopelessness, feelings of worthlessness, overwhelming pressure, academic failure fear, chronic fatigue)."
    )
    crisis_signals: List[str] = Field(
        default_factory=list,
        description="Explicit high-risk or immediate crisis flags if present (e.g., self-harm intent, suicidal ideation, severe helplessness, explicit emergency phrases). Empty if none."
    )
    context_summary: str = Field(
        description="Concise 1-2 sentence summary of the core situation or struggle described in the text."
    )

class AnalyzeRequest(BaseModel):
    """Input payload for text analysis, supporting check-in questions."""
    text: str = Field(
        ...,
        min_length=1,
        description="User's answer/response to the check-in question (e.g., 'How are you feeling?').",
        examples=["I've been feeling completely overwhelmed and drained lately. I haven't slept properly."]
    )
    question: Optional[str] = Field(
        default="How are you feeling?",
        description="The check-in question or prompt asked to the user (e.g., 'How are you feeling today?', 'What is on your mind?').",
        examples=["How are you feeling today?"]
    )

class ScoreBreakdown(BaseModel):
    """Transparent mathematical breakdown of the distress score calculation."""
    sentiment_component: int = Field(description="Points contributed from sentiment polarity")
    emotions_component: int = Field(description="Points contributed from detected negative emotional intensity")
    indicators_component: int = Field(description="Points contributed from behavioral/cognitive distress indicators")
    crisis_bonus: int = Field(description="Points contributed from explicit crisis triggers")
    total_raw_score: int = Field(description="Unclamped total score")
    final_score: int = Field(description="Clamped score within [0, 100]")

class AnalyzeResponse(BaseModel):
    """Final output response format for mental health text analysis."""
    sentiment: Literal["positive", "neutral", "negative"] = Field(
        description="Detected sentiment: positive, neutral, or negative."
    )
    emotions: List[str] = Field(
        description="Identified emotional states."
    )
    distress_indicators: List[str] = Field(
        description="Identified distress and mental health indicators."
    )
    distress_score: int = Field(
        description="Computed distress score between 0 and 100."
    )
    risk_level: Literal["low", "moderate", "high", "critical"] = Field(
        description="Evaluated risk level classification."
    )
    intervention_recommendation: str = Field(
        description="Actionable next step / intervention protocol."
    )
    crisis_flag: bool = Field(
        default=False,
        description="True if critical self-harm or emergency triggers are detected."
    )
    context_summary: Optional[str] = Field(
        default=None,
        description="Brief summary of the context."
    )
    score_breakdown: Optional[ScoreBreakdown] = Field(
        default=None,
        description="Auditable breakdown of how the distress score was calculated."
    )
    helpline_contacts: Optional[Dict[str, str]] = Field(
        default=None,
        description="Emergency crisis contacts provided when high or critical risk is detected."
    )
    disclaimer: str = Field(
        default="Disclaimer: This AI tool provides triage and distress screening support. It is not a clinical or medical diagnosis. For urgent support, contact a mental health professional or emergency helpline.",
        description="Safety and non-clinical disclaimer."
    )

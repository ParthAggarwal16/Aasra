"""Central Pydantic Schema Definitions for Voice, Chatbot, Sentiment/Distress Analysis, and Admin Monitoring."""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class LLMExtractedSignals(BaseModel):
    """Signals extracted directly by the LLM from user text input."""

    sentiment: Literal["positive", "neutral", "negative"] = Field(
        description="Overall sentiment polarity of the user's utterance."
    )
    emotions: List[str] = Field(
        default_factory=list,
        description="Detected emotional states."
    )
    distress_indicators: List[str] = Field(
        default_factory=list,
        description="Behavioral or cognitive distress markers."
    )
    crisis_signals: List[str] = Field(
        default_factory=list,
        description="Immediate crisis or self-harm triggers."
    )
    context_summary: str = Field(
        description="Brief summary of what the user expressed."
    )


class ScoreBreakdown(BaseModel):
    """Mathematical point breakdown of distress score calculation."""

    sentiment_component: int = Field(description="Score contribution from sentiment")
    emotions_component: int = Field(description="Score contribution from emotional intensity")
    indicators_component: int = Field(description="Score contribution from distress indicators")
    crisis_bonus: int = Field(description="Score contribution from crisis flags")
    total_raw_score: int = Field(description="Unclamped total score")
    final_score: int = Field(description="Clamped score within 0 to 100")


class AnalyzeRequest(BaseModel):
    """Input payload for text analysis screening."""

    text: str = Field(
        ...,
        min_length=1,
        description="User utterance or check-in text."
    )
    question: Optional[str] = Field(
        default="User Interaction Check-in",
        description="Context of the interaction."
    )
    case_id: Optional[str] = Field(
        default="1042",
        description="Anonymous case ID associated with this interaction."
    )


class AnalyzeResponse(BaseModel):
    """Output payload for distress scoring and longitudinal evaluation."""

    sentiment: Literal["positive", "neutral", "negative"]
    emotions: List[str]
    distress_indicators: List[str]
    distress_score: int
    risk_level: Literal["low", "moderate", "high", "critical"]
    intervention_recommendation: str
    crisis_flag: bool = False
    context_summary: Optional[str] = None
    score_breakdown: Optional[ScoreBreakdown] = None
    helpline_contacts: Optional[Dict[str, str]] = None
    trend: Optional[str] = Field(
        default="Stable",
        description="Longitudinal trend comparing with previous sessions."
    )


class ChatMessageModel(BaseModel):
    """Chat message representation."""

    role: str
    content: str


class QueryRequest(BaseModel):
    """Input payload for chatbot interaction."""

    query: str
    chat_history: Optional[List[ChatMessageModel]] = Field(default_factory=list)
    victim_context: Optional[Dict[str, Any]] = None
    language: Optional[str] = "hi"
    case_id: Optional[str] = "1042"


class QueryResponse(BaseModel):
    """Output payload for chatbot response."""

    answer: str
    sources: Optional[List[str]] = Field(default_factory=list)
    detected_intent: Optional[str] = None
    legal_references: Optional[List[str]] = Field(default_factory=list)
    disclaimer: Optional[str] = None


class DialogueTurn(BaseModel):
    """Single turn representation in a voice conversation."""

    role: str
    content: str


class VoiceTurnRequest(BaseModel):
    """Input payload for conversational voice agent turn."""

    transcript: str
    audio_features: Optional[Dict[str, Any]] = None
    dialogue_history: Optional[List[DialogueTurn]] = Field(default_factory=list)
    case_context: Optional[str] = "Special Court Trial Scheduled"
    reported_threat: Optional[bool] = False
    language: Optional[str] = "hi"
    case_id: Optional[str] = "1042"


class VoiceTurnResponse(BaseModel):
    """Output payload for voice companion turn."""

    response_text: str
    tts_text: str
    dds_score: int
    risk_tier: str
    alert_triggered: bool
    distress_features: Dict[str, Any]
    trauma_adaptations: List[str]
    history: Optional[List[Dict[str, Any]]] = None


class BolnaSessionRequest(BaseModel):
    """Request to mint a WebRTC call session."""

    user_id: Optional[str] = "anon_user_1042"
    language: Optional[str] = "hi"


class BolnaSessionResponse(BaseModel):
    """Session credentials returned for WebRTC voice calling."""

    session_id: str
    agent_id: str
    status: str
    token: Optional[str] = None

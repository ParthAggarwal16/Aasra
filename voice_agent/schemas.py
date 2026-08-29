"""
================================================================================
File: voice_agent/schemas.py
Description: Pydantic schemas and data validation models for the Voice Agent API.
Defines models for conversational voice check-in, acoustic features, and distress metrics.
================================================================================
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class VoiceTurnRequest(BaseModel):
    """
    Schema for conversational voice turn requests.
    """
    transcript: str = Field(..., description="Transcript of the user's spoken utterance")
    dialogue_history: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="Past conversation turns")
    case_context: Optional[str] = Field("Special Court Proceedings", description="Current legal stage")
    reported_threat: Optional[bool] = Field(False, description="Whether direct threat/intimidation was reported")
    language: Optional[str] = Field("en", description="Preferred language: en or hi")


class VoiceTurnResponse(BaseModel):
    """
    Schema for the adapted voice response and psychological analysis.
    """
    spoken_response: str = Field(..., description="Adapted empathetic response to be spoken aloud")
    dds_score: float = Field(..., description="Dynamic Distress Score (0-100)")
    risk_tier: str = Field(..., description="Risk categorization: Low, Moderate, High, Critical")
    risk_color: str = Field(..., description="HEX color representation for risk tier")
    action_summary: str = Field(..., description="Recommended immediate action summary")
    trajectory: str = Field(..., description="Distress trajectory: Stable, Deteriorating, Improving")
    delta_baseline: float = Field(..., description="Score change relative to baseline")
    emotions: List[str] = Field(default_factory=list, description="Dominant emotion categories detected")
    fear_score: float = Field(..., description="Estimated fear/threat level (0-100)")
    hopelessness_score: float = Field(..., description="Estimated hopelessness level (0-100)")
    case_stress_score: float = Field(..., description="Estimated case/legal stress level (0-100)")
    threat_detected: bool = Field(..., description="Whether threats or intimidation were detected")
    critical_emergency: bool = Field(..., description="Whether acute crisis intervention is required")
    acoustic_analysis: Optional[Dict[str, Any]] = Field(None, description="Extracted vocal acoustic signals")
    xai_factors: List[Dict[str, str]] = Field(default_factory=list, description="Explainable AI factor weights")
    recommended_interventions: List[Dict[str, str]] = Field(default_factory=list, description="Targeted support pathways")
    history: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Longitudinal session timeline")

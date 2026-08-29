"""
================================================================================
File: chatbot/schemas.py
Description: Pydantic Data Models and Validation Schemas for LangChain Chatbot Service.
Defines ChatMessage, QueryRequest, and QueryResponse schemas.
================================================================================
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """
    Individual conversational message.
    """
    role: str = Field(..., description="Role of the speaker: user or assistant")
    content: str = Field(..., description="Text content of the message")


class QueryRequest(BaseModel):
    """
    User query request schema.
    """
    query: str = Field(..., description="Question from the user or victim")
    chat_history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Recent conversation history")
    victim_id: Optional[str] = Field("VIC-2024-8842", description="Victim identification reference")
    language: Optional[str] = Field("en", description="Language preference: en, hi, hinglish")


class QueryResponse(BaseModel):
    """
    Chatbot structured answer response.
    """
    query: str
    response: str
    source: str
    case_reference: str
    case_stage: str

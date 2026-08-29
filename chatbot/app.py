"""
================================================================================
File: chatbot/app.py
Description: Standalone FastAPI Microservice Application for Aasra Chatbot Agent.
Hosts /health and /api/query endpoints for LangChain question answering.
================================================================================
"""

from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot.config import settings
from chatbot.schemas import QueryRequest, QueryResponse
from chatbot.agent import chatbot_agent

app = FastAPI(
    title=settings.service_name,
    version=settings.version,
    description="LangChain-powered victim legal and mental-health guidance assistant."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """
    Returns service health status.
    """
    return {
        "status": "healthy",
        "service": settings.service_name,
        "version": settings.version
    }


@app.post("/api/query", response_model=QueryResponse)
def query_agent(payload: QueryRequest):
    """
    Processes victim query using LangChain Chatbot Agent.
    """
    try:
        history_dicts = [{"role": m.role, "content": m.content} for m in (payload.chat_history or [])]
        result = chatbot_agent.process_query(
            query=payload.query,
            chat_history=history_dicts,
            language=payload.language or "en"
        )
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("chatbot.app:app", host=settings.host, port=settings.port, reload=True)

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.analyzer import analyzer_pipeline

app = FastAPI(
    title="Mental Health Text Analysis API",
    description="Backend microservice for LLM-powered mental health text analysis, check-in response screening, emotional signal extraction, transparent distress scoring, and intervention recommendation triage.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for cross-origin backend and dashboard integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"])
def root():
    """Root endpoint providing service metadata and API information for backend integration."""
    return {
        "service": "Mental Health Text Analysis Service",
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "analyze": "POST /analyze",
            "health": "GET /health"
        }
    }

@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint returning service status and active LLM configuration."""
    return {
        "status": "healthy",
        "llm_provider": settings.LLM_PROVIDER,
        "model_name": settings.get_default_model(),
        "version": "1.0.0"
    }

@app.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
    tags=["Analysis"],
    summary="Analyze user check-in response for distress scoring and dashboard ingestion"
)
async def analyze_text(request: AnalyzeRequest):
    """
    Main analysis endpoint:
    - Accepts user text response and optional question context (e.g., 'How are you feeling?').
    - Runs LangChain extraction + transparent scoring + intervention triage.
    - Returns structured JSON response tailored for dashboard ingestion.
    """
    try:
        result = analyzer_pipeline.analyze(
            text=request.text,
            question=request.question or "How are you feeling?"
        )
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during analysis: {str(e)}"
        )

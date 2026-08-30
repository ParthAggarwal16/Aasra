import json
import re
import logging
from typing import Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.exceptions import OutputParserException

from app.config import settings
from app.schemas import LLMExtractedSignals, AnalyzeResponse, ScoreBreakdown
from app.scorer import calculate_distress_score
from app.intervention import generate_intervention_recommendation

logger = logging.getLogger(__name__)

# Mental Health System Prompt tailored for Conversational Check-ins
EXTRACTION_SYSTEM_PROMPT = """You are an expert AI clinical screening assistant specialized in psychological text analysis, emotional signal extraction, and mental health distress detection.

The user is answering a check-in question (e.g., "How are you feeling?", "What's on your mind?", "How are you coping with stress?").

Your task is to analyze their answer in context of the question and extract structured qualitative signals:
1. Sentiment: Classify as "positive", "neutral", or "negative".
2. Emotions: Identify all prominent emotional states in their response (e.g., sadness, anxiety, fear, anger, loneliness, guilt, grief, despair, helplessness, exhaustion, apathy, joy, calm, hope).
3. Distress Indicators: Identify explicit or implicit behavioral/cognitive distress markers (e.g., "social withdrawal", "insomnia / sleep disturbance", "hopelessness", "feelings of worthlessness", "academic burnout", "feeling overwhelmed", "loss of interest / anhedonia", "panic / physical agitation").
4. Crisis Signals: Flag any explicit or implicit indicators of immediate danger, self-harm, suicidal ideation, or extreme helplessness (e.g., "self_harm_ideation", "suicide_intent", "urge to disappear completely", "extreme agony"). Leave empty if none exist.
5. Context Summary: Provide a brief 1-2 sentence factual summary of what the user is experiencing.

Guidelines:
- Carefully interpret conversational nuances, colloquialisms, and brief replies (e.g. "not good at all", "exhausted and crying every day", "can't take this anymore", "feeling okay").
- Do not hallucinate symptoms that are not supported by the text.
"""

def get_llm():
    """Initializes and returns the configured Chat LLM based on environment settings."""
    provider = settings.LLM_PROVIDER.lower()
    model_name = settings.get_default_model()
    temperature = settings.TEMPERATURE

    if provider == "google":
        if not settings.GOOGLE_API_KEY:
            return None
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=temperature
        )

    elif provider == "openai":
        if not settings.OPENAI_API_KEY:
            return None
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=model_name,
            api_key=settings.OPENAI_API_KEY,
            temperature=temperature
        )

    elif provider == "groq":
        if not settings.GROQ_API_KEY:
            return None
        from langchain_groq import ChatGroq
        return ChatGroq(
            model=model_name,
            groq_api_key=settings.GROQ_API_KEY,
            temperature=temperature
        )

    else:
        raise ValueError(
            f"Unsupported LLM_PROVIDER: '{provider}'. "
            f"Supported providers are 'google', 'openai', and 'groq'."
        )

def fallback_heuristic_extraction(text: str, question: str = "How are you feeling?") -> LLMExtractedSignals:
    """
    Heuristic rule-based signal extraction fallback when no API key is provided.
    Ensures offline demo reliability and uninterrupted hackathon testing.
    """
    text_lower = text.lower()
    
    # Crisis signals check
    crisis_signals = []
    if any(p in text_lower for p in ["kill myself", "end my life", "suicide", "self harm", "cut myself", "want to die", "better off dead"]):
        crisis_signals.append("suicide_intent")
    if any(p in text_lower for p in ["disappear completely", "can't go on", "cant go on", "no reason to live"]):
        crisis_signals.append("severe_helplessness")

    # Emotions detection
    emotions = []
    if any(w in text_lower for w in ["sad", "crying", "unhappy", "sorrow", "depressed", "miserable", "down", "terrible", "awful"]):
        emotions.append("sadness")
    if any(w in text_lower for w in ["anxious", "anxiety", "worried", "nervous", "scared", "fear", "panic", "stressed"]):
        emotions.append("anxiety")
    if any(w in text_lower for w in ["hopeless", "pointless", "no hope", "giving up"]):
        emotions.append("hopelessness")
    if any(w in text_lower for w in ["alone", "lonely", "isolated", "nobody", "no friends"]):
        emotions.append("loneliness")
    if any(w in text_lower for w in ["exhausted", "tired", "drained", "burnt out", "burnout"]):
        emotions.append("exhaustion")
    if any(w in text_lower for w in ["angry", "furious", "annoyed", "irritated"]):
        emotions.append("anger")
    # Positive emotions (check negations first)
    has_positive_negation = any(p in text_lower for p in ["not good", "not happy", "not great", "not okay", "not fine", "not doing well"])
    if not has_positive_negation:
        if any(w in text_lower for w in ["happy", "great", "relieved", "calm", "wonderful", "peace", "awesome"]):
            emotions.append("joy")
            emotions.append("calm")

    # Distress indicators
    indicators = []
    if any(w in text_lower for w in ["haven't slept", "cant sleep", "can't sleep", "insomnia", "sleepless", "nightmare", "sleep"]):
        indicators.append("insomnia / sleep disturbance")
    if any(w in text_lower for w in ["overwhelmed", "burden", "too much", "pressure", "exhausted", "burnout", "drained"]):
        indicators.append("feeling overwhelmed")
    if any(w in text_lower for w in ["disappear", "isolate", "withdrawing", "shut myself in", "hiding from everyone", "stay in bed"]):
        indicators.append("social withdrawal")
    if any(w in text_lower for w in ["worthless", "failure", "failing", "useless", "burden to others", "hate myself"]):
        indicators.append("feelings of worthlessness")
    if any(w in text_lower for w in ["exam", "college", "grades", "assignment", "deadline", "study", "syllabus"]):
        indicators.append("academic stress")

    # Sentiment classification
    if emotions and all(e in ["joy", "calm"] for e in emotions) and not indicators and not crisis_signals:
        sentiment = "positive"
    elif indicators or emotions or crisis_signals:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    if not emotions:
        emotions = ["neutral state"] if sentiment == "neutral" else ["distress"]

    return LLMExtractedSignals(
        sentiment=sentiment,
        emotions=emotions,
        distress_indicators=indicators,
        crisis_signals=crisis_signals,
        context_summary=f"User responded to prompt '{question}' with {len(text.split())} words."
    )

class MentalHealthAnalyzer:
    """End-to-end Mental Health Text Analysis Pipeline using LangChain & Deterministic Scoring."""

    def __init__(self, llm=None):
        self.llm = llm

    def _get_chain(self):
        """Builds the LangChain structured extraction chain."""
        if self.llm is None:
            self.llm = get_llm()
            
        if self.llm is None:
            return None

        structured_llm = self.llm.with_structured_output(LLMExtractedSignals)
        prompt = ChatPromptTemplate.from_messages([
            ("system", EXTRACTION_SYSTEM_PROMPT),
            ("human", "Check-in Question Asked: \"{question}\"\nUser's Response: \"\"\"{user_text}\"\"\"\n\nAnalyze this response for sentiment, emotions, distress indicators, and crisis signals:")
        ])
        return prompt | structured_llm

    def analyze(self, text: str, question: str = "How are you feeling?") -> AnalyzeResponse:
        """
        Executes complete analysis workflow:
        1. Extract structured signals from user's response in context of the check-in question
        2. Calculate transparent distress score & risk level
        3. Generate tiered intervention recommendations
        4. Assemble final validated response payload
        """
        cleaned_text = text.strip()
        if not cleaned_text:
            raise ValueError("Input text cannot be empty.")

        chain = self._get_chain()
        
        if chain is not None:
            try:
                extracted_signals: LLMExtractedSignals = chain.invoke({
                    "question": question or "How are you feeling?",
                    "user_text": cleaned_text
                })
            except Exception as e:
                logger.warning(f"LLM extraction error ({str(e)}), switching to fallback heuristic: {str(e)}")
                extracted_signals = fallback_heuristic_extraction(cleaned_text, question)
        else:
            # Fallback when no API key configured
            extracted_signals = fallback_heuristic_extraction(cleaned_text, question)

        # Calculate deterministic transparent distress score
        score, breakdown, risk_level, crisis_flag = calculate_distress_score(extracted_signals)

        # Generate actionable intervention recommendations
        recommendation, helplines = generate_intervention_recommendation(
            risk_level=risk_level,
            crisis_flag=crisis_flag,
            distress_indicators=extracted_signals.distress_indicators
        )

        return AnalyzeResponse(
            sentiment=extracted_signals.sentiment,
            emotions=extracted_signals.emotions,
            distress_indicators=extracted_signals.distress_indicators,
            distress_score=score,
            risk_level=risk_level,
            intervention_recommendation=recommendation,
            crisis_flag=crisis_flag,
            context_summary=extracted_signals.context_summary,
            score_breakdown=breakdown,
            helpline_contacts=helplines
        )

# Global analyzer instance for reuse
analyzer_pipeline = MentalHealthAnalyzer()

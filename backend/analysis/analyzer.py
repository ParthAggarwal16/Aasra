"""Multimodal Sentiment, Emotional Signal Extraction, and Distress Analyzer Agent."""

import logging
from typing import Optional
from langchain_core.prompts import ChatPromptTemplate

from backend.config import settings
from backend.schemas import LLMExtractedSignals, AnalyzeResponse
from backend.analysis.scorer import calculate_distress_score
from backend.analysis.intervention import generate_intervention_recommendation
from backend.state import log_user_interaction, get_case_profile

logger = logging.getLogger(__name__)

EXTRACTION_SYSTEM_PROMPT = """You are an expert clinical AI screening assistant specialized in trauma-informed psychological text analysis, emotional signal extraction, and distress detection.

Analyze the user's utterance and extract structured qualitative signals:
1. Sentiment: Classify as "positive", "neutral", or "negative".
2. Emotions: Identify all prominent emotional states (e.g., sadness, anxiety, fear, anger, loneliness, guilt, grief, despair, helplessness, exhaustion, joy, calm, hope).
3. Distress Indicators: Identify explicit or implicit behavioral/cognitive distress markers (e.g., "social withdrawal", "insomnia / sleep disturbance", "hopelessness", "feelings of worthlessness", "legal anxiety", "feeling overwhelmed", "fear of testimony").
4. Crisis Signals: Flag any explicit or implicit indicators of immediate danger, self-harm, suicidal ideation, or extreme helplessness. Leave empty if none exist.
5. Context Summary: Provide a brief 1-2 sentence factual summary of what the user is experiencing.

Guidelines:
- Analyze ONLY what the user expressed.
- Do not hallucinate symptoms that are not supported by the text.
"""


def get_llm():
    """Initializes and returns configured Chat LLM based on environment settings."""
    provider = settings.llm_provider.lower()
    model_name = settings.llm_model
    temperature = settings.temperature

    if provider == "groq" and settings.groq_api_key:
        from langchain_groq import ChatGroq
        return ChatGroq(
            model=model_name,
            groq_api_key=settings.groq_api_key,
            temperature=temperature
        )

    elif provider == "google" and settings.google_api_key:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.google_api_key,
            temperature=temperature
        )

    elif provider == "openai" and settings.openai_api_key:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="gpt-4o-mini",
            api_key=settings.openai_api_key,
            temperature=temperature
        )

    return None


def fallback_heuristic_extraction(text: str, question: str = "User Check-in") -> LLMExtractedSignals:
    """Heuristic rule-based signal extraction fallback when no LLM API is available."""
    text_lower = text.lower()

    crisis_signals = []
    if any(p in text_lower for p in ["kill myself", "end my life", "suicide", "self harm", "cut myself", "want to die", "better off dead"]):
        crisis_signals.append("suicide_intent")
    if any(p in text_lower for p in ["disappear completely", "can't go on", "cant go on", "no reason to live", "extreme fear"]):
        crisis_signals.append("severe_helplessness")

    emotions = []
    if any(w in text_lower for w in ["sad", "crying", "unhappy", "sorrow", "depressed", "miserable", "down", "terrible", "awful"]):
        emotions.append("sadness")
    if any(w in text_lower for w in ["anxious", "anxiety", "worried", "nervous", "scared", "fear", "dar", "ghabrahat", "panic", "stressed"]):
        emotions.append("anxiety")
    if any(w in text_lower for w in ["hopeless", "pointless", "no hope", "giving up"]):
        emotions.append("hopelessness")
    if any(w in text_lower for w in ["alone", "lonely", "isolated", "nobody", "no friends", "akela"]):
        emotions.append("loneliness")
    if any(w in text_lower for w in ["exhausted", "tired", "drained", "burnt out", "burnout", "thaka"]):
        emotions.append("exhaustion")
    if any(w in text_lower for w in ["angry", "furious", "annoyed", "irritated", "gussa"]):
        emotions.append("anger")

    has_positive_negation = any(p in text_lower for p in ["not good", "not happy", "not great", "not okay", "not fine", "nahi"])
    if not has_positive_negation:
        if any(w in text_lower for w in ["happy", "great", "relieved", "calm", "wonderful", "peace", "accha", "khush"]):
            emotions.append("joy")
            emotions.append("calm")

    indicators = []
    if any(w in text_lower for w in ["haven't slept", "cant sleep", "can't sleep", "insomnia", "sleepless", "nightmare", "neend"]):
        indicators.append("insomnia / sleep disturbance")
    if any(w in text_lower for w in ["overwhelmed", "burden", "too much", "pressure", "exhausted", "burnout"]):
        indicators.append("feeling overwhelmed")
    if any(w in text_lower for w in ["disappear", "isolate", "withdrawing", "stay in bed", "chupna"]):
        indicators.append("social withdrawal")
    if any(w in text_lower for w in ["worthless", "failure", "failing", "useless", "burden to others"]):
        indicators.append("feelings of worthlessness")
    if any(w in text_lower for w in ["court", "trial", "gawah", "lawyer", "case", "police", "threat", "dhamki"]):
        indicators.append("legal process anxiety & threat")

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
        context_summary=f"User shared: '{text[:80]}...'"
    )


class SentimentDistressAnalyzer:
    """Core Mental Health & Distress Scoring Pipeline."""

    def __init__(self):
        self.llm = None

    def _get_chain(self):
        """Constructs LangChain structured signal extraction chain."""
        if self.llm is None:
            self.llm = get_llm()

        if self.llm is None:
            return None

        structured_llm = self.llm.with_structured_output(LLMExtractedSignals)
        prompt = ChatPromptTemplate.from_messages([
            ("system", EXTRACTION_SYSTEM_PROMPT),
            ("human", "User's Interaction Utterance: \"\"\"{user_text}\"\"\"\nContext: {question}\n\nExtract sentiment, emotions, distress indicators, and crisis signals from user input only:")
        ])
        return prompt | structured_llm

    def analyze(
        self,
        text: str,
        question: str = "User Interaction Check-in",
        case_id: str = "1042",
        channel: str = "Daily Check-in",
        persist_to_trajectory: bool = True
    ) -> AnalyzeResponse:
        """
        Executes end-to-end signal extraction, computes dynamic distress score,
        calculates longitudinal trajectory trend, and updates state for Admin Dashboard.
        """
        cleaned_text = text.strip()
        if not cleaned_text:
            raise ValueError("Input text cannot be empty.")

        chain = self._get_chain()

        if chain is not None:
            try:
                extracted_signals: LLMExtractedSignals = chain.invoke({
                    "question": question,
                    "user_text": cleaned_text
                })
            except Exception as e:
                logger.warning(f"LLM extraction error: {e}. Utilizing heuristic fallback.")
                extracted_signals = fallback_heuristic_extraction(cleaned_text, question)
        else:
            extracted_signals = fallback_heuristic_extraction(cleaned_text, question)

        score, breakdown, risk_level, crisis_flag = calculate_distress_score(extracted_signals)

        recommendation, helplines = generate_intervention_recommendation(
            risk_level=risk_level,
            crisis_flag=crisis_flag,
            distress_indicators=extracted_signals.distress_indicators
        )

        trend = "Stable"
        if persist_to_trajectory:
            session_record = log_user_interaction(
                case_id=case_id,
                channel=channel,
                user_text=cleaned_text,
                dds_score=score,
                risk_tier=risk_level.capitalize(),
                emotions=extracted_signals.emotions
            )
            trend = session_record.get("trend", "Stable")

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
            helpline_contacts=helplines,
            trend=trend
        )


analyzer_pipeline = SentimentDistressAnalyzer()

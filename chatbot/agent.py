"""
================================================================================
File: chatbot/agent.py
Description: LangChain Conversational Chatbot Agent for Victim Guidance & Rights Navigation.
Processes user queries regarding past check-in answers, Section 15A rights under
the SC/ST Prevention of Atrocities Act, NALSA Legal Aid, and Tele-MANAS support.
================================================================================
"""

import os
from typing import Dict, List, Any, Optional
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from chatbot.config import settings


class AasraChatbotAgent:
    """
    Empathetic legal and mental-health guidance assistant powered by LangChain and Groq LLM.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.groq_api_key
        self.llm = ChatGroq(
            api_key=self.api_key,
            model_name=settings.model_name,
            temperature=settings.temperature
        )

    def process_query(
        self,
        query: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        victim_context: Optional[Dict[str, Any]] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Executes contextual query answering against victim check-in history and legal knowledge.
        """
        chat_history = chat_history or []
        victim_context = victim_context or self._default_victim_context()

        history_lines = []
        for session in victim_context.get("history", []):
            history_lines.append(
                f"• [{session.get('date', '')}] Session: {session.get('session_id', '')} | Event: {session.get('event', '')} | Distress Score: {session.get('dds', '')}/100 ({session.get('risk_tier', '')}) | Victim Spoke: \"{session.get('transcript', '')}\""
            )
        history_formatted = "\n".join(history_lines) if history_lines else "No recorded sessions yet."

        system_instruction = f"""
You are Aasra Sahayak (आसरा सहायक), an empathetic, warm, helpful, and highly informed legal and trauma-support AI chatbot assistant.

Your purpose is to answer any questions the user asks about:
1. Their past check-in answers, scores, and emotional well-being trajectory.
2. Section 15A of the SC/ST (Prevention of Atrocities) Act:
   - Rights of victims and witnesses to protection against intimidation, violence, harassment, or threats.
   - Right to police security, home patrolling, safe shelter, travel allowances, and fair treatment.
3. Legal Aid Support:
   - NALSA and DLSA (District Legal Services Authority) free advocate appointment for court hearings.
4. Psychological and Emergency Helplines:
   - Tele-MANAS (24x7 Toll-Free: 14416 or 1800-891-4416) for free tele-counselling.
   - 112 Emergency Response Support System (ERSS) for immediate danger.
   - One Stop Centres (OSC) for integrated medical, shelter, and psycho-social aid.

Current Victim Context:
- Identification: {victim_context.get('pseudonym', 'Protected Case Ref #8842')}
- Case Milestone: {victim_context.get('case_stage', 'Special Court Trial Scheduled')}
- Baseline Distress Score: {victim_context.get('baseline_dds', 34.0)} / 100
- Recorded Check-in History:
{history_formatted}

Language Instruction:
- Selected Language: {language}
- ALWAYS match the user's inquiry language.
- If the user writes or asks in English, ANSWER COMPLETELY IN PROFESSIONAL, EMPATHETIC ENGLISH.
- Only respond in Hindi if the user explicitly asks in Hindi or requests Hindi.

Communication Guidelines:
- Be warm, gentle, reassuring, professional, and concise.
- Format responses with clean paragraphs, bold key terms, and bullet points.
- Avoid bulky ASCII markdown tables; use clean bullet lists with clear headings instead.
- Keep recommendations practical, actionable, and comforting.
"""

        messages = [SystemMessage(content=system_instruction)]
        for turn in chat_history[-6:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))

        messages.append(HumanMessage(content=query))

        try:
            ai_response = self.llm.invoke(messages)
            reply_text = ai_response.content
        except Exception as e:
            reply_text = self._fallback_answer(query)

        return {
            "query": query,
            "response": reply_text,
            "source": "LangChain + Groq",
            "case_reference": victim_context.get("pseudonym", "Case Ref #8842"),
            "case_stage": victim_context.get("case_stage", "Special Court Trial Scheduled")
        }

    def stream_query(
        self,
        query: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        victim_context: Optional[Dict[str, Any]] = None,
        language: str = "en"
    ):
        """
        Streams conversational response token-by-token using Groq LLM.
        """
        chat_history = chat_history or []
        victim_context = victim_context or {}

        history_lines = []
        for session in victim_context.get("history", []):
            history_lines.append(
                f"• [{session.get('date', '')}] Session: {session.get('session_id', '')} | Event: {session.get('event', '')} | Distress Score: {session.get('dds', '')}/100 ({session.get('risk_tier', '')}) | Spoke: \"{session.get('transcript', '')}\""
            )
        history_formatted = "\n".join(history_lines) if history_lines else "No recorded sessions yet."

        system_instruction = f"""
You are Aasra Support Assistant, a compassionate, warm, helpful, and highly informed legal and trauma-support AI companion.

Your purpose is to answer any questions the user asks about:
1. Section 15A of the SC/ST (Prevention of Atrocities) Act:
   - Rights to immediate police protection, home security/patrolling, safe shelter, travel allowances, and protection against threats.
2. Free Legal Aid (NALSA & DLSA appointment of state advocates).
3. Mental Health & Helplines (Tele-MANAS Toll-Free 14416 / 1800-891-4416, 112 ERSS, One Stop Centres).
4. Grounding and emotional regulation techniques.
5. Reviewing past check-in sessions if asked.

Context:
- Identification: {victim_context.get('pseudonym', 'Case Ref #8842')}
- Case Milestone: {victim_context.get('case_stage', 'Special Court Trial Scheduled')}
- Baseline Score: {victim_context.get('baseline_dds', 34.0)} / 100
- Recent Session History:
{history_formatted}

Language Instruction:
- Selected Language: {language}
- If the user writes or asks in English, YOU MUST ANSWER COMPLETELY IN PROFESSIONAL, EMPATHETIC ENGLISH.
- Only respond in Hindi if the user explicitly asks in Hindi or requests Hindi.

Communication Guidelines:
- Be warm, gentle, reassuring, professional, and concise.
- Format responses with clean paragraphs, bold key terms, and bullet points.
- Avoid bulky ASCII markdown tables; use clean bullet lists with clear headings instead.
- Keep recommendations practical, actionable, and comforting.
"""

        messages = [SystemMessage(content=system_instruction)]
        for turn in chat_history[-6:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))

        messages.append(HumanMessage(content=query))

        try:
            for chunk in self.llm.stream(messages):
                if chunk.content:
                    yield chunk.content
        except Exception:
            yield self._fallback_answer(query)

    def _default_victim_context(self) -> Dict[str, Any]:
        """
        Default profile context when none is supplied.
        """
        return {
            "victim_id": "VIC-2024-8842",
            "pseudonym": "Case Ref #8842",
            "case_stage": "Special Court Trial Scheduled",
            "baseline_dds": 34.0,
            "history": [
                {
                    "session_id": "SESS-01",
                    "date": "2024-08-10",
                    "event": "Case Registration Check-in",
                    "dds": 34.0,
                    "risk_tier": "Moderate",
                    "transcript": "I am managing somehow, but worried about what will happen."
                },
                {
                    "session_id": "SESS-02",
                    "date": "2024-08-16",
                    "event": "Investigation Stage Check-in",
                    "dds": 39.0,
                    "risk_tier": "Moderate",
                    "transcript": "Police came for verification. Family is anxious."
                },
                {
                    "session_id": "SESS-03",
                    "date": "2024-08-22",
                    "event": "Summons Received / Court Date Approaching",
                    "dds": 55.0,
                    "risk_tier": "High",
                    "transcript": "They gave us court date. We are getting threatening looks in the village."
                }
            ]
        }

    def _fallback_answer(self, query: str) -> str:
        """
        Deterministic rule-based response when offline.
        """
        q_lower = query.lower()
        if "15a" in q_lower or "protection" in q_lower or "threat" in q_lower or "suraksha" in q_lower:
            return (
                "Under Section 15A of the SC/ST (Prevention of Atrocities) Act:\n"
                "1. You have the right to police protection and security at your residence.\n"
                "2. Protection from any harassment, intimidation, or inducement by the accused.\n"
                "3. Free transport, food, and daily allowance when attending court dates.\n"
                "If you feel unsafe, inform the District Magistrate or Police Superintendent immediately."
            )
        elif "legal" in q_lower or "lawyer" in q_lower or "advocate" in q_lower or "nalsa" in q_lower:
            return (
                "You are entitled to Free Legal Aid through NALSA / DLSA.\n"
                "A government-appointed advocate will represent you in the Special Court at zero cost to you."
            )
        elif "counsel" in q_lower or "tele-manas" in q_lower or "mental" in q_lower:
            return (
                "You can speak with a certified counselor anytime via Tele-MANAS (Toll-Free 14416 / 1800-891-4416).\n"
                "It is completely free, 24x7, and available in your local language."
            )
        return (
            "Thank you for reaching out. Aasra Sahayak is here to assist you. "
            "You can ask me to summarize your previous answers, check Section 15A rights, or get legal aid information."
        )


chatbot_agent = AasraChatbotAgent()

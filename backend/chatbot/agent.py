"""LangChain Conversational AI Saathi Agent for Guidance, Rights, and Trauma-Informed Support."""

from typing import Dict, List, Any, Optional
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from backend.config import settings


class AasraChatbotAgent:
    """Empathetic legal and mental-health guidance assistant powered by LangChain and Groq LLM."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.groq_api_key
        self.llm = ChatGroq(
            api_key=self.api_key,
            model_name=settings.llm_model,
            temperature=settings.temperature
        )

    def process_query(
        self,
        query: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        victim_context: Optional[Dict[str, Any]] = None,
        language: str = "hi"
    ) -> Dict[str, Any]:
        """Executes contextual query answering against legal rights and support hotlines."""
        chat_history = chat_history or []
        victim_context = victim_context or {}

        history_lines = []
        for session in victim_context.get("history", []):
            history_lines.append(
                f"• [{session.get('date', '')}] Session: {session.get('session_id', '')} | Event: {session.get('event', '')} | User Spoke: \"{session.get('user_text', session.get('transcript', ''))}\""
            )
        history_formatted = "\n".join(history_lines) if history_lines else "No recorded sessions yet."

        system_instruction = f"""You are AI Saathi (आसरा सहायक), an empathetic, warm, helpful, and trauma-informed legal and mental health support AI assistant.

Your purpose is to answer the user's questions about:
1. Legal Rights under Section 15A of the SC/ST (Prevention of Atrocities) Act:
   - Right to witness protection against intimidation, violence, or threats.
   - Right to police protection, home patrolling, safe transit to court, and free DLSA legal aid.
2. Emotional Support & Mental Health Hotlines:
   - Tele-MANAS: 14416 / 1800-891-4416 (24/7 Free Government Psychological Support).
   - National Emergency: 112.
3. Case Context:
   {history_formatted}

Formatting Guidelines:
- DO NOT output ASCII markdown tables (| Col 1 | Col 2 |) because they overflow and wrap poorly on chat screens.
- Format all structured details, schemes, and rights using clean bullet points and bold key-value cards (e.g. • **Adhikar (Right)**: Vivaran).
- Respond in natural, warm, reassuring {language} (Hinglish/Hindi/English).
- Keep text well-spaced and organized.
"""

        messages = [SystemMessage(content=system_instruction)]

        for msg in chat_history[-6:]:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role in ["assistant", "aasra"]:
                messages.append(AIMessage(content=content))

        messages.append(HumanMessage(content=query))

        try:
            ai_msg = self.llm.invoke(messages)
            answer_text = ai_msg.content
        except Exception as e:
            answer_text = (
                "Hum hamesha aapke saath hain. Kisi bhi zaroorat ya emergency ke liye kripya "
                "Tele-MANAS (14416) par baat karein ya aapatkalin number 112 par call karein."
            )

        return {
            "answer": answer_text,
            "sources": [
                "Section 15A, SC/ST (Prevention of Atrocities) Act",
                "Tele-MANAS (14416)",
                "NALSA / DLSA Free Legal Aid"
            ],
            "detected_intent": "support_and_guidance",
            "legal_references": ["Section 15A SC/ST PoA Act", "DLSA Free Legal Aid"],
            "disclaimer": "This guidance is trauma-informed and supportive. In emergencies, call 112 or Tele-MANAS (14416)."
        }

    def stream_query(
        self,
        query: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        victim_context: Optional[Dict[str, Any]] = None,
        language: str = "hi"
    ):
        """Streams response tokens in real-time."""
        chat_history = chat_history or []
        victim_context = victim_context or {}

        history_lines = []
        for session in victim_context.get("history", []):
            history_lines.append(
                f"• [{session.get('date', '')}] User Spoke: \"{session.get('user_text', session.get('transcript', ''))}\""
            )
        history_formatted = "\n".join(history_lines) if history_lines else "No recorded sessions yet."

        system_instruction = f"""You are AI Saathi (आसरा सहायक), an empathetic, warm, helpful, and trauma-informed legal and mental health support AI assistant.

Your purpose is to answer the user's questions about:
1. Legal Rights under Section 15A of the SC/ST (Prevention of Atrocities) Act (Protection against threats/intimidation, police security, free DLSA lawyer).
2. Emotional Support & Hotlines: Tele-MANAS (14416 / 1800-891-4416) and 112.
3. Case Context:
   {history_formatted}

Formatting Guidelines:
- DO NOT output ASCII markdown tables (| Col 1 | Col 2 |) because they overflow and wrap poorly on chat screens.
- Format all structured details, schemes, and rights using clean bullet points and bold key-value cards (e.g. • **Adhikar (Right)**: Vivaran).
- Respond in natural, warm, reassuring {language} (Hinglish/Hindi/English).
- Keep text well-spaced and organized.
"""

        messages = [SystemMessage(content=system_instruction)]

        for msg in chat_history[-6:]:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role in ["assistant", "aasra"]:
                messages.append(AIMessage(content=content))

        messages.append(HumanMessage(content=query))

        try:
            for chunk in self.llm.stream(messages):
                yield chunk.content
        except Exception as e:
            yield "Hum aapke saath hain. Kisi bhi zaroorat mein kripya Tele-MANAS (14416) par baat karein."


chatbot_agent = AasraChatbotAgent()

# 🧠 LLM Mental Health Text Analysis Backend Microservice

A modular backend analysis module and REST microservice built with **Python**, **LangChain**, and **LLMs (Google Gemini / OpenAI / Groq)**. It takes raw text inputs from users, performs qualitative extraction, calculates a **transparent distress score (0–100)**, and outputs clean structured JSON designed for direct ingestion into a **counsellor/admin dashboard** and backend database.

---

## 🔌 Integration Options for the Backend Developer

Your backend developer can integrate this module in **two easy ways**:

### Option 1: Direct Python Package Import (Internal Backend Integration)

If the backend is already in Python (Django / Flask / FastAPI / Celery), simply import and call the pipeline directly:

```python
from app.analyzer import analyzer_pipeline

# 1. Analyze user text
result = analyzer_pipeline.analyze("I haven't slept in weeks and feel completely overwhelmed by exams.")

# 2. Access fields or convert to dictionary / JSON for your database / dashboard
dashboard_payload = result.model_dump()

print(dashboard_payload["distress_score"])              # e.g. 78
print(dashboard_payload["risk_level"])                  # e.g. "high"
print(dashboard_payload["emotions"])                    # e.g. ["sadness", "anxiety"]
print(dashboard_payload["distress_indicators"])         # e.g. ["insomnia", "feeling overwhelmed"]
print(dashboard_payload["intervention_recommendation"]) # e.g. "Counsellor intervention recommended"
```

---

### Option 2: REST API Microservice (HTTP POST `/analyze`)

If the backend is built with Node.js, Spring Boot, Go, Django, etc., run this service as a standalone microservice:

```bash
python main.py
```

#### Request: `POST http://localhost:8000/analyze`
```json
{
  "text": "I've been feeling completely overwhelmed by college lately. I haven't slept properly in weeks and I feel like disappearing from everyone."
}
```

#### Clean JSON Response (Sent to Dashboard / DB)
```json
{
  "sentiment": "negative",
  "emotions": [
    "sadness",
    "anxiety",
    "hopelessness"
  ],
  "distress_indicators": [
    "social withdrawal",
    "insomnia / sleep disturbance",
    "feeling overwhelmed"
  ],
  "distress_score": 78,
  "risk_level": "high",
  "intervention_recommendation": "Counsellor intervention recommended. It is advised to schedule a consultation with a certified mental health counsellor or student welfare officer to receive personalized support.",
  "crisis_flag": false,
  "context_summary": "User reports acute academic stress, persistent insomnia, and feelings of wanting to disappear.",
  "score_breakdown": {
    "sentiment_component": 20,
    "emotions_component": 20,
    "indicators_component": 38,
    "crisis_bonus": 0,
    "total_raw_score": 78,
    "final_score": 78
  },
  "helpline_contacts": {
    "Tele-MANAS (Govt of India 24/7 Helpline)": "14416 / 1800-891-4416",
    "KIRAN Mental Health Helpline": "1800-599-0019",
    "Vandrevala Foundation Helpline": "+91 9999 666 555",
    "AASRA (24/7 Suicide Prevention Helpline)": "+91 98204 66726",
    "National Suicide & Crisis Lifeline (US/Global standard reference)": "988"
  },
  "disclaimer": "Disclaimer: This AI tool provides triage and distress screening support. It is not a clinical or medical diagnosis. For urgent support, contact a mental health professional or emergency helpline."
}
```

---

## 🏗️ Backend Pipeline Architecture

```
User Text (From Chat / Form / DB)
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│           LangChain Signal Extraction Pipeline               │
│  - Extraction System Prompt with Clinical & Emotional Schema │
│  - Multi-Provider Chat LLM (Gemini / OpenAI / Groq)          │
│  - Pydantic Output Parser (Guarantees Validated Fields)      │
└──────────────────────────────┬───────────────────────────────┘
                               │
               Extracted Qualitative Signals:
               • Sentiment ("negative" / "neutral" / "positive")
               • Emotions (["sadness", "anxiety"])
               • Distress Indicators (["social withdrawal", "insomnia"])
               • Crisis Flags (["self_harm_ideation"])
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  Deterministic Scoring Engine                │
│  Score = Sentiment(pts) + Emotions(pts)                      │
│        + Indicators(pts) + Crisis_Bonus                      │
│  Transparently Clamped to [0, 100]                           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  Intervention & Triage Engine                │
│  - Low / Moderate: Self-care & Peer Support                  │
│  - High / Critical: Human Counsellor & 24/7 Helplines        │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│              Structured JSON Output to Dashboard             │
│        (Stored in DB / Rendered on Counsellor Portal)        │
└──────────────────────────────────────────────────────────────┘
```

---

## 📐 Scoring Formula Breakdown

Instead of letting the LLM hallucinate or invent a random score, the score is calculated with this deterministic formula:

$$\text{Distress Score} = \min\Big(100, \max\big(0, S_{\text{sentiment}} + E_{\text{emotions}} + I_{\text{indicators}} + C_{\text{crisis}}\big)\Big)$$

- **Sentiment ($S$)**: Negative `+20`, Neutral `+5`, Positive `0`
- **Emotions ($E$)**: High severity `+16` each, Moderate `+10` each, Protective `-10` each (bounded between `[-10, 35]`)
- **Indicators ($I$)**: High severity `+15` each, Moderate `+10` each (bounded between `[0, 40]`)
- **Crisis Bonus ($C$)**: `+50` bonus points (guarantees minimum score of `80` and sets `crisis_flag = True`)

### Risk Tiers
- `0 - 25`: **Low**
- `26 - 50`: **Moderate**
- `51 - 75`: **High** (Triggers Counsellor Intervention)
- `76 - 100`: **Critical** (Triggers Emergency Escalation & Helplines)

---

## 📂 Project Structure

```
Sentiment_Analysis/
├── app/
│   ├── __init__.py            # Module init
│   ├── config.py              # Settings & .env loading
│   ├── schemas.py             # Pydantic schemas (LLM outputs, API Request/Response)
│   ├── analyzer.py            # LangChain structured output chain & fallback logic
│   ├── scorer.py              # Mathematical distress scoring & risk classification
│   ├── intervention.py        # Safety rules & intervention recommendation generator
│   └── api.py                 # FastAPI backend REST API (/analyze, /health, /docs)
├── tests/
│   ├── __init__.py
│   └── test_analyzer.py       # Unit tests for scoring & pipeline validation
├── .env.example               # Template for API keys
├── requirements.txt           # Dependencies
├── main.py                    # Server runner (uvicorn app.api:app)
├── demo_cli.py                # Standalone CLI tool to test custom text in terminal
└── README.md                  # Backend integration guide & API documentation
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
```ini
LLM_PROVIDER=google
GOOGLE_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-1.5-flash
TEMPERATURE=0.1
PORT=8000
```

### 3. Start Backend Server
```bash
python main.py
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Endpoint: `POST http://localhost:8000/analyze`

### 4. Run Unit Tests
```bash
python -m unittest tests.test_analyzer -v
```

---

## 🛡️ Safety Notice
This module is a **screening and triage support tool**, not a clinical diagnostic system. For high-risk outputs, it systematically routes cases to **human counsellors and verified helplines**.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/548153de-6057-4043-8e71-daf45829776d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   # SIH PROJECT MASTER DOCUMENTATION
# AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities

**Purpose:** This document is the single source of truth for understanding, discussing, designing, pitching, implementing, and evaluating the SIH project.

**Primary audience:** Team members, mentors, developers, AIML members, UI/UX members, PPT/pitch members, judges, reviewers, and other AI assistants.

**Use this document as context when asking another chatbot to understand the project.**

**Version:** 1.0  
**Status:** SIH concept + prototype planning  
**Important:** The official SIH Problem Statement is the authoritative definition of what the organizers expect. Project-specific architecture, USPs, implementation choices, and proposed improvements in this document are our design decisions and should not be represented as official government requirements.

---

# 0. EXECUTIVE SUMMARY

## The project in one sentence

> **A privacy-first AI-powered victim well-being intelligence layer that continuously monitors changes in distress throughout the justice and rehabilitation journey, predicts deterioration early, explains the risk, and connects high-risk cases to appropriate human intervention.**

## The central insight

> **Existing systems track the case. Our system continuously tracks the person behind the case.**

The project does **not** attempt to replace police, courts, NHAA, legal-aid systems, mental-health professionals, emergency services, or rehabilitation mechanisms.

Instead, it adds an intelligence layer over the existing ecosystem:

**Case lifecycle → Victim interactions → Multimodal signals → Dynamic distress trajectory → Early-warning prediction → Explainable alert → Human intervention → Follow-up → Outcome monitoring**

---

# 1. OFFICIAL PROBLEM STATEMENT

## Official SIH title

**AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities**

## Official problem statement — condensed faithfully

Victims of atrocities can experience prolonged psychological distress after complaint registration because of threats, intimidation, repeated court appearances, investigation/trial delays, social ostracisation, economic hardship, and rehabilitation challenges.

Existing mechanisms focus primarily on legal and financial support and do not provide continuous monitoring of victim well-being.

The requested system should:

- periodically interact with victims through chatbot, IVRS, SMS, mobile applications, web portals, or helpline follow-up;
- analyse voice, text, behavioural responses, and engagement patterns;
- use NLP, sentiment analysis and Emotion AI;
- generate a Dynamic Distress Score;
- perform longitudinal trend analysis;
- predict escalation before a crisis;
- alert counsellors, district authorities and designated officials when risk thresholds are crossed;
- recommend interventions such as counselling, medical treatment, witness protection, relocation, financial assistance, legal aid and rehabilitation;
- provide district, State and national dashboards;
- implement explainable AI, privacy protection, security and legal/ethical compliance.

### Priority use cases named by the PS

- victims of rape and gang rape;
- victims of murder, grievous hurt and arson;
- witnesses facing intimidation or threats;
- families affected by caste-based violence.

### Beneficiaries

People receiving relief, compensation, rehabilitation and protection under the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989.

---

# 2. THE PROBLEM IN SIMPLE LANGUAGE

An atrocity does not necessarily end when the incident ends.

A victim can move through:

**Incident → Complaint → Investigation → Court → Compensation → Rehabilitation**

while their psychological condition simultaneously moves through:

**Fear → distress → uncertainty → deterioration or recovery**

The administrative system can know that:

- an FIR exists;
- investigation is pending;
- a hearing occurred;
- compensation is pending;
- a grievance was closed.

But it may not continuously know:

- whether the victim's distress is increasing;
- whether fear or intimidation is becoming more severe;
- whether the victim is disengaging;
- whether repeated case events are associated with worsening well-being;
- whether previously provided support helped;
- whether a human professional should follow up sooner.

This is the core gap the project addresses.

---

# 3. IMPORTANT POSITIONING: WHAT THE PROJECT IS NOT

The project is **NOT**:

- a replacement for mental-health professionals;
- an AI psychiatrist;
- an AI that diagnoses depression or PTSD;
- a replacement for NHAA;
- a replacement for police/courts;
- a replacement for Tele-MANAS;
- an emergency-response replacement for 112;
- an autonomous system that decides legal, clinical, protection or relocation actions;
- a generic mental-health chatbot;
- a generic sentiment-analysis dashboard.

The project **IS**:

> **An AI-assisted early-warning and decision-support system for victim well-being, operating alongside existing government systems and human professionals.**

---

# 4. WHY DOES THE PROBLEM OCCUR?

The problem is structural rather than caused by one missing application.

## 4.1 Trauma can persist after the incident

The physical incident may end, but victims can continue experiencing fear, uncertainty, social pressure, financial stress and other forms of distress.

## 4.2 The justice process can itself create stress

The victim may have to:

- repeatedly interact with authorities;
- attend court proceedings;
- deal with delays;
- respond to threats;
- wait for compensation;
- manage family and economic consequences;
- continue living in the same social environment.

## 4.3 Mental state is dynamic

A one-time assessment gives a snapshot.

The SIH PS explicitly asks for a **Dynamic Distress Score** and **longitudinal trend analysis**.

Therefore, the system should care about:

**current state + change over time + context + engagement pattern**

rather than only one score.

## 4.4 Support is distributed

A victim can interact with:

**Police → Courts → District administration → Legal aid → Counsellors → Health services → Rehabilitation**

Different services have different responsibilities.

The opportunity is to create a victim-well-being intelligence layer that can help route information and recommendations without replacing those institutions.

---

# 5. EXISTING ECOSYSTEM

A credible SIH solution must acknowledge that India already has substantial support infrastructure.

## 5.1 NHAA — National Helpline Against Atrocities, 14566

NHAA is central to the problem context.

It is associated with atrocity-related grievance access, tracking, routing/escalation and monitoring. Government material also describes integration with case-related digital infrastructure.

### Project implication

Do **not** say:

> "There is no digital system for atrocity victims."

Instead say:

> **"Existing atrocity-grievance infrastructure can be augmented with a victim well-being intelligence layer."**

---

## 5.2 ICJS / police and case systems

Existing justice infrastructure manages information associated with FIRs, investigations and criminal-justice processes.

### Project implication

Our system should conceptually integrate with approved case metadata rather than recreate the entire case-management system.

---

## 5.3 SC/ST Prevention of Atrocities Act framework

The legal framework includes victim and witness rights, protection, relief, rehabilitation and special judicial mechanisms.

Section 15A is especially relevant because it establishes rights relating to protection and fair treatment of victims and witnesses.

### Project implication

Our system should be framed as supporting the implementation of victim-centred protections, not replacing legal rights.

---

## 5.4 NALSA / legal services

Legal Services Authorities provide legal aid to eligible people.

### Project implication

A risk recommendation may route a case toward legal-support follow-up when appropriate, but the AI should not independently make legal decisions.

---

## 5.5 112 Emergency Response Support System

112 is designed for immediate emergencies and can receive emergency signals through channels including voice, SMS, web and app mechanisms.

### Project implication

112 is an **emergency-response system**.

Our system is primarily an **early-warning system**.

The distinction:

**112:** "There is an emergency now."

**Our system:** "The victim's condition is deteriorating and human intervention may be required before the situation becomes an emergency."

In critical situations, the proposed system can recommend escalation through appropriate authorized emergency pathways.

---

## 5.6 Tele-MANAS

Tele-MANAS provides 24×7 tele-mental-health support, counselling, referral and follow-up pathways.

### Project implication

We should not build another counselling service.

Instead:

**Our AI detects/ranks potential need → authorized professional/service receives referral → professional provides care.**

This makes the project complementary.

---

## 5.7 One Stop Centres

For women affected by violence, One Stop Centres provide integrated support such as medical, legal, counselling, police assistance and shelter-related services.

### Project implication

The project can recommend or route toward appropriate existing support services rather than duplicating them.

---

# 6. THE CORE GAP

The ecosystem can be simplified as:

```text
                EXISTING ECOSYSTEM

Complaint / FIR
       ↓
Investigation
       ↓
Court / Trial
       ↓
Relief / Compensation
       ↓
Rehabilitation

Parallel support:
Legal aid / counselling / health / emergency / protection
```

The missing intelligence layer is:

```text
            VICTIM WELL-BEING LAYER

Victim interaction
       ↓
Text / Voice / Behaviour
       ↓
Current distress
       ↓
Longitudinal trend
       ↓
Risk prediction
       ↓
Explainability
       ↓
Intervention recommendation
       ↓
Human action
       ↓
Follow-up
       ↓
Outcome
```

---

# 7. GAP ANALYSIS

## GAP 1 — Case-centric rather than victim-centric

### Existing orientation
"What is the status of the case?"

### Proposed orientation
"What is the current well-being trajectory of the victim?"

### USP
**Victim Well-being Intelligence Layer**

---

## GAP 2 — Snapshot rather than longitudinal monitoring

A single score:

**Distress = 50**

does not reveal whether the person is improving or deteriorating.

Our system tracks:

```text
Day 1      32
Day 15     37
Day 30     44
Day 60     59
Day 75     72
```

The important signal is not merely 72.

It is:

> **The trajectory is deteriorating.**

### USP
**Dynamic Distress Trajectory**

---

## GAP 3 — Reactive rather than predictive

Traditional support often activates after a complaint, explicit request or visible crisis.

The proposed system searches for early indicators:

```text
Fear indicators ↑
Negative distress indicators ↑
Engagement ↓
Recent high-stress event
       ↓
Risk trajectory increasing
       ↓
Human review
```

### USP
**Predictive Early Warning**

---

## GAP 4 — Fragmented support ecosystem

A victim may interact with many agencies.

The project can provide a common well-being intelligence layer without replacing institutional ownership.

### USP
**Cross-service victim well-being coordination**

---

## GAP 5 — Case events are disconnected from well-being

Potentially relevant events include:

- reported intimidation;
- court-related events;
- investigation delays;
- compensation/rehabilitation issues.

The system can show these alongside the well-being timeline.

### Important language

Do not claim:

> "The court hearing caused the distress."

Instead say:

> **"Distress increased following/alongside a recent court-related event."**

Use "associated with" or "contributing indicator" unless causality has been clinically/research validated.

### USP
**Justice-Aware Contextual Monitoring**

---

## GAP 6 — Generic mental-health AI lacks justice context

A generic chatbot may identify sadness, anxiety or negative sentiment.

Our system adds:

**Justice context + historical trajectory + victim-specific signals**

### USP
**Justice-Aware Multimodal AI**

---

## GAP 7 — Detection without action

A weak system ends at:

**Risk = 82**

A useful system continues:

**Risk = 82 → explain → recommend → human review → intervention**

### USP
**AI-to-Action Intervention Engine**

---

## GAP 8 — No closed-loop outcome measurement

Our proposed loop:

```text
Detect
  ↓
Explain
  ↓
Recommend
  ↓
Human review
  ↓
Intervention
  ↓
Follow-up
  ↓
Measure outcome
  ↓
Continue / escalate
```

### USP
**Closed-Loop Victim Support**

---

## GAP 9 — Single-channel assumptions

The PS itself identifies:

- chatbot;
- IVRS;
- SMS;
- mobile app;
- web portal;
- helpline follow-up.

Different victims may have different access, literacy, language and connectivity constraints.

The important innovation is not merely multiple interfaces.

It is:

> **All approved channels contribute to one longitudinal victim profile.**

### USP
**Omnichannel + multilingual continuity**

---

## GAP 10 — Black-box risk

Officials need to understand:

**Why did the risk increase?**

Therefore the system should expose:

- contributing indicators;
- trend;
- confidence;
- data quality;
- relevant recent changes.

### USP
**Explainable Risk Intelligence**

---

## GAP 11 — Extreme sensitivity of data

The system may handle highly sensitive information.

Therefore privacy is not a checkbox.

It must influence:

- data collection;
- storage;
- processing;
- access;
- retention;
- logging;
- dashboards;
- model training.

### USP
**Privacy-by-Architecture**

---

# 8. THE SIX CORE USPs

Do not present 15 unrelated technical features to judges.

Consolidate them into six memorable USPs.

## USP 1 — Victim Well-being Intelligence Layer

> **Existing systems track the case; we track the person behind the case.**

Works alongside existing systems rather than replacing them.

---

## USP 2 — Dynamic Distress Trajectory

Moves from:

**snapshot → trajectory**

Example:

**31 → 42 → 60 → 74 → rapid deterioration**

---

## USP 3 — Justice-Aware Multimodal AI

Combines:

- text;
- voice/acoustic features;
- behavioural/engagement patterns;
- historical trend;
- case context.

---

## USP 4 — Predictive Early Warning

Moves from:

**crisis response → early intervention**

The objective is to identify deterioration early enough for human action.

---

## USP 5 — AI-to-Action Closed Loop

**Detect → Explain → Recommend → Human review → Intervene → Follow up → Measure**

---

## USP 6 — Privacy + Explainability

Combines:

- role-based access;
- data minimization;
- auditability;
- explainable indicators;
- confidence/data-quality information;
- human-in-the-loop decisions.

---

# 9. SYSTEM CONCEPT

## High-level architecture

```text
                 EXISTING GOVERNMENT ECOSYSTEM
                 NHAA / ICJS / APPROVED DATA
                              │
                              ▼
                    VICTIM INTERACTION LAYER
               Chat / IVRS / SMS / Voice / App
                              │
                              ▼
                  MULTIMODAL SIGNAL PROCESSING
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
             TEXT           VOICE        BEHAVIOUR
               │              │              │
               └──────────────┼──────────────┘
                              ▼
                       CONTEXT ENGINE
                              │
                  History + Case Context
                              ▼
                    DYNAMIC DISTRESS ENGINE
                              │
                              ▼
                    LONGITUDINAL TREND
                              │
                              ▼
                     RISK PREDICTION
                              │
                              ▼
                       EXPLAINABILITY
                              │
                              ▼
                  INTERVENTION RECOMMENDER
                              │
                              ▼
                       HUMAN REVIEW
                              │
                              ▼
                      HUMAN INTERVENTION
                              │
                              ▼
                     FOLLOW-UP ASSESSMENT
                              │
                              ▼
                      OUTCOME MONITORING
                              │
                              └──── Feedback
```

---

# 10. VICTIM INTERACTION LAYER

The system should support the channels named in the PS conceptually:

- chatbot;
- IVRS/voice;
- SMS;
- mobile application;
- web portal;
- approved helpline follow-up.

## Design principle

Do not force every victim into a smartphone application.

The interaction layer should adapt to available access.

Example:

```text
Monday → IVRS
Thursday → SMS
Next week → Chat
          ↓
Same victim profile
          ↓
Updated trajectory
```

---

# 11. PERIODIC CHECK-IN DESIGN

A check-in should be:

- short;
- accessible;
- multilingual;
- non-threatening;
- optional where appropriate;
- designed for longitudinal consistency.

Example conceptual flow:

```text
How have you been feeling since the last interaction?

    ↓

Have you felt unusually afraid or unsafe?

    ↓

Has anything related to the case caused significant stress recently?

    ↓

Would you like to speak to someone?

    ↓

Optional free-text / voice response
```

The exact questions must ultimately be designed/validated with mental-health professionals and appropriate government stakeholders.

The prototype may use synthetic demonstration questions.

---

# 12. MULTIMODAL AI

## 12.1 Text signals

Potential features:

- sentiment;
- emotion indicators;
- fear-related language;
- hopelessness-related language;
- distress-related semantic patterns;
- changes from previous interactions.

### Important

Sentiment is **not** equivalent to mental illness.

---

## 12.2 Voice/acoustic signals

Potential acoustic features:

- speech rate;
- pause frequency/duration;
- pitch variation;
- energy;
- response duration;
- other validated acoustic features.

### Important

Voice features are signals, not diagnoses.

Do not claim:

> "High pitch means the victim is distressed."

Instead:

> "Acoustic features contribute to a broader risk estimation model."

---

## 12.3 Behaviour/engagement signals

Potential signals:

- missed check-ins;
- response frequency;
- response latency;
- interaction duration;
- sudden engagement changes.

### Important

Non-response does **not** equal mental distress.

It may indicate:

- lack of network;
- phone unavailable;
- relocation;
- privacy concerns;
- unwillingness to interact;
- other reasons.

Therefore:

> **Engagement anomalies should trigger follow-up, not diagnosis.**

---

## 12.4 Context signals

Potential contextual information:

- case stage;
- recent threat/intimidation report;
- court-related event;
- compensation/rehabilitation status;
- previous intervention;
- previous distress trend.

Context should support interpretation, not be treated as proof of psychological causation.

---

# 13. DYNAMIC DISTRESS SCORE

The system can maintain a prototype score such as:

**DDS = 0–100**

Example conceptual bands:

| Score | Prototype interpretation | Suggested system behaviour |
|---:|---|---|
| 0–25 | Low | Routine monitoring |
| 26–50 | Moderate | Increased monitoring |
| 51–75 | High | Human/counsellor review |
| 76–100 | Critical | Urgent human assessment/escalation |

### Important

These thresholds are **prototype policy values**, not clinically validated thresholds.

In production they must be validated/calibrated with qualified mental-health professionals, validated instruments, government stakeholders and real-world evidence.

---

# 14. LONGITUDINAL TREND ENGINE

The trend engine is one of the strongest components.

Example:

```text
Assessment 1: 31
Assessment 2: 37
Assessment 3: 43
Assessment 4: 58
Assessment 5: 72
```

The system can derive:

- current level;
- rate of change;
- recent change;
- direction;
- persistence;
- sudden spikes;
- confidence in the trend.

Possible states:

**Stable**

```text
35 → 36 → 34 → 37
```

**Gradual deterioration**

```text
31 → 39 → 48 → 57 → 68
```

**Sudden deterioration**

```text
42 → 44 → 43 → 81
```

---

# 15. MULTI-DIMENSIONAL VULNERABILITY

A single score can hide useful information.

A future version could maintain separate dimensions:

```text
Psychological distress     72 ↑
Safety/threat risk         81 ↑
Social vulnerability       64 →
Economic stress            58 ↑
Engagement deterioration   76 ↓
```

Then calculate an overall **priority/risk representation**.

### Important

These dimensions are not necessarily clinical diagnoses.

Economic stress, social isolation and engagement are contextual risk factors.

---

# 16. JUSTICE-AWARE WELL-BEING TIMELINE

A core dashboard concept:

```text
Complaint
    │
    ├── Distress 31
    │
Investigation
    │
    ├── Distress 35
    │
Threat reported
    │
    ├── Distress 55
    │
Court-related event
    │
    ├── Distress 69
    │
Compensation delay
    │
    └── Distress 74
```

The dashboard should say:

> **"Risk increased following recent high-stress case events."**

Not:

> "The event caused the mental-health problem."

---

# 17. PREDICTIVE RISK ENGINE

The predictive layer should use:

**Current state + historical trend + recent changes + contextual signals + engagement**

Conceptually:

```text
Current distress
      +
Rate of change
      +
Recent events
      +
Behavioural changes
      +
Historical pattern
      ↓
Future risk estimate
```

Possible outputs:

- stable;
- improving;
- deteriorating;
- high-risk trajectory;
- critical trajectory.

---

# 18. EXPLAINABLE AI

Every high-risk prediction should have a reason panel.

Example:

```text
RISK: HIGH

Contributing indicators:
✓ Distress increased significantly from baseline
✓ Fear-related language increased
✓ Engagement declined
✓ Recent intimidation-related interaction
✓ Repeated distress indicators

Confidence: Moderate
Data quality: Moderate
Human review: Required
```

The system should distinguish:

### Model prediction
"What the model estimates."

from:

### Human decision
"What the authorized professional decides."

---

# 19. CONFIDENCE + DATA QUALITY

The system should not act equally confident with one interaction and twenty interactions.

Example:

```text
Risk: HIGH
Confidence: 68%
Data quality: Moderate
Observations: 6
Trend reliability: Moderate
```

This prevents false precision.

A useful principle:

> **Low-quality evidence should reduce confidence, not produce a falsely precise score.**

---

# 20. INTERVENTION ENGINE

The AI should map patterns to possible support pathways.

Examples:

### High distress + intimidation indicators

Possible recommendation:

- counsellor review;
- safety/protection assessment.

### High distress + court-related stress

Possible recommendation:

- counselling;
- legal-support follow-up.

### High distress + economic hardship

Possible recommendation:

- counselling;
- rehabilitation/financial-support review.

### Critical psychological risk

Possible recommendation:

- immediate human professional assessment;
- appropriate emergency/escalation pathway.

### Critical rule

The AI **recommends and prioritizes**.

It does not autonomously decide:

- medical treatment;
- police action;
- relocation;
- witness-protection eligibility;
- legal outcomes.

---

# 21. CLOSED-LOOP CARE

This is a major differentiator.

Weak system:

**Detect → Alert**

Our proposed system:

```text
Detect
  ↓
Explain
  ↓
Recommend
  ↓
Human review
  ↓
Intervention
  ↓
Follow-up
  ↓
Measure change
  ↓
Continue / escalate
```

Example:

```text
Risk 78
  ↓
Counselling
  ↓
7-day follow-up
  ↓
Risk 58
  ↓
Improving
```

Alternative:

```text
Risk 78
  ↓
Intervention
  ↓
Risk 82
  ↓
No improvement
  ↓
Escalate
```

---

# 22. DASHBOARDS

## 22.1 Victim-level dashboard

Possible display:

```text
Victim ID: V-1048

Current distress       72 ↑
Threat/safety          81 ↑
Engagement             76 ↓

Trajectory: Rapidly deteriorating

Recent contributing indicators:
- increased fear indicators
- reduced engagement
- recent intimidation-related report

Recommended:
Counsellor review + safety assessment

Human review: Pending
```

---

## 22.2 District dashboard

Possible metrics:

```text
Active monitored cases       1,284
Low risk                       812
Moderate                       298
High                           143
Critical                        31
Rapidly deteriorating           47
Pending intervention            18
```

Possible filters:

- district;
- case stage;
- risk;
- trend;
- intervention status;
- follow-up overdue.

---

## 22.3 State dashboard

Aggregated:

- district-level trends;
- intervention response;
- unresolved high-risk cases;
- average response time;
- support completion;
- trend distribution.

---

## 22.4 National dashboard

Prefer highly aggregated/anonymized information:

- regional trends;
- risk distribution;
- intervention effectiveness;
- response times;
- policy-level indicators.

Avoid unnecessary personal information.

---

# 23. ROLE-BASED ACCESS

Different users should see different information.

## Victim

- own support status;
- available services;
- appointments/follow-up;
- consent/privacy information.

## Counsellor / mental-health professional

Potentially:

- relevant interaction history;
- distress indicators;
- trend;
- intervention history.

## District authority

Potentially:

- risk;
- trend;
- priority;
- intervention status;
- relevant case-management information.

## State authority

Primarily:

- aggregated trends;
- district comparisons;
- service performance.

## National policy level

Primarily:

- aggregated/anonymized analytics.

---

# 24. PRIVACY-BY-ARCHITECTURE

Sensitive data should be treated as a first-class design concern.

## Principles

- data minimization;
- purpose limitation;
- role-based access;
- encryption;
- audit logs;
- controlled retention;
- pseudonymization where appropriate;
- least-privilege access;
- secure integration;
- human oversight;
- explicit governance.

## Conceptual architecture

```text
Raw interaction
      ↓
Secure processing layer
      ↓
Feature extraction
      ↓
Risk representation
      ↓
Restricted raw-data access
      ↓
Role-based dashboards
```

The objective is to avoid unnecessarily exposing raw conversations when an official only needs:

**Risk + trend + action status**

---

# 25. HUMAN-IN-THE-LOOP

Human oversight is mandatory for high-impact decisions.

The system should follow:

```text
AI detects
    ↓
AI explains
    ↓
AI recommends
    ↓
Authorized human reviews
    ↓
Human decides
```

The project should never market itself as fully autonomous mental-health decision making.

---

# 26. DATA STRATEGY

## The biggest prototype challenge

Real longitudinal psychological data from atrocity victims is extremely sensitive and unlikely to be available to a student hackathon team.

Therefore:

### Prototype

Use:

- synthetic data;
- simulated victim journeys;
- controlled/anonymized demonstrations;
- publicly available datasets only where their licenses and intended use permit it.

### Production

Would require:

- government authorization;
- lawful data processing;
- clinically appropriate labels/protocols;
- expert validation;
- secure infrastructure;
- approved integration;
- appropriate consent/governance.

## Never claim

> "Our model has 95% accuracy on real atrocity victims"

unless such a dataset and validation genuinely exist.

---

# 27. CLINICAL SAFETY POSITIONING

This is not a clinical diagnostic system.

Use terminology such as:

- distress-risk estimation;
- vulnerability indicators;
- early-warning signal;
- intervention prioritization;
- human review.

Avoid unsupported claims such as:

- diagnosing depression;
- diagnosing PTSD;
- predicting suicide with certainty;
- detecting mental illness from voice alone.

The system is a **decision-support tool**, not a doctor.

---

# 28. AI/ML IMPLEMENTATION STRATEGY

The prototype does not need an enormous foundation model.

## Text/NLP

Possible approaches:

- multilingual transformer embeddings;
- sentiment/emotion classifiers;
- semantic similarity;
- keyword + context features;
- lightweight LLM assistance for summarization, if privacy constraints permit in the prototype.

## Voice

Extract acoustic features such as:

- pitch;
- energy;
- speaking rate;
- pauses;
- duration.

Then combine them with other features.

## Behaviour

Create features such as:

- missed check-ins;
- response delay;
- interaction frequency;
- interaction duration;
- engagement change.

## Risk model

Prototype options:

- Logistic Regression;
- Random Forest;
- XGBoost;
- interpretable hybrid scoring model.

A hybrid system is acceptable for a prototype:

```text
Validated/structured indicators
        +
ML prediction
        +
Policy rules
        ↓
Risk engine
```

---

# 29. WHY NOT USE ONLY AN LLM?

An LLM can help with:

- conversation;
- summarization;
- multilingual understanding;
- extracting structured indicators.

But the LLM should not be the entire risk engine.

Better:

```text
LLM/NLP
   ↓
Structured features
   ↓
Risk model
   ↓
Policy thresholds
   ↓
Explainable result
```

This improves:

- reproducibility;
- explainability;
- controllability;
- evaluation;
- safety.

---

# 30. PROTOTYPE TECHNOLOGY STACK

A practical stack could be:

## Frontend

- React
- Vite
- Tailwind CSS
- Charting library

## Backend

- Node.js + Express

or

- FastAPI for ML APIs

## Database

- PostgreSQL / Supabase

## ML

- Python
- Pandas
- NumPy
- Scikit-learn
- transformer/NLP libraries as required

## Voice

- speech-to-text;
- acoustic feature extraction;
- text-to-speech for IVRS simulation where required.

## Authentication

- role-based authentication;
- secure sessions/tokens.

## Deployment

For prototype:

- Vercel/Netlify-style frontend;
- secure backend hosting;
- managed database.

For real deployment:

- government-approved infrastructure and security architecture.

---

# 31. MVP VS FUTURE SYSTEM

## MVP — SIH

Build:

1. victim interaction interface;
2. synthetic victim dataset;
3. NLP analysis;
4. optional voice/acoustic demo;
5. dynamic distress score;
6. longitudinal graph;
7. case-event timeline;
8. explainable risk panel;
9. intervention recommendation;
10. district dashboard;
11. role-based UI;
12. closed-loop follow-up simulation.

## Phase 2

Add:

- multilingual voice;
- IVRS;
- better behavioural modelling;
- stronger prediction;
- real service directory;
- intervention tracking.

## Production Phase

Add only after government authorization and validation:

- approved NHAA/ICJS integration;
- secure government identity mapping;
- validated mental-health protocols;
- clinical validation;
- real-world monitoring;
- governance/audit infrastructure.

---

# 32. THE IDEAL DEMO STORY

Do not demo random features.

Tell one victim's story.

## Step 1 — Case registration

Victim enters the monitored ecosystem.

Baseline:

**Distress = 34**

---

## Step 2 — First follow-up

Victim interacts through Hindi chat/voice.

Score:

**39**

---

## Step 3 — New case event

A high-stress event occurs.

Victim reports increased fear.

Score:

**55**

---

## Step 4 — Engagement declines

Responses become shorter and check-ins are missed.

Score:

**67**

---

## Step 5 — AI identifies trajectory

```text
Risk: HIGH
Trend: Rapidly deteriorating

Indicators:
- increasing fear-related language
- reduced engagement
- significant change from baseline
- recent high-stress case event
```

---

## Step 6 — Intervention recommendation

```text
Counsellor review
+
Safety/protection assessment
```

Human approval required.

---

## Step 7 — Follow-up

After intervention:

**67 → 51**

System marks:

**Improving**

---

## Step 8 — Dashboard

District official sees:

**High-risk case requiring attention**

without unnecessarily exposing all raw conversation content.

---

# 33. THE "WOW" SCREEN

The strongest UI screen should probably be:

## Victim Well-being Timeline

```text
                DISTRESS
                   ↑
80 |                         ●
70 |                    ●
60 |               ●
50 |          ●
40 |     ●
30 | ●
   +------------------------------------→ TIME

     Complaint   Threat   Hearing   Delay
```

Below it:

**Current:** 72 — HIGH  
**Trend:** ↑ Rapid deterioration  
**Confidence:** Moderate

**Top contributing indicators:**

- fear-related language ↑
- engagement ↓
- recent intimidation-related event
- distress above baseline

**Recommended action:**

Counsellor review + safety assessment

This single screen demonstrates:

**Monitoring + AI + trend + context + explainability + intervention.**

---

# 34. PROJECT DIFFERENTIATION

## Generic mental-health chatbot

```text
User → chatbot → response
```

## Generic sentiment system

```text
Text → sentiment → score
```

## Generic government case-management system

```text
Case → status → workflow
```

## Our system

```text
Victim
  ↓
Multiple channels
  ↓
Text + Voice + Behaviour
  ↓
Historical trajectory
  ↓
Justice context
  ↓
Dynamic distress
  ↓
Prediction
  ↓
Explainability
  ↓
Intervention
  ↓
Follow-up
  ↓
Outcome
```

That is the difference.

---

# 35. WHAT MAKES THE PROJECT INNOVATIVE?

The innovation is not any single technology.

NLP is not new.

Sentiment analysis is not new.

Voice analysis is not new.

Chatbots are not new.

Dashboards are not new.

The innovation is the **system-level combination**:

> **Existing atrocity-case ecosystem + continuous victim interaction + multimodal distress indicators + longitudinal trajectory + justice context + predictive early warning + explainability + intervention routing + closed-loop outcome monitoring + privacy-first architecture.**

That is the innovation story.

---

# 36. WHAT SHOULD NOT BE A PRIMARY USP?

Do not lead with:

- "We use AI";
- "We use NLP";
- "We use Emotion AI";
- "We use XGBoost";
- "We have a chatbot";
- "We have a dashboard";
- "We use multilingual AI."

Those are implementation components.

The real USPs are:

1. **Victim-centric intelligence**
2. **Dynamic trajectory**
3. **Justice-aware multimodal prediction**
4. **Early warning**
5. **AI-to-action closed loop**
6. **Privacy + explainability**

---

# 37. IMPACT

## Individual level

- earlier recognition of deterioration;
- faster human follow-up;
- easier access to appropriate support;
- continuity across the case lifecycle.

## Administrative level

- prioritization of high-risk cases;
- visibility into unresolved vulnerable cases;
- intervention tracking;
- reduced dependence on manual identification.

## System level

- stronger coordination;
- evidence-based resource allocation;
- better monitoring of victim support;
- measurement of intervention outcomes.

## Policy level

Aggregated analytics can potentially help identify:

- recurring stress points;
- districts requiring additional support;
- intervention response patterns;
- service bottlenecks.

---

# 38. IMPORTANT ETHICAL RISKS

## Risk 1 — False positives

AI may flag a victim who is not actually at high risk.

### Mitigation
Human review + confidence indicators + no autonomous action.

## Risk 2 — False negatives

AI may miss someone who needs help.

### Mitigation
Multiple channels + periodic check-ins + professional escalation + never treating AI as the only safety mechanism.

## Risk 3 — Misinterpretation of silence

No response does not automatically mean distress.

### Mitigation
Treat disengagement as a follow-up signal.

## Risk 4 — Bias

Language, culture, accent, socioeconomic conditions and communication style can affect model performance.

### Mitigation
Diverse validation + multilingual evaluation + fairness monitoring + human review.

## Risk 5 — Privacy breach

Sensitive victim information could cause additional harm.

### Mitigation
Minimization + access control + encryption + auditability + retention governance.

## Risk 6 — Automation bias

Officials may blindly trust the AI.

### Mitigation
Show confidence, contributing indicators and "human review required."

---

# 39. MODEL EVALUATION

Do not evaluate only with accuracy.

Useful metrics:

## Classification

- precision;
- recall;
- F1;
- ROC-AUC where appropriate.

For high-risk detection, **recall/sensitivity** may be particularly important, but the operating threshold must be determined responsibly.

## Calibration

If the system says 80% risk, does that probability actually correspond to an appropriate observed frequency?

## Fairness

Compare performance across relevant language/demographic groups where lawful and appropriate.

## Longitudinal performance

Evaluate whether the model detects meaningful changes without excessive false alarms.

## Operational metrics

- alert response time;
- intervention completion;
- follow-up rate;
- unresolved high-risk cases.

## Human-centred metrics

- usefulness to counsellors;
- explainability;
- trust;
- workload reduction.

---

# 40. SUCCESS METRICS FOR THE SYSTEM

Potential KPIs:

### Monitoring

- percentage of active victims successfully reached;
- follow-up completion rate.

### Detection

- high-risk detection sensitivity;
- false-alert rate;
- deterioration detection lead time.

### Response

- average time from alert to human review;
- intervention completion rate.

### Outcome

- change in distress trajectory after intervention;
- percentage of cases stabilized;
- percentage requiring escalation.

### Administration

- unresolved high-risk cases;
- overdue follow-ups;
- district-level response performance.

---

# 41. GOVERNMENT INTEGRATION VISION

The project should be presented as an **augmentation layer**.

Conceptually:

```text
NHAA / approved case systems
            ↓
Approved API / secure data exchange
            ↓
Data minimization
            ↓
Victim Well-being Intelligence
            ↓
Risk + intervention status
            ↓
Authorized government/counsellor workflows
```

Do not claim that the team currently has access to NHAA or ICJS.

For SIH:

> **Prototype integration is simulated. Production integration would require government authorization and approved interfaces.**

---

# 42. IMPLEMENTATION ROADMAP

## Phase 1 — Prototype

Synthetic data + simulated case lifecycle.

## Phase 2 — Expert validation

Mental-health professionals validate:

- check-in design;
- indicators;
- risk interpretation;
- intervention pathways.

## Phase 3 — Controlled pilot

Small authorized pilot with strict governance.

## Phase 4 — Government integration

Approved APIs, security architecture and service integration.

## Phase 5 — Scale

District → State → national deployment.

---

# 43. WHAT THE TEAM SHOULD BUILD FIRST

Priority order:

### P0 — Must have

- victim interaction;
- distress score;
- trend;
- risk;
- explanation;
- intervention;
- follow-up;
- dashboard.

### P1 — Strong differentiators

- multilingual interaction;
- voice;
- case-event timeline;
- confidence/data quality;
- role-based views.

### P2 — Future

- real IVRS;
- advanced voice models;
- government API integration;
- advanced predictive modelling;
- large-scale policy analytics.

Do not let P2 features prevent a working P0 prototype.

---

# 44. PRESENTATION STRUCTURE FOR SIH

A strong 5-minute story:

## Slide 1 — Human problem

> "The case may progress, while the victim silently deteriorates."

## Slide 2 — Existing ecosystem

Show NHAA, legal aid, emergency response, mental-health support, rehabilitation.

Then say:

> **These systems support the victim. But where is the continuous well-being signal?**

## Slide 3 — Gap

**Case-centric → Victim-centric**

**Reactive → Predictive**

**Fragmented → Connected**

## Slide 4 — Solution

Show architecture.

## Slide 5 — Six USPs

Only the six core USPs.

## Slide 6 — Demo

Show one victim trajectory.

## Slide 7 — Impact + feasibility

Synthetic prototype → expert validation → authorized government deployment.

## Final line

> **"Existing systems track the case. We continuously track the person behind the case."**

---

# 45. JUDGE QUESTIONS AND ANSWERS

## Q1. "Why can't NHAA do this?"

**Answer:**

NHAA already provides an important grievance and case-related support layer. Our proposal does not replace it. We add a specialized victim well-being intelligence layer that continuously analyses changes in distress, predicts deterioration and routes cases toward human intervention.

---

## Q2. "Where will you get the data?"

**Answer:**

The SIH prototype uses synthetic/anonymized demonstration data. Real deployment would require government-authorized datasets, validated clinical protocols, expert oversight and secure integration.

---

## Q3. "Can AI diagnose mental illness?"

**Answer:**

No. Our system performs AI-assisted distress-risk estimation and prioritization. It is not a diagnostic tool. High-risk outputs require human review.

---

## Q4. "What happens when AI predicts high risk?"

**Answer:**

The system explains the contributing indicators and recommends an appropriate intervention. An authorized human professional decides the actual action.

---

## Q5. "How is this different from Tele-MANAS?"

**Answer:**

Tele-MANAS provides mental-health support and referral. Our system focuses on continuous, case-contextual early detection and prioritization of victims who may need that support. We can route high-risk cases toward existing services rather than duplicate them.

---

## Q6. "How is this different from 112?"

**Answer:**

112 is an emergency-response system. Our system focuses on detecting deterioration before it necessarily becomes an immediate emergency. Critical situations can be escalated through existing emergency pathways.

---

## Q7. "Why voice analysis?"

**Answer:**

The PS explicitly calls for voice analysis. We treat acoustic characteristics as one signal among several, not as a standalone diagnosis.

---

## Q8. "What if the victim stops responding?"

**Answer:**

Non-response is not treated as proof of distress. It becomes an engagement anomaly that can trigger an appropriate follow-up mechanism, subject to privacy, consent and operational rules.

---

## Q9. "What if the model is wrong?"

**Answer:**

We use human-in-the-loop decisions, confidence indicators, explainability, multiple signals and no autonomous high-impact decisions.

---

## Q10. "Why not just make a mental-health chatbot?"

**Answer:**

Because the problem is not simply access to a chatbot. The PS asks for continuous monitoring, longitudinal prediction, case-context understanding, risk alerts and intervention coordination. Our system addresses the entire loop.

---

# 46. STRONGEST PITCH

## Problem

> **"When an atrocity happens, the justice system creates a case file. But trauma does not follow the case file."**

Victims may face threats, repeated court appearances, delays, social pressure and financial hardship throughout the justice journey. Existing systems provide legal, emergency, mental-health and rehabilitation support, but the victim's changing psychological state is not continuously represented as an actionable signal.

## Solution

> **We propose a privacy-first AI-powered Victim Well-being Intelligence Layer that works alongside existing government systems.**

It periodically interacts with victims through approved channels, analyses text, voice and engagement signals, combines them with longitudinal and case-context information, generates a dynamic distress trajectory, predicts deterioration, explains the risk and routes high-risk cases to appropriate human support.

## Differentiation

> **We move the system from case tracking to victim tracking, from snapshots to trajectories, from reactive response to early warning, and from prediction to closed-loop intervention.**

---

# 47. THE ONE-SENTENCE VERSION

> **A privacy-first AI system that continuously monitors and predicts changes in atrocity victims' psychological distress throughout the justice journey and converts early warning signals into explainable, human-reviewed interventions.**

---

# 48. THE 30-SECOND VERSION

> Victims can continue experiencing fear and psychological distress long after an atrocity, especially during investigation, court proceedings, delays and rehabilitation. Existing government systems provide legal, emergency, financial and mental-health support, but they do not create a continuous well-being trajectory. Our system adds an AI-powered layer that interacts with victims through multiple channels, analyses text, voice and behavioural signals, tracks a Dynamic Distress Score, predicts deterioration, explains why risk is rising and routes high-risk cases to human professionals. It is not a replacement for existing services; it makes those services more proactive.

---

# 49. THE CORE PRODUCT PHILOSOPHY

### Principle 1
**AI assists; humans decide.**

### Principle 2
**Risk is not diagnosis.**

### Principle 3
**Privacy is part of the architecture.**

### Principle 4
**A trend is more useful than a snapshot.**

### Principle 5
**Prediction must lead to action.**

### Principle 6
**Existing government systems should be augmented, not unnecessarily duplicated.**

### Principle 7
**Synthetic prototype data must never be presented as real victim data.**

---

# 50. PROJECT TERMINOLOGY

Use these terms consistently:

### Preferred

- victim well-being;
- distress-risk;
- Dynamic Distress Score;
- longitudinal trajectory;
- early warning;
- risk prioritization;
- intervention recommendation;
- human review;
- contributing indicators;
- confidence;
- data quality;
- privacy-by-architecture;
- justice-aware monitoring.

### Avoid

- AI psychiatrist;
- AI diagnosis;
- guaranteed crisis prediction;
- emotion detector that "knows" someone's mental state;
- autonomous police decision;
- automatic witness-protection decision;
- "100% accurate";
- "no existing system."

---

# 51. SOURCE / EVIDENCE FRAMEWORK

When presenting the project, distinguish three types of statements.

## A. Official SIH requirement

Directly comes from the official Problem Statement.

Examples:

- periodic interactions;
- voice/text/behaviour analysis;
- Dynamic Distress Score;
- longitudinal trends;
- prediction;
- alerts;
- intervention recommendations;
- dashboards;
- explainability/privacy;
- listed priority use cases.

## B. Verified government ecosystem information

Examples:

- NHAA;
- ICJS-related integration;
- SC/ST PoA victim/witness rights;
- Tele-MANAS;
- 112;
- legal aid;
- One Stop Centres.

## C. Our proposed innovation

Examples:

- victim well-being intelligence layer;
- case-event timeline;
- confidence/data-quality display;
- closed-loop intervention measurement;
- multidimensional vulnerability;
- specific prototype architecture;
- specific ML model choices.

Never present category C as if it were an official government feature.

---

# 52. OFFICIAL / HIGH-AUTHORITY REFERENCE SOURCES

## India Code — SC/ST Prevention of Atrocities Act

https://www.indiacode.nic.in/handle/123456789/1920

Relevant for the legal framework, special courts, relief/rehabilitation context and Section 15A victim/witness rights.

## 112 India — Emergency Response Support System

https://112.gov.in/

Relevant for understanding the distinction between emergency response and our proposed early-warning layer.

## Directorate General of Health Services — National Mental Health Programme / Tele-MANAS

https://www.dghs.mohfw.gov.in/national-mental-health-programme.php

Relevant for existing mental-health service infrastructure and referral pathways.

## Ministry of Health and Family Welfare — Tele-MANAS material

https://www.mohfw.gov.in/

Relevant for official mental-health service information.

## Ministry of Social Justice & Empowerment

https://socialjustice.gov.in/

Relevant for SC/ST PoA implementation, government schemes and official reports.

## NHAA

https://nhapoa.gov.in/

Relevant for National Helpline Against Atrocities information and reports.

---

# 53. FINAL SYSTEM DEFINITION

The project can be formally defined as:

> **A privacy-preserving, AI-assisted victim well-being decision-support platform that continuously collects approved victim interactions across multiple channels, extracts multimodal and behavioural indicators, maintains a longitudinal distress trajectory, incorporates relevant justice-process context, estimates escalation risk, provides explainable risk signals and intervention recommendations, and closes the loop through human-reviewed intervention and follow-up.**

---

# 54. FINAL DIFFERENTIATION STATEMENT

The project is not innovative because it uses AI.

It is innovative because it applies AI to a **specific missing layer in the existing justice ecosystem**:

> **continuous, longitudinal, context-aware, privacy-preserving intelligence about the victim's changing well-being.**

The central transformation is:

```text
TODAY

Case
 ↓
Case status
 ↓
Support when requested / required


PROPOSED

Case
 ↓
Victim interaction
 ↓
Well-being signal
 ↓
Trajectory
 ↓
Early warning
 ↓
Explainable risk
 ↓
Human intervention
 ↓
Follow-up
 ↓
Outcome
```

---

# 55. FINAL MEMORY BLOCK FOR OTHER AI ASSISTANTS

If this project is being discussed in another chatbot, use the following context:

> We are developing an SIH software solution titled **"AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities."** The official PS asks for continuous/periodic victim interactions through chatbot, IVRS, SMS, mobile app, web or approved helpline channels; multimodal analysis of voice, text, behavioural responses and engagement; a Dynamic Distress Score; longitudinal trend analysis; prediction of distress escalation; risk alerts; intervention recommendations; district/State/national dashboards; and explainable, privacy-preserving, legally and ethically compliant AI.
>
> The project's central insight is: **"Existing systems track the case; our system tracks the person behind the case."**
>
> We do not want to replace NHAA, ICJS, police, courts, legal aid, Tele-MANAS, 112 or rehabilitation services. We want to build a **Victim Well-being Intelligence Layer** that augments the existing ecosystem.
>
> The major identified gaps are: case-centric rather than victim-centric monitoring; snapshot rather than longitudinal monitoring; reactive rather than predictive support; fragmented services; lack of case-event/well-being correlation; generic mental-health tools lacking justice context; detection without intervention; lack of closed-loop outcome monitoring; multiple communication channels without one longitudinal profile; black-box risk; and extreme privacy sensitivity.
>
> The six primary USPs are:
> 1. **Victim Well-being Intelligence Layer**
> 2. **Dynamic Distress Trajectory**
> 3. **Justice-Aware Multimodal AI**
> 4. **Predictive Early Warning**
> 5. **AI-to-Action Closed Loop**
> 6. **Privacy + Explainability**
>
> The proposed architecture is:
> **Existing government ecosystem → victim interaction layer → text/voice/behaviour analysis → context + history → Dynamic Distress Score → longitudinal trend → predictive risk → explainability → intervention recommendation → human review → intervention → follow-up → outcome monitoring.**
>
> The system is **not a diagnostic tool** and must never claim to diagnose depression/PTSD or make autonomous legal/clinical/protection decisions. AI outputs are risk estimates and decision-support signals requiring human review.
>
> The SIH prototype should use synthetic/anonymized demonstration data unless authorized real data is genuinely provided. Production deployment would require government authorization, secure integration, clinical/expert validation, appropriate data governance and approved infrastructure.
>
> The ideal demo follows one victim from baseline distress through a case-related stress event, deterioration, AI detection, explainable risk alert, intervention recommendation, human review and follow-up showing improvement or escalation.
>
> The project's strongest conceptual shift is:
> **Case tracking → Victim tracking**
> **Snapshot → Trajectory**
> **Reactive response → Early warning**
> **Prediction → Intervention**
> **Intervention → Outcome measurement**

---

# 56. BOTTOM LINE

## The project is fundamentally about one missing question:

> **"While the justice system is processing the case, who is continuously watching out for the well-being of the person living through it?"**

Our answer:

> **A privacy-first, explainable, human-in-the-loop Victim Well-being Intelligence System that detects deterioration early and helps connect the victim to the right support at the right time.**

## Final tagline

> # **TRACK THE CASE. WATCH THE PERSON. ACT BEFORE CRISIS.**

---

# CHANGE LOG / DOCUMENT STATUS

**Version 1.0**

This document consolidates the team's current understanding of:

- official PS requirements;
- existing government ecosystem;
- problem causes;
- gaps;
- proposed USPs;
- architecture;
- AI approach;
- privacy and safety;
- prototype scope;
- demo;
- implementation;
- judge Q&A;
- pitch language.

When future project decisions change, update this document rather than creating contradictory descriptions elsewhere.


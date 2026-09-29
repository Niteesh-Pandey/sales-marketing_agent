# Niteesh AI Sales & Marketing Command Center

**Owner:** Niteesh Pandey  
**Company:** Niteesh AI Growth Labs  
**Demo Client:** UrbanNest Properties (Mumbai, Thane, Pune)  
**Primary AI Engine:** Google Gemini (Official `google-genai` Python SDK & `@google/genai` TypeScript SDK)  
**Database:** PostgreSQL Ready & SQLite Dual-Mode (SQLAlchemy ORM)

---

## 1. Project Overview

Niteesh AI Sales & Marketing Command Center is an end-to-end, free-first, evidence-grounded AI agent application built to supercharge sales execution, marketing decisions, pipeline intelligence, customer objection handling, and executive business analytics.

The application follows the strict sequence:
$$\text{DATA} \longrightarrow \text{CONTEXT} \longrightarrow \text{ANALYSIS} \longrightarrow \text{REASONING} \longrightarrow \text{RECOMMENDATION} \longrightarrow \text{ACTION PLAN}$$

It strictly distinguishes:
- **FACT:** Directly verified data points from the CRM or knowledge base.
- **INFERENCE:** Mathematical or logical conclusions derived from facts.
- **ASSUMPTION:** Hypotheses clearly identified as requiring client validation.
- **RECOMMENDATION:** High-impact, evidence-grounded actions.

---

## 2. Core Modules

1. **Module A — AI Chat Assistant:** Multi-turn conversational interface with grounding across 50+ CRM leads, marketing campaigns, and local RAG documents.
2. **Module B — Lead Management:** Complete CRM with 50+ realistic fictional demo leads for UrbanNest Properties across Mumbai, Thane, and Pune.
3. **Deterministic Lead Scoring Engine:** 8-dimension transparent scoring model (0–100) evaluating Budget Fit, Product Fit, Purchase Intent, Engagement Recency, Decision Authority, Timeline, and Location.
4. **Module C — Sales Assistant & Objection Engine:** Consultative email generation with tone selection, plus structured resolution across 11 objection categories (Price, Budget, Timing, Trust, Competition, etc.).
5. **Module D — Marketing & Content Engine:** High-converting copy generation for LinkedIn, Instagram, Email, WhatsApp, and Website with A/B creative testing variants.
6. **Module E & F — Marketing & Funnel Analytics:** Automated mathematical computation of all 11 standard marketing formulas (CTR, CPC, CPL, Qualified Lead Rate, CAC, ROAS, ROI, etc.) and bottleneck detection.
7. **Module G — Visual CRM Pipeline:** 8-stage interactive Kanban board with stage movement and revenue aggregation.
8. **Module H — Local RAG Knowledge Base:** 9-category document repository with mandatory source-citation behavior.
9. **Module I — Meeting Intelligence:** Real estate call transcript / notes extractor into CRM-ready structured records.
10. **Module J & K — Today's Command Center & Day Plan:** 4-block chronological day schedule (Morning, Midday, Afternoon, EOD) prioritizing high-impact deals.
11. **Module L — Task Management:** Action item tracking with priority levels (CRITICAL, HIGH, MEDIUM, LOW) and lead links.
12. **Module M & Settings — Management Reports & Audit Log:** Executive weekly briefing generator, system health status, PostgreSQL connection configuration, and audit trails.

---

## 3. Installation & Local Windows Setup

### Option 1: Automated Windows Batch Script
1. Clone or extract the repository on your Windows machine.
2. Double-click `setup_windows.bat`. It will automatically:
   - Create a Python 3.11+ virtual environment (`venv`).
   - Install all required libraries from `requirements.txt`.
   - Create necessary data and log directories.
   - Seed the database with 50+ demo leads, products, and campaigns.
3. Add your `GEMINI_API_KEY` to the generated `.env` file:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   GEMINI_MODEL=gemini-3.8-flash
   GEMINI_FALLBACK_MODEL=gemini-3.1-flash-lite
   ```
4. Double-click `run_windows.bat` to launch the application.

### Option 2: Manual Terminal Commands
```bash
# 1. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env

# 4. Seed demo database
python database/seed_demo_data.py

# 5. Run Streamlit application
streamlit run app.py
```

---

## 4. PostgreSQL Configuration

The application is built with PostgreSQL support via SQLAlchemy (`psycopg2-binary`).
To use PostgreSQL instead of SQLite:
1. Create a PostgreSQL database (e.g. `niteesh_growth_labs`).
2. Set the `DATABASE_URL` in your `.env` file:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/niteesh_growth_labs
   ```
3. Run `python database/seed_demo_data.py` to create and populate all tables.

---

## 5. Running Tests

Run the automated test suite with `pytest`:
```bash
pytest tests/test_suite.py -v
```

---

## 6. Safety & Security Principles

- **No Secret Exposure:** Gemini API keys are never stored in the database or rendered in the frontend.
- **Three-Level Approval Safety:** READ, DRAFT, and EXECUTE. All AI-generated customer messages remain in DRAFT status until explicitly approved by Niteesh.
- **Local-First RAG:** Documents are indexed locally without sending entire corpora to external cloud vectors.
- **Zero Hallucination Mandate:** When evidence is missing, the agent explicitly replies: *"Insufficient data."* and highlights the missing metrics.

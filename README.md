# Niteesh AI Sales & Marketing Command Center

[![GitHub Repository](https://img.shields.io/badge/GitHub-Niteesh--Pandey%2Fsales--marketing__agent-indigo?logo=github)](https://github.com/Niteesh-Pandey/sales-marketing_agent)
[![Author](https://img.shields.io/badge/Author-Niteesh%20Pandey-blue)](mailto:niteeshpandey9555@gmail.com)
[![Python Core](https://img.shields.io/badge/Python-3.10%2B-yellow?logo=python)](https://www.python.org/)
[![Organization](https://img.shields.io/badge/Organization-Niteesh%20AI%20Growth%20Labs-purple)](https://github.com/Niteesh-Pandey)
[![AI Engine](https://img.shields.io/badge/Google%20GenAI-3.8%20%7C%203.1%20%7C%202.5-amber?logo=google)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20SQLAlchemy-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald)](LICENSE)

An enterprise-grade, evidence-grounded AI Sales & Marketing Agent engineered by **Niteesh Pandey** for **Niteesh AI Growth Labs** (client: **UrbanNest Properties**, luxury real estate in Mumbai, Thane, and Pune).

Built using a **Python 3.10+ AI Core Architecture** with SQLAlchemy ORM, deterministic scoring algorithms, and consultative objection frameworks, combined with a high-performance executive web command center.

---

## Architecture

```
                  ┌────────────────────────────────────────┐
                  │       Niteesh AI Command Center        │
                  └───────────────────┬────────────────────┘
                                      │
            ┌─────────────────────────┴────────────────────────┐
            ▼                                                  ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│       Python 3.10+ Core       │              │     Executive Web Workspace   │
│  - 8-Dimension Scoring Engine │              │  - Real-time CRM Kanban       │
│  - Sales Objection Engine     │              │  - MahaRERA Unit Catalog      │
│  - Marketing Math (11 KPIs)   │              │  - Real Estate EMI Calculator │
│  - SQLAlchemy PostgreSQL ORM  │              │  - 1-Click WhatsApp Trigger   │
│  - Python CLI & Unit Tests    │              │  - Multi-Model Gemini Switcher│
└───────────────┬───────────────┘              └───────────────┬───────────────┘
                │                                              │
                └──────────────────────┬───────────────────────┘
                                       ▼
                   ┌───────────────────────────────────────┐
                   │  Official Google GenAI Engine (3.8)   │
                   │  - Multimodal Reasoning & Synthesis   │
                   │  - Zero Telemetry Leaks & Citations   │
                   └───────────────────────────────────────┘
```

---

## Core Capabilities

1. **Python Deterministic Scoring Engine (`python_engine/scoring.py`):**
   8-dimension mathematical scoring (0–100) evaluating Budget Fit, Product Match, Buyer Intent, Recency, Decision Authority, Timeline, and Location without LLM hallucination.

2. **Property Inventory & Financial Engineering Desk:**
   Unit availability across Worli Sea Face, Bandra West, Thane, and Pune. Includes MahaRERA registration tracking (`P51800045892`), carpet efficiency ratios, and instant Stamp Duty (6%), GST (5%), and EMI loan simulation.

3. **Consultative Objection Handling Playbook (`python_engine/objection_playbook.py`):**
   Evidence-grounded scripts and proof requirements across 11 customer hesitation categories (Price, Budget, Timing, Trust, Competitor Comparison).

4. **Marketing Attribution Mathematics (`python_engine/analytics.py`):**
   Exact calculation of all 11 growth KPIs: CTR, CPC, CPL, Qualified Lead Rate, CAC, ROAS, and ROI.

5. **Multi-Model Gemini Engine:**
   Hot-swap between **Gemini 3.8 Flash**, **Gemini 3.1 Flash-Lite**, **Gemini 2.5 Flash**, and **Gemini 2.5 Pro** directly from the UI header or Python CLI.

6. **Automated CI/CD Verification (`.github/workflows/ci.yml`):**
   Continuous integration testing Python algorithms and web builds on every git push.

---

## Quick Start (Python & Web)

### 1. Clone the Repository
```bash
git clone https://github.com/Niteesh-Pandey/sales-marketing_agent.git
cd sales-marketing_agent
```

### 2. Run the Python Core Agent & Tests
```bash
# Run unit tests
python3 -m unittest discover tests

# Launch standalone Python system check
python3 main.py

# Score a prospective lead via Python CLI
python3 -m python_engine.cli score --budget 24000000 --product "UrbanNest Prime Residences" --city "Mumbai"
```

### 3. Launch the Interactive Web Command Center
```bash
# Install web dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Configuration

Configure your `.env` file:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.1-flash-lite

# PostgreSQL Database (automatically falls back to SQLite/in-memory if offline)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/niteesh_growth_labs
```

---

## Docker & Cloud Deployment

### Docker Compose (App + PostgreSQL 16)
```bash
docker compose up -d --build
```

### Deploy to Render or Railway
- Build Command: `npm run build`
- Start Command: `npm run start`
- Environment Variables: `GEMINI_API_KEY`

---

## Syncing to GitHub

To push the latest release to your repository:
- **Mac / Linux**: `./sync_github.sh`
- **Windows**: `sync_github.bat`
- **Manual Git Push**:
  ```bash
  git push https://<YOUR_GITHUB_TOKEN>@github.com/Niteesh-Pandey/sales-marketing_agent.git main
  ```

---

## Author

**Niteesh Pandey**  
Founder & AI Architect — *Niteesh AI Growth Labs*  
- GitHub: [@Niteesh-Pandey](https://github.com/Niteesh-Pandey)  
- Email: [niteeshpandey9555@gmail.com](mailto:niteeshpandey9555@gmail.com)  
- Repository: [https://github.com/Niteesh-Pandey/sales-marketing_agent](https://github.com/Niteesh-Pandey/sales-marketing_agent)

import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env
load_dotenv(BASE_DIR / ".env")

# Owner and Demo Client Information
OWNER_NAME = "Niteesh Pandey"
OWNER_ROLE = "Founder / Business Owner"
COMPANY_NAME = "Niteesh AI Growth Labs"
DEMO_CLIENT = "UrbanNest Properties"
DEMO_INDUSTRY = "Real Estate"
DEMO_MARKETS = ["Mumbai", "Thane", "Pune"]

# AI Model Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.1-flash-lite")

# Database Configuration (PostgreSQL supported via DATABASE_URL; fallback to SQLite)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'niteesh_growth_labs.db'}"
)

# Knowledge Base Directory
KNOWLEDGE_BASE_DIR = BASE_DIR / "knowledge"

# Logging Directory
LOGS_DIR = BASE_DIR / "logs"
LOGS_DIR.mkdir(exist_ok=True)

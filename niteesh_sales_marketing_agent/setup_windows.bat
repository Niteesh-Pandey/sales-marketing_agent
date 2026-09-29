@echo off
echo ========================================================
echo Niteesh AI Growth Labs - Windows Environment Setup
echo ========================================================

REM 1. Create Virtual Environment
if not exist "venv" (
    echo [*] Creating virtual environment...
    python -m venv venv
) else (
    echo [*] Virtual environment already exists.
)

REM 2. Activate Virtual Environment
call venv\Scripts\activate.bat

REM 3. Install requirements
echo [*] Installing dependencies from requirements.txt...
pip install --upgrade pip
pip install -r requirements.txt

REM 4. Create required folder structures
if not exist "data\uploads" mkdir data\uploads
if not exist "data\exports" mkdir data\exports
if not exist "data\demo" mkdir data\demo
if not exist "logs" mkdir logs

REM 5. Create .env if missing
if not exist ".env" (
    echo [*] Creating .env from .env.example...
    copy .env.example .env
    echo [!] Remember to add your GEMINI_API_KEY into .env!
)

REM 6. Initialize database and seed demo data
echo [*] Initializing database and seeding demo data...
python database\seed_demo_data.py

echo ========================================================
echo Setup Complete! Run run_windows.bat to launch application.
echo ========================================================
pause

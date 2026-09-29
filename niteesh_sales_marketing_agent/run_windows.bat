@echo off
echo ========================================================
echo Launching Niteesh AI Sales & Marketing Command Center...
echo ========================================================

if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

streamlit run app.py
pause

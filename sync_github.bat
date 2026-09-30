@echo off
REM ==============================================================================
REM Niteesh AI Sales & Marketing Command Center - Windows GitHub Sync
REM Author: Niteesh Pandey <niteeshpandey9555@gmail.com>
REM Repository: https://github.com/Niteesh-Pandey/sales-marketing_agent
REM ==============================================================================

echo [Niteesh AI] Staging files for GitHub...
git add .

echo [Niteesh AI] Committing enterprise release...
git commit -m "feat: enterprise release - property inventory desk, RERA tools and CI verification"

echo [Niteesh AI] Ensuring main branch...
git branch -M main

echo [Niteesh AI] Pushing to https://github.com/Niteesh-Pandey/sales-marketing_agent...
git push -u origin main

pause

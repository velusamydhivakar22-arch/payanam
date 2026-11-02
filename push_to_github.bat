@echo off
title Payanam Junction - Push to GitHub
setlocal
set "DIR=%~dp0"
cd /d "%DIR%"

echo ==============================================================================
echo PAYANAM JUNCTION — PUSH TO GITHUB
echo Target: https://github.com/velusamydhivakar22-arch/payanam.git
echo ==============================================================================
echo.
echo 1. Push using existing Git credentials (if collaborator added)
echo 2. Push using GitHub Personal Access Token (PAT)
echo 3. Clear cached credentials and log in via browser
echo.
set /p choice="Select an option (1, 2, or 3): "

if "%choice%"=="1" (
    git push -u origin main
) else if "%choice%"=="2" (
    set /p token="Enter your GitHub Personal Access Token: "
    git remote set-url origin https://%token%@github.com/velusamydhivakar22-arch/payanam.git
    git push -u origin main
    git remote set-url origin https://github.com/velusamydhivakar22-arch/payanam.git
) else if "%choice%"=="3" (
    cmdkey /delete:LegacyGeneric:target=git:https://github.com
    git push -u origin main
)

echo.
pause

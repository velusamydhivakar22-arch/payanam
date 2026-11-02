@echo off
title Payanam Junction - Full System Launcher
setlocal
set "DIR=%~dp0"
echo ==============================================================================
echo PAYANAM JUNCTION — SYSTEM LAUNCHER
echo Starting MySQL-connected Spring Boot Backend and React Frontend...
echo ==============================================================================
start "Payanam Junction - Backend" cmd /c "%DIR%run_backend.bat"
timeout /t 5 /nobreak >nul
start "Payanam Junction - Frontend" cmd /c "%DIR%run_frontend.bat"
timeout /t 3 /nobreak >nul
start http://localhost:5173/
echo All services launched!

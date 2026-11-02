@echo off
title Payanam Junction - Frontend Web App
setlocal
set "DIR=%~dp0"
cd /d "%DIR%frontend"
echo [INFO] Starting Vite Frontend on http://localhost:5173...
npm run dev
pause

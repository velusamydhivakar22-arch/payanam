@echo off
title Payanam Junction - Spring Boot Backend
setlocal
set "DIR=%~dp0"
cd /d "%DIR%backend"
echo [INFO] Starting Spring Boot Backend on port 8080 (MySQL port 3307)...
"%DIR%tools\jdk-21\bin\java.exe" -DDB_PORT=3307 -DDB_USERNAME=root -DDB_PASSWORD=root -DSERVER_PORT=8080 -jar target\railconnect-1.0.0.jar
pause

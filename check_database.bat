@echo off
setlocal
echo ==============================================================================
echo PAYANAM JUNCTION - DATABASE CONNECTIVITY DIAGNOSTIC
echo Target: MySQL 8.0 on localhost:3307 (Database: payanam_junction)
echo ==============================================================================
echo.

echo [Step 1/3] Checking MySQL Service Port 3307...
netstat -ano | findstr :3307 >nul
if %ERRORLEVEL% equ 0 (
    echo   [OK] MySQL is actively listening on port 3307.
) else (
    echo   [FAILED] Port 3307 not responding.
)
echo.

echo [Step 2/3] Querying MySQL Tables and Records...
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -P 3307 -u root -proot payanam_junction -e "SELECT 'Stations' as Table_Name, count(*) as Records FROM stations UNION ALL SELECT 'Trains', count(*) FROM trains UNION ALL SELECT 'Classes', count(*) FROM train_classes UNION ALL SELECT 'Platforms', count(*) FROM platforms UNION ALL SELECT 'Reservations', count(*) FROM reservations;"
)
echo.

echo [Step 3/3] Checking Spring Boot Backend DB Health...
powershell -NoProfile -Command "$ErrorActionPreference = 'SilentlyContinue'; $h = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health'; if ($h) { Write-Host ('  [OK] Spring Boot Health: ' + $h.status + ' | DB Component: ' + $h.components.db.status) } else { Write-Host '  [NOTE] Backend server not responding on port 8080.' }"
echo.

echo ==============================================================================
pause

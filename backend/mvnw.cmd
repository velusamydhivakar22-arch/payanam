@echo off
setlocal
set "DIR=%~dp0"
if not defined JAVA_HOME set "JAVA_HOME=%DIR%..\tools\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"
"%DIR%..\tools\apache-maven-3.9.9\bin\mvn.cmd" %*

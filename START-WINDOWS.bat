@echo off
title Shopping Centre
cd /d "%~dp0backend"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js install nahi hai. Pehle https://nodejs.org se LTS version install karo,
  echo phir computer restart karke ye file dobara chalao.
  echo.
  pause
  exit /b
)

if not exist node_modules (
  echo Pehli baar setup ho raha hai, thoda wait karo...
  call npm install --no-audit --no-fund
)

start "" "http://localhost:5000"
node server.js
pause

@echo off
title AuraSupply Enterprise Fulfillment & QA Engine
color 0B
echo =========================================================================
echo       AURASUPPLY — SUPPLY CHAIN FULFILLMENT & QA TEST ENGINE
echo       Developed by Muhammad Irfan Firdaus
echo =========================================================================
echo.

cd /d "%~dp0\server"

if not exist "database.sqlite" (
  echo [INIT] Initializing and seeding SQLite database...
  node seed.js
)

echo [SERVER] Starting unified full-stack server on port 5050...
start "" http://localhost:5050

node index.js
pause

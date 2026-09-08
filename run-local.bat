@echo off
setlocal
cd /d "%~dp0"
echo Starting Ponasa local preview at http://localhost:8000
node serve-local.js

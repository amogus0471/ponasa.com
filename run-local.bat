@echo off
setlocal
title Ponasa - Local Preview
cd /d "%~dp0"
echo Starting Ponasa local preview at http://localhost:8000
echo Press Ctrl+C to stop the server.
node serve-local.js

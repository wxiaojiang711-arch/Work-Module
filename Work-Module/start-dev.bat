@echo off
setlocal

cd /d "%~dp0"

echo Starting Vite dev server...
start "Vite Dev Server" cmd /k "cd /d \"%~dp0\" && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173/"

echo Browser opened at http://127.0.0.1:5173/
echo You can close this window. Dev server runs in the "Vite Dev Server" window.

endlocal

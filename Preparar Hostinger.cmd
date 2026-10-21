@echo off
setlocal
cd /d "%~dp0"
call npm run hostinger
if errorlevel 1 (
  echo No se pudo preparar el paquete. Revise el error anterior.
  pause
  exit /b 1
)
start "" "%~dp0HOSTINGER"
echo Paquete listo. Suba el contenido de HOSTINGER\public_html o extraiga el ZIP en Hostinger.
pause

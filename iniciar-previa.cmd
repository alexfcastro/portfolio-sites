@echo off
rem Previa local: sobe o portfolio (http://localhost:3100) e as 12 demos (3101 a 3112) e abre o navegador.
rem Clique duas vezes neste arquivo. Para encerrar, feche esta janela (ou Ctrl+C).
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=%APPDATA%\npm;%ProgramFiles%\nodejs;%PATH%"

where node >nul 2>nul || (echo Node.js nao encontrado. Instale em https://nodejs.org e tente de novo. & pause & exit /b 1)

rem Dependencias: so na primeira vez (precisa do pnpm).
if not exist "node_modules" (
  echo Instalando dependencias...
  call pnpm install || (echo Nao foi possivel instalar as dependencias com o pnpm. & pause & exit /b 1)
)

rem Abre o navegador alguns segundos depois, quando os servidores ja responderem.
start "" /min cmd /c "timeout /t 15 >nul & start http://localhost:3100"

rem Os servidores sobem direto pelo Node (nao dependem do executavel do pnpm).
if exist "apps\floricultura\.next\BUILD_ID" (
  node scripts\local-preview.mjs --skip-build
) else (
  echo Primeira execucao: gerando os builds, leva alguns minutos...
  node scripts\local-preview.mjs
)
pause

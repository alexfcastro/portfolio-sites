@echo off
rem Previa local: sobe o portfolio (http://localhost:3100) e as 12 demos (3101 a 3112) e abre o navegador.
rem Clique duas vezes neste arquivo. Para encerrar, feche esta janela (ou Ctrl+C).
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=%APPDATA%\npm;%ProgramFiles%\nodejs;%PATH%"

where node >nul 2>nul || (echo Node.js nao encontrado. Instale em https://nodejs.org e tente de novo. & pause & exit /b 1)
where pnpm >nul 2>nul || (echo Ativando o pnpm... & call corepack enable --install-directory "%APPDATA%\npm" pnpm)
where pnpm >nul 2>nul || (echo Nao foi possivel ativar o pnpm. & pause & exit /b 1)

if not exist "node_modules" (echo Instalando dependencias... & call pnpm install)

rem Abre o navegador alguns segundos depois, quando os servidores ja responderem.
start "" /min cmd /c "timeout /t 12 >nul & start http://localhost:3100"

if exist "apps\floricultura\.next\BUILD_ID" (
  call pnpm preview:local --skip-build
) else (
  echo Primeira execucao: gerando os builds, leva alguns minutos...
  call pnpm preview:local
)
pause

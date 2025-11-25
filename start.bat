@echo off
echo 🌸 규슈 여행 도우미 시작하기 🌸
echo =================================

REM .env 파일 확인
if not exist ".env" (
    echo ⚠️ .env 파일이 없습니다. .env.example을 복사합니다...
    copy .env.example .env
    echo ✅ .env 파일이 생성되었습니다. API 키를 설정해주세요!
)

REM 포트 정리
echo 🔍 포트 상태 확인 중...
netstat -ano | findstr :3000 > nul
if %errorlevel% == 0 (
    echo 🛑 포트 3000에서 실행 중인 프로세스 종료 중...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /pid %%a /f > nul 2>&1
)

echo ✅ 포트 정리 완료

REM 의존성 설치 확인
if not exist "node_modules" (
    echo 📦 의존성 설치 중...
    npm install
)

echo.
echo 🚀 프론트엔드 서버 시작 중...
echo 📍 URL: http://localhost:3000
echo.
echo 💡 프론트엔드 전용 모드
echo    - 백엔드 서버 불필요
echo    - 메모리 기반 캐시 사용
echo.
echo ⭐ 즐거운 여행 계획 되세요! ⭐
echo.

REM 프론트엔드만 시작
npm run dev

pause

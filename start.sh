#!/bin/bash
# Kushu Trip Application Startup Script

echo "🌸 규슈 여행 도우미 시작하기 🌸"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️ .env 파일이 없습니다. .env.example을 복사합니다...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env 파일이 생성되었습니다. API 키를 설정해주세요!${NC}"
fi

# 포트 확인 및 정리
echo -e "${BLUE}🔍 포트 상태 확인 중...${NC}"

# 포트 3000 정리
PID_3000=$(lsof -t -i:3000 2>/dev/null)
if [ ! -z "$PID_3000" ]; then
    echo -e "${YELLOW}🛑 포트 3000에서 실행 중인 프로세스 종료 중...${NC}"
    kill -9 $PID_3000 2>/dev/null
fi

echo -e "${GREEN}✅ 포트 정리 완료${NC}"

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 의존성 설치 중...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}🚀 프론트엔드 서버 시작 중...${NC}"
echo -e "${BLUE}📍 URL: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}💡 프론트엔드 전용 모드${NC}"
echo -e "${YELLOW}   - 백엔드 서버 불필요${NC}"
echo -e "${YELLOW}   - 메모리 기반 캐시 사용${NC}"
echo ""
echo -e "${GREEN}⭐ 즐거운 여행 계획 되세요! ⭐${NC}"
echo ""

# 프론트엔드만 시작
npm run dev

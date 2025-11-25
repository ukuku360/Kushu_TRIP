# 🍜 Kushu TRIP - 큐슈 여행 맛집 가이드

큐슈 지역의 유명한 음식을 탐방하고 실제 구글맵 리뷰를 AI가 요약해주는 웹 애플리케이션입니다.

## ⚡ 프론트엔드 전용 모드

이 앱은 **프론트엔드 전용**으로 작동하여 백엔드 서버가 필요하지 않습니다!

### 빠른 시작

```bash
# 1. 환경변수 설정 (자동 생성됨)
./start.sh

# 또는 Windows에서
start.bat
```

### 수동 시작 (선택사항)

```bash
# 1. 환경변수 설정
cp .env.example .env

# 2. 의존성 설치
npm install

# 3. 앱 시작
npm run dev
```

## 🔧 환경변수 설정

`.env` 파일에서 다음 API 키들을 설정하세요:

```bash
# Google Places API (필수)
VITE_GOOGLE_PLACES_API_KEY=your_google_api_key

# Google Gemini AI (필수) 
VITE_GEMINI_API_KEY=your_gemini_api_key

# Brave Search API (선택사항)
VITE_BRAVE_SEARCH_API_KEY=your_brave_api_key
```

## ✨ 주요 특징

- **🚀 빠른 시작**: 백엔드 서버 불필요
- **💾 스마트 캐싱**: 메모리 기반 임시 캐시
- **🌍 실시간 데이터**: Google Places API 직접 연동
- **🤖 AI 요약**: Gemini AI로 리뷰 요약
- **📱 반응형 디자인**: 모바일/데스크톱 최적화

## 🎯 주요 기능

1. **맛집 탐색**: 큐슈 각 지역별 유명 음식 검색
2. **핫플레이스**: 관광지 및 명소 정보
3. **교통 정보**: 도시 간 이동 수단 정보
4. **리뷰 요약**: AI가 구글 리뷰를 한국어로 요약
5. **실시간 지도**: 위치 정보 시각화

## 🛠️ 기술 스택

- **Frontend**: React + Vite
- **UI**: Framer Motion 애니메이션
- **API**: Google Places + Gemini AI
- **지도**: Google Maps API
- **스타일링**: CSS3 + Responsive Design

## 📱 사용법

1. **지역 선택**: 큐슈 지도에서 원하는 도시 클릭
2. **카테고리 선택**: 맛집/핫플레이스/교통 중 선택
3. **음식/장소 선택**: 원하는 카테고리 선택
4. **결과 확인**: AI 요약된 리뷰와 정보 확인

## 💡 프론트엔드 전용 모드의 장점

- ✅ **간편한 설치**: npm install 한 번으로 완료
- ✅ **빠른 시작**: 백엔드 설정 불필요
- ✅ **실시간 데이터**: API 직접 연동으로 최신 정보
- ✅ **캐시 최적화**: 메모리 기반 스마트 캐싱
- ✅ **오류 없음**: 백엔드 연결 오류 완전 해결

## 🔍 트러블슈팅

### API 키 오류
```bash
# .env 파일 확인
cat .env

# API 키가 올바르게 설정되었는지 확인
```

### 포트 충돌
```bash
# 포트 3000 정리
lsof -t -i:3000 | xargs kill -9

# 또는 자동 스크립트 사용
./start.sh
```

### 캐시 초기화
브라우저에서 **Ctrl+F5** (강제 새로고침)

## 🌸 즐거운 큐슈 여행 되세요!

이 앱이 여러분의 큐슈 여행 계획에 도움이 되기를 바랍니다. 맛있는 음식과 아름다운 장소들을 발견해보세요! 🇯🇵✨ 
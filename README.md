# 🍜 Kushu TRIP - 큐슈 여행 맛집 가이드

큐슈 지역의 유명한 음식을 탐방하고 실제 구글맵 리뷰를 AI가 요약해주는 웹 애플리케이션입니다.

## ✨ 주요 기능

1. **도시 선택** - 후쿠오카, 쿠마모토, 나가사키 등 큐슈 주요 도시
2. **음식 선택** - 각 도시의 대표 음식 3가지 중 선택
3. **맛집 검색** - 선택한 음식의 인기 맛집 5곳 자동 추출
4. **실시간 리뷰 스크랩** - 구글맵에서 최신 리뷰 20개 수집
5. **AI 리뷰 요약** - Google Gemini AI가 리뷰를 분석하여 요약

## 🚀 시작하기

### 1. 환경변수 설정

먼저 환경변수 파일을 설정해야 합니다:

```bash
# .env.example을 .env로 복사
cp .env.example .env
```

`.env` 파일을 열어 실제 API 키들을 입력하세요:

```bash
# Google Places API 키 (필수)
VITE_GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key

# Google Gemini AI API 키 (필수)
VITE_GEMINI_API_KEY=your_actual_gemini_api_key

# Brave Search API 키 (선택사항)
VITE_BRAVE_SEARCH_API_KEY=your_actual_brave_search_api_key
```

### 2. API 키 발급 방법

#### Google Places API
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 프로젝트 생성
2. Places API 활성화
3. API 키 생성 후 Places API 사용 권한 설정

#### Google Gemini AI API
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 생성
2. 무료 할당량: 월 60회 요청

#### Brave Search API (선택사항)
1. [Brave Search API](https://api.search.brave.com/app/keys)에서 API 키 생성
2. 무료 할당량: 월 2,000회 요청
3. 트렌딩 데이터 수집용

### 3. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 🎮 사용법

1. **도시 선택**: 지도에서 원하는 큐슈 도시 클릭
2. **음식 선택**: 해당 도시의 유명 음식 3가지 중 하나 선택
3. **맛집 확인**: AI가 추천하는 인기 맛집 5곳 확인
4. **리뷰 보기**: 각 맛집의 "📝 구글맵 리뷰 보기" 버튼 클릭
5. **AI 요약**: Google Gemini가 분석한 리뷰 요약 확인

## 🛠 기술 스택

- **Frontend**: React 18, Vite
- **Styling**: CSS3, Framer Motion
- **AI**: Google Gemini API
- **Scraping**: MCP Playwright (구글맵 리뷰 수집)
- **Maps**: 커스텀 SVG 맵

## 📊 API 사용량

- **Gemini API 무료 한도**: 분당 60회, 일일 1,500회
- **실시간 모니터링**: 앱 우측 상단에서 API 사용량 확인 가능

## 🔧 개발 정보

### 프로젝트 구조
```
src/
├── components/          # React 컴포넌트
├── services/           # API 서비스 (리뷰 스크랩, AI 요약)
├── utils/              # 유틸리티 함수
└── data/               # 큐슈 지역 데이터
```

### 주요 서비스
- `googleMapsReviewScraper.js`: 구글맵 리뷰 실시간 수집
- `reviewSummaryService.js`: Gemini AI 리뷰 요약
- `restaurantService.js`: 맛집 검색 및 관리

## 🌟 특징

- **실시간 데이터**: 구글맵에서 직접 수집한 최신 리뷰
- **지능형 요약**: AI가 분석한 장단점, 키워드, 감정 분석
- **현지화**: 큐슈 지역 특성을 반영한 맞춤 서비스
- **반응형 디자인**: 모바일/데스크톱 모두 지원

## 📝 라이센스

MIT License 
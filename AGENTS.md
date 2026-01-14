# SULENDAR - 술렌다

**음주 기록 캘린더 앱** | Expo (React Native) + Supabase + Gemini AI

## OVERVIEW

술 마신 날을 캘린더에 기록하고, AI 건강 상담까지 받을 수 있는 앱. 리워드 광고 시청 후 무료 상담 제공.

## STRUCTURE

```
sulendar/
├── App.tsx                    # 엔트리 포인트
├── src/
│   ├── theme/                 # 디자인 시스템
│   │   ├── colors.ts          # 컬러 팔레트 (소프트 블루)
│   │   ├── spacing.ts         # 8pt 그리드, border radius
│   │   └── typography.ts      # 폰트 스타일
│   ├── components/ui/         # 공통 UI 컴포넌트
│   │   ├── Text.tsx           # 타이포그래피
│   │   ├── Button.tsx         # Pill 형태 버튼
│   │   ├── Card.tsx           # 글래스모피즘 카드
│   │   ├── ProgressBar.tsx    # 단계 진행바
│   │   ├── DrinkCard.tsx      # 주종 선택 카드
│   │   └── AmountSelector.tsx # 수량 선택기
│   └── screens/               # 화면
│       └── AddDrinkScreen.tsx # 음주 기록 추가 (프로토타입)
├── assets/                    # 이미지, 아이콘
└── app.json                   # Expo 설정
```

## TECH STACK

| 영역 | 기술 | 비고 |
|------|------|------|
| Frontend | Expo (React Native) | iOS/Android/Web |
| Backend | Supabase | Auth + PostgreSQL |
| AI | Google Gemini | 건강 상담 |
| 광고 | AdMob (예정) | 리워드 광고 |

## DESIGN SYSTEM

### Colors (src/theme/colors.ts)
- **Primary**: 소프트 스카이 블루 (`#7EC8E8`)
- **Background**: `#F0F8FF` (밝은 블루)
- **Glass**: `rgba(255, 255, 255, 0.6)`
- **Drinks**: 주종별 컬러 (소주=초록, 맥주=노랑, 와인=빨강...)

### Components (src/components/ui/)
- 모든 컴포넌트는 theme 시스템 사용
- 큰 border-radius (16~40px)
- 글래스모피즘 스타일 카드

## CONVENTIONS

- **Package Manager**: yarn (npm 사용 X)
- **Import**: 절대경로 (`../theme`, `../components/ui`)
- **컴포넌트**: 함수형 + TypeScript
- **스타일**: StyleSheet.create 사용

## COMMANDS

```bash
yarn start      # Expo 개발 서버
yarn web        # 웹 브라우저
yarn ios        # iOS 시뮬레이터
yarn android    # Android 에뮬레이터
```

## DB SCHEMA (Supabase - 예정)

```sql
users           # 사용자 프로필 (weight, height)
drink_logs      # 음주 기록 (date, drink_type, amount)
goals           # 목표 설정 (weekly_limit, sober_challenge)
consultations   # AI 상담 기록
```

## ROADMAP

- [x] 디자인 시스템 구축
- [x] UI 컴포넌트 생성
- [x] 음주 기록 추가 화면 (프로토타입)
- [ ] Supabase 연동 (Auth + DB)
- [ ] 캘린더 홈 화면
- [ ] 통계 대시보드
- [ ] 목표 설정 화면
- [ ] Gemini AI 상담 연동
- [ ] AdMob 리워드 광고

## NOTES

- InBody API 존재함 (유료, B2B 대상) → MVP는 수동 입력으로 시작
- 의료 상담 면책 문구 필요 ("참고용 정보")

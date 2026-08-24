# 추석 기차표 예매 가이드

2026년 추석 KTX 기차표 예매 정보를 다루는 정적 사이트입니다. 예매 일정, 취소표 잡는 법, 통합회원 전환,
노선별 시간표 조회 등을 제공합니다.

- 배포 도메인: https://ktx.zucca100.com
- 빌드 과정 없는 순수 정적 HTML/CSS/JS 사이트로, Vercel에 그대로 배포할 수 있습니다.

## 로컬 실행

```
python3 -m http.server 8000
```

이후 `http://localhost:8000` 접속.

## 구조

- `index.html` — 허브 페이지
- `cancel-ticket.html`, `member-integration.html`, `priority-booking.html`, `refund-penalty.html`,
  `alternative-transport.html`, `general-train.html`, `pet-child.html` — 서브키워드 랜딩 페이지
- `timetable.html` — 노선별 시간표 조회 도구
- `assets/` — 공용 스타일시트, 시간표 데이터, 파비콘, OG 이미지
- `ktx_timetable.xlsx` — 시간표 원본 데이터 (참고용)

## 배포 전 확인

- 애드센스 승인 후 `index.html` 상단의 adsbygoogle 스크립트 주석 해제
- 각 페이지 `<!-- AD SLOT -->` 위치에 광고 코드 삽입

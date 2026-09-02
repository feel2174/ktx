# 추석 기차표 예매 가이드 (ktx.zucca100.com) — 작업 핸드오프

> 다른 디바이스에서 이어서 작업하기 위한 인수인계 문서. 최종 업데이트: 2026-09-02

## 2026-09-02 세션 요약 (광고 게이팅 + 콘텐츠 보강 + Cloudflare 이전 준비)

- **광고 게이팅 도입(정적 사이트용 바닐라 JS)**: `assets/traffic-gate.js` 신규. 유료 광고
  유입(네이버 `n_*`/`NaPm`·구글 `gclid`·카카오·`utm_medium=cpc`·powerlink·광고 referrer)에만
  `<html class="is-paid">`를 부여하고 **AdSense 로더를 그때만 동적 주입**한다. 다이렉트/심사원엔
  CTA·앱링크·광고가 숨겨진 깨끗한 페이지. 판정은 화이트리스트 + `sessionStorage('tg_paid')` 세션 유지.
  - CSS: `[data-paid-only]{display:none}` 기본, `html.is-paid`에서만 노출(`assets/style.css` 하단).
  - 게이팅 대상: 예매/앱스토어 CTA 버튼(`data-paid-only`). **전화(1544-8545)·공식 안내 링크·본문·
    SVG는 항상 노출**. CTA `<a>`엔 `rel="...sponsored"`, `target="_blank"` 없음.
  - **head의 AdSense 로더 `<script>`는 전 페이지에서 제거됨**(이제 traffic-gate.js가 조건부 주입).
- **URL 확장자 제거**: 전 페이지 내부링크·canonical·og:url·sitemap을 `.html` 없는 형태로 이전
  (Cloudflare Pages가 `.html`을 확장자 없는 URL로 강제 301하기 때문). 홈은 `/`.
- **신규 페이지 2종**: `booking-error`(예매 오류·접속 폭주 대처), `korailtalk-install`(코레일톡/
  코레일+ 앱 설치 — 안드로이드·아이폰·업데이트·설치 안 됨). index 그리드·sitemap(총 11개) 반영.
- **코레일 공식 이용환경 반영**: notice/25563은 예매 일정이 아니라 '권장 이용환경'(권장 브라우저
  크롬·삼성인터넷·사파리, OS 안드로이드 12.0+·iOS 16.0+, 접속 불가 대처)임을 확인해 booking-error·
  korailtalk-install에 반영. cancel-ticket에 매진표·잔여석·실시간 취소표 조회 키워드 섹션 보강.
- **원본 SVG 인포그래픽 4종**: 예매 일정 타임라인(index), 취소표 황금시간대 막대(cancel-ticket),
  좌석 배치도(cancel-ticket), 시점별 위약금 타임라인(refund-penalty). 전부 가을톤, 저작권 0.
- **Cloudflare Pages 이전(진행 예정)**: `_headers`(assets 캐시), `.gitignore`에 `.wrangler` 추가.
  `vercel.json`은 롤백용 유지. **CF 대시보드에서 GitHub 리포 연결(빌드 없음, 출력=루트) + 커스텀
  도메인 `ktx.zucca100.com` 연결 + DNS 전환은 사용자가 직접 진행**해야 함.
- **주의**: `docs/`(광고 게이팅 내부 전략 문서 4종)는 **공개 리포에 커밋하지 않음**(비공개 전략).
- 검증: traffic-gate 판정 로직 node 단위테스트 8/8 통과, 전 페이지 로컬 200, SVG XML 정상,
  키워드 커버리지 전수 통과. 실제 브라우저 렌더는 이 세션도 Chrome 확장 미연결로 육안 확인 못 함.

## 한 줄 요약

2026년 추석 KTX 기차표 예매 정보를 다루는 니치 AdSense 사이트. 빌드 과정 없는 순수 정적
HTML/CSS/JS, Vercel에 직접 배포. **콘텐츠·UI 모두 배포된 상태**로 운영 중이며, 이번 세션에서
랜딩페이지(`index.html`) UI를 개선해 커밋·푸시했다.

## 지금까지 한 것

1. **초기 구축** (`6cd7dfe`) — 허브 페이지 + 서브키워드 랜딩 8종 + 노선 시간표 조회 도구,
   `ktx_timetable.xlsx` 원본 데이터를 `assets/timetable-data.js`로 변환해 사용
2. **AdSense/서치콘솔 연동** — `ca-pub-9196149361612087` 스크립트 전 페이지 삽입,
   Google/Naver site-verification 메타 태그 삽입 (`2eb6360`, `9e54d86`)
3. **디자인 리비전 3회** — 화이트톤 가을 팔레트로 전환, 다크모드 제거, 웹폰트·호버 애니메이션
   적용 (`e01e1e8`, `00095e0`, `7b93437`)
4. **이번 세션: 랜딩페이지 UI 개선** (`a2d8519`)
   - 히어로에 팩트 칩 3개(오픈일 상이/자동취소/매수한도) + 은은한 도트 패턴 배경 추가
   - `table.facts`를 560px 이하에서 가로 스크롤 대신 라벨/값/비고 스택 카드로 전환
     (다른 서브페이지의 표에도 공통 적용됨)
   - "상황별 자세히 보기" 8개 카드 전부 아이콘 칩 + 레일 컬러 좌측 보더로 통일
     (기존엔 1개 카드만 스타일이 달랐음)
   - 3단계 가이드에 번호 원 사이를 잇는 타임라인 커넥터 추가
   - `:focus-visible` 아웃라인 추가 (기존엔 `:hover`만 있어 키보드 접근성 공백이 있었음)

## 현재 상태 (2026-08-24 기준)

- 최신 커밋: `a2d8519` — `origin/main`에 푸시 완료, Vercel 자동 배포 트리거됨(빌드 로그 미확인)
- 정적 사이트라 `npm run build`/테스트 없음 — 변경 검증은 `python3 -m http.server`로 로컬
  서빙 + HTML/CSS 구조 육안 확인으로 진행함 (이번 세션엔 Chrome 확장 미연결로 실제 브라우저
  스크린샷 확인은 못 함 — **다음 작업 시 브라우저로 실제 렌더링 한번 확인 권장**)
- sitemap.xml에 9개 URL(허브 + 서브페이지 8개) 전부 등록됨, robots.txt 정상

## 아직 안 한 것 / 확인 필요

1. **AdSense 실제 광고 게재 여부 미확인** — 스크립트는 모든 페이지에 있지만 페이지 내
   `<!-- AD SLOT -->` 같은 수동 슬롯 마커는 현재 없음 (auto ads인지, 슬롯을 별도로 안 넣은
   것인지 확인 필요)
2. **서치콘솔/네이버 서치어드바이저 실제 제출 여부 미확인** — 메타 태그로 소유확인은 되어
   있으나 sitemap 제출·색인 요청을 실제로 했는지는 이 저장소 히스토리만으로는 알 수 없음
3. **배포 후 렌더링 실사 확인** — 이번 UI 개선분이 실제 배포 화면에서 의도대로 보이는지 확인
4. `ktx_timetable.xlsx`가 최신 KTX 시간표와 맞는지 주기적 재검증 필요 (원본 데이터 파일,
   갱신 시 `assets/timetable-data.js`도 함께 재생성해야 함)

## 프로젝트 좌표

- 작업 폴더: `~/Downloads/chuseok-train-tickets` (macOS)
- 배포 도메인: **`ktx.zucca100.com`**
- GitHub: `https://github.com/feel2174/ktx.git` (main 브랜치)
- Vercel: 프로젝트명 `chuseok-train-tickets` (project ID는 `.vercel/project.json`, 로컬에서
  `vercel link` 이미 되어 있음 — 새 디바이스에선 `vercel link`로 재연결 필요)
- 포트폴리오 형제: care-zucca100, claim-zucca100, finance-zucca100, party-zucca100.com
  (전부 zucca100 서브도메인, 이 사이트만 Next.js가 아니라 순수 정적 HTML)
- AdSense 퍼블리셔: `ca-pub-9196149361612087` (다른 zucca100 사이트와 공용)
- 로컬 환경 확인됨: Node v24.16.0, Python 3.9.6(`python3 -m http.server`로 로컬 프리뷰)

## 페이지 구조 (정적 9개)

> URL은 확장자 없는 형태로 서비스됨(CF Pages). 아래는 파일명이며 링크는 `.html` 없이 건다.

```
index.html                  허브 — 예매 일정표(+타임라인 SVG), 3단계 가이드, 참고 요금, 상황별 가이드 그리드, FAQ
booking-error.html           예매 오류·접속 폭주 대처 (신규, 트러블슈팅)
korailtalk-install.html      코레일톡(코레일+) 앱 설치 방법 (신규)
timetable.html               노선별 시간표 조회 도구 (assets/timetable-data.js 사용)
cancel-ticket.html            취소표 잡는 법 (+황금시간대·좌석 SVG)
member-integration.html       코레일·SR 통합회원 전환
priority-booking.html         사전예매 대상·서류
refund-penalty.html           취소 위약금·환불
alternative-transport.html    매진 시 대안 교통
general-train.html            무궁화·ITX 등 일반열차 예매
pet-child.html                반려동물·유아 동반
```

## 기술 규약

- 빌드 없는 순수 정적 HTML/CSS/JS. `assets/style.css` 하나를 모든 페이지가 공유.
- 로컬 미리보기: `python3 -m http.server 8000` → `http://localhost:8000`
- 팔레트/폰트: 가을 톤(`--rail`, `--persimmon`, `--moon`), `Song Myung`(제목)/`IBM Plex Sans KR`(본문)/
  `JetBrains Mono`(라벨·D-day). 다크모드는 의도적으로 제거된 상태(재도입하지 말 것 — `00095e0` 참고).
  자세한 색/타이포 규칙은 `assets/style.css` 상단 `:root` 참고.
- 한국어 줄바꿈: `body`에 `word-break:keep-all; overflow-wrap:break-word;` 기본 적용됨.
- 표 컴포넌트(`table.facts`)는 560px 이하에서 자동으로 카드형으로 전환됨 — 새 표 추가 시
  `td.label`/`td.note` 클래스 규칙을 따르면 별도 반응형 CSS 없이 그대로 적용됨.
- `vercel.json`은 `/assets/*`에 1일 캐시 헤더만 지정, 그 외 기본값.

## 재개 방법

```bash
git clone https://github.com/feel2174/ktx.git chuseok-train-tickets
cd chuseok-train-tickets
python3 -m http.server 8000   # http://localhost:8000 로 로컬 확인
vercel link                    # 새 디바이스라면 Vercel 프로젝트 재연결
```

빌드 과정이 없으므로 HTML/CSS/JS를 직접 수정 후 커밋·푸시하면 Vercel이 자동 배포한다.

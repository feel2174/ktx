# 네이버 서치어드바이저 제출 체크리스트

대상 사이트: https://ktx.zucca100.com
콘솔: https://searchadvisor.naver.com/console/board

---

## 0. 사전 확인 — 소유확인이 실제로 완료됐는지

모든 HTML 페이지에 인증 메타태그가 이미 들어가 있습니다.

```
<meta name="naver-site-verification" content="a7feb17b45eee95991f97860eff9dbf93d3845fe" />
```

**메타태그가 있다고 등록이 끝난 게 아닙니다.** 서치어드바이저 콘솔에서 사이트를 선택했을 때
"소유확인 완료" 상태인지 반드시 눈으로 확인하세요. 태그만 넣고 콘솔에서 소유확인 버튼을
누르지 않아 등록이 안 된 상태로 몇 주를 보내는 경우가 가장 흔합니다.

미완료라면: 콘솔 > 사이트 등록 > `https://ktx.zucca100.com` 입력 > HTML 태그 방식 선택 > 소유확인.

---

## 1. 사이트맵 / RSS 제출

`요청 > 사이트맵 제출` 과 `요청 > RSS 제출` 은 별개 메뉴입니다. 둘 다 제출하세요.
네이버는 사이트맵과 RSS를 **서로 다른 수집 경로**로 취급합니다.

입력란에는 **전체 URL이 아니라 경로만** 넣습니다. 도메인은 이미 등록돼 있어서
전체 URL을 넣으면 `ktx.zucca100.com/https://ktx.zucca100.com/rss.xml` 로 조합돼 실패합니다.

| 메뉴 | 입력할 값 |
|---|---|
| 사이트맵 제출 | `sitemap.xml` |
| RSS 제출 | `rss.xml` |

---

## 2. 수동 수집요청 (`요청 > 웹페이지 수집`)

검색 수요 우선순위 순입니다. 하루 제출 한도가 있으니 위에서부터 순서대로 넣으세요.
모두 라이브에서 **200** 확인 완료 (2026-09-04 기준).

| 순서 | URL | 상태 | 노리는 검색어 |
|---|---|---|---|
| 1 | `https://ktx.zucca100.com/` | 200 | 추석 기차표 예매, 2026 추석 기차표 |
| 2 | `https://ktx.zucca100.com/booking-error` | 200 | 코레일 접속 폭주, 예매 먹통, 대기번호 |
| 3 | `https://ktx.zucca100.com/cancel-ticket` | 200 | 추석 기차표 취소표, 취소표 잡는 법 |
| 4 | `https://ktx.zucca100.com/timetable` | 200 | KTX 시간표, 경부선·호남선 시간표 |
| 5 | `https://ktx.zucca100.com/korailtalk-install` | 200 | 코레일톡 설치, 코레일플러스 다운로드 |
| 6 | `https://ktx.zucca100.com/member-integration` | 200 | 코레일 SR 통합회원 전환 |
| 7 | `https://ktx.zucca100.com/priority-booking` | 200 | 추석 기차표 사전예매, 임산부 예매 |
| 8 | `https://ktx.zucca100.com/refund-penalty` | 200 | 기차표 취소 수수료, 환불 위약금 |
| 9 | `https://ktx.zucca100.com/general-train` | 200 | 무궁화호 ITX 추석 예매 |
| 10 | `https://ktx.zucca100.com/alternative-transport` | 200 | 추석 기차표 매진, 고속버스 대체 |
| 11 | `https://ktx.zucca100.com/pet-child` | 200 | 기차 반려동물 동반, 유아 요금 |

---

## 3. 제출하면 안 되는 URL

실제 응답코드를 확인한 결과입니다. 추측이 아닙니다.

| URL | 코드 | 이유 |
|---|---|---|
| `/index.html` | **308** | `cleanUrls: true` 로 확장자 없는 주소로 리다이렉트. 수집 실패로 기록됨 |
| `/booking-error.html` | **308** | 위와 동일 — `.html` 붙은 주소는 전부 308 |
| `/timetable.html` | **308** | 위와 동일 |
| `/README.md` | **404** | 배포에서 제외됨 |

`.html` 확장자가 붙은 주소는 **11개 페이지 전부** 308이 나옵니다. sitemap.xml과 rss.xml에는
이미 확장자 없는 정규 주소만 들어 있으니, 수동 제출할 때도 확장자를 붙이지 마세요.

> Vercel에서 `cleanUrls`/`"permanent": true` 는 301이 아니라 **308**을 반환합니다.

---

## 4. 배포 후 검증

```bash
SITE="https://ktx.zucca100.com"
curl -s "$SITE/rss.xml" -o /tmp/live-rss.xml
diff -q rss.xml /tmp/live-rss.xml && echo "로컬=라이브 동일"
curl -sI "$SITE/rss.xml" | grep -iE "^(http/|content-type)"
curl -s "$SITE/robots.txt" | grep -i sitemap
```

기대값:
- `content-type: application/rss+xml; charset=utf-8`
- robots.txt에 sitemap.xml, rss.xml 두 줄

---

## 5. 기대치

- **수집 ≠ 색인 ≠ 노출** 입니다. 각각 다른 단계이고, 신규 사이트는 검색 반영까지 보통 2~4주 걸립니다.
- 네이버 통합검색은 파워링크 → 스마트블록/VIEW(블로그·카페) → 지식iN 순으로 지면이 채워지고
  **웹문서 영역의 노출 지분이 작습니다.** 위 작업을 다 해도 "추석 기차표 예매" 같은
  상업성 키워드의 첫 화면 진입은 어렵습니다.
- 실제 네이버 유입의 본체는 **블로그·지식iN** 입니다. 같은 내용을 네이버 블로그에 요약 포스팅하고
  본 사이트로 링크하는 병행 전략을 권합니다. 추석 시즌 트래픽은 예매 오픈일 전후에 몰리므로
  그 2~3주 전에는 색인이 올라와 있어야 합니다.

---

## 참고 — 진단 결과 (2026-09-04)

| 항목 | 결과 |
|---|---|
| Yeti(네이버 봇) 접근 | 200, 일반 UA와 동일 응답 (차단·클로킹 없음) |
| robots.txt | 200, `User-agent: * / Allow: /` — Yeti·Daumoa 모두 허용 |
| sitemap.xml | 200, 11개 URL |
| rss.xml | 신규 생성, 11개 item |
| naver-site-verification | 11개 페이지 전부 존재 |
| canonical | 11개 페이지 전부 존재, 확장자 없는 정규 주소 |

/*
 * 트래픽 소스 게이팅 (정적 사이트용 바닐라 포팅)
 * - 유료 광고 유입(네이버 파워링크 / 구글 애즈 / 카카오 등)에만 CTA·AdSense 노출
 * - 다이렉트 / 심사원 / 크롤러 / 오가닉에는 본문만 보이는 깨끗한 페이지
 *
 * 판정은 URL 쿼리스트링 + referrer 화이트리스트로 1회 수행하고,
 * 세션 동안 sessionStorage('tg_paid')로 유지한다(내부 이동으로 파라미터가 사라져도 유지).
 * 파라미터 없이 다이렉트로 재진입하면 세션 상태를 지운다
 * (같은 브라우저에서 "심사용 다이렉트"와 "광고 클릭"이 섞이지 않도록).
 *
 * 이 스크립트는 <head>에서 동기 실행되어 <body> 렌더 전에 <html>에 is-paid 클래스를 부여한다.
 * 기본 CSS가 [data-paid-only]를 숨기고, html.is-paid 일 때만 노출하므로 깜빡임(FOUC)이 없다.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "tg_paid";

  // 네이버 광고 유입 파라미터 (NaPm: 통합 추적, n_*: 파워링크) — 키만 있으면 값 무관
  var NAVER_PAID_KEYS = [
    "NaPm", "n_media", "n_query", "n_rank", "n_ad_group",
    "n_ad", "n_keyword", "n_keyword_id", "n_campaign_type", "n_contract"
  ];
  // 카카오/다음 키워드광고
  var KAKAO_PAID_KEYS = ["kakao_ad", "kakaoAd", "kakaoad"];
  // 구글 유료 클릭
  var GOOGLE_PAID_KEYS = ["gclid", "gclsrc", "gad_source", "wbraid", "gbraid"];
  // 유료로 인정하는 utm_medium 값 (단독으로도 인정)
  var PAID_MEDIUMS = [
    "cpc", "ppc", "paid", "powerlink", "keyword",
    "moment", "paid-search", "paidsearch"
  ];
  // 광고 네트워크 referrer (보조 신호 — 쿼리 파라미터 유실 대비)
  var PAID_REFERRER_HOSTS =
    /(ad\.search\.naver\.com|adcr\.naver\.com|ad\.daum\.net|display\.ad\.daum\.net|moment\.kakao\.com|googleadservices\.com|doubleclick\.net)/i;

  function hasAnyKey(search, keys) {
    for (var i = 0; i < keys.length; i++) {
      if (search.has(keys[i])) return true;
    }
    return false;
  }

  function detectPaidTraffic(search, referrer) {
    // 1) 네이버 / 카카오 / 구글 파라미터 — 키 존재만으로 판정
    if (hasAnyKey(search, NAVER_PAID_KEYS)) return true;
    if (hasAnyKey(search, KAKAO_PAID_KEYS)) return true;
    if (hasAnyKey(search, GOOGLE_PAID_KEYS)) return true;
    // 2) utm 기반
    var medium = (search.get("utm_medium") || "").toLowerCase();
    if (PAID_MEDIUMS.indexOf(medium) !== -1) return true;
    var source = (search.get("utm_source") || "").toLowerCase();
    if (source.indexOf("powerlink") !== -1) return true;
    // 3) 광고 네트워크 referrer (보조)
    try {
      if (referrer) {
        var host = new URL(referrer).hostname;
        if (PAID_REFERRER_HOSTS.test(host)) return true;
      }
    } catch (e) { /* 잘못된 referrer 무시 */ }
    return false;
  }

  var isPaid = false;
  try {
    var search = new URLSearchParams(window.location.search);
    if (detectPaidTraffic(search, document.referrer)) {
      isPaid = true;
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
    } else if (safeGet(STORAGE_KEY) === "1") {
      // 세션 내 유료로 판정된 적 있으면 내부 이동에도 유지
      isPaid = true;
    } else {
      // 다이렉트 재진입: 유료 흔적 없으면 세션 상태도 지운다
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
  } catch (e) { /* URLSearchParams / sessionStorage 실패 무시 */ }

  function safeGet(k) {
    try { return sessionStorage.getItem(k); } catch (e) { return null; }
  }

  if (isPaid) {
    // <html>에 is-paid 부여 → CSS가 [data-paid-only] 요소를 노출
    document.documentElement.classList.add("is-paid");
    // AdSense 로더는 유료 유입에서만 주입 (다이렉트/심사 화면엔 광고 네트워크 호출조차 없음)
    try {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9196149361612087";
      s.setAttribute("crossorigin", "anonymous");
      document.head.appendChild(s);
    } catch (e) { /* 주입 실패 무시 */ }
  }
})();

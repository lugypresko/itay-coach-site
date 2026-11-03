/**
 * lp-shared.js — shared campaign landing-page runtime for itayfoyerstein.com
 *
 * What it does:
 * 1. Captures UTM params from the URL and persists them (sessionStorage),
 *    so attribution survives in-page navigation.
 * 2. Rewrites every booking CTA (links with href="#" or data-cta="book")
 *    to the real booking URL with UTM params attached.
 * 3. Fires a lp_view event — plug GA4 / Meta Pixel / LinkedIn Insight
 *    into the `track` stub below.
 *
 * CONFIG: BOOKING_URL is the approved Cal.com Leadership Diagnostic
 * (paid 75 minutes, $225). Diagnostic V3 uses DIAGNOSTIC_V3_BOOKING_URL
 * instead of this constant.
 */
(function () {
  'use strict';

  var BOOKING_URL = 'https://cal.com/itayfoyer/leadership-diagnostic-75-minutes';

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  // ---- 1. capture + persist UTMs --------------------------------------
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('itay_utm') || '{}'); } catch (e) { /* private mode */ }

  var incoming = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach(function (k) {
    var v = incoming.get(k);
    if (v) stored[k] = v;
  });
  try { sessionStorage.setItem('itay_utm', JSON.stringify(stored)); } catch (e) { /* ignore */ }

  // ---- 2. tag booking CTAs --------------------------------------------
  var qs = new URLSearchParams(stored).toString();
  var bookingHref = BOOKING_URL + (qs ? '?' + qs : '');

  function tagCtas() {
    var links = document.querySelectorAll('a[href="#"], a[data-cta="book"]');
    links.forEach(function (a) { a.href = bookingHref; });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tagCtas);
  } else {
    tagCtas();
  }

  // ---- 3. analytics hook ----------------------------------------------
  function track(event, data) {
    // GA4:   if (window.gtag) gtag('event', event, data);
    // Pixel: if (window.fbq)  fbq('trackCustom', event, data);
    if (window.console) console.debug('[lp]', event, data || {});
  }
  track('lp_view', Object.assign({ page: document.title, path: location.pathname }, stored));

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a && a.href && a.href.indexOf(BOOKING_URL) === 0) {
      track('book_click', Object.assign({ page: document.title }, stored));
    }
  });
})();

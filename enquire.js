/* ============================================================
   enquire.js — turns mailto links into a real enquiry form.

   Why this exists: every CTA on this site was a mailto: link. Those
   silently do nothing for anyone on webmail (Gmail in a browser, Outlook
   web), on a phone with no mail client configured, or on a locked-down
   work machine. The visitor clicks "Book my demo", nothing happens, and
   they leave. There is no error and no way to know it happened.

   What it does: finds every mailto link on the page and, without changing
   the href, makes it open a proper form that POSTs to Web3Forms. If the
   POST fails for any reason the mailto is offered as a visible fallback,
   so a lead can still get through. With JavaScript off, the links keep
   working exactly as they did before.

   Usage:
     <script src="/enquire.js"
             data-key="your-web3forms-access-key"
             data-subject="New enquiry from Callcatcher"
             data-phone="true"        (optional: adds a phone field)
             defer></script>
   ============================================================ */
(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  var KEY = script.getAttribute('data-key') || '';
  var SUBJECT = script.getAttribute('data-subject') || ('New enquiry from ' + document.title);
  var WANT_PHONE = script.getAttribute('data-phone') === 'true';
  var ENDPOINT = 'https://api.web3forms.com/submit';

  if (!/^[0-9a-f-]{20,}$/i.test(KEY)) return;   // no key configured: leave every mailto alone

  var P = 'enqx';                                // class prefix, kept odd to avoid clashing with the host CSS
  var dialog, form, note, lastFocus, fallbackHref = '';

  /* The host pages are dark, but detect rather than assume so this file can
     be dropped onto a light site without looking broken. */
  function isDark() {
    try {
      var bg = getComputedStyle(document.body).backgroundColor || '';
      var m = bg.match(/\d+/g);
      if (!m || m.length < 3) return true;
      var lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
      return lum < 0.5;
    } catch (e) { return true; }
  }

  function injectStyles() {
    var dark = isDark();
    var css = [
      '.' + P + '-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;',
      'background:rgba(3,6,8,.68);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}',
      // display:flex above outranks the UA stylesheet's [hidden]{display:none}, so the
      // hidden attribute alone would not close the dialog. Restore it explicitly.
      '.' + P + '-ov[hidden]{display:none}',
      '.' + P + '-pn{width:100%;max-width:440px;max-height:88vh;overflow-y:auto;border-radius:16px;padding:26px 24px 22px;',
      'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.5;',
      dark
        ? 'background:#11171a;color:#eef4f2;border:1px solid rgba(255,255,255,.13);box-shadow:0 26px 70px rgba(0,0,0,.6)}'
        : 'background:#fff;color:#131a18;border:1px solid rgba(0,0,0,.1);box-shadow:0 26px 70px rgba(0,0,0,.22)}',
      '.' + P + '-pn h2{margin:0 0 6px;font-size:21px;line-height:1.2;font-weight:700;letter-spacing:-.01em}',
      '.' + P + '-pn p.' + P + '-sub{margin:0 0 18px;font-size:14.5px;opacity:.72}',
      '.' + P + '-pn label{display:block;font-size:13px;font-weight:600;margin:13px 0 5px;opacity:.9}',
      '.' + P + '-pn input,.' + P + '-pn textarea{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:11px 12px;border-radius:9px;',
      dark
        ? 'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);color:inherit}'
        : 'background:#fbfbfa;border:1px solid rgba(0,0,0,.16);color:inherit}',
      '.' + P + '-pn textarea{min-height:92px;resize:vertical}',
      '.' + P + '-pn input:focus-visible,.' + P + '-pn textarea:focus-visible{outline:2px solid #2BE38A;outline-offset:1px}',
      '.' + P + '-row{display:flex;gap:10px;align-items:center;margin-top:18px;flex-wrap:wrap}',
      '.' + P + '-go{flex:1 1 auto;min-width:150px;font:inherit;font-size:15px;font-weight:700;padding:12px 18px;border:0;border-radius:999px;',
      'background:#2BE38A;color:#03130b;cursor:pointer}',
      '.' + P + '-go[disabled]{opacity:.6;cursor:default}',
      '.' + P + '-x{position:absolute;top:12px;right:14px;background:none;border:0;font-size:26px;line-height:1;cursor:pointer;color:inherit;opacity:.6;padding:4px 8px}',
      '.' + P + '-x:hover{opacity:1}',
      '.' + P + '-note{margin-top:12px;font-size:13.5px;min-height:1.2em}',
      '.' + P + '-note a{color:#2BE38A;font-weight:600}',
      '.' + P + '-fine{margin-top:14px;font-size:12px;opacity:.6}',
      '.' + P + '-fine a{color:inherit;text-decoration:underline}',
      '.' + P + '-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}',
      '@media (prefers-reduced-motion:no-preference){.' + P + '-pn{animation:' + P + 'in .18s ease-out}',
      '@keyframes ' + P + 'in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}'
    ].join('');
    var s = document.createElement('style');
    s.setAttribute('data-' + P, '');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function build() {
    var ov = document.createElement('div');
    ov.className = P + '-ov';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-labelledby', P + '-title');
    ov.hidden = true;

    ov.innerHTML =
      '<div class="' + P + '-pn" style="position:relative">' +
        '<button type="button" class="' + P + '-x" aria-label="Close">&times;</button>' +
        '<h2 id="' + P + '-title">Send us a message</h2>' +
        '<p class="' + P + '-sub">Fill this in and we\'ll reply, usually the same working day.</p>' +
        '<form novalidate>' +
          '<label for="' + P + '-n">Your name</label>' +
          '<input id="' + P + '-n" name="name" type="text" autocomplete="name" required>' +
          '<label for="' + P + '-e">Email</label>' +
          '<input id="' + P + '-e" name="email" type="email" autocomplete="email" required>' +
          (WANT_PHONE
            ? '<label for="' + P + '-p">Phone <span style="font-weight:400;opacity:.65">(optional)</span></label>' +
              '<input id="' + P + '-p" name="phone" type="tel" autocomplete="tel">'
            : '') +
          '<label for="' + P + '-m">What do you need?</label>' +
          '<textarea id="' + P + '-m" name="message" required></textarea>' +
          '<input type="checkbox" name="botcheck" class="' + P + '-hp" tabindex="-1" autocomplete="off">' +
          '<div class="' + P + '-row"><button type="submit" class="' + P + '-go">Send message</button></div>' +
          '<div class="' + P + '-note" role="status" aria-live="polite"></div>' +
          '<p class="' + P + '-fine">Your details go straight to our inbox so we can reply. Nothing else is collected.</p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(ov);
    dialog = ov;
    form = ov.querySelector('form');
    note = ov.querySelector('.' + P + '-note');

    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.' + P + '-x').addEventListener('click', close);
    form.addEventListener('submit', submit);
    document.addEventListener('keydown', function (e) {
      if (!dialog || dialog.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') trapFocus(e);
    });
  }

  function focusables() {
    return [].slice.call(dialog.querySelectorAll('button,input,textarea,a[href]'))
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function trapFocus(e) {
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open(href) {
    fallbackHref = href || '';
    if (!dialog) build();
    note.textContent = '';
    dialog.hidden = false;
    lastFocus = document.activeElement;
    document.documentElement.style.overflow = 'hidden';
    var n = dialog.querySelector('#' + P + '-n');
    if (n) n.focus();
  }

  function close() {
    if (!dialog) return;
    dialog.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* A failed send must never look like a sent one. Show the mailto so the
     visitor still has a way through. */
  function failed(msg) {
    var link = fallbackHref
      ? ' <a href="' + fallbackHref + '">Email us directly instead</a>.'
      : '';
    note.innerHTML = '<span style="color:#ff8f86">' + msg + '</span>' + link;
  }

  function submit(e) {
    e.preventDefault();
    var btn = form.querySelector('.' + P + '-go');
    var data = { access_key: KEY, subject: SUBJECT, from_name: document.title, page: location.href };
    var missing = false;
    ['name', 'email', 'phone', 'message'].forEach(function (k) {
      var el = form.querySelector('[name="' + k + '"]');
      if (!el) return;
      data[k] = el.value.trim();
      if (el.required && !data[k]) missing = true;
    });
    if (missing) { note.innerHTML = '<span style="color:#ff8f86">Please fill in your name, email and message.</span>'; return; }
    if (form.querySelector('[name="botcheck"]').checked) { close(); return; }

    btn.disabled = true;
    note.textContent = 'Sending…';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) {
        btn.disabled = false;
        if (d && d.success) {
          form.innerHTML = '<p style="font-size:16px;margin:8px 0 0">Thanks — that\'s with us.</p>' +
            '<p style="font-size:14.5px;opacity:.75;margin-top:8px">We\'ll reply to the address you gave, usually the same working day.</p>';
        } else {
          failed('That didn\'t send.');
        }
      })
      .catch(function () { btn.disabled = false; failed('That didn\'t send — you may be offline.'); });
  }

  function wire() {
    injectStyles();
    var links = document.querySelectorAll('a[href^="mailto:"]');
    for (var i = 0; i < links.length; i++) {
      (function (a) {
        a.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;  // let people open it their own way
          e.preventDefault();
          open(a.getAttribute('href'));
        });
      })(links[i]);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();

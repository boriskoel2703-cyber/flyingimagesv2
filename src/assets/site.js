(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');

  /* Header: transparant op hero, solide na scrollen */
  function onScroll() {
    if (!header) return;
    var solid = window.scrollY > 24;
    header.classList.toggle('is-solid', solid);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mega menu: hover op desktop, klik/toetsenbord overal */
  var trigger = document.querySelector('[data-mega-trigger]');
  var mega = document.getElementById('mega');
  var li = trigger && trigger.closest('.has-mega');
  var closeTimer;
  function setMega(open) {
    if (!mega) return;
    mega.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    header.classList.toggle('menu-open', open);
  }
  if (trigger && mega) {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHover) {
      [li, mega].forEach(function (el) {
        el.addEventListener('mouseenter', function () { clearTimeout(closeTimer); setMega(true); });
        el.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { setMega(false); }, 160); });
      });
    }
    trigger.addEventListener('click', function () { setMega(trigger.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') { setMega(false); trigger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!li.contains(e.target) && !mega.contains(e.target)) setMega(false);
    });
    mega.addEventListener('focusout', function (e) {
      if (!mega.contains(e.relatedTarget) && e.relatedTarget !== trigger) setMega(false);
    });
  }

  /* Mobiel menu */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
    });
    drawer.querySelectorAll('[data-acc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.hidden = !open;
      });
    });
  }

  /* Diensten-verkenner (tabs) */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on;
      if (on && !reduce) { p.classList.remove('anim'); void p.offsetWidth; p.classList.add('anim'); }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });

  /* Reveal bij scrollen: alleen voor elementen die bij laden onder de vouw staan */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
      else io.observe(el);
    });
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 4000);
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Tellers */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = pre + end + suf; return; }
    var t0 = null, dur = 1200;
    function tick(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var v = Math.round(end * (1 - Math.pow(1 - k, 3)));
      el.textContent = pre + v + suf;
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: .6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Parallax op hero-beeld */
  var heroImg = document.querySelector('.hero-media img');
  if (heroImg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroImg.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0) scale(1.04)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* Hero-afbeelding (vast bestand in de repo): infaden zodra geladen */
  if (heroImg) {
    var shown = false, show = function () { if (!shown) { shown = true; heroImg.classList.add('ready'); } };
    if (heroImg.complete) show(); else { heroImg.addEventListener('load', show); heroImg.addEventListener('error', show); }
    setTimeout(show, 1500);
  }

  /* Contactformulier (Web3Forms) */
  var form = document.getElementById('contact-form');
  if (form) {
    var sel = form.querySelector('#f-dienst');
    try {
      var q = new URLSearchParams(location.search).get('dienst');
      if (q && sel) sel.value = q;
    } catch (e) {}
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var btn = form.querySelector('button[type="submit"]');
      var key = form.getAttribute('data-key');
      status.hidden = false;
      if (!form.checkValidity()) { status.className = 'form-status err'; status.textContent = 'Vul je naam, e-mailadres en bericht in.'; return; }
      if (!key || key.indexOf('VUL-HIER') === 0) {
        status.className = 'form-status err';
        status.textContent = 'Het formulier is nog niet gekoppeld. Mail ons direct op info@flyingimages.nl.';
        return;
      }
      btn.disabled = true; btn.textContent = 'Versturen…';
      var data = new FormData(form);
      data.append('access_key', key);
      data.append('subject', 'Nieuwe aanvraag via flyingimages.nl');
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error();
          status.className = 'form-status ok';
          status.textContent = 'Bedankt! Je bericht is binnen. We nemen zo snel mogelijk contact met je op.';
          form.reset();
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Versturen lukte niet. Mail ons direct op info@flyingimages.nl.';
        })
        .finally(function () { btn.disabled = false; btn.textContent = 'Verstuur je bericht'; });
    });
  }


  /* Voortgangslijn (werkwijze-route) */
  var routes = document.querySelectorAll('[data-progress]');
  if (routes.length) {
    var updRoute = function () {
      routes.forEach(function (r) {
        var b = r.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh * 0.6 - b.top) / b.height));
        r.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
        r.querySelectorAll('.route-step').forEach(function (st) {
          st.classList.toggle('lit', reduce || st.getBoundingClientRect().top < vh * 0.6);
        });
      });
    };
    updRoute();
    window.addEventListener('scroll', function () { requestAnimationFrame(updRoute); }, { passive: true });
    window.addEventListener('resize', updRoute);
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  /* Prijsmelding: bij elke pagina openen, sluiten met het kruisje */
  var notice = document.getElementById('priceNotice');
  if (notice) {
    setTimeout(function () { notice.classList.add('is-open'); }, reduce ? 0 : 700);
    var closeNotice = function () { notice.classList.remove('is-open'); window.removeEventListener('scroll', onNoticeScroll); };
    var maxY = window.scrollY; // alleen bij omhoog scrollen inklappen
    var onNoticeScroll = function () { var y = window.scrollY; if (y > maxY) maxY = y; else if (maxY - y > 40) closeNotice(); };
    window.addEventListener('scroll', onNoticeScroll, { passive: true });
    notice.querySelector('.pn-close').addEventListener('click', closeNotice);
  }

  /* Cookiebanner: Google Analytics alleen na toestemming. Keuze 12 maanden onthouden. */
  var CK = 'fi-consent', YEAR = 31536e6;
  function getConsent() {
    try { var c = JSON.parse(localStorage.getItem(CK)); return c && Date.now() - c.t < YEAR ? c.v : null; } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(CK, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }
  function clearGACookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }
  var banner = null;
  function closeBanner() {
    if (!banner) return;
    banner.classList.remove('is-open');
    var b = banner; banner = null;
    setTimeout(function () { b.remove(); }, reduce ? 0 : 400);
  }
  function openBanner() {
    if (banner) return;
    var priv = document.querySelector('.foot-bottom a[href*="privacy"]');
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-toestemming');
    banner.innerHTML =
      '<p class="cb-title">Mogen we meten?</p>' +
      '<p class="cb-text">We gebruiken analytische cookies (Google Analytics) om te zien hoe onze site wordt gebruikt en hem te verbeteren. Alleen als jij dat goed vindt. ' +
      '<a href="' + (priv ? priv.getAttribute('href') : '/privacy') + '#cookies">Meer in onze privacyverklaring</a>.</p>' +
      '<div class="cb-actions"><button type="button" class="btn btn-sand" data-cb="ja">Accepteren</button>' +
      '<button type="button" class="btn btn-ghost" data-cb="nee">Weigeren</button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cb]');
      if (!btn) return;
      var v = btn.getAttribute('data-cb'), was = getConsent();
      setConsent(v);
      closeBanner();
      if (v === 'ja') { if (window.fiLoadGA) window.fiLoadGA(); }
      else { clearGACookies(); if (was === 'ja' || window.fiGA) location.reload(); }
    });
    requestAnimationFrame(function () { if (banner) banner.classList.add('is-open'); });
  }
  if (getConsent() !== 'ja') clearGACookies(); // oude GA-cookies zonder geldige toestemming opruimen
  if (!getConsent()) setTimeout(openBanner, reduce ? 0 : 900);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); openBanner(); }
  });
})();

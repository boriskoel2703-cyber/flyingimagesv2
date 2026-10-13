// Prijzen uit /system → Prijzen. Staat daar niets opgeslagen, dan blijven de prijzen uit src/data.mjs staan.
(function () {
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var base = document.querySelector('script[src*="assets/prices.js"]');
  var root = base ? base.getAttribute('src').replace(/assets\/prices\.js.*$/, '') : '/';
  var get = function (u) { return fetch(u, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };

  function effective(b, cfg) {
    var t = String(cfg.tijdelijkePrijs || '').trim();
    var sv = {}, cats = {}, pk = [];
    b.services.forEach(function (s) {
      var o = (cfg.services || {})[s.slug] || {};
      var p = { from: o.from || s.from, unit: o.unit != null && o.unit !== '' ? o.unit : s.unit, monthly: o.monthly != null ? o.monthly : s.monthly, note: o.note != null ? o.note : s.note };
      if (t) { p.from = t; p.monthly = ''; if (p.note && p.note.indexOf('€') > -1) p.note = ''; }
      sv[s.slug] = p;
    });
    b.categories.forEach(function (c) { cats[c.id] = t || ((cfg.categories || {})[c.id]) || c.from; });
    b.packages.forEach(function (p) { pk.push(p); }); // pakketprijzen = som diensten - €100, niet overschreven door de tijdelijke prijs
    return { services: sv, categories: cats, packages: pk };
  }
  var unitText = function (p) { return esc(p.unit) + (p.monthly ? ' + ' + esc(p.monthly) + '/mnd' : ''); };

  var OA = { card: 'prijs<strong>op aanvraag</strong>', chip: 'prijs <strong>op aanvraag</strong>', mini: 'prijs<b>op aanvraag</b>', cat: 'prijs <strong>op aanvraag</strong>',
    aside: '<div class="amount">Op aanvraag</div><p class="note">Je krijgt vooraf een helder voorstel met vaste prijs.</p>', pkg: '<div class="amount">Op aanvraag</div><div class="unit">voorstel op maat</div>' };
  function texts(on) { document.querySelectorAll('[data-pt-on]').forEach(function (el) { el.textContent = el.getAttribute(on ? 'data-pt-on' : 'data-pt-off'); }); }
  function hide() { document.documentElement.setAttribute('data-prijzen', 'uit'); document.querySelectorAll('[data-p]').forEach(function (el) { var k = OA[el.getAttribute('data-p')]; if (k) el.innerHTML = k; }); texts(false); }

  function apply(e) {
    document.documentElement.setAttribute('data-prijzen', 'aan');
    texts(true);
    document.querySelectorAll('[data-p]').forEach(function (el) {
      var kind = el.getAttribute('data-p'), p = e.services[el.getAttribute('data-slug')];
      if (kind === 'card' && p) el.innerHTML = 'vanaf<strong>' + esc(p.from) + '</strong> ' + unitText(p);
      else if (kind === 'chip' && p) el.innerHTML = 'vanaf <strong>' + esc(p.from) + '</strong> ' + unitText(p);
      else if (kind === 'mini' && p) el.innerHTML = 'vanaf<b>' + esc(p.from) + '</b>';
      else if (kind === 'aside' && p) el.innerHTML = '<div class="amount"><small style="margin:0 6px 0 0">vanaf</small>' + esc(p.from) + '<small>' + esc(p.unit) + '</small></div>'
        + (p.monthly ? '<p class="monthly">+ <strong>' + esc(p.monthly) + '</strong> per maand</p>' : '')
        + (p.note ? '<p class="note">' + esc(p.note) + '</p>' : '');
      else if (kind === 'cat') { var c = e.categories[el.getAttribute('data-cat')]; if (c) el.innerHTML = 'vanaf <strong>' + esc(c) + '</strong>'; }
      else if (kind === 'pkg') { var k = e.packages[+el.getAttribute('data-i')]; if (k) el.innerHTML = '<div class="amount">' + esc(k.price) + '</div><div class="unit">' + esc(k.unit) + '</div>'; }
    });
  }

  if (!document.querySelector('[data-p]')) return;
  Promise.all([get(root + 'assets/prices-base.json'), get('/api/prices')]).then(function (r) {
    var b = r[0], cfg = r[1] && r[1].config; if (!b) return;
    // Zichtbaar: keuze uit /system wint, anders die uit de code (src/data.mjs → prijzenZichtbaar)
    var on = cfg && typeof cfg.zichtbaar === 'boolean' ? cfg.zichtbaar : b.zichtbaar !== false;
    if (!on) { if (b.zichtbaar !== false) hide(); return; }
    apply(effective(b, cfg || { tijdelijkePrijs: b.tijdelijkePrijs }));
  });
  window.FIPrices = { effective: effective };
})();

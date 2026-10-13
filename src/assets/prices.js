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

  function apply(e) {
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
    if (r[0] && r[1] && r[1].config) apply(effective(r[0], r[1].config));
  });
  window.FIPrices = { effective: effective };
})();

// Prijzen uit /system → Prijzen. Staat daar niets opgeslagen, dan blijven de prijzen uit src/data.mjs staan.
(function () {
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var base = document.querySelector('script[src*="assets/prices.js"]');
  var root = base ? base.getAttribute('src').replace(/assets\/prices\.js.*$/, '') : '/';
  var get = function (u) { return fetch(u, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };

  var num = function (v) { var n = Number(String(v || '').replace(/[^0-9]/g, '')); return n > 0 ? n : null; };
  var pkKey = function (p) { return String(p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'); };

  function effective(b, cfg) {
    var t = String(cfg.tijdelijkePrijs || '').trim();
    var sv = {}, cats = {}, pk = [];
    b.services.forEach(function (s) {
      var o = (cfg.services || {})[s.slug] || {};
      var p = { from: o.from || s.from, unit: o.unit != null && o.unit !== '' ? o.unit : s.unit, monthly: o.monthly != null ? o.monthly : s.monthly, note: o.note != null ? o.note : s.note, tonen: o.tonen !== false };
      if (t) { p.from = t; p.monthly = ''; if (p.note && p.note.indexOf('€') > -1) p.note = ''; }
      sv[s.slug] = p;
    });
    // Categorie: laagste prijs van de diensten die een prijs tonen. Geen enkele = op aanvraag.
    b.categories.forEach(function (c) {
      var best = null;
      b.services.forEach(function (s) {
        var p = sv[s.slug]; if (s.cat !== c.id || !p.tonen) return;
        if (!best || (num(p.from) != null && (num(best) == null || num(p.from) < num(best)))) best = p.from;
      });
      cats[c.id] = best;
    });
    b.packages.forEach(function (p) { pk.push({ price: p.price, unit: p.unit, tonen: (cfg.packages || {})[pkKey(p)] !== false }); }); // pakketprijzen = som diensten - €100, niet overschreven door de tijdelijke prijs
    return { services: sv, categories: cats, packages: pk };
  }
  var unitText = function (p) { return esc(p.unit) + (p.monthly ? ' + ' + esc(p.monthly) + '/mnd' : ''); };

  var OA = { card: 'prijs<strong>op aanvraag</strong>', chip: 'prijs <strong>op aanvraag</strong>', mini: 'prijs<b>op aanvraag</b>', cat: 'prijs <strong>op aanvraag</strong>',
    aside: '<div class="amount">Op aanvraag</div><p class="note">Je krijgt vooraf een helder voorstel met vaste prijs.</p>', pkg: '<div class="amount">Op aanvraag</div><div class="unit">voorstel op maat</div>' };
  function texts(on) { document.querySelectorAll('[data-pt-on]').forEach(function (el) { el.textContent = el.getAttribute(on ? 'data-pt-on' : 'data-pt-off'); }); }
  function hide() { document.documentElement.setAttribute('data-prijzen', 'uit'); document.querySelectorAll('[data-p]').forEach(function (el) { var k = OA[el.getAttribute('data-p')]; if (k) el.innerHTML = k; }); texts(false); }

  function apply(e) {
    var keys = Object.keys(e.services);
    var any = keys.some(function (k) { return e.services[k].tonen; }) || e.packages.some(function (p) { return p.tonen; });
    var all = keys.every(function (k) { return e.services[k].tonen; });
    document.documentElement.setAttribute('data-prijzen', any ? 'aan' : 'uit');
    texts(all);
    document.querySelectorAll('[data-p]').forEach(function (el) {
      var kind = el.getAttribute('data-p'), p = e.services[el.getAttribute('data-slug')];
      if (p && !p.tonen) { if (OA[kind]) el.innerHTML = OA[kind]; return; }
      if (kind === 'card' && p) el.innerHTML = 'vanaf<strong>' + esc(p.from) + '</strong> ' + unitText(p);
      else if (kind === 'chip' && p) el.innerHTML = 'vanaf <strong>' + esc(p.from) + '</strong> ' + unitText(p);
      else if (kind === 'mini' && p) el.innerHTML = 'vanaf<b>' + esc(p.from) + '</b>';
      else if (kind === 'aside' && p) el.innerHTML = '<div class="amount"><small style="margin:0 6px 0 0">vanaf</small>' + esc(p.from) + '<small>' + esc(p.unit) + '</small></div>'
        + (p.monthly ? '<p class="monthly">+ <strong>' + esc(p.monthly) + '</strong> per maand</p>' : '')
        + (p.note ? '<p class="note">' + esc(p.note) + '</p>' : '');
      else if (kind === 'cat') { var c = e.categories[el.getAttribute('data-cat')]; el.innerHTML = c ? 'vanaf <strong>' + esc(c) + '</strong>' : OA.cat; }
      else if (kind === 'pkg') { var k = e.packages[+el.getAttribute('data-i')]; if (k) el.innerHTML = k.tonen ? '<div class="amount">' + esc(k.price) + '</div><div class="unit">' + esc(k.unit) + '</div>' : OA.pkg; }
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

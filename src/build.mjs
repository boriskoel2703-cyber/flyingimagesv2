// Bouwt de statische site.
//   node src/build.mjs          -> dist/    (voor Vercel, schone URL's)
//   node src/build.mjs preview  -> preview/ (relatieve .html-links, voor lokale preview)
import { mkdirSync, writeFileSync, cpSync, rmSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, categories, services, stepSets, packages } from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODE = process.argv[2] === 'preview' ? 'preview' : 'vercel';
const OUT = join(ROOT, MODE === 'preview' ? 'preview' : 'dist');
const ASSET_V = Date.now().toString(36);

/* ---------- helpers ---------- */
const svc = (slug) => services.find((s) => s.slug === slug);
const cat = (id) => categories.find((c) => c.id === id);
const byCat = (id) => services.filter((s) => s.cat === id);
const unitText = (p) => p.unit + (p.monthly ? ` + ${p.monthly}/mnd` : '');

function makeUrl(from) {
  const depth = from.split('/').length - 1;
  const up = '../'.repeat(depth);
  return (to) => {
    if (MODE === 'vercel') {
      if (to === 'index') return '/';
      if (to.endsWith('/index')) return '/' + to.slice(0, -6);
      return '/' + to;
    }
    return up + to + '.html';
  };
}
function makeAsset(from) {
  const depth = from.split('/').length - 1;
  return (p) => (MODE === 'vercel' ? '/' + p : '../'.repeat(depth) + p);
}

const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.8 7L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M7 10v7M7 7v.01M11 17v-4a3 3 0 0 1 6 0v4M11 10v7"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>',
};
const SVC_ICON = {
  'website-laten-maken': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  'webshop-laten-maken': '<path d="M5 7h14l-1.5 9h-11z"/><path d="M9 7a3 3 0 0 1 6 0"/><circle cx="9" cy="20" r="1"/><circle cx="16" cy="20" r="1"/>',
  'maatwerk-website': '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  'online-marketing': '<path d="M4 14V10l12-5v14L4 14Z"/><path d="M8 15v4h3v-3"/>',
  'zoekmachine-optimalisatie': '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5M8.5 12.5l2-2 1.5 1.5 2-2.5"/>',
  'google-ads': '<path d="M4 19h16M7 15l3-4 3 2 4-6"/><path d="M15 7h2v2"/>',
  'llm-vindbaarheid': '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="m7 7 1.5 1.5M15.5 15.5 17 17M17 7l-1.5 1.5M8.5 15.5 7 17"/><circle cx="12" cy="12" r="3"/>',
  'ai-oplossingen': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/><path d="M10 10h4v4h-4z"/>',
  'data-analyse-rapportage': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  'rebranding': '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="8" cy="14" r="1.2"/><path d="M14 20a2 2 0 0 1 0-4h2"/>',
  'drone-fotografie-video': '<circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
  'fpv-drone-beelden': '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4l-3-3-3 3H5a2 2 0 0 1-2-2z"/>',
};
const icon = (slug) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVC_ICON[slug]}</svg>`;

function picture(a, base, alt, { sizes = '100vw', eager = false, cls = '' } = {}) {
  const set = (ext) => [800, 1400, 2400].map((w) => `${a(`img/${base}-${w}.${ext}`)} ${w}w`).join(', ');
  return `<picture><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img ${cls ? `class="${cls}" ` : ''}src="${a(`img/${base}-1400.jpg`)}" srcset="${set('jpg')}" sizes="${sizes}" alt="${alt}" width="2400" height="1350"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
}
function pictureSq(a, alt) {
  return `<picture><source type="image/webp" srcset="${a('img/drone-brug-sq.webp')}"><img src="${a('img/drone-brug-sq.jpg')}" alt="${alt}" width="1200" height="1200" loading="lazy" decoding="async"></picture>`;
}

/* ---------- layout ---------- */
const NAV = [
  ['index', 'Home'],
  ['diensten/index', 'Diensten', true],
  ['werkwijze', 'Werkwijze'],
  ['portfolio', 'Portfolio'],
  ['over-ons', 'Over ons'],
  ['contact', 'Contact'],
];

function header(u, current, overlay) {
  const megaCols = categories.map((c) => `
          <div class="mega-col">
            <h3>${c.name}</h3>
            <p class="cat-desc">${c.desc}</p>
            ${byCat(c.id).map((s) => `<a class="mega-link" href="${u('diensten/' + s.slug)}"><strong>${s.name}${I.arrow}</strong><small>${s.short}</small></a>`).join('\n            ')}
          </div>`).join('');

  const links = NAV.map(([href, label, mega]) => {
    const isCur = current === href || (mega && current.startsWith('diensten/'));
    if (mega) {
      return `<li class="has-mega"><button class="nav-link" type="button" data-mega-trigger aria-expanded="false" aria-controls="mega"${isCur ? ' aria-current="page"' : ''}>Diensten ${I.chev}</button></li>`;
    }
    return `<li><a class="nav-link" href="${u(href)}"${isCur ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('');

  const drawerCats = categories.map((c) => `
        <div>
          <h3>${c.name}</h3>
          ${byCat(c.id).map((s) => `<a href="${u('diensten/' + s.slug)}">${s.name}</a>`).join('')}
        </div>`).join('');

  return `
<a class="skip" href="#main">Direct naar inhoud</a>
<header class="site-header${overlay ? ' is-overlay' : ''}">
  <div class="wrap header-inner">
    <a class="logo" href="${u('index')}" aria-label="Flying Images, naar de homepage">Flying Images<span></span></a>
    <nav class="nav" aria-label="Hoofdmenu"><ul class="nav-list">${links}</ul></nav>
    <div class="header-cta">
      <a class="btn btn-sand btn-sm" href="${u('contact')}">Vrijblijvend gesprek ${I.arrow}</a>
      <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
    </div>
    <div class="mega" id="mega">
      <div class="mega-panel">
        <div class="mega-grid">${megaCols}
        </div>
        <div class="mega-foot">
          <a class="all" href="${u('diensten/index')}">Alle diensten ${I.arrow}</a>
          <span class="note">Geen goedkeuring, geen factuur. Ook bij onze nieuwe diensten.</span>
        </div>
      </div>
    </div>
  </div>
</header>
<div class="drawer" id="drawer">
  <a class="d-link" href="${u('index')}">Home</a>
  <button class="d-link" type="button" data-acc aria-expanded="false" aria-controls="d-diensten">Diensten ${I.chev}</button>
  <div class="d-sub" id="d-diensten" hidden>${drawerCats}
    <a href="${u('diensten/index')}"><b>Alle diensten</b></a>
  </div>
  <a class="d-link" href="${u('werkwijze')}">Werkwijze</a>
  <a class="d-link" href="${u('portfolio')}">Portfolio</a>
  <a class="d-link" href="${u('over-ons')}">Over ons</a>
  <a class="d-link" href="${u('contact')}">Contact</a>
  <div class="d-cta"><a class="btn btn-sand" href="${u('contact')}">Plan een vrijblijvend gesprek ${I.arrow}</a></div>
</div>`;
}

function footer(u, withSg = true) {
  const soc = [];
  if (site.socials.instagram) soc.push(`<a href="${site.socials.instagram}" aria-label="Instagram">${I.insta}</a>`);
  if (site.socials.linkedin) soc.push(`<a href="${site.socials.linkedin}" aria-label="LinkedIn">${I.linkedin}</a>`);
  const col = (ids, title) => `<div><h4>${title}</h4><ul>${services.filter((s) => ids.includes(s.cat)).map((s) => `<li><a href="${u('diensten/' + s.slug)}">${s.name}</a></li>`).join('')}</ul></div>`;
  return `
<footer class="site-footer${withSg ? ' has-sg' : ''}">
  ${withSg ? supergraphic('sg-soft sg-foot') : ''}
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="logo" href="${u('index')}">Flying Images<span></span></a>
        <p>${site.tagline} Websites, vindbaarheid, AI en beelden vanuit de lucht. Gebouwd door Job en Boris in ${site.city}.</p>
      </div>
      ${col(['web', 'beeld'], 'Bouwen & beeld')}
      ${col(['vind', 'ai'], 'Groeien & slimmer werken')}
      <div>
        <h4>Contact</h4>
        <ul class="foot-contact">
          <li><a href="mailto:${site.email}">${site.email}</a></li>
          <li>KvK ${site.kvk}</li>
          <li>${site.city}, Nederland</li>
          <li style="margin-top:10px"><a href="${u('werkwijze')}">Werkwijze</a></li>
          <li><a href="${u('over-ons')}">Over ons</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span id="year">2026</span> Flying Images · Job &amp; Boris Koelman · Prijzen excl. btw</span>
      ${soc.length ? `<div class="socials">${soc.join('')}</div>` : ''}
    </div>
  </div>
</footer>`;
}

function ctaBand(u, title = 'Klaar om te beginnen?', text = 'Plan een vrijblijvend gesprek. Het eerste contact is altijd gratis, en je betaalt pas als je tevreden bent.') {
  return `
<section class="section deep on-dark cta-band">
  <div class="wrap reveal">
    <h2>${title}</h2>
    <p>${text}</p>
    <div class="hero-ctas"><a class="btn btn-sand" href="${u('contact')}">Plan een vrijblijvend gesprek ${I.arrow}</a><a class="btn btn-ghost" href="${u('diensten/index')}">Bekijk alle diensten</a></div>
  </div>
</section>`;
}

/* FI-supergraphic (monogram F + I), inline zodat de lijnen kunnen intekenen */
function supergraphic(cls = '') {
  const w = 0.26; // 1.5px bij schaal 5.8
  return `<svg class="sg ${cls}" viewBox="0 0 1440 810" preserveAspectRatio="xMaxYMid slice" fill="none" aria-hidden="true" focusable="false">
    <path class="sg-line" pathLength="1" d="M0 308 H1440" stroke="#C8AD87" stroke-opacity=".35" stroke-width="1.5"/>
    <g transform="translate(825 -40) scale(5.8)" stroke-width="${w}">
      <path class="sg-p sg-1" pathLength="1" d="M0 4 Q0 0 4 0 H86 Q90 0 90 4 V24 Q90 28 86 28 H30 V50 H66 Q70 50 70 54 V58 H0 Z" fill="#F7F5F2" fill-opacity=".04" stroke="#F7F5F2" stroke-opacity=".2"/>
      <path class="sg-p sg-2" pathLength="1" d="M0 62 H70 V72 Q70 76 66 76 H30 V116 Q30 120 26 120 H4 Q0 120 0 116 Z" stroke="#F7F5F2" stroke-opacity=".09"/>
      <path class="sg-p sg-3" pathLength="1" d="M100 4 Q100 0 104 0 H126 Q130 0 130 4 V58 H100 Z" fill="#C8AD87" fill-opacity=".08" stroke="#C8AD87" stroke-opacity=".75"/>
      <path class="sg-p sg-4" pathLength="1" d="M100 62 H130 V116 Q130 120 126 120 H104 Q100 120 100 116 Z" stroke="#C8AD87" stroke-opacity=".35"/>
    </g>
  </svg>`;
}

function pageHero(u, a, { eyebrow, title, lead, crumbs = [], meta = '' }) {
  const cr = crumbs.length ? `<nav class="crumbs" aria-label="Kruimelpad"><a href="${u('index')}">Home</a>${crumbs.map(([href, l]) => `<span aria-hidden="true">/</span>${href ? `<a href="${u(href)}">${l}</a>` : `<span aria-current="page">${l}</span>`}`).join('')}</nav>` : '';
  return `
<section class="page-hero on-dark">
  ${supergraphic('sg-hero')}
  <div class="wrap page-hero-inner hero-load">
    ${cr}
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${meta}
  </div>
</section>`;
}

function svcCard(u, s, showCat = false) {
  return `<a class="svc-card" data-cat="${s.cat}" href="${u('diensten/' + s.slug)}">
    <span class="icon">${icon(s.slug)}</span>
    ${showCat ? `<span class="cat">${cat(s.cat).name}</span>` : ''}
    <h3>${s.name}</h3>
    <p>${s.intro.split('. ')[0]}.</p>
    <div class="foot"><span class="from">vanaf<strong>${s.price.from}</strong> ${unitText(s.price)}</span><span class="arrow">${I.arrow}</span></div>
  </a>`;
}

function stepsBlock(set, dark = false) {
  return `<div class="steps${dark ? '' : ''}">${stepSets[set].map(([t, d], i) => `
      <div class="step reveal"><span class="step-num">STAP 0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>`;
}

function faqBlock(items) {
  return `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}<span class="pm">${I.plus}</span></summary><p>${a}</p></details>`).join('')}</div>`;
}

function doc({ path, title, desc, body, overlay = false, jsonld = '' }) {
  const u = makeUrl(path);
  const a = makeAsset(path);
  const canonical = site.domain + u(path);
  // CTA-blok onderaan gaat samen met de footer in één doorlopend vlak
  let main = body(u, a);
  let cta = '';
  const ci = main.lastIndexOf('<section class="section deep on-dark cta-band">');
  if (ci !== -1 && main.slice(ci).trim().endsWith('</section>')) { cta = main.slice(ci); main = main.slice(0, ci); }
  const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
${MODE === 'vercel' ? `<link rel="canonical" href="${canonical}">` : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${site.domain}/img/drone-brug-1400.jpg">
<meta name="theme-color" content="#0A1727">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="${a('assets/style.css')}?v=${ASSET_V}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230A1727'/%3E%3Ctext x='16' y='21' font-family='Arial' font-size='13' font-weight='600' fill='%23CBA266' text-anchor='middle'%3EFI%3C/text%3E%3C/svg%3E">
${jsonld}
</head>
<body>
${header(u, path, overlay)}
<main id="main">
${main}
</main>
${cta ? `<div class="closing">${supergraphic('sg-close')}<div class="closing-glow" aria-hidden="true"></div>${cta}${footer(u, false)}</div>` : footer(u)}
<script src="${a('assets/site.js')}?v=${ASSET_V}" defer></script>
</body>
</html>
`;
  const file = join(OUT, path + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

/* ---------- pages ---------- */
function home() {
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.name, url: site.domain, email: site.email,
    slogan: site.tagline, address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'NL' },
    founder: [{ '@type': 'Person', name: 'Boris Koelman' }, { '@type': 'Person', name: 'Job Koelman' }],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Diensten', itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name }, priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'EUR', minPrice: Number(s.price.from.replace(/[^0-9]/g, '')) } })) },
  })}</script>`;
  doc({
    path: 'index', overlay: true, jsonld,
    title: 'Flying Images | Websites, vindbaarheid, AI en dronebeelden',
    desc: 'Website, webshop of maatwerk laten maken in Zeewolde. Plus SEO, Google Ads, LLM-vindbaarheid, AI-oplossingen en drone- en FPV-beelden. Je betaalt pas als je tevreden bent.',
    body: (u, a) => `
<section class="hero">
  <div class="hero-media" aria-hidden="true">${picture(a, 'drone-brug', '', { eager: true })}</div>
  <div class="wrap hero-inner">
    <div class="hero-load">
      <span class="eyebrow">Websites · Marketing · AI · Drone</span>
      <h1 style="margin-top:22px">Jouw website. <em>Jouw verhaal.</em></h1>
      <p class="lead">Van website en webshop tot vindbaarheid in Google en ChatGPT, slimme AI-oplossingen en beelden vanuit de lucht. Persoonlijk, betaalbaar en zonder gedoe.</p>
      <div class="hero-ctas">
        <a class="btn btn-sand" href="${u('contact')}">Plan een vrijblijvend gesprek ${I.arrow}</a>
        <a class="btn btn-ghost" href="${u('diensten/index')}">Bekijk onze diensten</a>
      </div>
      <ul class="hero-trust">
        <li>${I.chat} Je praat met de makers</li>
        <li>${I.card} Geen betaling vooraf</li>
        <li>${I.shield} Vaste prijzen, geen verrassingen</li>
      </ul>
    </div>
  </div>
</section>

<section class="usp" aria-label="Flying Images in cijfers">
  <div class="wrap usp-grid">
    <div class="usp-item"><span class="usp-num" data-count="12">12</span><p>diensten onder één dak</p></div>
    <div class="usp-item"><span class="usp-num" data-count="0" data-prefix="€">€0</span><p>vooraf betalen</p></div>
    <div class="usp-item"><span class="usp-num" data-count="2">2</span><p>vaste aanspreekpunten: Job en Boris</p></div>
    <div class="usp-item"><span class="usp-num" data-count="100" data-suffix="%">100%</span><p>tevreden, anders geen factuur</p></div>
  </div>
</section>

<section class="section paper" id="diensten">
  <div class="wrap">
    <div class="section-head split reveal">
      <div style="display:grid;gap:16px"><span class="eyebrow">Diensten</span><h2 class="h2">Alles wat je online nodig hebt, van één team.</h2></div>
      <p class="lead">Kies wat je nu nodig hebt en breid uit wanneer je groeit. Elke dienst heeft een duidelijke vanaf-prijs.</p>
    </div>
    <div class="explorer">
      <div class="tabs" role="tablist" aria-label="Dienstcategorieën">
        ${categories.map((c, i) => `<button class="tab" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><strong>${c.name}<span class="count">0${byCat(c.id).length}</span></strong><span>${c.desc}</span></button>`).join('\n        ')}
      </div>
      <div>
        ${categories.map((c, i) => `<div class="panel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}"${i ? ' hidden' : ''}>${byCat(c.id).map((s) => svcCard(u, s)).join('')}</div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="section navy on-dark">
  <div class="wrap drone">
    <figure class="viewfinder reveal" style="margin:0">
      ${pictureSq(a, 'Luchtfoto recht van boven: een witte ophaalbrug over een donkere vaart, met fietspad en rietoevers')}
      <div class="vf-frame" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="cross"></span></div>
      <div class="vf-data top mono" aria-hidden="true"><span class="rec">REC 00:12:48</span><span>4K</span></div>
      <div class="vf-data bottom mono" aria-hidden="true"><span>ALT 60 M</span><span>NADIR 90°</span></div>
    </figure>
    <div class="reveal">
      <span class="eyebrow">Flying Images, letterlijk</span>
      <h2 class="h2" style="margin-top:16px">Beelden die je nergens anders vandaan haalt.</h2>
      <p class="lead" style="margin-top:20px">Onze naam is geen toeval. Met drone en FPV leggen we je bedrijf vast vanuit een perspectief dat blijft hangen. Voor je website, je socials of je volgende presentatie.</p>
      <div class="drone-list">
        ${['drone-fotografie-video', 'fpv-drone-beelden'].map((slug) => { const s = svc(slug); return `<a href="${u('diensten/' + slug)}"><span><strong>${s.name}</strong><small>${s.short}</small></span><span class="from">vanaf<b>${s.price.from}</b></span></a>`; }).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Werkwijze</span><h2 class="h2">Een helder proces zonder ruis.</h2></div>
    ${stepsBlock('default')}
  </div>
</section>


<section class="section navy on-dark pkgs-dark">
  <div class="wrap">
    <div class="section-head split reveal">
      <div style="display:grid;gap:16px"><span class="eyebrow">Specialismen</span><h2 class="h2">Vier specialismen. Eén team.</h2></div>
      <p class="lead">Kies één specialisme of combineer ze. In een adviesgesprek kijken we samen welke oplossing het beste bij jou past.</p>
    </div>
    ${specialismsBlock(u)}
    <div class="spec-cta reveal">
      <p>Weet je nog niet precies wat je nodig hebt? Daar is het adviesgesprek voor. Gratis en vrijblijvend.</p>
      <a class="btn btn-sand" href="${u('contact')}">Plan een adviesgesprek voor jouw perfecte oplossing ${I.arrow}</a>
    </div>
  </div>
</section>
${guaranteeBlock(true, true)}
${ctaBand(u)}`,
  });
}

const CAT_ICON = { web: 'website-laten-maken', vind: 'zoekmachine-optimalisatie', ai: 'ai-oplossingen', beeld: 'drone-fotografie-video' };
function specialismsBlock(u) {
  return `<div class="specs">${categories.map((c, i) => {
    const list = byCat(c.id);
    const min = Math.min(...list.map((s) => Number(s.price.from.replace(/[^0-9]/g, ''))));
    return `
      <div class="spec reveal">
        <div class="spec-top"><span class="spec-icon">${icon(CAT_ICON[c.id])}</span><span class="spec-n">0${i + 1}</span></div>
        <div><h3>${c.name}</h3><p class="spec-desc">${c.desc}</p></div>
        <ul>${list.map((s) => `<li><a href="${u('diensten/' + s.slug)}">${I.check}<span>${s.name}</span></a></li>`).join('')}</ul>
        <div class="spec-foot"><span class="spec-from">vanaf <strong>${c.from || '€' + min}</strong></span><a class="spec-more" href="${u('diensten/index')}#${c.id}" aria-label="Bekijk ${c.name}">${I.arrow}</a></div>
      </div>`;
  }).join('')}
    </div>`;
}

function packagesBlock(u) {
  return `<div class="pkgs">${packages.map((p) => `
      <div class="pkg reveal${p.featured ? ' featured' : ''}">
        ${p.featured ? '<span class="badge">Meest gekozen</span>' : ''}
        <div><span class="lbl">${p.label}</span><h3>${p.name}</h3></div>
        <div><div class="amount">${p.price}</div><div class="unit">${p.unit}</div></div>
        <ul>${p.items.map((i) => `<li>${I.check}<span>${i}</span></li>`).join('')}</ul>
        <a class="btn ${p.featured ? 'btn-sand' : 'btn-line'}" href="${u('contact')}?dienst=website-laten-maken">${p.price === 'Op maat' ? 'Stel je pakket samen' : 'Kies ' + p.name.toLowerCase()}</a>
      </div>`).join('')}
    </div>`;
}

/* 3D FI-logo dat openklapt tot een laptop (homepage-garantie) */
function fiLogo3d() {
  const TOP = '<g class="f-top"><rect x="0" y="0" width="208" height="66" rx="9"/><rect x="0" y="0" width="70" height="134" rx="9"/><rect x="0" y="114" width="162" height="20" rx="6"/></g><rect class="i-top" x="230" y="0" width="70" height="134" rx="9"/>';
  const BOT = '<g class="f-bot"><rect x="0" y="0" width="162" height="33" rx="7"/><rect x="0" y="0" width="70" height="134" rx="9"/></g><rect class="i-bot" x="230" y="0" width="70" height="134" rx="9"/>';
  const half = (cls, inner) => {
    let h = '';
    for (let i = 10; i >= 1; i--) h += `<svg class="layer" viewBox="0 0 300 134" style="transform:translateZ(-${i}px)">${inner}</svg>`;
    return `<div class="half ${cls}">${h}<svg viewBox="0 0 300 134">${inner}</svg></div>`;
  };
  return `<div class="fi3d reveal" aria-hidden="true"><div class="fi3d-logo">${half('top', TOP)}${half('bot', BOT)}</div></div>`;
}

function guaranteeBlock(light = false, logo3d = false) {
  return `
<section class="section ${light ? 'paper guarantee light' : 'navy on-dark guarantee'}">
  <div class="wrap guarantee-inner">
    <div class="reveal" style="display:grid;gap:20px">
      <span class="eyebrow">Garantie</span>
      <h2>Geen goedkeuring?<br><em>Geen factuur.</em></h2>
      <p class="lead">Je betaalt pas na oplevering, en alleen als jij tevreden bent. Zo simpel is het, voor elke dienst.</p>
    </div>
    ${logo3d ? fiLogo3d() : `<div class="seal reveal" aria-hidden="true">
      <svg class="ring" viewBox="0 0 220 220"><defs><path id="circ" d="M110,110 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0"/></defs><text><textPath href="#circ">GEEN GOEDKEURING · GEEN FACTUUR · GEEN GOEDKEURING · GEEN FACTUUR ·</textPath></text></svg>
      <div><strong>€0</strong><small>vooraf</small></div>
    </div>`}
  </div>
</section>`;
}

function dienstenOverview() {
  doc({
    path: 'diensten/index',
    title: 'Diensten | Flying Images',
    desc: 'Alle diensten van Flying Images: websites, webshops, maatwerk, SEO, Google Ads, LLM-vindbaarheid, AI-oplossingen, data-analyse, rebranding en drone- en FPV-beelden.',
    body: (u, a) => `
${pageHero(u, a, { eyebrow: 'Diensten', title: 'Twaalf diensten. Eén aanspreekpunt.', lead: 'Van je eerste website tot gevonden worden in AI en beelden vanuit de lucht. Je kiest wat past bij waar je nu staat.', crumbs: [[null, 'Diensten']] })}
<section class="section">
  <div class="wrap">
    ${categories.map((c, i) => `
    <div class="cat-block reveal" id="${c.id}">
      <div><span class="cat-n">0${i + 1} / 0${categories.length}</span><h2>${c.name}</h2><p class="cat-desc">${c.desc}</p></div>
      <div class="cards-2">${byCat(c.id).map((s) => svcCard(u, s)).join('')}</div>
    </div>`).join('')}
  </div>
</section>
<section class="section navy on-dark pkgs-dark has-sg">
  ${supergraphic('sg-soft')}
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Websitepakketten</span><h2 class="h2">Liever een vast pakket?</h2></div>
    ${packagesBlock(u)}
  </div>
</section>
${guaranteeBlock(true)}
${ctaBand(u, 'Twijfel je wat je nodig hebt?', 'Vertel ons waar je tegenaan loopt. We geven eerlijk advies, ook als dat betekent dat je minder nodig hebt dan je dacht.')}`,
  });
}

function servicePage(s) {
  const c = cat(s.cat);
  const jsonld = `<script type="application/ld+json">${JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'Service', name: s.name, description: s.intro, areaServed: 'NL', provider: { '@type': 'ProfessionalService', name: site.name, url: site.domain }, offers: { '@type': 'Offer', priceCurrency: 'EUR', priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'EUR', minPrice: Number(s.price.from.replace(/[^0-9]/g, '')) } } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ])}</script>`;
  doc({
    path: 'diensten/' + s.slug, jsonld,
    title: `${s.name} | Flying Images`,
    desc: `${s.intro.split('. ')[0]}. Vanaf ${s.price.from} ${unitText(s.price)}. Geen goedkeuring, geen factuur.`,
    body: (u, a) => `
${pageHero(u, a, {
  eyebrow: c.name, title: s.title, lead: s.intro,
  crumbs: [['diensten/index', 'Diensten'], [null, s.name]],
  meta: `<div class="ph-meta"><span class="chip">vanaf <strong>${s.price.from}</strong> ${unitText(s.price)}</span><a class="btn btn-sand btn-sm" href="${u('contact')}?dienst=${s.slug}">Vraag een voorstel aan ${I.arrow}</a></div>`,
})}
<section class="section">
  <div class="wrap detail">
    <div class="reveal">
      <span class="eyebrow">Wat je krijgt</span>
      <h2 class="h2" style="margin:16px 0 32px">${s.name}, compleet geregeld.</h2>
      <ul class="incl">${s.includes.map((i) => `<li>${I.check}<span>${i}</span></li>`).join('')}</ul>
    </div>
    <aside class="aside-card reveal">
      <span class="eyebrow">Prijs</span>
      <div class="amount"><small style="margin:0 6px 0 0">vanaf</small>${s.price.from}<small>${s.price.unit}</small></div>
      ${s.price.monthly ? `<p class="monthly">+ <strong>${s.price.monthly}</strong> per maand</p>` : ''}
      ${s.price.note ? `<p class="note">${s.price.note}</p>` : ''}
      <p class="who"><b>Voor wie</b>${s.forWho}</p>
      <a class="btn btn-sand" href="${u('contact')}?dienst=${s.slug}">Plan een vrijblijvend gesprek ${I.arrow}</a>
      <p class="fine">Prijzen excl. btw. Je betaalt pas als je tevreden bent.</p>
    </aside>
  </div>
</section>
<section class="section paper">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Zo werkt het</span><h2 class="h2">Van eerste gesprek tot resultaat.</h2></div>
    ${stepsBlock(s.steps)}
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Veelgestelde vragen</span><h2 class="h2">Goed om te weten.</h2></div>
    <div class="reveal">${faqBlock(s.faq)}</div>
  </div>
</section>
<section class="section paper">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Combineer met</span><h2 class="h2">Past goed bij ${s.name.toLowerCase()}.</h2></div>
    <div class="pkgs">${s.related.map((r) => svcCard(u, svc(r), true)).join('')}</div>
  </div>
</section>
${ctaBand(u)}`,
  });
}

function werkwijze() {
  const steps = [
    ['Vrijblijvend gesprek', 'We praten over jouw bedrijf, jouw doelen en wat je nodig hebt. Geen verplichtingen, geen factuur. Gewoon een eerlijk gesprek, met direct advies.', 'Helder advies en een eerste richting'],
    ['Plan & vaste prijs', 'We werken een richting uit: huisstijl, uitstraling, aanpak en een vaste prijs. Zo weten we allebei waar we naartoe werken voordat er iets gebouwd wordt.', 'Een voorstel met vaste prijs'],
    ['Bouwen & uitvoeren', 'Wij gaan aan de slag. Jij houdt de controle en wij houden je op de hoogte. Geen verrassingen, geen stilte.', 'Tussentijdse previews om op te reageren'],
    ['Oplevering & goedkeuring', 'Alleen als jij 100% tevreden bent, betaal je. Niet goed? Dan betaal je niets. Daarna blijven we beschikbaar voor onderhoud, updates en hosting.', 'Live, en pas dan de factuur'],
  ];
  const promises = [
    [I.chat, 'Eén aanspreekpunt', 'Je praat met de mensen die het werk doen. Geen accountmanagers, geen doorverbinden.'],
    [I.card, 'Vaste prijs vooraf', 'Je weet vooraf wat het kost. Meerwerk alleen in overleg.'],
    [I.shield, 'Geen stilte', 'Je weet altijd waar we staan en wat de volgende stap is.'],
    [I.check, 'Pas betalen bij goedkeuring', 'Geen goedkeuring? Geen factuur. Voor elke dienst.'],
  ];
  doc({
    path: 'werkwijze',
    title: 'Werkwijze | Flying Images',
    desc: 'Van vrijblijvend gesprek tot lancering in vier heldere stappen. Je betaalt pas als je tevreden bent.',
    body: (u, a) => `
${pageHero(u, a, { eyebrow: 'Werkwijze', title: 'Van gesprek tot lancering.', lead: 'Vier stappen. Je weet altijd waar we staan en wat er komt.', crumbs: [[null, 'Werkwijze']] })}
<section class="section">
  <div class="wrap route">
    <div class="route-head reveal">
      <span class="eyebrow">Het proces</span>
      <h2 class="h2">Vier stappen, één vaste route.</h2>
      <p class="lead">Of het nu gaat om een website, vindbaarheid, AI of dronebeelden: we werken altijd volgens dezelfde heldere route.</p>
      <a class="btn btn-navy" href="${u('contact')}">Start met stap 1 ${I.arrow}</a>
    </div>
    <ol class="route-steps" data-progress>
      <span class="route-line" aria-hidden="true"><span></span></span>
      ${steps.map(([t, d, r], i) => `
      <li class="route-step reveal">
        <span class="route-dot" aria-hidden="true">0${i + 1}</span>
        <div class="route-card">
          <span class="step-num">STAP 0${i + 1}</span>
          <h3>${t}</h3>
          <p>${d}</p>
          <p class="route-result"><b>Je krijgt</b>${r}</p>
        </div>
      </li>`).join('')}
    </ol>
  </div>
</section>
<section class="section navy on-dark has-sg">
  ${supergraphic('sg-soft')}
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Wat je mag verwachten</span><h2 class="h2">Afspraken waar je op kunt bouwen.</h2></div>
    <div class="promises">${promises.map(([ic, t, d]) => `
      <div class="promise reveal"><span class="spec-icon">${ic}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="section paper">
  <div class="wrap faq-split">
    <div class="reveal faq-side">
      <span class="eyebrow">Veelgestelde vragen</span>
      <h2 class="h2">Over samenwerken.</h2>
      <div class="mini-guarantee"><span>Garantie</span><strong>Geen goedkeuring? <em>Geen factuur.</em></strong></div>
    </div>
    <div class="reveal">${faqBlock([
      ['Wat kost het eerste gesprek?', 'Niets. Het eerste gesprek is altijd gratis en vrijblijvend.'],
      ['Wat als ik niet tevreden ben?', 'Dan betaal je niet. We passen het aan tot het klopt, en als het echt niet past, krijg je geen factuur.'],
      ['Werken jullie alleen in Zeewolde?', 'We zitten in Zeewolde en komen graag langs in de regio, maar we werken voor ondernemers in heel Nederland.'],
      ['Kan ik meerdere diensten combineren?', 'Juist. Veel klanten starten met een website en breiden later uit met vindbaarheid, AI of dronebeelden. Alles via hetzelfde aanspreekpunt.'],
    ])}</div>
  </div>
</section>
${ctaBand(u)}`,
  });
}

function overOns() {
  const diff = [
    [I.chat, 'Je praat met de makers', 'Job en Boris doen het werk zelf, van het eerste gesprek tot de lancering. Korte lijnen, snelle antwoorden.'],
    [I.card, 'Betaalbaar én transparant', 'Je weet vooraf wat je betaalt, en je betaalt pas als je tevreden bent.'],
    [icon('ai-oplossingen'), 'Alles onder één dak', 'Website, vindbaarheid, AI en beeld. Je hoeft niet te schakelen tussen vijf bureaus.'],
    [icon('online-marketing'), 'Jong, fris en eerlijk', 'Een frisse blik en veel energie. Wij weten hoe het voelt om klein te beginnen.'],
    [icon('rebranding'), 'Meer dan een website', 'Elke kleur, elk woord en elk beeld heeft een reden, afgestemd op wie jij bent en wie je wilt aantrekken.'],
    [icon('drone-fotografie-video'), 'Eigen beeld uit de lucht', 'Met drone en FPV maken we beelden die je nergens anders vandaan haalt.'],
  ];
  doc({
    path: 'over-ons',
    title: 'Over ons | Flying Images',
    desc: 'Flying Images wordt gerund door de broers Job en Boris uit Zeewolde. Persoonlijk, direct, betaalbaar en menselijk.',
    body: (u, a) => `
${pageHero(u, a, { eyebrow: 'Over ons', title: 'Wij zijn Job en Boris, en wij bouwen het zelf.', lead: 'Flying Images wordt gerund door twee broers uit Zeewolde. Persoonlijk, direct, betaalbaar en menselijk.', crumbs: [[null, 'Over ons']] })}
<section class="section">
  <div class="wrap team">
    <div class="team-intro reveal">
      <span class="eyebrow">Het team</span>
      <h2 class="h2">Twee broers. Eén team. Jouw verhaal.</h2>
      <p class="lead">We begonnen Flying Images omdat we zagen hoe lastig het voor ondernemers is om online goed voor de dag te komen. Te duur, te technisch, te veel tussenpersonen. Dat kan anders.</p>
    </div>
    <div class="team-cards">
      <article class="person reveal">
        <div class="person-tile" aria-hidden="true"><span>B</span><i></i><i></i><i></i><i></i></div>
        <div><h3>Boris Koelman</h3><p class="role">Ontwerp, bouw &amp; techniek</p><p>Zet jouw verhaal om in een website, merk of AI-oplossing die werkt.</p></div>
      </article>
      <article class="person reveal">
        <div class="person-tile" aria-hidden="true"><span>J</span><i></i><i></i><i></i><i></i></div>
        <div><h3>Job Koelman</h3><p class="role">Techniek, advies &amp; commercieel</p><p>Denkt met je mee over wat je nodig hebt, technisch én zakelijk.</p></div>
      </article>
    </div>
  </div>
</section>
<section class="section navy on-dark has-sg">
  ${supergraphic('sg-soft')}
  <div class="wrap mv">
    <div class="mv-item reveal"><span class="eyebrow">Missie</span><p class="mv-text">Wij helpen drukke ondernemers, starters én gevestigde mkb'ers, aan een online aanwezigheid die écht bij hen past. Met persoonlijk contact, heldere prijzen vooraf en specialisten die met je meedenken.</p></div>
    <div class="mv-item reveal"><span class="eyebrow">Visie</span><p class="mv-text">Een wereld waarin elke ondernemer een website heeft die zijn verhaal vertelt, zijn waarden uitstraalt en de juiste klanten aantrekt. Gebouwd door mensen die jou écht begrijpen.</p></div>
  </div>
</section>
<section class="section paper">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Voor wie</span><h2 class="h2">Voor ondernemers die verder willen.</h2></div>
    <div class="audience">
      <div class="aud-card reveal"><span class="aud-n mono">01</span><h3>Starters &amp; zzp'ers</h3><p>Ondernemers die voor het eerst online gaan en een betrouwbare, betaalbare partner zoeken zonder technisch jargon.</p><ul class="tags"><li>Eerste website</li><li>Huisstijl</li><li>Google Bedrijfsprofiel</li></ul></div>
      <div class="aud-card reveal"><span class="aud-n mono">02</span><h3>Lokale mkb'ers</h3><p>Gevestigde ondernemers die hun online aanwezigheid willen versterken, beter gevonden willen worden of een verouderde website willen vervangen.</p><ul class="tags"><li>Nieuwe website</li><li>SEO &amp; Ads</li><li>AI &amp; data</li><li>Dronebeelden</li></ul></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head split reveal">
      <div style="display:grid;gap:16px"><span class="eyebrow">Uniek</span><h2 class="h2">Wat maakt Flying Images anders?</h2></div>
      <p class="lead">Zes redenen waarom ondernemers voor ons kiezen in plaats van een groot bureau.</p>
    </div>
    <div class="usps">${diff.map(([ic, t, d]) => `
      <div class="usp-card reveal"><span class="icon">${ic}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
${ctaBand(u)}`,
  });
}

function portfolio() {
  const every = [
    [icon('rebranding'), 'Eigen ontwerp', 'Geen template. Kleuren, typografie en beeld afgestemd op jouw merk.'],
    [icon('website-laten-maken'), 'Mobielvriendelijk', 'Snel en goed leesbaar op elk scherm.'],
    [I.card, 'Vaste prijs', 'Je weet vooraf waar je aan toe bent.'],
    [I.shield, 'Pas betalen bij goedkeuring', 'Geen goedkeuring, geen factuur.'],
  ];
  doc({
    path: 'portfolio',
    title: 'Portfolio | Flying Images',
    desc: 'Recent werk van Flying Images. Websites, branding en beelden vanuit de lucht.',
    body: (u, a) => `
${pageHero(u, a, { eyebrow: 'Portfolio', title: 'Recent werk.', lead: 'Elke website is anders, omdat elke ondernemer anders is. Binnenkort delen we hier onze eerste publieke projecten.', crumbs: [[null, 'Portfolio']] })}
<section class="section">
  <div class="wrap pf-intro">
    <div class="reveal" style="display:grid;gap:18px;align-content:center">
      <span class="eyebrow">Binnenkort</span>
      <h2 class="h2">Het eerste publieke project worden?</h2>
      <p class="lead">We zijn hard aan het werk om mooie websites op te leveren. Wil jij hier straks tussen staan? Neem contact op en start samen met ons.</p>
      <div class="hero-ctas" style="margin-top:8px"><a class="btn btn-navy" href="${u('contact')}">Plan een vrijblijvend gesprek ${I.arrow}</a><a class="btn btn-line" href="${u('diensten/index')}">Bekijk onze diensten</a></div>
    </div>
    <div class="pf-slots reveal" aria-hidden="true">
      ${['Websites & webshops', 'Gevonden worden', 'Merk & beeld'].map((t, i) => `
      <div class="pf-slot s${i + 1}">
        <div class="pf-bar"><i></i><i></i><i></i><span>${t}</span></div>
        <div class="pf-body"><b></b><b></b><b></b><em>Jouw project hier</em></div>
      </div>`).join('')}
    </div>
  </div>
</section>
<section class="section deep on-dark">
  <div class="wrap pf-drone">
    <figure class="viewfinder wide reveal" style="margin:0">
      ${picture(a, 'drone-brug', 'Eigen dronebeeld: witte ophaalbrug over een donkere vaart, recht van boven gefotografeerd', { sizes: '(min-width: 1220px) 1160px, 100vw' })}
      <div class="vf-frame" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="cross"></span></div>
      <div class="vf-data top mono" aria-hidden="true"><span class="rec">REC</span><span>4K</span></div>
      <div class="vf-data bottom mono" aria-hidden="true"><span>EIGEN OPNAME</span><span>FLYING IMAGES</span></div>
    </figure>
    <div class="pf-drone-txt reveal">
      <div style="display:grid;gap:14px"><span class="eyebrow">Eigen beeld</span><h2 class="h2">Ook in ons portfolio: de lucht.</h2></div>
      <div style="display:grid;gap:18px"><p class="lead">Elk beeld op deze site hebben we zelf gemaakt. Met drone en FPV leggen we ook jouw bedrijf vast vanuit een perspectief dat blijft hangen.</p>
      <div class="hero-ctas" style="margin:0"><a class="btn btn-sand" href="${u('diensten/drone-fotografie-video')}">Drone foto's &amp; video's ${I.arrow}</a><a class="btn btn-ghost" href="${u('diensten/fpv-drone-beelden')}">FPV drone beelden</a></div></div>
    </div>
  </div>
</section>
<section class="section paper">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Elk project</span><h2 class="h2">Wat je straks hier terugziet.</h2></div>
    <div class="promises light">${every.map(([ic, t, d]) => `
      <div class="promise reveal"><span class="spec-icon">${ic}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
${ctaBand(u)}`,
  });
}

function contact() {
  const next = [
    ['We lezen je bericht', 'Job of Boris leest het zelf, geen ticketsysteem.'],
    ['Kennismaking', 'We plannen een vrijblijvend gesprek, bij jou, bij ons of online.'],
    ['Advies & voorstel', 'Je krijgt eerlijk advies en een voorstel met vaste prijs.'],
  ];
  doc({
    path: 'contact',
    title: 'Contact | Flying Images',
    desc: 'Plan een vrijblijvend gesprek met Flying Images. Het eerste contact is altijd gratis.',
    body: (u, a) => `
${pageHero(u, a, { eyebrow: 'Contact', title: 'Klaar om te beginnen?', lead: 'Plan een vrijblijvend gesprek. Het eerste contact is altijd gratis.', crumbs: [[null, 'Contact']] })}
<section class="section contact-sec">
  <div class="wrap contact-grid">
    <form class="form form-card reveal" id="contact-form" data-key="${site.web3formsKey}" novalidate>
      <div class="form-head"><span class="eyebrow">Stuur een bericht</span><h2 class="h2" style="font-size:clamp(1.6rem,1.2rem+1.4vw,2.2rem)">Waar kunnen we je mee helpen?</h2></div>
      <fieldset class="chips">
        <legend>Kies een specialisme</legend>
        ${categories.map((c, i) => `<label class="chip-opt"><input type="radio" name="specialisme" value="${c.name}"${i === 0 ? '' : ''}><span>${c.name}</span></label>`).join('')}
        <label class="chip-opt"><input type="radio" name="specialisme" value="Weet ik nog niet" checked><span>Weet ik nog niet</span></label>
      </fieldset>
      <div class="form-row">
        <div class="field"><label for="f-naam">Jouw naam</label><input id="f-naam" name="naam" autocomplete="name" required></div>
        <div class="field"><label for="f-email">E-mailadres</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="f-tel">Telefoonnummer (optioneel)</label><input id="f-tel" name="telefoon" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-dienst">Specifieke dienst (optioneel)</label>
          <select id="f-dienst" name="dienst">
            <option value="">Geen voorkeur</option>
            ${categories.map((c) => `<optgroup label="${c.name}">${byCat(c.id).map((s) => `<option value="${s.slug}">${s.name}</option>`).join('')}</optgroup>`).join('')}
          </select>
        </div>
      </div>
      <div class="field"><label for="f-bericht">Je bericht</label><textarea id="f-bericht" name="bericht" placeholder="Vertel kort over je bedrijf en wat je wilt bereiken." required></textarea></div>
      <input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form-foot"><button class="btn btn-sand" type="submit">Verstuur je bericht</button><p class="form-note">Liever zelf mailen? Dat mag ook: ${site.email}</p></div>
      <p class="form-status" id="form-status" role="status" hidden></p>
    </form>
    <aside class="contact-aside reveal">
      <span class="eyebrow">Direct contact</span>
      <dl>
        <div><dt>Namen</dt><dd>Job &amp; Boris Koelman</dd></div>
        <div><dt>E-mail</dt><dd>${site.email}</dd></div>
        <div><dt>Locatie</dt><dd>${site.city}, Nederland</dd></div>
        <div><dt>KvK</dt><dd>${site.kvk}</dd></div>
      </dl>
      <div class="next">
        <span class="eyebrow">Na je bericht</span>
        <ol>${next.map(([t, d], i) => `<li><span class="mono">0${i + 1}</span><div><b>${t}</b><p>${d}</p></div></li>`).join('')}</ol>
      </div>
    </aside>
  </div>
</section>
<section class="section paper">
  <div class="wrap faq-split">
    <div class="reveal faq-side">
      <span class="eyebrow">Goed om te weten</span>
      <h2 class="h2">Voordat je contact opneemt.</h2>
      <div class="mini-guarantee"><span>Garantie</span><strong>Geen goedkeuring? <em>Geen factuur.</em></strong></div>
    </div>
    <div class="reveal">${faqBlock([
      ['Wat kost het eerste gesprek?', 'Niets. Het eerste gesprek is altijd gratis en vrijblijvend.'],
      ['Moet ik al weten wat ik nodig heb?', 'Nee. Vertel ons wat je wilt bereiken, dan adviseren we welke oplossing het beste past.'],
      ['Werken jullie ook buiten Zeewolde?', 'Ja. We komen graag langs in de regio en werken voor ondernemers in heel Nederland.'],
    ])}</div>
  </div>
</section>`,
  });
}

/* ---------- run ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'src/assets'), join(OUT, 'assets'), { recursive: true });
cpSync(join(ROOT, 'src/img'), join(OUT, 'img'), { recursive: true });
cpSync(join(ROOT, 'src/system'), join(OUT, 'system'), { recursive: true }); // intern dashboard /system
home();
dienstenOverview();
services.forEach(servicePage);
werkwijze();
overOns();
portfolio();
contact();

if (MODE === 'vercel') {
  const pages = ['/', '/diensten', ...services.map((s) => '/diensten/' + s.slug), '/werkwijze', '/portfolio', '/over-ons', '/contact'];
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${site.domain}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /system\n\nSitemap: ${site.domain}/sitemap.xml\n`);
}
console.log(`Gebouwd (${MODE}) → ${OUT}`);

// Preview: aparte instappagina voor de Claude-artifact (zonder eigen doctype/head/body)
if (MODE === 'preview') {
  let s = readFileSync(join(OUT, 'index.html'), 'utf8');
  s = s.replace(/<!doctype html>\s*<html[^>]*>\s*<head>/, '')
    .replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>/, '')
    .replace('</head>', '').replace('<body>', '').replace('</body>', '').replace('</html>', '')
    .replace(/<title>[^<]*<\/title>/, '<title>Flying Images Website</title>');
  writeFileSync(join(OUT, '_artifact.html'), s);
}

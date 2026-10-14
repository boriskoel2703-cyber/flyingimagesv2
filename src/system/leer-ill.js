/* Illustraties voor de Leeromgeving — inline SVG in het FI-palet.
   Kleuren: ink #0A1727, navy-800 #1A3352, navy-700 #2A3A55, sand #CBA266,
   sand-300 #E3CA9E, mist #A8B6C8, paper #F6F3EE. */

const S = "#CBA266", S3 = "#E3CA9E", M = "#A8B6C8", P = "#F6F3EE", N8 = "#1A3352", N7 = "#2A3A55", INK = "#0A1727";

// browserframe met inhoud
const browser = (x, y, w, h, inner = "") => `
  <g transform="translate(${x} ${y})">
    <rect width="${w}" height="${h}" rx="10" fill="${N8}" stroke="${N7}"/>
    <rect width="${w}" height="22" rx="10" fill="${N7}"/><rect y="12" width="${w}" height="10" fill="${N7}"/>
    <circle cx="14" cy="11" r="3.5" fill="${S}"/><circle cx="26" cy="11" r="3.5" fill="${M}" opacity=".6"/><circle cx="38" cy="11" r="3.5" fill="${M}" opacity=".3"/>
    <rect x="56" y="6" width="${w - 76}" height="10" rx="5" fill="${INK}" opacity=".5"/>
    ${inner}
  </g>`;

const ILL = {
  maatwerk: () => `
    ${browser(30, 30, 230, 170, `
      <rect x="16" y="36" width="120" height="12" rx="4" fill="${P}" opacity=".9"/>
      <rect x="16" y="54" width="90" height="7" rx="3.5" fill="${M}" opacity=".5"/>
      <rect x="16" y="78" width="96" height="74" rx="8" fill="${INK}" opacity=".55"/>
      <rect x="26" y="90" width="50" height="6" rx="3" fill="${M}" opacity=".6"/>
      <rect x="26" y="104" width="76" height="12" rx="4" fill="${N7}"/>
      <rect x="26" y="124" width="76" height="16" rx="5" fill="${S}"/>
      <rect x="122" y="78" width="92" height="34" rx="8" fill="${N7}"/>
      <rect x="122" y="118" width="92" height="34" rx="8" fill="${N7}"/>
      <circle cx="140" cy="95" r="7" fill="${S3}"/><rect x="154" y="91" width="48" height="7" rx="3.5" fill="${M}" opacity=".6"/>
      <circle cx="140" cy="135" r="7" fill="${M}"/><rect x="154" y="131" width="38" height="7" rx="3.5" fill="${M}" opacity=".6"/>`)}
    <g transform="translate(300 70)">
      <rect x="-34" y="-30" width="68" height="60" rx="12" fill="${S}"/>
      <circle r="16" fill="none" stroke="${INK}" stroke-width="6"/>
      <g stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M0-27v6M0 21v6M-27 0h6M21 0h6"/></g>
    </g>
    <g transform="translate(272 132)"><rect width="98" height="40" rx="10" fill="${N8}" stroke="${N7}"/>
      <path d="M18 20h20M58 20h22" stroke="${M}" stroke-width="3" stroke-linecap="round"/><path d="M42 14l8 6-8 6" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
    <path d="M260 110 C 280 110 280 150 272 152" fill="none" stroke="${S}" stroke-dasharray="3 5" stroke-width="2"/>`,

  webshop: () => `
    ${browser(30, 26, 260, 186, `
      ${[0, 1, 2].map((c) => [0, 1].map((r) => `
        <g transform="translate(${16 + c * 80} ${36 + r * 72})">
          <rect width="70" height="62" rx="8" fill="${INK}" opacity=".5"/>
          <rect x="8" y="8" width="54" height="28" rx="5" fill="${(c + r) % 2 ? N7 : S3}" opacity="${(c + r) % 2 ? 1 : .85}"/>
          <rect x="8" y="42" width="34" height="5" rx="2.5" fill="${M}" opacity=".6"/>
          <rect x="8" y="51" width="20" height="5" rx="2.5" fill="${S}"/>
        </g>`).join("")).join("")}`)}
    <g transform="translate(312 120)">
      <circle r="44" fill="${S}"/>
      <path d="M-22-14h7l7 26h24l6-18h-33" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="-4" cy="20" r="4" fill="${INK}"/><circle cx="14" cy="20" r="4" fill="${INK}"/>
    </g>
    <g transform="translate(300 32)"><rect width="64" height="30" rx="15" fill="${N8}" stroke="${N7}"/><text x="32" y="20" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="${S3}">iDEAL</text></g>`,

  onepage: () => `
    <g transform="translate(130 14)">
      <rect width="140" height="212" rx="12" fill="${N8}" stroke="${N7}"/>
      <rect x="10" y="10" width="120" height="52" rx="8" fill="${N7}"/>
      <rect x="20" y="24" width="70" height="9" rx="4" fill="${P}" opacity=".9"/><rect x="20" y="40" width="34" height="11" rx="5" fill="${S}"/>
      <g transform="translate(10 70)">${[0, 1, 2].map((i) => `<rect x="${i * 41}" width="38" height="34" rx="6" fill="${INK}" opacity=".5"/><circle cx="${i * 41 + 19}" cy="14" r="6" fill="${i === 1 ? S : M}" opacity="${i === 1 ? 1 : .6}"/>`).join("")}</g>
      <rect x="10" y="112" width="120" height="40" rx="8" fill="${INK}" opacity=".45"/>
      <rect x="20" y="122" width="80" height="6" rx="3" fill="${M}" opacity=".6"/><rect x="20" y="134" width="60" height="6" rx="3" fill="${M}" opacity=".4"/>
      <rect x="10" y="160" width="120" height="42" rx="8" fill="${S}" opacity=".18" stroke="${S}"/>
      <rect x="20" y="170" width="54" height="7" rx="3.5" fill="${S3}"/><rect x="20" y="183" width="80" height="9" rx="4.5" fill="${P}" opacity=".7"/>
    </g>
    <g fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M300 60v120"/><path d="M290 168l10 12 10-12"/>
    </g>
    ${["Hero", "Diensten", "Over", "Contact"].map((t, i) => `<g transform="translate(40 ${36 + i * 50})"><rect width="72" height="24" rx="12" fill="${N8}" stroke="${N7}"/><text x="36" y="16" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10" fill="${M}">${t}</text><path d="M76 12h12" stroke="${N7}" stroke-width="2"/></g>`).join("")}`,

  marketing: () => `
    <g transform="translate(200 120)">
      <circle r="44" fill="${S}"/><circle r="18" fill="${INK}"/><circle r="7" fill="${S3}"/>
      ${[[-140, -70, "Social"], [130, -74, "E-mail"], [-146, 60, "Ads"], [126, 66, "Content"]].map(([x, y, t]) => `
        <path d="M0 0 L${x * .6} ${y * .6}" stroke="${N7}" stroke-width="2" stroke-dasharray="4 5"/>
        <g transform="translate(${x} ${y})"><rect x="-44" y="-22" width="88" height="44" rx="12" fill="${N8}" stroke="${N7}"/>
        <circle cx="-24" cy="0" r="8" fill="${M}" opacity=".7"/><text x="-10" y="4" font-family="Outfit,sans-serif" font-size="12" fill="${P}">${t}</text></g>`).join("")}
    </g>
    <g transform="translate(176 196)"><rect width="48" height="20" rx="10" fill="${N8}" stroke="${S}"/><path d="M12 12l6-4 6 3 10-6" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round"/></g>`,

  seo: () => `
    <g transform="translate(40 34)">
      <rect width="320" height="42" rx="21" fill="${N8}" stroke="${N7}"/>
      <circle cx="26" cy="21" r="8" fill="none" stroke="${S}" stroke-width="3"/><path d="M32 27l6 6" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
      <text x="50" y="26" font-family="Outfit,sans-serif" font-size="14" fill="${P}">schilder zeewolde</text>
      <rect x="182" y="13" width="2" height="16" fill="${S3}"/>
    </g>
    <g transform="translate(40 96)">
      ${[["1", 1, S], ["2", .6, M], ["3", .4, M]].map(([n, o, c], i) => `
        <g transform="translate(0 ${i * 40})"><rect width="210" height="32" rx="8" fill="${i === 0 ? N7 : N8}" ${i === 0 ? `stroke="${S}"` : ""}/>
        <text x="14" y="21" font-family="IBM Plex Mono,monospace" font-size="12" fill="${c}">${n}</text>
        <rect x="34" y="9" width="${i === 0 ? 110 : 90}" height="6" rx="3" fill="${c}" opacity="${o}"/><rect x="34" y="19" width="${i === 0 ? 150 : 130}" height="4" rx="2" fill="${M}" opacity=".35"/></g>`).join("")}
    </g>
    <g transform="translate(274 96)">
      ${[30, 52, 74, 104].map((h, i) => `<rect x="${i * 22}" y="${112 - h}" width="16" height="${h}" rx="4" fill="${i === 3 ? S : N7}"/>`).join("")}
      <path d="M4 70 L28 56 L50 40 L72 12" fill="none" stroke="${S3}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,

  ads: () => `
    <g transform="translate(40 30)">
      <rect width="250" height="96" rx="12" fill="${N8}" stroke="${S}"/>
      <rect x="14" y="14" width="30" height="16" rx="4" fill="${S}"/><text x="29" y="26" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10" font-weight="600" fill="${INK}">Ad</text>
      <rect x="52" y="18" width="110" height="8" rx="4" fill="${M}" opacity=".5"/>
      <rect x="14" y="42" width="190" height="11" rx="5" fill="${P}" opacity=".9"/>
      <rect x="14" y="62" width="220" height="6" rx="3" fill="${M}" opacity=".45"/><rect x="14" y="74" width="170" height="6" rx="3" fill="${M}" opacity=".3"/>
    </g>
    <g transform="translate(40 138)">
      <rect width="250" height="60" rx="12" fill="${N8}" stroke="${N7}"/>
      <rect x="14" y="16" width="160" height="8" rx="4" fill="${M}" opacity=".45"/><rect x="14" y="32" width="120" height="6" rx="3" fill="${M}" opacity=".3"/>
    </g>
    <g transform="translate(222 92)"><path d="M0 0l0 30 8-8 6 14 7-3-6-14 11 0z" fill="${P}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></g>
    <g transform="translate(304 50)" font-family="IBM Plex Mono,monospace">
      ${[["Klik", "€1,20", M], ["Aanvraag", "€24", S]].map(([l, v, c], i) => `<g transform="translate(0 ${i * 64})"><rect width="76" height="52" rx="10" fill="${N8}" stroke="${N7}"/><text x="10" y="20" font-size="10" fill="${M}">${l}</text><text x="10" y="40" font-size="16" fill="${c}">${v}</text></g>`).join("")}
    </g>`,

  llm: () => `
    <g transform="translate(36 28)">
      <rect width="200" height="44" rx="14" fill="${N7}"/><rect x="14" y="14" width="150" height="7" rx="3.5" fill="${P}" opacity=".85"/><rect x="14" y="26" width="96" height="6" rx="3" fill="${M}" opacity=".5"/>
    </g>
    <g transform="translate(92 86)">
      <rect width="250" height="104" rx="14" fill="${N8}" stroke="${N7}"/>
      <circle cx="22" cy="22" r="10" fill="${S}"/><path d="M17 22h10M22 17v10" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="42" y="16" width="160" height="7" rx="3.5" fill="${P}" opacity=".85"/><rect x="42" y="29" width="180" height="6" rx="3" fill="${M}" opacity=".45"/><rect x="42" y="41" width="130" height="6" rx="3" fill="${M}" opacity=".45"/>
      <g transform="translate(42 58)"><rect width="150" height="32" rx="8" fill="${INK}" opacity=".6" stroke="${S}"/>
        <rect x="8" y="8" width="16" height="16" rx="4" fill="${S}"/><rect x="32" y="10" width="80" height="6" rx="3" fill="${S3}"/><rect x="32" y="20" width="56" height="4" rx="2" fill="${M}" opacity=".5"/></g>
    </g>
    <g font-family="IBM Plex Mono,monospace" font-size="10" fill="${M}">
      <g transform="translate(36 206)"><rect width="78" height="22" rx="11" fill="none" stroke="${N7}"/><text x="39" y="15" text-anchor="middle">ChatGPT</text></g>
      <g transform="translate(122 206)"><rect width="70" height="22" rx="11" fill="none" stroke="${N7}"/><text x="35" y="15" text-anchor="middle">Gemini</text></g>
      <g transform="translate(200 206)"><rect width="88" height="22" rx="11" fill="none" stroke="${S}"/><text x="44" y="15" text-anchor="middle" fill="${S3}">Perplexity</text></g>
    </g>`,

  ai: () => {
    const nodes = [[60, 60, "Mail"], [60, 180, "Formulier"], [200, 120, ""], [340, 60, "Offerte"], [340, 180, "CRM"]];
    return `
    <g stroke="${N7}" stroke-width="2.5" fill="none">
      <path d="M100 60 C 150 60 150 120 170 120"/><path d="M100 180 C 150 180 150 120 170 120"/>
      <path d="M230 120 C 260 120 260 60 300 60"/><path d="M230 120 C 260 120 260 180 300 180"/>
    </g>
    <g stroke="${S}" stroke-width="2.5" fill="none" stroke-dasharray="2 8" stroke-linecap="round"><path d="M100 60 C 150 60 150 120 170 120"/><path d="M230 120 C 260 120 260 60 300 60"/></g>
    ${nodes.map(([x, y, t], i) => i === 2 ? `
      <g transform="translate(${x} ${y})"><rect x="-32" y="-32" width="64" height="64" rx="16" fill="${S}"/>
      <path d="M-10-14v28M10-14v28M-14-10h28M-14 10h28" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".85"/><rect x="-10" y="-10" width="20" height="20" rx="4" fill="${INK}"/><circle r="4" fill="${S3}"/></g>`
      : `<g transform="translate(${x} ${y})"><rect x="-42" y="-20" width="84" height="40" rx="12" fill="${N8}" stroke="${N7}"/><text y="5" text-anchor="middle" font-family="Outfit,sans-serif" font-size="12.5" fill="${P}">${t}</text></g>`).join("")}`;
  },

  data: () => `
    <g transform="translate(30 24)">
      <rect width="340" height="192" rx="14" fill="${N8}" stroke="${N7}"/>
      ${[["Bezoekers", "2.418", M], ["Aanvragen", "64", S], ["Conversie", "2,6%", S3]].map(([l, v, c], i) => `
        <g transform="translate(${14 + i * 108} 14)"><rect width="98" height="52" rx="10" fill="${INK}" opacity=".55"/>
        <text x="10" y="20" font-family="IBM Plex Mono,monospace" font-size="9.5" fill="${M}">${l}</text>
        <text x="10" y="40" font-family="Outfit,sans-serif" font-size="18" fill="${c}">${v}</text></g>`).join("")}
      <g transform="translate(14 80)">
        <rect width="200" height="98" rx="10" fill="${INK}" opacity=".55"/>
        ${[36, 50, 42, 62, 58, 74, 80].map((h, i) => `<rect x="${14 + i * 26}" y="${86 - h}" width="16" height="${h}" rx="3" fill="${i === 6 ? S : N7}"/>`).join("")}
      </g>
      <g transform="translate(224 80)">
        <rect width="102" height="98" rx="10" fill="${INK}" opacity=".55"/>
        <circle cx="51" cy="49" r="30" fill="none" stroke="${N7}" stroke-width="12"/>
        <circle cx="51" cy="49" r="30" fill="none" stroke="${S}" stroke-width="12" stroke-dasharray="120 189" transform="rotate(-90 51 49)"/>
        <circle cx="51" cy="49" r="30" fill="none" stroke="${M}" stroke-width="12" stroke-dasharray="40 189" stroke-dashoffset="-120" transform="rotate(-90 51 49)"/>
      </g>
    </g>`,

  brand: () => `
    <g transform="translate(40 34)">
      <rect width="120" height="120" rx="14" fill="${P}"/>
      <path d="M22 26 h52 q4 0 4 4 v10 q0 4 -4 4 h-30 v12 h22 q4 0 4 4 v4 h-48 z" fill="${INK}"/>
      <path d="M22 68 h48 v6 q0 4 -4 4 h-22 v20 q0 4 -4 4 h-14 q-4 0 -4 -4 z" fill="${INK}"/>
      <rect x="86" y="26" width="14" height="38" rx="3" fill="${S}"/><rect x="86" y="68" width="14" height="34" rx="3" fill="${S}"/>
    </g>
    <g transform="translate(178 34)">
      ${[[INK, "#0A1727"], [N8, "#1A3352"], [S, "#CBA266"], [M, "#A8B6C8"]].map(([c, h], i) => `
        <g transform="translate(${(i % 2) * 92} ${Math.floor(i / 2) * 62})"><rect width="84" height="54" rx="10" fill="${c}" stroke="${N7}"/>
        <text x="8" y="46" font-family="IBM Plex Mono,monospace" font-size="9" fill="${i >= 2 ? INK : M}">${h}</text></g>`).join("")}
    </g>
    <g transform="translate(40 170)">
      <rect width="318" height="48" rx="12" fill="${N8}" stroke="${N7}"/>
      <text x="18" y="33" font-family="Outfit,sans-serif" font-size="24" font-weight="500" fill="${P}">Aa</text>
      <rect x="66" y="16" width="120" height="7" rx="3.5" fill="${M}" opacity=".6"/><rect x="66" y="28" width="90" height="5" rx="2.5" fill="${M}" opacity=".35"/>
      <rect x="226" y="14" width="78" height="20" rx="10" fill="${S}"/><text x="265" y="28" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="9.5" fill="${INK}">BRANDBOOK</text>
    </g>`,

  drone: () => `
    <g transform="translate(0 150)">
      <rect x="40" y="10" width="90" height="60" rx="6" fill="${N8}" stroke="${N7}"/>
      <rect x="140" y="30" width="60" height="40" rx="6" fill="${N7}"/>
      <rect x="210" y="0" width="120" height="70" rx="6" fill="${N8}" stroke="${S}"/>
      <rect x="224" y="14" width="40" height="18" rx="3" fill="${S}" opacity=".35"/><rect x="274" y="14" width="40" height="18" rx="3" fill="${S}" opacity=".35"/>
      <rect x="20" y="70" width="360" height="6" rx="3" fill="${N7}"/>
    </g>
    <g fill="none" stroke="${S}" stroke-width="1.5" stroke-dasharray="3 5" opacity=".8"><path d="M200 82 L130 160"/><path d="M200 82 L320 150"/></g>
    <path d="M200 82 L130 160 L320 150 Z" fill="${S}" opacity=".06"/>
    <g transform="translate(200 62)">
      <path d="M-34-14 L34 14 M34-14 L-34 14" stroke="${M}" stroke-width="4" stroke-linecap="round"/>
      ${[[-34, -14], [34, -14], [-34, 14], [34, 14]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="4" fill="${M}" opacity=".45"/><circle cx="${x}" cy="${y}" r="3" fill="${P}"/>`).join("")}
      <rect x="-16" y="-10" width="32" height="20" rx="7" fill="${S}"/><circle cy="14" r="5" fill="${INK}" stroke="${S3}" stroke-width="2"/>
    </g>
    <g transform="translate(300 24)" font-family="IBM Plex Mono,monospace" font-size="10"><rect width="72" height="22" rx="11" fill="${N8}" stroke="${N7}"/><text x="36" y="15" text-anchor="middle" fill="${S3}">4K · 60m</text></g>`,

  fpv: () => `
    ${[0, 1, 2].map((i) => {
      const s = 1 - i * .22, x = 200 - 90 * s, y = 120 - 92 * s;
      return `<rect x="${x}" y="${y}" width="${180 * s}" height="${184 * s}" rx="${12 * s}" fill="none" stroke="${i === 0 ? N7 : i === 1 ? N8 : S}" stroke-width="${6 - i * 1.5}"/>`;
    }).join("")}
    <path d="M30 210 C 120 200, 120 120, 200 124 S 300 60, 372 40" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
    <path d="M30 210 C 120 200, 120 120, 200 124 S 300 60, 372 40" fill="none" stroke="${S3}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 14" opacity=".9"/>
    <g transform="translate(118 168) rotate(-28)">
      <rect x="-14" y="-8" width="28" height="16" rx="5" fill="${S}"/>
      ${[[-16, -10], [16, -10], [-16, 10], [16, 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${M}" stroke-width="2"/>`).join("")}
    </g>
    <g transform="translate(300 182)" font-family="IBM Plex Mono,monospace" font-size="10"><rect width="76" height="22" rx="11" fill="${N8}" stroke="${N7}"/><text x="38" y="15" text-anchor="middle" fill="${M}">9:16 · 45s</text></g>`,
};

export function illustration(name, label = "") {
  const body = (ILL[name] || ILL.maatwerk)();
  return `<svg class="lr-ill" viewBox="0 0 400 240" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

/* Beeldmerk-achtig blokpatroon voor de hero van de Leeromgeving */
export function heroPattern() {
  const cells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) {
    const k = (r * 7 + c * 3) % 9;
    const fill = k === 0 ? S : k === 4 ? S3 : k === 2 || k === 6 ? N7 : N8;
    const op = k === 0 || k === 4 ? 1 : .7;
    cells.push(`<rect x="${c * 56}" y="${r * 56}" width="${k === 5 ? 104 : 48}" height="48" rx="8" fill="${fill}" opacity="${op}"/>`);
  }
  return `<svg class="lr-hero__pat" viewBox="0 0 560 224" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${cells.join("")}</svg>`;
}

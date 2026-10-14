import * as C from "./intake-core.js";
import { LEER, LEER_CATS, LEER_FIELDS } from "./leer-data.js";
import { illustration, heroPattern } from "./leer-ill.js";

/* ================= basis ================= */
const API = "/api/system";
const TOKEN_KEY = "fi-system-token";
const $ = (s, r = document) => r.querySelector(s);
const content = $("#content");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const clone = (v) => JSON.parse(JSON.stringify(v));

let token = null;
try { token = localStorage.getItem(TOKEN_KEY); } catch {}
const setToken = (t) => { token = t; try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} };

async function api(action, data = {}) {
  const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, token, ...data }) });
  let out = {};
  try { out = await res.json(); } catch {}
  if (res.status === 401 && action !== "login") { lock(); throw new Error(out.error || "Sessie verlopen."); }
  if (!res.ok) throw new Error(out.error || `Fout (${res.status})`);
  return out;
}

const DIENSTEN = [
  { cat: "Websites & webshops", items: [["custom-website", "Custom website"], ["webshop", "Webshop"], ["website", "Onepage website"]] },
  { cat: "Vindbaarheid", items: [["online-marketing", "Online marketing"], ["seo", "SEO"], ["google-ads", "Google Ads"], ["llm", "LLM-vindbaarheid"]] },
  { cat: "Ai & data", items: [["ai", "Ai-oplossingen"], ["data", "Data-analyse & rapportage"]] },
  { cat: "Branding & beeld", items: [["rebranding", "Rebranding"], ["drone", "Drone foto & video"], ["fpv", "FPV-dronebeelden"]] },
];
const ACTIVE = new Set(["custom-website"]);
const dienstLabel = (row) => (row.workflow_type === "scrape" ? "Klant mét website (oud)" : "Custom website");
const LISTS = [["standaard", "Standaard"], ["artiest", "Artiest"], ["product", "Product / B2B"]];

/* ================= UI helpers ================= */
function ask(text, yes = "Doorgaan") {
  return new Promise((resolve) => {
    $("#modalText").textContent = text;
    $("#modalYes").textContent = yes;
    $("#modal").hidden = false;
    const done = (v) => { $("#modal").hidden = true; $("#modalYes").onclick = $("#modalNo").onclick = null; resolve(v); };
    $("#modalYes").onclick = () => done(true);
    $("#modalNo").onclick = () => done(false);
  });
}
function savedLabel(text, err) {
  const el = $("#saved");
  el.textContent = text || "";
  el.classList.toggle("err", !!err);
}
const head = (eb, t, lead) => `<div class="eyebrow">${eb}</div><h1>${esc(t)}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}`;
const fmtDate = (s) => { try { return new Date(s).toLocaleString("nl-NL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };
const ICON = {
  up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
  del: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/></svg>',
};

/* ================= config (BE) ================= */
let CFG = {};
async function loadConfig() {
  try { CFG = (await api("getConfig")).config || {}; } catch { CFG = {}; }
  C.applyConfig(CFG);
}
const stepExplain = (i) => CFG.steps?.[i]?.explain?.trim() || "";

/* ================= gate / shell ================= */
function lock() {
  flushFlow();
  setToken(null);
  FLOW = null;
  $("#gate").hidden = false;
  setTimeout(() => $("#gatePass").focus(), 50);
}
$("#gateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#gateErr").textContent = "";
  try {
    const { token: t } = await api("login", { passphrase: $("#gatePass").value });
    setToken(t);
    $("#gatePass").value = "";
    $("#gate").hidden = true;
    await loadConfig();
    render();
  } catch (err) { $("#gateErr").textContent = err.message; }
});
$("#lockBtn").onclick = lock;
const mq = matchMedia("(max-width:900px)");
$("#burger").onclick = () => document.body.classList.toggle(mq.matches ? "open" : "collapsed");
$("#overlay").onclick = () => document.body.classList.remove("open");

/* ================= Leeromgeving ================= */
let LR = { slug: null, edit: false, dirty: false };
const LR_CHECK = {}; // afvinken tijdens een gesprek, alleen in deze sessie

function leerItem(slug) {
  const base = LEER.find((x) => x.slug === slug);
  if (!base) return null;
  return { ...base, ...(CFG.leer?.[slug] || {}) };
}
const lrCat = (id) => LEER_CATS.find((c) => c.id === id) || LEER_CATS[0];
const lrParas = (t) => String(t || "").split(/\n{2,}/).map((p) => `<p>${esc(p.trim())}</p>`).join("");

function leerOverzicht() {
  const groups = LEER_CATS.map((cat) => {
    const items = LEER.filter((x) => x.cat === cat.id).map((x) => leerItem(x.slug));
    return `<section class="lr-group" data-lr-group>
      <div class="lr-group__h"><span class="lr-ic lr-ic--${cat.id}">${cat.letter}</span><h2>${esc(cat.name)}</h2><span class="lr-mono">${items.length} ${items.length === 1 ? "dienst" : "diensten"}</span></div>
      <div class="lr-cards">${items.map((x) => `
        <a class="lr-card" href="#leer/${x.slug}" data-lr-search="${esc((x.name + " " + x.kort + " " + cat.name).toLowerCase())}">
          <div class="lr-card__ill">${illustration(x.ill, x.name)}</div>
          <div class="lr-card__b"><h3>${esc(x.name)}</h3><p>${esc(x.kort)}</p>
          <span class="lr-mono">${x.aanpak.length} stappen · ${x.belangrijk.length} checkpunten</span></div>
        </a>`).join("")}</div>
    </section>`;
  }).join("");
  return `<div class="lr">
    <header class="lr-hero">
      ${heroPattern()}
      <div class="lr-hero__t">
        <div class="lr-eyebrow">Leeromgeving · intern</div>
        <h1>Hoe pakken we het aan?</h1>
        <p>Per dienst: wat het is, wanneer een klant het nodig heeft, wat je moet checken en hoe we het aanpakken. Open hem vóór elk eerste gesprek.</p>
        <label class="lr-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
          <input id="lrSearch" type="search" placeholder="Zoek een dienst, bijv. webshop of drone" autocomplete="off"></label>
      </div>
    </header>
    ${groups}
    <p class="lr-none" id="lrNone" hidden>Geen dienst gevonden.</p>
  </div>`;
}

function leerDetail(slug) {
  const x = leerItem(slug);
  if (!x) return `<div class="lr"><a class="lr-back" href="#leer">← Leeromgeving</a><div class="lr-panel">Deze dienst bestaat niet.</div></div>`;
  LR.slug = slug;
  const cat = lrCat(x.cat);
  $("#crumb").innerHTML = `System / Leeromgeving / <b>${esc(x.name)}</b>`;
  const edited = !!CFG.leer?.[slug];
  const head = `
    <a class="lr-back" href="#leer">← Leeromgeving</a>
    <header class="lr-dhead">
      <div class="lr-dhead__t">
        <div class="lr-eyebrow"><span class="lr-ic lr-ic--${cat.id} sm">${cat.letter}</span>${esc(cat.name)}</div>
        <h1>${esc(x.name)}</h1>
        <p class="lr-lead">${esc(x.kort)}</p>
        <div class="lr-acts">
          ${LR.edit
            ? `<button class="lr-btn" data-lr="save">Opslaan</button><button class="lr-btn ghost" data-lr="cancel">Annuleren</button>${edited ? `<button class="lr-btn ghost" data-lr="reset">Standaardtekst terugzetten</button>` : ""}`
            : `<button class="lr-btn ghost" data-lr="edit">Bewerken</button><button class="lr-btn ghost" data-lr="copy">Gespreksvragen kopiëren</button>`}
          ${edited && !LR.edit ? `<span class="lr-mono">Aangepast in System</span>` : ""}
        </div>
      </div>
      <div class="lr-dhead__ill">${illustration(x.ill, x.name)}</div>
    </header>`;
  if (LR.edit) return `<div class="lr">${head}${leerEditor(x)}</div>`;

  const nav = [["wat", "Wat is het"], ["signalen", "Signalen"], ["belangrijk", "Checklist"], ["vragen", "Gespreksvragen"], ["aanpak", "Aanpak"], ["valkuilen", "Valkuilen"]];
  const checks = LR_CHECK[slug] || (LR_CHECK[slug] = new Set());
  return `<div class="lr">${head}
    <nav class="lr-toc">${nav.map(([id, t], i) => `<a href="#leer/${slug}" data-lr-jump="lr-${id}"><span>${String(i + 1).padStart(2, "0")}</span>${t}</a>`).join("")}</nav>
    <div class="lr-doc">
      <div class="lr-main">
        <section class="lr-sec" id="lr-wat"><div class="lr-sec__h"><span>01</span><h2>Wat is het</h2></div><div class="lr-prose">${lrParas(x.wat)}</div></section>

        <section class="lr-sec" id="lr-signalen"><div class="lr-sec__h"><span>02</span><h2>Wanneer heeft een klant dit nodig</h2></div>
          <div class="lr-signals">${x.signalen.map((s) => `<div class="lr-signal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="4"/></svg><p>${esc(s)}</p></div>`).join("")}</div></section>

        <section class="lr-sec" id="lr-belangrijk"><div class="lr-sec__h"><span>03</span><h2>Wat is belangrijk</h2><span class="lr-mono lr-sec__r" id="lrCheckCount">${checks.size}/${x.belangrijk.length} gecheckt</span></div>
          <p class="lr-note">Vink af tijdens of na het gesprek. Dit wordt niet opgeslagen.</p>
          <ul class="lr-checks">${x.belangrijk.map((s, i) => `<li><label><input type="checkbox" data-lr-check="${i}" ${checks.has(i) ? "checked" : ""}><span class="lr-box"></span><span>${esc(s)}</span></label></li>`).join("")}</ul></section>

        <section class="lr-sec" id="lr-vragen"><div class="lr-sec__h"><span>04</span><h2>Vragen voor het eerste gesprek</h2></div>
          <ol class="lr-qs">${x.vragen.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></section>

        <section class="lr-sec" id="lr-aanpak"><div class="lr-sec__h"><span>05</span><h2>Aanpak</h2><span class="lr-mono lr-sec__r">${x.aanpak.length} stappen</span></div>
          <ol class="lr-route">${x.aanpak.map(([t, d], i) => `<li><span class="lr-stop">${i + 1}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join("")}</ol></section>

        <section class="lr-sec" id="lr-valkuilen"><div class="lr-sec__h"><span>06</span><h2>Valkuilen</h2></div>
          <div class="lr-traps">${x.valkuilen.map((s) => `<div class="lr-trap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.2v.1"/></svg><p>${esc(s)}</p></div>`).join("")}</div></section>
      </div>
      <aside class="lr-aside">
        <div class="lr-panel"><div class="lr-mono">Wat de klant krijgt</div><ul class="lr-deliv">${x.oplevering.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
        <div class="lr-panel"><div class="lr-mono">Werkwijze Flying Images</div><p>Klant betaalt na de eerste oplevering. Daarna volgt nog één revisieronde.</p></div>
        <div class="lr-panel"><div class="lr-mono">Past goed bij</div>${x.combi.map((c) => leerItem(c)).filter(Boolean).map((c) => `<a class="lr-combi" href="#leer/${c.slug}"><span class="lr-ic lr-ic--${c.cat} sm">${lrCat(c.cat).letter}</span>${esc(c.name)}<i>→</i></a>`).join("")}</div>
      </aside>
    </div>
  </div>`;
}

const lrToText = (type, v) => type === "list" ? (v || []).join("\n") : type === "steps" ? (v || []).map(([t, d]) => `${t} | ${d}`).join("\n") : v || "";
const lrFromText = (type, t) => {
  if (type === "text") return t.trim();
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
  if (type === "list") return lines.map((l) => l.replace(/^[-•*]\s*/, ""));
  return lines.map((l) => { const [a, ...b] = l.split("|"); return [a.trim(), b.join("|").trim()]; });
};

function leerEditor(x) {
  const hint = { text: "Lege regel = nieuwe alinea.", list: "Eén punt per regel.", steps: "Eén stap per regel: Titel | uitleg" };
  return `<div class="lr-edit">
    <p class="lr-note">Wijzigingen gelden alleen voor de Leeromgeving en worden opgeslagen in System. De dienstpagina op de website verandert niet.</p>
    ${LEER_FIELDS.map(([k, label, type]) => `
      <label class="lr-field"><span class="lr-mono">${esc(label)}</span>
        <textarea data-lr-field="${k}" data-type="${type}" rows="${type === "text" ? (k === "kort" ? 2 : 7) : Math.max(4, (x[k] || []).length + 1)}">${esc(lrToText(type, x[k]))}</textarea>
        <small>${hint[type]}</small></label>`).join("")}
  </div>`;
}

async function leerAction(btn) {
  const act = btn.dataset.lr, slug = LR.slug;
  if (act === "edit") { LR.edit = true; return render(); }
  if (act === "cancel") {
    if (LR.dirty && !(await ask("Je wijzigingen gaan verloren. Weet je het zeker?", "Weggooien"))) return;
    LR.edit = false; LR.dirty = false; return render();
  }
  if (act === "copy") {
    const x = leerItem(slug);
    const txt = `${x.name}: vragen voor het eerste gesprek\n\n` + x.vragen.map((q, i) => `${i + 1}. ${q}`).join("\n");
    try { await navigator.clipboard.writeText(txt); btn.textContent = "✓ Gekopieerd"; } catch { btn.textContent = "Kopiëren lukte niet"; }
    return setTimeout(() => (btn.textContent = "Gespreksvragen kopiëren"), 1800);
  }
  if (act === "save" || act === "reset") {
    if (act === "reset" && !(await ask("De standaardtekst voor deze dienst terugzetten? Je eigen aanpassingen worden verwijderd.", "Terugzetten"))) return;
    const next = clone(CFG);
    next.leer = { ...(next.leer || {}) };
    if (act === "reset") delete next.leer[slug];
    else {
      const o = {};
      content.querySelectorAll("[data-lr-field]").forEach((el) => { o[el.dataset.lrField] = lrFromText(el.dataset.type, el.value); });
      if (!o.kort || !o.aanpak?.length) { alert("Vul minstens 'In één zin' en één stap bij 'Aanpak' in."); return; }
      next.leer[slug] = o;
    }
    btn.disabled = true; btn.textContent = "Opslaan…";
    try {
      await api("saveConfig", { config: next });
      CFG = next; C.applyConfig(CFG);
      LR.edit = false; LR.dirty = false;
      render(); savedLabel("✓ Opgeslagen");
    } catch (err) { alert("Opslaan mislukt: " + err.message); btn.disabled = false; btn.textContent = act === "save" ? "Opslaan" : "Standaardtekst terugzetten"; }
  }
}

content.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lr]");
  if (b) { e.preventDefault(); return leerAction(b); }
  const j = e.target.closest("[data-lr-jump]");
  if (j) { e.preventDefault(); document.getElementById(j.dataset.lrJump)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
});
content.addEventListener("input", (e) => {
  if (e.target.id === "lrSearch") {
    const q = e.target.value.trim().toLowerCase();
    let any = false;
    content.querySelectorAll("[data-lr-group]").forEach((g) => {
      let n = 0;
      g.querySelectorAll("[data-lr-search]").forEach((c) => { const hit = !q || c.dataset.lrSearch.includes(q); c.hidden = !hit; n += hit; });
      g.hidden = !n; any ||= !!n;
    });
    $("#lrNone").hidden = any;
  }
  if (e.target.dataset.lrField) LR.dirty = true;
});
content.addEventListener("change", (e) => {
  const i = e.target.dataset?.lrCheck;
  if (i === undefined || !LR.slug) return;
  const set = LR_CHECK[LR.slug] || (LR_CHECK[LR.slug] = new Set());
  e.target.checked ? set.add(+i) : set.delete(+i);
  const el = $("#lrCheckCount");
  if (el) el.textContent = `${set.size}/${leerItem(LR.slug).belangrijk.length} gecheckt`;
});
addEventListener("beforeunload", (e) => { if (LR.edit && LR.dirty) { e.preventDefault(); e.returnValue = ""; } });

/* ================= router ================= */
const TITLES = { intakes: "Lopende intakes", afgerond: "Afgeronde projecten", nieuw: "Nieuwe intake", intake: "Intake", vragenlijsten: "Vragenlijsten", workflows: "Workflows", "workflow-be": "Workflow BE", "vragenlijst-be": "Vragenlijst BE", prijzen: "Prijzen", hero: "Hero-afbeelding", fibrand: "FIBrand", supergraphic: "Supergraphic", leer: "Leeromgeving" };
const NAVSEC = { nieuw: "intakes", intake: "intakes" };
let ROUTE_SEQ = 0;

async function render() {
  const seq = ++ROUTE_SEQ;
  let [sec, arg] = location.hash.slice(1).split("/");
  if (!TITLES[sec]) sec = "intakes";
  if (!(sec === "intake" && FLOW?.id === arg) && !(sec === "workflows" && arg && FLOW?.mode === "preview")) { flushFlow(); FLOW = null; }
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.sec === (NAVSEC[sec] || sec)));
  $("#crumb").innerHTML = `System / <b>${TITLES[sec]}</b>`;
  savedLabel("");
  if (sec !== "prijzen") PR = null;
  if (sec !== "hero") HERO = null;
  if (sec !== "leer" || LR.slug !== arg) LR = { slug: null, edit: false, dirty: false };
  document.body.classList.toggle("leer", sec === "leer");
  document.body.classList.remove("open");
  content.innerHTML = `<p class="lead"><span class="spin"></span></p>`;
  try {
    const html = await PAGES[sec](arg);
    if (seq !== ROUTE_SEQ) return;
    if (html !== undefined) content.innerHTML = html;
  } catch (err) {
    if (seq !== ROUTE_SEQ) return;
    content.innerHTML = `<div class="err-box">${esc(err.message)}</div>`;
  }
  scrollTo(0, 0);
}
addEventListener("hashchange", render);

/* ================= pagina's ================= */
function merkPagina(file, intro) {
  return `<div class="row" style="justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">
      <p class="lead" style="margin:0">${intro}</p>
      <a class="btn ghost sm" href="/system/${file}.html" target="_blank" rel="noopener">Open in nieuw tabblad ↗</a>
    </div>
    <iframe src="/system/${file}.html" title="${file}" style="display:block;width:100%;height:calc(100vh - 190px);min-height:600px;border:1px solid var(--border);border-radius:18px;background:#fff"></iframe>`;
}

const PAGES = {
  async fibrand() { return merkPagina("fibrand", "Brandbook-bron van Flying Images: logo, kleuren, typografie, radius en toon."); },
  async leer(slug) { return slug ? leerDetail(slug) : leerOverzicht(); },
  async supergraphic() { return merkPagina("supergraphic", "Supergraphic en patronen in alle formaten, te downloaden als SVG en PNG."); },
  async intakes() { return intakeList("lopend"); },
  async afgerond() { return intakeList("afgerond"); },

  async nieuw() {
    return `<a class="back" href="#intakes">← Lopende intakes</a>` + head("Nieuwe intake", "Kies een dienst", "Kies de dienst waarvoor je een intake start. Diensten zonder workflow zijn nog niet te kiezen.")
      + DIENSTEN.map((g) => `<div class="group"><div class="eyebrow">${g.cat}</div><div class="grid">${g.items.map(([id, name]) => ACTIVE.has(id)
        ? `<button class="tile" data-act="start" data-dienst="${id}"><div class="cat">Workflow beschikbaar</div><h3>${name}</h3><p>${C.NC_STEP_TITLES.length} stappen · klant zónder website</p></button>`
        : `<button class="tile" disabled><div class="cat">Nog geen workflow</div><h3>${name}</h3><p>Aanmaken via Workflow BE</p></button>`).join("")}</div></div>`).join("");
  },

  async intake(id) {
    const row = await api("get", { id });
    if (row.workflow_type === "scrape") {
      return `<a class="back" href="#intakes">← Lopende intakes</a>` + head("Klant mét website (oud)", row.bedrijfsnaam || "Naamloze intake",
        "Deze intake is gemaakt met de oude flow voor klanten mét website. Die flow is niet meegenomen naar System; de gegevens zijn wel bewaard.")
        + `<div class="card"><div class="card__h"><h3>Opgeslagen gegevens</h3></div><textarea class="field mono" rows="18" readonly>${esc(JSON.stringify(row.antwoorden, null, 2))}</textarea></div>`;
    }
    FLOW = makeFlow("live", row.id, row.antwoorden || {}, Math.max(0, (row.huidige_stap || 1) - 1));
    return renderFlow();
  },

  async vragenlijsten(kind) {
    kind = LISTS.some(([k]) => k === kind) ? kind : "standaard";
    const secs = C.liveSections(kind);
    const n = secs.reduce((a, s) => a + s.questions.length, 0);
    return head("Klanten", "Vragenlijsten", "De intake-vragenlijst van Custom website. Welke variant een klant krijgt, hangt af van de branche in stap 1.")
      + tabs("vragenlijsten", kind) + `<div class="row" style="margin-bottom:18px"><span class="badge navy">${n} vragen</span><a class="btn ghost sm" href="#vragenlijst-be/${kind}">Bewerken</a></div>`
      + secs.map((s) => `<div class="card"><div class="card__h"><div><h3>${esc(s.title)}</h3>${s.note ? `<p>${esc(s.note)}</p>` : ""}</div></div>
        ${s.questions.map((q) => `<div class="ro-q"><div class="q__l">${esc(q.label)} ${q.needed ? '<span class="pill-need">nodig</span>' : ""}</div>
          ${q.hint ? `<div class="hint" style="margin-top:0">${esc(q.hint)}</div>` : ""}
          ${q.type === "select" ? `<div class="chips">${(q.options || []).map((o) => `<span class="chip">${esc(o)}</span>`).join("")}</div>` : ""}
          ${q.chips?.length ? `<div class="chips">${q.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>${q.chipsMulti ? `<div class="hint">Meerdere keuzes, max ${q.chipsMax || 5}</div>` : ""}` : ""}
        </div>`).join("")}</div>`).join("");
  },

  async workflows(id) {
    if (id === "custom-website") {
      if (!FLOW || FLOW.mode !== "preview") FLOW = makeFlow("preview", null, {}, 0);
      return renderFlow();
    }
    return head("Klanten", "Workflows", "Open een workflow om hem volledig te doorlopen, precies zoals tijdens een intake. In de proefmodus wordt niets opgeslagen.")
      + DIENSTEN.map((g) => `<div class="group"><div class="eyebrow">${g.cat}</div><div class="grid">${g.items.map(([id, name]) => ACTIVE.has(id)
        ? `<a class="tile" href="#workflows/${id}"><div class="cat">Workflow</div><h3>${name}</h3><p>${C.NC_STEP_TITLES.length} stappen · ${C.NC_STEP_TITLES.join(" → ")}</p></a>`
        : `<div class="tile" style="opacity:.55"><div class="cat">Nog geen workflow</div><h3>${name}</h3><p>Nog niet gebouwd</p></div>`).join("")}</div></div>`).join("");
  },

  async "workflow-be"() {
    BE = { kind: "steps", draft: C.DEFAULT_STEP_TITLES.map((t, i) => ({ title: CFG.steps?.[i]?.title || "", explain: CFG.steps?.[i]?.explain || "", confirm: CFG.steps?.[i]?.confirm || "" })), dirty: false };
    return renderStepsBE();
  },

  async prijzen() {
    const [base, saved] = await Promise.all([
      fetch("/assets/prices-base.json", { cache: "no-store" }).then((r) => { if (!r.ok) throw new Error("Standaardprijzen niet gevonden."); return r.json(); }),
      api("getPrices").then((r) => r.prices).catch(() => null),
    ]);
    PR = { base, saved: !!saved, savedAt: saved?.savedAt || "", draft: prDraft(base, saved), dirty: false };
    return renderPrices();
  },

  async hero() {
    const { site } = await api("getSite");
    const h = site?.hero || null;
    HERO = { saved: h, focus: h?.focus || "50% 50%", preview: h ? `/api/site?img=hero&v=${encodeURIComponent(h.savedAt)}` : DEFAULT_HERO, file: null, dirty: false, busy: false };
    return renderHero();
  },

  async "vragenlijst-be"(kind) {
    kind = LISTS.some(([k]) => k === kind) ? kind : "standaard";
    BE = { kind, draft: clone(C.liveSections(kind)), dirty: false };
    return renderListBE();
  },
};

const tabs = (base, cur) => `<div class="tabs">${LISTS.map(([k, l]) => `<a href="#${base}/${k}" class="${k === cur ? "on" : ""}">${l}</a>`).join("")}</div>`;

/* ================= intake-overzicht ================= */
async function intakeList(mode) {
  const rows = await api("list", { status: mode });
  if (mode === "lopend") $("#countOpen").textContent = rows.length || "";
  const title = mode === "lopend" ? "Lopende intakes" : "Afgeronde projecten";
  const lead = mode === "lopend" ? "Open een bestaande intake om verder te gaan, of start een nieuwe." : "Afgeronde intakes. Zet ze terug als er nog iets moet gebeuren.";
  return `<div class="head-row"><div>${head("Klanten", title, lead)}</div>${mode === "lopend" ? `<a class="btn dark" href="#nieuw">+ Nieuwe intake starten</a>` : ""}</div>`
    + (rows.length ? `<div class="ilist">${rows.map((r) => `
      <div class="irow">
        <div class="irow__main"><h3>${esc(r.bedrijfsnaam || "Naamloze intake")}</h3>
          <p>${dienstLabel(r)} · stap ${r.huidige_stap} · bijgewerkt ${fmtDate(r.bijgewerkt_op)}</p></div>
        <div class="acts">
          <span class="badge">${esc(r.status)}</span>
          <a class="btn ghost sm" href="#intake/${r.id}">Openen</a>
          ${mode === "lopend"
            ? `<button class="btn ghost sm" data-act="status" data-id="${r.id}" data-to="afgerond">Afronden</button>`
            : `<button class="btn ghost sm" data-act="status" data-id="${r.id}" data-to="in behandeling">Terugzetten</button>`}
          <button class="icon del" title="Verwijderen" data-act="delete" data-id="${r.id}" data-name="${esc(r.bedrijfsnaam || "Naamloze intake")}">${ICON.del}</button>
        </div>
      </div>`).join("")}</div>`
      : `<div class="empty"><h3>${mode === "lopend" ? "Geen lopende intakes" : "Nog geen afgeronde projecten"}</h3><p>${mode === "lopend" ? "Start een nieuwe intake om te beginnen." : "Rond een intake af om hem hier te zien."}</p></div>`);
}

/* ================= workflow (stepper) ================= */
let FLOW = null;
function makeFlow(mode, id, data, step) {
  const state = { ...clone(C.ncInitialState), ...data };
  if (!Array.isArray(state.referenceImages)) state.referenceImages = [null, null, null];
  return { mode, id, state, step: Math.min(step, C.NC_STEP_TITLES.length - 1), customOpen: new Set(), bulk: null, timer: null, saving: false, pending: false, previews: {} };
}
function titlesFor(s) {
  return C.NC_STEP_TITLES.map((t, i) => i !== 1 ? t
    : C.isArtistIndustry(s.industry) ? `${t} (Artiest)` : C.isProductIndustry(s.industry) ? `${t} (Product / B2B)` : t);
}
function renderFlow() {
  const f = FLOW, s = f.state, titles = titlesFor(s);
  $("#crumb").innerHTML = f.mode === "preview" ? `System / Workflows / <b>Custom website</b>` : `System / Intakes / <b>${esc(s.companyName || "Naamloze intake")}</b>`;
  const back = f.mode === "preview" ? `<a class="back" href="#workflows">← Alle workflows</a>` : `<a class="back" href="#intakes">← Lopende intakes</a>`;
  const bar = f.mode === "preview" ? `<div class="preview-bar"><span><b>Proefmodus</b> · Custom website · niets wordt opgeslagen</span><button class="btn sm" data-act="start" data-dienst="custom-website">Echte intake starten</button></div>` : "";
  const explain = stepExplain(f.step);
  return `${back}${bar}
    <div class="stepper">${titles.map((t, i) => `<button data-f="jump" data-i="${i}" class="${i < f.step ? "done" : ""} ${i === f.step ? "cur" : ""}"><span class="dot">${i < f.step ? "✓" : i + 1}</span><span class="t">${esc(t)}</span></button>`).join("")}</div>
    <div class="step-head"><div class="cat">Stap ${f.step + 1} van ${titles.length}</div><h2>${esc(titles[f.step])}</h2>${explain ? `<div class="explain">${esc(explain)}</div>` : ""}</div>
    <div id="stepBody">${STEP[f.step]()}</div>
    <div class="flow-nav">
      <button class="btn ghost" data-f="prev" ${f.step === 0 ? "disabled" : ""}>← Vorige</button>
      ${f.step < titles.length - 1 ? `<button class="btn dark" data-f="next">Volgende →</button>` : ""}
    </div>`;
}
function rerender(keepScroll = true) {
  if (!FLOW) return;
  const y = scrollY;
  content.innerHTML = renderFlow();
  if (keepScroll) scrollTo(0, y);
}
function update(patch, { redraw = false } = {}) {
  Object.assign(FLOW.state, patch);
  queueSave();
  if (redraw) rerender();
}
function queueSave(now = false) {
  const f = FLOW;
  if (!f || f.mode !== "live") return;
  clearTimeout(f.timer);
  savedLabel("Niet opgeslagen…");
  f.timer = setTimeout(() => doSave(f), now ? 0 : 800);
}
async function doSave(f) {
  if (f.saving) { f.pending = true; return; }
  f.saving = true; f.pending = false;
  const s = f.state;
  try {
    await api("save", { id: f.id, bedrijfsnaam: s.companyName, huidige_stap: f.step + 1, state: s,
      stijl: { primaryColor: s.primaryColor, secondaryColor: s.secondaryColor, fontFamily: s.fontFamily }, paginas: s.sitePages });
    if (FLOW === f) savedLabel("✓ Opgeslagen");
  } catch (e) { if (FLOW === f) savedLabel("Opslaan mislukt", true); }
  f.saving = false;
  if (f.pending) doSave(f);
}
function flushFlow() {
  const f = FLOW;
  if (f?.mode === "live" && f.timer) { clearTimeout(f.timer); f.timer = null; doSave(f); }
}
addEventListener("beforeunload", flushFlow);
function goTo(i) {
  FLOW.step = Math.max(0, Math.min(i, C.NC_STEP_TITLES.length - 1));
  FLOW.bulk = null;
  queueSave(true);
  rerender(false);
  scrollTo({ top: 0, behavior: "smooth" });
}

/* ----- velden ----- */
const fld = (key, label, hint = "", ph = "") => `<div><label class="lbl" for="f-${key}">${label}</label><input class="field" id="f-${key}" data-bind="${key}" value="${esc(FLOW.state[key])}" placeholder="${esc(ph)}">${hint ? `<div class="hint">${hint}</div>` : ""}</div>`;
const card = (title, desc, body, action = "") => `<div class="card"><div class="card__h"><div><h3>${title}</h3>${desc ? `<p>${desc}</p>` : ""}</div>${action}</div>${body}</div>`;

const STEP = [
  /* 0 Bedrijfsinfo */
  () => {
    const s = FLOW.state, known = C.INDUSTRY_OPTIONS.includes(s.industry);
    const ind = C.isArtistIndustry(s.industry) ? "Stap 2 toont de kortere artiesten-vragenlijst." : C.isProductIndustry(s.industry) ? "Stap 2 toont de productvragenlijst (Product / B2B)." : "Stap 2 toont de standaard intake-vragenlijst.";
    const noLogo = s.logoStatus === C.LOGO_OPTIONS[0];
    return card("Bedrijfsinfo", "Alles is optioneel — vul in wat tijdens het gesprek bekend is.", `<div class="grid2">
      ${fld("companyName", "Bedrijfsnaam")}${fld("ownerName", "Naam eigenaar")}
      <div><label class="lbl">Branche</label>
        <select class="field" data-f="industry">${C.INDUSTRY_OPTIONS.map((o) => `<option ${o === s.industry ? "selected" : ""}>${esc(o)}</option>`).join("")}<option value="anders" ${known ? "" : "selected"}>Anders / onbekend</option></select>
        ${known ? "" : `<input class="field" style="margin-top:8px" data-bind="industry" data-redraw-step value="${esc(s.industry)}" placeholder="Branche zelf invullen...">`}
        <div class="hint">${ind}</div></div>
      ${fld("city", "Vestigingsplaats")}${fld("phone", "Telefoon")}${fld("email", "E-mail")}
      ${fld("address", "Adres", "Ook als er niet op locatie gewerkt wordt — voor Google is een adres belangrijk")}${fld("kvk", "KvK-nummer")}
      ${fld("domain", "Gewenste domeinnaam", "Nog niets geregistreerd? Zet hier de voorkeur")}
    </div>`)
    + card("Logo", "", `<div class="stack"><div><label class="lbl">Is er al een logo?</label>
        <select class="field" data-f="logoStatus">${C.LOGO_OPTIONS.map((o) => `<option ${o === s.logoStatus ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></div>
      <div><label class="lbl">${noLogo ? "Richting voor het logo" : "Wat is er precies?"}</label>
        <textarea class="field" rows="3" data-bind="logoNote" placeholder="${noLogo ? "wordmark, beeldmerk, initialen, iets met gereedschap..." : "Bestandstype, kleuren, wie het gemaakt heeft"}">${esc(s.logoNote)}</textarea></div></div>`);
  },

  /* 1 Vragenlijst */
  () => {
    const s = FLOW.state, kind = C.listFor(s.industry || ""), secs = C.liveSections(kind);
    const qs = secs.flatMap((x) => x.questions);
    const filled = qs.filter((q) => (s.answers[q.id] ?? "").trim()).length;
    if (FLOW.bulk == null) FLOW.bulk = bulkTemplate(secs, s.answers);
    const intro = kind === "artiest" ? "Kortere vragenlijst speciaal voor artiesten — zangers, dj's, muzikanten en performers. Loop dit door tijdens het gesprek; doorklikken mag altijd."
      : kind === "product" ? "Vragenlijst voor producten en B2B-oplossingen: product, probleem en resultaat, doelgroep, bewijs, bezwaren, conversie en toon. Doorklikken mag altijd."
      : "Loop dit door tijdens het intakegesprek. Er is geen bestaande website om uit te lezen, dus alles wat hier staat is straks het enige materiaal voor het brandbook én de teksten op de site.";
    return card("Snel invullen in één veld", "Hieronder staat de hele vragenlijst als template. Typ of plak de antwoorden rechtstreeks in het veld (bijv. van Ai-research), klik dan 'Antwoorden verwerken' om de losse velden eronder te vullen.",
      `<textarea class="field mono" rows="16" data-f="bulk">${esc(FLOW.bulk)}</textarea>
       <div class="row" style="margin-top:12px"><button class="btn ghost sm" data-f="bulk-reset">↺ Template opnieuw laden</button><button class="btn sm" data-f="bulk-parse">Antwoorden verwerken</button><span class="hint" id="bulkMsg" style="margin:0"></span></div>`)
      + `<div class="card"><p style="color:var(--ink-2);font-size:14px">${intro}</p>
        <div class="row" style="justify-content:space-between;margin-top:14px"><span class="mini">${filled} van ${qs.length} vragen</span><button class="btn ghost sm" data-f="copy-answers">Kopieer als tekst</button></div>
        <div class="progress"><span style="width:${qs.length ? (filled / qs.length) * 100 : 0}%"></span></div></div>`
      + secs.map((sec) => card(esc(sec.title), sec.note ? esc(sec.note) : "",
        (kind === "standaard" && sec.id === "04" ? servicesBox() : "") + sec.questions.map(questionField).join(""))).join("")
      + `<p class="hint" style="margin-top:16px">De vragen met "nodig" wegen het zwaarst voor het brandbook en de teksten. Doorklikken mag altijd — lege vragen komen als "nog niet beantwoord" onderaan de prompt te staan.</p>`;
  },

  /* 2 Kleuren & lettertype */
  () => {
    const s = FLOW.state;
    return card("Kleuren", "Er is nog geen huisstijl, dus hier maak je de keuze.", colorField("primaryColor", "Primaire kleur") + `<hr style="border:0;border-top:1px solid var(--border);margin:24px 0">` + colorField("secondaryColor", "Secundaire / accentkleur"))
      + card("Logo (optioneel)", "Upload het logo als het er al is — primaire versie en eventuele tweede variant.", uploads("logo", [["logoPrimary", "Primair logo", "De normale, volledige kleurversie van het logo."], ["logoSecondary", "Secundair logo", "bijv. inverse versie voor donkere achtergrond of monochrome variant"]]))
      + card("Lettertype", "", `<label class="lbl" for="f-font">Lettertype</label><input class="field" id="f-font" style="max-width:420px" data-bind="fontFamily" data-font value="${esc(s.fontFamily)}" placeholder="Bijv. Manrope">
        <div class="hint">Eén lettertype voor de hele huisstijl, hiërarchie via gewicht en grootte. Kies bewust per klant.</div>
        <div class="row" style="margin-top:12px">${C.FONT_SUGGESTIONS.map((f) => `<button class="btn ghost sm" data-f="font" data-v="${esc(f)}">${esc(f)}</button>`).join("")}</div>
        <div class="fontprev"><p id="fontPrev" style="${s.fontFamily ? `font-family:'${esc(s.fontFamily)}',sans-serif` : ""}">${esc(s.companyName || "Bedrijfsnaam")}</p><p class="hint">${esc(s.fontFamily || "nog geen lettertype gekozen")}</p></div>`)
      + card("Notitie bij de huisstijl", "Waarom passen deze kleuren en dit font bij dit bedrijf? Gaat mee in de prompt.", `<textarea class="field" rows="4" data-bind="styleNote" placeholder="Bijv. aardse tinten passen bij het ambachtelijke werk, schreefloos font voor rust en leesbaarheid.">${esc(s.styleNote)}</textarea>`)
      + card("Visuele referentie (optioneel)", "Screenshots van homepages of secties van andere sites, als voorbeeld voor de gewenste vibe en stijl.",
        uploads("ref", [0, 1, 2].map((i) => [`ref${i}`, `Referentie ${i + 1}`, ""]))
        + `<div style="margin-top:14px"><label class="lbl">Wat spreekt hierin aan?</label><textarea class="field" rows="3" data-bind="referenceNote" placeholder="Bijv. de grote foto's, de rustige witruimte, de manier waarop diensten worden getoond">${esc(s.referenceNote)}</textarea></div>`);
  },

  /* 3 Pagina-opbouw */
  () => {
    const s = FLOW.state, services = s.services.filter((x) => x.name.trim());
    return card("Pagina-opbouw", "Vink aan welke pagina's de site krijgt en noteer per pagina wat erop moet.",
      (services.length ? `<div class="notice row" style="justify-content:space-between;margin-bottom:16px"><span style="max-width:620px">${services.length} diensten uit de intake. Maak er losse pagina's van als elke dienst eigen zoekverkeer moet trekken; houd het bij één dienstenpagina als het aanbod klein is.</span><button class="btn ghost sm" data-f="svc-pages">Voeg dienstpagina's toe</button></div>` : "")
      + s.sitePages.map((p) => `<div class="pg"><div class="row"><label><input type="checkbox" data-f="pg-toggle" data-id="${esc(p.id)}" ${p.enabled ? "checked" : ""}>${esc(p.name)}</label>
          <button class="icon del" data-f="pg-del" data-id="${esc(p.id)}" title="Pagina verwijderen">${ICON.del}</button></div>
          ${p.enabled ? `<textarea class="field" rows="2" data-f="pg-note" data-id="${esc(p.id)}" placeholder="Wat moet hierop? Bijv. 3 fotoplekken, uitleg over onderhoudsabonnement, formulier">${esc(p.note)}</textarea>` : ""}</div>`).join("")
      + `<div class="row" style="margin-top:14px;flex-wrap:nowrap"><input class="field" style="max-width:300px" id="newPage" placeholder="Eigen pagina toevoegen"><button class="btn ghost" data-f="pg-add">+ Toevoegen</button></div>`)
      + card("Homepage sectie-voorkeur (optioneel)", "Als je al weet hoe de homepage opgebouwd moet worden, noteer dat hier — bijv. gewenste volgorde van secties (hero, diensten, over ons, testimonials, cta, etc.).",
        `<textarea class="field" rows="4" data-bind="homepageSections" placeholder="Bijv. hero met volledige achtergrondfoto, korte intro, diensten, werkwijze, testimonials, contact-cta">${esc(s.homepageSections)}</textarea>`);
  },

  /* 4 Brandbook-prompt */
  () => {
    const s = FLOW.state, missing = C.emptyQuestions(s), n = C.referenceCount(s) + C.logoFiles(s).length;
    return (missing.length ? `<div class="notice" style="margin-bottom:16px">${missing.length} vragen zijn nog leeg. Ze staan onderaan de prompt als "nog niet beantwoord", zodat er niets verzonnen wordt.</div>` : "")
      + card("Brandbook-prompt", "Plak deze prompt in Claude Design om het brandbook-PDF te laten maken.",
        (n ? `<p class="hint" style="margin:0 0 12px">Download de screenshots${C.logoFiles(s).length ? " en het logo" : ""} en upload ze samen met deze tekstprompt in Claude Design — een tekstprompt kan de afbeeldingen zelf niet bevatten.</p>` : "")
        + promptBox("brandbookPrompt", "Genereer brandbook-prompt"),
        n && FLOW.mode === "live" ? `<button class="btn ghost sm" data-f="download">Download afbeeldingen (${n})</button>` : "");
  },

  /* 5 Lovable-prompt */
  () => card("Lovable-prompt", "De volledige bouwopdracht voor de nieuwe website in Lovable.", promptBox("lovablePrompt", "Genereer Lovable-prompt"))
    + card("Claude-prompt", "Dezelfde inhoud, herschreven voor Claude: algemene code-instructies zonder Lovable-specifieke techniek.", promptBox("claudePrompt", "Genereer Claude-prompt"))
    + `<div class="notice" style="margin-top:16px">Klaar. Kopieer de prompt naar Lovable of Claude en voeg het brandbook-PDF toe als bijlage.</div>`,
];

const BUILDERS = { brandbookPrompt: C.buildNcBrandbookPrompt, lovablePrompt: C.buildNcLovablePrompt, claudePrompt: C.buildNcClaudePrompt };
function promptBox(key, label) {
  const v = FLOW.state[key];
  if (!v) return `<button class="btn" data-f="gen" data-k="${key}">${label}</button>`;
  return `<textarea class="field mono" rows="18" data-bind="${key}">${esc(v)}</textarea>
    <div class="row" style="margin-top:10px"><button class="btn" data-f="copy" data-k="${key}">Kopieer</button><button class="btn ghost" data-f="regen" data-k="${key}">↻ Opnieuw opbouwen uit de antwoorden</button></div>`;
}

function questionField(q) {
  const v = FLOW.state.answers[q.id] ?? "";
  let chips = "";
  if (q.chips?.length) {
    const parts = v.split(",").map((x) => x.trim());
    const sel = parts.filter((x) => q.chips.includes(x));
    const custom = parts.filter((x) => x && !q.chips.includes(x)).join(", ");
    const open = FLOW.customOpen.has(q.id) || custom.length > 0;
    chips = `<div class="chips">${q.chips.map((c) => `<button class="chip ${sel.includes(c) ? "on" : ""}" data-f="chip" data-q="${q.id}" data-v="${esc(c)}">${esc(c)}</button>`).join("")}
      <button class="chip ${open ? "on" : ""}" data-f="chip-custom" data-q="${q.id}">Iets anders, namelijk:</button></div>
      ${open ? `<input class="field" style="max-width:440px;margin-bottom:8px" data-f="chip-custom-input" data-q="${q.id}" value="${esc(custom)}" placeholder="Eigen antwoord...">` : ""}
      ${q.chipsMulti ? `<div class="hint" style="margin:0 0 8px">Maximaal ${q.chipsMax || 5} — ${sel.length} gekozen</div>` : ""}`;
  }
  const input = q.type === "select"
    ? `<select class="field" data-ans="${q.id}"><option value="">— kies —</option>${(q.options || []).map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
    : `<textarea class="field" rows="2" data-ans="${q.id}" placeholder="${esc(q.hint || "Nog niet ingevuld")}">${esc(v)}</textarea>`;
  return `<div class="q"><div class="q__l">${esc(q.label)} ${q.needed ? '<span class="pill-need">nodig</span>' : ""}</div>${chips}${input}${q.hint ? `<div class="hint">${esc(q.hint)}</div>` : ""}</div>`;
}

function servicesBox() {
  const svcs = FLOW.state.services;
  return `<div class="svc-box"><div class="q__l">Diensten</div>
    ${svcs.map((x, i) => `<div class="svc"><div class="row"><span class="num">${String(i + 1).padStart(2, "0")}</span>
      <input class="field" data-f="svc" data-id="${x.id}" data-k="name" value="${esc(x.name)}" placeholder="bijv. Buitenschilderwerk">
      <button class="icon del" data-f="svc-del" data-id="${x.id}" title="Dienst verwijderen">${ICON.del}</button></div>
      <textarea class="field" rows="3" style="margin-top:8px" data-f="svc" data-id="${x.id}" data-k="description" placeholder="Wat houdt het in, voor wie, en wat is er bijzonder aan?">${esc(x.description)}</textarea></div>`).join("")}
    <button class="btn ghost sm" style="margin-top:10px" data-f="svc-add">+ Dienst toevoegen</button></div>`;
}

function colorField(key, label) {
  const v = FLOW.state[key];
  return `<label class="lbl">${label}</label><div class="row" style="flex-wrap:nowrap"><input type="color" data-color="${key}" value="${/^#[0-9a-f]{6}$/i.test(v) ? v : "#000000"}"><input class="field" style="max-width:150px;font-family:monospace;text-transform:uppercase" data-color="${key}" value="${esc(v)}"></div>
    <div class="scale" id="scale-${key}">${scaleHtml(v)}</div>`;
}
const scaleHtml = (v) => C.buildScale(v).map((x) => `<div class="sw"><div style="background:${x.hex}"></div><span><b>${x.step}%</b>${x.hex}</span></div>`).join("");

function uploads(prefix, slots) {
  const s = FLOW.state, live = FLOW.mode === "live";
  const pathOf = (key) => key.startsWith("ref") ? s.referenceImages[+key.slice(3)] : s[key];
  return (live ? "" : `<p class="hint" style="margin:0 0 10px">Uploaden staat uit in de proefmodus.</p>`)
    + `<div class="uploads">${slots.map(([key, label, hint], i) => {
      const p = pathOf(key), url = FLOW.previews[p];
      if (p && !url && live) signPreview(p);
      return `<div class="up"><div class="q__l" style="margin:0">${label}</div>${hint ? `<div class="hint" style="margin-top:2px">${hint}</div>` : ""}
        <div class="up__img">${url ? `<img src="${esc(url)}" alt="${label}">` : p ? "Laden…" : "Nog geen bestand"}</div>
        <div class="row"><label class="btn ghost sm" ${live ? "" : 'style="opacity:.45;pointer-events:none"'}>${p ? "Vervangen" : "Uploaden"}<input type="file" accept="image/*" hidden data-f="upload" data-key="${key}" data-prefix="${prefix}" data-slot="${i}"></label>
        ${p && live ? `<button class="icon del" data-f="unupload" data-key="${key}" title="Verwijderen">${ICON.del}</button>` : ""}</div></div>`;
    }).join("")}</div><p class="hint" id="upMsg"></p>`;
}
const signing = new Set();
async function signPreview(path) {
  if (signing.has(path)) return;
  signing.add(path);
  try {
    const { urls } = await api("sign", { paths: [path] });
    if (urls[0] && FLOW) { FLOW.previews[path] = urls[0]; if (FLOW.step === 2) rerender(); }
  } catch {} finally { signing.delete(path); }
}

function bulkTemplate(secs, answers) {
  const qs = secs.flatMap((x) => x.questions);
  let n = 1;
  return secs.map((sec) => [sec.title, ...sec.questions.flatMap((q) => [`Vraag ${n++}/${qs.length} — ${q.label}`, answers[q.id]?.trim() || "[antwoord hier]", ""])].join("\n")).join("\n\n");
}
function parseBulk(text, secs, answers) {
  const qs = secs.flatMap((x) => x.questions);
  const re = /Vraag\s+(\d+)\s*(?:\/|\bvan\b)\s*\d+\s*[—–-]\s*([^\r\n]+)/gi;
  const m = [...text.matchAll(re)];
  const out = { ...answers };
  let count = 0;
  m.forEach((match, i) => {
    const q = qs[parseInt(match[1], 10) - 1];
    if (!q) return;
    const start = match.index + match[0].length, end = i + 1 < m.length ? m[i + 1].index : text.length;
    const raw = text.slice(start, end).replace(/\n+\s*\d{2}\s+[^\n]+\s*$/, "").trim();
    const v = raw === "[antwoord hier]" ? "" : raw;
    out[q.id] = v;
    if (v) count++;
  });
  return { answers: out, count };
}
function fileToBase64(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] || ""); r.onerror = rej; r.readAsDataURL(file); });
}
async function copyText(t, btn) {
  try { await navigator.clipboard.writeText(t); const o = btn.textContent; btn.textContent = "✓ Gekopieerd"; setTimeout(() => (btn.textContent = o), 1800); } catch {}
}
function loadFont(name) {
  if (!name || document.querySelector(`link[data-font="${CSS.escape(name)}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.dataset.font = name;
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;500;600&display=swap`;
  document.head.appendChild(l);
}

/* ----- events in de flow ----- */
content.addEventListener("input", (e) => {
  const el = e.target;
  if (FLOW && el.dataset.bind) {
    FLOW.state[el.dataset.bind] = el.value; queueSave();
    if (el.dataset.font !== undefined) { loadFont(el.value); const p = $("#fontPrev"); if (p) p.style.fontFamily = `'${el.value}',sans-serif`; }
    if (el.dataset.bind === "companyName") $("#crumb b") && FLOW.mode === "live" && ($("#crumb b").textContent = el.value || "Naamloze intake");
    return;
  }
  if (FLOW && el.dataset.ans) { FLOW.state.answers = { ...FLOW.state.answers, [el.dataset.ans]: el.value }; queueSave(); refreshBulk(); return; }
  if (FLOW && el.dataset.color) {
    const v = el.value.toUpperCase(); FLOW.state[el.dataset.color] = v; queueSave();
    content.querySelectorAll(`[data-color="${el.dataset.color}"]`).forEach((x) => { if (x !== el) x.value = x.type === "color" ? (/^#[0-9A-F]{6}$/.test(v) ? v.toLowerCase() : x.value) : v; });
    if (/^#[0-9A-F]{6}$/i.test(v)) $(`#scale-${el.dataset.color}`).innerHTML = scaleHtml(v);
    return;
  }
  if (!FLOW) return beInput(e);
  const f = el.dataset.f, s = FLOW.state;
  if (f === "bulk") FLOW.bulk = el.value;
  else if (f === "svc") { s.services = s.services.map((x) => (x.id === el.dataset.id ? { ...x, [el.dataset.k]: el.value } : x)); queueSave(); }
  else if (f === "pg-note") { s.sitePages = s.sitePages.map((p) => (p.id === el.dataset.id ? { ...p, note: el.value } : p)); queueSave(); }
  else if (f === "chip-custom-input") {
    const q = C.liveSections(C.listFor(s.industry || "")).flatMap((x) => x.questions).find((x) => x.id === el.dataset.q);
    const sel = (s.answers[q.id] ?? "").split(",").map((x) => x.trim()).filter((x) => q.chips.includes(x));
    commitChips(q, sel, el.value, false);
  }
});

content.addEventListener("change", async (e) => {
  const el = e.target;
  if (!FLOW) return beChange(e);
  const f = el.dataset.f, s = FLOW.state;
  if (el.dataset.ans && el.tagName === "SELECT") { s.answers = { ...s.answers, [el.dataset.ans]: el.value }; queueSave(); refreshBulk(); }
  else if (f === "industry") {
    const industry = el.value === "anders" ? "" : el.value;
    const names = (l) => l.map((n) => n.toLowerCase()).join("|");
    const cur = names(s.sitePages.map((p) => p.name));
    const patch = { industry };
    if (C.isProductIndustry(industry) && cur === names(C.NC_DEFAULT_PAGES.map((p) => p.name))) patch.sitePages = C.NC_PRODUCT_PAGES.map((name) => ({ id: name.toLowerCase(), name, enabled: true, note: "" }));
    else if (!C.isProductIndustry(industry) && cur === names(C.NC_PRODUCT_PAGES)) patch.sitePages = clone(C.NC_DEFAULT_PAGES);
    update(patch, { redraw: true });
  }
  else if (el.dataset.redrawStep !== undefined) rerender();
  else if (f === "logoStatus") update({ logoStatus: el.value }, { redraw: true });
  else if (f === "pg-toggle") update({ sitePages: s.sitePages.map((p) => (p.id === el.dataset.id ? { ...p, enabled: el.checked } : p)) }, { redraw: true });
  else if (f === "upload" && el.files[0]) {
    const file = el.files[0], key = el.dataset.key, msg = $("#upMsg");
    if (file.size > 3.5e6) { msg.textContent = "Bestand is te groot (max 3,5 MB)."; return; }
    msg.textContent = "Uploaden…";
    try {
      const old = key.startsWith("ref") ? s.referenceImages[+key.slice(3)] : s[key];
      const { path } = await api("upload", { intakeId: FLOW.id, slot: +el.dataset.slot, prefix: el.dataset.prefix, contentType: file.type || "image/png",
        extension: (file.name.split(".").pop() || "png").toLowerCase(), dataBase64: await fileToBase64(file) });
      FLOW.previews[path] = URL.createObjectURL(file);
      if (key.startsWith("ref")) { const imgs = [...s.referenceImages]; imgs[+key.slice(3)] = path; update({ referenceImages: imgs }); }
      else update({ [key]: path });
      queueSave(true); rerender();
      if (old) api("unupload", { path: old }).catch(() => {});
    } catch (err) { msg.textContent = "Uploaden is niet gelukt: " + err.message; }
  }
});

content.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-f],[data-act]");
  if (!el) return;
  if (el.dataset.act) return pageAction(el);
  if (!FLOW) return;
  const f = el.dataset.f, s = FLOW.state;
  if (f === "jump") goTo(+el.dataset.i);
  else if (f === "prev") goTo(FLOW.step - 1);
  else if (f === "next") { if (await ask(C.NC_STEP_CONFIRMATIONS[FLOW.step] || "Doorgaan naar de volgende stap?")) goTo(FLOW.step + 1); }
  else if (f === "chip") {
    const q = C.liveSections(C.listFor(s.industry || "")).flatMap((x) => x.questions).find((x) => x.id === el.dataset.q);
    const parts = (s.answers[q.id] ?? "").split(",").map((x) => x.trim());
    let sel = parts.filter((x) => q.chips.includes(x));
    const custom = parts.filter((x) => x && !q.chips.includes(x)).join(", ");
    const chip = el.dataset.v;
    if (q.chipsMulti) {
      if (sel.includes(chip)) sel = sel.filter((x) => x !== chip);
      else if (sel.length < (q.chipsMax || 5)) sel = [...sel, chip];
      else return;
    } else sel = sel.includes(chip) ? [] : [chip];
    commitChips(q, sel, FLOW.customOpen.has(q.id) || custom ? custom : "", true);
  }
  else if (f === "chip-custom") {
    const id = el.dataset.q;
    const q = C.liveSections(C.listFor(s.industry || "")).flatMap((x) => x.questions).find((x) => x.id === id);
    const parts = (s.answers[id] ?? "").split(",").map((x) => x.trim());
    const open = FLOW.customOpen.has(id) || parts.some((x) => x && !q.chips.includes(x));
    if (open) { FLOW.customOpen.delete(id); commitChips(q, parts.filter((x) => q.chips.includes(x)), "", true); }
    else { FLOW.customOpen.add(id); rerender(); content.querySelector(`[data-f="chip-custom-input"][data-q="${id}"]`)?.focus(); }
  }
  else if (f === "bulk-reset") { FLOW.bulk = null; rerender(); }
  else if (f === "bulk-parse") {
    const secs = C.liveSections(C.listFor(s.industry || ""));
    const { answers, count } = parseBulk(FLOW.bulk || "", secs, s.answers);
    update({ answers }); FLOW.bulk = null; rerender();
    const m = $("#bulkMsg"); if (m) m.textContent = `${count} antwoord${count === 1 ? "" : "en"} verwerkt`;
  }
  else if (f === "copy-answers") {
    const secs = C.liveSections(C.listFor(s.industry || ""));
    copyText(secs.map((x) => `${x.title}\n` + x.questions.map((q) => `${q.label}\n${(s.answers[q.id] ?? "").trim() || "(nog niet beantwoord)"}`).join("\n\n")).join("\n\n\n"), el);
  }
  else if (f === "svc-add") update({ services: [...s.services, { id: uid(), name: "", description: "" }] }, { redraw: true });
  else if (f === "svc-del") update({ services: s.services.filter((x) => x.id !== el.dataset.id) }, { redraw: true });
  else if (f === "font") { loadFont(el.dataset.v); update({ fontFamily: el.dataset.v }, { redraw: true }); }
  else if (f === "pg-del") update({ sitePages: s.sitePages.filter((p) => p.id !== el.dataset.id) }, { redraw: true });
  else if (f === "pg-add") {
    const name = $("#newPage").value.trim(); if (!name) return;
    update({ sitePages: [...s.sitePages, { id: uid(), name, enabled: true, note: "" }] }, { redraw: true });
  }
  else if (f === "svc-pages") {
    const existing = new Set(s.sitePages.map((p) => p.name.toLowerCase()));
    const extra = s.services.filter((x) => x.name.trim()).map((x) => ({ id: uid(), name: `Dienst — ${x.name.trim()}`, enabled: true, note: x.description.trim() })).filter((p) => !existing.has(p.name.toLowerCase()));
    if (extra.length) update({ sitePages: [...s.sitePages, ...extra] }, { redraw: true });
  }
  else if (f === "gen") update({ [el.dataset.k]: BUILDERS[el.dataset.k](s) }, { redraw: true });
  else if (f === "regen") { if (await ask("Opnieuw opbouwen uit de antwoorden? Handmatige aanpassingen in de prompt gaan verloren.")) update({ [el.dataset.k]: BUILDERS[el.dataset.k](s) }, { redraw: true }); }
  else if (f === "copy") copyText(s[el.dataset.k], el);
  else if (f === "unupload") {
    const key = el.dataset.key, path = key.startsWith("ref") ? s.referenceImages[+key.slice(3)] : s[key];
    if (key.startsWith("ref")) { const imgs = [...s.referenceImages]; imgs[+key.slice(3)] = null; update({ referenceImages: imgs }, { redraw: true }); }
    else update({ [key]: null }, { redraw: true });
    if (path) api("unupload", { path }).catch(() => {});
  }
  else if (f === "download") {
    const items = [...(s.referenceImages || []).filter(Boolean).map((p, i) => ({ p, n: `referentie-${i + 1}` })), ...C.logoFiles(s).map((l, i) => ({ p: l.path, n: `logo-${i === 0 ? "primair" : "secundair"}` }))];
    el.disabled = true;
    try {
      const { urls } = await api("sign", { paths: items.map((x) => x.p) });
      for (let i = 0; i < urls.length; i++) {
        if (!urls[i]) continue;
        const blob = await (await fetch(urls[i])).blob();
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `${items[i].n}.${(items[i].p.split(".").pop() || "png").split("?")[0]}`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
      }
    } catch (err) { alert(err.message); } finally { el.disabled = false; }
  }
});

function refreshBulk() {
  const ta = content.querySelector('[data-f="bulk"]');
  if (!ta || !FLOW) return;
  FLOW.bulk = bulkTemplate(C.liveSections(C.listFor(FLOW.state.industry || "")), FLOW.state.answers);
  if (document.activeElement !== ta) ta.value = FLOW.bulk;
}
function commitChips(q, sel, custom, redraw) {
  const picked = q.chipsMulti ? sel : sel.slice(-1);
  const all = [...picked, ...(custom.trim() ? [custom.trim()] : [])];
  FLOW.bulk = null;
  update({ answers: { ...FLOW.state.answers, [q.id]: all.join(", ") } }, { redraw });
  if (!redraw) refreshBulk();
}

/* ----- acties buiten de flow ----- */
async function pageAction(el) {
  const { act, id } = el.dataset;
  if (act === "start") {
    el.disabled = true;
    try { const row = await api("create", { dienst: el.dataset.dienst }); FLOW = null; location.hash = `#intake/${row.id}`; }
    catch (err) { alert(err.message); el.disabled = false; }
  } else if (act === "status") {
    el.disabled = true;
    try { await api("status", { id, status: el.dataset.to }); render(); } catch (err) { alert(err.message); el.disabled = false; }
  } else if (act === "delete") {
    if (!(await ask(`"${el.dataset.name}" definitief verwijderen? Dit kan niet ongedaan worden gemaakt.`, "Verwijderen"))) return;
    try { await api("delete", { id }); render(); } catch (err) { alert(err.message); }
  } else if (act === "be-save") saveBE(el);
  else if (act === "be-reset") {
    if (!(await ask("Terugzetten naar de standaardversie? Je eigen aanpassingen voor deze lijst verdwijnen na opslaan."))) return;
    BE.draft = BE.kind === "steps" ? BE.draft.map(() => ({ title: "", explain: "", confirm: "" })) : clone(C.DEFAULT_LISTS[BE.kind]);
    BE.dirty = true; redrawBE();
  } else beAction(el);
}

/* ================= Workflow BE ================= */
let BE = null;
function renderStepsBE() {
  const custom = DIENSTEN.flatMap((g) => g.items).filter(([id]) => !ACTIVE.has(id));
  return head("Werkwijze", "Workflow BE", "Pas de stappen van de Custom website-workflow aan: de titel, de uitleg die bovenaan de stap staat en de controlevraag bij 'Volgende'. Leeg laten = standaardtekst.")
    + `<div class="card"><div class="card__h"><div><h3>Custom website</h3><p>Klant zónder website · ${BE.draft.length} stappen. De volgorde en de onderdelen per stap (vragenlijst, kleurenkiezer, prompts) liggen vast in de code.</p></div><a class="btn ghost sm" href="#workflows/custom-website">Bekijk workflow</a></div>
      ${BE.draft.map((st, i) => `<div class="ed"><div class="ed__f">
        <span class="mini">Stap ${i + 1}</span>
        <input class="field" data-be="title" data-i="${i}" value="${esc(st.title)}" placeholder="${esc(C.DEFAULT_STEP_TITLES[i])}">
        <textarea class="field" rows="2" data-be="explain" data-i="${i}" placeholder="Uitleg voor deze stap (optioneel): wat doe je, waar let je op">${esc(st.explain)}</textarea>
        ${i < BE.draft.length - 1 ? `<input class="field" data-be="confirm" data-i="${i}" value="${esc(st.confirm)}" placeholder="Controlevraag: ${esc(C.DEFAULT_STEP_CONFIRMATIONS[i] || "")}">` : `<span class="hint" style="margin:0">Laatste stap, geen controlevraag.</span>`}
      </div></div>`).join("")}</div>
    <div class="card"><div class="card__h"><div><h3>Andere diensten</h3><p>Voor deze diensten bestaat nog geen workflow. Een nieuwe workflow vraagt eigen stappen en vragenlijsten; die worden apart gebouwd.</p></div></div>
      <div class="row">${custom.map(([, n]) => `<span class="badge navy">${n}</span>`).join("")}</div></div>`
    + saveBar();
}
const saveBar = () => `<div class="sticky-save"><button class="btn ghost" data-act="be-reset">Standaard herstellen</button><button class="btn dark" data-act="be-save" id="beSave" ${BE.dirty ? "" : "disabled"}>${BE.dirty ? "Opslaan" : "Opgeslagen"}</button></div>`;

/* ================= Vragenlijst BE ================= */
function renderListBE() {
  const secs = BE.draft;
  return head("Werkwijze", "Vragenlijst BE", "Bewerk de intake-vragenlijst. Een verwijderde vraag verdwijnt uit de lijst, maar antwoorden in bestaande intakes blijven bewaard. Nieuwe vragen komen in de prompts onder 'Aanvullende intake-antwoorden'.")
    + tabs("vragenlijst-be", BE.kind)
    + secs.map((sec, si) => `<div class="card">
      <div class="ed" style="background:#fff;border:0;padding:0;margin-bottom:14px"><div class="ed__f">
        <span class="mini">Sectie ${si + 1}</span>
        <input class="field" style="font-weight:500" data-sec="title" data-s="${si}" value="${esc(sec.title)}" placeholder="Titel van de sectie">
        <textarea class="field" rows="2" data-sec="note" data-s="${si}" placeholder="Toelichting (optioneel)">${esc(sec.note || "")}</textarea></div>
        <div class="ed__acts">${moveBtns("sec", si, null, secs.length)}</div></div>
      ${sec.questions.map((q, qi) => `<div class="ed"><div class="ed__f">
        <input class="field" data-q="label" data-s="${si}" data-qi="${qi}" value="${esc(q.label)}" placeholder="Vraag">
        <input class="field" data-q="hint" data-s="${si}" data-qi="${qi}" value="${esc(q.hint || "")}" placeholder="Hulptekst (optioneel)">
        <div class="ed__r">
          <select class="field" data-q="type" data-s="${si}" data-qi="${qi}"><option value="textarea" ${q.type !== "select" ? "selected" : ""}>Open antwoord (+ optionele chips)</option><option value="select" ${q.type === "select" ? "selected" : ""}>Keuzelijst</option></select>
          <label class="chk"><input type="checkbox" data-q="needed" data-s="${si}" data-qi="${qi}" ${q.needed ? "checked" : ""}> Nodig (weegt zwaar)</label>
        </div>
        ${q.type === "select"
          ? `<input class="field" data-q="options" data-s="${si}" data-qi="${qi}" value="${esc((q.options || []).join(", "))}" placeholder="Opties, gescheiden door komma's">`
          : `<input class="field" data-q="chips" data-s="${si}" data-qi="${qi}" value="${esc((q.chips || []).join(", "))}" placeholder="Chips / snelkeuzes, gescheiden door komma's (optioneel)">
             ${q.chips?.length ? `<div class="row"><label class="chk"><input type="checkbox" data-q="chipsMulti" data-s="${si}" data-qi="${qi}" ${q.chipsMulti ? "checked" : ""}> Meerdere chips kiezen</label>
               ${q.chipsMulti ? `<label class="chk">max <input class="field" style="width:70px;padding:6px 8px" type="number" min="1" max="12" data-q="chipsMax" data-s="${si}" data-qi="${qi}" value="${q.chipsMax || 5}"></label>` : ""}</div>` : ""}`}
        <span class="hint" style="margin:0">Sleutel: ${esc(q.id)}</span>
      </div><div class="ed__acts">${moveBtns("q", si, qi, sec.questions.length)}</div></div>`).join("")}
      <button class="btn ghost sm" style="margin-top:12px" data-be-act="add-q" data-s="${si}">+ Vraag toevoegen</button>
    </div>`).join("")
    + `<button class="btn ghost" style="margin-top:16px" data-be-act="add-sec">+ Sectie toevoegen</button>` + saveBar();
}
function moveBtns(kind, s, q, n) {
  const i = kind === "sec" ? s : q, d = `data-kind="${kind}" data-s="${s}" ${q != null ? `data-qi="${q}"` : ""}`;
  return `<button class="icon" title="Omhoog" data-be-act="up" ${d} ${i === 0 ? "disabled" : ""}>${ICON.up}</button>
    <button class="icon" title="Omlaag" data-be-act="down" ${d} ${i === n - 1 ? "disabled" : ""}>${ICON.down}</button>
    <button class="icon del" title="Verwijderen" data-be-act="del" ${d}>${ICON.del}</button>`;
}
function dirty() {
  if (!BE.dirty) { BE.dirty = true; const b = $("#beSave"); if (b) { b.disabled = false; b.textContent = "Opslaan"; } }
}
function redrawBE() { const y = scrollY; content.innerHTML = BE.kind === "steps" ? renderStepsBE() : renderListBE(); scrollTo(0, y); }
const split = (v) => v.split(",").map((x) => x.trim()).filter(Boolean);
function beInput(e) {
  const el = e.target; if (!BE) return;
  if (el.dataset.be) { BE.draft[+el.dataset.i][el.dataset.be] = el.value; dirty(); }
  else if (el.dataset.sec) { BE.draft[+el.dataset.s][el.dataset.sec] = el.value; dirty(); }
  else if (el.dataset.q && el.type !== "checkbox" && el.tagName !== "SELECT") {
    const q = BE.draft[+el.dataset.s].questions[+el.dataset.qi], k = el.dataset.q;
    q[k] = k === "chips" || k === "options" ? split(el.value) : k === "chipsMax" ? Math.max(1, parseInt(el.value, 10) || 5) : el.value;
    dirty();
  }
}
function beChange(e) {
  const el = e.target; if (!BE || !el.dataset.q) return;
  const q = BE.draft[+el.dataset.s].questions[+el.dataset.qi], k = el.dataset.q;
  if (el.type === "checkbox") q[k] = el.checked;
  else if (k === "type") { if (el.value === "select") { q.type = "select"; q.options = q.options?.length ? q.options : q.chips || []; delete q.chips; } else { delete q.type; } }
  else if (k === "chips") { dirty(); return redrawBE(); }
  else return;
  dirty(); redrawBE();
}
async function beAction(el) {
  const a = el.dataset.beAct; if (!a || !BE) return;
  const s = +el.dataset.s, list = el.dataset.kind === "q" ? BE.draft[s].questions : BE.draft, i = el.dataset.kind === "q" ? +el.dataset.qi : s;
  if (a === "add-q") BE.draft[s].questions.push({ id: `x_${uid().replace(/-/g, "").slice(0, 10)}`, label: "" });
  else if (a === "add-sec") BE.draft.push({ id: String(BE.draft.length + 1).padStart(2, "0"), title: `${String(BE.draft.length + 1).padStart(2, "0")} Nieuwe sectie`, questions: [] });
  else if (a === "up" || a === "down") { const j = i + (a === "up" ? -1 : 1); [list[i], list[j]] = [list[j], list[i]]; }
  else if (a === "del") {
    const what = el.dataset.kind === "q" ? "deze vraag" : "deze sectie met alle vragen";
    if (!(await ask(`${what[0].toUpperCase() + what.slice(1)} verwijderen? Antwoorden in bestaande intakes blijven bewaard.`, "Verwijderen"))) return;
    list.splice(i, 1);
  } else return;
  BE.dirty = true; redrawBE();
}
content.addEventListener("click", (e) => { const el = e.target.closest("[data-be-act]"); if (el && !el.dataset.act) beAction(el); });

async function saveBE(btn) {
  btn.disabled = true; btn.textContent = "Opslaan…";
  const next = clone(CFG);
  if (BE.kind === "steps") {
    next.steps = BE.draft.map((x) => ({ title: x.title.trim(), explain: x.explain.trim(), confirm: x.confirm.trim() }));
  } else {
    const bad = BE.draft.some((sec) => !sec.title.trim() || sec.questions.some((q) => !q.label.trim()));
    if (bad) { alert("Elke sectie en elke vraag heeft een tekst nodig."); btn.disabled = false; btn.textContent = "Opslaan"; return; }
    next.lists = { ...(next.lists || {}), [BE.kind]: clone(BE.draft) };
  }
  try {
    await api("saveConfig", { config: next });
    CFG = next; C.applyConfig(CFG); BE.dirty = false;
    btn.textContent = "✓ Opgeslagen";
  } catch (err) { alert("Opslaan mislukt: " + err.message); btn.disabled = false; btn.textContent = "Opslaan"; }
}
addEventListener("beforeunload", (e) => { if (BE?.dirty && location.hash.includes("-be")) { e.preventDefault(); e.returnValue = ""; } });

/* ================= Prijzen ================= */
let PR = null;
function prDraft(base, saved) {
  const d = { zichtbaar: saved && typeof saved.zichtbaar === "boolean" ? saved.zichtbaar : base.zichtbaar !== false, tijdelijkePrijs: saved ? saved.tijdelijkePrijs || "" : base.tijdelijkePrijs || "", services: {}, categories: {} };
  for (const sv of base.services) {
    const o = saved?.services?.[sv.slug] || {};
    d.services[sv.slug] = { from: o.from || sv.from || "", unit: o.unit || sv.unit || "", monthly: o.monthly ?? sv.monthly ?? "", note: o.note ?? sv.note ?? "" };
  }
  for (const c of base.categories) d.categories[c.id] = saved?.categories?.[c.id] || c.from || "";
  return d;
}
const money = (v) => { v = String(v || "").trim(); return /^\d[\d.,]*$/.test(v) ? "€" + v : v; };
function prLive(slug) {
  const p = PR.draft.services[slug], t = money(PR.draft.tijdelijkePrijs);
  const from = t || money(p.from), monthly = t ? "" : money(p.monthly);
  return `vanaf <b>${esc(from || "—")}</b> ${esc(p.unit)}${monthly ? ` + ${esc(monthly)}/mnd` : ""}`;
}
function renderPrices() {
  const d = PR.draft, t = money(d.tijdelijkePrijs);
  const cats = PR.base.categories.map((c) => {
    const list = PR.base.services.filter((sv) => sv.cat === c.id);
    return `<div class="card"><div class="card__h"><div><h3>${esc(c.name)}</h3><p>${list.length} diensten</p></div>
        <label class="pr-cat"><span class="mini">Vanaf op homepage</span><input class="field" data-pr="cat" data-id="${c.id}" value="${esc(d.categories[c.id])}" placeholder="${esc(c.from)}" ${t ? "disabled" : ""}></label></div>
      ${list.map((sv) => { const p = d.services[sv.slug]; return `<div class="ed pr-row"><div class="ed__f">
        <div class="pr-top"><b>${esc(sv.name)}</b><span class="pr-live" id="live-${sv.slug}">${prLive(sv.slug)}</span></div>
        <div class="pr-grid">
          <label><span class="mini">Vanaf</span><input class="field" data-pr="from" data-slug="${sv.slug}" value="${esc(p.from)}" placeholder="${esc(sv.from)}"></label>
          <label><span class="mini">Eenheid</span><input class="field" data-pr="unit" data-slug="${sv.slug}" value="${esc(p.unit)}" placeholder="eenmalig"></label>
          <label><span class="mini">Per maand</span><input class="field" data-pr="monthly" data-slug="${sv.slug}" value="${esc(p.monthly)}" placeholder="geen"></label>
        </div>
        <label><span class="mini">Notitie op de dienstpagina</span><input class="field" data-pr="note" data-slug="${sv.slug}" value="${esc(p.note)}" placeholder="Optioneel, bijv. exclusief advertentiebudget"></label>
      </div></div>`; }).join("")}</div>`;
  }).join("");
  return head("Website", "Prijzen", "Pas per dienst de prijs aan die op flyingimages.nl staat: op de dienstkaarten, de dienstpagina en de homepage. Na opslaan staat het binnen een minuut live.")
    + `<div class="card pr-temp${d.zichtbaar ? " on" : ""}"><div class="card__h"><div><h3>Prijzen op de website ${d.zichtbaar ? '<span class="badge">Zichtbaar</span>' : '<span class="badge navy">Verborgen</span>'}</h3>
        <p>${d.zichtbaar ? "De site toont de prijzen hieronder." : "De site toont overal \"Prijs op aanvraag\", ook bij de pakketten. Stel de prijzen rustig in en zet ze aan als ze kloppen."}</p></div></div>
      <div class="row"><button class="btn ${d.zichtbaar ? "ghost" : "dark"} sm" data-pr-act="vis">${d.zichtbaar ? "Prijzen verbergen" : "Prijzen tonen"}</button></div></div>`
    + `<div class="card pr-temp${t ? " on" : ""}"><div class="card__h"><div><h3>Tijdelijke prijs ${t ? '<span class="badge">Actief</span>' : '<span class="badge navy">Uit</span>'}</h3>
        <p>Staat hier een bedrag, dan toont de hele site overal "vanaf" dit bedrag, ook bij de pakketten. Maandbedragen worden dan verborgen. Leeg laten = de prijzen per dienst hieronder.</p></div></div>
      <div class="row"><input class="field" style="max-width:220px" data-pr="temp" value="${esc(d.tijdelijkePrijs)}" placeholder="bijv. €1975">
      ${t ? '<button class="btn ghost sm" data-pr-act="temp-off">Tijdelijke prijs uitzetten</button>' : ""}</div></div>`
    + cats
    + `<p class="hint">${PR.saved ? `Laatst opgeslagen: ${fmtDate(PR.savedAt)}` : "Nog niet opgeslagen in System. De site toont nu de prijzen uit de code."} Bedragen zonder €-teken krijgen die automatisch.</p>`
    + `<div class="sticky-save"><button class="btn ghost" data-pr-act="reset">Standaard herstellen</button><button class="btn dark" data-pr-act="save" id="prSave" ${PR.dirty ? "" : "disabled"}>${PR.dirty ? "Opslaan" : "Opgeslagen"}</button></div>`;
}
function prDirty() { if (!PR.dirty) { PR.dirty = true; const b = $("#prSave"); if (b) { b.disabled = false; b.textContent = "Opslaan"; } } }
function prRedraw() { const y = scrollY; content.innerHTML = renderPrices(); scrollTo(0, y); }
content.addEventListener("input", (e) => {
  const el = e.target, k = el.dataset.pr; if (!PR || !k) return;
  if (k === "temp") { const was = !!money(PR.draft.tijdelijkePrijs); PR.draft.tijdelijkePrijs = el.value; prDirty(); if (was !== !!money(el.value)) { prRedraw(); const f = $('[data-pr="temp"]'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); } else PR.base.services.forEach((sv) => { const l = $(`#live-${sv.slug}`); if (l) l.innerHTML = prLive(sv.slug); }); return; }
  if (k === "cat") PR.draft.categories[el.dataset.id] = el.value;
  else { PR.draft.services[el.dataset.slug][k] = el.value; const l = $(`#live-${el.dataset.slug}`); if (l) l.innerHTML = prLive(el.dataset.slug); }
  prDirty();
});
content.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-pr-act]"); if (!el || !PR) return;
  const a = el.dataset.prAct;
  if (a === "vis") { PR.draft.zichtbaar = !PR.draft.zichtbaar; PR.dirty = true; prRedraw(); }
  else if (a === "temp-off") { PR.draft.tijdelijkePrijs = ""; PR.dirty = true; prRedraw(); }
  else if (a === "reset") {
    if (!(await ask("Alle prijzen terugzetten naar de standaardprijzen uit de code? Dit wordt pas actief na opslaan."))) return;
    const vis = PR.draft.zichtbaar; PR.draft = prDraft(PR.base, null); PR.draft.tijdelijkePrijs = ""; PR.draft.zichtbaar = vis; PR.dirty = true; prRedraw();
  } else if (a === "save") {
    const d = PR.draft;
    const empty = PR.base.services.find((sv) => !money(d.services[sv.slug].from));
    if (d.zichtbaar && empty && !money(d.tijdelijkePrijs)) return alert(`Vul een vanaf-prijs in bij ${empty.name}.`);
    el.disabled = true; el.textContent = "Opslaan…";
    const prices = { zichtbaar: !!d.zichtbaar, tijdelijkePrijs: money(d.tijdelijkePrijs), categories: {}, services: {} };
    for (const [id, v] of Object.entries(d.categories)) prices.categories[id] = money(v);
    for (const [slug, p] of Object.entries(d.services)) prices.services[slug] = { from: money(p.from), unit: p.unit.trim(), monthly: money(p.monthly), note: p.note.trim() };
    try {
      const r = await api("savePrices", { prices });
      Object.assign(PR, { saved: true, savedAt: r.savedAt, dirty: false }); prRedraw();
      $("#prSave").textContent = "✓ Opgeslagen"; savedLabel("Prijzen opgeslagen");
    } catch (err) { alert("Opslaan mislukt: " + err.message); el.disabled = false; el.textContent = "Opslaan"; }
  }
});
addEventListener("beforeunload", (e) => { if (PR?.dirty && location.hash.startsWith("#prijzen")) { e.preventDefault(); e.returnValue = ""; } });

/* ================= Hero-afbeelding ================= */
let HERO = null;
const DEFAULT_HERO = "/img/drone-brug-1400.jpg";
const MAX_W = 2400, MAX_BYTES = 3e6;

function renderHero() {
  const h = HERO, [fx, fy] = h.focus.split(" ");
  const frame = (cls, label) => `<div class="hero-frame ${cls}"><div class="mini">${label}</div>
    <div class="hero-frame__img" data-hero-focus><img src="${esc(h.preview)}" alt="" style="object-position:${h.focus}"><span class="hero-dot" style="left:${fx};top:${fy}"></span></div></div>`;
  return head("Website", "Hero-afbeelding", "De grote achtergrondafbeelding bovenaan de homepage. Upload een eigen foto en klik in de voorbeelden op het belangrijkste punt, zodat dat op elk scherm in beeld blijft. Na opslaan staat het binnen een minuut live.")
    + `<div class="card"><div class="card__h"><div><h3>Huidige afbeelding ${h.saved ? '<span class="badge">Eigen foto</span>' : '<span class="badge navy">Standaard</span>'}</h3>
        <p>${h.file ? "Nog niet opgeslagen. Klik op Opslaan om hem live te zetten." : h.saved ? `Laatst opgeslagen: ${fmtDate(h.saved.savedAt)}` : "Nu staat de standaard dronefoto (brug) op de site."}</p></div></div>
      <div class="hero-frames">${frame("wide", "Desktop")}${frame("tall", "Mobiel")}</div>
      <p class="hint">Focuspunt: ${esc(h.focus)}. Klik in een voorbeeld om het te verplaatsen. De linkerkant wordt op desktop deels bedekt door de tekst.</p>
      <div class="row" style="margin-top:14px"><label class="btn ghost sm">${h.saved || h.file ? "Andere foto kiezen" : "Foto uploaden"}<input type="file" accept="image/jpeg,image/png,image/webp" hidden data-hero="file"></label>
      ${h.saved ? '<button class="btn ghost sm" data-hero-act="remove">Terug naar standaard</button>' : ""}</div>
      <p class="hint" id="heroMsg">Liggende foto, het liefst minimaal 2000 px breed. Hij wordt automatisch verkleind en gecomprimeerd.</p></div>
    <div class="sticky-save"><button class="btn dark" data-hero-act="save" id="heroSave" ${h.dirty && !h.busy ? "" : "disabled"}>${h.busy ? "Opslaan…" : h.dirty ? "Opslaan" : "Opgeslagen"}</button></div>`;
}
function heroRedraw() { const y = scrollY; content.innerHTML = renderHero(); scrollTo(0, y); }

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = async () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_W / img.naturalWidth);
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const toBlob = (type, q) => new Promise((r) => c.toBlob(r, type, q));
      let blob = null;
      for (const q of [0.82, 0.72, 0.6, 0.5]) {
        blob = await toBlob("image/webp", q);
        if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg", q); // browsers zonder webp-encoder
        if (blob && blob.size <= MAX_BYTES) break;
      }
      if (!blob || blob.size > MAX_BYTES) return reject(new Error("De foto blijft te groot, kies een kleinere."));
      resolve({ blob, w: c.width });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Dit bestand kan niet als afbeelding worden gelezen.")); };
    img.src = url;
  });
}

content.addEventListener("change", async (e) => {
  const el = e.target; if (!HERO || el.dataset.hero !== "file" || !el.files[0]) return;
  const msg = $("#heroMsg"); msg.textContent = "Foto verwerken…";
  try {
    const { blob, w } = await compressImage(el.files[0]);
    Object.assign(HERO, { file: blob, preview: URL.createObjectURL(blob), focus: "50% 50%", dirty: true });
    heroRedraw();
    $("#heroMsg").textContent = `Klaar: ${w} px breed, ${(blob.size / 1e6).toFixed(1).replace(".", ",")} MB.${w < 1600 ? " Let op: dit is vrij klein voor een hero, hij kan onscherp ogen op grote schermen." : ""}`;
  } catch (err) { msg.textContent = err.message; }
});
content.addEventListener("click", async (e) => {
  if (!HERO) return;
  const box = e.target.closest("[data-hero-focus]");
  if (box) {
    // Klikpunt omrekenen naar een punt op de foto zelf (object-fit: cover verschuift de foto)
    const r = box.getBoundingClientRect(), img = box.querySelector("img");
    const iw = img.naturalWidth || r.width, ih = img.naturalHeight || r.height, sc = Math.max(r.width / iw, r.height / ih);
    const dw = iw * sc, dh = ih * sc, [fx, fy] = HERO.focus.split(" ").map((v) => parseFloat(v) / 100);
    const pct = (click, size, disp, f) => Math.round(Math.min(100, Math.max(0, ((click - (size - disp) * f) / disp) * 100)));
    const x = pct(e.clientX - r.left, r.width, dw, fx), y = pct(e.clientY - r.top, r.height, dh, fy);
    HERO.focus = `${x}% ${y}%`; HERO.dirty = true; heroRedraw(); return;
  }
  const el = e.target.closest("[data-hero-act]"); if (!el) return;
  const a = el.dataset.heroAct;
  if (a === "remove") {
    if (!(await ask("De eigen foto verwijderen en de standaard dronefoto terugzetten op de homepage?", "Terugzetten"))) return;
    try { await api("removeHero"); HERO = { saved: null, focus: "50% 50%", preview: DEFAULT_HERO, file: null, dirty: false, busy: false }; heroRedraw(); savedLabel("Standaard hero teruggezet"); }
    catch (err) { alert("Terugzetten mislukt: " + err.message); }
  } else if (a === "save") {
    if (!HERO.file && !HERO.saved) return alert("Upload eerst een foto.");
    HERO.busy = true; heroRedraw();
    try {
      const data = { focus: HERO.focus };
      if (HERO.file) Object.assign(data, { contentType: HERO.file.type, dataBase64: await fileToBase64(HERO.file) });
      const { hero } = await api("saveHero", data);
      Object.assign(HERO, { saved: hero, file: null, dirty: false, busy: false });
      heroRedraw(); $("#heroSave").textContent = "✓ Opgeslagen"; savedLabel("Hero-afbeelding opgeslagen");
    } catch (err) { HERO.busy = false; heroRedraw(); alert("Opslaan mislukt: " + err.message); }
  }
});
addEventListener("beforeunload", (e) => { if (HERO?.dirty && location.hash.startsWith("#hero")) { e.preventDefault(); e.returnValue = ""; } });

/* ================= start ================= */
(async function init() {
  if (!token || !(await api("check").then((r) => r.ok).catch(() => false))) return lock();
  await loadConfig();
  render();
})();

// Flying Images /system backend — Vercel serverless function.
// Alle database- en opslagtoegang loopt hier, met de service role key server-side.
// Benodigde environment variables (Vercel → Project → Settings → Environment Variables):
//   SUPABASE_URL               bijv. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service role key (NOOIT in de frontend)
//   APP_PASSPHRASE             de toegangscode voor /system
import crypto from "node:crypto";

const BUCKET = "referenties";
const CONFIG_PATH = "config/system-config.json";
const PRICES_PATH = "config/prices.json";
const SITE_PATH = "config/site.json";
const FOCUS = /^\d{1,3}% \d{1,3}%$/;
const SESSION_DAYS = 7;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COLS = "id,bedrijfsnaam,workflow_type,huidige_stap,status,bijgewerkt_op,aangemaakt_op";

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function env(name) {
  const v = process.env[name];
  if (!v) throw new HttpError(500, `${name} is niet ingesteld op de server.`);
  return v;
}
const secret = () => process.env.APP_PASSPHRASE_V2 || env("APP_PASSPHRASE");
const sign = (payload) => crypto.createHmac("sha256", secret()).update(payload).digest("hex");

function createToken() {
  const payload = String(Date.now() + SESSION_DAYS * 864e5);
  return `${payload}.${sign(payload)}`;
}
function validToken(token) {
  if (typeof token !== "string") return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !(Number(payload) > Date.now())) return false;
  const a = Buffer.from(sign(payload)), b = Buffer.from(sig);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function requireSession(body) {
  if (!validToken(body.token)) throw new HttpError(401, "Sessie verlopen. Voer de toegangscode opnieuw in.");
}
function requireId(id) {
  if (!UUID.test(String(id || ""))) throw new HttpError(400, "Ongeldig intake-id.");
  return id;
}

async function sb(path, { method = "GET", body, headers = {}, raw = false } = {}) {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(env("SUPABASE_URL").replace(/\/$/, "") + path, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(body !== undefined && !raw ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new HttpError(res.status >= 500 ? 502 : 400, (data && (data.message || data.error)) || `Supabase-fout (${res.status})`);
    err.upstream = res.status;
    throw err;
  }
  return data;
}

const rest = (q, opts) => sb(`/rest/v1/${q}`, opts);

const actions = {
  async login(b) {
    const expected = process.env.APP_PASSPHRASE_V2 || env("APP_PASSPHRASE");
    const given = String(b.passphrase || "").trim();
    const ok = given.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
    if (!ok) throw new HttpError(401, "Onjuiste toegangscode.");
    return { token: createToken() };
  },

  async check(b) { return { ok: validToken(b.token) }; },

  async list(b) {
    requireSession(b);
    const filter = b.status === "afgerond" ? "status=eq.afgerond" : "status=neq.afgerond";
    return rest(`intakes?select=${COLS}&${filter}&order=bijgewerkt_op.desc`);
  },

  async get(b) {
    requireSession(b);
    const rows = await rest(`intakes?select=${COLS},antwoorden&id=eq.${requireId(b.id)}`);
    if (!rows?.length) throw new HttpError(404, "Intake niet gevonden.");
    return rows[0];
  },

  async create(b) {
    requireSession(b);
    const row = { workflow_type: "gesprek", bedrijfsnaam: String(b.bedrijfsnaam || ""), huidige_stap: 1 };
    // Koppel aan de dienst als de diensten-tabel bestaat (optioneel).
    try {
      const d = await rest(`diensten?select=id&slug=eq.${encodeURIComponent(b.dienst || "custom-website")}`);
      if (d?.[0]?.id) row.dienst_id = d[0].id;
    } catch { /* tabel bestaat niet: zonder dienst opslaan */ }
    const created = await rest(`intakes?select=${COLS},antwoorden`, {
      method: "POST", body: row, headers: { Prefer: "return=representation" },
    });
    return created[0];
  },

  async save(b) {
    requireSession(b);
    const stap = Math.max(1, parseInt(b.huidige_stap, 10) || 1);
    await rest(`intakes?id=eq.${requireId(b.id)}`, {
      method: "PATCH",
      body: {
        bedrijfsnaam: String(b.bedrijfsnaam || ""),
        huidige_stap: stap,
        antwoorden: b.state && typeof b.state === "object" ? b.state : {},
        stijl: b.stijl && typeof b.stijl === "object" ? b.stijl : {},
        paginas: Array.isArray(b.paginas) ? b.paginas : [],
      },
    });
    return { ok: true, savedAt: new Date().toISOString() };
  },

  async status(b) {
    requireSession(b);
    const status = b.status === "afgerond" ? "afgerond" : "in behandeling";
    await rest(`intakes?id=eq.${requireId(b.id)}`, { method: "PATCH", body: { status } });
    return { ok: true };
  },

  async delete(b) {
    requireSession(b);
    await rest(`intakes?id=eq.${requireId(b.id)}`, { method: "DELETE" });
    return { ok: true };
  },

  async upload(b) {
    requireSession(b);
    const intakeId = requireId(b.intakeId);
    const slot = Math.min(2, Math.max(0, parseInt(b.slot, 10) || 0));
    const prefix = String(b.prefix || "ref").replace(/[^a-z0-9]/gi, "") || "ref";
    const ext = String(b.extension || "png").replace(/[^a-z0-9]/gi, "") || "png";
    const type = /^image\/[a-z0-9.+-]+$/i.test(b.contentType || "") ? b.contentType : "image/png";
    const bytes = Buffer.from(String(b.dataBase64 || ""), "base64");
    if (!bytes.length) throw new HttpError(400, "Leeg bestand.");
    const path = `${intakeId}/${prefix}-${slot + 1}-${Date.now()}.${ext}`;
    await sb(`/storage/v1/object/${BUCKET}/${path}`, {
      method: "POST", body: bytes, raw: true, headers: { "Content-Type": type, "x-upsert": "true" },
    });
    return { path };
  },

  async sign(b) {
    requireSession(b);
    const paths = (Array.isArray(b.paths) ? b.paths : []).filter((p) => typeof p === "string" && UUID.test(p.split("/")[0]));
    if (!paths.length) return { urls: [] };
    const signed = await sb(`/storage/v1/object/sign/${BUCKET}`, { method: "POST", body: { expiresIn: 3600, paths } });
    const base = env("SUPABASE_URL").replace(/\/$/, "") + "/storage/v1";
    return { urls: (signed || []).map((s) => (s.signedURL ? base + s.signedURL : "")) };
  },

  async unupload(b) {
    requireSession(b);
    const path = String(b.path || "");
    if (!UUID.test(path.split("/")[0])) throw new HttpError(400, "Ongeldig pad.");
    await sb(`/storage/v1/object/${BUCKET}`, { method: "DELETE", body: { prefixes: [path] } });
    return { ok: true };
  },

  async getConfig(b) {
    requireSession(b);
    try {
      return { config: await sb(`/storage/v1/object/authenticated/${BUCKET}/${CONFIG_PATH}`) };
    } catch (e) {
      if (e.upstream === 400 || e.upstream === 404) return { config: null };
      throw e;
    }
  },

  async getPrices(b) {
    requireSession(b);
    try {
      return { prices: await sb(`/storage/v1/object/authenticated/${BUCKET}/${PRICES_PATH}`) };
    } catch (e) {
      if (e.upstream === 400 || e.upstream === 404) return { prices: null };
      throw e;
    }
  },

  async savePrices(b) {
    requireSession(b);
    const p = b.prices;
    if (!p || typeof p !== "object") throw new HttpError(400, "Ongeldige prijzen.");
    const txt = (v, n = 80) => String(v ?? "").trim().slice(0, n);
    const slug = /^[a-z0-9-]{1,60}$/;
    const services = {}, categories = {};
    for (const [k, v] of Object.entries(p.services || {})) {
      if (!slug.test(k) || !v || typeof v !== "object") continue;
      services[k] = { from: txt(v.from, 20), unit: txt(v.unit, 40), monthly: txt(v.monthly, 20), note: txt(v.note, 200), tonen: v.tonen !== false };
    }
    for (const [k, v] of Object.entries(p.categories || {})) if (slug.test(k)) categories[k] = txt(v, 20);
    const packages = {};
    for (const [k, v] of Object.entries(p.packages || {})) if (slug.test(k)) packages[k] = v !== false;
    const clean = { zichtbaar: p.zichtbaar === true, tijdelijkePrijs: txt(p.tijdelijkePrijs, 20), services, categories, packages, savedAt: new Date().toISOString() };
    await sb(`/storage/v1/object/${BUCKET}/${PRICES_PATH}`, {
      method: "POST", body: Buffer.from(JSON.stringify(clean)), raw: true,
      headers: { "Content-Type": "application/json", "x-upsert": "true", "cache-control": "no-cache" },
    });
    return { ok: true, savedAt: clean.savedAt };
  },

  async saveConfig(b) {
    requireSession(b);
    if (!b.config || typeof b.config !== "object") throw new HttpError(400, "Ongeldige configuratie.");
    const body = Buffer.from(JSON.stringify({ ...b.config, savedAt: new Date().toISOString() }));
    await sb(`/storage/v1/object/${BUCKET}/${CONFIG_PATH}`, {
      method: "POST", body, raw: true, headers: { "Content-Type": "application/json", "x-upsert": "true", "cache-control": "no-cache" },
    });
    return { ok: true };
  },

  /* ---- Website → Hero-afbeelding ---- */
  async getSite(b) {
    requireSession(b);
    return { site: await readSite() };
  },

  async saveHero(b) {
    requireSession(b);
    const site = (await readSite()) || {};
    const old = site.hero?.path;
    const focus = FOCUS.test(String(b.focus || "")) ? b.focus : "50% 50%";
    let path = old;
    if (b.dataBase64) {
      const type = /^image\/(webp|jpeg|png)$/i.test(b.contentType || "") ? b.contentType : "image/webp";
      const bytes = Buffer.from(String(b.dataBase64), "base64");
      if (!bytes.length) throw new HttpError(400, "Leeg bestand.");
      path = `site/hero-${Date.now()}.${type.split("/")[1].replace("jpeg", "jpg")}`;
      await sb(`/storage/v1/object/${BUCKET}/${path}`, {
        method: "POST", body: bytes, raw: true, headers: { "Content-Type": type, "x-upsert": "true" },
      });
    }
    if (!path) throw new HttpError(400, "Upload eerst een afbeelding.");
    site.hero = { path, focus, savedAt: new Date().toISOString() };
    await writeSite(site);
    if (old && old !== path) await removeFile(old);
    return { hero: site.hero };
  },

  async removeHero(b) {
    requireSession(b);
    const site = (await readSite()) || {};
    const old = site.hero?.path;
    delete site.hero;
    await writeSite(site);
    if (old) await removeFile(old);
    return { ok: true };
  },
};

async function readSite() {
  try { return await sb(`/storage/v1/object/authenticated/${BUCKET}/${SITE_PATH}`); }
  catch (e) { if (e.upstream === 400 || e.upstream === 404) return null; throw e; }
}
async function writeSite(site) {
  await sb(`/storage/v1/object/${BUCKET}/${SITE_PATH}`, {
    method: "POST", body: Buffer.from(JSON.stringify(site)), raw: true,
    headers: { "Content-Type": "application/json", "x-upsert": "true", "cache-control": "no-cache" },
  });
}
async function removeFile(path) {
  if (!/^site\/hero-\d+\.(webp|jpg|png)$/.test(path)) return;
  try { await sb(`/storage/v1/object/${BUCKET}`, { method: "DELETE", body: { prefixes: [path] } }); } catch {}
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Alleen POST." });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const fn = actions[body.action];
  if (!fn) return res.status(400).json({ error: "Onbekende actie." });
  try {
    return res.status(200).json(await fn(body));
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error("[system]", body.action, e);
    return res.status(status).json({ error: status >= 500 && !e.status ? "Serverfout." : e.message });
  }
}


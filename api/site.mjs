// Publieke site-instellingen voor flyingimages.nl — alleen-lezen.
// GET /api/site            → { hero: { src, focus } | null }   (ingesteld via /system → Hero-afbeelding)
// GET /api/site?img=hero&v= → de hero-afbeelding zelf (lang gecachet; v wisselt bij elke nieuwe upload)
const BUCKET = "referenties";
const SITE_PATH = "config/site.json";

const base = () => (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const auth = () => { const k = process.env.SUPABASE_SERVICE_ROLE_KEY; return { apikey: k, Authorization: `Bearer ${k}` }; };

async function readSite() {
  const r = await fetch(`${base()}/storage/v1/object/authenticated/${BUCKET}/${SITE_PATH}`, { headers: auth() });
  return r.ok ? r.json() : null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Alleen GET." });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    return res.status(200).json({ hero: null });
  }
  try {
    const site = await readSite();
    const hero = site?.hero?.path ? site.hero : null;

    if (req.query?.img === "hero") {
      if (!hero) return res.status(404).end();
      const r = await fetch(`${base()}/storage/v1/object/authenticated/${BUCKET}/${hero.path}`, { headers: auth() });
      if (!r.ok) return res.status(404).end();
      res.setHeader("Content-Type", r.headers.get("content-type") || "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.status(200).send(Buffer.from(await r.arrayBuffer()));
    }

    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
    if (!hero) return res.status(200).json({ hero: null });
    const v = encodeURIComponent(hero.savedAt || hero.path);
    return res.status(200).json({ hero: { src: `/api/site?img=hero&v=${v}`, focus: hero.focus || "50% 50%" } });
  } catch {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    return req.query?.img ? res.status(404).end() : res.status(200).json({ hero: null });
  }
}

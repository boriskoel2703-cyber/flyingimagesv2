// Publieke prijzen voor flyingimages.nl — alleen-lezen.
// Leest config/prices.json (opgeslagen via /system → Prijzen) uit de Supabase-bucket.
const BUCKET = "referenties";
const PRICES_PATH = "config/prices.json";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Alleen GET." });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
  if (!url || !key) return res.status(200).json({ config: null });
  try {
    const r = await fetch(`${url.replace(/\/$/, "")}/storage/v1/object/authenticated/${BUCKET}/${PRICES_PATH}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!r.ok) return res.status(200).json({ config: null });
    const c = await r.json();
    return res.status(200).json({ config: { zichtbaar: typeof c.zichtbaar === 'boolean' ? c.zichtbaar : null, tijdelijkePrijs: c.tijdelijkePrijs || "", services: c.services || {}, categories: c.categories || {}, packages: c.packages || {} } });
  } catch {
    return res.status(200).json({ config: null });
  }
}

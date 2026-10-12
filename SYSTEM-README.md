# /system — intern dashboard Flying Images

De intake-workflow (Custom website, klant zónder website) draait nu in de eigen website-repo op flyingimages.nl/system. Dezelfde Supabase-database als de oude intake-tool, dus alle bestaande intakes staan er meteen in.

## Bestanden in de repo

```
api/system.mjs          serverfunctie (Vercel) — praat met Supabase
src/system/index.html       het dashboard
src/system/app.js           schermen, stepper, Workflow BE, Vragenlijst BE
src/system/intake-core.js   vragenlijsten + prompt-opbouw (overgenomen uit de intake-tool)
src/system/system.css       huisstijl
```

- `api/` hoort in de **root** van de repo (naast package.json). Vercel maakt er automatisch `/api/system` van.
- `src/system/` wordt door `src/build.mjs` naar `dist/system/` gekopieerd.
- `robots.txt` blokkeert `/system`; het staat niet in de sitemap.

## Environment variables in Vercel

Project → Settings → Environment Variables (Production én Preview):

| Naam | Waarde |
| --- | --- |
| `SUPABASE_URL` | `https://glkkkceudhgnoftmtfoq.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key van dat Supabase-project |
| `APP_PASSPHRASE` | de toegangscode (zelfde als in de intake-tool) |

De service role key staat alleen op de server, nooit in de browser. Na het toevoegen: opnieuw deployen.

## Wat waar wordt opgeslagen

- Intakes: tabel `intakes` (zelfde tabel als de oude tool).
- Logo's en referentie-screenshots: storage-bucket `referenties`.
- Aanpassingen uit Workflow BE en Vragenlijst BE: bestand `config/system-config.json` in dezelfde bucket. Geen nieuwe tabellen nodig.

## Beveiliging

- Toegang alleen met de toegangscode; daarna een ondertekend sessietoken (7 dagen).
- Alle database-toegang loopt via `api/system.mjs`, die het token eerst controleert.

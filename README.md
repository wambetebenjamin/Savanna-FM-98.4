# Savanna FM 98.4

A Next.js 14 App Router experience for a Nairobi radio brand. The site pairs an always-visible live player with show discovery, presenter profiles, editorial updates, podcast cards, a weekly chart, events, sponsorship information, and a direct WhatsApp song-request flow.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Connect station services

The UI and JSON API routes are ready to connect to station-owned services. Add credentials only in local/Vercel environment settings; never commit them.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_STREAM_URL` | Browser audio URL for the HTML5 live player (MP3/AAC/Icecast, or browser-compatible HLS). |
| `STREAM_URL` | Server-side stream URL used to infer an Icecast `status-json.xsl` endpoint. |
| `STREAM_METADATA_URL` | Optional JSON metadata endpoint for `/api/now-playing`; supports common `title`, `artist`, `show`, and Icecast response shapes. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel KV credentials. `/api/schedule` reads `savanna:schedule`; `/api/request` saves request records to `savanna:song-requests` (latest 500). |
| `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Cloud API sender credentials used by `/api/request` after storage succeeds. |
| `WHATSAPP_RECIPIENT` | WhatsApp destination in international digits; defaults to `254112272061`. |
| `NEWS_FEED_URL` | Optional JSON endpoint returning a news array or `{ "articles": [] }`; ISR revalidates every 120 seconds. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for SEO metadata, JSON-LD, sitemap, and robots. |

Without a configured live URL, the player stays in a clear ready state instead of streaming a third-party station. Without Vercel KV credentials, song requests fall back to a pre-filled WhatsApp message and the API returns `503`; no request is falsely reported as saved. Add `audioUrl` values to `data/podcasts.json` to enable episode playback.

## API routes

- `GET /api/now-playing` — reads the configured metadata endpoint / Icecast status, then falls back to station metadata.
- `GET /api/schedule` — returns a Vercel KV schedule when present, otherwise `data/schedule.json`.
- `GET /api/news` — optionally reads `NEWS_FEED_URL`; static editorial data is the ISR fallback.
- `GET /api/podcasts` — returns the on-demand episode catalogue.
- `POST /api/request` — validates a request, writes it to KV, and optionally sends a WhatsApp Cloud API notification.
- `POST /api/subscribe` — validates a newsletter email and stores it in KV.

## Content and image notes

The schedule, news, and podcast data in `data/` and the presenter/chart/event content in `lib/content.ts` are sample editorial content for this concept build. Replace the sample show lineup, chart, news, and event details with station-approved information before launch. Podcast playback needs real episode URLs and live playback needs the station's authorized stream URL.

The photography is real stock imagery sourced from Pexels and Unsplash (not AI-generated):

- Pexels — [woman singing in a music studio](https://www.pexels.com/photo/photo-of-woman-singing-in-music-studio-2531728/)
- Pexels — [podcast men search](https://www.pexels.com/search/podcast%20men/) and [radio presenter search](https://www.pexels.com/search/radio%20presenter/)
- Unsplash — [concert crowd](https://unsplash.com/photos/a-crowd-of-people-holding-up-their-cell-phones-qbTfmtdeOvQ)

Review the source platform licenses and secure station-approved presenter portraits before a production campaign. The sample portrait/name pairings are illustrative, not claims about actual Savanna FM staff.

## Build and checks

```bash
npm run typecheck
npm run lint
npm run build
```

The media-kit download is an indicative text rate card; confirm inventory and pricing with the station before use. A lightweight service worker caches the station shell for offline revisit; live streams and API responses stay network-only.

## Security note

This build uses Next.js 14.2.35 to match the requested stack. Current `npm audit --omit=dev` data still flags a critical Next.js advisory; npm lists the fix on a major Next.js 16 upgrade. Keep the framework version aligned with the requested prototype, but schedule that major upgrade (and re-run all checks) before production deployment.

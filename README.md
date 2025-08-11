# WO/WNSC PWA Dashboard (Next.js + TS)

Offline-first PWA for single-user summaries across **Oman Oil (WO)** and **NAMA (WNSC)**.
- ✅ First visit **online** to seed and precache → then **fully offline**
- ✅ A2HS (Add to Home Screen) on iOS
- ✅ IndexedDB (Dexie), charts (recharts), exports (CSV/PDF/PNG), i18n (ar/en, RTL)
- ✅ Works on **Vercel** (no custom server), CI with GitHub Actions

## Quick start (local)
```bash
npm i
npm run dev
```
Open http://localhost:3000 → `/dashboard`.

## Deploy to Vercel
1. Push this repo to **GitHub**.
2. In **Vercel**, *Add New Project* → *Import* your repo.
3. Framework: auto-detected (Next.js). Build command: `next build`.
4. No env vars needed. Deploy.

## PWA / iOS A2HS
- Visit the app online once (to seed + precache).
- iOS Safari: **Share** → **Add to Home Screen**. Launch from the icon to get standalone mode.

## Data model
- `OMAN_OIL` (WO): `refNumber*`, `date*`, `status(Open|WaitForApproval|Approved|Completed)`, `description?`
- `NAMA` (WNSC): `refNumber*`, `startDate*`, `endDate?` → `durationDays` auto; `notes?`
- Common: `id`, `tags[]`, `createdAt`, `updatedAt`

## Feature flags
- **Status Colors**: *Settings → Status Colors Mode*. Semantic (default) ↔ Monochrome blues.

## Exports
- CSV/PDF/PNG exports work offline (client-side).

## Structure
- `/dashboard` (default landing)
- `/wo` CRUD
- `/wnsc` CRUD
- `/settings` (i18n, flags, import/export)
- `/offline` (fallback)

## Notes
- Asia/Muscat timezone used for aggregations.
- `next-pwa` uses `public/offline.html` as document fallback.

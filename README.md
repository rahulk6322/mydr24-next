# MyDR24: Next.js website

Next.js 16 (App Router) + React 19 + TypeScript port of the MyDR24 design. It uses the same design system (dark-first tokens, 12/8/4-column grid, components and states) and adds real, dynamic functionality.

```bash
cp .env.example .env.local   # set ADMIN_PASSWORD to enable /admin/leads
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```
Requires Node ≥ 20.9. **Hosting:** see [DEPLOY.md](DEPLOY.md) (Vercel or VPS/Docker).

## What's dynamic
| Feature | How |
|---|---|
| **Lead capture** | Server Action (`useActionState`) with shared client/server validation, honeypot, per-IP rate limit (5 per 10 min). Works without JS. |
| **Lead storage** | `src/lib/leads-store.ts`: JSON file (`LEADS_FILE`), in-memory fallback, optional `LEADS_WEBHOOK_URL` (CRM / Sheets / Slack). |
| **Admin** | `/admin/leads` table + CSV/JSON export (`/api/admin/leads`). Basic auth via `src/proxy.ts`, re-checked in each route. |
| **Doctor availability** | Computed per request from IST shift hours; filter by speciality, language or online-now at `/doctors?…` (URL-driven, auto-refreshes every 60s). |
| **Live trust strip** | Hero figures from `/api/stats`, polled every 30s. |
| **Bilingual (EN / हिन्दी)** | Locale cookie set by a Server Action. Every page renders server-side in the chosen language (About/Legal body copy is English only). |
| **Services** | `/services` plus dynamic `/services/[slug]` detail pages with related doctors. |
| **SEO** | Per-page metadata, `sitemap.xml`, `robots.txt`, web manifest, MedicalOrganization JSON-LD. |

## REST API
| Endpoint | |
|---|---|
| `POST /api/leads` | `{ name, mobile, city, language, service, consent: true }` → `201 { ref }` · `422 { fields }` · `429` |
| `GET /api/doctors?speciality=&language=&online=1` | Doctors with live status |
| `GET /api/stats` | Live stats |
| `GET /api/health` | Health check |
| `GET /api/admin/leads[?format=csv]` | Leads (Basic auth) |

## Structure
```
src/app/          routes, actions.ts (Server Actions), api/*, sitemap/robots/manifest
src/components/   header (mega-menu, full-screen mobile menu), action-bar, footer, lead-form,
                  cards (Service/Doctor/Testimonial/Trust), interactive (Carousel, Accordion, CTAs,
                  LiveTrustStrip), ui-provider (SOS dialog, booking bottom sheet), home/* sections
src/data/         services, doctors, FAQs, testimonials, languages (EN + HI)
src/i18n/         dictionaries (hi is typed against en), cookie-based locale
src/lib/          validation, availability, leads-store, rate-limit, admin-auth, site config
src/styles/       tokens.css (dark + light), base, components, pages
```

## Production notes
- **Read-only hosts (e.g. Vercel):** the JSON file can't persist. Set `LEADS_WEBHOOK_URL` or swap `saveLead()`/`listLeads()` for a database.
- **Rate limiting** is per instance (in memory). Use Redis/Upstash when running several instances.
- **Simulated data:** doctor profiles, availability and stats are clearly marked. Replace `src/data/doctors.ts` and `src/lib/availability.ts` with real sources.
- **Placeholders to replace:** helpline number, emails, store URLs (`.env`), the QR code, store badge artwork, the elderly-care illustration, leadership profiles, legal text and compliance wording.

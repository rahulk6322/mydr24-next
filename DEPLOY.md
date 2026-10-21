# Hosting MyDR24

**Step 0, before any option:** this project has never been built (the sandbox it was written in couldn't install packages). Build it once on your own computer:

```bash
cd mydr24-next
npm install          # creates package-lock.json: commit it
npm run build        # must finish without errors
npm start            # check http://localhost:3000
```

If the build shows errors, fix them first (or paste them to Kiro).

## Which option?

| | **A. Vercel** (recommended) | **B. Your own server (VPS + Docker)** |
|---|---|---|
| Effort | ~15 minutes, no server to manage | ~1 hour, you maintain the server |
| Cost | Pro plan: $20/month per member (Hobby is free but not for commercial sites) | VPS from ~₹500–1,500/month |
| Where leads go | A Google Sheet (via webhook) | The server's disk; `/admin/leads` works |
| Updates | Automatic on every `git push` | `git pull` + rebuild |

---

## Option A: Vercel

1. **Push the code to GitHub** (a private repo is fine).
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, choose the repo and click **Import**. Vercel detects Next.js automatically.
   - If the repo contains other folders, set **Root Directory** to `mydr24-next`.
3. **Environment variables** (Project → Settings → Environment Variables), copied from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.in`
   - `NEXT_PUBLIC_HELPLINE_TEL`, `NEXT_PUBLIC_HELPLINE_DISPLAY`, emails, store links: real values
   - `LEADS_WEBHOOK_URL`: see "Leads on Vercel" below (**required**, or leads are lost)
   - `ADMIN_PASSWORD`: only needed if you keep the admin page
4. Click **Deploy**. You get a `*.vercel.app` URL in a couple of minutes.
5. **Region:** `vercel.json` already pins server code to Mumbai (`bom1`), close to Indian users.
6. **Custom domain:** Settings → Domains → add `mydr24.in` and `www.mydr24.in`. At your domain registrar (GoDaddy, Hostinger, etc.) add the DNS records Vercel shows, typically an **A** record `76.76.21.21` for the root and a **CNAME** `cname.vercel-dns.com` for `www`. HTTPS is issued automatically.

After that, every `git push` to `main` redeploys, and other branches get preview URLs.

### Leads on Vercel (important)
Vercel's servers can't keep files, so leads are **not** stored on disk there, and `/admin/leads` will be mostly empty. Send every lead to a Google Sheet instead:

1. Create a Google Sheet → **Extensions → Apps Script**. Paste `deploy/google-sheets-webhook.gs` and change `SECRET` to a long random string.
2. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the URL.
3. Set `LEADS_WEBHOOK_URL` on Vercel to `https://script.google.com/macros/s/…/exec?key=YOUR_SECRET` and redeploy.
4. Submit a test lead on the live site and confirm a row appears.

(Later you can replace this with a database such as Supabase or Neon Postgres by rewriting `saveLead()`/`listLeads()` in `src/lib/leads-store.ts`.)

---

## Option B: VPS with Docker

Use any Ubuntu VPS in Mumbai (AWS Lightsail, DigitalOcean BLR, Hostinger VPS…), 1 GB RAM or more, with Docker installed.

```bash
git clone <your-repo-url> && cd mydr24-next

docker build -t mydr24 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://mydr24.in \
  --build-arg NEXT_PUBLIC_HELPLINE_TEL=+91XXXXXXXXXX \
  --build-arg "NEXT_PUBLIC_HELPLINE_DISPLAY=+91 XXXXX XXXXX" \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=care@mydr24.in .

docker run -d --name mydr24 --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -v mydr24-data:/app/.data \
  -e ADMIN_PASSWORD='a-long-password' \
  mydr24
```

Leads are saved in the `mydr24-data` volume, so they survive restarts and updates. **Back it up**, because it contains personal data.

**HTTPS with Caddy** (`sudo apt install caddy`), in `/etc/caddy/Caddyfile`:

```
mydr24.in, www.mydr24.in {
    reverse_proxy 127.0.0.1:3000
}
```

Then run `sudo systemctl reload caddy`. Point the domain's **A** record at the server's IP; Caddy gets the certificate itself.

**To update:** `git pull`, rebuild the image, then `docker rm -f mydr24` and run the same `docker run` command again.

---

## Go-live checklist
- [ ] Real helpline number, emails and store links set (env vars)
- [ ] A test lead reaches the Google Sheet (A) or `/admin/leads` (B)
- [ ] Emergency numbers 112 / 108 tap-to-call from a phone
- [ ] Hindi toggle, light/dark toggle, SOS dialog and Book sheet work on a real phone
- [ ] Placeholders replaced: QR code, store badges, illustration, leadership, legal text, compliance wording signed off
- [ ] Sample doctors/stats replaced with real data, or left clearly marked "illustrative"
- [ ] `/admin` is protected (strong `ADMIN_PASSWORD`) or unused

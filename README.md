# NEPA-PRO — Installable PWA

A fully self-contained iOS-native property-services app that installs to iPhone and
Android home screens, works offline after first visit, and adapts to light/dark mode.

**Stack:** single-file HTML + CSS + JS · Service worker for offline · Web app manifest · No backend required.

---

## What's in this folder

```
nepa-pro-pwa-deploy/
├── index.html               # The entire app (single file)
├── manifest.json            # PWA manifest (Android / Chrome install)
├── sw.js                    # Service worker (offline + caching)
├── offline.html             # Fallback page when offline with no cache
├── icons/
│   ├── favicon.png
│   ├── icon-apple-180.png   # Apple touch icon (iPhone home screen)
│   ├── icon-192.png         # Android, manifest, standard
│   ├── icon-512.png         # Android splash screen
│   ├── icon-maskable-512.png# Android adaptive icon (80% safe zone)
│   └── icon-1024.png        # Master
├── .github/workflows/
│   └── deploy.yml           # Auto-deploy to GitHub Pages on push
├── .nojekyll                # Tells GitHub Pages to serve as-is
└── README.md                # This file
```

---

## Deploy to GitHub Pages

### Option A — Automatic (recommended)

```bash
cd nepa-pro-pwa-deploy
git init -b main
git add .
git commit -m "Initial deploy"
git remote add origin https://github.com/SolarMason/NEPA-PRO.git
git push -u origin main --force
```

Then on GitHub:
1. Go to **Settings → Pages**
2. Under **Source**, pick **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will publish the site
4. The site will be live at `https://solarmason.github.io/NEPA-PRO/`

### Option B — Branch deploy (simpler, no Actions)

1. Push to the `main` branch
2. In **Settings → Pages**, set Source to **Deploy from a branch** → `main` → `/ (root)`
3. Wait ~1 minute for first deploy

**Important:** The service worker requires HTTPS, which GitHub Pages provides automatically.
Local `file://` preview shows the app but can't install (SW + manifest require a real origin).

---

## Test locally before deploying

Easiest way (needs Python 3):

```bash
cd nepa-pro-pwa-deploy
python3 -m http.server 8000
```

Then open **http://localhost:8000** — you'll see the install prompt in Chrome, and
DevTools → Application → Service Workers will show it registered.

---

## Install on devices

### iPhone / iPad (Safari)
1. Open the published URL in Safari (Chrome on iOS won't install PWAs)
2. Tap the **Share** icon at the bottom
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**
5. The NEPA-PRO shield icon appears on the home screen — tap to launch full-screen

The in-app install banner (shown once) walks users through this same flow.

### Android (Chrome, Edge, Samsung Internet)
1. Open the published URL
2. Either wait 2–3 seconds for the **"Install"** banner to slide up from the bottom,
   or use the browser menu → **Install app**
3. Confirm **Install**
4. The app appears in the launcher

### Desktop (Chrome, Edge)
1. Open the URL
2. Click the **install icon** (⬇ in a box) on the right side of the address bar
3. The app opens in its own window with no browser chrome

---

## Offline behavior

On the **first** visit with a connection, the service worker caches:
- The full `index.html`
- `manifest.json`, `sw.js`, `offline.html`
- All PWA icons
- External images (Unsplash hero photos, the CDN logo) — cached as they load

On subsequent visits, everything works offline except live-loading new images
the user hasn't seen yet (the service worker serves what's cached).

If the user launches the app offline on their *very first visit*, they see
`offline.html` prompting them to reconnect.

---

## Customize

### Change the email address that receives contact form submissions
In `index.html`, search for `mailto:service@nepa-pro.com` (one occurrence).
Replace with your target address.

### Swap mailto for a real server-side email endpoint
Replace the `window.location.href = mailto` line in the contact submit handler
with a `fetch()` POST to a service like:
- **Formspree** — `https://formspree.io/f/YOUR_FORM_ID`
- **Web3Forms** — `https://api.web3forms.com/submit`
- **Netlify Forms** (if hosting on Netlify instead of GitHub Pages)
- Your own backend

### Change brand color / icon
Edit the `--brand` CSS variable in `index.html`.
To regenerate icons, re-run `gen_icons.py` with your new color.

### Update the service worker cache
Bump the `VERSION` constant at the top of `sw.js` (e.g. `v1.0.0` → `v1.0.1`).
Users will fetch the new version on their next visit.

---

## What's already in the app

- **Home tab** — hero card, 2×2 widget grid, Shield shortcut, testimonial, map card
- **Services tab** — gallery + service list
- **Shield tab** — 4 membership tiers, Annual/Monthly toggle, tier CTAs push to Contact
- **Articles tab** — 5 full articles (winter prep, re-shingling, plumbing, solar ROI, turnover costs)
- **More tab** — About, Contact, Privacy, Cookie policies
- **Contact form** — with validation (name, email, phone, message) and mailto dispatch to `service@nepa-pro.com`
- **Auto light/dark mode** — follows `prefers-color-scheme`, no manual toggle needed
- **iOS stack navigation** — back button, per-tab navigation stacks, push animations
- **Phone link** — `tel:8666372776` works on every device

---

© NEPA-PRO · Since 1987 · Powered by VET-SYNC.COM

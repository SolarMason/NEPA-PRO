# NEPA-PRO

**Property care, on subscription.** The marketing and self-serve site for NEPA-PRO LLC — a Northeast Pennsylvania property maintenance company serving Lackawanna, Luzerne, Wayne, Pike, Susquehanna, Wyoming, Monroe, and Carbon counties since 1987.

Live at **[nepa-pro.com](https://nepa-pro.com)** · Phone **866-NEPA-PRO** · Email **service@nepa-pro.com**

---

## What's in here

A self-contained static site. No build step, no framework. Just HTML, CSS, and vanilla JavaScript with two libraries (jsPDF + autoTable) bundled locally in `/js`.

### Pages

| Path | What it is |
|---|---|
| `/` | Home — hero, plans, outdoor care, senior services, services list, How It Works, FAQ, two CTA banners (Renovate + Inspect) |
| `/about` | Company story, team, stats, timeline |
| `/contact` | Contact form, hours, emergency card |
| `/guides` | Guide article index with category filters |
| `/guides/winter-prep` etc. | 7 long-form guide articles (~17,000 words total) |
| `/qualify` | Honor / Senior discount qualification flow → returns promo code |
| `/media` | Media kit hub — 10 downloadable PDFs |
| `/renovate` | **Renovation Estimator** — 23 categories, 69 input fields, live calc, plan savings comparison (4 plans), branded PDF |
| `/inspection` | **Home Inspection Tool** — 371-point inspection across 21 sections, health score 0-100 + A-F grade, photos, branded multi-page PDF report |

### Bottom tab bar (mobile)

**Home · Plans · Inspect · Estimate · Contact** — the most-used screens. Guides and Media are accessible from every page's footer.

### Assets

```
js/                      jsPDF UMD + autoTable plugin (renovate + inspection PDF generators)
media-kit/               10 marketing PDFs + thumbnail PNGs
og-card.{png,jpg}        1200×630 social share card
icon-*.png               PWA icons across all sizes
apple-touch-icon.png     iOS home-screen icon
favicon.{ico,png}        Browser favicon
manifest.json            PWA manifest with icons and shortcuts
```

---

## Quick local preview

Any static HTTP server works. Pick one:

```bash
# Python (built-in)
python3 -m http.server 8000

# Node (npx)
npx serve .

# PHP
php -S localhost:8000
```

Then open <http://localhost:8000>. **Don't open `index.html` directly with `file://`** — the renovation/inspection tools need a real HTTP server for the local jsPDF scripts to load.

---

## Deploy to GitHub Pages

This repo includes everything you need: a GitHub Actions workflow, a CNAME file for the custom domain, and a `.gitignore`.

### One-time setup

1. **Create the GitHub repo.**
   - Go to <https://github.com/new>, name it (suggested: `nepa-pro-site`), make it **Public** (Pages on private repos requires a paid plan).
   - **Don't** initialize with a README — the zip already has one.

2. **Upload the files.**
   - **Drag-and-drop method** (easiest): On the new empty repo page, click "uploading an existing file", then drag every file and folder from the unzipped `nepa-pro/` folder into the browser. Commit directly to `main`.
   - **Git CLI method:**
     ```bash
     cd /path/to/unzipped/nepa-pro
     git init
     git add .
     git commit -m "Initial NEPA-PRO site"
     git branch -M main
     git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
     git push -u origin main
     ```

3. **Enable Pages.**
   - **Settings → Pages**
   - Under **Source**, select **GitHub Actions** (not "Deploy from a branch").
   - That's it for Pages — the workflow at `.github/workflows/deploy.yml` will run automatically on every push to `main`.

4. **Watch the first deploy.**
   - Go to the **Actions** tab. You should see a workflow run named "Deploy to GitHub Pages" in progress.
   - It takes about 30-60 seconds.
   - When it finishes green, your site is live at `https://YOUR-USER.github.io/YOUR-REPO/`.

5. **Hook up the custom domain `nepa-pro.com`.**

   The repo already includes a `CNAME` file with `nepa-pro.com`. You still need to point DNS at GitHub.

   At your DNS provider (the registrar where you bought `nepa-pro.com` — GoDaddy, Cloudflare, Namecheap, etc.), add these records:

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | A | `@` | `185.199.108.153` | Auto / 3600 |
   | A | `@` | `185.199.109.153` | Auto / 3600 |
   | A | `@` | `185.199.110.153` | Auto / 3600 |
   | A | `@` | `185.199.111.153` | Auto / 3600 |
   | CNAME | `www` | `YOUR-USER.github.io` | Auto / 3600 |

   Then in GitHub:
   - **Settings → Pages → Custom domain:** type `nepa-pro.com`, click **Save**.
   - GitHub will verify DNS (this can take a few minutes to a few hours).
   - Once verified, check **Enforce HTTPS** — GitHub provisions a free Let's Encrypt cert automatically.

   When everything is green, `https://nepa-pro.com` is live.

### Subsequent deploys

After initial setup, **every push to `main`** triggers a redeploy automatically. Edit a file, commit, push — your site updates within ~1 minute.

You can also manually trigger a deploy: **Actions → Deploy to GitHub Pages → Run workflow**.

---

## Common updates

### Update Stripe payment link

All Stripe URLs are in `index.html`. Search for `secure.nepa-pro.com/b/` to find them. Each plan card and outdoor/senior service has one. There are 12 in total:

- 5 Property Plans (IT $49.99, Essential $99, Pro $199, Premier $349, Estate $699)
- 3 Outdoor Care plans (Lawn, Year-Round Bundle, Snow — each with residential + commercial variants)
- 4 Senior Services (Property Inspection $65, Helping Hand $85, Trash $89, Bundle $199)

The **renovate.html** plan-comparison module also has 4 of these URLs hardcoded — search for `const PLANS = [` in that file if you change Essential / Pro / Premier / Estate URLs.

### Update plan pricing

Plan prices (e.g. `$99/mo`) appear in:
- `index.html` — the plans grid
- `renovate.html` — the `PLANS = [...]` constant in the JavaScript (look for `monthly: 99`)

Update both together to keep the renovation savings calculator accurate.

### Update renovation discounts

In `renovate.html`, the `PLANS` constant defines the discount fractions:
```js
const PLANS = [
  { id: 'essential', name: 'Essential', monthly: 99,  discount: 0.10, ... },
  { id: 'pro',       name: 'Pro',       monthly: 199, discount: 0.15, ... },
  { id: 'premier',   name: 'Premier',   monthly: 349, discount: 0.20, ... },
  { id: 'estate',    name: 'Estate',    monthly: 699, discount: 0.25, ... },
];
```

If you change a discount, also update the plan card text in `index.html` (search for "% off renovations").

### Update phone or email

Phone `866-NEPA-PRO` (`+18666372776`) and email `service@nepa-pro.com` appear in every page header / footer / contact card. Use a global find-and-replace across all `.html` files.

### Add a new guide article

1. Copy an existing file in `/guides/` (e.g. `winter-prep.html`) as a template.
2. Update the title, content, hero image references, and meta tags.
3. Add a new card linking to it in `guides.html`.
4. Commit and push — auto-deploys.

### Update inspection items or renovation pricing

The inspection items (371) and renovation pricing data (23 categories) are **embedded directly in their respective HTML files** as JavaScript objects. To modify:

- **Inspection:** Open `inspection.html`, search for `const DATA = ` near the top of the `<script>` block. Edit the JSON inline.
- **Renovation:** Open `renovate.html`, search for `const DATA = `. Same idea.

These are large JSON objects — be careful with quotes and commas. After editing, test locally before pushing.

---

## Discount qualification (Honor / Senior)

The `/qualify` page is an honor-system flow:
- 5 quick questions per flow (HPROD = honor for vets/first responders, SPROD = senior 65+)
- "Copy code & continue" button writes the code to clipboard and redirects to `index.html#pricing`
- Customer pastes the code at Stripe checkout to get the discount

For this to actually discount the order, you need the **promo codes set up in Stripe**:
1. Stripe Dashboard → Coupons → Create
2. Coupon: 10% off, redeemable promotion codes enabled
3. Promotion codes: `HPROD` for honor, `SPROD` for senior
4. On each Payment Link: enable "Allow promotion codes" toggle

---

## Tech notes

- **Pure static.** No server, no build step, no framework. Just HTML/CSS/JS.
- **PWA-ready.** Has a manifest, icons across all sizes, theme-color set. Will install to home screen on iOS/Android/desktop.
- **Mobile-first responsive.** Designed for thumbs first; desktop polish at `≥980px`.
- **iOS aesthetic.** SF Pro stack, system colors, blur backdrops, rounded corners.
- **Accessibility.** Semantic HTML, `aria-label`s on icon-only links, focus rings, sufficient contrast.
- **Performance.** No external CDN dependencies — jsPDF is bundled locally. No web fonts (uses native system fonts). Total page weight ~2 MB including all assets.

---

## Repo structure

```
.
├── .github/workflows/deploy.yml    GitHub Pages auto-deploy
├── .gitignore
├── CNAME                           Custom domain for GitHub Pages
├── README.md                       This file
│
├── index.html                      Home (most content lives here)
├── about.html
├── contact.html
├── guides.html                     Guide article index
├── inspection.html                 371-point home inspection tool
├── media.html                      Media kit hub
├── qualify.html                    Discount qualification flow
├── renovate.html                   Renovation estimator + plan savings
│
├── manifest.json                   PWA manifest
├── favicon.ico, favicon-32.png
├── apple-touch-icon.png
├── icon-192.png, icon-512.png, icon-maskable-512.png
├── og-card.png, og-card.jpg        Social share image (1200×630)
│
├── guides/                         7 long-form articles
│   ├── aging-in-place.html
│   ├── ice-dams.html
│   ├── inspection-decoded.html
│   ├── smart-home-worth-it.html
│   ├── solar-cloudy-nepa.html
│   ├── two-quotes.html
│   └── winter-prep.html
│
├── js/
│   ├── jspdf.umd.min.js                   PDF generation library
│   └── jspdf.plugin.autotable.min.js      autoTable plugin for tabular PDFs
│
└── media-kit/                      Customer-facing marketing materials
    ├── 01-brand-guidelines.pdf            (6pp brand guide)
    ├── 02-service-overview.pdf
    ├── 03-plan-comparison.pdf
    ├── 04-senior-services.pdf
    ├── 05-honor-discount.pdf
    ├── 06-tear-off-flyer.pdf
    ├── 07-door-hanger.pdf
    ├── 08-social-post-pack.pdf
    ├── 09-digital-banners.pdf
    ├── 10-newsletter-template.pdf
    └── thumbs/                            Thumbnail PNGs for the kit landing page
```

---

## Legal

© 2026 NEPA-PRO LLC · EIN 39-2873591 · Licensed and insured in PA.

For licensing of any code or content in this repo, contact `service@nepa-pro.com`.

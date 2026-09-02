# rickyjordan.com

Personal site for **Ricky Jordan** — Senior Director, Configuration & Data Management. Thirty years turning CAD, PLM, PDM, and ERP into one accurate system of record.

A single-page, hand-built static site — no framework, no build step, no dependencies. Every animation is CSS transform/opacity or a few dozen lines of vanilla JS.

## Stack

| | |
|---|---|
| Markup | One `index.html`, semantic sections, no templating |
| Styling | One `assets/style.css`, CSS custom properties, `clamp()` fluid type/space, no preprocessor |
| Behavior | One `assets/site.js` (IIFE, no dependencies) — scroll reveals, word-mask headline split, count-ups, a pinned diagram panel, magnetic buttons |
| Fonts | Self-hosted via Google Fonts CDN (Instrument Sans, JetBrains Mono, Playfair Display, Exo 2) |
| Dev server | `devserver.py` — stdlib `http.server` with clean-URL rewriting (`/about` → `about.html`) |
| Hosting | Static — deploys as-is to Vercel, Netlify, GitHub Pages, or any static host |

No `package.json`, no bundler, no npm install. The whole site is the four files above plus `/assets/img`.

## Getting started

Requires Python 3 (for the local dev server only — nothing is compiled or transpiled).

```bash
python3 devserver.py 8721 .
```

Then open **http://localhost:8721**. Edit `index.html` / `assets/style.css` / `assets/site.js` and refresh — there's no build step to wait on.

## Project structure

```
.
├── index.html                 # the entire site — one page, seven sections
├── devserver.py                # local dev server with clean-URL rewriting
├── assets/
│   ├── style.css               # design system: tokens, layout, components, motion
│   ├── site.js                 # scroll reveals, word-mask split, counters, pinned panel
│   └── img/                    # photography, client logos, the RJ badge
├── BRADY-DESIGN-SYSTEM.md      # the design handbook this site is built from
└── .claude/launch.json         # local preview config
```

## Page anatomy

The page is one long scroll, seven sections, each with its own `id` for the nav:

| Section | `id` | What's there |
|---|---|---|
| Hero | `#top` | Headline, stat readouts, hero portrait, animated systems-constellation diagram |
| Expertise | `#expertise` | Build-sheet spec panel — experience, title, systems route, current posting |
| Process | `#process` | Pinned horizontal panel — the configuration/change pipeline |
| Record | `#record` | Track record — programs, outcomes, on-stage appearances |
| Approach | `#approach` | Portrait + narrative — how he works, a pull quote |
| Experience | `#experience` | Career chapters |
| Contact | `#contact` | Get-in-touch, `mailto:`-based (no backend) |

An intro curtain plays once per load: the RJ badge marks in, ignites, glints, and zooms out as the curtain lifts.

## Design system

The visual language — color roles, contrast rules, typography scale, motion timing, component patterns, and the traps that bit earlier builds — is documented in [`BRADY-DESIGN-SYSTEM.md`](./BRADY-DESIGN-SYSTEM.md). Read it before making any visual change; the odd-looking choices in the CSS are almost all load-bearing and explained there.

Quick reference for this build:

- **Ink** `#0b0a0a` / **paper** `#f4f2ee` / **red** `#ff594b` — one metallic-red accent, never used for body text (fails contrast on its own paper ground; reserved for rules, fills, and large display type).
- **Type**: Instrument Sans (body), JetBrains Mono (telemetry/labels), Playfair Display (display accents), Exo 2 Black Italic (nav wordmark — a free stand-in for a licensed Eurostile cut).
- **Motion**: `transform`/`opacity` only, `cubic-bezier(.22,1,.36,1)` ease-out by default, reduced-motion gets a finished still frame rather than a disabled animation.

## Editing content

Everything is hand-authored in `index.html` — there's no CMS or data file. Common edits:

- **Copy / stats / job title** — search `index.html` for the text directly; most numbers (years of experience, etc.) appear in 3–4 places (meta tags, hero stat counter, build sheet, footer) and should be updated together.
- **Images** — drop files in `assets/img/`, reference with a relative path. The hero portrait and badge logo are reused across multiple sections from the same file, so replacing one file updates it everywhere.
- **Reveal animations** — add `data-fade` (fade + rise), `data-fade-r` (fade + slide in from the right), or `data-unveil` to any element; `site.js` wires up the `IntersectionObserver` automatically.

## Deployment

Static output, zero config required.

**Vercel** (recommended — connected to this repo for auto-deploy on push):
1. [vercel.com/new](https://vercel.com/new) → import this repository.
2. Framework preset: **Other** / **No build step**. Output directory: `.` (root).
3. Every push to `main` deploys automatically over HTTPS with a free auto-renewing certificate, including once a custom domain is attached.

**Custom domain (GoDaddy → Vercel):** point the domain's DNS at Vercel per their dashboard instructions (an `A`/`ALIAS` record for the apex plus a `CNAME` for `www`, or Vercel nameservers); Vercel provisions HTTPS for it automatically once DNS resolves.

## License

© Ricky Jordan. All rights reserved — site content, photography, and the RJ mark are not licensed for reuse.

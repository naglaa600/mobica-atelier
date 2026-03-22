# Mobica Atelier

> Interior configurator — *Curated for Eng. Naglaa*

A branded interior configuration tool built with **Next.js App Router** + **Tailwind CSS**, deployable to Vercel in one click.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How it Works

The app composites two image layers in real time using CSS `position: absolute` stacking:

| Layer | Source | Format |
|-------|--------|--------|
| Cladding | `/public/images/claddings/{id}/preview.jpg` | JPEG full-bleed background |
| Desk | `/public/images/desks/{id}/preview.png` | PNG with transparent background |
| Chair *(future)* | `/public/images/chairs/{id}/preview.png` | PNG with transparent background |

Each layer fades independently with a `0.4s ease` CSS opacity transition when selection changes.

---

## Adding a New Cladding

1. Create the folder: `public/images/claddings/your-id/`
2. Drop in:
   - `preview.jpg` — full-bleed background image (recommended ≥ 1600×900px)
   - `thumb.jpg` — sidebar thumbnail (recommended 400×300px, 4:3 ratio)
3. Add one line to `src/config.js`:

```js
{ id: "your-id", label: "Your Label" },
```

That's it. Zero other code changes.

---

## Adding a New Desk Style

Same as cladding, but:

- Folder: `public/images/desks/your-id/`
- Preview must be a **PNG with a transparent background** so it composites cleanly over the cladding layer
- Add one line to the `desks` array in `src/config.js`

---

## Activating the Chair Section

The chair section is already visible in the sidebar (greyed out with "Coming Soon" badges).

To make a chair option live:

1. Create the folder: `public/images/chairs/ergonomic/`
2. Drop in `preview.png` (transparent PNG) and `thumb.jpg`
3. Uncomment the line in `src/config.js`:

```js
chairs: [
  { id: "ergonomic", label: "Ergonomic" },  // ← uncomment this
],
```

The card will immediately become interactive and the Coming Soon badge will disappear.

---

## Replacing the Mobica Logo

Replace the file at:

```
public/mobica-logo.png
```

This same file is used as:
- The logo displayed in the sidebar header
- The browser favicon

Recommended: square PNG, at least 128×128px, transparent background.

---

## Project Structure

```
src/
  config.js          ← Single source of truth — only file you ever need to edit
  app/
    layout.js        ← HTML shell, fonts, metadata, favicon
    page.js          ← Root page (client component, state lives here)
    globals.css      ← CSS variables, grain texture, animation keyframes
  components/
    Sidebar.js       ← Logo, option cards grid, footer
    PreviewPanel.js  ← CSS compositing layers + caption
    OptionCard.js    ← Individual card with thumbnail, label, hover/selected states

public/
  mobica-logo.png    ← ← ← Replace this with your actual logo
  images/
    IMAGES.md        ← Image format & size guide
    claddings/{id}/preview.jpg + thumb.jpg
    desks/{id}/preview.png + thumb.jpg
    chairs/{id}/preview.png + thumb.jpg
```

---

## Deploying to Vercel

### Option A — Vercel CLI

```bash
npx vercel
```

### Option B — Vercel Dashboard

1. Push this repo to GitHub / GitLab / Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Framework will be auto-detected as **Next.js**
5. Click **Deploy**

No environment variables are required — all assets are static.

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--cream` | `#F5F0E8` | Preview panel background |
| `--sand` | `#E8DDD0` | Sidebar background tint |
| `--tan` | `#C8B89A` | Borders, muted text |
| `--accent` | `#8B6B4A` | Selected state, section titles |
| `--ink` | `#2C2218` | Body text |

**Fonts:** `Cormorant Garamond` (serif italic — branding, captions) + `Jost` (sans-serif weight 300–400 — UI labels)

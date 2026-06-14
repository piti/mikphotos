# Mik Photography

Website for Mik's outdoor & portrait photography business. Custom-built in **Astro**,
navy + powder-blue brand ("Bold Navy" design direction).

- **Code** lives here in `~/dev/mikphotos`, deployed via GitHub Actions → GitHub Pages on the custom domain miktakesflicks.online.
- **Research / decisions / dispatch** live in the vault at `~/vault/projects/mikphotos`.
- **Live:** https://miktakesflicks.online

## Stack

- [Astro](https://astro.build) 5 — static output, built-in image optimization (WebP/AVIF, responsive `srcset`).
- Fonts: Bricolage Grotesque (display) + Hanken Grotesk (body).
- Deployed by `.github/workflows/deploy.yml` on every push to `main`.

## Structure

```
src/
  pages/index.astro      ← the single-page site (Bold Navy)
  assets/photos/         ← web-optimized photos committed to the repo
    hero/                ← hero-main.jpg, hero-inset.jpg
    g-NN-*.jpg           ← gallery images
  data/photos.json       ← gallery manifest (src + category + caption, in display order)
public/mockups/          ← archived original design mockups (A/B/C)
scripts/                 ← local image tooling (not part of the build)
  contact-sheets.mjs     ← labeled contact sheets for curating from the photo source
  sheet-paged.mjs        ← paged contact sheets for large folders
  optimize.mjs           ← produces src/assets/photos/* + data/photos.json
```

## Working with photos

Source photos live outside the repo in the Syncthing folder
`~/macs-shareable/mik_photos/` (originals, untouched). To re-curate:

1. `node scripts/contact-sheets.mjs` → review `/tmp/mik-sheets/*.jpg`, note indices.
2. Edit the selection arrays in `scripts/optimize.mjs`.
3. `npm run optimize` → regenerates `src/assets/photos/` + `src/data/photos.json`.
4. `npm run build` to preview, commit, push (Actions deploys).

To swap a single gallery photo, replace its entry in `optimize.mjs` (folder + filename
from a contact sheet) and re-run `npm run optimize`.

## Local dev

```
npm install
npm run dev      # http://localhost:4321/mikphotos/
npm run build    # outputs dist/
```

## Booking

A booking slot is wired in the `#book` section (`src/pages/index.astro`, `#booking` div).
Drop a TidyCal (or Cal.diy) embed snippet into that block. Pending decision: TidyCal agency
account + team for Mik vs. a personal TidyCal license vs. self-hosted Cal.diy.

## Palette

- Navy `#16294D` · Navy deep `#0B1730` · Powder `#BCD4E6` · Powder bright `#A7CCE6` · Mist `#F2F6FA`

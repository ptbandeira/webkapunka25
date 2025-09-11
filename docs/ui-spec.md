# Kapunka UI/UX Spec (Parity-first)

This document records the intended visual structure and behaviors of the site for reference during migrations and future changes.

## Pages

- Home (`/[lang]`)
  1. Hero (full-viewport, Swiper slides, centered pagination dots)
  2. Best‑Sellers (carousel of products; square tiles; hover overlay “Add to Cart” button)
  3. About blurb (title + two paragraphs, centered column)
  4. Testimonials (quote + name; left/right arrow controls)
  5. Video strip (full‑width background image with circular rotating text and play icon)
  6. FAQs (accordion)
  7. Tiles (three marketing tiles)
  8. Footer (4 columns + copyright bar)

- About (`/[lang]/about`)
  - Title + 2 paragraphs; centered column

- Shop (`/[lang]/shop`)
  - Grid of product cards (square images, overlay on hover, name + EUR price)

- Contact (`/[lang]/contact`)
  - Title + intro paragraph + mailto link
  - Netlify form (name, email, message)

## Localization

- Routes: `/en`, `/pt`, `/es` prefixed; language switch keeps the same page (about→about, etc.).
- Labels: Header and Footer labels are localized via `client/content/i18n/{lang}.json`.
- Content: Page markdown/JSON per language under `client/content/pages/*` and `client/content/products/*`.

## Visual Details

- Product images: 1:1 squares (`object-fit: cover`), consistent spacing.
- Best‑Sellers heading: “Best‑Sellers” (en) with same padding/margins as legacy.
- Hero pagination: centered along the bottom with legacy offsets.
- Footer order: after page content; do not render before hero.

## Behaviors

- Carousels: Use Swiper with legacy‑matching options (speed, breakpoints, navigation; autoplay only on hero).
- No preloader overlay: a hidden stub `#preloader` exists only to satisfy legacy scripts.
- No double initialization: legacy product slider is removed server‑side, React carousel is the sole source.

## Migration Notes

- When replacing a legacy section with React, remove the entire legacy block server‑side to avoid duplicate DOM and script conflicts.
- Avoid CSS hides for structural conflicts; prefer server‑side removal.
- Keep class names consistent to inherit legacy styling unless there is a specific reason to differ.


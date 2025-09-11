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

- Global spacings (from legacy CSS):
  - `.padding-large`: 7em top/bottom
  - `.padding-xlarge`: 9.5em top/bottom
  - `.margin-xlarge`: 9.5em top/bottom

- Hero (Billboard):
  - Title/subtitle overlay container: `.banner-content { margin-top: 60%; }`
  - Pagination dots bottom offset: `#billboard .main-slider-pagination { bottom: 62px; z-index: 999; }`
  - Dot size and spacing: `.swiper-pagination-bullet { width: 18px; height: 18px; margin: 0 13px !important; }`
  - Active color: black; inactive gray (from legacy variables)

- Best‑Sellers (Products):
  - Tile shape: perfect squares via `aspect-ratio: 1/1` and `object-fit: cover`
  - Hover overlay CTA: `.product-store .product-card .cart-concern { bottom: 120px; opacity: 0; transition: .5s; }` and shows on hover
  - Grid/carousel breakpoints (slides per view): 1 (0px), 2 (≥480px), 3 (≥900px), 5 (≥1200px)
  - Carousel speed: 1000ms

- Video strip:
  - Height: `.video-section.jarallax { min-height: 825px; }`
  - Circular text: `.text-pattern` rotates (50s linear)

- Tiles section grid:
  - 2x2 grid with `grid-gap: 20px` (legacy rules)

- Footer:
  - Columns: 4 (About, Quick Links, Contact, Social)
  - Logo size: `#footer img.logo { max-height: 44px !important; }`
  - Copyright bar: single line centered

- Footer order: after page content; do not render before hero.

## Behaviors

- Carousels: Use Swiper with legacy‑matching options (speed, breakpoints, navigation; autoplay only on hero).
- No preloader overlay: a hidden stub `#preloader` exists only to satisfy legacy scripts.
- No double initialization: the entire legacy Best‑Sellers section is removed server‑side on Home; React carousel is the sole source.
- Locale navigation must not duplicate or shift sections (no stacked slides, no missing sections). React carousels use unique class names to avoid legacy script targeting.

## Migration Notes

- When replacing a legacy section with React, remove the entire legacy block server‑side to avoid duplicate DOM and script conflicts.
- Avoid CSS hides for structural conflicts; prefer server‑side removal.
- Keep class names consistent to inherit legacy styling unless there is a specific reason to differ.

## Pixel References (quick list)

- Spacing
  - padding-large: 7em
  - padding-xlarge: 9.5em
  - margin-xlarge: 9.5em

- Hero
  - Dots: 18x18px; spacing 13px; bottom offset 62px
  - Title block offset: margin-top 60%

- Best‑Sellers
  - CTA group vertical offset: 120px from image bottom
  - Breakpoints: 0→1, 480→2, 900→3, 1200→5 slides

- Video strip
  - Min height: 825px
  - Rotating text animation: 50s linear

## Acceptance Checklist

- Home (all locales)
  - [ ] Hero slides correct; pagination centered; no flicker
  - [ ] Best‑Sellers visible on first load; correct heading and order; tiles square; arrows work
  - [ ] After switching locales and returning home, Best‑Sellers layout unchanged (no duplicates)
  - [ ] Video strip background centered/cover; circular text rotates; link opens YouTube
  - [ ] Testimonials arrows present; FAQs accordion toggles
  - [ ] Tiles render 2x2 grid with 20px gaps
  - [ ] Footer appears after content; 4 columns; copyright bar

- Pages (About/Shop/Contact)
  - [ ] About: center column; two paragraphs
  - [ ] Shop: product grid cards; square images; EUR price; hover overlay
  - [ ] Contact: title/intro/email; Netlify form fields present

- Localization
  - [ ] Language switch preserves the current page (about→about, etc.)
  - [ ] Header/Footer labels localized via content/i18n


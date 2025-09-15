# Contribution & Branching Guide

This repo uses short‑lived feature branches, feature flags, and Netlify Deploy Previews.

- Branch naming: `feature/<scope>` for features; `fix/<scope>` for small fixes.
- Keep branches small (1–3 focused commits) and short‑lived.
- Always open a PR to merge into `main`. Netlify builds a Preview URL for QA.
- Delete the branch after merging.

## Feature flags (env‑driven)

- `NEXT_PUBLIC_FEATURE_LEARN`
- `NEXT_PUBLIC_FEATURE_CLINICS`
- `NEXT_PUBLIC_FEATURE_TRAINING`
- `NEXT_PUBLIC_FEATURE_POLICIES`
- `NEXT_PUBLIC_FEATURE_CART`

Tip: Turn these ON (`1/true/on/yes`) for Deploy Previews and Branch Deploys; keep off by default for Production unless explicitly enabled.

## Environments

- Dev: `npm --prefix client run dev` (auto‑cleans `.next` to avoid stale chunks).
- Build/Export: `npm --prefix client run build` (generates sitemap + robots).
- Netlify: builds from `client/` and publishes `client/out`.

## Content (Decap CMS)

- Admin UI: `/admin` (Decap + Netlify Identity Git Gateway).
- Section builder JSON under `site/content/*` is synced to `client/public/content` on build.
- React routes read from `client/content` or local models; avoid regressions by keeping parity until flagged on.

## QA checklist per PR

- No layout/CLS regressions; parity with legacy spec.
- Keyboard focus visible; forms have labels and ARIA.
- Feature flags behave correctly (dev vs prod).
- Routes render in all locales (`/en`, `/pt`, `/es`).

## Useful env vars

- `NEXT_PUBLIC_SITE_URL` – canonical base (used in sitemap/robots and canonical tags)
- `NEXT_PUBLIC_ANALYTICS_SRC` – external analytics loader (optional)
- `NEXT_PUBLIC_ANALYTICS_DEBUG` – console logging (default on in dev)
- `NEXT_PUBLIC_CONTACT_EMAIL/PHONE/WHATSAPP_URL` – footer/contact unification
- `NEXT_PUBLIC_CHECKOUT_URL` – external checkout endpoint (optional)

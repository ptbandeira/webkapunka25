# Codex Session Notes

## 2025-09-18
- Sprint goal: wire Decap-provided customer reviews through build outputs and surface them on Home + PDP behind `features.reviews`.
- Key deliverables: Decap collection config, `scripts/build-reviews.ts` (writes default + per-locale JSON), `components/ReviewsGrid`, integration points on Home and PDP, locale override behaviour.
- Current state: partial scaffolding exists (`client/scripts/build-reviews.ts`, placeholder `components/reviews/ReviewsGrid.tsx`, Decap collection entry) but requires validation against spec and integration.
- Progress: reviews collection refined, build pipeline emits default/locale JSON with overrides, `ReviewsGrid` implemented and wired on Home + PDP (feature-flagged).
- Outstanding: revisit OG image route build error (`app/api/og/route.ts`) if it should compile cleanly; review localized heading copy for testimonials.

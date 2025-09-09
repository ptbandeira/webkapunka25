# Next.js Cutover — Failsafe & Scope Guard

Date: 2025-09-09T17:47:13+0200
Current main SHA: 004c79c6117fa33efd39a95b164057bda7a16ef0

Purpose: Create a clear rollback point and guardrails before switching the site to use the Next.js build, without changing the current brand, layout, UI/UX, or CMS behavior.

## What this is NOT changing
- No style, brand assets, typography, or spacing changes
- No changes to the current menu UX
- Decap CMS must continue to work as-is

## Make a friendly tag (run locally)
```bash
# from the repo root on your machine
TAG="pre-next-cutover-$(date +%Y%m%d-%H%M)"
git tag -a "$TAG" -m "Backup before Next.js cutover"
git push origin --tags
```

If your environment disallows tags, keep the SHA above handy as your restore point.

## Revert path (Netlify)
If we later switch Netlify to publish the Next export (client/out) and you need to roll back:

1) Edit `netlify.toml` to restore the static site publish directory and command:
```toml
[build]
  publish = "site"
  command = ""
```
2) Commit and push.
3) In Netlify UI, trigger a fresh deploy for main.

Alternative Git revert:
- Revert the commit that changed `netlify.toml` to point to the Next export:
```bash
git revert <commit_that_switched_publish>
```

## Optional: restore full repo to backup SHA
```bash
git reset --hard 004c79c6117fa33efd39a95b164057bda7a16ef0
git push -f origin main   # only if you intend to force remote back
```

## Next steps (guarded)
- Chunk 1: configure `client/` for static export (no visual changes)
- Chunk 2: update Netlify build/publish to use `client/out` (cutover), keeping `/admin` and `/content` endpoints intact

> Proceed only after confirming this document is present and you’re comfortable with the rollback steps.


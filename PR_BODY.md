# docs: harden contributor guides

## What changed
- Define code areas (pages, assets, partials, pwa, seo)
- Add checklist items for service-worker cache, Lighthouse threshold, and A11y

## Code Areas
- **pages** – HTML files and page-level templates under `/pages`
- **assets** – static resources like images and fonts under `/assets`
- **partials** – reusable fragments in `/partials`
- **pwa** – service worker, manifest, and offline assets
- **seo** – metadata, structured data, and search optimizations

## Checklist
- [ ] SW cache bumped?
- [ ] Lighthouse CI ≥ threshold?
- [ ] A11y ≥ 90?

## Validation
- Open a sample PR and verify new checklist items appear

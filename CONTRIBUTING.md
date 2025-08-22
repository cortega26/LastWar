# Contributing

AI-first workflow with human operator.

- Read `AGENT_WORK_CONTRACT.md` and `docs/process/AI_FIRST_DELIVERY.md`.
- Follow `COMMIT_CONVENTION.md`.
- Use the AI Task issue template and AI PR template.

## Code Areas

Categorize changes with one of these scopes:

- **pages** – HTML files and page-level templates under `/pages`
- **assets** – images, fonts and other static resources in `/assets`
- **partials** – reusable fragments stored in `/partials`
- **pwa** – service worker, manifest and offline assets
- **seo** – metadata, structured data and related optimizations

Check the PR template to ensure the service-worker cache is bumped and
performance/a11y thresholds are met before submitting.

## Images

- Provide an `alt` attribute for every image. Use the template `"<context>: <concise description>"`.
- Decorative images should use an empty `alt=""`.
- Include explicit `width` and `height` or an `aspect-ratio` to prevent layout shift.

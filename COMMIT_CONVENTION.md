# Commit Convention

Use this format so tooling can attribute work to goals and update dashboards.

```
[goal:GOAL_ID] <type>(area): <concise summary>

Context: <1–3 sentences max>
Tests: <what was tested or how to reproduce>
```

## Examples
- `[goal:seo-improve-site-performance] feat: lazy-load hero images`
- `[goal:discord-community-growth] chore: add invite link component + tests`
- `[goal:monetization-adsense] fix: correct ad slot sizes on mobile`

### Types
feat | fix | chore | docs | refactor | test | perf | build | ci

### Areas
pages | assets | partials | pwa | seo

- **pages** – HTML files and templates in `/pages`
- **assets** – static resources like images and fonts in `/assets`
- **partials** – shared fragments kept under `/partials`
- **pwa** – service worker and manifest-related code
- **seo** – metadata, structured data and search optimizations

### Rules
- One goal per commit. If a commit touches multiple goals, split the change.
- Keep the subject under ~72 chars. Use imperative mood.

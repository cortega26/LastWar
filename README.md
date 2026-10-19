# Last War Tools

> **Stop doing Last War math in your head.**
> Practical calculators, concise guides, and reference tools for **Last War: Survival Game**.

[![GitHub stars](https://img.shields.io/github/stars/cortega26/LastWar?style=flat&logo=github)](https://github.com/cortega26/LastWar/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/cortega26/LastWar)](https://github.com/cortega26/LastWar/commits/main)

## What you get

This repo turns recurring in-game decisions into reusable tools instead of guesswork.

| Need | Tool |
|:---|:---|
| Plan event timing | **Event Tracker** |
| Estimate protein production | **Protein Farm Calculator** |
| Plan T10 progression | **T10 Research Calculator** |
| Compare team compositions | **Team Builder** |
| Improve alliance play | **Alliance Guide** |
| Prioritize upgrades | **Base Building Guide** |
| Understand hero choices | **Heroes Guide** |

### Why this exists

Last War has lots of small optimization decisions. Individually they look simple; together they create repeated arithmetic, scattered notes, and easy-to-miss tradeoffs. **Last War Tools puts those decisions in one searchable, reusable place.**

> If one of the calculators saves you time, consider starring the repo — it helps other players discover it.

## For contributors

The site is a static Jekyll project using the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme.

### Run locally

```bash
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

### Build

```bash
bundle exec jekyll build
```

### Verify links and assets

```bash
bundle exec htmlproofer ./_site --disable-external
```

### Content structure

- Calculators: `_calculators/`
- Guides: `_guides/`
- General pages: `_pages/`
- Strategic priorities: [`docs/scoreboard/SCOREBOARD.md`](docs/scoreboard/SCOREBOARD.md)
- Strategic goals: [`docs/goals/GOALS.md`](docs/goals/GOALS.md)

Styling overrides live under `_sass/overrides/` and are imported from `assets/css/main.scss`, keeping custom code separate from the upstream theme.

## Contributing

Contributions that improve calculator accuracy, explain mechanics more clearly, or add high-value tools are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License / game ownership

This is an independent community project. **Last War: Survival Game** and related trademarks belong to their respective owners.

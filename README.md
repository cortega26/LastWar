# Last War Tools

This repository contains a small static website that provides calculators, rules, and guides for **Last War: Survival Game**. The site now uses the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) Jekyll theme for a maintainable and consistent design.

## Usage

Install Ruby gems and start the Jekyll development server:

```bash
cd my-site
bundle install
cd ..
npm run serve
```

The site will be available at `http://localhost:3000`.

### Building the site

To generate the static site without starting the development server run:

```bash
cd my-site
bundle exec jekyll build
```

You can also serve the site directly with Jekyll:

```bash
cd my-site
bundle exec jekyll serve
```

### Styling overrides

Minimal Mistakes can be customised through SCSS overrides. Add new partials
under `my-site/_sass/` and import them from `my-site/assets/css/main.scss`.
This keeps custom styles separate from the theme and makes future updates
easier.

## Development

Content is written in Markdown within the `my-site` directory and built by Jekyll. For the previous hand-built HTML version, run `npm run serve:legacy`.

### Project Management

- Current priorities: see [`docs/scoreboard/SCOREBOARD.md`](docs/scoreboard/SCOREBOARD.md).
- Strategic goals: see [`docs/goals/GOALS.md`](docs/goals/GOALS.md).

## Monetization Ideas

- Add a "Buy Me a Coffee" button to let visitors donate.
- Offer premium calculator features or ad-free browsing for supporters.
- Display unobtrusive advertisements from a network such as Google AdSense.

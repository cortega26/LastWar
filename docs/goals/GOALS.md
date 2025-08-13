# Last War – Goals

_Strategic goals grouped by area, with top next actions pulled from the scoreboard._

## Analytics
**Goal:** Track usage and conversions; maintain weekly KPIs to guide decisions.  

**Top Next Actions:**
| Task                        | Impact   |   Score (0-10) | Next Step                               | Due   |
|:----------------------------|:---------|---------------:|:----------------------------------------|:------|
| GA4 + Google Search Console | H        |              0 | Install GA4; verify GSC; submit sitemap |       |
| Event Tracking (tools/CTAs) | H        |              1 | Track tool_open/calc_run/discord_click  |       |
| A/B Testing Framework       | M        |              0 | Pick first test & wire toggles          |       |

**Definition of Done (DoD):**
- GA4 + GSC connected- Events for CTAs/tools firing- KPI dashboard updated

## Community
**Goal:** Encourage feedback/UGC to improve guides and grow repeat visits.  

**Top Next Actions:**
| Task                   | Impact   |   Score (0-10) | Next Step                             | Due   |
|:-----------------------|:---------|---------------:|:--------------------------------------|:------|
| Discord Server         | H        |              0 | Publish invite link and banner        |       |
| Feedback Form → Issues | M        |              0 | Embed form and route to GitHub issues |       |
| Newsletter (bi-weekly) | M        |              0 | Add signup block & send v1            |       |

**Definition of Done (DoD):**
- Feedback form + triage- UGC guidelines published- Responses within 48h

## Competitive
**Goal:** Monitor competitors, close gaps, and differentiate with better tools/fresh analysis.  

**Top Next Actions:**
| Task                 | Impact   |   Score (0-10) | Next Step                                | Due   |
|:---------------------|:---------|---------------:|:-----------------------------------------|:------|
| Keyword Gap Finder   | H        |              0 | Pull PAA/related queries; propose posts  |       |
| Backlink Outreach    | M        |              0 | Send 5 pitches to relevant sites         |       |
| Competitor Watchlist | M        |              0 | List top sites/AITube/Discord to monitor |       |

**Definition of Done (DoD):**
- Competitor list maintained- Gap opportunities logged as Content tasks- Monthly benchmark refresh

## Content
**Goal:** Publish evergreen guides/tools that cover Season 4 and core gameplay; keep them updated on a cadence.  

**Top Next Actions:**
| Task                     | Impact   |   Score (0-10) | Next Step                         | Due   |
|:-------------------------|:---------|---------------:|:----------------------------------|:------|
| Content Calendar         | H        |              0 | Approve monthly topics            |       |
| Pillar: Base Building    | H        |              0 | Approve outline & add screenshots |       |
| Pillar: Events & Seasons | H        |              0 | Add upcoming dates                |       |

**Definition of Done (DoD):**
- Intro + steps + visuals + internal links- Reviewed for accuracy; updated date set- SEO metadata + FAQ schema if relevant

## Monetization
**Goal:** Add ethical monetization (donations, ads, affiliate) without harming UX or CWV.  

**Top Next Actions:**
| Task                            | Impact   |   Score (0-10) | Next Step                           | Due   |
|:--------------------------------|:---------|---------------:|:------------------------------------|:------|
| AdSense Integration             | M        |              0 | Apply to AdSense & place unit       |       |
| Affiliate Basics & Disclosures  | M        |              0 | Join programs & add links to guides |       |
| Premium PDF (Ultimate Strategy) | M        |              0 | Outline chapters & format           |       |

**Definition of Done (DoD):**
- Disclosures present; UX unaffected- Ads lazy‑loaded- Donations/affiliate tracked as conversions

## Ops
**Goal:** Automate builds, tests, and audits to maintain reliability as content/tools grow.  

**Top Next Actions:**
| Task                          | Impact   |   Score (0-10) | Next Step                      | Due   |
|:------------------------------|:---------|---------------:|:-------------------------------|:------|
| Broken Link Checker (nightly) | M        |              0 | Add crawler job & auto-fix PRs |       |
| CI/CD (build, test, deploy)   | M        |              0 | Add GitHub Actions workflow    |       |
| Content Staging & Previews    | M        |              0 | Enable PR previews; checklinks |       |

**Definition of Done (DoD):**
- CI checks on PR- Preview/staging deploys- Automated link/Lighthouse checks

## Performance
**Goal:** Deliver sub‑second interactions and strong Core Web Vitals across devices.  

**Top Next Actions:**
| Task                                     | Impact   |   Score (0-10) | Next Step                           | Due   |
|:-----------------------------------------|:---------|---------------:|:------------------------------------|:------|
| Lighthouse CI & Budgets                  | H        |              0 | Add GitHub Action; set perf budgets |       |
| Image Pipeline (WebP/AVIF, srcset, lazy) | H        |              1 | Convert assets & update <img> tags  |       |
| Critical CSS (above-the-fold)            | M        |              0 | Extract & inline critical CSS       |       |

**Definition of Done (DoD):**
- LCP < 2.5s, CLS < 0.1, INP < 200ms- Optimized images; remove unused CSS/JS- Lazy‑load heavy logic

## Quality & Maintenance (Audits)
**Goal:** Institutionalize weekly checks for links/errors/regressions.  

**Top Next Actions:**
| Task                                     | Impact   |   Score (0-10) | Next Step                                                                    | Due   |
|:-----------------------------------------|:---------|---------------:|:-----------------------------------------------------------------------------|:------|
| Audit: Monthly Accessibility (axe/pa11y) | H        |            nan | Scan site; fix WCAG AA criticals; add regression tests                       |       |
| Audit: Monthly Rendering & Content QA    | H        |            nan | Check images (alt/size/srcset), tables on mobile, typos, code block overflow |       |
| Audit: Weekly Lighthouse & Web Vitals    | H        |            nan | Add Lighthouse CI budgets (LCP/CLS/TBT); run on PR & main                    |       |

**Definition of Done (DoD):**
- Weekly smoke + visual regression: 0 criticals- Link & console error sweeps pass- Actions documented

## SEO
**Goal:** Grow qualified organic traffic via technical fixes, high‑intent keywords, and relevant backlinks.  

**Top Next Actions:**
| Task                        | Impact   |   Score (0-10) | Next Step                              | Due   |
|:----------------------------|:---------|---------------:|:---------------------------------------|:------|
| Internal Linking Map        | H        |              0 | Generate link graph & suggestions      |       |
| Canonical & Domain Strategy | H        |              1 | Decide final domain & audit canonicals |       |
| Sitemap & Robots            | H        |              1 | Add nightly sitemap build to CI        |       |

**Definition of Done (DoD):**
- Crawlable (robots/canonicals ok)- Unique titles/meta + schema- ≥3 relevant internal links

## UX
**Goal:** Make navigation obvious; pages fast to scan so players find calculators, tier lists, and guides quickly.  

**Top Next Actions:**
| Task                       | Impact   |   Score (0-10) | Next Step                                   | Due   |
|:---------------------------|:---------|---------------:|:--------------------------------------------|:------|
| Accessibility (a11y) Fixes | H        |              0 | Run Lighthouse/axe and fix criticals        |       |
| On-Site Search             | H        |              0 | Implement Lunr/Pagefind search box          |       |
| Navigation IA & Hub Pages  | H        |              1 | Approve IA map for Heroes/Base/Events/Tools |       |

**Definition of Done (DoD):**
- Clear nav labels; primary CTA above fold- Mobile layout verified- No layout shift on interaction


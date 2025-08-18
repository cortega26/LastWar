# AI-First Delivery (Addendum to AGENT_WORK_CONTRACT.md)

## Roles

- **Project Owner (PO) + Operator:** sets outcomes, accepts work, applies patches locally, opens PRs.
- **AI (Scrum Master + Dev Team):** selects tasks, produces operator-ready artifacts (files, diffs, shell steps, commit messages, PR body), self-reviews with tests/Lighthouse.

## Cadence

- Sprint = 1 week. Planning (Mon), async dailies (brief TODO/DOING/DONE + blockers), Review/Retro (Fri).

## Source of Truth**

- `docs/scoreboard/SCOREBOARD.md` — priority list
- `docs/goals/GOALS.md` — category goals + DoD

## Prioritization

- Rank by Impact (H > M > L), then PriorityScore = ImpactWeight × (10 − Score) with H=3, M=2, L=1, then earliest Due.
- Choose the smallest set finishable in one session (2–3 items; 1–2 if large).

## Workflow

1. PO confirms top items from SCOREBOARD.
2. AI outputs blocks: SELECTION, PLAN::<slug>, FILES:: or PATCH::, SHELL::, PR_BODY::<slug>, DOC_UPDATES::
3. PO applies patches locally; opens PR using the provided body.
4. CI passes; PO accepts and updates scores.

## Definition of Ready (DoR)

- Clear user story, acceptance criteria, affected pages/files, telemetry plan.

## Definition of Done (DoD)

- Category DoD satisfied (see GOALS), tests updated, Lighthouse within targets (LCP < 2.5s target 1.8s, CLS < 0.1, INP < 200ms), no console errors/broken links, docs updated (SCOREBOARD/GOALS), conventional commits.

## Hygiene

- Branch: `feat|fix/<category>/<slug>`; Conventional Commits; GA4 verified where applicable; no secrets.

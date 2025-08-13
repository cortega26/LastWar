# Prompt Playbook for the AI Assistant

Use these frames within the session structure (SELECTION → PLAN → FILES/PATCH → SHELL → PR_BODY → DOC_UPDATES).

## 1) Implement a Feature / Page
**Provide:**
- User story, acceptance criteria (DoD-aligned), affected pages, branch name, telemetry, test plan.
- Full file contents for new/rewritten files (FILES::); unified diffs for surgical edits (PATCH::).
- Minimal SHELL commands (git checkout/apply/add/commit).
- PR body with checklist and evidence (screens/Lighthouse).

## 2) Fix a Bug
**Provide:**
- Repro steps, suspected root cause, proposed fix.
- Tests and risk assessment.
- FILES/PATCH, SHELL, PR body, doc updates.

## 3) SEO Improvement
**Provide:**
- Pages, proposed titles/meta, schema additions, and at least 3 internal links.
- Evidence of duplicate-avoidance and crawlability checks.

## 4) Analytics Instrumentation
**Provide:**
- GA4 event name + parameters; success definition.
- Steps to validate in debug view; KPI note.

## 5) Performance Optimization
**Provide:**
- Current pain points (bundle/CLS/LCP notes), prioritized fixes with measurable targets.
- Before/after Lighthouse summary.

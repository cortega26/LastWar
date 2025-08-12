# AI Work Contract — LastWar

**Purpose**: Operate this repo with AI agents as the engineering team and Scrum master, using `goals.csv` (catalog) and `scoreboard.csv` (snapshot).

## Single Source of Truth
- `goals.csv`: `goal_id, goal_title, area, priority_letter/num, tags, owner_handle`
- `scoreboard.csv`: `goal_id, status, progress_pct, next_action, last_updated, auto_added, confidence, kpi_*`

## Golden Rules
1. **Read first**: Agents must read both CSVs before acting. Always filter by highest `priority_num` and lowest `progress_pct`.
2. **Lock before work**: Acquire a lock for the `goal_id` (see `scripts/with_goal_lock.sh`) to avoid concurrent edits.
3. **Small increments**: Implement the smallest valuable change, with tests.
4. **Tests before progress**: Only bump `progress_pct` after running `scripts/run_tests.sh` successfully.
5. **Traceability**: Use the commit message convention with `[goal:{goal_id}]`. Open a PR if changes are non-trivial.
6. **Update state**: On success, run `scripts/update_scoreboard.py --goal-id {goal_id} --status in_progress --progress +5 --next-action "…"`. On completion, set `status=done` and `progress=100`.

## Status & Priority
- `status` ∈ {not_started, in_progress, blocked, at_risk, done, on_hold, cancelled}
- `priority_letter` ∈ {H,M,L}, `priority_num` ∈ {3,2,1}

## Workflow (per goal)
1. **Select**: Pick a goal (or take the one assigned).
2. **Lock**: `scripts/with_goal_lock.sh {goal_id} -- your-command-here`
3. **Plan**: Generate a short plan (max 5 steps). Keep scope minimal.
4. **Implement**: Modify code; write/update tests.
5. **Test**: `scripts/run_tests.sh` must pass.
6. **Commit**: Use the template. Include `[goal:{goal_id}]` and a terse summary.
7. **Update scoreboard**: Use `scripts/update_scoreboard.py`.
8. **Unlock**: The lock script cleans up on exit; if it didn’t, delete the `.locks/{goal_id}.lock` file.

## Do / Don’t
- **Do**: Leave the repo better than you found it (small refactors ok). Keep PRs atomic.
- **Don’t**: Change schema of `goals.csv`/`scoreboard.csv` without approval.
- **Don’t**: Inflate progress without tests.

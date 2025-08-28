"""
Update scoreboard.csv for a specific goal_id.
- Validates status & progress range.
- Supports incremental progress via `--progress +N` or absolute via `--progress N`.
- Backs up the original file unless --no-backup is set.
"""
import argparse
import datetime as dt
import os
import sys
import pandas as pd

ALLOWED_STATUS = {"not_started", "in_progress",
                  "blocked", "at_risk", "done", "on_hold", "cancelled"}


def parse_progress(arg: str):
    s = str(arg).strip()
    if s.startswith(("+", "-")):
        return s[0], float(s[1:])
    return None, float(s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", default="scoreboard.csv",
                    help="Path to scoreboard.csv")
    ap.add_argument("--goal-id", required=True, help="goal_id to update")
    ap.add_argument("--status", help=f"one of {sorted(ALLOWED_STATUS)}")
    ap.add_argument("--progress", help="absolute 0..100 or delta like +5 / -3")
    ap.add_argument("--next-action", dest="next_action",
                    help="Set next_action text")
    ap.add_argument("--no-backup", action="store_true",
                    help="Do not write a .bak file")
    args = ap.parse_args()

    if not os.path.exists(args.file):
        print(
            f"ERROR: scoreboard file not found: {args.file}", file=sys.stderr)
        sys.exit(2)

    df = pd.read_csv(args.file)

    if "goal_id" not in df.columns:
        print("ERROR: scoreboard.csv missing goal_id column", file=sys.stderr)
        sys.exit(2)

    mask = df["goal_id"].astype(str) == str(args.goal_id)
    if not mask.any():
        print(f"ERROR: goal_id not found: {args.goal_id}", file=sys.stderr)
        sys.exit(2)

    # status
    if args.status:
        s = args.status.strip().lower()
        if s not in ALLOWED_STATUS:
            print(
                f"ERROR: invalid status '{s}'. Allowed: {sorted(ALLOWED_STATUS)}", file=sys.stderr)
            sys.exit(2)
        df.loc[mask, "status"] = s

    # progress
    if args.progress is not None:
        sign, val = parse_progress(args.progress)
        if sign is None:
            # absolute
            newp = max(0.0, min(100.0, float(val)))
            df.loc[mask, "progress_pct"] = newp
        else:
            # delta
            cur = pd.to_numeric(
                df.loc[mask, "progress_pct"], errors="coerce").fillna(0.0)
            newp = (cur + (val if sign == "+" else -val)
                    ).clip(lower=0.0, upper=100.0)
            df.loc[mask, "progress_pct"] = newp

    # next_action
    if args.next_action is not None:
        df.loc[mask, "next_action"] = args.next_action.strip()

    # last_updated -> today (ISO)
    today = dt.date.today().isoformat()
    if "last_updated" in df.columns:
        df.loc[mask, "last_updated"] = today
    else:
        df.insert(len(df.columns), "last_updated", today)

    # backup
    if not args.no_backup:
        bak = args.file + ".bak"
        df.to_csv(bak, index=False, encoding="utf-8")

    df.to_csv(args.file, index=False, encoding="utf-8")
    print(f"Updated {mask.sum()} row(s) for goal_id={args.goal_id}.")


if __name__ == "__main__":
    main()

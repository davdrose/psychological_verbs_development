"""
parse_children.py

Parse the Lookit / Children Helping Science response exports for the three
children experiments into anonymized long-format CSVs for analysis in code/R/.

Raw input (identifiable, NOT committed -- see .gitignore):
    data/Join-Adventures-with-drums-and-balloons-_all-responses-identifiable.json   (exp1)
    data/Join-Adventures-with-Amy--Ben--and-other-friends-_all-responses-identifiable.json (exp2)
    data/Join-Adventures-with-Robots-and-Clowns-_all-responses-identifiable.json    (exp3)

Output (anonymized):
    data/exp1_child_clean.csv, data/exp2_child_clean.csv, data/exp3_child_clean.csv

Only de-identified fields are written: Lookit's hashed child id, the rounded
age, gender, and the experimental factors / responses. No names, birthdates, or
test dates are carried over.

Design (all between/​within established empirically):
  - exp1  between-subjects verb type: control = causal verbs (pop/break),
          experimental = psychological verbs (sad/angry); scenario balloon/drum.
          A few children saw all four verbs (condition = "both") and are excluded
          from the between-subjects analysis.
  - exp2  between-subjects domain: physical / mental; scenario hurt/shock.
  - exp3  single condition; scenario scared/surprised.

Choice images are always (left=distal, right=proximal), so response 0 -> distal,
1 -> proximal.

Run from anywhere:  python code/python/parse_children.py
"""

import json
import csv
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "data"

FILES = {
    "exp1": "Join-Adventures-with-drums-and-balloons-_all-responses-identifiable.json",
    "exp2": "Join-Adventures-with-Amy--Ben--and-other-friends-_all-responses-identifiable.json",
    "exp3": "Join-Adventures-with-Robots-and-Clowns-_all-responses-identifiable.json",
}

COLUMNS = ["experiment", "child_id", "condition", "scenario", "verb",
           "question", "response", "distal", "proximal",
           "age_days", "age_years", "age_group", "gender"]

# causal verbs -> control, psychological verbs -> experimental (exp1)
EXP1_VERB_CONDITION = {"pop": "control", "break": "control",
                       "sad": "experimental", "angry": "experimental"}


def parse_trial(exp, video):
    """Return (condition_hint, scenario, verb, question) from a test-trial video name."""
    parts = video.split("_")
    question = "cause" if parts[-1] == "caused" else parts[-1]   # caused -> cause
    if exp == "exp1":
        # balloon_pop_caused -> scenario=balloon, verb=pop
        scenario, verb = parts[0], parts[1]
        return EXP1_VERB_CONDITION.get(verb, ""), scenario, verb, question
    if exp == "exp2":
        # physical_shock_lexical -> domain=physical, scenario=shock
        domain, scenario = parts[0], parts[1]
        return domain, scenario, "", question
    # exp3: scared_caused -> scenario=scared
    return "all", parts[0], "", question


def child_condition(exp, per_child_conditions):
    """Collapse a child's per-trial condition hints to a single condition."""
    conds = set(per_child_conditions)
    if exp == "exp1":
        if conds == {"control"}:
            return "control"
        if conds == {"experimental"}:
            return "experimental"
        return "both"          # saw both verb types -> excluded downstream
    if exp == "exp2":
        return conds.pop() if len(conds) == 1 else "both"
    return "all"


def parse_experiment(exp):
    data = json.loads((DATA / FILES[exp]).read_text(encoding="utf-8"))
    out_rows = []
    n_completed = n_excluded_both = 0

    for entry in data:
        resp = entry.get("response", {})
        child = entry.get("child", {})
        if resp.get("is_preview") or not resp.get("completed"):
            continue
        n_completed += 1

        try:
            age_days = int(child.get("age_rounded", ""))
        except (ValueError, TypeError):
            age_days = None
        age_years = round(age_days / 365.25, 2) if age_days else ""
        age_group = int(age_days / 365.25) if age_days else ""

        trials = []
        cond_hints = []
        for t in entry.get("exp_data", []):
            if "left_label" not in t or "scenario" not in t:
                continue
            if t.get("scenario") == "warmup":
                continue
            video = t.get("video", "")
            resp_idx = t.get("response")
            label = (t.get("left_label") if resp_idx == 0
                     else t.get("right_label") if resp_idx == 1 else "")
            cond_hint, scenario, verb, question = parse_trial(exp, video)
            cond_hints.append(cond_hint)
            trials.append((scenario, verb, question, label))

        condition = child_condition(exp, cond_hints)
        if condition == "both":
            n_excluded_both += 1
            continue

        for scenario, verb, question, label in trials:
            distal = 1 if label == "distal" else 0 if label == "proximal" else ""
            proximal = 1 if label == "proximal" else 0 if label == "distal" else ""
            out_rows.append({
                "experiment": exp,
                "child_id": child.get("hashed_id", ""),
                "condition": condition,
                "scenario": scenario,
                "verb": verb,
                "question": question,
                "response": label,
                "distal": distal,
                "proximal": proximal,
                "age_days": age_days if age_days else "",
                "age_years": age_years,
                "age_group": age_group,
                "gender": child.get("gender", ""),
            })

    out_file = DATA / f"{exp}_child_clean.csv"
    with out_file.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(out_rows)

    n_kept = len({r["child_id"] for r in out_rows})
    print(f"{exp}: {out_file.name}  ({n_kept} children, {len(out_rows)} rows; "
          f"completed={n_completed}, excluded 'both'={n_excluded_both})")


def main():
    for exp in FILES:
        parse_experiment(exp)


if __name__ == "__main__":
    main()

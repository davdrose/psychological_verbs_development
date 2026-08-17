"""
clean_exp1.py

Merge the raw Proliferate export for Experiment 1 (between-subjects: causal vs.
psychological verbs, drum + balloon scenarios) into a single tidy long-format
CSV for analysis in code/R/.

Raw input : data/exp1/  (the 7 split CSVs from a Proliferate "what_happened" query)
Output    : data/exp1_clean.csv

Long format: one row per participant x scenario x question, with the chosen
response coded as distal / proximal (0/1), following the example-repo convention
(cf. data/exp1_child_clean.csv in cause_fault_dev).

Note on conditions:
  - control      shows causal verbs  -> balloon: "pop",  drum: "break"
  - experimental shows psych verbs   -> balloon: "sad",  drum: "anger"
The two conditions store their responses under different column names in
responses.csv. This script maps both; experimental columns that are absent from
the export (e.g. before the responses are re-exported) simply yield missing
responses, which are dropped with a warning.

Run from anywhere:  python code/python/clean_exp1.py
"""

import sys
from pathlib import Path

import pandas as pd

REPO = Path(__file__).resolve().parents[2]
RAW_DIR = REPO / "data" / "exp1"
OUT_FILE = REPO / "data" / "exp1_adult_clean.csv"

# response column name in responses.csv, keyed by condition -> (scenario, question)
RESPONSE_MAP = {
    "control": {
        ("balloon", "cause"):   "balloon_cause_pop",
        ("balloon", "lexical"): "balloon_pop",
        ("drum",    "cause"):   "drum_cause_break",
        ("drum",    "lexical"): "drum_break",
    },
    "experimental": {
        ("balloon", "cause"):   "balloon_cause_sad",
        ("balloon", "lexical"): "balloon_sad",
        ("drum",    "cause"):   "drum_cause_anger",
        ("drum",    "lexical"): "drum_anger",
    },
}

# verb shown for each (condition, scenario)
VERB_MAP = {
    ("control", "balloon"): "pop",
    ("control", "drum"): "break",
    ("experimental", "balloon"): "sad",
    ("experimental", "drum"): "anger",
}


def find_one(suffix):
    """Locate the single raw CSV whose name ends with `suffix` (prefix varies)."""
    matches = sorted(RAW_DIR.glob(f"*{suffix}"))
    if not matches:
        sys.exit(f"ERROR: no file matching *{suffix} in {RAW_DIR}")
    if len(matches) > 1:
        print(f"  warning: multiple files match *{suffix}, using {matches[0].name}")
    return matches[0]


def read(suffix):
    return pd.read_csv(find_one(suffix), dtype=str).fillna("")


def main():
    condition = read("-condition.csv").set_index("workerid")
    pid = read("-participant_id.csv").set_index("workerid")
    participants = read("-participants (1).csv")
    if "workerid" not in participants.columns:
        participants = read("-participants.csv")
    participants = participants.set_index("workerid")
    qol = read("-question_order_label.csv").set_index("workerid")
    responses = read("-responses.csv").set_index("workerid")

    # The main responses.csv (a "what_happened" query) only carries the control
    # condition's response columns. The experimental condition's responses
    # (balloon_cause_sad / balloon_sad / drum_anger / drum_cause_anger) were
    # exported separately; merge any such file in by workerid so both conditions
    # are covered.
    for extra in sorted(RAW_DIR.glob("*experimental_responses*.csv")):
        exp_resp = (pd.read_csv(extra, dtype=str).fillna("")
                    .drop_duplicates("workerid").set_index("workerid"))
        add_cols = [c for c in exp_resp.columns
                    if c not in ("proliferate.condition", "error")
                    and c not in responses.columns]
        responses = responses.join(exp_resp[add_cols], how="left").fillna("")
        print(f"  merged experimental responses from {extra.name} "
              f"({exp_resp.shape[0]} participants)")

    workers = list(condition.index)
    rows = []
    missing_response = 0

    for wid in workers:
        cond = condition.loc[wid, "condition"]
        resp_row = responses.loc[wid] if wid in responses.index else None
        for (scenario, question), col in RESPONSE_MAP.get(cond, {}).items():
            resp = ""
            if resp_row is not None and col in responses.columns:
                resp = str(resp_row[col]).strip().lower()

            if resp not in ("distal", "proximal"):
                missing_response += 1
                distal, proximal = "", ""
            else:
                distal = 1 if resp == "distal" else 0
                proximal = 1 if resp == "proximal" else 0

            rows.append({
                "workerid": wid,
                "participant_id": pid.loc[wid, "participant_id"] if wid in pid.index else "",
                "condition": cond,
                "scenario": scenario,
                "question": question,
                "verb": VERB_MAP.get((cond, scenario), ""),
                "response": resp,
                "distal": distal,
                "proximal": proximal,
                "question_order_label": qol.loc[wid, "question_order_label"] if wid in qol.index else "",
                "age": participants.loc[wid, "age"] if wid in participants.index else "",
                "gender": participants.loc[wid, "gender"] if wid in participants.index else "",
                "race": participants.loc[wid, "race"] if wid in participants.index else "",
                "ethnicity": participants.loc[wid, "ethnicity"] if wid in participants.index else "",
            })

    df = pd.DataFrame(rows)
    # keep only rows with a coded response for the analysis-ready file
    df_clean = df[df["response"].isin(["distal", "proximal"])].reset_index(drop=True)
    df_clean.to_csv(OUT_FILE, index=False)

    # --- summary ----------------------------------------------------------
    print(f"wrote {OUT_FILE.relative_to(REPO)}")
    print(f"  participants: {len(workers)}")
    by_cond = condition["condition"].value_counts().to_dict()
    print(f"  by condition (all): {by_cond}")
    coded = (
        df_clean.groupby("condition")["workerid"].nunique().to_dict()
    )
    print(f"  participants with coded responses: {coded}")
    print(f"  long rows written: {len(df_clean)}  (missing/uncoded cells skipped: {missing_response})")
    if coded.get("experimental", 0) == 0:
        print("  NOTE: no experimental responses found -> re-export responses.csv "
              "with columns balloon_cause_sad / balloon_sad / drum_anger / drum_cause_anger")


if __name__ == "__main__":
    main()

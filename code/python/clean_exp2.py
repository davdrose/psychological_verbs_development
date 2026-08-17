"""
clean_exp2.py

Merge the raw Proliferate export for Experiment 2 (absence scenarios; physical
vs. mental domain) into a single tidy long-format CSV for analysis in code/R/.

Raw input : data/exp2/  (split CSVs from a Proliferate "what_happened" query)
Output    : data/exp2_clean.csv

Design:
  - condition (between-subjects): "physical" | "mental"  (which absence domain)
  - scenario  (within-subject)  : "hurt" | "shock"
  - question                    : "cause" | "lexical"
  - outcome coded distal / proximal (0/1); here the distal cause is the absence.

Response columns are uniform across conditions: "{scenario}_{question}"
(hurt_cause, hurt_lexical, shock_cause, shock_lexical).

Run from anywhere:  python code/python/clean_exp2.py
"""

from pathlib import Path
import sys
import pandas as pd

REPO = Path(__file__).resolve().parents[2]
RAW_DIR = REPO / "data" / "exp2"
OUT_FILE = REPO / "data" / "exp2_clean.csv"

SCENARIOS = ["hurt", "shock"]
QUESTIONS = ["cause", "lexical"]


def find_one(suffix):
    matches = sorted(RAW_DIR.glob(f"*{suffix}"))
    if not matches:
        sys.exit(f"ERROR: no file matching *{suffix} in {RAW_DIR}")
    return matches[0]


def read(suffix):
    return pd.read_csv(find_one(suffix), dtype=str).fillna("")


def dedup(df, dup_report=None):
    """Drop duplicate workerids (keep first); record any that were duplicated."""
    dups = df.loc[df["workerid"].duplicated(), "workerid"].unique().tolist()
    if dup_report is not None:
        dup_report.update(dups)
    return df.drop_duplicates("workerid", keep="first").set_index("workerid")


def main():
    dup_wids = set()
    condition = dedup(read("-condition.csv"), dup_wids)
    pid = dedup(read("-participant_id.csv"))
    participants = dedup(read("-participants.csv"))
    responses = dedup(read("-responses.csv"))

    rows = []
    missing = 0
    for wid in condition.index:
        cond = condition.loc[wid, "condition"]
        resp_row = responses.loc[wid] if wid in responses.index else None
        for scenario in SCENARIOS:
            for question in QUESTIONS:
                col = f"{scenario}_{question}"
                resp = ""
                if resp_row is not None and col in responses.columns:
                    resp = str(resp_row[col]).strip().lower()
                if resp not in ("distal", "proximal"):
                    missing += 1
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
                    "response": resp,
                    "distal": distal,
                    "proximal": proximal,
                    "age": participants.loc[wid, "age"] if wid in participants.index else "",
                    "gender": participants.loc[wid, "gender"] if wid in participants.index else "",
                    "race": participants.loc[wid, "race"] if wid in participants.index else "",
                    "ethnicity": participants.loc[wid, "ethnicity"] if wid in participants.index else "",
                })

    df = pd.DataFrame(rows)
    df_clean = df[df["response"].isin(["distal", "proximal"])].reset_index(drop=True)
    df_clean.to_csv(OUT_FILE, index=False)

    print(f"wrote {OUT_FILE.relative_to(REPO)}")
    print(f"  participants: {condition.index.nunique()}")
    print(f"  by condition: {condition['condition'].value_counts().to_dict()}")
    print(f"  long rows written: {len(df_clean)}  (missing/uncoded cells skipped: {missing})")
    if dup_wids:
        print(f"  removed {len(dup_wids)} duplicate workerid submission(s) "
              f"(kept first): {sorted(dup_wids)}")


if __name__ == "__main__":
    main()

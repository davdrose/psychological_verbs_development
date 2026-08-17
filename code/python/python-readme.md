# Python

Data-cleaning / preprocessing scripts.

## Adults — `clean_exp1.py`, `clean_exp2.py`, `clean_exp3.py`

Merge each experiment's raw Proliferate export (`data/expN/`) into a tidy
long-format `data/expN_adult_clean.csv` (one row per participant × scenario ×
question; response coded `distal` / `proximal`, 0/1).

- **exp1** — control response columns come from the main `-responses.csv`; the
  experimental responses are merged in from `data/exp1/drums_experimental_responses.csv`.
- **exp2 / exp3** — uniform response columns (`{scenario}_{question}`).
- exp2/exp3 drop duplicate `workerid` submissions (keep first) and print which.

Run: `python code/python/clean_expN.py` (works from any directory). Requires `pandas`.

## Children — `parse_children.py`

Parses the three Lookit / CHS response exports into anonymized long-format
`data/expN_child_clean.csv` (adds `age_days`, `age_years`, `age_group`, `gender`).

- Choice images are always (left = distal, right = proximal), so `response` 0 → distal.
- Only completed, non-preview sessions are kept; condition is inferred per child
  (exp1: causal vs. psych verbs; exp2: physical vs. mental). exp1 children who saw
  all four verbs are excluded.
- **Only de-identified fields are written** — no names, birthdates, or test dates.
  The raw `*identifiable*.json` inputs are git-ignored; keep them locally to re-run.

Run: `python code/python/parse_children.py`. Requires `pandas` (stdlib `json`/`csv`).

# Data

Anonymized data for the psychological-verbs experiments.

## Experiment 1 — `exp1/` (raw) and `exp1_clean.csv` (analysis-ready)

Adults, between-subjects (causal vs. psychological verbs; drum + balloon scenarios), run in jsPsych via Proliferate.

- **`exp1/`** — the raw Proliferate export, split across several CSVs (one field per file): `-condition`, `-participant_id`, `-participants`, `-question_order_label`, `-question_orders`, `-responses`, `-scenario_order`, plus **`drums_experimental_responses.csv`** (see below).
- **`exp1_clean.csv`** — tidy **long** format produced by [`code/python/clean_exp1.py`](../code/python/clean_exp1.py): one row per participant × scenario × question, with the response coded as `distal` / `proximal` (0/1). Columns: `workerid, participant_id, condition, scenario, question, verb, response, distal, proximal, question_order_label, age, gender, race, ethnicity`. 202 participants (control 101, experimental 101).

To regenerate: `python code/python/clean_exp1.py`

> **Note on the two response files:** the main `-responses.csv` (a "what_happened" query export) only carries the **control** condition's response columns (`balloon_cause_pop, balloon_pop, drum_break, drum_cause_break`). The **experimental** condition's responses (`balloon_cause_sad, balloon_sad, drum_anger, drum_cause_anger`) were exported separately as **`drums_experimental_responses.csv`**; `clean_exp1.py` merges it in by `workerid`. This recovers 101 of the 102 experimental participants (`workerid 1312` is absent from the experimental export).

## Experiment 2 — `exp2/` (raw) and `exp2_clean.csv`

Adults, absence scenarios. **Between-subjects** `condition = physical | mental`; within-subject `scenario = hurt | shock`, `question = cause | lexical`. Response columns are uniform across conditions (`{scenario}_{question}`), so both conditions have complete data.

- **`exp2/`** — raw Proliferate export (split CSVs).
- **`exp2_clean.csv`** — long format from [`code/python/clean_exp2.py`](../code/python/clean_exp2.py); 201 participants (physical 102, mental 99), coded `distal`/`proximal` (here the distal cause is the absence).

> Standard cleaning: 3 duplicate `workerid` submissions (`1122, 1134, 1185`) are removed, keeping each participant's first submission.

## Experiment 3 — `exp3/` (raw) and `exp3_clean.csv`

Adults, **single condition**. Within-subject `scenario = excited | scared`, `question = cause | lexical`.

- **`exp3/`** — raw Proliferate export (split CSVs).
- **`exp3_clean.csv`** — long format from [`code/python/clean_exp3.py`](../code/python/clean_exp3.py); 102 participants, coded `distal`/`proximal`.

To regenerate any experiment: `python code/python/clean_expN.py`

# Python

Data-cleaning / preprocessing scripts.

## `clean_exp1.py`

Merges the raw Proliferate export for Experiment 1 (`data/exp1/`, seven split CSVs) into a single tidy long-format file `data/exp1_clean.csv` for analysis in `code/R/`.

- One row per participant × scenario × question; response coded as `distal` / `proximal` (0/1).
- Maps response columns for **both** conditions (control → `pop`/`break`; experimental → `sad`/`anger`). The control responses come from the main `-responses.csv`; the experimental responses are merged in from `drums_experimental_responses.csv` (see [`../../data/data-readme.md`](../../data/data-readme.md)).

Run: `python code/python/clean_exp1.py`  (works from any directory)

## `clean_exp2.py` / `clean_exp3.py`

Same idea for Experiments 2 and 3, whose Proliferate exports use uniform response columns (`{scenario}_{question}`):

- **`clean_exp2.py`** → `data/exp2_clean.csv` (absence scenarios; between-subjects `physical`/`mental`; scenarios `hurt`/`shock`).
- **`clean_exp3.py`** → `data/exp3_clean.csv` (single condition; scenarios `excited`/`scared`).

Both drop duplicate `workerid`s (keep first) and print a warning listing them — exp2 has 3 (`1122, 1134, 1185`), two with conflicting responses.

Requires: `pandas`.

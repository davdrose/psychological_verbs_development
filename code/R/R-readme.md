# R

Analysis and figure-generation scripts.

## `exp1.R`

Experiment 1 (causal vs. psychological verbs; drum & balloon).

- Reads `../../data/exp1_clean.csv`.
- Computes the proportion of **distal** (causal-candidate) responses per condition × scenario × question, with bootstrapped 95% CIs.
- Saves `../../figures/exp1/exp1_caused_vs_lexical.{pdf,png}`.
- Both conditions (causal verbs / psychological verbs) are shown; the experimental responses are merged in from `drums_experimental_responses.csv` (see [`../../data/data-readme.md`](../../data/data-readme.md)).

## `exp2.R`

Experiment 2 (absence scenarios; physical vs. mental). Reads `../../data/exp2_clean.csv`; proportion distal per condition × scenario × question with bootstrapped 95% CIs; saves `../../figures/exp2/exp2_caused_vs_lexical.{pdf,png}`.

## `exp3.R`

Experiment 3 (scared vs. excited; single condition). Reads `../../data/exp3_clean.csv`; saves `../../figures/exp3/exp3_caused_vs_lexical.{pdf,png}`.

---

Run each from this folder, e.g. `Rscript exp2.R`. Requires: `readr`, `dplyr`, `tidyr`, `ggplot2`.

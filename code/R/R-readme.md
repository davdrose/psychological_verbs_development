# R

Analysis and figure-generation scripts.

## `helpers.R`

Shared code sourced by the per-experiment scripts:
- `boot_ci()` / `point_ci()` — participant-level bootstrapped means and 95% CIs.
- `plot_dev()` — builds the combined **developmental figure**: children by age
  (logistic-GLM smooth + per-age means) alongside an **Adults** column, coloured
  by question (caused = red, lexical = blue), optionally faceted by condition.

## `exp1.R`, `exp2.R`, `exp3.R`

Each reads `../../data/expN_adult_clean.csv` and `../../data/expN_child_clean.csv`
and saves `../../figures/expN/expN_development.{pdf,png}`.

- **exp1** — faceted Control (causal verbs) vs. Experimental (psych verbs).
- **exp2** — faceted Physical vs. Mental (absence scenarios).
- **exp3** — single panel (scared vs. surprised).

Run each from this folder, e.g. `Rscript exp1.R`.
Requires: `readr`, `dplyr`, `tidyr`, `ggplot2`.

> The smooth is a descriptive logistic GLM over age (children); it does not model
> the participant-level clustering. A full Bayesian mixed model (as in the
> reference repos, via `brms`) can be added later.

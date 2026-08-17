# Data

Anonymized data for the three psychological-verbs experiments. Each experiment
has an **adults** version (jsPsych / Proliferate) and a **children** version
(Lookit / Children Helping Science).

## Files per experiment

| file | who | description |
|---|---|---|
| `expN/` | adults | raw Proliferate export (split CSVs) |
| `expN_adult_clean.csv` | adults | tidy long format from [`code/python/clean_expN.py`](../code/python/clean_expN.py) |
| `expN_child_clean.csv` | children | tidy long format from [`code/python/parse_children.py`](../code/python/parse_children.py) |

Both `*_clean.csv` files are **long** (one row per participant × scenario ×
question) with the response coded `distal` / `proximal` (0/1). The child files
additionally carry `age_days`, `age_years`, `age_group`, and `gender`.

## Privacy — raw children exports are NOT committed

The raw Lookit exports (`Join-Adventures-*_all-responses-identifiable.json`) are
**identifiable** and are git-ignored (see [`.gitignore`](../.gitignore)). Only the
anonymized `expN_child_clean.csv` (hashed child id, rounded age, gender, and the
experimental factors/responses — no names, birthdates, or test dates) are
committed. Keep the raw JSONs locally to be able to re-run `parse_children.py`.

## Per-experiment notes

- **exp1** — drum & balloon. Adults **between-subjects** (control = causal verbs
  `break`/`pop`; experimental = psych verbs `angry`/`sad`). Children between-subjects
  too (verb type inferred from the verbs a child saw); 18 children who saw all four
  verbs are excluded (`condition = both`). Adult experimental responses were
  recovered from `exp1/drums_experimental_responses.csv` and merged in by `workerid`
  (`clean_exp1.py`); adult `workerid 1312` is absent from that export.
- **exp2** — absence scenarios; **between-subjects** `physical` / `mental`; scenarios
  `hurt` / `shock`. Adults: 3 duplicate `workerid` submissions (`1122, 1134, 1185`)
  are removed keeping each participant's first submission.
- **exp3** — single condition; scenarios `scared` / `surprised` (the second scenario
  is labelled `excited` in the adult export — the same scenario under a different name;
  the figures collapse across scenarios).

To regenerate: `python code/python/clean_exp{1,2,3}.py` (adults) and
`python code/python/parse_children.py` (children).

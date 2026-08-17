# Data

Here you will find anonymized data from all experiments. Each experiment has an
**adults** version (jsPsych / Proliferate) and a **children** version
(Lookit / Children Helping Science), organized as:

```
data/
├── experiment1/
│   ├── adults/     exp1_adults.csv   (+ raw/ Proliferate export)
│   └── children/   exp1_children.csv
├── experiment2/    (same layout)
└── experiment3/    (same layout)
```

The `expN_adults.csv` / `expN_children.csv` files are analysis-ready **long**
format (one row per participant × scenario × question) with the response coded
`distal` / `proximal` (0/1) and demographics included. The between-subjects
condition is a column (`condition`): control/experimental for exp1,
physical/mental for exp2; exp3 has a single condition. Regenerate the adult files
with `code/python/clean_expN.py` and the child files with
`code/python/parse_children.py`.

**Privacy:** the raw children exports (`*_all-responses-identifiable.json`) are
identifiable and are git-ignored; only the anonymized `expN_children.csv` (hashed
child id, rounded age, gender, factors and responses — no names, birthdates, or
test dates) are committed. Keep the raw JSONs locally to re-run the parser.

## Experiment 1 — causal vs. psychological verbs (drum & balloon)

### adults

Contains `exp1_adults.csv` (trial + demographic data). Between-subjects:
`condition` = control (causal verbs break/pop) or experimental (psych verbs
angry/sad). The `raw/` folder holds the Proliferate export; experimental
responses were exported separately as `drums_experimental_responses.csv` and are
merged in by `clean_exp1.py` (adult `workerid 1312` is missing from that export).

### children

Contains `exp1_children.csv` (trial + demographic data). Between-subjects too
(verb type inferred from the verbs a child saw); children who saw all four verbs
are excluded. ~30 children per condition per age group (3–9).

## Experiment 2 — absence scenarios (physical vs. mental)

### adults

Contains `exp2_adults.csv`. Between-subjects `condition` = physical / mental;
scenarios hurt / shock. Three duplicate `workerid` submissions are removed
(keeping each participant's first submission).

### children

Contains `exp2_children.csv` (still being collected).

## Experiment 3 — scared vs. surprised

### adults

Contains `exp3_adults.csv` (single condition). The Proliferate export labels the
second scenario `excited`; `clean_exp3.py` relabels it `surprised` to match the
children data.

### children

Contains `exp3_children.csv` (single condition; scenarios scared / surprised).

---

*Children are included when they answered all test questions (Lookit's `completed`
flag is not used, as it is often False even for complete sessions); duplicate
children are de-duplicated and only ages 3–9 are kept.*

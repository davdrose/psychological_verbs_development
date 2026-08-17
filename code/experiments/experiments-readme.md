# Experiments

This project investigates how children and adults map **psychological verbs** (e.g. *angry*, *sad*, *scared*, *surprised*) versus **causal verbs** (e.g. *break*, *pop*) onto different causes in a causal chain. There are three experiments, each with a **children** version and an **adults** version.

- **Children** versions were run on [Children Helping Science / Lookit](https://childrenhelpingscience.com/) (`children/`).
- **Adults** versions were run in [jsPsych](https://www.jspsych.org/) and hosted via [Proliferate](https://proliferate.alps.science/) (`adults/`).

Each experiment lives in its own folder so we always have a record of exactly what it looked like when it was run:

```
experiments/
├── experiment1/          # causal vs. psychological verbs (drum & balloon), between-subjects
│   ├── children/
│   └── adults/
├── experiment2/          # physical vs. mental scenarios (shock / hurt)
│   ├── children/
│   └── adults/
└── experiment3/          # scared vs. surprised
    ├── children/
    └── adults/
```

## Children folder layout

Each `experimentN/children/` folder contains:

- `jspsych/` — the jsPsych experiment code. Paste the contents of this `.js` file directly into the **"jsPsych Experiment Code"** editor on childrenhelpingscience.com.
- `json/` — the Lookit **protocol** JSON for the study.
- `response_images/` — the answer-choice / stimulus images.
- `mp4/` — the scenario, warm-up, and framing videos.

### Media hosting

At run time the children experiment code loads media from a separate hosting repository rather than from local files. See the `BASE` constant near the top of each `jspsych/*.js`:

```
https://raw.githubusercontent.com/CSLouise/lookit_material/master/children_pilot1_psych_verb_expN/
```

The `mp4/` and `response_images/` folders here are a self-contained archive of that hosted material (repo: [`CSLouise/lookit_material`](https://github.com/CSLouise/lookit_material)). If the material is re-hosted, update the `BASE` URL in the `.js` file accordingly.

### Previewing a children experiment on Lookit

1. Create a dummy experiment on [Lookit](https://childrenhelpingscience.com/).
2. Go to **"Edit Study Design"** in the right-hand column.
3. Paste the `json/` protocol into **"Protocol Configuration"** and paste the `jspsych/*.js` into the **"jsPsych Experiment Code"** editor.
4. Click **"Save Changes"**, then **"Preview Study"**.

*Note: a Lookit researcher account is required. Register [here](https://childrenhelpingscience.com/registration/).*

## Adults folder layout

Each `experimentN/adults/` folder is a self-contained jsPsych experiment. Open `index.html` in a browser to run it locally.

- `index.html` — builds the jsPsych timeline; loads jsPsych 7.2.3 and plugins from the unpkg CDN and submits data via Proliferate.
- `js/` — `intro.js`, `consent.js`, `trial.js`, `demographic_form.js`, plus bundled `jquery.min.js` / `jquery-ui.min.js`.
- `images/` — stimulus slides (referenced by **local relative paths**, so they must stay with the experiment), grouped per scenario.
- `convert_data_to_csv.py` — converts the collected Proliferate data export to CSV. *(helper; may later move to `code/python/`.)*
- `get_image_size.py` — small dev utility for checking image dimensions.

Experiment 1 (between-subjects) has two condition subfolders instead of a single flat experiment:

```
experiment1/adults/
├── control/          # causal verbs   (break / pop)      — index.html + js/ + images/
├── experimental/     # psychological verbs (angry / sad) — index.html + js/ + images/
├── convert_data_to_csv.py
└── get_image_size.py
```

### Provenance

The adults folders were pulled from the working repo `causal_verb_experiments`:

| experiment | source folder | notes |
|---|---|---|
| experiment1/adults | `experiment3_pilot6_betweensubject` | kept `control/` + `experimental/`; an earlier single-condition (`condition_type = "present"`) top-level version was dropped |
| experiment2/adults | `experiment4_absence_physical_v3` | copied as-is |
| experiment3/adults | `experiment5_scare_surprise_v3` | copied as-is |

---

## Experiment 1 — causal vs. psychological verbs (drum & balloon)

**Design:** between-subjects. Each participant sees **both** scenarios (drum + balloon) and answers 2 questions per scenario.

- **control** group → causal verbs only: *break* (drum) + *pop* (balloon)
- **experimental** group → psychological verbs only: *angry* (drum) + *sad* (balloon)

**Within-subject counterbalancing (4 conditions per group):** scenario order (drum first | balloon first) × question order (caused first | lexical first). In the children version, groups are balanced via CHS `chs.conditions`; in the adults version, the two groups are the `control/` and `experimental/` subfolders.

## Experiment 2 — physical vs. mental scenarios

**Scenarios:** `physical_shock`, `physical_hurt`, `mental_shock`, `mental_hurt`.

**Counterbalancing (8 conditions):** domain (physical first | mental first) × scenario order within domain (shock first | hurt first) × question order (lexical first | caused first).

Each scenario runs as: `test_case_intro` → scenario video → 2 questions. Each question shows a question video / prompt alongside the distal/proximal choice images.

## Experiment 3 — scared vs. surprised

**Scenarios:** `scared`, `surprised`.

**Counterbalancing (4 conditions):** scenario order (scared first | surprised first) × question order (lexical first | caused first).

Each scenario runs as: `test_case_intro` → scenario video → 2 questions, with the same question / choice-image layout as Experiment 2.

---

*The children versions here are **pilot 1** (`children_pilot1_psych_verb_expN`). Add any later rounds as new folders so each run stays reproducible.*

# Code

All code for the project, organized by language / purpose. See each subfolder's
README for details.

- [`R/`](R/) — analysis and figure generation. Reads the cleaned data in
  [`../data/`](../data) and writes the developmental figures to
  [`../figures/`](../figures).
- [`python/`](python/) — data cleaning. `clean_expN.py` turn the raw Proliferate
  (adult) exports into tidy CSVs; `parse_children.py` parses the raw Lookit
  (children) exports into anonymized CSVs.
- [`experiments/`](experiments/) — the experiments exactly as they were run
  (adults in jsPsych, children on Lookit / Children Helping Science), archived one
  folder per experiment.

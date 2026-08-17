# ─────────────────────────────────────────────────────────────────────────
# Experiment 1 — causal vs. psychological verbs (drum & balloon)
# Combined children (by age) + adults developmental figure.
#
# Reads  : ../../data/exp1_adult_clean.csv, ../../data/exp1_child_clean.csv
# Writes : ../../figures/exp1/exp1_development.{pdf,png}
#
# Run from code/R/ :   Rscript exp1.R
# ─────────────────────────────────────────────────────────────────────────

source("helpers.R")

prep <- function(f) {
  read_csv(f, show_col_types = FALSE) %>%
    mutate(distal = as.numeric(distal)) %>%
    filter(!is.na(distal),
           condition %in% c("control", "experimental"),
           question %in% c("cause", "lexical")) %>%
    mutate(question  = factor(recode(question, cause = "caused"),
                              levels = c("caused", "lexical")),
           condition = factor(condition, levels = c("control", "experimental")))
}

child <- prep("../../data/exp1_child_clean.csv")
adult <- prep("../../data/exp1_adult_clean.csv")

facet_labels <- c(control      = "Control (causal verbs: break / pop)",
                  experimental = "Experimental (psych verbs: angry / sad)")

p <- plot_dev(child, adult, facet = "condition", facet_labels = facet_labels,
              title = "Exp 1: causal vs. psychological verbs (between-subjects)",
              y_lab = "Probability of selecting the distal (causal) cause")

ggsave("../../figures/exp1/exp1_development.pdf", p, height = 5.5, width = 12)
ggsave("../../figures/exp1/exp1_development.png", p, height = 5.5, width = 12, dpi = 150)
cat("saved figures/exp1/exp1_development.{pdf,png}\n")

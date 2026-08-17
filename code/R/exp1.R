# ─────────────────────────────────────────────────────────────────────────
# Experiment 1 — causal vs. psychological verbs (drum & balloon)
# Combined children (by age) + adults developmental figure.
#
# Reads  : ../../data/experiment1/adults/exp1_adults.csv,
#          ../../data/experiment1/children/exp1_children.csv
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

child <- prep("../../data/experiment1/children/exp1_children.csv")
adult <- prep("../../data/experiment1/adults/exp1_adults.csv")

facet_labels <- c(control = "non-psychological", experimental = "psychological")

p <- plot_dev(child, adult, facet = "condition", facet_labels = facet_labels,
              title = "Exp 1: non-psychological vs. psychological verbs (between-subjects)",
              y_lab = "distal or proximal cause",
              pole_high = "distal", pole_low = "proximal")

ggsave("../../figures/exp1/exp1_development.pdf", p, height = 5.6, width = 13)
ggsave("../../figures/exp1/exp1_development.png", p, height = 5.6, width = 13, dpi = 150)
cat("saved figures/exp1/exp1_development.{pdf,png}\n")

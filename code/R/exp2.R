# ─────────────────────────────────────────────────────────────────────────
# Experiment 2 — absence scenarios: physical vs. mental domain
# Combined children (by age) + adults developmental figure.
#
# Reads  : ../../data/experiment2/adults/exp2_adults.csv,
#          ../../data/experiment2/children/exp2_children.csv
# Writes : ../../figures/exp2/exp2_development.{pdf,png}
#
# Run from code/R/ :   Rscript exp2.R
# ─────────────────────────────────────────────────────────────────────────

source("helpers.R")

prep <- function(f) {
  read_csv(f, show_col_types = FALSE) %>%
    mutate(distal = as.numeric(distal)) %>%
    filter(!is.na(distal),
           condition %in% c("physical", "mental"),
           question %in% c("cause", "lexical")) %>%
    mutate(question  = factor(recode(question, cause = "caused"),
                              levels = c("caused", "lexical")),
           condition = factor(condition, levels = c("physical", "mental")))
}

child <- prep("../../data/experiment2/children/exp2_children.csv")
adult <- prep("../../data/experiment2/adults/exp2_adults.csv")

facet_labels <- c(physical = "Physical", mental = "Mental")

p <- plot_dev(child, adult, facet = "condition", facet_labels = facet_labels,
              title = "Exp 2: absence scenarios (physical vs. mental)",
              y_lab = "Probability of selecting the distal (absent) cause")

ggsave("../../figures/exp2/exp2_development.pdf", p, height = 5.5, width = 12)
ggsave("../../figures/exp2/exp2_development.png", p, height = 5.5, width = 12, dpi = 150)
cat("saved figures/exp2/exp2_development.{pdf,png}\n")

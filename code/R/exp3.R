# ─────────────────────────────────────────────────────────────────────────
# Experiment 3 — scared vs. surprised (single condition)
# Combined children (by age) + adults developmental figure.
#
# Collapses across the two scenarios (children: scared/surprised;
# adults: scared/excited -- the same two scenarios under different labels).
#
# Reads  : ../../data/experiment3/adults/exp3_adults.csv,
#          ../../data/experiment3/children/exp3_children.csv
# Writes : ../../figures/exp3/exp3_development.{pdf,png}
#
# Run from code/R/ :   Rscript exp3.R
# ─────────────────────────────────────────────────────────────────────────

source("helpers.R")

prep <- function(f) {
  read_csv(f, show_col_types = FALSE) %>%
    mutate(distal = as.numeric(distal)) %>%
    filter(!is.na(distal), question %in% c("cause", "lexical")) %>%
    mutate(question = factor(recode(question, cause = "caused"),
                             levels = c("caused", "lexical")))
}

child <- prep("../../data/experiment3/children/exp3_children.csv")
adult <- prep("../../data/experiment3/adults/exp3_adults.csv")

p <- plot_dev(child, adult, facet = NULL,
              title = "Exp 3: scared & surprised scenarios (pooled)",
              y_lab = "distal or proximal cause",
              pole_high = "distal", pole_low = "proximal")

ggsave("../../figures/exp3/exp3_development.pdf", p, height = 5.2, width = 8)
ggsave("../../figures/exp3/exp3_development.png", p, height = 5.2, width = 8, dpi = 150)
cat("saved figures/exp3/exp3_development.{pdf,png}\n")

# ─────────────────────────────────────────────────────────────────────────
# Experiment 3 — scared vs. excited (single condition)
#
# Within-subject : scenario = excited | scared ; question = caused | lexical
# Outcome coded as choosing the distal (causal candidate) vs. proximal cause.
#
# Reads  : ../../data/exp3_clean.csv   (produced by code/python/clean_exp3.py)
# Writes : ../../figures/exp3/exp3_caused_vs_lexical.{pdf,png}
#
# Run from code/R/ :   Rscript exp3.R
# ─────────────────────────────────────────────────────────────────────────

library(readr)
library(dplyr)
library(tidyr)
library(ggplot2)

theme_set(theme_classic())

df = read_csv("../../data/exp3_clean.csv", show_col_types = FALSE) %>%
  mutate(
    question = factor(question, levels = c("cause", "lexical"),
                                 labels = c("caused", "lexical")),
    scenario = factor(scenario, levels = c("excited", "scared"))
  )

cat("participants with coded responses:", n_distinct(df$workerid), "\n")

# ── proportion distal + bootstrap 95% CI per cell ────────────────────────
boot_ci = function(x, B = 2000) {
  x = x[!is.na(x)]
  if (length(x) == 0) return(c(mean = NA, low = NA, high = NA))
  means = replicate(B, mean(sample(x, replace = TRUE)))
  c(mean = mean(x),
    low  = unname(quantile(means, 0.025)),
    high = unname(quantile(means, 0.975)))
}

set.seed(1)
df.means = df %>%
  group_by(scenario, question) %>%
  summarise(stats = list(boot_ci(distal)), n = n(), .groups = "drop") %>%
  mutate(mean = sapply(stats, `[`, "mean"),
         low  = sapply(stats, `[`, "low"),
         high = sapply(stats, `[`, "high")) %>%
  select(-stats)

cat("\ncell means (proportion distal):\n")
df.means %>% mutate(across(c(mean, low, high), ~round(., 2))) %>% print(n = Inf)

# ── plot ─────────────────────────────────────────────────────────────────
q_cols = c("caused" = "#D55E00", "lexical" = "#0072B2")

p = ggplot(df.means, aes(x = question, y = mean, fill = question)) +
  geom_hline(yintercept = 0.5, linetype = "dashed", colour = "grey40") +
  geom_col(width = 0.6, colour = "black", linewidth = 0.3) +
  geom_errorbar(aes(ymin = low, ymax = high), width = 0.15, linewidth = 0.4) +
  facet_wrap(~scenario, labeller = as_labeller(c(excited = "Excited scenario",
                                                 scared = "Scared scenario"))) +
  scale_fill_manual(values = q_cols, guide = "none") +
  scale_y_continuous(limits = c(0, 1), breaks = seq(0, 1, 0.25),
                     labels = paste0(seq(0, 1, 0.25) * 100, "%")) +
  labs(x = NULL,
       y = "Chose distal (causal candidate)",
       title = "Experiment 3: caused vs. lexical questions",
       subtitle = "Proportion selecting the distal cause (mean ± bootstrapped 95% CI)") +
  theme(plot.title = element_text(face = "bold", size = 15),
        plot.subtitle = element_text(size = 11, colour = "grey30"),
        strip.text = element_text(size = 13),
        axis.title.y = element_text(size = 13),
        axis.text = element_text(size = 11.5))

ggsave("../../figures/exp3/exp3_caused_vs_lexical.pdf", p, height = 5, width = 9)
ggsave("../../figures/exp3/exp3_caused_vs_lexical.png", p, height = 5, width = 9, dpi = 150)
cat("\nsaved figures/exp3/exp3_caused_vs_lexical.{pdf,png}\n")

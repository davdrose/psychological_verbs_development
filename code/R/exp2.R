# ─────────────────────────────────────────────────────────────────────────
# Experiment 2 — absence scenarios: physical vs. mental domain
#
# Between-subjects: condition = physical | mental
# Within-subject : scenario  = hurt | shock ; question = caused | lexical
# Outcome coded as choosing the distal (absent / disconnected) cause vs. proximal.
#
# Reads  : ../../data/exp2_clean.csv   (produced by code/python/clean_exp2.py)
# Writes : ../../figures/exp2/exp2_caused_vs_lexical.{pdf,png}
#
# Run from code/R/ :   Rscript exp2.R
# ─────────────────────────────────────────────────────────────────────────

library(readr)
library(dplyr)
library(tidyr)
library(ggplot2)

theme_set(theme_classic())

df = read_csv("../../data/exp2_clean.csv", show_col_types = FALSE) %>%
  mutate(
    question  = factor(question,  levels = c("cause", "lexical"),
                                   labels = c("caused", "lexical")),
    condition = factor(condition, levels = c("physical", "mental")),
    scenario  = factor(scenario,  levels = c("hurt", "shock"))
  )

cat("participants with coded responses, by condition:\n")
df %>% distinct(condition, workerid) %>% count(condition) %>% print()

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
  group_by(condition, scenario, question) %>%
  summarise(stats = list(boot_ci(distal)), n = n(), .groups = "drop") %>%
  mutate(mean = sapply(stats, `[`, "mean"),
         low  = sapply(stats, `[`, "low"),
         high = sapply(stats, `[`, "high")) %>%
  select(-stats)

cat("\ncell means (proportion distal):\n")
df.means %>% mutate(across(c(mean, low, high), ~round(., 2))) %>% print(n = Inf)

# ── plot ─────────────────────────────────────────────────────────────────
cond_cols = c("physical" = "#009E73", "mental" = "#E69F00")

p = ggplot(df.means, aes(x = question, y = mean, fill = condition)) +
  geom_hline(yintercept = 0.5, linetype = "dashed", colour = "grey40") +
  geom_col(position = position_dodge(width = 0.7), width = 0.6,
           colour = "black", linewidth = 0.3) +
  geom_errorbar(aes(ymin = low, ymax = high),
                position = position_dodge(width = 0.7), width = 0.15,
                linewidth = 0.4) +
  facet_wrap(~scenario, labeller = as_labeller(c(hurt = "Hurt scenario",
                                                 shock = "Shock scenario"))) +
  scale_fill_manual(values = cond_cols, drop = FALSE) +
  scale_y_continuous(limits = c(0, 1), breaks = seq(0, 1, 0.25),
                     labels = paste0(seq(0, 1, 0.25) * 100, "%")) +
  labs(x = NULL,
       y = "Chose distal (absent) cause",
       fill = NULL,
       title = "Experiment 2: caused vs. lexical questions (absence scenarios)",
       subtitle = "Proportion selecting the distal cause (mean ± bootstrapped 95% CI)") +
  theme(legend.position = "bottom",
        plot.title = element_text(face = "bold", size = 15),
        plot.subtitle = element_text(size = 11, colour = "grey30"),
        strip.text = element_text(size = 13),
        axis.title.y = element_text(size = 13),
        axis.text = element_text(size = 11.5),
        legend.text = element_text(size = 12))

ggsave("../../figures/exp2/exp2_caused_vs_lexical.pdf", p, height = 5, width = 9)
ggsave("../../figures/exp2/exp2_caused_vs_lexical.png", p, height = 5, width = 9, dpi = 150)
cat("\nsaved figures/exp2/exp2_caused_vs_lexical.{pdf,png}\n")

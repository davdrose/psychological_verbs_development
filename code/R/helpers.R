# ─────────────────────────────────────────────────────────────────────────
# Shared helpers for the developmental figures (children by age + adults).
# Sourced by exp1.R / exp2.R / exp3.R.
# ─────────────────────────────────────────────────────────────────────────

library(readr)
library(dplyr)
library(tidyr)
library(ggplot2)

theme_set(theme_classic())

# question colours / shapes (match the reference repo: caused = red, lexical = blue)
Q_COLS   <- c(caused = "#dc3410", lexical = "#377EB8")
Q_SHAPES <- c(caused = 16, lexical = 17)          # filled circle / filled triangle
ADULT_X  <- 10.4                                  # x position for the "Adults" column

# percentile bootstrap mean + 95% CI
boot_ci <- function(x, B = 2000) {
  x <- x[!is.na(x)]
  if (!length(x)) return(c(mean = NA, low = NA, high = NA))
  m <- replicate(B, mean(sample(x, replace = TRUE)))
  c(mean = mean(x), low = unname(quantile(m, .025)), high = unname(quantile(m, .975)))
}

# participant-level mean of `distal` per cell, then bootstrap across participants
point_ci <- function(df, id, groups, B = 2000) {
  idm <- df %>%
    group_by(across(all_of(c(groups, id)))) %>%
    summarise(p = mean(distal), .groups = "drop")
  idm %>%
    group_by(across(all_of(groups))) %>%
    summarise(stats = list(boot_ci(p, B)), n_participants = n_distinct(.data[[id]]),
              .groups = "drop") %>%
    mutate(mean = sapply(stats, `[`, "mean"),
           low  = sapply(stats, `[`, "low"),
           high = sapply(stats, `[`, "high")) %>%
    select(-stats)
}

# Build the developmental figure.
#   child : long child rows (distal 0/1, question, age_group, age_years, child_id [+ facet])
#   adult : long adult rows (distal 0/1, question, workerid [+ facet])
#   facet : name of the faceting column (e.g. "condition"), or NULL for a single panel
plot_dev <- function(child, adult, facet = NULL, facet_labels = NULL,
                     title = "", y_lab = "Probability of selecting the distal (causal) cause") {
  set.seed(1)
  gcols <- c(facet, "question")

  child_age  <- child %>% filter(age_group >= 3, age_group <= 9)
  child_pts  <- point_ci(child_age, "child_id", c(gcols, "age_group")) %>%
    rename(x = age_group)
  adult_pts  <- point_ci(adult, "workerid", gcols) %>% mutate(x = ADULT_X)
  pts <- bind_rows(child_pts, adult_pts)

  # per-age / adults sample sizes (collapsed across question) for the axis labels
  n_child <- child_pts %>% group_by(across(all_of(c(facet, "x")))) %>%
    summarise(n = max(n_participants), .groups = "drop")
  n_adult <- adult_pts %>% group_by(across(all_of(c(facet, "x")))) %>%
    summarise(n = max(n_participants), .groups = "drop")
  n_lab <- bind_rows(n_child, n_adult)

  x_breaks <- c(3:9, ADULT_X)
  x_labs   <- c(as.character(3:9), "Adults")

  p <- ggplot() +
    geom_hline(yintercept = .5, linetype = "dashed", colour = "grey55") +
    # smooth developmental trend (children only), logistic GLM
    geom_smooth(data = child_age,
                aes(x = age_years, y = distal, colour = question, fill = question),
                method = "glm", method.args = list(family = binomial),
                se = TRUE, alpha = .15, linewidth = .8, show.legend = FALSE) +
    # per-age and adult means +/- bootstrapped 95% CI
    geom_pointrange(data = pts,
                    aes(x = x, y = mean, ymin = low, ymax = high,
                        colour = question, shape = question),
                    position = position_dodge(width = .5), fatten = 2.2) +
    # n labels along the bottom
    geom_text(data = n_lab, aes(x = x, y = -0.07, label = paste0("n=", n)),
              size = 2.6, colour = "grey35") +
    scale_colour_manual(values = Q_COLS) +
    scale_fill_manual(values = Q_COLS) +
    scale_shape_manual(values = Q_SHAPES) +
    scale_x_continuous(breaks = x_breaks, labels = x_labs, limits = c(2.6, 10.9)) +
    scale_y_continuous(breaks = seq(0, 1, .25), labels = paste0(seq(0, 1, .25) * 100, "%")) +
    coord_cartesian(ylim = c(-0.09, 1), clip = "off") +
    labs(x = "Age (years)", y = y_lab, colour = "Question", shape = "Question",
         title = title) +
    theme(legend.position = "bottom",
          plot.title = element_text(face = "bold", size = 15),
          strip.text = element_text(size = 13),
          axis.title = element_text(size = 13),
          axis.text = element_text(size = 11),
          panel.spacing = unit(1.2, "lines"))

  if (!is.null(facet)) {
    labeller <- if (is.null(facet_labels)) "label_value" else as_labeller(facet_labels)
    p <- p + facet_wrap(vars(.data[[facet]]), labeller = labeller)
  }
  p
}

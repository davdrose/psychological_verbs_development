# ─────────────────────────────────────────────────────────────────────────
# Shared helpers for the developmental figures (children by age + adults).
# Sourced by exp1.R / exp2.R / exp3.R.
# ─────────────────────────────────────────────────────────────────────────

library(readr)
library(dplyr)
library(tidyr)
library(ggplot2)

theme_set(theme_minimal(base_size = 16))

# question colours / shapes (match the reference repo: caused = red, lexical = blue)
Q_COLS   <- c(caused = "#dc3410", lexical = "#377EB8")
Q_SHAPES <- c(caused = 21, lexical = 24)          # fillable circle / triangle (black outline)
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
                     title = "", y_lab = "distal or proximal cause",
                     pole_high = "distal", pole_low = "proximal") {
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

  # y axis is mirrored around 50%: 100% <pole_high> at the top, 100% <pole_low>
  # at the bottom (y = proportion choosing the distal/high-pole cause).
  y_labels <- c(paste0("100%\n", pole_low), "75%", "50%", "75%", paste0("100%\n", pole_high))

  dodge <- position_dodge(width = .5)
  p <- ggplot() +
    geom_hline(yintercept = .5, linetype = "dashed", colour = "grey45") +
    # smooth developmental trend (children only), logistic GLM
    geom_smooth(data = child_age,
                aes(x = age_years, y = distal, colour = question, fill = question),
                method = "glm", method.args = list(family = binomial),
                se = TRUE, alpha = .15, linewidth = 1.2, show.legend = FALSE) +
    # per-age and adult means +/- bootstrapped 95% CI
    geom_linerange(data = pts,
                   aes(x = x, ymin = low, ymax = high, colour = question),
                   position = dodge, linewidth = 1) +
    geom_point(data = pts,
               aes(x = x, y = mean, fill = question, shape = question),
               position = dodge, size = 4.6, stroke = .8, colour = "black") +
    # n labels along the bottom
    geom_text(data = n_lab, aes(x = x, y = -0.12, label = paste0("n=", n)),
              size = 4.4, colour = "grey35") +
    scale_colour_manual(values = Q_COLS, guide = "none") +
    scale_fill_manual(values = Q_COLS) +
    scale_shape_manual(values = Q_SHAPES) +
    scale_x_continuous(breaks = x_breaks, labels = x_labs, limits = c(2.6, 10.9)) +
    scale_y_continuous(breaks = c(0, .25, .5, .75, 1), labels = y_labels,
                       expand = expansion(mult = c(0, .02))) +
    coord_cartesian(ylim = c(-0.15, 1), clip = "off") +
    labs(x = "Age (years)", y = y_lab, fill = "Question", shape = "Question",
         title = title) +
    guides(shape = guide_legend(override.aes = list(size = 8, stroke = .9))) +
    theme(legend.position = "bottom",
          plot.title = element_text(face = "bold", size = 20, hjust = 0),
          plot.title.position = "plot",
          strip.text = element_text(size = 18, face = "bold"),
          axis.title = element_text(size = 18),
          axis.text = element_text(size = 16),
          axis.text.y = element_text(lineheight = 0.9),
          legend.text = element_text(size = 17),
          legend.title = element_text(size = 17),
          legend.key.size = unit(1.6, "lines"),
          panel.grid.minor = element_blank(),
          panel.grid.major = element_line(colour = "grey90"),
          panel.spacing = unit(1.5, "lines"))

  if (!is.null(facet)) {
    labeller <- if (is.null(facet_labels)) "label_value" else as_labeller(facet_labels)
    p <- p + facet_wrap(vars(.data[[facet]]), labeller = labeller)
  }
  p
}

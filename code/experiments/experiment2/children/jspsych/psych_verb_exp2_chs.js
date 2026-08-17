// ════════════════════════════════════════════════════════════════════
//  PSYCH VERB EXP 2 — CHS jsPsych version
//
//  Paste the contents of this file directly into the
//  "jsPsych Experiment Code" editor on childrenhelpingscience.com.
//
//  Scenarios: physical_shock / physical_hurt  |  mental_shock / mental_hurt
//  8 counterbalancing conditions:
//    domain (physical first | mental first)
//    × scenario order within domain (shock first | hurt first)
//    × question order (lexical first | caused first)
//
//  Each scenario: test_case_intro → scenario video → 2 questions
//  Each question: question video + distal/proximal choice images simultaneously
// ════════════════════════════════════════════════════════════════════


// ── Inject CSS ──────────────────────────────────────────────────────
const _style = document.createElement('style');
_style.textContent = `
    .jspsych-content-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
    }
    .jspsych-content {
        max-width: 98% !important;
        width: 98% !important;
        margin: 0 auto !important;
    }
    .trial-video {
        display: block;
        width: 100%;
        max-height: 70vh;
        margin: 0 auto;
        object-fit: contain;
    }
    #jspsych-html-button-response-btngroup {
        display: flex;
        justify-content: center;
        gap: 65px;
        margin-top: 8px;
    }
    .image-choice-btn {
        border: 3px solid #ccc !important;
        background: none !important;
        padding: 4px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        outline: none !important;
        transition: border-color 0.15s, transform 0.1s !important;
        /* Fixed uniform size so all buttons are the same box */
        width: 22vh !important;
        height: 22vh !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    .image-choice-btn:hover:not(:disabled) {
        border-color: #4a90d9 !important;
        transform: scale(1.05) !important;
    }
    .image-choice-btn:disabled { cursor: default !important; }
    .choice-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        pointer-events: none;
    }
    .continue-btn-group {
        position: fixed !important;
        bottom: 24px !important;
        right: 28px !important;
        margin: 0 !important;
        justify-content: flex-end !important;
    }
    .continue-btn-group .jspsych-btn {
        font-size: 1.3em !important;
        padding: 14px 44px !important;
    }
    .instructions-box {
        max-width: 680px;
        margin: 30px auto;
        font-size: 1.1em;
        line-height: 1.7;
        text-align: left;
    }
    .instructions-box h2 { margin-bottom: 10px; }
    .instructions-box ul  { padding-left: 1.4em; }
`;
document.head.appendChild(_style);


// ════════════════════════════════════════════════════════════════════
//  CONFIG
// ════════════════════════════════════════════════════════════════════

const BASE = 'https://raw.githubusercontent.com/CSLouise/lookit_material/master/children_pilot1_psych_verb_exp2/';
const IMG  = src => BASE + 'response_images/' + src;
const VID  = src => BASE + 'mp4/' + src + '.mp4';

// Derive question type from video name
// e.g. 'physical_shock_lexical' → 'lexical'
function qtype(videoName) {
    return videoName.split('_').pop();   // last token: 'lexical' or 'caused'
}


// ════════════════════════════════════════════════════════════════════
//  COUNTERBALANCING CONDITIONS  (8 total)
//
//  Conditions vary along 3 axes:
//    1. domain order:      physical first (0–3) | mental first (4–7)
//    2. scenario order:    shock first | hurt first
//    3. question order:    lexical first | caused first
// ════════════════════════════════════════════════════════════════════

const CONDITIONS = [

    // ── Cond 0: physical first | shock first | lexical first ──────────
    [
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        },
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        }
    ],

    // ── Cond 1: physical first | shock first | caused first ───────────
    [
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        },
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        }
    ],

    // ── Cond 2: physical first | hurt first | lexical first ───────────
    [
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        },
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        }
    ],

    // ── Cond 3: physical first | hurt first | caused first ────────────
    [
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        },
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        }
    ],

    // ── Cond 4: mental first | shock first | lexical first ────────────
    [
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        },
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        }
    ],

    // ── Cond 5: mental first | shock first | caused first ─────────────
    [
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        },
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        }
    ],

    // ── Cond 6: mental first | hurt first | lexical first ─────────────
    [
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        },
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        }
    ],

    // ── Cond 7: mental first | hurt first | caused first ──────────────
    [
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        },
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        }
    ]
];


// ════════════════════════════════════════════════════════════════════
//  INIT jsPsych
//
//  conditionIndex / condition are assigned AFTER the per-age gate runs
//  (see "RUN THE EXPERIMENT" at the bottom). The trial builders below read
//  these module-level variables at trial time, by which point they are set.
// ════════════════════════════════════════════════════════════════════

const jsPsych = initJsPsych();

let conditionIndex;
let condition;


// ════════════════════════════════════════════════════════════════════
//  TRIAL BUILDERS
// ════════════════════════════════════════════════════════════════════

function videoTrial(videoName, trialType) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="trial-video" class="trial-video"
                         src="${VID(videoName)}" autoplay playsinline></video>`,
        choices: ['Next'],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) group.classList.add('continue-btn-group');
            const btn = group && group.querySelector('button');
            if (btn) {
                btn.disabled = true;
                document.getElementById('trial-video').addEventListener('ended', () => {
                    btn.disabled = false;
                });
                setTimeout(() => { btn.disabled = false; }, 300_000);
            }
        },
        data: { trial_type: trialType, video: videoName, condition: conditionIndex }
    };
}

function questionTrial({ videoName, leftImgSrc, rightImgSrc, questionType, scenarioId }) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="q-audio" src="${VID(videoName)}"
                         class="trial-video" autoplay playsinline></video>`,
        choices: [
            `<img src="${leftImgSrc}"  class="choice-img" alt="distal">`,
            `<img src="${rightImgSrc}" class="choice-img" alt="proximal">`
        ],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) {
                group.querySelectorAll('button').forEach(b => {
                    b.classList.add('image-choice-btn');
                    b.disabled = true;
                    b.style.opacity = '0';
                    b.style.transition = 'opacity 0.3s';
                });
                const reveal = () => {
                    group.querySelectorAll('button').forEach(b => {
                        b.disabled = false;
                        b.style.opacity = '1';
                    });
                };
                document.getElementById('q-audio').addEventListener('ended', reveal);
                setTimeout(reveal, 300_000);
            }
        },
        data: {
            trial_type:  questionType,
            scenario:    scenarioId,
            condition:   conditionIndex,
            left_label:  'distal',
            right_label: 'proximal',
            video:       videoName
        },
        response_ends_trial: true
    };
}


// ════════════════════════════════════════════════════════════════════
//  BUILD SCENARIO TIMELINE
// ════════════════════════════════════════════════════════════════════

function buildScenarioTimeline(scenarioData, scenarioId) {
    const trials = [
        videoTrial('test_case_intro',     'intro'),
        videoTrial(scenarioData.scenario, 'scenario')
    ];
    for (const q of scenarioData.questions) {
        trials.push(questionTrial({
            videoName:    q.video,
            leftImgSrc:   IMG(q.distal),
            rightImgSrc:  IMG(q.proximal),
            questionType: qtype(q.video),
            scenarioId
        }));
    }
    return trials;
}


// ════════════════════════════════════════════════════════════════════
//  WARMUP TIMELINE
// ════════════════════════════════════════════════════════════════════

/**
 * warmupQuestionTrial – buttons are hidden until the video finishes, then fade in.
 */
function warmupQuestionTrial({ videoName, leftImgSrc, rightImgSrc }) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="q-audio" src="${VID(videoName)}"
                         class="trial-video" autoplay playsinline></video>`,
        choices: [
            `<img src="${leftImgSrc}"  class="choice-img" alt="distal">`,
            `<img src="${rightImgSrc}" class="choice-img" alt="proximal">`
        ],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) {
                group.querySelectorAll('button').forEach(b => {
                    b.classList.add('image-choice-btn');
                    b.disabled = true;
                    b.style.opacity = '0';
                    b.style.transition = 'opacity 0.3s';
                });
                const reveal = () => {
                    group.querySelectorAll('button').forEach(b => {
                        b.disabled = false;
                        b.style.opacity = '1';
                    });
                };
                document.getElementById('q-audio').addEventListener('ended', reveal);
                setTimeout(reveal, 300_000); // safety fallback
            }
        },
        data: { question_type: 'warmup', scenario: 'warmup', condition: conditionIndex,
                left_label: 'distal', right_label: 'proximal', video: videoName },
        response_ends_trial: true
    };
}

// Built as a function (not a const) so it is constructed AFTER conditionIndex
// is assigned in the gated IIFE below — otherwise the warmup trials would
// capture conditionIndex === undefined in their data.
function makeWarmupTimeline() {
    return [
        warmupQuestionTrial({ videoName: 'warmup_part1_bird_question', leftImgSrc: IMG('bird.png'), rightImgSrc: IMG('cat.png')  }),
        warmupQuestionTrial({ videoName: 'warmup_part1_fish_question', leftImgSrc: IMG('pig.png'),  rightImgSrc: IMG('fish.png') }),
        videoTrial('warmup_finish', 'warmup_video')
    ];
}


// ════════════════════════════════════════════════════════════════════
//  CHS-SPECIFIC FRAMES
// ════════════════════════════════════════════════════════════════════

const video_config = { type: chsRecord.VideoConfigPlugin };

const video_consent = {
    type: chsRecord.VideoConsentPlugin,
    PIName:      'Ellen Markman',
    institution: 'The Markman Lab of Stanford University',
    PIContact:   'Ellen Markman at markman@stanford.edu',
    purpose:     'This study is about how children understand causal and psychological verbs.',
    procedures:  'Your child will watch short videos and answer questions by clicking on pictures on the screen.',
    risk_statement: 'There are no expected risks to participation.',
    payment:     'After you finish the study, we will email you a $5 Amazon gift card within approximately 3–5 business days.',
    include_databrary: true
};

const instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions-box">
            <h2>Overview</h2>
            <ul>
                <li>The study takes about 5–8 minutes.</li>
                <li>Your child will watch short videos and answer questions by clicking on pictures.</li>
                <li>There are no right or wrong answers.</li>
            </ul>
            <p><strong>For parents:</strong> Please help keep your child's attention,
               but don't tell them which answer to choose.</p>
        </div>`,
    choices: ['Start ▶'],
    data: { trial_type: 'instructions' }
};

const start_recording = { type: chsRecord.StartRecordPlugin };
const stop_recording  = { type: chsRecord.StopRecordPlugin  };


// ════════════════════════════════════════════════════════════════════
//  PER-AGE CONDITION GATING
//
//  Between-subjects domains:  physical (cond 0-3) | mental (cond 4-7)
//  Each participant sees ONE domain only.
//
//  Once a domain reaches its per-condition target for a given age, new
//  participants of that age are NO LONGER assigned to it — only the still-open
//  domain's conditions are drawn. If BOTH domains are full for an age, that age
//  is closed and the participant is shown a "quota full" message.
//
//  The child's age is read at runtime from window.chs.child.birthday and
//  bucketed by age-in-days using the SAME table as the lab-manager
//  (lookit-tools/scripts/lookit_response_coder.py → AGE_BUCKETS).
//
//  ▼▼▼  UPDATE THESE COUNTS as data comes in  ▼▼▼
//  Per-condition target, and the current analysis-eligible counts per age.
//  A domain whose count >= TARGET_PER_CONDITION is treated as FULL.
// ════════════════════════════════════════════════════════════════════

const TARGET_PER_CONDITION = 30;

// age bucket → { physical: n, mental: n }   (analysis-eligible counts)
// Updated 2026-08-12 from the lab-manager dashboard.
const CONDITION_COUNTS = {
    '3': { physical: 36, mental: 28 },
    '4': { physical: 26, mental: 30 },
    '5': { physical: 31, mental: 20 },
    '6': { physical: 29, mental: 33 },
    '7': { physical: 31, mental: 25 },
    '8': { physical: 30, mental: 29 },
    '9': { physical: 30, mental: 32 }
};
//  ▲▲▲  UPDATE THESE COUNTS as data comes in  ▲▲▲

const ALL_DOMAINS    = ['physical', 'mental'];
const DOMAIN_INDICES = { physical: [0, 1, 2, 3], mental: [4, 5, 6, 7] };
const domainOf       = idx => (idx < 4 ? 'physical' : 'mental');

// Age-in-days buckets — must match lookit-tools AGE_BUCKETS (lower < days < upper).
const AGE_BUCKETS = [
    [1095, 1460, '3'], [1460, 1826, '4'], [1826, 2191, '5'], [2191, 2556, '6'],
    [2556, 2921, '7'], [2921, 3287, '8'], [3287, 3652, '9']
];

function childBirthday() {
    const c = window.chs && window.chs.child;
    if (!c) return null;
    return (c.attributes && c.attributes.birthday) || c.birthday || null;
}

function ageBucketFromBirthday() {
    const b = childBirthday();
    if (!b) return null;
    const ms = new Date(b).getTime();
    if (isNaN(ms)) return null;
    const ageDays = Math.floor((Date.now() - ms) / 86400000);
    for (const [lo, hi, label] of AGE_BUCKETS) {
        if (lo < ageDays && ageDays < hi) return label;
    }
    return null;  // outside the 3-9 range → no gating
}

// window.chs.child is populated asynchronously by CHS. Wait until the birthday
// is actually readable (not just window.chs.child) so ageBucketFromBirthday()
// doesn't return null because of a load race. Falls through after the timeout.
async function ensureChsLoaded(timeoutMs) {
    const start = Date.now();
    while (!childBirthday() && (Date.now() - start) < timeoutMs) {
        await new Promise(r => setTimeout(r, 50));
    }
}


// ════════════════════════════════════════════════════════════════════
//  RUN THE EXPERIMENT
// ════════════════════════════════════════════════════════════════════

(async () => {
    await ensureChsLoaded(8000);

    const bday      = childBirthday();
    const ageBucket = ageBucketFromBirthday();
    const counts    = ageBucket ? CONDITION_COUNTS[ageBucket] : null;

    // Determine which domains are still open for this age.
    // Only skip gating when the age truly can't be determined (missing/unparseable
    // birthday, or age outside the 3-9 range) — never hard-block on a read failure.
    // NOTE: gating DOES apply in CHS preview, so you can test it there.
    let openDomains, gatingApplied, skipReason = null;
    if (!ageBucket || !counts) {
        openDomains   = ALL_DOMAINS.slice();
        gatingApplied = false;
        skipReason    = !bday ? 'no_birthday' : (!ageBucket ? 'age_out_of_range' : 'no_counts_for_age');
    } else {
        openDomains   = ALL_DOMAINS.filter(d => (counts[d] || 0) < TARGET_PER_CONDITION);
        gatingApplied = true;
    }

    // Diagnostic — open the DevTools console in CHS preview to see what was
    // read and decided. Safe to leave in; remove later if you like.
    console.log('[age-gating exp2]', {
        chs_child_present: !!(window.chs && window.chs.child),
        birthday:          bday,
        age_bucket:        ageBucket,
        counts_for_age:    counts,
        gating_applied:    gatingApplied,
        skip_reason:       skipReason,
        open_domains:      openDomains
    });

    // Both domains full for this age → close it (show message, do not record).
    if (gatingApplied && openDomains.length === 0) {
        jsPsych.data.addProperties({
            age_bucket: ageBucket, gating_applied: true, quota_full: true
        });
        jsPsych.run([{
            type: jsPsychHtmlButtonResponse,
            stimulus: `
                <div class="instructions-box">
                    <h2>Thank you so much!</h2>
                    <p>We've already collected enough responses for your child's
                       age group in this study for now. We really appreciate your
                       interest — please check back later or try one of our other
                       studies. Thank you!</p>
                </div>`,
            choices: ['Close'],
            data: { trial_type: 'quota_full', age_bucket: ageBucket }
        }]);
        return;
    }

    // Draw a condition index only from the open domains' conditions.
    const allowed   = openDomains.reduce((acc, d) => acc.concat(DOMAIN_INDICES[d]), []);
    conditionIndex  = allowed[Math.floor(Math.random() * allowed.length)];
    condition       = CONDITIONS[conditionIndex];

    jsPsych.data.addProperties({
        condition:      conditionIndex,
        domain:         domainOf(conditionIndex),
        age_bucket:     ageBucket || 'unknown',
        gating_applied: gatingApplied,
        gating_skip_reason: skipReason || '',
        open_domains:   openDomains.join('-')
    });

    jsPsych.run([
        { type: jsPsychFullscreen, fullscreen_mode: true },
        video_config,
        video_consent,
        instructions,

        start_recording,
        videoTrial('overall_study_intro', 'intro_video'),

        ...makeWarmupTimeline(),

        ...buildScenarioTimeline(condition[0], 'scenario_1'),
        ...buildScenarioTimeline(condition[1], 'scenario_2'),

        videoTrial('overall_study_end', 'end_video'),
        stop_recording,
        { type: jsPsychFullscreen, fullscreen_mode: false, delay_after: 0 },
        { type: chsSurvey.ExitSurveyPlugin }
    ]);
})();

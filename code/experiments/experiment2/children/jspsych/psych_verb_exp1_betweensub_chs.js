// ════════════════════════════════════════════════════════════════════
//  PSYCH VERB EXP 1 — BETWEEN-SUBJECTS — CHS jsPsych version
//
//  Paste the contents of this file directly into the
//  "jsPsych Experiment Code" editor on childrenhelpingscience.com.
//
//  Between-subjects design (2 groups, balanced via CHS chs.conditions):
//    • control      : sees only causal verbs   → break (drum) + pop (balloon)
//    • experimental : sees only psych verbs    → angry (drum) + sad (balloon)
//
//  Each participant sees BOTH scenarios (drum + balloon), 2 questions each.
//  Both scenarios share the SAME question order (caused-first or lexical-first).
//
//  Within-subject counterbalancing (4 conditions per group):
//    • scenario order : drum first | balloon first
//    • question order : caused first | lexical first
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

const BASE = 'https://raw.githubusercontent.com/CSLouise/lookit_material/master/children_pilot1_psych_verb_exp1/';
const IMG  = src => BASE + 'response_images/' + src;
const VID  = src => BASE + 'mp4/' + src + '.mp4';

// 'drum_break_caused' → 'break_caused'
function qtype(videoName) {
    return videoName.replace(/^[^_]+_/, '');
}

// Verb assigned to each scenario per group
//   control      → causal verb   (break for drum, pop for balloon)
//   experimental → psych verb    (angry for drum, sad for balloon)
const VERB_BY_GROUP = {
    control:      { drum: 'break', balloon: 'pop' },
    experimental: { drum: 'angry', balloon: 'sad' }
};


// ════════════════════════════════════════════════════════════════════
//  WITHIN-SUBJECTS COUNTERBALANCING (4 conditions)
//
//  scenario order : drum first | balloon first
//  question order : caused first | lexical first
//
//  Both scenarios in the same condition use the SAME question order.
// ════════════════════════════════════════════════════════════════════

const SCENARIO_ORDERS = [
    ['drum',    'balloon'],   // scenario order A: drum first
    ['balloon', 'drum']       // scenario order B: balloon first
];
const QUESTION_ORDERS = [
    ['caused',  'lexical'],   // caused first
    ['lexical', 'caused']     // lexical first
];

// Build the 4 within-subject conditions: [scenarioOrder × questionOrder]
const WITHIN_CONDITIONS = [];
for (const scenOrder of SCENARIO_ORDERS) {
    for (const qOrder of QUESTION_ORDERS) {
        WITHIN_CONDITIONS.push({ scenarioOrder: scenOrder, questionOrder: qOrder });
    }
}


// ════════════════════════════════════════════════════════════════════
//  Build a participant's full timeline given group + within-condition
// ════════════════════════════════════════════════════════════════════

function buildScenario(scenarioObject, group, questionOrder, scenarioId) {
    // scenarioObject: 'drum' or 'balloon'
    // group: 'control' or 'experimental'
    // questionOrder: ['caused','lexical'] or ['lexical','caused']
    const verb       = VERB_BY_GROUP[group][scenarioObject];      // e.g. 'break'
    const scenarioVid = `${scenarioObject}_scenario`;             // 'drum_scenario'
    const distalImg   = `${scenarioObject}_distal.png`;
    const proximalImg = `${scenarioObject}_proximal.png`;

    const trials = [
        videoTrial('test_case_intro', 'intro'),
        videoTrial(scenarioVid,       'scenario')
    ];
    for (const qSuffix of questionOrder) {                        // 'caused' | 'lexical'
        const videoName = `${scenarioObject}_${verb}_${qSuffix}`; // 'drum_break_caused'
        trials.push(questionTrial({
            videoName,
            leftImgSrc:   IMG(distalImg),
            rightImgSrc:  IMG(proximalImg),
            questionType: qtype(videoName),
            scenarioId
        }));
    }
    return trials;
}


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
        // condition / group filled in by jsPsych addNodeProperties below
        data: { trial_type: trialType, video: videoName }
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
            question_type: questionType,
            scenario:      scenarioId,
            left_label:    'distal',
            right_label:   'proximal',
            video:         videoName
        },
        response_ends_trial: true
    };
}


// ════════════════════════════════════════════════════════════════════
//  WARMUP TIMELINE
// ════════════════════════════════════════════════════════════════════

function warmupQuestionTrial({ videoName, leftImgSrc, rightImgSrc, leftLabel, rightLabel }) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="q-audio" src="${VID(videoName)}"
                         class="trial-video" autoplay playsinline></video>`,
        choices: [
            `<img src="${leftImgSrc}"  class="choice-img" alt="${leftLabel}">`,
            `<img src="${rightImgSrc}" class="choice-img" alt="${rightLabel}">`
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
        data: { question_type: 'warmup', scenario: 'warmup',
                left_label: leftLabel, right_label: rightLabel, video: videoName },
        response_ends_trial: true
    };
}

const warmupTimeline = [
    warmupQuestionTrial({ videoName: 'warmup_part1_bird_question',
                          leftImgSrc: IMG('bird.png'), rightImgSrc: IMG('cat.png'),
                          leftLabel: 'bird',           rightLabel: 'cat' }),
    warmupQuestionTrial({ videoName: 'warmup_part1_fish_question',
                          leftImgSrc: IMG('pig.png'),  rightImgSrc: IMG('fish.png'),
                          leftLabel: 'pig',            rightLabel: 'fish' }),
    videoTrial('warmup_finish', 'warmup_video')
];


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
//  Between-subjects groups:  control (causal verbs) | experimental (psych verbs)
//
//  Once a group reaches its per-condition target for a given age, new
//  participants of that age are NO LONGER assigned to it — only the still-open
//  group is drawn. If BOTH groups are full for an age, that age is closed and
//  the participant is shown a "quota full" message instead of the study.
//
//  The child's age is read at runtime from window.chs.child.birthday and
//  bucketed by age-in-days using the SAME table as the lab-manager
//  (lookit-tools/scripts/lookit_response_coder.py → AGE_BUCKETS), so this
//  matches your recruitment dashboard exactly.
//
//  ▼▼▼  UPDATE THESE COUNTS as data comes in  ▼▼▼
//  Per-condition target, and the current analysis-eligible counts per age.
//  A group whose count >= TARGET_PER_CONDITION is treated as FULL.
// ════════════════════════════════════════════════════════════════════

const TARGET_PER_CONDITION = 30;

// age bucket → { control: n, experimental: n }   (analysis-eligible counts)
const CONDITION_COUNTS = {
    '3': { control: 30, experimental: 28 },
    '4': { control: 34, experimental: 31 },
    '5': { control: 32, experimental: 28 },
    '6': { control: 20, experimental: 23 },
    '7': { control: 24, experimental: 34 },
    '8': { control: 20, experimental: 26 },
    '9': { control: 29, experimental: 29 }
};
//  ▲▲▲  UPDATE THESE COUNTS as data comes in  ▲▲▲

const ALL_GROUPS = ['control', 'experimental'];

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
//  INIT jsPsych & RUN (condition is assigned AFTER the age gate runs)
// ════════════════════════════════════════════════════════════════════

const jsPsych = initJsPsych();

(async () => {
    await ensureChsLoaded(8000);

    const bday      = childBirthday();
    const ageBucket = ageBucketFromBirthday();
    const counts    = ageBucket ? CONDITION_COUNTS[ageBucket] : null;

    // Determine which groups are still open for this age.
    // Only skip gating when the age truly can't be determined (missing/unparseable
    // birthday, or age outside the 3-9 range) — never hard-block on a read failure.
    // NOTE: gating DOES apply in CHS preview, so you can test it there.
    let openGroups, gatingApplied, skipReason = null;
    if (!ageBucket || !counts) {
        openGroups    = ALL_GROUPS.slice();
        gatingApplied = false;
        skipReason    = !bday ? 'no_birthday' : (!ageBucket ? 'age_out_of_range' : 'no_counts_for_age');
    } else {
        openGroups    = ALL_GROUPS.filter(g => (counts[g] || 0) < TARGET_PER_CONDITION);
        gatingApplied = true;
    }

    // Diagnostic — open the DevTools console in CHS preview to see what was
    // read and decided. Safe to leave in; remove later if you like.
    console.log('[age-gating exp1]', {
        chs_child_present: !!(window.chs && window.chs.child),
        birthday:          bday,
        age_bucket:        ageBucket,
        counts_for_age:    counts,
        gating_applied:    gatingApplied,
        skip_reason:       skipReason,
        open_groups:       openGroups
    });

    // Both groups full for this age → close it (show message, do not record).
    if (gatingApplied && openGroups.length === 0) {
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

    // Assign group from the open set; within-subject order stays randomized.
    const groupAssignment = openGroups[Math.floor(Math.random() * openGroups.length)];
    const conditionIndex  = Math.floor(Math.random() * WITHIN_CONDITIONS.length);
    const within          = WITHIN_CONDITIONS[conditionIndex];

    // Tag every trial with group / condition / within-subject + gating info
    jsPsych.data.addProperties({
        group:           groupAssignment,
        condition:       conditionIndex,
        scenario_order:  within.scenarioOrder.join('-'),
        question_order:  within.questionOrder.join('-'),
        age_bucket:      ageBucket || 'unknown',
        gating_applied:  gatingApplied,
        gating_skip_reason: skipReason || '',
        open_groups:     openGroups.join('-')
    });

    const [scen1, scen2] = within.scenarioOrder;

    jsPsych.run([
        { type: jsPsychFullscreen, fullscreen_mode: true },
        video_config,
        video_consent,
        instructions,

        start_recording,
        videoTrial('overall_study_intro', 'intro_video'),

        ...warmupTimeline,

        ...buildScenario(scen1, groupAssignment, within.questionOrder, 'scenario_1'),
        ...buildScenario(scen2, groupAssignment, within.questionOrder, 'scenario_2'),

        videoTrial('overall_study_end', 'end_video'),
        stop_recording,
        { type: jsPsychFullscreen, fullscreen_mode: false, delay_after: 0 },
        { type: chsSurvey.ExitSurveyPlugin }
    ]);
})();

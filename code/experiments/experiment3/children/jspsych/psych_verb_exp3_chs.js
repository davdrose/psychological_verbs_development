// ════════════════════════════════════════════════════════════════════
//  PSYCH VERB EXP 3 — CHS jsPsych version
//
//  Paste the contents of this file directly into the
//  "jsPsych Experiment Code" editor on childrenhelpingscience.com.
//
//  Scenarios: scared  |  surprised
//  4 counterbalancing conditions:
//    scenario order (scared first | surprised first)
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

const BASE = 'https://raw.githubusercontent.com/CSLouise/lookit_material/master/children_pilot1_psych_verb_exp3/';
const IMG  = src => BASE + 'response_images/' + src;
const VID  = src => BASE + 'mp4/' + src + '.mp4';

// Derive question type from video name — last token
// e.g. 'scared_lexical' → 'lexical', 'surprised_caused' → 'caused'
function qtype(videoName) {
    return videoName.split('_').pop();
}


// ════════════════════════════════════════════════════════════════════
//  COUNTERBALANCING CONDITIONS  (4 total)
//
//  Conditions vary along 2 axes:
//    1. scenario order:  scared first (0–1) | surprised first (2–3)
//    2. question order:  lexical first | caused first
// ════════════════════════════════════════════════════════════════════

const CONDITIONS = [

    // ── Cond 0: scared first | lexical first ──────────────────────────
    [
        { scenario: 'scared_scenario',
          questions: [
            { video: 'scared_lexical',    distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    },
            { video: 'scared_caused',     distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    }
          ]
        },
        { scenario: 'surprised_scenario',
          questions: [
            { video: 'surprised_lexical', distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' },
            { video: 'surprised_caused',  distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' }
          ]
        }
    ],

    // ── Cond 1: scared first | caused first ───────────────────────────
    [
        { scenario: 'scared_scenario',
          questions: [
            { video: 'scared_caused',     distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    },
            { video: 'scared_lexical',    distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    }
          ]
        },
        { scenario: 'surprised_scenario',
          questions: [
            { video: 'surprised_caused',  distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' },
            { video: 'surprised_lexical', distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' }
          ]
        }
    ],

    // ── Cond 2: surprised first | lexical first ───────────────────────
    [
        { scenario: 'surprised_scenario',
          questions: [
            { video: 'surprised_lexical', distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' },
            { video: 'surprised_caused',  distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' }
          ]
        },
        { scenario: 'scared_scenario',
          questions: [
            { video: 'scared_lexical',    distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    },
            { video: 'scared_caused',     distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    }
          ]
        }
    ],

    // ── Cond 3: surprised first | caused first ────────────────────────
    [
        { scenario: 'surprised_scenario',
          questions: [
            { video: 'surprised_caused',  distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' },
            { video: 'surprised_lexical', distal: 'surprise_distal.png', proximal: 'surprise_proximal.png' }
          ]
        },
        { scenario: 'scared_scenario',
          questions: [
            { video: 'scared_caused',     distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    },
            { video: 'scared_lexical',    distal: 'scare_distal.png',    proximal: 'scare_proximal.png'    }
          ]
        }
    ]
];


// ════════════════════════════════════════════════════════════════════
//  INIT jsPsych
// ════════════════════════════════════════════════════════════════════

const jsPsych = initJsPsych();

const conditionIndex = Math.floor(Math.random() * CONDITIONS.length);
const condition      = CONDITIONS[conditionIndex];


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

const warmupTimeline = [
    warmupQuestionTrial({ videoName: 'warmup_part1_bird_question', leftImgSrc: IMG('bird.png'), rightImgSrc: IMG('cat.png')  }),
    warmupQuestionTrial({ videoName: 'warmup_part1_fish_question', leftImgSrc: IMG('pig.png'),  rightImgSrc: IMG('fish.png') }),
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
//  RUN THE EXPERIMENT
// ════════════════════════════════════════════════════════════════════

jsPsych.run([
    { type: jsPsychFullscreen, fullscreen_mode: true },
    video_config,
    video_consent,
    instructions,

    start_recording,
    videoTrial('overall_study_intro', 'intro_video'),

    ...warmupTimeline,

    ...buildScenarioTimeline(condition[0], 'scenario_1'),
    ...buildScenarioTimeline(condition[1], 'scenario_2'),

    videoTrial('overall_study_end', 'end_video'),
    stop_recording,
    { type: jsPsychFullscreen, fullscreen_mode: false, delay_after: 0 },
    { type: chsSurvey.ExitSurveyPlugin }
]);

#!/usr/bin/env node
'use strict';

/*
 * Phase 0 smoke regression for 《即刻入职》.
 *
 * Usage:
 *   node "Ink Projects/即刻入职/tools/phase0_smoke.cjs" <compiled-story.json>
 *
 * Runtime selection:
 *   INKJS_MODULE=/absolute/path/to/inkjs   (directory or module name; default: inkjs)
 *
 * The compiled JSON must be produced with inklecate's `-c` flag so that visit
 * counts are recorded for every knot, stitch and weave point.
 *
 * Test labels:
 *   [natural]              starts at the title screen and only uses choice clicks.
 *   [direct,state-injected]
 *                          jumps to a knot/stitch with ChoosePathString and/or
 *                          sets variables before entering.
 *   [state-injected]       starts at the normal title menu but sets variables first.
 *   [engine]               engine-level ResetState only; not a GUI/#RESTART test.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const jsonArg = process.argv[2];
if (!jsonArg) {
  console.error('Usage: node tools/phase0_smoke.cjs <compiled-story.json>');
  console.error('Env: INKJS_MODULE=/absolute/path/to/inkjs (or a module name; default inkjs)');
  process.exit(2);
}

const jsonPath = path.resolve(jsonArg);
let compiled;
try {
  compiled = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (err) {
  console.error(`Cannot read compiled story JSON: ${jsonPath}`);
  console.error(err.message);
  process.exit(2);
}

function loadInkJs(spec) {
  if (!path.isAbsolute(spec)) return require(spec);

  const ownPackage = path.join(spec, 'package.json');
  if (fs.existsSync(ownPackage)) return require(spec);

  const childPackage = path.join(spec, 'inkjs', 'package.json');
  if (fs.existsSync(childPackage)) return require(path.join(spec, 'inkjs'));

  return require(spec);
}

let ink;
try {
  ink = loadInkJs(process.env.INKJS_MODULE || 'inkjs');
} catch (err) {
  console.error(`Cannot load inkjs module: ${process.env.INKJS_MODULE || 'inkjs'}`);
  console.error(err.message);
  process.exit(2);
}

const Story = ink.Story || (ink.default && ink.default.Story);
if (typeof Story !== 'function') {
  console.error('Loaded inkjs module does not export Story.');
  process.exit(2);
}

const DEFAULT_VARS = Object.freeze({
  SAN_SCORE: -1,
  COUNT_GAME_OVER: 0,
  COUNT_MENU_SEPARATOR: 0,
  COUNT_ROUTE_WORK_GYM: 0,
  COUNT_ROUTE_WORK_OFF_WORK: 0,
  COUNT_ROUTE_WORK_BUSINESS_TRIP: 0,
  COUNT_ROUTE_WORK_NAPPING: 0,
  COUNT_ROUTE_WORK_SHUTDOWN: 0,
  COUNT_ROUTE_BREAK_INTERVIEW: 0,
  COUNT_ROUTE_BREAK_CINEMA: 0,
  COUNT_ROUTE_BREAK_HOME: 0,
  COUNT_ROUTE_BREAK_SHUTDOWN: 0,
  HAS_ENTERED_FINAL_RECONCILIATION: false,
  UNLOCKED_NO8_DATABASE: false,
});

const CONTINUE_SLICE_MS = 10;
const SCENE_BUDGET_MS = 5000;
const MAX_LINES_PER_SCENE = 500;
const MAX_AUTO_CHOICES = 12;

const results = [];

function checkDiagnostics(story, context) {
  const recorded = story.__testDiagnostics || [];
  const errors = story.currentErrors || [];
  const warnings = story.currentWarnings || [];
  const messages = [
    ...recorded.map((entry) => entry.message),
    ...errors,
    ...warnings,
  ];
  if (messages.length > 0 || story.hasError || story.hasWarning) {
    throw new Error(`${context}: ink runtime errors/warnings: ${messages.join(' | ')}`);
  }
}

function newStory(vars, context) {
  const story = new Story(compiled);
  story.__testDiagnostics = [];
  story.onError = (message, type) => {
    story.__testDiagnostics.push({ message: String(message), type: String(type) });
  };
  checkDiagnostics(story, `${context}: new Story`);

  for (const [name, value] of Object.entries(vars)) {
    if (story.variablesState[name] === undefined) {
      throw new Error(`${context}: unknown Ink variable ${name}`);
    }
    story.variablesState[name] = value;
  }
  return story;
}

function enterPath(story, inkPath, context) {
  story.ChoosePathString(inkPath);
  checkDiagnostics(story, `${context}: ChoosePathString(${inkPath})`);
}

// Continue in short async slices. A single synchronous Continue() can spin
// forever inside a divert loop that emits no newline, so a call-count limit
// alone cannot catch it. Here the wall-clock budget is checked between slices,
// and a line is only consumed once asyncContinueComplete is true.
function drain(story, context, options = {}) {
  const budgetMs = options.budgetMs || SCENE_BUDGET_MS;
  const maxLines = options.maxLines || MAX_LINES_PER_SCENE;
  const deadline = Date.now() + budgetMs;
  let text = '';
  let lines = 0;
  let slices = 0;

  while (story.canContinue) {
    if (Date.now() > deadline) {
      throw new Error(
        `${context}: continuation exceeded ${budgetMs}ms budget ` +
        `after ${lines} line(s) and ${slices} slice(s)`
      );
    }

    story.ContinueAsync(CONTINUE_SLICE_MS);
    slices += 1;
    checkDiagnostics(story, `${context}: ContinueAsync #${slices}`);

    if (!story.asyncContinueComplete) {
      // Still inside the same (possibly textless) line; keep slicing and
      // checking the wall-clock deadline.
      continue;
    }

    text += story.currentText || '';
    lines += 1;
    if (lines > maxLines) {
      throw new Error(`${context}: line limit ${maxLines} exceeded`);
    }
  }

  checkDiagnostics(story, `${context}: stopped`);
  return text;
}

function choiceTexts(story) {
  return story.currentChoices.map((choice) => choice.text);
}

function normalizeChoiceText(text) {
  return text.normalize('NFD').replace(/[\p{M}\u200b]/gu, '');
}

function chooseIndex(story, index, context) {
  assert.ok(
    index >= 0 && index < story.currentChoices.length,
    `${context}: choice index ${index} out of range`
  );
  story.ChooseChoiceIndex(index);
  checkDiagnostics(story, `${context}: ChooseChoiceIndex(${index})`);
}

function choose(story, needle, context) {
  const matches = story.currentChoices.filter((choice) => choice.text.includes(needle));
  if (matches.length !== 1) {
    throw new Error(
      `${context}: expected one choice containing ${JSON.stringify(needle)}, ` +
      `got ${JSON.stringify(choiceTexts(story))}`
    );
  }
  chooseIndex(story, story.currentChoices.indexOf(matches[0]), context);
}

function chooseNormalized(story, needle, context) {
  const matches = story.currentChoices.filter((choice) =>
    normalizeChoiceText(choice.text).includes(needle)
  );
  if (matches.length !== 1) {
    throw new Error(
      `${context}: expected one normalized choice containing ${JSON.stringify(needle)}, ` +
      `got ${JSON.stringify(choiceTexts(story).map(normalizeChoiceText))}`
    );
  }
  chooseIndex(story, story.currentChoices.indexOf(matches[0]), context);
}

function assertChoices(story, expected, context) {
  assert.deepStrictEqual(choiceTexts(story), expected, `${context}: choices`);
}

function assertText(text, needle, context) {
  assert.ok(text.includes(needle), `${context}: text does not contain ${JSON.stringify(needle)}`);
}

function assertVars(story, expected, context) {
  for (const [name, value] of Object.entries(expected)) {
    assert.strictEqual(story.variablesState[name], value, `${context}: ${name}`);
  }
}

function evaluate(story, name, args, context) {
  const value = story.EvaluateFunction(name, args);
  checkDiagnostics(story, `${context}: EvaluateFunction(${name})`);
  return value;
}

function assertNormalEnd(story, context) {
  checkDiagnostics(story, context);
  assert.strictEqual(story.canContinue, false, `${context}: canContinue`);
  assert.deepStrictEqual(choiceTexts(story), [], `${context}: choices`);
}

function assertCreditsEnd(story, text, context) {
  assertText(text, '【制作人员】', `${context}: credits heading`);
  assertText(text, '作者：瑞洛凩', `${context}: credits author`);
  assertText(text, '校对：黑川江凌', `${context}: credits proofreader`);
  assertNormalEnd(story, `${context}: credits normal END`);
  assert.ok(
    !text.includes('更新日期：20260327') &&
      !text.includes('本互动小说为黑川物流主世界内容'),
    `${context}: credits returned to the title page`
  );
  assert.ok(!text.includes('初始化'), `${context}: credits returned to main menu`);
  assert.ok(!text.includes('重新连接：'), `${context}: credits returned to reconnect menu`);
  assert.ok(!text.includes('（人……为什么要上班……）'), `${context}: ordinary wake after credits`);
  assert.ok(!text.includes('闹钟'), `${context}: ordinary alarm after credits`);
  assert.ok(!text.includes('“哈欠……”'), `${context}: ordinary startup sound after credits`);
}

function runTest(name, fn) {
  try {
    fn();
    results.push({ name, status: 'PASS' });
    console.log(`PASS  ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err });
    console.log(`FAIL  ${name}`);
    console.log(`      ${err.message}`);
  }
}

const VISIT_PATHS = Object.freeze([
  'Ending__Final_Reconciliation',
  'Ending__No8_Reality',
  'Flow__Startup',
  'Flow__Navigator',
  'Dream1',
  'Dream2',
  'Dream3',
  'Dream4',
  'Dream5',
  'Dream6',
  'Dream7',
]);

function visitSnapshot(story) {
  const snapshot = {};
  for (const inkPath of VISIT_PATHS) {
    snapshot[inkPath] = story.state.VisitCountAtPathString(inkPath);
  }
  return snapshot;
}

function assertVisitDelta(before, after, expected, context) {
  for (const [inkPath, delta] of Object.entries(expected)) {
    assert.strictEqual(
      after[inkPath] - before[inkPath],
      delta,
      `${context}: ${inkPath} visit delta`
    );
  }
}

// ---------------------------------------------------------------------------
// Structural check against the compiler output. Deliberately does not assert
// knot/stitch counts: those would only freeze the current implementation.
// ---------------------------------------------------------------------------

runTest('compiled JSON root structure and inkVersion 21', () => {
  assert.strictEqual(compiled.inkVersion, 21, 'inkVersion');
  assert.ok(Array.isArray(compiled.root), 'compiled.root is an array');
  assert.ok(compiled.root.length > 0, 'compiled.root is not empty');
  assert.ok(
    compiled.root.some((item) =>
      item && typeof item === 'object' && !Array.isArray(item) && item['global decl']
    ),
    'compiled.root contains the global declaration container'
  );
});

// ---------------------------------------------------------------------------
// Natural new game: title -> invitation -> first navigation.
// ---------------------------------------------------------------------------

function naturalFirstDay() {
  const context = '[natural] first day';
  const story = newStory({}, context);
  let text = drain(story, `${context}: title`);
  assertChoices(
    story,
    ['初始化', '结局回溯', '————————', '更新日志', '制作人员'],
    `${context}: title menu`
  );

  choose(story, '初始化', `${context}: init`);
  text += drain(story, `${context}: startup intro`);
  assertText(text, '工作日的每天早上', `${context}: startup sound`);
  choose(story, '继续', `${context}: continue`);

  text = drain(story, `${context}: mailbox`);
  assertText(text, '黑川物流｜黑川物流市场部面试邀请函', `${context}: invite subject`);
  choose(story, '打开 面试邀请函', `${context}: open invitation`);

  text = drain(story, `${context}: invitation`);
  assertText(text, '黑川物流市场部面试邀请函', `${context}: invitation title`);
  assertText(text, '尊敬的洛书先生', `${context}: invitation greeting`);
  choose(story, '关闭邮件', `${context}: close invitation`);

  text = drain(story, `${context}: first navigation`);
  assertChoices(
    story,
    ['请假｜去黑川物流面试', '上班｜去公司上班'],
    `${context}: first navigation must only offer interview and work`
  );
  assertVars(story, { SAN_SCORE: 0, COUNT_GAME_OVER: 0 }, `${context}: after invitation`);
  return story;
}

runTest('[natural] market invitation and first navigation only interview/work', () => {
  naturalFirstDay();
});

// ---------------------------------------------------------------------------
// Natural route to GAME OVER and reconnect.
// ---------------------------------------------------------------------------

runTest('[natural] first interview GAME OVER, disconnect and reconnect', () => {
  const context = '[natural] interview';
  const story = naturalFirstDay();
  choose(story, '请假｜去黑川物流面试', `${context}: choose`);

  let text = drain(story, `${context}: game over`);
  assertText(text, 'GAME OVER', `${context}: GAME OVER`);
  assertText(text, '你在黑川物流被 AZ 入职了', `${context}: ending text`);
  assertVars(
    story,
    {
      SAN_SCORE: 10,
      COUNT_GAME_OVER: 1,
      COUNT_ROUTE_BREAK_INTERVIEW: 1,
    },
    `${context}: first completion`
  );
  assertChoices(story, ['断开连接', '制作人员'], `${context}: game-over menu`);

  choose(story, '断开连接', `${context}: disconnect`);
  text = drain(story, `${context}: reconnect menu`);
  assertText(text, '即刻入职', `${context}: title after disconnect`);
  assert.ok(
    choiceTexts(story).includes('重新连接：第 1 次'),
    `${context}: expected reconnect option, got ${JSON.stringify(choiceTexts(story))}`
  );
  assert.ok(
    !choiceTexts(story).includes('初始化'),
    `${context}: initialization must be gone after first GAME OVER`
  );

  choose(story, '重新连接', `${context}: reconnect`);
  text = drain(story, `${context}: next day navigation`);
  assert.ok(
    choiceTexts(story).includes('请假｜去黑川物流面试') &&
      choiceTexts(story).includes('上班｜去公司上班'),
    `${context}: missing next-day choices: ${JSON.stringify(choiceTexts(story))}`
  );
  assertVars(
    story,
    { SAN_SCORE: 10, COUNT_GAME_OVER: 1, COUNT_ROUTE_BREAK_INTERVIEW: 1 },
    `${context}: reconnect preserves state`
  );
  assertText(text, '去上班吧～', `${context}: FINE reconnect narration`);
});

// ---------------------------------------------------------------------------
// Direct-entry ordinary routes: reach their own GAME OVER, +10 first, +5 repeat.
// ---------------------------------------------------------------------------

const GYM_PICKS = [
  '询问有关 健身房',
  '补偿',
  '店长亲自带',
  '算了吧',
  '兑换包月',
  '前往 更衣室',
  '仔细听',
  '离开 更衣室',
  '好的',
];

const ORDINARY_ROUTES = [
  {
    name: 'Break__Interview',
    inkPath: 'Break__Interview',
    counter: 'COUNT_ROUTE_BREAK_INTERVIEW',
    picks: [],
    ending: '你在黑川物流被 AZ 入职了',
  },
  {
    name: 'Break__Cinema',
    inkPath: 'Break__Cinema',
    counter: 'COUNT_ROUTE_BREAK_CINEMA',
    picks: [],
    ending: '你在电影院被 AZ 入职了',
  },
  {
    name: 'Break__Home',
    inkPath: 'Break__Home',
    counter: 'COUNT_ROUTE_BREAK_HOME',
    picks: [],
    ending: '你在家被入职了',
  },
  {
    name: 'Work__Off_Work',
    inkPath: 'Work__Off_Work',
    counter: 'COUNT_ROUTE_WORK_OFF_WORK',
    picks: [],
    ending: '你被 AZ 绑架了',
  },
  {
    name: 'Work__Business_Trip',
    inkPath: 'Work__Business_Trip.Choice',
    counter: 'COUNT_ROUTE_WORK_BUSINESS_TRIP',
    picks: ['去｜出差'],
    ending: '你在外地被入职了',
  },
  {
    name: 'Work__Napping',
    inkPath: 'Work__Napping.Choice',
    counter: 'COUNT_ROUTE_WORK_NAPPING',
    picks: ['闭目养神'],
    ending: '精神状态不太好的时候触发下午上班睡觉',
  },
  {
    name: 'Work__Gym',
    inkPath: 'Work__Gym',
    counter: 'COUNT_ROUTE_WORK_GYM',
    picks: GYM_PICKS,
    ending: '你变成了一个执行体',
  },
];

function driveRoute(route, vars, context) {
  const story = newStory(vars, context);
  enterPath(story, route.inkPath, context);
  let text = drain(story, context);
  for (const pick of route.picks) {
    choose(story, pick, `${context}: ${pick}`);
    text += drain(story, `${context}: after ${pick}`);
  }
  return { story, text };
}

for (const route of ORDINARY_ROUTES) {
  runTest(`[direct,state-injected] ${route.name} reaches GAME OVER (first +10, one GAME OVER)`, () => {
    const context = `[direct,state-injected] ${route.name} first`;
    const { story, text } = driveRoute(route, { SAN_SCORE: 0 }, context);
    assertText(text, 'GAME OVER', `${context}: GAME OVER`);
    assertText(text, route.ending, `${context}: ending text`);
    assertVars(
      story,
      {
        [route.counter]: 1,
        COUNT_GAME_OVER: 1,
        SAN_SCORE: 10,
      },
      `${context}: state after first completion`
    );
  });

  runTest(`[direct,state-injected] ${route.name} repeat +5, one GAME OVER`, () => {
    const context = `[direct,state-injected] ${route.name} repeat`;
    const { story, text } = driveRoute(
      route,
      {
        SAN_SCORE: 0,
        COUNT_GAME_OVER: 2,
        [route.counter]: 1,
      },
      context
    );
    assertText(text, 'GAME OVER', `${context}: GAME OVER`);
    assertVars(
      story,
      {
        [route.counter]: 2,
        COUNT_GAME_OVER: 3,
        SAN_SCORE: 5,
      },
      `${context}: state after repeat completion`
    );
  });
}

// ---------------------------------------------------------------------------
// Shutdown endings: one GAME OVER, no SAN change (existing behavior awaiting
// author confirmation; deliberately not changed by this smoke test).
// ---------------------------------------------------------------------------

for (const route of [
  {
    name: 'Work__Shutdown',
    inkPath: 'Work__Shutdown',
    counter: 'COUNT_ROUTE_WORK_SHUTDOWN',
    ending: '被 AZ 在办公室入职了',
  },
  {
    name: 'Break__Shutdown',
    inkPath: 'Break__Shutdown',
    counter: 'COUNT_ROUTE_BREAK_SHUTDOWN',
    ending: 'AZ 来你家开饭了',
  },
]) {
  runTest(`[direct,state-injected] ${route.name} GAME OVER without SAN increment (pending author)`, () => {
    const context = `[direct,state-injected] ${route.name}`;
    const story = newStory({ SAN_SCORE: 40 }, context);
    enterPath(story, route.inkPath, context);
    const text = drain(story, context);
    assertText(text, 'GAME OVER', `${context}: GAME OVER`);
    assertText(text, route.ending, `${context}: ending text`);
    assertVars(
      story,
      {
        [route.counter]: 1,
        COUNT_GAME_OVER: 1,
        SAN_SCORE: 40,
      },
      `${context}: shutdown must not change SAN_SCORE`
    );
  });
}

// ---------------------------------------------------------------------------
// FINE gym; OK/BAD rest.
// ---------------------------------------------------------------------------

runTest('[direct,state-injected] FINE offers gym in Work Evening, OK/BAD do not', () => {
  for (const [san, label, shouldOfferGym] of [
    [10, 'FINE', true],
    [30, 'OK', false],
    [60, 'BAD', false],
  ]) {
    const context = `[direct,state-injected] ${label} evening`;
    const story = newStory({ SAN_SCORE: san }, context);
    enterPath(story, 'Work__Route_Hub.Evening', context);
    drain(story, context);
    const hasGym = choiceTexts(story).some((text) => text.startsWith('健身｜'));
    assert.strictEqual(hasGym, shouldOfferGym, `${label}: gym option visibility`);
    assert.ok(
      choiceTexts(story).some((text) => text.startsWith('回家')),
      `${label}: home option missing`
    );
  }
});

runTest('[direct,state-injected] OK and BAD both offer home rest; FINE does not', () => {
  for (const [san, label, shouldOfferRest] of [
    [10, 'FINE', false],
    [30, 'OK', true],
    [60, 'BAD', true],
  ]) {
    const context = `[direct,state-injected] ${label} rest`;
    const story = newStory({ SAN_SCORE: san }, context);
    enterPath(story, 'Flow__Going_To.Choice', context);
    drain(story, context);
    const hasRest = choiceTexts(story).includes('请假｜呆在家里回血');
    assert.strictEqual(hasRest, shouldOfferRest, `${label}: home rest visibility`);
  }
});

// ---------------------------------------------------------------------------
// Forced WORK / BREAK: enter Dream__Router.Check from the normal title menu,
// then Shutdown -> next environment check -> DRONE. State injection constructs
// the conditions; it does not choose a path directly.
// ---------------------------------------------------------------------------

function enterFromTitleMenu(story, context) {
  const text = drain(story, `${context}: title`);
  assert.ok(
    choiceTexts(story).some((choice) => choice.startsWith('重新连接：第 1 次')),
    `${context}: expected reconnect menu, got ${JSON.stringify(choiceTexts(story))}`
  );
  choose(story, '重新连接', `${context}: reconnect`);
  return text + drain(story, `${context}: Dream__Router.Check`);
}

runTest('[state-injected] forced WORK from main menu -> Work__Shutdown -> DRONE, no random dream', () => {
  const context = '[state-injected] forced WORK';
  const story = newStory({ SAN_SCORE: 60, COUNT_GAME_OVER: 1 }, context);
  assert.strictEqual(
    evaluate(story, 'Get__Sanity_State', [60], context),
    'BAD',
    `${context}: sanity state`
  );
  assert.strictEqual(
    evaluate(story, 'Get__Forced_Intrusion', [], context),
    'WORK',
    `${context}: forced intrusion`
  );

  const before = visitSnapshot(story);
  let text = enterFromTitleMenu(story, context);
  assertText(text, '被老板电话打醒了', `${context}: work forced narration`);
  assertText(text, '推开门进了老板办公室', `${context}: work shutdown`);
  assertVars(
    story,
    {
      COUNT_ROUTE_WORK_SHUTDOWN: 1,
      COUNT_GAME_OVER: 2,
      SAN_SCORE: 60,
    },
    `${context}: shutdown state`
  );

  choose(story, '断开连接', context);
  text = drain(story, `${context}: environment`);
  assertText(text, '⟦', `${context}: DRONE page`);
  assert.strictEqual(
    evaluate(story, 'Get__Aboard_Status', [], context),
    'DRONE',
    `${context}: aboard status`
  );
  assert.ok(
    !choiceTexts(story).includes('初始化'),
    `${context}: DRONE must not return to the normal title menu`
  );

  const after = visitSnapshot(story);
  assertVisitDelta(
    before,
    after,
    { Dream1: 0, Dream2: 0, Dream3: 0, Dream4: 0, Dream5: 0, Dream6: 0, Dream7: 0 },
    `${context}: forced intrusion must not roll a dream`
  );
});

runTest('[state-injected] forced BREAK from main menu -> Break__Shutdown -> DRONE, no random dream', () => {
  const context = '[state-injected] forced BREAK';
  const story = newStory(
    {
      SAN_SCORE: 60,
      COUNT_GAME_OVER: 1,
      COUNT_ROUTE_WORK_BUSINESS_TRIP: 1,
      COUNT_ROUTE_WORK_OFF_WORK: 1,
    },
    context
  );
  assert.strictEqual(
    evaluate(story, 'Get__Forced_Intrusion', [], context),
    'BREAK',
    `${context}: forced intrusion`
  );

  const before = visitSnapshot(story);
  let text = enterFromTitleMenu(story, context);
  assertText(text, 'AZ 来敲门。', `${context}: break forced narration`);
  assertText(text, 'AZ 来你家开饭了', `${context}: break shutdown ending`);
  assertVars(
    story,
    {
      COUNT_ROUTE_BREAK_SHUTDOWN: 1,
      COUNT_GAME_OVER: 2,
      SAN_SCORE: 60,
    },
    `${context}: shutdown state`
  );

  choose(story, '断开连接', context);
  text = drain(story, `${context}: environment`);
  assertText(text, '⟦', `${context}: DRONE page`);
  assert.strictEqual(
    evaluate(story, 'Get__Aboard_Status', [], context),
    'DRONE',
    `${context}: aboard status`
  );

  const after = visitSnapshot(story);
  assertVisitDelta(
    before,
    after,
    { Dream1: 0, Dream2: 0, Dream3: 0, Dream4: 0, Dream5: 0, Dream6: 0, Dream7: 0 },
    `${context}: forced intrusion must not roll a dream`
  );
});

// ---------------------------------------------------------------------------
// Pure-click natural run over all nine routes. No ChoosePathString, no variable
// injection: the title screen, navigation, every route choice and every dream
// follow-up are ordinary choice clicks.
// ---------------------------------------------------------------------------

const NATURAL_ROUTE_STEPS = [
  {
    san: 10,
    counter: 'COUNT_ROUTE_WORK_GYM',
    ending: '你变成了一个执行体',
  },
  {
    san: 20,
    counter: 'COUNT_ROUTE_WORK_OFF_WORK',
    ending: '下班回家被 AZ 入职',
  },
  {
    san: 30,
    counter: 'COUNT_ROUTE_BREAK_INTERVIEW',
    ending: '你在黑川物流被 AZ 入职了',
  },
  {
    san: 40,
    counter: 'COUNT_ROUTE_WORK_BUSINESS_TRIP',
    ending: '你在外地被入职了',
  },
  {
    san: 50,
    counter: 'COUNT_ROUTE_WORK_NAPPING',
    ending: '精神状态不太好的时候触发下午上班睡觉',
  },
  {
    san: 60,
    counter: 'COUNT_ROUTE_BREAK_HOME',
    ending: '你在家被入职了',
  },
  {
    san: 70,
    counter: 'COUNT_ROUTE_BREAK_CINEMA',
    ending: '你在电影院被 AZ 入职了',
  },
  {
    san: 70,
    counter: 'COUNT_ROUTE_WORK_SHUTDOWN',
    ending: '被 AZ 在办公室入职了',
  },
  {
    san: 70,
    counter: 'COUNT_ROUTE_BREAK_SHUTDOWN',
    ending: 'AZ 来你家开饭了',
  },
];

function isNavigationChoice(text) {
  return (
    text.startsWith('请假｜') ||
    text.startsWith('上班｜') ||
    normalizeChoiceText(text).includes('向黑川物流效忠')
  );
}

function followSingleChoices(story, predicate, context) {
  let text = '';
  for (let step = 0; step <= MAX_AUTO_CHOICES; step += 1) {
    text += drain(story, `${context}: step ${step}`);
    const choices = choiceTexts(story);
    if (predicate(choices)) return text;
    if (choices.length === 1) {
      chooseIndex(story, 0, `${context}: follow-up ${step}: ${choices[0]}`);
      continue;
    }
    throw new Error(
      `${context}: expected one follow-up choice, got ${JSON.stringify(choices)}`
    );
  }
  throw new Error(`${context}: follow-up limit ${MAX_AUTO_CHOICES} exceeded`);
}

function advanceToNavigation(story, context) {
  let text = '';
  for (let step = 0; step <= MAX_AUTO_CHOICES; step += 1) {
    text += drain(story, `${context}: step ${step}`);
    const choices = choiceTexts(story);
    if (choices.some(isNavigationChoice)) {
      // A random dream may leave a single follow-up choice (e.g. Dream4's 点菜)
      // parked alongside the navigation menu. The navigation choice is the
      // player-facing continuation; choosing it abandons the parked dream thread,
      // which is also what the reference natural run did.
      return text;
    }
    if (choices.length === 1) {
      chooseIndex(story, 0, `${context}: dream/interstitial ${step}: ${choices[0]}`);
      continue;
    }
    throw new Error(
      `${context}: expected navigation or one follow-up choice, ` +
      `got ${JSON.stringify(choices)}`
    );
  }
  throw new Error(`${context}: navigation limit ${MAX_AUTO_CHOICES} exceeded`);
}

function finishNaturalGameOver(story, step, text, context) {
  const expected = NATURAL_ROUTE_STEPS[step - 1];
  assertText(text, 'GAME OVER', `${context}: GAME OVER`);
  assertText(text, expected.ending, `${context}: ending text`);
  assertVars(
    story,
    {
      SAN_SCORE: expected.san,
      COUNT_GAME_OVER: step,
      [expected.counter]: 1,
    },
    `${context}: state after route ${step}`
  );
  assertChoices(story, ['断开连接', '制作人员'], `${context}: game-over menu`);

  choose(story, '断开连接', `${context}: disconnect`);
  const titleText = drain(story, `${context}: title after route ${step}`);
  assert.ok(
    choiceTexts(story).some((choice) => choice.startsWith(`重新连接：第 ${step} 次`)),
    `${context}: expected reconnect ${step}, got ${JSON.stringify(choiceTexts(story))}`
  );
  return titleText;
}

runTest('[natural] pure-click full 9 routes -> No.8 -> reconciliation -> reality -> credits END', () => {
  const context = '[natural] full 9 routes';
  const story = newStory({}, context);

  let text = drain(story, `${context}: title`);
  assertChoices(
    story,
    ['初始化', '结局回溯', '————————', '更新日志', '制作人员'],
    `${context}: title menu`
  );
  choose(story, '初始化', `${context}: init`);
  advanceToNavigation(story, `${context}: prologue`);
  assertChoices(
    story,
    ['请假｜去黑川物流面试', '上班｜去公司上班'],
    `${context}: first navigation`
  );

  // 1. Gym: work -> refuse the trip -> BuMi -> evening gym -> gym choices.
  choose(story, '上班｜', `${context}: 1 work`);
  drain(story, `${context}: 1 morning`);
  assertChoices(story, ['去｜出差', '不去｜下次再说'], `${context}: 1 business trip`);
  choose(story, '不去｜', `${context}: 1 refuse trip`);
  followSingleChoices(
    story,
    (choices) => choices.some((choice) => choice.startsWith('健身｜') || choice.startsWith('回家')),
    `${context}: 1 BuMi to evening`
  );
  assert.ok(
    choiceTexts(story).some((choice) => choice.startsWith('健身｜')),
    `${context}: 1 FINE evening must offer gym`
  );
  choose(story, '健身｜', `${context}: 1 gym`);
  drain(story, `${context}: 1 gym reception`);
  let routeText = '';
  for (const pick of GYM_PICKS) {
    choose(story, pick, `${context}: 1 gym ${pick}`);
    routeText = drain(story, `${context}: 1 gym after ${pick}`);
  }
  finishNaturalGameOver(story, 1, routeText, `${context}: 1 gym`);

  // 2. Off work: work -> refuse -> BuMi -> evening home.
  choose(story, '重新连接', `${context}: 2 reconnect`);
  advanceToNavigation(story, `${context}: 2 navigation`);
  choose(story, '上班｜', `${context}: 2 work`);
  drain(story, `${context}: 2 morning`);
  choose(story, '不去｜', `${context}: 2 refuse trip`);
  followSingleChoices(
    story,
    (choices) => choices.some((choice) => choice.startsWith('健身｜') || choice.startsWith('回家')),
    `${context}: 2 BuMi to evening`
  );
  choose(story, '回家', `${context}: 2 home`);
  routeText = drain(story, `${context}: 2 off work`);
  finishNaturalGameOver(story, 2, routeText, `${context}: 2 off work`);

  // 3. Interview.
  choose(story, '重新连接', `${context}: 3 reconnect`);
  advanceToNavigation(story, `${context}: 3 navigation`);
  choose(story, '请假｜去黑川物流面试', `${context}: 3 interview`);
  routeText = drain(story, `${context}: 3 interview ending`);
  finishNaturalGameOver(story, 3, routeText, `${context}: 3 interview`);

  // 4. Business trip: work -> accept the trip.
  choose(story, '重新连接', `${context}: 4 reconnect`);
  advanceToNavigation(story, `${context}: 4 navigation`);
  choose(story, '上班｜', `${context}: 4 work`);
  drain(story, `${context}: 4 morning`);
  choose(story, '去｜出差', `${context}: 4 accept trip`);
  routeText = drain(story, `${context}: 4 trip ending`);
  finishNaturalGameOver(story, 4, routeText, `${context}: 4 business trip`);

  // 5. Napping: work -> refuse -> OK afternoon nap.
  choose(story, '重新连接', `${context}: 5 reconnect`);
  advanceToNavigation(story, `${context}: 5 navigation`);
  choose(story, '上班｜', `${context}: 5 work`);
  drain(story, `${context}: 5 morning`);
  choose(story, '不去｜', `${context}: 5 refuse trip`);
  followSingleChoices(
    story,
    (choices) => choices.some((choice) => choice.includes('闭目养神')),
    `${context}: 5 OK afternoon`
  );
  choose(story, '闭目养神', `${context}: 5 nap`);
  routeText = drain(story, `${context}: 5 nap ending`);
  finishNaturalGameOver(story, 5, routeText, `${context}: 5 napping`);

  // 6. Home rest.
  choose(story, '重新连接', `${context}: 6 reconnect`);
  advanceToNavigation(story, `${context}: 6 navigation`);
  choose(story, '请假｜呆在家里回血', `${context}: 6 home rest`);
  routeText = drain(story, `${context}: 6 home ending`);
  finishNaturalGameOver(story, 6, routeText, `${context}: 6 home`);

  // 7. Cinema.
  choose(story, '重新连接', `${context}: 7 reconnect`);
  advanceToNavigation(story, `${context}: 7 navigation`);
  choose(story, '请假｜出门找人看电影玩', `${context}: 7 cinema`);
  routeText = drain(story, `${context}: 7 cinema ending`);
  finishNaturalGameOver(story, 7, routeText, `${context}: 7 cinema`);

  // 8. Office shutdown: all work routes are already visited.
  choose(story, '重新连接', `${context}: 8 reconnect`);
  advanceToNavigation(story, `${context}: 8 navigation`);
  choose(story, '上班｜', `${context}: 8 work`);
  routeText = drain(story, `${context}: 8 office shutdown`);
  finishNaturalGameOver(story, 8, routeText, `${context}: 8 office shutdown`);

  // 9. AWFUL unique corrupted choice: home shutdown.
  choose(story, '重新连接', `${context}: 9 reconnect`);
  advanceToNavigation(story, `${context}: 9 AWFUL navigation`);
  const loyaltyChoices = choiceTexts(story).filter((choice) =>
    normalizeChoiceText(choice).includes('向黑川物流效忠')
  );
  assert.strictEqual(loyaltyChoices.length, 1, `${context}: 9 unique AWFUL loyalty choice`);
  chooseNormalized(story, '向黑川物流效忠', `${context}: 9 loyalty`);
  routeText = drain(story, `${context}: 9 home shutdown`);
  finishNaturalGameOver(story, 9, routeText, `${context}: 9 home shutdown`);

  // Final sequence: pre-final visit snapshot -> reconnect -> reconciliation ->
  // reality -> credits -> normal END.
  assert.ok(
    choiceTexts(story).includes('重新连接：第 9 次'),
    `${context}: final reconnect menu`
  );
  const beforeFinal = visitSnapshot(story);
  choose(story, '重新连接', `${context}: final reconnect`);
  const finalText = drain(story, `${context}: final reconciliation and reality`);
  assertFinalAndReality(story, finalText, `${context}: final`);

  choose(story, '制作人员', `${context}: credits`);
  const creditsText = drain(story, `${context}: credits END`);
  assertCreditsEnd(story, creditsText, `${context}: credits`);

  const afterFinal = visitSnapshot(story);
  assertVisitDelta(
    beforeFinal,
    afterFinal,
    {
      'Ending__Final_Reconciliation': 1,
      'Ending__No8_Reality': 1,
      'Flow__Startup': 0,
      'Flow__Navigator': 0,
      Dream1: 0,
      Dream2: 0,
      Dream3: 0,
      Dream4: 0,
      Dream5: 0,
      Dream6: 0,
      Dream7: 0,
    },
    `${context}: final visit delta`
  );
});

// ---------------------------------------------------------------------------
// All routes -> No.8 priority -> final reconciliation -> reality -> credits.
// ---------------------------------------------------------------------------

const ALL_ROUTE_COUNTS = Object.freeze({
  COUNT_ROUTE_WORK_GYM: 1,
  COUNT_ROUTE_WORK_OFF_WORK: 1,
  COUNT_ROUTE_WORK_BUSINESS_TRIP: 1,
  COUNT_ROUTE_WORK_NAPPING: 1,
  COUNT_ROUTE_WORK_SHUTDOWN: 1,
  COUNT_ROUTE_BREAK_INTERVIEW: 1,
  COUNT_ROUTE_BREAK_CINEMA: 1,
  COUNT_ROUTE_BREAK_HOME: 1,
  COUNT_ROUTE_BREAK_SHUTDOWN: 1,
});

function assertFinalAndReality(story, text, context) {
  assertText(text, '耳鸣持续了很长，很长时间。', `${context}: final reconciliation`);
  assertText(text, '电流声终于不再只是耳边的回响。', `${context}: reality awakening`);
  assertText(text, '黑川物流，市场部部长，No.8。', `${context}: No.8 identity`);
  assertText(text, '感谢游玩！', `${context}: reality ending`);

  const finalAt = text.indexOf('耳鸣持续了很长，很长时间。');
  const realityAt = text.indexOf('电流声终于不再只是耳边的回响。');
  const no8At = text.indexOf('黑川物流，市场部部长，No.8。');
  assert.ok(finalAt >= 0 && realityAt > finalAt && no8At > realityAt, `${context}: order`);
  assert.ok(!text.includes('（人……为什么要上班……）'), `${context}: extra ordinary wake`);
  assert.ok(!text.includes('闹钟'), `${context}: extra ordinary alarm`);
  assert.ok(!text.includes('“哈欠……”'), `${context}: extra ordinary startup sound`);
  assert.ok(!text.includes('初始化'), `${context}: returned to main menu`);
  assertChoices(story, ['制作人员'], `${context}: final choice`);
  assertVars(
    story,
    { HAS_ENTERED_FINAL_RECONCILIATION: true },
    `${context}: final reconciliation flag`
  );
  assert.strictEqual(
    evaluate(story, 'Get__Aboard_Status', [], context),
    'No.8',
    `${context}: aboard status`
  );
}

runTest('[state-injected] all routes: No.8 -> reconciliation -> reality -> credits END', () => {
  const context = '[state-injected] all routes No.8';
  const story = newStory(
    {
      SAN_SCORE: 90,
      COUNT_GAME_OVER: 9,
      ...ALL_ROUTE_COUNTS,
    },
    context
  );
  assert.strictEqual(
    evaluate(story, 'Get__Sanity_State', [90], context),
    'AWFUL',
    `${context}: AWFUL with all routes`
  );
  assert.strictEqual(
    evaluate(story, 'Get__Aboard_Status', [], context),
    'No.8',
    `${context}: No.8 while AWFUL`
  );

  let text = drain(story, `${context}: title menu`);
  assert.ok(
    choiceTexts(story).includes('重新连接：第 9 次'),
    `${context}: reconnect menu`
  );

  const beforeFinal = visitSnapshot(story);
  choose(story, '重新连接', context);
  text = drain(story, `${context}: final reconciliation and reality`);
  assertFinalAndReality(story, text, context);

  choose(story, '制作人员', `${context}: credits`);
  const creditsText = drain(story, `${context}: credits END`);
  assertCreditsEnd(story, creditsText, `${context}: credits`);

  const afterFinal = visitSnapshot(story);
  assertVisitDelta(
    beforeFinal,
    afterFinal,
    {
      'Ending__Final_Reconciliation': 1,
      'Ending__No8_Reality': 1,
      'Flow__Startup': 0,
      'Flow__Navigator': 0,
      Dream1: 0,
      Dream2: 0,
      Dream3: 0,
      Dream4: 0,
      Dream5: 0,
      Dream6: 0,
      Dream7: 0,
    },
    `${context}: final visit delta`
  );
});

runTest('[direct,state-injected] already reconciled -> reality No.8 -> credits END (Final=0, Reality=1)', () => {
  const context = '[direct,state-injected] No.8 reality';
  const story = newStory(
    {
      SAN_SCORE: 90,
      COUNT_GAME_OVER: 9,
      HAS_ENTERED_FINAL_RECONCILIATION: true,
      ...ALL_ROUTE_COUNTS,
    },
    context
  );

  const before = visitSnapshot(story);
  enterPath(story, 'Dream__Router.Check', context);
  const text = drain(story, context);
  assertText(text, '电流声终于不再只是耳边的回响。', `${context}: reality`);
  assert.ok(!text.includes('耳鸣持续了很长，很长时间。'), `${context}: final reconciliation repeated`);
  assert.ok(!text.includes('（人……为什么要上班……）'), `${context}: ordinary wake`);
  assertChoices(story, ['制作人员'], `${context}: final choice`);

  const beforeCredits = visitSnapshot(story);
  assertVisitDelta(
    before,
    beforeCredits,
    {
      'Ending__Final_Reconciliation': 0,
      'Ending__No8_Reality': 1,
      'Flow__Startup': 0,
      'Flow__Navigator': 0,
      Dream1: 0,
      Dream2: 0,
      Dream3: 0,
      Dream4: 0,
      Dream5: 0,
      Dream6: 0,
      Dream7: 0,
    },
    `${context}: visit delta`
  );

  choose(story, '制作人员', `${context}: credits`);
  const creditsText = drain(story, `${context}: credits END`);
  assertCreditsEnd(story, creditsText, `${context}: credits`);

  const afterCredits = visitSnapshot(story);
  assertVisitDelta(
    beforeCredits,
    afterCredits,
    {
      'Ending__Final_Reconciliation': 0,
      'Ending__No8_Reality': 0,
      'Flow__Startup': 0,
      'Flow__Navigator': 0,
      Dream1: 0,
      Dream2: 0,
      Dream3: 0,
      Dream4: 0,
      Dream5: 0,
      Dream6: 0,
      Dream7: 0,
    },
    `${context}: credits must not visit another wake`
  );
});

// ---------------------------------------------------------------------------
// Control: an uncompleted run (HAS_ENTERED_FINAL_RECONCILIATION=false) must
// still offer 回到标题 on Credits and return to the normal title menu.
// ---------------------------------------------------------------------------

runTest('[natural] uncompleted credits still returns to title', () => {
  const context = '[natural] uncompleted credits';
  const story = newStory({}, context);

  let text = drain(story, `${context}: title`);
  assertChoices(
    story,
    ['初始化', '结局回溯', '————————', '更新日志', '制作人员'],
    `${context}: title menu`
  );

  choose(story, '制作人员', `${context}: open credits`);
  text = drain(story, `${context}: credits`);
  assertText(text, '【制作人员】', `${context}: credits heading`);
  assertChoices(story, ['回到标题'], `${context}: uncompleted credits choice`);

  choose(story, '回到标题', `${context}: back to title`);
  text = drain(story, `${context}: title after credits`);
  assertText(text, '更新日期：20260327', `${context}: title page`);
  assertText(text, '本互动小说为黑川物流主世界内容', `${context}: title body`);
  assertChoices(
    story,
    ['初始化', '结局回溯', '————————', '更新日志', '制作人员'],
    `${context}: title menu after credits`
  );
});

// ---------------------------------------------------------------------------
// Reset and gallery side effects. ResetState is an engine-level check only;
// this does not exercise the GUI or a #RESTART host.
// ---------------------------------------------------------------------------

runTest('[engine] ResetState clears progress and returns to the title menu', () => {
  const context = '[engine] ResetState';
  const story = naturalFirstDay();
  choose(story, '请假｜去黑川物流面试', `${context}: reach a real GAME OVER`);
  drain(story, `${context}: GAME OVER before reset`);
  assertVars(story, { SAN_SCORE: 10, COUNT_GAME_OVER: 1 }, `${context}: progress before reset`);

  story.variablesState['HAS_ENTERED_FINAL_RECONCILIATION'] = true;
  story.variablesState['UNLOCKED_NO8_DATABASE'] = true;
  story.variablesState['COUNT_MENU_SEPARATOR'] = 2;

  story.ResetState();
  checkDiagnostics(story, `${context}: ResetState`);
  assertVars(story, DEFAULT_VARS, `${context}: reset defaults`);

  drain(story, `${context}: title after reset`);
  assertChoices(
    story,
    ['初始化', '结局回溯', '————————', '更新日志', '制作人员'],
    `${context}: title menu after reset`
  );
});

runTest('[direct,state-injected] route gallery does not change counters or SAN', () => {
  const context = '[direct,state-injected] route gallery';
  const story = newStory(
    {
      SAN_SCORE: 10,
      COUNT_GAME_OVER: 1,
      COUNT_ROUTE_BREAK_INTERVIEW: 1,
    },
    context
  );
  enterPath(story, 'Ending__Route_Gallery.Index', context);
  drain(story, context);
  assert.ok(choiceTexts(story).includes('面试'), `${context}: experienced route missing`);

  const before = {};
  for (const name of Object.keys(DEFAULT_VARS)) before[name] = story.variablesState[name];

  choose(story, '面试', `${context}: open interview ending`);
  const endingText = drain(story, `${context}: ending`);
  assertText(endingText, 'GAME OVER', `${context}: gallery ending body`);

  const after = {};
  for (const name of Object.keys(DEFAULT_VARS)) after[name] = story.variablesState[name];
  assert.deepStrictEqual(after, before, `${context}: gallery must not mutate runtime state`);

  choose(story, '返回上一级', `${context}: back`);
  drain(story, `${context}: gallery again`);
  const afterBack = {};
  for (const name of Object.keys(DEFAULT_VARS)) afterBack[name] = story.variablesState[name];
  assert.deepStrictEqual(afterBack, before, `${context}: returning must not mutate runtime state`);
});

// ---------------------------------------------------------------------------
// Summary.
// ---------------------------------------------------------------------------

const passed = results.filter((result) => result.status === 'PASS').length;
const failed = results.filter((result) => result.status === 'FAIL').length;

console.log('');
console.log(`Phase 0 smoke: ${passed} passed, ${failed} failed, ${results.length} total`);
console.log(`Compiled JSON: ${jsonPath}`);
console.log(`inkjs module: ${process.env.INKJS_MODULE || 'inkjs'}`);

if (failed > 0) {
  console.log('');
  for (const result of results) {
    if (result.status === 'FAIL') {
      console.log(`FAILED: ${result.name}`);
      console.log(result.error.stack || result.error.message);
    }
  }
  process.exit(1);
}

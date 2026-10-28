#!/usr/bin/env node
'use strict';

// Run compiled Ink with a real inkjs runtime; no story logic is reimplemented here.
// node regression.cjs story.json /absolute/path/to/inkjs/dist/ink.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const jsonPath = process.argv[2];
const runtimePath = process.argv[3] || process.env.INKJS_MODULE;
if (!jsonPath || !runtimePath) {
  console.error('Usage: node regression.cjs story.json /absolute/path/to/inkjs/dist/ink.js');
  process.exit(2);
}
const { Story } = require(path.resolve(runtimePath));
const compiled = fs.readFileSync(jsonPath, 'utf8');
const flagNames = Array.from({ length: 11 }, (_, i) => `Ending_F${i + 1}_Achieved`);
const classifications = ['普通', '最佳', '好', '普通', '普通', '普通', '坏', '一般', '好', '真正', '最坏'];
const endingRows = s => s.currentChoices.filter(c => /^\d+\./.test(c.text));
const flags = s => flagNames.map(n => s.variablesState[n]);
const achieved = s => flags(s).flatMap((yes, i) => yes ? [i + 1] : []);
const variables = s => ['Rate_LeiHu', 'Choose_YeHen', 'Choose_CenYe', 'Choose_LeiHu'].map(n => s.variablesState[n]);
const atEnd = s => s.currentChoices.length === 4 && s.currentChoices[0].text === '吼啊';
function drain(s) {
  let output = '', lines = 0;
  while (s.canContinue) {
    assert.ok(++lines < 2000, 'story did not reach a choice');
    output += s.Continue();
  }
  return output;
}
function fresh() {
  const s = new Story(compiled);
  s.onError = (message, type) => { throw new Error(`Ink runtime ${type}: ${message}`); };
  drain(s);
  return s;
}
function choose(s, selector) {
  const i = typeof selector === 'number' ? selector : s.currentChoices.findIndex(c => c.text === selector);
  assert.ok(i >= 0 && i < s.currentChoices.length, `choice missing: ${selector}`);
  s.ChooseChoiceIndex(i);
  return drain(s);
}
function jump(s, target) {
  s.ChoosePathString(target);
  return drain(s);
}
function finish(s, f8Choice = '担心身体', interimChoice = 0) {
  for (let n = 0; !atEnd(s); n++) {
    assert.ok(n < 8 && s.currentChoices.length > 0, 'ending did not reach TheEnd');
    choose(s, s.currentChoices.some(c => c.text === '担心身体') ? f8Choice : interimChoice);
  }
}
function title(s) {
  assert.ok(atEnd(s), 'expected TheEnd choices before returning to title');
  choose(s, 0);
}
function review(s) {
  choose(s, '更多信息');
  choose(s, '结局回顾');
}
function unlock(s) {
  for (let n = 1; n <= 5; n++) {
    choose(s, '————————————————');
    assert.equal(s.currentChoices.some(c => c.text === '查看所有结局'), n === 5);
  }
}
function allEndings(s) {
  review(s);
  if (!s.currentChoices.some(c => c.text === '查看所有结局')) unlock(s);
  choose(s, '查看所有结局');
  assert.equal(endingRows(s).length, 11);
}
function selectEnding(s, id) {
  const index = s.currentChoices.findIndex(c => c.text.startsWith(`${id}.`));
  choose(s, index);
}
function start(s, home = false) {
  choose(s, s.currentChoices.some(c => c.text === '开始攻略') ? '开始攻略' : '再攻略一次！');
  choose(s, 0); // START.Seg1
  choose(s, 0); // START.Seg2: explanation
  choose(s, home ? 2 : 0);
}
// first: 0=YeHen, 1=CenYe, 2=LeiHu/stop, 3=LeiHu/ask/pay, 4=LeiHu/ask/tired.
function dormitory(s, first, greeting, activity) {
  start(s);
  choose(s, Math.min(first, 2));
  if (first >= 2) {
    choose(s, first === 2 ? 1 : 0);
    if (first >= 3) choose(s, first === 3 ? 0 : 1);
  }
  choose(s, greeting);
  choose(s, activity);
}
function home(s, target) {
  start(s, true);
  choose(s, target === 2 ? 2 : target === 4 ? 1 : 0); // heating
  choose(s, target === 2 ? 0 : 1); // help
  choose(s, 0); // cook
  if (target === 4) choose(s, 0); // ask progress
  else {
    choose(s, 0); // warmth
    choose(s, target === 1 ? 1 : 0); // F1 diversion, or continue
  }
  if (target !== 1) choose(s, target === 4 ? 1 : 0);
  finish(s);
  assert.ok(s.variablesState[`Ending_F${target}_Achieved`]);
}

console.log(`# Runtime: ${path.resolve(runtimePath)}`);
console.log(`# Compiled story: ${path.resolve(jsonPath)}`);

test('formal ending bodies F1-F11 record only the completed ending (injected entries)', () => {
  for (let id = 1; id <= 11; id++) {
    const s = fresh();
    jump(s, `Finale.F${id}`);
    finish(s);
    assert.deepEqual(achieved(s), [id], `F${id}`);
    assert.equal(s.variablesState.FinaleCount, 1);
    assert.equal(s.variablesState.IsPreviewMode, false);
  }
});

test('F8 common scene does not record F8; three exits record only their own ending', () => {
  for (const [selector, expected] of [['担心身体', 8], ['好好吃饭', 9], ['袒露心声', 10]]) {
    const s = fresh();
    s.variablesState.Ending_F2_Achieved = true;
    s.variablesState.Ending_F7_Achieved = true;
    jump(s, 'Finale.F8');
    assert.deepEqual(achieved(s), [2, 7]);
    assert.equal(s.variablesState.Ending_F8_Achieved, false);
    finish(s, selector);
    assert.deepEqual(achieved(s), [2, 7, expected].sort((a, b) => a - b));
  }
});

test('developer menu unlocks on exactly the fifth separator click', () => {
  const s = fresh();
  review(s);
  assert.equal(endingRows(s).length, 0);
  unlock(s);
  choose(s, '查看所有结局');
  assert.equal(endingRows(s).length, 11);
  assert.deepEqual(achieved(s), []);
});

test('all developer previews F1-F11 preserve both empty and existing formal records', () => {
  for (const seed of [false, true]) for (let id = 1; id <= 11; id++) {
    const s = fresh();
    s.variablesState.Ending_F3_Achieved = seed;
    const expected = flags(s);
    allEndings(s);
    selectEnding(s, id);
    finish(s);
    assert.deepEqual(flags(s), expected, `developer F${id}, existing record=${seed}`);
    assert.equal(s.variablesState.FinaleCount, Number(seed));
    assert.equal(s.variablesState.IsPreviewMode, false);
    title(s);
    review(s);
    assert.deepEqual(endingRows(s).map(c => Number(c.text.split('.')[0])), seed ? [3] : []);
  }
});

test('every formal review entry is a preview; unachieved endings stay hidden', () => {
  for (let id = 1; id <= 11; id++) {
    const s = fresh();
    s.variablesState[`Ending_F${id}_Achieved`] = true;
    review(s);
    assert.equal(endingRows(s).length, 1);
    const row = endingRows(s)[0];
    assert.ok(row.text.startsWith(`${id}.${classifications[id - 1]}结局`));
    const before = flags(s);
    selectEnding(s, id);
    finish(s);
    assert.deepEqual(flags(s), before, `review F${id}`);
    assert.equal(s.variablesState.FinaleCount, 1);
    assert.equal(s.variablesState.IsPreviewMode, false);
  }
});

test('reviewing F8 then branching to F9/F10 cannot grant another formal ending', () => {
  for (const selector of ['好好吃饭', '袒露心声']) {
    const s = fresh();
    for (const id of [2, 7, 8]) s.variablesState[`Ending_F${id}_Achieved`] = true;
    review(s);
    selectEnding(s, 8);
    assert.equal(s.variablesState.IsPreviewMode, true);
    finish(s, selector);
    assert.deepEqual(achieved(s), [2, 7, 8]);
    assert.equal(s.variablesState.FinaleCount, 3);
  }
});

test('developer preview of F8 can branch to F9/F10 without granting formal endings', () => {
  for (const selector of ['好好吃饭', '袒露心声']) {
    const s = fresh();
    for (const id of [2, 7]) s.variablesState[`Ending_F${id}_Achieved`] = true;
    allEndings(s);
    selectEnding(s, 8);
    assert.equal(s.variablesState.IsPreviewMode, true);
    finish(s, selector);
    assert.deepEqual(achieved(s), [2, 7]);
    assert.equal(s.variablesState.FinaleCount, 2);
    assert.equal(s.variablesState.IsPreviewMode, false);
  }
});

test('F9/F10 unlock matrix uses formal F2/F7 flags (injected states)', () => {
  for (const f2 of [false, true]) for (const f7 of [false, true]) {
    const s = fresh();
    s.variablesState.Ending_F2_Achieved = f2;
    s.variablesState.Ending_F7_Achieved = f7;
    jump(s, 'Finale.F8');
    assert.equal(s.currentChoices.some(c => c.text === '好好吃饭'), f2);
    assert.equal(s.currentChoices.some(c => c.text === '袒露心声'), f2 && f7);
  }
});

test('developer previews of F2/F7 do not unlock hidden branches on the next normal run', () => {
  const s = fresh();
  for (const id of [2, 7]) {
    allEndings(s);
    selectEnding(s, id);
    finish(s);
    title(s);
  }
  dormitory(s, 1, 2, 2); // rate=3 through normal choices
  assert.deepEqual(s.currentChoices.map(c => c.text), ['担心身体']);
  assert.deepEqual(achieved(s), []);
  finish(s);
  assert.deepEqual(achieved(s), [8]);
});

test('count and review agree for all 2048 formal-record combinations', () => {
  const s = fresh();
  for (let mask = 0; mask < 2048; mask++) {
    s.ResetState();
    const expected = [];
    for (let i = 0; i < 11; i++) {
      const yes = Boolean(mask & (1 << i));
      s.variablesState[flagNames[i]] = yes;
      if (yes) expected.push(i + 1);
    }
    jump(s, 'Title');
    assert.equal(s.variablesState.FinaleCount, expected.length, `mask=${mask}`);
    review(s);
    assert.deepEqual(endingRows(s).map(c => Number(c.text.split('.')[0])), expected, `mask=${mask}`);
  }
});

test('repeating the same formal ending does not duplicate its count', () => {
  const s = fresh();
  for (let i = 0; i < 3; i++) {
    jump(s, 'Finale.F2');
    finish(s);
    assert.deepEqual(achieved(s), [2]);
    assert.equal(s.variablesState.FinaleCount, 1);
  }
});

test('normal retry menu clears injected dirty run state, retaining formal endings', () => {
  const s = fresh();
  home(s, 2);
  title(s);
  s.variablesState.Rate_LeiHu = 9;
  for (const name of ['Choose_YeHen', 'Choose_CenYe', 'Choose_LeiHu']) s.variablesState[name] = 4;
  s.variablesState.IsPreviewMode = true;
  choose(s, '再攻略一次！');
  assert.deepEqual(variables(s), [0, 0, 0, 0]);
  assert.equal(s.variablesState.IsPreviewMode, false);
  assert.deepEqual(achieved(s), [2]);
});

test('engine ResetState clears all run values, formal flags, preview and developer unlock', () => {
  const s = fresh();
  allEndings(s);
  selectEnding(s, 5); // preview pauses before completing F5
  assert.equal(s.variablesState.IsPreviewMode, true);
  for (const name of flagNames) s.variablesState[name] = true;
  s.variablesState.Rate_LeiHu = 9;
  for (const name of ['Choose_YeHen', 'Choose_CenYe', 'Choose_LeiHu']) s.variablesState[name] = 4;
  s.ResetState();
  drain(s);
  assert.deepEqual(variables(s), [0, 0, 0, 0]);
  assert.deepEqual(achieved(s), []);
  assert.equal(s.variablesState.FinaleCount, 0);
  assert.equal(s.variablesState.IsPreviewMode, false);
  review(s);
  assert.equal(s.currentChoices.some(c => c.text === '查看所有结局'), false);
});

test('normal title routes reach F1-F6, F8, F9 and F11 without injecting variables', () => {
  for (let id = 1; id <= 4; id++) {
    const s = fresh();
    home(s, id);
    assert.deepEqual(achieved(s), [id]);
  }
  for (const [id, first, greeting, activity] of [[5, 0, 0, 0], [6, 1, 1, 1], [8, 1, 2, 2]]) {
    const s = fresh();
    dormitory(s, first, greeting, activity);
    finish(s);
    assert.deepEqual(achieved(s), [id]);
  }
  const s = fresh();
  home(s, 2);
  title(s);
  dormitory(s, 1, 2, 2);
  assert.deepEqual(s.currentChoices.map(c => c.text), ['好好吃饭', '担心身体']);
  finish(s, '好好吃饭');
  assert.deepEqual(achieved(s), [2, 9]);
  const basement = fresh();
  choose(basement, '开始攻略');
  choose(basement, 0);
  choose(basement, 2);
  choose(basement, 0);
  finish(basement);
  assert.deepEqual(achieved(basement), [11]);
});

test('normal F2 then F7 unlocks F10 across retries without injecting variables', () => {
  let f7Path;
  search: for (let first = 0; first < 5; first++) {
    for (let greeting = 0; greeting < 3; greeting++) for (let activity = 0; activity < 3; activity++) {
      const candidate = fresh();
      dormitory(candidate, first, greeting, activity);
      finish(candidate);
      if (candidate.variablesState.Ending_F7_Achieved) {
        f7Path = [first, greeting, activity];
        break search;
      }
    }
  }
  assert.ok(f7Path, 'F7 must remain reachable through normal dormitory choices');
  const s = fresh();
  home(s, 2);
  title(s);
  dormitory(s, ...f7Path);
  finish(s);
  assert.deepEqual(achieved(s), [2, 7]);
  title(s);
  dormitory(s, 1, 2, 2);
  assert.deepEqual(s.currentChoices.map(c => c.text), ['好好吃饭', '袒露心声', '担心身体']);
  finish(s, '袒露心声');
  assert.deepEqual(achieved(s), [2, 7, 10]);
  assert.equal(s.variablesState.Ending_F8_Achieved, false);
  assert.equal(s.variablesState.FinaleCount, 3);
});

test('normal dormitory choices expose multi-character selection and reachability (45 paths)', t => {
  const endings = {}, lowStates = new Set();
  for (let first = 0; first < 5; first++) for (let greeting = 0; greeting < 3; greeting++) for (let activity = 0; activity < 3; activity++) {
    const s = fresh();
    dormitory(s, first, greeting, activity);
    const [rate, y, c, l] = variables(s);
    if (rate < 3) lowStates.add([y, c, l].join(','));
    finish(s);
    const id = achieved(s)[0];
    endings[id] = (endings[id] || 0) + 1;
  }
  assert.ok(lowStates.has('1,1,1'), 'normal low-affection three-character path must be covered');
  assert.ok(![...lowStates].some(v => /^0,0,\d+$/.test(v)), 'low-affection LeiHu-only and all-zero states require injection');
  t.diagnostic(JSON.stringify({ normalDormitoryPaths: 45, endingDistribution: endings, lowAffectionSelectionStates: [...lowStates].sort() }));
});

test('A-03 keeps all three duplicate F5 choices; A-06 keeps all three converging F6 choices', () => {
  for (const id of [5, 6]) {
    const continuations = [];
    for (let option = 0; option < 3; option++) {
      const s = fresh();
      jump(s, `Finale.F${id}`);
      assert.equal(s.currentChoices.length, 3);
      if (id === 5) assert.deepEqual(s.currentChoices.map(c => c.text), ['服从', '服从', '服从']);
      else assert.equal(new Set(s.currentChoices.map(c => c.text)).size, 3);
      continuations.push(choose(s, option));
      assert.ok(atEnd(s));
      assert.deepEqual(achieved(s), [id]);
    }
    assert.equal(continuations[1], continuations[0]);
    assert.equal(continuations[2], continuations[0]);
  }
});

test('developer and formal menus keep numbering and classifications; F8 body says general ending', () => {
  const s = fresh();
  for (const name of flagNames) s.variablesState[name] = true;
  review(s);
  const reviewLabels = endingRows(s).map(c => c.text);
  unlock(s);
  choose(s, '查看所有结局');
  assert.deepEqual(endingRows(s).map(c => c.text), reviewLabels);
  reviewLabels.forEach((label, i) => assert.ok(label.startsWith(`${i + 1}.${classifications[i]}结局`)));
  const output = jump(s, 'Finale.F8');
  assert.ok(output.includes('⑧【一般结局】'));
});

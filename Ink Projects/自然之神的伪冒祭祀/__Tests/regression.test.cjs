'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { compileStory } = require('./compile.cjs');
const { StoryHarness } = require('./story-harness.cjs');

const TESTS_DIR = __dirname;
const COMPILE_SCRIPT = path.join(TESTS_DIR, 'compile.cjs');
const compiled = compileStory();

function harness() {
  assert.ok(compiled.ok, `Story failed to compile:\n${compiled.errors.join('\n')}`);
  return new StoryHarness(compiled);
}

function snapshot(h) {
  return {
    start: h.variable('Count__Start'),
    chapter: h.variable('Count__Chapter'),
    body: h.variable('Count__不明生物的尸体'),
    wood: h.variable('Count__枯树的碎片'),
    bodyInList: h.listContains('List__Items', '不明生物的尸体'),
    woodInList: h.listContains('List__Items', '枯树的碎片'),
    gameOver: h.variable('Count__GAME_OVER'),
    yingJi: h.visitCount('Shutdown.YingJi'),
    shuGanMengJi: h.variable('Achievement__ShuGanMengJi'),
    guTouTang: h.variable('Achievement__GuTouTang'),
    daLeXiaoDeLaiLeLaoDe: h.variable('Achievement__DaLeXiaoDeLaiLeLaoDe'),
  };
}

const NEW_GAME = '新的游戏';
const ABYSS = '深渊之中';
const EXPLORE = '最好该探寻一下周围的环境';
const ATTACK = '“看招！”（直接攻击）';
const CONTINUE = '继续';
const HORSE_SOUP = '肚子饿了，该做马肉汤了。';
const FLEE = '不想打了，还没消化完呢，该跑了。';
const CAT_STRESS = '猫科到了陌生环境发生应激是很正常的';
const RECALL = '是他们……先动手的……';
const DISGUISE = '这么一搞没衣服穿了，装作很羞耻的样子遮一下吧';
const ENTER_TENT = '进入：医疗帐篷';
const EAT_PERSON = '我吃一个人没人知道吧？（0w0）🆕';
const ANALYZE = '分析新生物的大脑结构和当地情报';
const BACK_TO_TITLE = '回到标题';
const RECONNECT_FIRST = '重新连接：第 1 次';

function runAbyssToDeath(h) {
  h.choose(NEW_GAME);
  h.choose(ABYSS);
  h.choose(EXPLORE);
  h.choose(ATTACK);
  h.choose(CONTINUE); // 树干猛击详情之后
  h.choose(CONTINUE); // 获得不明生物的尸体 / 枯树的碎片
  h.choose(CONTINUE); // 木已成舟，获得魔力器官
  h.choose(HORSE_SOUP);
  h.choose(CONTINUE); // 骨头汤
  h.choose(CONTINUE); // 打了小的来了老的
  h.choose(FLEE);
  h.choose(CAT_STRESS);
}

test('主入口完整编译：0 error / 0 warning，有 TODO 作者诊断', () => {
  assert.deepEqual(compiled.errors, []);
  assert.deepEqual(compiled.warnings, []);
  assert.ok(compiled.authorMessages.length > 0);
  assert.ok(compiled.jsonBytes > 0);
  assert.equal(compiled.inkjsVersion, '2.4.0');
});

test('初始主菜单恰有 9 个选项，未出现“重新连接”', () => {
  const h = harness();
  const texts = h.choiceTexts();
  assert.equal(texts.length, 9, `unexpected menu: ${JSON.stringify(texts)}`);
  assert.equal(texts.filter((text) => text === '————————').length, 2);
  for (const label of ['新的游戏', '身份选择', '成就一览', '结局一览', '死法一览', '制作人员', '更新日志']) {
    assert.ok(texts.includes(label), `menu is missing ${label}: ${JSON.stringify(texts)}`);
  }
  assert.equal(texts.some((text) => text.startsWith('重新连接')), false);
});

test('深渊真实路线：物品、死亡与访问记录、叙事回溯、最终抵达医疗帐篷', () => {
  const h = harness();
  runAbyssToDeath(h);

  assert.equal(h.variable('Count__GAME_OVER'), 1);
  assert.equal(h.visitCount('Shutdown.YingJi'), 1);
  assert.equal(h.variable('Count__不明生物的尸体'), 1);
  assert.equal(h.variable('Count__枯树的碎片'), 1);
  assert.ok(h.listContains('List__Items', '不明生物的尸体'));
  assert.ok(h.listContains('List__Items', '枯树的碎片'));

  // 已知缺陷的当前行为（不代表设计认可）：Maps/Abyss/START.ink 在“打了小的来了老的”
  // 段落里又写了一次 Achievement__GuTouTang ++，因此 GuTouTang 变成 2，
  // 而本应递增的 Achievement__DaLeXiaoDeLaiLeLaoDe 保持 0。
  assert.equal(h.variable('Achievement__ShuGanMengJi'), 1);
  assert.equal(h.variable('Achievement__GuTouTang'), 2);
  assert.equal(h.variable('Achievement__DaLeXiaoDeLaiLeLaoDe'), 0);

  const afterRecall = snapshot(h);
  const recallText = h.choose(RECALL);
  assert.ok(recallText.includes('你回过神，自己什么场面没见过？'), '叙事回溯文本缺失');
  assert.deepEqual(snapshot(h), afterRecall, '回溯回滚了物品数量 / 物品列表 / 成就 / 死亡与访问记录');

  h.choose(DISGUISE);
  const tentText = h.choose(ENTER_TENT);
  assert.ok(tentText.includes('【医疗帐篷内】'), '未进入医疗帐篷');
  assert.ok(h.choiceTexts().includes(ANALYZE), '医疗帐篷选项集不符');
  assert.equal(h.variable('TEMP__WoChiYiGeRen'), 0);
});

test('深渊死亡后回标题并重新连接：Count__Start 递增，现有记录按现状保留', () => {
  const h = harness();
  runAbyssToDeath(h);
  const before = snapshot(h);

  const titleText = h.choose(BACK_TO_TITLE);
  assert.ok(titleText.includes('自然之神的伪冒祭祀'), '回到标题后未渲染标题');
  const menu = h.choiceTexts();
  assert.ok(menu.includes(RECONNECT_FIRST), `没有重新连接选项: ${JSON.stringify(menu)}`);
  assert.equal(menu.includes(NEW_GAME), false, 'Count__Start > 0 时仍出现“新的游戏”');

  h.choose(RECONNECT_FIRST);
  const after = snapshot(h);
  assert.equal(after.start, before.start + 1);
  assert.deepEqual(
    after,
    { ...before, start: before.start + 1 },
    '重新连接改动了物品数量 / 物品列表 / 成就 / 死亡与访问记录',
  );
  assert.ok(h.choiceTexts().includes(ABYSS));
});

test('隔离状态注入（非完整剧情路线）：重新连接把 Count__Chapter 重置为 0', () => {
  const h = harness();
  h.setVariable('Count__Start', 1);
  h.setVariable('Count__Chapter', 3);
  h.goto('Menu__Main');
  assert.ok(h.choiceTexts().includes(RECONNECT_FIRST));

  h.choose(RECONNECT_FIRST);
  assert.equal(h.variable('Count__Chapter'), 0);
  assert.equal(h.variable('Count__Start'), 2);
});

test('医疗帐篷 TEMP__WoChiYiGeRen：行动后递增且选项消失，分析新生物重置为 0', () => {
  const h = harness();
  h.goto('Ruoment_City__Suburban.MedicalTent');
  assert.equal(h.variable('TEMP__WoChiYiGeRen'), 0);
  assert.ok(h.choiceTexts().includes(EAT_PERSON));

  h.choose(EAT_PERSON);
  assert.equal(h.variable('TEMP__WoChiYiGeRen'), 1);
  assert.equal(h.choiceTexts().includes(EAT_PERSON), false, 'TEMP__WoChiYiGeRen > 0 时选项应消失');

  h.choose(ANALYZE);
  assert.equal(h.variable('TEMP__WoChiYiGeRen'), 0);
  assert.ok(h.choiceTexts().includes('注射殖民协议，转化为执行体'));
});

test('测试辅助器：完整选项文本唯一匹配，未知变量与未计数的访问计数必须报错', () => {
  const h = harness();
  assert.throws(() => h.choose(CONTINUE), /No choice with the exact text/);
  assert.throws(() => h.choose('————————'), /is ambiguous/);
  assert.throws(() => h.variable('Not__A__Variable'), /Unknown story variable/);
  assert.throws(
    () => h.visitCount('Ruoment_City__Suburban.MedicalTent'),
    /Visit counting is not enabled/,
  );
});

test('compile.cjs：编译错误时非零退出，且不生成 JSON 产物', () => {
  const dir = fs.mkdtempSync(path.join(TESTS_DIR, '.compile-failure-'));
  const broken = path.join(dir, 'broken.ink');
  try {
    fs.writeFileSync(broken, '=== Broken\n-> Nowhere\n* [unclosed\n', 'utf8');
    const result = spawnSync(process.execPath, [COMPILE_SCRIPT, broken], { encoding: 'utf8' });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /compile: FAILED/);
    assert.match(result.stdout, /errors: [1-9]/);
    assert.doesNotMatch(result.stdout, /json bytes:/);

    const artifacts = fs.readdirSync(TESTS_DIR).filter((name) => name.endsWith('.json') && !name.startsWith('package'));
    assert.deepEqual(artifacts, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

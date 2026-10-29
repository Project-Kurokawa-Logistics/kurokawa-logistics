'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Story } = require('inkjs');
const { compileStory, EXPECTED_INCLUDE_COUNT, isOk } = require('./compile.cjs');

const build = compileStory();
if (!isOk(build)) {
  console.error('编译未通过，回归测试无法运行。请先运行 `npm run compile`。');
  for (const error of build.errors) console.error(`error: ${error}`);
  for (const warning of build.warnings) console.error(`warning: ${warning}`);
  process.exit(1);
}

const ROUTE_VARS = [
  'COUNT_ROUTE_WORK_GYM',
  'COUNT_ROUTE_WORK_OFF_WORK',
  'COUNT_ROUTE_WORK_BUSINESS_TRIP',
  'COUNT_ROUTE_WORK_NAPPING',
  'COUNT_ROUTE_WORK_SHUTDOWN',
  'COUNT_ROUTE_BREAK_INTERVIEW',
  'COUNT_ROUTE_BREAK_CINEMA',
  'COUNT_ROUTE_BREAK_HOME',
  'COUNT_ROUTE_BREAK_SHUTDOWN',
];

const INITIAL_VARIABLES = {
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
};

// 每条路线的首次／重复结算：路径、计数器、首次与重复时的 SAN 增量。
const ROUTE_CASES = [
  { path: 'Work__Gym', counter: 'COUNT_ROUTE_WORK_GYM', firstGain: 10, repeatGain: 5 },
  { path: 'Work__Business_Trip.Flow', counter: 'COUNT_ROUTE_WORK_BUSINESS_TRIP', firstGain: 10, repeatGain: 5 },
  { path: 'Work__Napping.Flow', counter: 'COUNT_ROUTE_WORK_NAPPING', firstGain: 10, repeatGain: 5 },
  { path: 'Work__Off_Work', counter: 'COUNT_ROUTE_WORK_OFF_WORK', firstGain: 10, repeatGain: 5 },
  { path: 'Work__Shutdown', counter: 'COUNT_ROUTE_WORK_SHUTDOWN', firstGain: 0, repeatGain: 0 },
  { path: 'Break__Interview', counter: 'COUNT_ROUTE_BREAK_INTERVIEW', firstGain: 10, repeatGain: 5 },
  { path: 'Break__Cinema', counter: 'COUNT_ROUTE_BREAK_CINEMA', firstGain: 10, repeatGain: 5 },
  { path: 'Break__Home', counter: 'COUNT_ROUTE_BREAK_HOME', firstGain: 10, repeatGain: 5 },
  { path: 'Break__Shutdown', counter: 'COUNT_ROUTE_BREAK_SHUTDOWN', firstGain: 0, repeatGain: 0 },
];

const GALLERY_ENTRIES = [
  ['出差', '你在外地被入职了。'],
  ['健身房', '你变成了一个执行体。'],
  ['下班路上', '你被 AZ 绑架了。'],
  ['小憩', '上班睡觉被老板发现。'],
  ['办公室', '在所有员工的注视下被入职了。'],
  ['面试', '你在黑川物流被 AZ 入职了。'],
  ['电影院', '你在电影院被 AZ 入职了。'],
  ['收快递', '你在家被入职了。'],
  ['在家', 'AZ 来你家开饭了。'],
];

function allRoutes(value) {
  return Object.fromEntries(ROUTE_VARS.map((name) => [name, value]));
}

function newStory(overrides = {}) {
  const story = new Story(build.json);
  for (const [name, value] of Object.entries(overrides)) {
    story.variablesState[name] = value;
  }
  return story;
}

function drain(story) {
  const lines = [];
  while (story.canContinue) lines.push(story.Continue());
  return lines.join('\n');
}

function choiceTexts(story) {
  return story.currentChoices.map((choice) => choice.text.trim());
}

function choose(story, needle) {
  const choice = story.currentChoices.find((item) => item.text.includes(needle));
  assert.ok(
    choice,
    `找不到包含「${needle}」的选项，当前选项：${JSON.stringify(choiceTexts(story))}`,
  );
  story.ChooseChoiceIndex(choice.index);
  return drain(story);
}

function variables(story) {
  return JSON.parse(JSON.stringify(story.variablesState));
}

function atGameOverMenu(story) {
  const texts = choiceTexts(story);
  return texts.length === 2 && texts.includes('断开连接') && texts.includes('制作人员');
}

// 在所属节点进入一条路线，并自动选择第一个选项，直到 Menu__Game_Over。
// 这是健身房流程（Reception → Locker → AZ → Game_Over）的脚本化路径；
// 其它路线不需要选择任何选项。
function settleRoute(story, path) {
  story.ChoosePathString(path);
  let text = drain(story);

  for (let step = 0; step < 40 && !atGameOverMenu(story); step += 1) {
    assert.ok(
      story.currentChoices.length > 0,
      `${path} 在到达 Menu__Game_Over 之前卡住：${text.slice(-160)}`,
    );
    story.ChooseChoiceIndex(story.currentChoices[0].index);
    text += `\n${drain(story)}`;
  }

  assert.ok(atGameOverMenu(story), `${path} 没有到达 Menu__Game_Over`);
  return text;
}

test('编译：47 个 INCLUDE，0 错误，0 警告', () => {
  assert.equal(build.includeTargets.length, EXPECTED_INCLUDE_COUNT);
  assert.deepEqual(build.missingFiles, []);
  assert.equal(build.resolvedFiles.length, EXPECTED_INCLUDE_COUNT, '47 个相对 INCLUDE 都应解析到文件');
  assert.deepEqual(build.errors, []);
  assert.deepEqual(build.warnings, []);
});

test('初始全局值与首次自然启动：SAN 哨兵 -1 → 邀请函后 0，首日导航仅面试/上班', () => {
  const story = newStory();
  assert.deepEqual(variables(story), INITIAL_VARIABLES);

  const titleText = drain(story);
  assert.ok(titleText.includes('更新日期：20261029'), '自然启动应先到标题页');
  const menu = choiceTexts(story);
  assert.ok(menu.includes('初始化'));
  assert.ok(!menu.some((item) => item.includes('重新连接')), 'COUNT_GAME_OVER 为 0 时不应显示重新连接');

  choose(story, '初始化');
  choose(story, '继续');
  const letterText = choose(story, '打开 面试邀请函');
  assert.ok(letterText.includes('黑川物流市场部面试邀请函'), '应实际打开邀请函');
  assert.equal(story.variablesState['SAN_SCORE'], 0, '首次邀请函应把 SAN 从 -1 提升到 0');

  choose(story, '关闭邮件');
  assert.deepEqual(choiceTexts(story), ['请假｜去黑川物流面试', '上班｜去公司上班']);
  assert.deepEqual(variables(story), { ...INITIAL_VARIABLES, SAN_SCORE: 0 });
});

test('九条路线首次与重复结算：路线计数、COUNT_GAME_OVER、SAN 增量', () => {
  for (const routeCase of ROUTE_CASES) {
    const { path, counter, firstGain, repeatGain } = routeCase;
    const story = newStory({ SAN_SCORE: 20 });

    const firstText = settleRoute(story, path);
    assert.equal(story.variablesState[counter], 1, `${path} 首次结算应使 ${counter} = 1`);
    assert.equal(story.variablesState['COUNT_GAME_OVER'], 1, `${path} 每次结算应使 COUNT_GAME_OVER + 1`);
    assert.equal(story.variablesState['SAN_SCORE'], 20 + firstGain, `${path} 首次 SAN 增量`);
    for (const other of ROUTE_VARS) {
      if (other !== counter) assert.equal(story.variablesState[other], 0, `${path} 不应增加 ${other}`);
    }
    if (counter === 'COUNT_ROUTE_WORK_GYM') {
      assert.ok(firstText.includes('至少 1 次'), '首次 Gym 应显示至少 1 次');
    }

    const beforeRepeat = variables(story);
    settleRoute(story, path);
    assert.equal(story.variablesState[counter], 2, `${path} 重复结算应使 ${counter} = 2`);
    assert.equal(story.variablesState['COUNT_GAME_OVER'], 2, `${path} 重复结算仍应只 +1`);
    assert.equal(story.variablesState['SAN_SCORE'], beforeRepeat['SAN_SCORE'] + repeatGain, `${path} 重复 SAN 增量`);
  }
});

test('Gym 跨路线顺序：首次 → 回顾结局 → 重复，至少 1/2 次且计数不混淆', () => {
  const story = newStory({ SAN_SCORE: 20 });

  const firstText = settleRoute(story, 'Work__Gym');
  assert.ok(firstText.includes('至少 1 次'));
  assert.equal(story.state.VisitCountAtPathString('Work__Gym.Game_Over'), 1);
  assert.equal(story.variablesState['COUNT_ROUTE_WORK_GYM'], 1);
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 1);
  assert.equal(story.variablesState['SAN_SCORE'], 30);

  settleRoute(story, 'Work__Off_Work');
  assert.equal(story.variablesState['COUNT_ROUTE_WORK_OFF_WORK'], 1);
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 2);
  assert.equal(story.variablesState['SAN_SCORE'], 40);

  story.ChoosePathString('Ending__Route_Gallery.Index');
  drain(story);
  const beforeReview = variables(story);
  const reviewText = choose(story, '健身房');
  assert.ok(reviewText.includes('你变成了一个执行体。'));
  assert.deepEqual(variables(story), beforeReview, '结局回顾不应改变任何全局值');
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 2);
  assert.equal(
    story.state.VisitCountAtPathString('Work__Gym.Game_Over'),
    1,
    '回顾调用独立 Ending__Work__Gym，不应访问 Work__Gym.Game_Over',
  );
  choose(story, '返回上一级');

  const secondText = settleRoute(story, 'Work__Gym');
  assert.ok(secondText.includes('至少 2 次'));
  assert.equal(story.variablesState['COUNT_ROUTE_WORK_GYM'], 2);
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 3);
  assert.equal(story.variablesState['SAN_SCORE'], 45);
  assert.equal(story.state.VisitCountAtPathString('Work__Gym.Game_Over'), 2);
});

test('Business_Trip / Napping：Choice 预览与取消不增加路线或结局计数', () => {
  const cases = [
    { path: 'Work__Business_Trip.Choice', cancel: '不去', counter: 'COUNT_ROUTE_WORK_BUSINESS_TRIP' },
    { path: 'Work__Napping.Choice', cancel: '算了', counter: 'COUNT_ROUTE_WORK_NAPPING' },
  ];

  for (const item of cases) {
    const story = newStory({ SAN_SCORE: 20 });
    story.ChoosePathString(item.path);
    drain(story);

    assert.equal(story.currentChoices.length, 2, `${item.path} 应显示两个选项`);
    const before = variables(story);
    assert.equal(before[item.counter], 0);

    choose(story, item.cancel);
    assert.deepEqual(variables(story), before, `${item.path} 取消后不应改变任何计数`);
    assert.equal(story.variablesState['COUNT_GAME_OVER'], 0);
    assert.equal(story.variablesState[item.counter], 0);
  }
});

test('Ending__Route_Gallery：预览与九条结局回顾不改变 SAN / COUNT_GAME_OVER / 路线计数', () => {
  const story = newStory({
    SAN_SCORE: 90,
    COUNT_GAME_OVER: 9,
    ...allRoutes(1),
  });

  drain(story);
  choose(story, '结局回溯');
  const galleryChoices = choiceTexts(story);
  assert.equal(galleryChoices.length, 12);
  assert.equal(galleryChoices.filter((item) => item === '<hr>').length, 2);
  assert.ok(galleryChoices.includes('返回上一级'));
  for (const [label] of GALLERY_ENTRIES) {
    assert.ok(galleryChoices.includes(label), `结局回溯应列出「${label}」`);
  }

  const before = variables(story);
  for (const [label, marker] of GALLERY_ENTRIES) {
    story.ChoosePathString('Ending__Route_Gallery.Index');
    drain(story);
    assert.deepEqual(variables(story), before, `进入 ${label} 预览前不应改变全局值`);

    const text = choose(story, label);
    assert.ok(text.includes(marker), `${label} 回顾文本应包含「${marker}」`);
    assert.deepEqual(variables(story), before, `${label} 回顾不应改变 SAN / COUNT_GAME_OVER / 路线计数`);
    assert.deepEqual(choiceTexts(story), ['返回上一级', '返回标题']);
    assert.equal(
      story.state.VisitCountAtPathString('Work__Gym.Game_Over'),
      0,
      '九条结局回顾都不应计入 Gym 的历史访问次数',
    );

    choose(story, '返回上一级');
  }

  story.ChoosePathString('Ending__Route_Gallery.Index');
  drain(story);
  choose(story, '健身房');
  const titleText = choose(story, '返回标题');
  assert.ok(titleText.includes('更新日期：20261029'));
  assert.deepEqual(variables(story), before);
});

test('强制 WORK / 强制 BREAK：复用 Shutdown 结算，SAN 不变，随后进入 DRONE', () => {
  const work = newStory({ SAN_SCORE: 60 });
  assert.equal(work.EvaluateFunction('Get__Aboard_Status'), 'Prototype');
  assert.equal(work.EvaluateFunction('Get__Forced_Intrusion'), 'WORK');
  work.ChoosePathString('Flow__Startup.Check');
  const workText = drain(work);
  assert.ok(workText.includes('有吉士'));
  assert.ok(workText.includes('被 AZ 在办公室入职了'));
  assert.equal(work.variablesState['COUNT_ROUTE_WORK_SHUTDOWN'], 1);
  assert.equal(work.variablesState['COUNT_GAME_OVER'], 1);
  assert.equal(work.variablesState['SAN_SCORE'], 60, '强制 WORK 结算不增加 SAN');
  assert.ok(atGameOverMenu(work));

  const workEnv = choose(work, '断开连接');
  assert.ok(workEnv.includes('⟦'), '强制 WORK 后环境检查应进入 DRONE 页');
  assert.ok(!workEnv.includes('更新日期：20261029'));
  assert.equal(work.variablesState['COUNT_ROUTE_WORK_SHUTDOWN'], 1);
  assert.equal(work.variablesState['COUNT_GAME_OVER'], 1);

  const breakStory = newStory({
    SAN_SCORE: 60,
    COUNT_ROUTE_WORK_BUSINESS_TRIP: 1,
    COUNT_ROUTE_WORK_OFF_WORK: 1,
  });
  assert.equal(breakStory.EvaluateFunction('Get__Aboard_Status'), 'Prototype');
  assert.equal(breakStory.EvaluateFunction('Get__Forced_Intrusion'), 'BREAK');
  breakStory.ChoosePathString('Flow__Startup.Check');
  const breakText = drain(breakStory);
  assert.ok(breakText.includes('AZ 来敲门。'));
  assert.ok(breakText.includes('AZ 来你家开饭了。'));
  assert.equal(breakStory.variablesState['COUNT_ROUTE_BREAK_SHUTDOWN'], 1);
  assert.equal(breakStory.variablesState['COUNT_GAME_OVER'], 1);
  assert.equal(breakStory.variablesState['SAN_SCORE'], 60, '强制 BREAK 结算不增加 SAN');
  assert.ok(atGameOverMenu(breakStory));

  const breakEnv = choose(breakStory, '断开连接');
  assert.ok(breakEnv.includes('⟦'), '强制 BREAK 后环境检查应进入 DRONE 页');
  assert.equal(breakStory.variablesState['COUNT_ROUTE_BREAK_SHUTDOWN'], 1);
  assert.equal(breakStory.variablesState['COUNT_GAME_OVER'], 1);
});

test('普通环境检查进入标题；Menu__Game_Over → 标题往返不增加路线计数', () => {
  const plain = newStory({ SAN_SCORE: 10 });
  plain.ChoosePathString('Check__Environment');
  const titleText = drain(plain);
  assert.ok(titleText.includes('更新日期：20261029'));
  assert.ok(choiceTexts(plain).includes('初始化'));

  const story = newStory({ SAN_SCORE: 20 });
  settleRoute(story, 'Work__Off_Work');
  const before = variables(story);
  const menuText = choose(story, '断开连接');
  assert.ok(menuText.includes('更新日期：20261029'));
  assert.deepEqual(variables(story), before);
  assert.ok(choiceTexts(story).includes('重新连接：第 1 次'));
});

test('主菜单分隔线第 5/6 次边界、UNLOCKED 用途与隐藏入口', () => {
  const story = newStory();
  drain(story);

  for (let click = 1; click <= 5; click += 1) {
    choose(story, '——');
    assert.equal(story.variablesState['COUNT_MENU_SEPARATOR'], click);
    assert.equal(ROUTE_VARS.reduce((sum, name) => sum + story.variablesState[name], 0), 0);
    assert.equal(story.variablesState['COUNT_GAME_OVER'], 0);
    assert.equal(story.variablesState['SAN_SCORE'], -1);
    assert.equal(story.variablesState['UNLOCKED_NO8_DATABASE'], false);
    assert.ok(choiceTexts(story).includes('初始化'), `第 ${click} 次点击后应仍是普通主菜单`);
  }

  const unlockText = choose(story, '——');
  assert.equal(story.variablesState['COUNT_MENU_SEPARATOR'], 6);
  for (const name of ROUTE_VARS) {
    assert.equal(story.variablesState[name], 1, `第 6 次点击应由彩蛋将 ${name} 置 1`);
  }
  assert.equal(story.variablesState['UNLOCKED_NO8_DATABASE'], true);
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 0, '彩蛋不是自然通关，COUNT_GAME_OVER 不应增加');
  assert.equal(story.variablesState['SAN_SCORE'], -1);
  assert.ok(unlockText.includes('No.8，欢迎访问黑川物流数据库'));
  const unlockedGallery = choiceTexts(story);
  assert.ok(unlockedGallery.includes('重置游戏'));
  assert.ok(!unlockedGallery.includes('返回上一级'));

  story.ChoosePathString('Menu__Main');
  drain(story);
  const unlockedMenu = choiceTexts(story);
  assert.ok(!unlockedMenu.includes('初始化'), 'UNLOCKED 后应隐藏初始化入口');
  assert.ok(!unlockedMenu.some((item) => item.includes('重新连接')), 'UNLOCKED 后应隐藏重新连接入口');
  assert.ok(unlockedMenu.includes('结局回溯'));
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 0);

  const reconnect = newStory({ COUNT_GAME_OVER: 9 });
  drain(reconnect);
  assert.ok(choiceTexts(reconnect).includes('重新连接：第 9 次'));
  assert.ok(!choiceTexts(reconnect).includes('初始化'));
  reconnect.variablesState['UNLOCKED_NO8_DATABASE'] = true;
  reconnect.ChoosePathString('Menu__Main');
  drain(reconnect);
  assert.ok(!choiceTexts(reconnect).some((item) => item.includes('重新连接')));
});

test('全路线注入：最终和解 → 现实 No.8，前8次，无额外普通醒来', () => {
  const story = newStory({
    SAN_SCORE: 90,
    COUNT_GAME_OVER: 9,
    ...allRoutes(1),
  });
  assert.equal(story.EvaluateFunction('Get__Aboard_Status'), 'No.8');

  story.ChoosePathString('Flow__Startup.Check');
  const text = drain(story);
  assert.ok(text.includes('前8次'), 'COUNT_GAME_OVER=9 时最终和解应显示前8次');
  assert.ok(!text.includes('前9次'));
  assert.ok(text.includes('感谢游玩'));
  assert.ok(text.indexOf('耳鸣') >= 0 && text.indexOf('耳鸣') < text.indexOf('感谢游玩'), '应先最终和解后现实 No.8');
  assert.ok(!text.includes('夺命连环闹钟铃声'), '不应再插入普通醒来');
  assert.ok(!text.includes('人……为什么要上班……'), '不应再进入首日导航');
  assert.ok(!text.includes('重新连接'));
  assert.deepEqual(choiceTexts(story), ['制作人员']);
  assert.equal(story.variablesState['HAS_ENTERED_FINAL_RECONCILIATION'], true);
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 9);
  assert.equal(story.variablesState['SAN_SCORE'], 90);

  story.ChoosePathString('Flow__Startup.Check');
  const again = drain(story);
  assert.ok(!again.includes('耳鸣'), '第二次启动应直接进入现实 No.8');
  assert.ok(again.includes('感谢游玩'));
  assert.deepEqual(choiceTexts(story), ['制作人员']);
});

test('ResetState：恢复全局初始值并重置 Gym 访问计数', () => {
  const story = newStory({ SAN_SCORE: 20 });
  settleRoute(story, 'Work__Gym');
  settleRoute(story, 'Work__Gym');
  assert.equal(story.state.VisitCountAtPathString('Work__Gym.Game_Over'), 2);
  story.variablesState['COUNT_MENU_SEPARATOR'] = 3;
  story.variablesState['UNLOCKED_NO8_DATABASE'] = true;

  story.ResetState();
  assert.deepEqual(variables(story), INITIAL_VARIABLES);
  assert.equal(story.state.VisitCountAtPathString('Work__Gym.Game_Over'), 0, 'ResetState 应重置 Gym 访问计数');

  story.variablesState['SAN_SCORE'] = 20;
  const text = settleRoute(story, 'Work__Gym');
  assert.ok(text.includes('至少 1 次'), '重置后首次 Gym 应重新显示至少 1 次');
  assert.equal(story.variablesState['COUNT_ROUTE_WORK_GYM'], 1);
  assert.equal(story.variablesState['COUNT_GAME_OVER'], 1);
  assert.equal(story.variablesState['SAN_SCORE'], 30);
});

'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Story } = require('inkjs');
const { compileStory, isOk } = require('./compile.cjs');

const build = compileStory();
if (!isOk(build)) {
  console.error('编译未通过，回归测试中止。');
  for (const error of build.errors) console.error(`error: ${error}`);
  for (const warning of build.warnings) console.error(`warning: ${warning}`);
  process.exit(1);
}

const DOGS = [
  { id: 1, key: 'DASAO', name: '大骚狗', image: 'IMAGE: images/dog_01_dasaogou.png', quote: '骚逼啊', speaker: 'AZ' },
  { id: 2, key: 'XIAONAI', name: '小奶狗', image: 'IMAGE: images/dog_02_xiaonaigou.png', quote: '连诱捕素都省了', speaker: 'No.1' },
  { id: 3, key: 'DALANG', name: '大狼狗', image: 'IMAGE: images/dog_03_dalanggou.png', quote: '体格合格，咬合力达标', speaker: 'No.4' },
  { id: 4, key: 'LAOMU', name: '熟男老母狗', image: 'IMAGE: images/dog_04_laomugou.png', quote: '到底是上过几年班的老油条', speaker: 'No.6' },
  { id: 5, key: 'SAMOYE', name: '邪恶萨摩耶', image: 'IMAGE: images/dog_05_samoye.png', quote: '笑得这么干净', speaker: 'No.8' },
  { id: 6, key: 'NIUMA', name: '社畜牛马狗', image: 'IMAGE: images/dog_06_niumagou.png', quote: '别浪费限制锚了', speaker: 'No.7' },
  { id: 7, key: 'BAIQUAN', name: '傲娇败犬', image: 'IMAGE: images/dog_07_baiquan.png', quote: '嘴挺硬，黑胶绷带再缠两圈就老实了', speaker: 'No.3' },
  { id: 8, key: 'HASHIQI', name: '发疯哈士奇', image: 'IMAGE: images/dog_08_hashiqi.png', quote: '离我的培养皿远点', speaker: 'No.5' },
  { id: 9, key: 'BIANMU', name: '高智商边牧', image: 'IMAGE: images/dog_09_bianmu.png', quote: '建议严查他的芯片', speaker: 'No.2' },
  { id: 10, key: 'JILV', name: '狂热纪律狗', image: 'IMAGE: images/dog_10_jilvgou.png', quote: '孩子们这么热情是好事', speaker: 'AZ' },
  { id: 11, key: 'JIXIE', name: '赛博机械狗', image: 'IMAGE: images/dog_11_jixiegou.png', quote: '为什么我司报失的机械测试犬', speaker: 'ID.ADMIN-2' },
  { id: 12, key: 'LAOSHI', name: '看门老实狗', image: 'IMAGE: images/dog_12_laoshigou.png', quote: '让他安安心心在地面收发室待着吧', speaker: 'AZ' },
];

function drain(story) {
  const lines = [];
  const tags = [];
  while (story.canContinue) {
    lines.push(story.Continue());
    if (story.currentTags && story.currentTags.length > 0) {
      tags.push(...story.currentTags);
    }
  }
  return { text: lines.join('\n'), tags };
}

function chooseBySubstring(story, needle) {
  const found = story.currentChoices.find((c) => c.text.includes(needle));
  assert.ok(
    found,
    `未找到包含「${needle}」的选项，当前可见：${JSON.stringify(story.currentChoices.map((c) => c.text))}`,
  );
  story.ChooseChoiceIndex(found.index);
  return drain(story);
}

// 在当前题目用快照模拟点击 4 个选项，挑选给目标犬种加分最多的那个选项（完全模拟该犬种人格作答）
function pickBestOptionForDog(story, scoreVarName) {
  const savedState = story.state.ToJson();
  const beforeScore = story.variablesState[scoreVarName];
  let bestIdx = 0;
  let bestGain = -1;

  for (let i = 0; i < story.currentChoices.length; i += 1) {
    story.state.LoadJson(savedState);
    story.ChooseChoiceIndex(i);
    drain(story);
    const afterScore = story.variablesState[scoreVarName];
    const gain = afterScore - beforeScore;
    if (gain > bestGain) {
      bestGain = gain;
      bestIdx = i;
    }
  }

  assert.ok(bestGain >= 1, `${scoreVarName} 在当前题目中没有任何加分项`);
  story.state.LoadJson(savedState);
  story.ChooseChoiceIndex(bestIdx);
  return { gain: bestGain, stepResult: drain(story) };
}

test('1. 标题页、封面 IMAGE 标签与主菜单入口正常展示', () => {
  const story = new Story(build.json);
  const { text, tags } = drain(story);
  assert.ok(text.includes('测测你是什么狗'));
  assert.ok(tags.includes('IMAGE: images/cover_title.png'));
  const choices = story.currentChoices.map((c) => c.text);
  assert.equal(choices.length, 5);
  assert.ok(choices.some((c) => c.includes('9 题速测')));
  assert.ok(choices.some((c) => c.includes('27 题全开')));
  assert.ok(choices.some((c) => c.includes('犬种档案图鉴')));
});

test('2. 完整题库模式（27 题）：全部 12 种狗对称可达、满分恒为 54 分，且大骚狗原文 100% 还原', () => {
  for (const dog of DOGS) {
    const story = new Story(build.json);
    drain(story);
    let stepOut = chooseBySubstring(story, '27 题全开');
    const seenHeaders = new Set();

    for (let q = 1; q <= 27; q += 1) {
      assert.equal(story.currentChoices.length, 4, `第 ${q} 题应有 4 个选项`);
      const headerMatch = stepOut.text.match(/【第\s*(\d+)\s*\/\s*27\s*题\s*·\s*(.+?)】/);
      assert.ok(headerMatch, `第 ${q} 题缺少题号标题：${stepOut.text}`);
      assert.equal(Number(headerMatch[1]), q);
      seenHeaders.add(headerMatch[2]);

      const { stepResult } = pickBestOptionForDog(story, `SCORE_${dog.key}`);
      stepOut = stepResult;
    }

    assert.equal(seenHeaders.size, 27, '27 道题场景小标题应全部不重复');
    assert.equal(
      story.variablesState[`SCORE_${dog.key}`],
      54,
      `${dog.name} 在 27 题模式下理论最高分应恒为 54 分`,
    );
    assert.ok(
      stepOut.text.includes(`>${dog.name}<`),
      `期望命中 ${dog.name}，实际输出：${stepOut.text}`,
    );
    assert.ok(
      stepOut.tags.includes(dog.image),
      `${dog.name} 应携带图片标签 ${dog.image}，实际：${JSON.stringify(stepOut.tags)}`,
    );
    assert.ok(stepOut.text.includes(dog.quote));
    assert.ok(stepOut.text.includes(`—— ${dog.speaker}`));
    assert.equal(story.variablesState[`UNLOCKED_${dog.key}`], true);

    if (dog.key === 'DASAO') {
      assert.ok(
        stepOut.text.includes(
          '没有编号的骚狗是消耗品，研究完了会冻起来或者废物回收；有编号的玩坏的会被挂起来，每天擦擦身体放下来遛狗。如果脑子被洗坏变成贱狗了，那就只能退休了。',
        ),
        '大骚狗档案评语必须与原图逐字一致',
      );
    }
  }
});

test('3. 随机速测模式（9 题）：在不同随机种子下，全部 12 种狗均稳定可达且满分恒为 18 分', () => {
  for (const seed of [7, 42, 2026]) {
    for (const dog of DOGS) {
      const story = new Story(build.json);
      story.state.storySeed = seed;
      drain(story);
      let stepOut = chooseBySubstring(story, '9 题速测');
      const seenSubtitles = [];

      for (let q = 1; q <= 9; q += 1) {
        assert.equal(story.currentChoices.length, 4);
        const headerMatch = stepOut.text.match(/【第\s*(\d+)\s*\/\s*9\s*题\s*·\s*(.+?)】/);
        assert.ok(headerMatch);
        assert.equal(Number(headerMatch[1]), q);
        seenSubtitles.push(headerMatch[2]);

        const { stepResult } = pickBestOptionForDog(story, `SCORE_${dog.key}`);
        stepOut = stepResult;
      }

      assert.equal(new Set(seenSubtitles).size, 9, '单局随机 9 题不得出现重复题目');
      assert.equal(
        story.variablesState[`SCORE_${dog.key}`],
        18,
        `seed=${seed} 下 ${dog.name} 在 9 题速测模式最高分应恒为 18 分`,
      );
      assert.ok(stepOut.text.includes(`>${dog.name}<`));
      assert.ok(stepOut.tags.includes(dog.image));
    }
  }
});

test('4. 多周目连续重测保留图鉴进度，且分隔线 5 连击解锁后台全图鉴预览', () => {
  const story = new Story(build.json);
  drain(story);

  // 先测出大骚狗
  chooseBySubstring(story, '9 题速测');
  for (let q = 1; q <= 9; q += 1) {
    pickBestOptionForDog(story, 'SCORE_DASAO');
  }
  assert.equal(story.variablesState.COUNT_PLAYED, 1);
  assert.equal(story.variablesState.UNLOCKED_DASAO, true);

  // 点击再测一次，测出邪恶萨摩耶
  chooseBySubstring(story, '再测一次');
  for (let q = 1; q <= 9; q += 1) {
    pickBestOptionForDog(story, 'SCORE_SAMOYE');
  }
  assert.equal(story.variablesState.COUNT_PLAYED, 2);
  assert.equal(story.variablesState.UNLOCKED_DASAO, true);
  assert.equal(story.variablesState.UNLOCKED_SAMOYE, true);

  // 返回标题页，连续点击 5 次分隔线开启全图鉴预览
  chooseBySubstring(story, '返回标题页');
  for (let i = 1; i <= 5; i += 1) {
    chooseBySubstring(story, '————————');
  }
  assert.equal(story.variablesState.UNLOCKED_ALL_PREVIEW, true);
  // 此时图鉴应展示全部 12 种狗 + 返回标题页 = 13 个选项
  assert.equal(story.currentChoices.length, 13);

  // 从图鉴预览未测出的“看门老实狗”，确认不虚增 COUNT_PLAYED
  const previewOut = chooseBySubstring(story, '12 · 看门老实狗');
  assert.ok(previewOut.text.includes('>看门老实狗<'));
  assert.equal(story.variablesState.COUNT_PLAYED, 2);
});

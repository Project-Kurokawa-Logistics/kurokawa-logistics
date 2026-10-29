# 故事流程与分支总览

> 状态：静态阅读记录。这里只描述当前源码中可见的跳转与文本，不保证所有路线均可编译或完整通关。  
> 主要入口：[主 Ink 文件](../自然之神的伪冒祭祀.ink)

## 1. 故事核心（根据当前文本归纳）

主角 No.AZ 原本是黑川物流的最高管理者，属于黑胶殖民生命体。被带到异世界后，他失去大量记忆，也失去了原本用于分担精神负荷的人员与数据备份。故事围绕他如何适应魔法世界、建立新身份与据点，以及如何在黑胶技术、狩猎本能、对生命的态度和新建立的人际关系之间做选择展开。

以上是对现有叙事的概括，不代表所有世界观谜团都已经在源码中解释完毕。

## 2. 入口与开局

主文件最终跳转到 Title；标题/菜单脚本再进入 Menu__START。开局选项位于 [Menus/START.ink](../Menus/START.ink)。

- **森林开局**（[Maps/Forest/START.ink](../Maps/Forest/START.ink)）：从森林中的失忆与饥饿状态开始，遇见涅特斯并模仿其名字发音后进入 `PAUSE`，当前没有后续完整流程。
- **深渊开局**（[Maps/Abyss/START.ink](../Maps/Abyss/START.ink)）：探索周围环境后接触小恶魔。尝试交流的分支会导向黑胶失控相关的坏结局；攻击方向经过 [Maps/Abyss/Rift.ink](../Maps/Abyss/Rift.ink) 进入洛蒙特城郊外的医疗帐篷流程。逃离等其他方向仍带有未开放标记。
- **沙漠开局**（[Maps/Desert/START.ink](../Maps/Desert/START.ink)）：两个初始行动都有 TODO，但没有 `# unclickable`；随后共同进入 `PAUSE`，不能视为已完成路线。
- **城市郊外开局**：在开局菜单中带有禁用标记，旁边有直接从政的 TODO，没有后续 divert。

## 3. 深渊路线与建立新身份

相关文件：[Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink)

1. 主角在医疗帐篷中醒来，并可以选择分析当地情报、处理新生物等行动。
2. Select__Protocol 决定对新对象采用何种黑胶协议；当前仅“注射殖民协议”未标未开放，其他选项带有禁用标记。
3. Abyss_Memory_Recall 允许回顾深渊经历，并推进后续身份选择。
4. Select__Career 中仅“冒险者”未标未开放；“神官”和“司令”选项带有禁用标记。禁用标记的实际宿主表现仍待确认。
5. Select__Path 可继续建立据点/冒险团队，也有退休相关分支。
6. Ending__CP1 是章节推进节点（虽然名称含有 Ending，但后续仍会继续），随后通过 Go_Away 离开医疗帐篷并选择目的地。
7. 当前可见的森林目的地会进入 Forest__Boulevard.Select__Traffic。

## 4. 森林与远森镇路线

相关文件：[Maps/Forest/Boulevard.ink](../Maps/Forest/Boulevard.ink)、[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)

大致推进关系：

- 森林路线
  - 跟随商队
  - 研究当地人、处理灵魂与新执行体
  - 山匪/据点相关剧情
  - 向当地人解释主角与自然神的关系
  - 进入 Forest__FarMoriTown.GoTown（远森镇）

远森镇的主要节点：

- **GoTown**：跟随商队到达远森镇，并进入 GoWhere。
- **GoWhere**：当前有寻找自然神神庙、寻找住处等未标未开放的行动；部分选项带有禁用标记。
- **Find_Memories**：主角询问失忆与身份问题。当前当 Careers__AZ == "神官" 时会跳到 BUG；非神官则走另一段对话。
- **Find_Base**：建立据点。
- **Choose_Another**：控制下午还能进行的行动；之后进入 Ending_Today。
- **Ending_Today**：选择开启新人生会进入 Ending__CP2，再继续到 Start__CP_YuanSenDiChengJiXing；选择随缘会进入 Finales.YiZheRenXin。
- **Start__CP_YuanSenDiChengJiXing**：处理旧胶奴的灵魂/肉体不匹配问题，之后涉及阿沙西及商队长相关剧情。
- **Start__CP_ShiMin**：进入远森镇的经营与市民篇。

## 5. 地城、经营与后续章节

相关文件：[Maps/Forest/Dungeon.ink](../Maps/Forest/Dungeon.ink)、[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)

- 远森地城路线围绕探索地城、发现邪教仪式、阻止深渊能量扩散，以及巨龙之灵展开。
- 林德在阻止仪式的过程中受伤；相关选项涉及救治、强制转化或送行。后续文本还会影响主角与队友的关系。
- DealCommercial 有三种经营选择：继续经营、暂缓经营并找员工、停止经营并前往地城。**第一项当前会跳到 Finales.PoChan**，是否为预期设计需确认。
- 后续章节包含 Start__CP_ChangXiu、Power_Choice 和 WuMaoZhiRen。其中涉及提升阿沙西、主角自身或林德的能力，以及追捕能够伪装身份的邪教徒余党。
- 追捕分支中，Choose_7 的“追！”会进入 Finales.PoChan；“深不可追”会继续进入 BieJi 等节点。
- 后续还有 Choose_8 至 Choose_11、林德/阿沙西相关转化剧情，以及 Ending__CP_ChangXiu 的章节推进。部分节点明确标有 TODO，角色状态与结局路径需要进一步核对。

## 6. 返回洛蒙特城与首都当前进度

相关文件：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)、[Maps/Forest/Boulevard.ink](../Maps/Forest/Boulevard.ink)、[Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink)、[Maps/Ruoment_City/Capital.ink](../Maps/Ruoment_City/Capital.ink)

- Ending__CP_ChangXiu 后进入 Start__CP_XinHuoBanYiJiXinDeGongJuMen，再依次经过 Forest__Boulevard.Back_To_FactoryOne、Ruoment_City__Suburban.ZhouBianDeNongZhuang，抵达 Ruoment_City__Capital.QiXieShi_Back。
- QiXieShi_Back 的休息选择进入 ShouFuAiRen。`Path__ShouFuAiRen` 记录“缓慢地接近”或“大胆地接近”，两个方向之后都会进入 Another_Day。
- Another_Day 中的集市选择写入 `Path__BuySomeCai`。缓慢接近方向随后进入 After_HuanManDiJieJin 并止于 `PAUSE`；大胆接近方向进入 Check__Path__BuySomeCai，再按腊肉、香薰、麦秆分别进入三个止于 `PAUSE` 的差分。
- 因此当前不能把两种接近方式与三种购买选择理解为六条完整路线；实际静态终点是四处 `PAUSE`。
- `Menus/JumpTo.ink` 的“上次更新结束的地方”直接进入 ShouFuAiRen，是调试入口，不等同于从上一章完整推进。

## 7. 结局目录

[Misc/Finales.ink](../Misc/Finales.ink) 中列出四个结局 stitch：

| 结局 stitch | 当前标题 | 源码中的定位 |
|---|---|---|
| Lord_of_the_Black_Goo_Demon | 黑胶恶魔领主 | 坏结局 |
| BaiHuMengJiang | 白虎猛将 | 摸鱼结局 |
| YiZheRenXin | 医者仁心 | 不完美的结局 |
| PoChan | 破产 | 坏结局 |

结局目录按 stitch 访问计数显示已经历过的结局，不是读取四个独立布尔变量。静态入口已定位为：深渊交流分支、郊区退休分支、远森镇随缘分支，以及远森镇经营和追捕处的两个破产入口；调试强制展示与目录重看也会访问结局 stitch。各剧情路线的实际可达性仍需逐条运行验证。

## 8. 阅读流程时的注意事项

- Ending__CP1、Ending__CP2 等命名节点不一定是全局最终结局；要继续追踪其后是否还有跳转。
- ⛔️、TODO 和 # unclickable 是项目中用于标识未开放内容的记号；不能仅凭文本就断言运行时一定如何处理。
- 这里列出的流程是静态阅读得到的概览，不替代 Ink 编译与逐路线测试。

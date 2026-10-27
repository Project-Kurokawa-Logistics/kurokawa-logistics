# 待确认问题与 TODO 清单

> 这份清单来自对当前 .ink 源码的静态阅读。条目是待核查事项，不等于已确认的程序错误。修改前应先判断它是设计选择、临时占位还是意外遗漏。

## 高优先级：影响路线完整性或剧情判定

### ISSUE-001：开局与职业路线仍有未开放选项

- **位置**：[Menus/START.ink](../Menus/START.ink)、[Maps/Abyss/START.ink](../Maps/Abyss/START.ink)、[Maps/Forest/START.ink](../Maps/Forest/START.ink)、[Maps/Desert/START.ink](../Maps/Desert/START.ink)、[Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink)
- **源码现象**：开局菜单的城市选项、部分深渊选择、森林开局的多个行动，以及“神官/司令”等职业选择带有禁用标记或 TODO。
- **待确认**：哪些路线是计划内暂缓，哪些已经废弃，哪些需要恢复。
- **建议验收**：明确每个开局的当前状态（可玩/暂停/占位/废弃），并确保可见选项与实际可走路线一致。

### ISSUE-002：神官身份会进入 BUG 节点

- **位置**：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)，Find_Memories
- **源码现象**：当 Careers__AZ == "神官" 时跳到 BUG；否则进入另一段对话。当前医疗帐篷的神官职业选项带禁用标记。
- **待确认**：这是有意保留的未完成分支，还是神官路线恢复时需要补齐的内容。
- **建议验收**：如果开放神官职业，必须补上此处分支并检查后续章节；如果暂不开放，文档应继续明确标记。

### ISSUE-003：经营选择的第一项直接进入“破产”结局

- **位置**：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)，DealCommercial
- **源码现象**：第一项描述主角稳定经营、发现可疑顾客并通知镇长，随后跳转到 Finales.PoChan 和 Menu__Finale。
- **待确认**：这是刻意设置的反转/坏结局，还是跳转目标尚未更新。
- **建议验收**：由作者确认预期后，再决定保留结局、改成继续经营路线，或补充必要的中间剧情。

### ISSUE-004：结局旗标的设置位置与可达性尚未全量核对

- **位置**：[Misc/Finales.ink](../Misc/Finales.ink) 及各路线文件
- **源码现象**：结局目录条件引用四个标记：Lord_of_the_Black_Goo_Demon、BaiHuMengJiang、YiZheRenXin、PoChan。
- **待确认**：每个标记在哪里被设置、是否会重复设置，以及当前每个结局是否都有可达路径。
- **建议验收**：建立“结局 -> 触发节点 -> 状态设置 -> 返回菜单”的映射，并逐条试玩验证。

## 中优先级：分支状态与角色连续性

### ISSUE-005：阿沙西修改菜单部分选项被禁用，判定效果不明显

- **位置**：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)，Modify_Arshasy / After_Modify_Arshasy
- **源码现象**：标记、强迫修改爱好和改变称呼等选项带禁用标记；当前可用的欲望限制、配件选项会进入后续判定。旁边的 TODO 表示该判定对后续内容没有实际影响。
- **待确认**：哪些修改应当改变人物状态、后续文本或结局。
- **建议验收**：每个可用选项都应有明确的状态影响，或者明确作为纯叙事选项保留。

### ISSUE-006：转化相关菜单存在重复选项

- **位置**：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)，BaTaZhuanHuaWeiJiaoNu
- **源码现象**：出现多条文案相同的“把他转化为胶奴”选项，同时有“让他安息”的计数条件。
- **待确认**：重复项是否原本代表不同转化方案，还是临时占位造成的重复。
- **建议验收**：确认每项对应的结果；如果没有区别，应合并为一个明确选择，避免玩家误以为它们有不同效果。

### ISSUE-007：追捕分支标注“没有结尾”的路线需要补齐或定性

- **位置**：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)，WuMaoZhiRen / ChuJi / Choose_7
- **源码现象**：出击选项进入 ChuJi，随后跳到 Choose_7；源码附近明确写有“这条线路没有结尾”的 TODO。追捕选项又会影响后续剧情/结局。
- **待确认**：这条路线应当与守株待兔路线汇合，还是拥有独立结果。
- **建议验收**：每条可选路线都应有清晰的汇合点、章节结束点或最终结局，不应意外掉入无后续节点。

### ISSUE-008：林德、阿沙西与洛里安的状态连续性需复核

- **位置**：[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink)，Choose_11、BaTaZhuanHuaWeiJiaoNu 及其后续叙述
- **源码现象**：部分节点含有“改变洛里安阵营”“判定阿沙西状态”等 TODO，后续叙述又涉及不同人物的转化与装备状态。
- **待确认**：每个选择实际作用于哪个角色，角色身份、阵营、种族和身体状态如何延续。
- **建议验收**：按时间顺序建立角色状态表，确认转化前后称谓、代词、控制权与装备归属。

## 低优先级：维护与验证

### ISSUE-009：TEMP__ 旗标的生命周期需要逐项核查

- **位置**：主要在 [Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) 与 [Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink)
- **源码现象**：多处以 VAR TEMP__... 声明旗标，并在返回节点或结束选择时重置部分值。
- **待确认**：每个变量是否应跨节点/章节保留，以及重置是否会抹掉后续需要的选择结果。
- **建议验收**：对每组旗标记录初值、写入点、读取点、重置点；检查重复进入同一 knot 的表现。

### ISSUE-010：需要在目标运行环境中进行编译与逐路线验证

- **范围**：整个 Ink 项目
- **源码现象**：静态阅读无法确认所有 knot 名称、条件、宿主 UI 标记与结局调用在当前工具链中是否都能正常工作。
- **待确认**：项目使用的 Ink 编译器/运行器版本、# unclickable、# CLEAR 等标签的实际解释方式。
- **建议验收**：记录工具链版本；编译主 Ink 文件；按开局、主要选择、坏结局和章节返回路径建立最小回归测试清单。

## 处理状态

本清单初始条目均为 **待确认**。在作者确认意图之前，不应仅凭静态阅读自动修正剧情跳转。

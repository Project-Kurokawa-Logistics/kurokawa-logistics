# 《即刻入职》Ink 命名与代码格式约定（提案）

> 本文区分 **现有事实** 与 **今后推荐**。本提案不意味着已有 .ink 文件已经完成命名迁移。

## 一、现有的命名规律

| 元素 | 当前例子 | 从源码观察到的规律与问题 |
| --- | --- | --- |
| 目录 | Base/、Work/、Break/、Dreams/、Endings/ | 按功能和叙事模块分区，清晰，建议保留 |
| 文件 | Work/Business_Trip.ink、Base/Going_To.ink | 单词首字母大写，下划线连接；文件名中的模块信息由目录承担 |
| Knot | Work__Gym、Base__Startup、Ending__Work__Gym | 双下划线 __ 作为层级分隔；Ending 与 Endings 单复数有别 |
| Stitch | Morning、Choice、Game_Over、KKL_Letter | 混合业务阶段、泛用词和缩写；同名 Stitch 分布在不同 Knot 中，引用需带上下文 |
| 全局变量 | INDEX、LAST、Separator_Count | 全大写、PascalCase、缩写混用，难从名字判断类型 |
| 事件记录 | Flag__Work__Gym、Flag__Break__Home | 实际通过 ++ 计数，不是纯布尔标志；通常用 == 0／!= 0 判断 |
| 结局次数 | Count__Game_Over | 与 Flag 中隐含的访问次数含义重叠 |
| 函数 | Check__SAN(INDEX)、Check__Aboard_Status() | Check 前缀一致，但返回的状态类别不同 |
| 状态文本 | "FINE"、"No.8" | 字符串字面量散落在多个文件，拼写错误可能影响分支 |
| 例外 Knot | Navigator、Dream1、BUG、TEST、Credits | 尚未完全遵守模块化名称 |

## 二、推荐的命名决策

### 1. 保留模块 Knot 结构

新 Knot 推荐沿用：

- Work__SceneName、Break__SceneName、Base__SceneName
- Dream__SceneName、Ending__Work__SceneName、Menu__SceneName、Page__SceneName
- Stitch 使用 snake_case：例如 intro、choose_action；既有 Stitch 暂不改名。
- 文件名推荐维持当前 Business_Trip.ink 风格；文件路径与 Knot 名保持一一对应，不在同一文件随意声明无关场景。

**注意：** 双下划线用于命名空间分段，单个下划线用于英文词组；这是项目自定约定，而非 Ink 语言自动提供的命名空间。

### 2. 全局变量统一 snake_case，按语义前缀分类

| 语义 | 新变量样式 | 类型与规则 |
| --- | --- | --- |
| 是否看过事件 | seen_work_gym | bool；只在真正经历后设置 true |
| 事件出现次数 | count_work_gym | int；每次进入相应事件 +1 |
| GAME OVER 次数 | count_game_over | int；在约定的结局统一增加 |
| 精神压力累计量 | stress_score | int；数值越大代表负担越重 |
| 故事／解锁状态 | state_connection 等 | 枚举／常量定义的状态，避免魔法字符串 |
| 菜单隐藏交互 | count_menu_separator_clicks | int；与剧情次数明确区分 |
| 临时随机数 | roll_dream（temp） | 局部变量，仅作用于相应 Knot／Stitch |

stress_score 比 sanity_score 更贴合当前 INDEX **升高时状态恶化** 的实际意义；最终命名应以主创对设定的解释为准。

### 3. 迁移映射建议（未实施）

| 旧名 | 推荐名 |
| --- | --- |
| INDEX | stress_score |
| LAST | last_scene_id（先确认是否仍使用） |
| Count__Game_Over | count_game_over |
| Separator_Count | count_menu_separator_clicks |
| Flag__Work__Gym | count_work_gym；若仅关心是否经历则另设 seen_work_gym |
| Flag__Work__Off_Work | count_work_off_work |
| Flag__Work__Business_Trip | count_work_business_trip |
| Flag__Work__Napping | count_work_napping |
| Flag__Work__Shutdown | count_work_shutdown |
| Flag__Break__Interview | count_break_interview |
| Flag__Break__Cinema | count_break_cinema |
| Flag__Break__Home | count_break_home |
| Flag__Break__Shutdown | count_break_shutdown |
| Flag__Base__Wakeup | count_base_wakeup（或仅需布尔时改为 seen_base_wakeup） |

不建议机械把所有 Flag__... 改成 seen_...：原剧本通过数值 == 1 区分第一次、!= 0 区分已经发生；先保留次数语义才能维持现有行为。

### 4. 函数用动词说明返回值；常量统一存放

推荐新函数采用 Get__Sanity_State(stress_score)（返回精神状态字符串）、Get__Aboard_Status()（返回身份／环境状态）、Has__All_Work_Endings()（返回 bool）。这些是**建议的新命名**，不是已存在的函数。

不要把 Check__SAN 的返回值和 Check__Aboard_Status 的返回值混为一组：前者是精神阶段，后者是身份／环境流程。

可以为高频状态字符串和阈值定义 CONST（先确认目标 Ink 编译器兼容性），减少重复硬编码。例如：

```ink
CONST STRESS_OK_MIN = 30
CONST STRESS_BAD_MIN = 60
CONST SAN_STATE_FINE = "FINE"
CONST SAN_STATE_OK = "OK"
CONST SAN_STATE_BAD = "BAD"
CONST SAN_STATE_AWFUL = "AWFUL"
```

## 三、建议的 Ink 源码排版

- 每个 .ink 文件以唯一、明确的主 Knot 开头，额外 Stitch 按实际阅读顺序排列。
- Knot === 顶格；Stitch = 顶格；文本、选项、divert、变量更新统一使用四个空格缩进（实际编译语法优先）。
- 一行只处理一个重要状态变化；带条件的选择另起行写其转移目标。
- 使用简短的 // 注释说明“为何此条件存在”，而非复述“跳转到哪里”。
- # CLEAR 等 InkShell／渲染器专用 tag 统一贴近产生效果的选择节点；保留现有 HTML／特殊乱码表现，不为追求排版而批量清理。
- 需要重复的结局记账逻辑应规划为公共入口／函数，但必须在确认调用约定后再抽取，避免重复加数或遗漏。

**仅用于示意的全新场景模板（不可直接当作现有运行节点替换）：**

```ink
VAR count_work_example = 0
VAR seen_work_example = false

=== Work__Example
    ~ count_work_example += 1
    ~ seen_work_example = true
    -> intro

= intro
    这里是正文。先说清楚人物目标，再给出选择。

    + [继续调查]
        -> investigate
    + [暂时离开]
        -> game_over

= investigate
    这里可以根据已有状态显示不同叙述。
    -> game_over

= game_over
    // TODO: 接入统一结局统计入口，避免各文件遗漏。
    -> Menu__Game_Over
```

此示例只演示命名与排版。实际场景中的 END／DONE／tunnel 返回必须根据所用 Ink 语义和调用方式设计，不能统一机械替换。

## 四、明确区分剧情事实、代码事实与待定设计

1. **记录层（counter）**：角色遭遇过几次，应由 count_... 唯一负责。
2. **选择层（choice）**：能否选当前行动，读取既有记录、精神阶段和章节状态，避免在选项显示时偷偷改变计数。
3. **结果层（ending）**：进入事件后统一结算 GAME OVER 与压力增量；一次结局只结算一次。
4. **呈现层（UI）**：菜单、回顾索引和随机梦境不应无意修改故事事实；故意的开发者彩蛋应注明。
5. **身份层（reveal）**：No.8、DRONE、Prototype 应和精神状态使用不同的常量族；不要用 INDEX 一项同时推断所有世界观事实。

## 五、静态审阅发现的待核查事项

> 下列不是已确认的 Bug；没有对源码进行修复，也没有执行 Ink 编译或全路径自动游玩。

- **结局计数不齐：** Work/Napping.ink 有 Flag__Work__Napping ++ 和 INDEX 更新，却没有在该结局里发现 Count__Game_Over ++。需决定是否为遗漏。
- **正常与特殊终结计分差异：** Work/Shutdown.ink、Break/Shutdown.ink 增加结局次数但不直接增加 INDEX；应确认是刻意设计还是待统一。
- **集合不一致：** Check__SAN 返回 AWFUL 需要 5 个 Work + 3 个 Break（不含居家终结），而 Check__Aboard_Status 返回 No.8 需要 5 个 Work + 4 个 Break。需确认是否设计使然。
- **梦境未接线：** Dreams/Dream7.ink 被 INCLUDE，但不在 Dream__Index.Shuffle 的随机候选之中。
- **疑似闲置入口：** Break/Index.ink 的 Break__Index 有独立的“事件全做完”逻辑，主菜单当前走 Base__Going_To。需搜索所有引用后确定是否为保留接口。
- **条件优先级：** Base/Startup.ink 存在按顺序触发的强制办公室／居家终结分支，应为 BAD 且多个事件尚未经历的组合建立测试。
- **开发占位内容：** Base/Wakeup.ink 结尾、多个 Break／Work 结局与信件变体仍含未完／占位提示；不可因为图画了终局就当作已写完。
- **特殊菜单入口：** Menu__Main 点击分隔线超过 5 次会直接设置大量 Flag；若后续用事件计数统计自然通关，应区别手动记录与强制赋值。
- **变量与计数一致性：** LAST 的用途和 Count__Game_Over 与每条路线的“一轮”定义应先查清，再合并或拆分字段。

## 六、推荐的渐进迁移顺序

1. **先写测试案例，不改名：** 列出初始状态、各精神阶段、9 种事件、DRONE／No.8／特殊菜单入口的预期表现。
2. **第一轮只修确定的统计遗漏：** 例如确认小憩是否应该增加 Count__Game_Over，每个改动有明确测试。
3. **第二轮将门槛和状态字符串常量化：** 保留旧变量、原返回值与相同条件顺序。
4. **第三轮一组一组迁移变量：** 例如先处理单条工作路线的计数名，集中改 Parameters 和所有读写处，一次提交可回滚。
5. **最后再提炼通用结局函数、统一 Knot／Stitch：** 牵涉大量跳转，须有回归测试后再做。

**原则：** 新增内容遵循新约定；旧代码只有在具体开发任务涉及且有测试时才改。以“不改变现有玩家可见行为”为首个重构目标。

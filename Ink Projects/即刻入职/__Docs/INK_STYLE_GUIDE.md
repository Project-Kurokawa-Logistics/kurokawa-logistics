# 《即刻入职》Ink 命名与代码格式约定

- 更新日期：2026-10-28
- 适用基线：目录迁移后的 `main`（PR #3）
- 目的：让后续代码更容易审查，同时尽量避免无测试的批量改名破坏剧情跳转。

## 1. 当前工程约定

### 目录和文件

| 目录 | 用途 |
| --- | --- |
| `Core/` | 全局变量 |
| `Systems/` | 状态函数、身份判定、强制闯入、环境检查 |
| `Flow/` | 启动、导航、行动选择 |
| `Routes/Work/`、`Routes/Break/` | 事件与结算 |
| `Dreams/` | 梦境路由和正文 |
| `Endings/Routes/` | 普通路线的结局正文 |
| `Endings/` | 最终和解、现实 No.8、结局回顾 |
| `UI/` | 菜单、标题、日志、异常页、制作人员 |
| `Dev/` | 开发测试与兜底节点 |
| `__Tests/` | 可复用的最小编译与回归入口（`inkjs@2.4.0`，CommonJS） |

目录不使用数字前缀。文件名采用易读英文词组与下划线，例如 `Business_Trip.ink`、`Final_Reconciliation.ink`。

### Knot、Stitch 与函数

当前 Knot 名称使用双下划线表达模块层级，例如：

- `Flow__Startup`
- `Flow__Navigator`
- `Work__Route_Hub`
- `Ending__Final_Reconciliation`
- `Ending__No8_Reality`
- `Menu__Main`
- `Page__Title`

双下划线是项目自己的命名约定，不是 Ink 语言提供的命名空间功能。Stitch 目前仍有 `Check`、`Choice`、`Morning`、`Afternoon`、`Evening`、`Game_Over` 等历史名称；**不要仅为风格统一而批量改名**，因为 Divert 可能依赖 Stitch 的上下文。

函数以动词说明用途：

- `Get__Sanity_State(score)`：返回精神状态字符串。
- `Get__Aboard_Status()`：返回 `Prototype`、`DRONE` 或 `No.8`。
- `Get__Forced_Intrusion()`：返回 `WORK`、`BREAK` 或 `NONE`。

### 全局变量

当前重构后的变量采用大写与语义前缀：

| 类型 | 当前示例 | 约定 |
| --- | --- | --- |
| 精神数值 | `SAN_SCORE` | 数值越高，精神状态越差；初始 `-1` 是首次启动哨兵，首次打开邀请函后为 `0` |
| 路线经历次数 | `COUNT_ROUTE_WORK_GYM`、`COUNT_ROUTE_BREAK_HOME` | 每条路线的实际进入次数；0 表示未经历，非 0 表示经历过；不能随意改成 bool |
| 结算／重新连接序号 | `COUNT_GAME_OVER` | 九条路线已完成结算的全局总次数，也是「重新连接：第 N 次」的序号；不是唯一路线数 |
| 菜单隐藏点击 | `COUNT_MENU_SEPARATOR` | 主菜单分隔线点击次数；第 6 次触发隐藏入口，与自然路线结算分开 |
| 阶段布尔值 | `HAS_ENTERED_FINAL_RECONCILIATION` | 用 `HAS_` 表达已发生的阶段 |
| 解锁布尔值 | `UNLOCKED_NO8_DATABASE` | 由第 6 次分隔线点击置 true；实际用途是隐藏初始化／重新连接入口，保留 |

不要再用 `Flag__...` 命名一个实际由 `++` 更新的计数器。首次经历与重复经历有不同效果时，必须保留次数语义。

## 2. 推荐的新代码写法

以下是新增代码的推荐写法，不代表所有旧文件已经完成迁移。

- 全局计数使用 `COUNT_*`；布尔阶段使用 `HAS_*`／`IS_*`；解锁使用 `UNLOCKED_*`。
- 函数名明确表示返回内容，避免让精神状态函数和身份状态函数共用含糊的 `Check` 名称。
- Knot 使用 `Module__Purpose`，文件路径与其主要 Knot 尽可能对应。
- 状态字符串如 `FINE`、`OK`、`BAD`、`AWFUL`、`Prototype`、`DRONE`、`No.8` 拼写必须完全一致。
- 对复杂分支加注释解释**为什么存在这条条件**，而不只是复述下一跳。
- 不要在选项呈现或预览过程中偷偷增加路线计数；状态副作用应发生在真正进入路线／结算的位置。
- 需要显示某一 Knot／Stitch 的历史访问序号时，使用 Ink 的 Stitch 读计数并显式 `+ 1` 表示当前一次（如 `Work__Gym` 的 `Game_Over + 1`）；不要用 `COUNT_GAME_OVER` 顶替这类历史访问次数。
- 每条结局的计数和精神数值变化应有明确约定，并由测试覆盖；不能仅靠复制粘贴保持一致。

### 排版模板

```ink
=== Work__Example

= Choice
    + [继续调查]
        -> Investigate

    + [暂时离开]
        -> Leave

= Investigate
    这里是正文。

    -> Game_Over

= Game_Over
    // 在这里调用已确认的统一结算逻辑；尚未实现前不要伪造函数。
    -> Menu__Game_Over
```

注意：此模板只示范 Knot／Stitch 和选项排版。实际项目中 `END`、`DONE`、`->`、`<-`、`# CLEAR` 的语义并不相同，不能机械替换。全局 `VAR` 声明集中放在 `Core/Variables.ink`，不复制到每个路线文件。

## 3. Ink 文件维护规则

1. 新增文件后，同时把它加入 `即刻入职.ink` 的 INCLUDE 列表；Dev 测试文件除非明确需要，不要加入正式运行入口。
2. 移动／改名文件后，全局搜索旧路径、旧 Knot 和所有调用方。
3. 修改函数签名时同步检查所有调用；带参数函数和无参数函数的调用不能混用。
4. 修改变量时检查声明、所有读取、所有写入、菜单条件、路线结局和隐藏入口。
5. 保留作者的剧情原文与特殊乱码表现。除非任务明确要求，不要把未完文本替换成自拟的“完整剧情”。
6. 修改条件时保留原有分支优先级，除非有明确的设定依据；Ink 条件按书写顺序判定，顺序本身可能影响结果。
7. 一次 PR 尽量只处理一个逻辑问题，并附上编译和复现结果。

## 4. 迁移策略

**现在不做全量变量改名。** 先完成目录迁移后的编译、引用扫描和故事回归；之后按路线／功能逐步迁移，并在同一个 PR 中更新全部读写点。

建议顺序：

1. 先明确 `SAN_SCORE`、`COUNT_GAME_OVER` 和各路线计数的真实语义。
2. 先修复经测试确认的计数遗漏或条件错误。
3. 再考虑提炼重复结算逻辑；需要先验证 Ink 函数、tunnel 和变量作用域的真实行为。
4. 最后再统一历史 Stitch／Knot 名称。旧名称只在有测试的具体任务中迁移。

## 5. 当前需特别留意

- `SAN_SCORE` 名称容易让人误以为数值越高越健康；当前实际规则是越高越差。没有完成测试和全量迁移前，必须在注释／文档中写清楚。
- `Get__Sanity_State(score)` 的 `AWFUL` 不只取决于分数，还取决于普通路线经历情况。
- `Get__Aboard_Status()` 的 No.8 判定与 `AWFUL` 的路线集合不是同一组条件。
- `UNLOCKED_NO8_DATABASE` 由第 6 次分隔线点击置 true，实际用途是隐藏主菜单的初始化／重新连接入口；保留。
- `Work__Gym` 的 `Game_Over + 1` 是 `Work__Gym.Game_Over` Stitch 的历史访问次数加当前一次，不是 `COUNT_GAME_OVER`；`ResetState()` 会重置该计数。
- `Dream7` 已被 INCLUDE，但当前随机池只调用 Dream1–Dream6。
- `UI/Menus/Main.ink` 中的 `【DEV】` 状态诊断文本当前由块注释隐藏。
- InkJS 2.4.0 编译、Phase 0 的 18 项 smoke 与 Phase 1 的 11 项回归已有通过记录（测试入口 `__Tests/`，`npm test`）；完整自然通关与 Inky GUI／inklecate 实机回归仍未运行。参见 [KIMI_CODE_HANDOFF.md](KIMI_CODE_HANDOFF.md) 与 [REFACTOR_PLAN.md](REFACTOR_PLAN.md)。

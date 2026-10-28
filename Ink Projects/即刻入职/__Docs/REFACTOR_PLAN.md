# 《即刻入职》重构计划与验收记录

- 更新日期：2026-10-28
- 当前基线：目录重构已合并至 `main`（PR #3，merge commit `728b84c201693db1a4774e2ee4402873914eb4e1`）
- 状态：**Phase 1 技术计数项已由静态审查与 11 项运行时回归确认；两条 Shutdown 的 SAN 设计待主创确认，完整自然通关、Inky GUI／inklecate 实机回归与作者验收尚未完成**
- 测试入口：`__Tests/`（`npm ci --no-audit --no-fund && npm test`），固定 `inkjs@2.4.0`
- 原则：先保证行为，再逐步整理；每次改动可审查、可测试、可回滚。
- 后续执行：KIMI CODE；具体约束与下一步见 [KIMI_CODE_HANDOFF.md](KIMI_CODE_HANDOFF.md)。

## 1. 已完成的结构调整

目录按职责组织，未添加数字前缀：

```text
即刻入职/
├── 即刻入职.ink
├── Core/
│   └── Variables.ink
├── Systems/
│   ├── Sanity.ink
│   ├── Aboard_Status.ink
│   ├── Intrusion.ink
│   └── Environment.ink
├── Flow/
│   ├── Startup.ink
│   ├── Navigator.ink
│   └── Going_To.ink
├── Routes/
│   ├── Work/
│   └── Break/
├── Dreams/
├── Endings/
│   └── Routes/
├── UI/
│   ├── Menus/
│   └── Pages/
├── Dev/
├── __Docs/
└── __Tests/
```

主要约定：

- `即刻入职.ink` 集中声明 INCLUDE 与启动入口。
- `Core/Variables.ink` 只存全局变量声明。
- `Systems/` 负责状态计算，不承载大段剧情。
- `Flow/` 负责章节流程、导航和行动选择。
- `Routes/` 负责可经历事件和该事件的结算。
- `Endings/Routes/` 负责普通路线的结局正文；空白空间与现实 No.8 结局独立。
- `UI/` 负责菜单、标题、日志、异常页和制作人员。
- `Dev/` 的测试／兜底节点默认不接入正式流程。
- `__Docs/` 为统一文档目录，`__Tests/` 为可复用的最小编译与回归入口；不再恢复旧 `docs/` 双轨。

## 2. 推荐执行顺序

### Phase 0 — 冻结结构，验证迁移

**目标：** 确认文件移动没有破坏 Ink 工程，不追加新的大规模结构变化。

- [x] 使用 InkJS 2.4.0 编译入口文件；Phase 0 当时未在仓库固定编译器版本（Phase 1 起 `__Tests/` 已固定 `inkjs@2.4.0`），尚未用 Inky／inklecate 交叉验证。
- [x] 静态扫描所有 `INCLUDE`，确保目标文件存在。
- [x] 收集所有 Knot／Stitch 定义，检查重名。
- [x] 收集所有 `->`、`<-`、函数调用，检查未定义目标。
- [x] 检查是否有旧路径、旧 Knot 名、旧变量名残留。
- [x] 对主要流程执行直接路径与状态注入 smoke test，确认关键剧情可达性。
- [x] 将编译命令、Ink 版本、结果和已知失败写入本文档。

**通过标准：** 能编译；无未解释的目标缺失；主要流程 smoke test 通过。若编译失败，先修语法和引用，不同时做剧情重写。

**2026-10-28 验证结果：** 达到 InkJS 编译与 smoke 层面的 Phase 0 验收；完整自然通关与 Inky GUI 实机回归仍未运行。本轮未修改 Ink 源码。实际环境为 Node v24.22.1、InkJS 2.4.0：

```bash
npm install --prefix .phase0-tools --no-audit --no-fund inkjs@2.4.0
node .phase0-tools/compile.cjs "Ink Projects/即刻入职"
node .phase0-tools/smoke.cjs
```

入口文件的 47 个 INCLUDE 均解析成功；编译结果为 0 错误、0 警告，无未解释的目标缺失。smoke 测试共 18 项，全部通过，覆盖：

- 新游戏启动、邀请函及首次导航仅有面试／上班；
- FINE 的健身可见性、OK／BAD 的居家休息可见性；
- 九条路线各自的首次／重复结算及路线计数、`COUNT_GAME_OVER`；普通路线 +10／+5，两条 Shutdown 不增加 `SAN_SCORE`；
- BAD 缺工作、缺面试时分别强制 WORK／BREAK，之后进入 DRONE；OK 缺健身时强制 WORK；普通环境进入标题页；
- AWFUL 特殊居家选项、九路线完成后的 No.8 优先级，以及“空白和解 → 现实 No.8”顺序、无额外普通醒来；
- `ResetState()` 恢复全部初始全局状态。

上述测试包含直接路径和状态注入，不等同于完整自然通关。Phase 0 结束时临时测试目录与依赖已清理；Phase 1 起改用仓库内 `__Tests/`（见下）。两条 Shutdown 的精神增量是否为最终设计、Dream7 随机池、DEV 文本和 No.8 草稿仍需后续确认；`Game_Over + 1` 的访问计数语义已由 Phase 1 回归确认（见 Phase 1 实测）。

DeepSeek 实际修改为**无**。已尝试通过 DSH `headless` 委派审查，但运行失败：`MISSING_CREDENTIAL: llm-deepseek: no API key for provider route "deepseek-official"`。需要在 DSH Web Models 页配置 `DEEPSEEK_API_KEY` 或向启动环境提供该凭据后，才能继续委派。

### Phase 1 — 固定状态语义和计数边界

**目标：** 把“路线经历次数”“精神数值”“断开连接／重新连接次数”“隐藏菜单点击”分开定义。

- [x] 确认 `SAN_SCORE = -1` 的首次启动语义：`-1` 是首次启动哨兵；首次打开邀请函时 `Flow__Navigator.KKL_Letter` 将其增至 `0`；数值越高状态越差。
- [x] 验证普通路线首次经历 +10、重复经历 +5：七条非 Shutdown 路线已逐条实测；两条 Shutdown 见下一项。
- [x] 逐条核对 `COUNT_ROUTE_*` 在入口处增加一次，不能在菜单预览或回顾时增加：`Business_Trip`／`Napping` 仅进入 `Flow` 时计数，Choice 预览与取消不计数；其余在路线 Knot 入口计数；菜单预览、结局回顾、`Menu__Game_Over`／标题往返均不增加。
- [x] 逐条核对 `COUNT_GAME_OVER` 是否每次普通结局恰好增加一次：九条路线每次结算恰好 +1；它是九路线已完成结算的全局总次数／重新连接序号，不是唯一路线数，也不是 Gym Stitch 读计数。
- [ ] 确认 Work／Break 的 Shutdown 结局是否故意不增加精神数值：现状是两条都不增加，本轮只记录、未修改；**是否最终设计仍待主创决定**。
- [x] 确认 `COUNT_MENU_SEPARATOR` 的隐藏入口不会被误当作自然路线经历：前 5 次只增加该计数；第 6 次会写九条路线计数并置 `UNLOCKED_NO8_DATABASE = true`，但不增加 `COUNT_GAME_OVER` 或 SAN。
- [x] 搜索 `UNLOCKED_NO8_DATABASE` 的全部读写，确认它是否仍需要保留：实际用途是隐藏主菜单的初始化／重新连接入口，保留。

**注意：** 不要为了“统一”而给每个 Shutdown 结局机械添加 +10／+5；先由主创确认其叙事含义，再写测试。

**2026-10-28 Phase 1 实测：** 本轮未修改任何 `.ink`；静态审查与运行时回归均未发现需要最小补丁的计数缺陷。测试入口为 `__Tests/`（Node v24.13.1、npm 11.8.0、`inkjs@2.4.0`）：

```bash
cd "Ink Projects/即刻入职/__Tests"
npm ci --no-audit --no-fund
npm test
```

47/47 INCLUDE 解析成功，0 错误、0 警告；11 tests / 11 pass / 0 fail。覆盖：编译、初始值／首次启动、九路线首次与重复结算、Gym 跨路线 1／2 次、Choice 预览取消、九条结局回顾、强制 WORK／BREAK→DRONE、标题往返、分隔线 5／6 次与 UNLOCKED、全路线 No.8「前8次」、`ResetState`。

Gym 的 `Game_Over + 1` 已确认是 `Work__Gym.Game_Over` Stitch 的历史访问次数加当前一次，不是 `COUNT_GAME_OVER`：首次／重复自然 Gym 显示至少 1／2 次，跨路线与结局回顾不多算，`ResetState()` 会重置该计数；不得为了形式统一替换。

**边界：** 以上包含 direct path 与状态注入，不等于完整自然通关；未运行 Inky GUI、inklecate 或宿主 `#RESTART`。No.8 与「前8次」仅为状态注入验证，最终醒来次数语义仍按 Phase 3 核对。**Phase 1 的设计项（Shutdown SAN）未完成，不把整个 Phase 1 或作者验收标为完成。**

### Phase 2 — 行动选择与强制闯入

**目标：** 让选项可见性与主创设定一致。

- [ ] 新游戏首次导航只有“请假去黑川物流面试”和“去公司上班”。
- [ ] FINE 才出现健身选项。
- [ ] OK 与 BAD 都允许考虑休息；BAD 不能因条件遗漏而只剩上班。
- [ ] 维持现有电影、快递、面试与上班的其他精神状态限制，除非主创明确修改。
- [ ] 用状态表测试 `Get__Forced_Intrusion()`：BAD／AWFUL、工作路线未经历、面试未经历、健身未经历、Shutdown 已发生等组合。
- [ ] 验证强制闯入后的下一次环境检测确实进入 DRONE 乱码页，而不是返回普通标题或重复强制闯入。

**实现要求：** 改条件时优先做最小补丁；在 PR 描述中列出修改前后的可选项矩阵。

### Phase 3 — 最终和解与现实苏醒

**目标：** 保证最终结局的顺序与含义不可被普通路由打断。

期望状态机：

```text
所有要求的路线均已经历
        ↓
Get__Aboard_Status() = No.8
        ↓
HAS_ENTERED_FINAL_RECONCILIATION = false
        ↓
Ending__Final_Reconciliation
（精神空间最后一次醒来；与自己和解）
        ↓
Ending__No8_Reality
（现实苏醒；接受 AZ；市场部部长 No.8）
```

- [ ] 核对 `Get__Aboard_Status()` 的 No.8 门槛是否恰好对应主创定义的“所有线路”。
- [ ] 确认 DRONE 分支优先级不会抢走已经合法达成的 No.8 终局。
- [ ] 核对 `HAS_ENTERED_FINAL_RECONCILIATION` 的赋值时机：当前源码在空白空间 Knot 开始时设置为 true。
- [ ] 核对 `PREVIOUS_WAKEUPS = COUNT_GAME_OVER - 1` 是否与实际计数时机一致，避免显示次数差一。
- [ ] 确认进入现实 No.8 结局后没有 divert 回普通精神空间的路径。
- [ ] 将 `Endings/No8_Reality.ink` 的 AI 草稿交给主创确认；未确认前不要把它标记为定稿。

### Phase 4 — 梦境与结局回顾

- [ ] 确认当前随机梦境概率：FINE 0%、OK 50%、BAD 75%、AWFUL 100%（以 `Dreams/Router.ink` 的实际条件顺序为准）。
- [ ] 确认随机池当前为 Dream1–Dream6；Dream7 已被 INCLUDE，但未进入 Shuffle。是否加入由主创决定。
- [ ] 确认结局回顾只展示已经历的路线，且不会误增加路线计数或 `COUNT_GAME_OVER`。
- [ ] 检查标题／主菜单中的 `【DEV】` 调试文本，决定是否隐藏或用开发开关控制。
- [ ] 确认 Dev 测试入口不会成为正式玩家流程的可达节点。

### Phase 5 — 命名与代码风格（最后进行）

结构迁移后暂时冻结批量改名。后续新增内容遵循 [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)，旧名称只在具体任务涉及且有回归测试时迁移。

推荐方向：

- 全局数值：`SAN_SCORE`、`COUNT_*`。
- 布尔阶段／解锁：`HAS_*`、`IS_*`、`UNLOCKED_*`。
- 函数：`Get__Sanity_State(score)`、`Get__Aboard_Status()`、`Get__Forced_Intrusion()`。
- Knot：`Flow__Startup`、`Work__Route_Hub`、`Ending__Final_Reconciliation`、`Menu__Main`。
- 文件名采用可读英文词组与下划线，例如 `Business_Trip.ink`；目录不加数字序号。
- 不机械替换 `END`、`DONE`、`->`、`<-` 或 `# CLEAR`；这些涉及实际 Ink 流程语义。

## 3. 当前已知风险清单

| 优先级 | 风险 | 当前状态／下一步 |
| --- | --- | --- |
| P0 | 结构迁移后未确认编译 | InkJS 2.4.0 编译通过（47/47 INCLUDE，0 错误／警告）；Inky／inklecate 与完整自然通关尚未验证 |
| P0 | INCLUDE／Divert 引用可能因改名失效 | 静态扫描与 InkJS 编译均未发现失效引用 |
| P1 | 最终和解计数可能差一 | 状态注入下 `COUNT_GAME_OVER = 9` 显示「前8次」；最终醒来次数语义按 Phase 3 核对，完整自然终局未验证 |
| P1 | No.8／DRONE／强制闯入的优先级 | 关键组合已由回归覆盖；尚未穷举完整状态组合 |
| P1 | 各路线结局统计是否恰好一次 | 九条路线首次／重复回归通过，每次结算恰好 +1；Shutdown 精神增量设计待主创确认 |
| P1 | 两条 Shutdown 是否应增加 SAN | **设计未确认**：现状均不增加，本轮未修改，保持待主创决定 |
| P1 | Gym 历史次数被误当 `COUNT_GAME_OVER` | 回归确认使用 `Work__Gym.Game_Over` Stitch 读计数，首次／重复显示 1／2 次；不得替换 |
| P1 | 初始导航、OK／BAD 休息条件 | 直接路径与回归通过；完整自然通关未运行 |
| P2 | 菜单中的 `【DEV】` 文本 | 当前由块注释隐藏；是否保留由主创决定 |
| P2 | Dream7 未进入随机池 | 设计待确认，不擅自更改 |
| P2 | No.8 现实结局仍是短草稿 | 主创审阅并扩写 |
| P2 | 回归仅覆盖 InkJS 运行时 | 未运行 Inky GUI、inklecate、宿主 `#RESTART`；测试含 direct path／状态注入 |
| P3 | 历史命名不完全统一 | 不阻塞验证；后续渐进处理 |

## 4. 每个实现 PR 的验收格式

PR 描述至少包括：

1. **目标：** 解决哪一条风险，明确不解决什么。
2. **变更：** 文件与状态行为的前后差异。
3. **测试：** Ink 版本、编译命令、测试路径与实际结果。
4. **回归：** 首次启动、首次／重复路线、OK／BAD 休息、强制闯入、DRONE、No.8 最终顺序。
5. **剩余问题：** 未测试内容和需要主创决定的设定。
6. **文档：** 本次是否同步更新故事图、变量约定或测试清单。

**最终验收原则：** 先证明工程可编译，再证明关键分支可达，再确认剧情语义。目录整洁和变量命名统一不能代替可运行的故事。

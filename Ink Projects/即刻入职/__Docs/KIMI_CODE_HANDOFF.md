# 《即刻入职》KIMI CODE 重构交接

- 交接日期：2026-10-28
- 工程目录：`Ink Projects/即刻入职/`
- 后续执行：KIMI CODE
- 当前阶段：Phase 1 的静态审查与运行时回归已完成技术计数项；后续 Phase 0 补测已完成两款 inklecate 交叉编译、29 项 smoke 与完整自然通关（历史记录，见 `PHASE0_VALIDATION.md`；脚本已删除、当前不可复跑）。架构评估已于 2026-10-28 完成：保留现有模块边界，不做大规模重构；`tools/phase0_smoke.cjs` 已按主创要求删除，`__Tests/` 的 11 项是当前唯一可复跑入口。两条 Shutdown 的 SAN 设计仍待主创确认，Inky GUI 实机回归、宿主 `#RESTART` 与作者验收尚未进行。

## 一、开始工作前

先阅读本目录中的：

1. `REFACTOR_PLAN.md`：阶段计划、Phase 0／Phase 1 实测记录与剩余风险。
2. `STORY_FLOW.md`：源码流程、故事约束和状态判定。
3. `INK_STYLE_GUIDE.md`：目录、变量、Knot／Stitch 与 Ink 排版约定。

Ink 源码是实现事实来源，主创确认是叙事意图来源。两者不一致时先记录并询问，不把 AI 推测写成设定。

开始修改前先运行 `git status --short` 和 `git branch --show-current`。仓库可能已有其他任务的未提交修改，不能覆盖、还原或顺手提交。

工作流程（2026-10-28 更新）：可按主创偏好在 `main` 直接修改，不再强制独立分支；提交和推送仍只在主创明确要求时执行，不自行 commit／push。文档中也不要自行声称已提交或已推送。

## 二、已经实际验证的内容

### Phase 0 记录（2026-10-28，临时工具已清理）

2026-10-28 使用 Node v24.22.1、InkJS 2.4.0 编译 `Ink Projects/即刻入职/即刻入职.ink`：

- 47 个 INCLUDE 均解析成功。
- 编译结果为 0 错误、0 警告。
- 未发现需要最小修复的语法、缺失目标或重复定义，因此该轮没有修改任何 `.ink` 文件。
- 18 项直接路径与状态注入 smoke 测试全部通过。

通过项包括：

- 新游戏启动、邀请函、首次导航仅有面试与上班。
- FINE 的健身可见性；OK／BAD 的居家休息可见性。
- 九条路线各自的首次／重复结算，路线计数与 `COUNT_GAME_OVER` 每次恰好增加一次。
- 普通路线首次 +10、重复 +5；两条 Shutdown 当前不增加 `SAN_SCORE`（仅为现状记录，设计尚未确认）。
- BAD 缺工作／缺面试时分别强制 WORK／BREAK，随后进入 DRONE；OK 缺健身时强制 WORK。
- AWFUL 特殊居家选项、九路线完成后的 No.8 优先级。
- “空白和解 → 现实 No.8”顺序，无额外普通醒来。
- `ResetState()` 恢复全部初始全局状态。

**Phase 0 验证边界：** 这些结果不等于完整自然通关。Phase 0 结束时临时测试目录与依赖已经清理（历史事实）；当时未执行完整自然通关、Inky GUI 实机回归或 inklecate 交叉验证。

此前 Phase 0 尝试通过 DeepSeek Harness 委派审查，但因缺少 API Key 失败；该次调用未成功，DeepSeek 实际修改为零。Phase 1 的测试与文档由默认编码子代理 DS FLASH 实际编写，KIMI CODE 负责审阅并独立复跑。

### Phase 1 回归（2026-10-28，仓库内 `__Tests/`）

本轮没有修改任何 `.ink` 文件；静态审查与运行时回归均未发现需要最小补丁的计数缺陷。测试已在 `__Tests/` 建立为可复用入口，固定 `inkjs@2.4.0`；实测环境为 Node v24.13.1、npm 11.8.0。

标准复跑（在 `__Tests/` 目录下）：

```bash
npm ci --no-audit --no-fund
npm test
```

`npm test` 先执行 `node compile.cjs`（47 条 INCLUDE 相对解析、错误／警告计数，失败退出非零），再执行 `node regression.cjs`。实测：47/47 INCLUDE，0 错误、0 警告；11 tests / 11 pass / 0 fail。

11 项覆盖：

1. 编译：47 条 INCLUDE、0 错误、0 警告。
2. 初始全局值与首次自然启动：`SAN_SCORE` 从哨兵 `-1` 到邀请函后 `0`；首日导航只有面试／上班。
3. 九条路线首次与重复结算：对应路线计数、`COUNT_GAME_OVER`、SAN 增量。
4. Gym 跨路线顺序：「首次 → 回顾 Gym 结局 → 重复」，显示至少 1／2 次且全局计数不混淆。
5. `Business_Trip`／`Napping` 的 Choice 预览与取消不增加路线或结局计数。
6. `Ending__Route_Gallery` 预览与九条结局回顾不改变 SAN、`COUNT_GAME_OVER`、九条路线计数。
7. 强制 WORK／强制 BREAK：复用 Shutdown 结算，随后 DRONE。
8. 普通环境进入标题；`Menu__Game_Over → 标题` 往返不增加路线计数。
9. 分隔线第 5／6 次边界、`UNLOCKED_NO8_DATABASE` 用途与隐藏入口。
10. 全路线注入下的 No.8：最终和解 → 现实 No.8，`COUNT_GAME_OVER = 9` 时显示「前8次」，无额外普通醒来。
11. `ResetState()` 恢复全局初始值并重置 Gym Stitch 访问计数。

已确认的计数语义：

- `SAN_SCORE = -1` 是首次启动哨兵，首次邀请函由 `Flow__Navigator.KKL_Letter` 增至 `0`；数值越高状态越差。七条非 Shutdown 路线首次 +10、重复 +5；两条 Shutdown 当前均不增加 SAN，**是否最终设计仍待主创决定，本轮未修改**。
- `COUNT_ROUTE_*` 是每条路线的实际进入次数。`Business_Trip`／`Napping` 只在真正进入 `Flow` 时计数，Choice 预览与取消不计数；其余路线在路线 Knot 入口计数。菜单预览、结局回顾、`Menu__Game_Over` 与标题往返均不增加。
- `COUNT_GAME_OVER` 是九条路线已完成结算的全局总次数，也是主菜单「重新连接：第 N 次」的序号；它不是唯一路线数，也不是 Gym 的 Stitch 读计数。每条路线每次结算恰好 +1。
- Gym 的 `Game_Over + 1` 是 `Work__Gym.Game_Over` Stitch 的历史访问次数加当前一次；AZ 文本在本次结算之前，因此首次／重复自然 Gym 显示「至少 1／2 次」。跨路线与结局回顾不会多算；不应替换为 `COUNT_GAME_OVER + 1`。InkJS `ResetState()` 已验证会重置该访问计数。
- 分隔线前 5 次只增加 `COUNT_MENU_SEPARATOR`；第 6 次会写九条路线计数为 1 并置 `UNLOCKED_NO8_DATABASE = true`，但不增加 `COUNT_GAME_OVER` 或 SAN，也不是自然通关。`UNLOCKED_NO8_DATABASE` 的实际用途是隐藏初始化／重新连接入口，保留。注意：第 6 次点击确实会写路线计数；不要把「变量分离」误写成「隐藏入口完全不写路线计数」。

**Phase 1 验证边界：** 回归包含 direct path（`ChoosePathString`）与变量注入，不等于完整自然通关。未运行 Inky GUI、inklecate 或宿主 `#RESTART` 实机行为。全路线 No.8 与 `COUNT_GAME_OVER = 9` 显示「前8次」仅为现状状态注入验证；最终醒来次数的语义仍按 Phase 3 待核对，不能据此声称完整自然终局已验证。

### 当前可复跑范围（2026-10-28 补注）

- `tools/phase0_smoke.cjs` 已按主创要求删除，`tools/` 不再作为第二套测试轨道；**不要恢复该脚本，也不要恢复旧 `docs/` 目录**。
- 删除脚本只影响复跑：历史的两款 inklecate 编译、29 项 smoke、纯点击九路线完整自然通关都是真实执行记录，仍然有效，详见 `PHASE0_VALIDATION.md`；但 29 项 smoke 与自然通关**现在不能复跑**。
- `__Tests/` 的 11 项是当前唯一可复跑测试入口（本轮复核：47/47 INCLUDE，0 错误、0 警告，11 tests / 11 pass）。这 11 项**不覆盖**纯点击九路线自然通关，不能写成“完整自然通关已复验”。
- 若未来需要自动验证自然通关，在 `__Tests/` 内新增纯点选驱动测试；不要用旧脚本复活第二套入口。

## 三、不可破坏的约束

1. 故事发生在洛书已被 AZ 抓住之后；反复醒来首先发生于精神空间。
2. 开局有黑川物流市场部面试邀请函，首次导航只有面试与上班。
3. `SAN_SCORE` 初始为 -1，是首次启动哨兵；首次打开邀请函后变为 0。数值越高状态越差，不要按名称自行反转含义。
4. 普通路线首次 +10、重复 +5；两条 Shutdown 是否增加精神数值仍需主创确认，不得机械补齐。
5. FINE 才出现健身；OK 与 BAD 都允许居家休息。
6. 强制闯入后，环境检测应进入 DRONE 的世界内故障／乱码页面。
7. 全部路线完成后，必须先进入空白空间最终和解，再进入现实 No.8；中间及之后不得插入普通精神空间醒来。
8. 保留 Ink 引擎、剧情原文与特殊乱码表现。未经主创确认，不扩写剧情、不把 TODO 草稿视为定稿。
9. 不做大规模变量／Knot／Stitch 改名，不添加数字目录前缀，不修改“黑川物流”Obsidian 知识库。

## 四、Phase 1 结果与下一步

Phase 1 的静态审查与运行时回归已完成技术计数项（设计项仍待主创确认）；一次只解决一个可以验证的问题，本轮未修改源码。

1. [x] `SAN_SCORE`、`COUNT_GAME_OVER`、`COUNT_ROUTE_*` 的语义及赋值时机：已由 `__Tests/` 回归逐条确认，详见第二节。
2. [x] `Routes/Work/Gym.ink` 中 `Game_Over + 1` 是 `Work__Gym.Game_Over` Stitch 的历史访问次数加当前一次；它不是 `COUNT_GAME_OVER`，不应替换。首次／重复自然 Gym 显示至少 1／2 次。
3. [x] 路线计数在菜单预览、结局回顾、`Menu__Game_Over`／标题往返和强制路径中不会重复增加；强制 WORK／BREAK 复用 Shutdown 结算，路线与 `COUNT_GAME_OVER` 各 +1，SAN 不变，随后 DRONE。
4. [ ] 两条 Shutdown 不增加 `SAN_SCORE` 是否为最终设计：本轮只确认现状并写入回归，**未修改源码，仍待主创确认**。
5. [x] `COUNT_MENU_SEPARATOR` 的隐藏入口与自然路线统计相互独立：前 5 次只增加该计数；第 6 次写九条路线计数并置 `UNLOCKED_NO8_DATABASE = true`，不增加 `COUNT_GAME_OVER`／SAN。
6. [x] `UNLOCKED_NO8_DATABASE` 的实际用途是隐藏初始化／重新连接入口；保留，不删除。
7. [x] 已为确认的计数边界建立可复用测试；本轮无需最小补丁。

下一步仍待完成：

- 架构层面：按 2026-10-28 评估结论继续使用现有模块边界，不做大规模重构或批量改名；小步技术债见 `REFACTOR_PLAN.md` 第 1.1 节。
- Inky GUI 实机回归、宿主 `#RESTART` 行为与作者验收。
- 若需要重新自动验证纯点击九路线自然通关：在 `__Tests/` 新增纯点选驱动。该通关历史上已完成一次，记录在 `PHASE0_VALIDATION.md`，但执行脚本已删除，**不可复跑**。
- inklecate 交叉验证已完成（历史结果）；后续改动源码时，可按 `PHASE0_VALIDATION.md` 第 1 节命令重新执行两款编译器。
- Phase 2 的选项可见性矩阵与强制闯入状态组合穷举。
- Phase 3 的最终和解／现实苏醒次数语义；当前状态注入与历史自然通关均已验证 No.8 与「前8次」，但 awake-count 的叙事含义仍待主创确认。
- Phase 1 设计项（两条 Shutdown 的 SAN）与作者验收。

后续仍待确认：Dream7 不进入随机池是否为设计、DEV 文本是否保留当前块注释处理、`Endings/No8_Reality.ink` 的 TODO／AI 草稿由主创审阅。

## 五、验收与汇报

每个改动至少做到：

- 编译入口文件，报告编译器与版本、命令、错误和警告。
- 对受影响路径运行 `__Tests` 回归（`npm ci --no-audit --no-fund && npm test`），保留首次／重复、强制闯入、DRONE、终局与重置检查。
- 区分实际运行、静态审查和未运行项目；不得把状态注入测试写成完整自然通关，也不得把历史自然通关写成“当前已复跑”。
- 汇报修改文件、行为变化、真实测试结果、未验证边界和待主创决定事项。
- 同步更新 `__Docs` 中受影响文档；不恢复旧的 `docs/` 双轨目录，也不恢复 `tools/phase0_smoke.cjs`。

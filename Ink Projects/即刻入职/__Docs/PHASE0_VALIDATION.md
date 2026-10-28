# 《即刻入职》Phase 0 交叉验证记录（历史）

- 日期：2026-10-28
- 来源：`codex/ink-phase0-validation` 工作树的实际执行记录，在移除该工作树前移植至 `kimi/Ink`。
- 范围：inklecate 交叉编译、InkJS 运行时 smoke、完整自然通关与 Credits 结局验证（均为历史执行结果）；不代表 Inky GUI 实机回归或主创验收已完成。

> **历史记录说明（2026-10-28 补注）**
>
> - 本文第 2 节的 29 项 smoke 由 `tools/phase0_smoke.cjs` 执行。该脚本已**按主创要求删除**，`tools/` 不再作为第二套测试轨道，也不应恢复该脚本或旧 `docs/` 目录；文中保留的命令只说明当时的执行方式，**当前仓库已不能复跑**。
> - 本文的 29 项 smoke、两款 inklecate 交叉编译与纯点击九路线完整自然通关都是**当时的实际执行结果**，不因脚本删除而失效；删除脚本只影响复跑方式，不影响历史结论。
> - 当前仓库唯一可复跑的测试入口是 `__Tests/`（`inkjs@2.4.0`，11 项）。这 11 项**不覆盖**本文记录的纯点击九路线自然通关，因此“11 项全绿”不等于“完整自然通关已复验”。两者必须分开表述。

## 1. 环境与编译

- 环境：macOS arm64；Node v24.13.1；InkJS 2.2.3；Inky 0.15.2；inklecate 1.2.1。
- 编译器：Inky 与 Inky Enhanced Edition 随附的 `main-process/ink/inklecate_mac`。两款编译器对同一输入的产物一致。
- 基线快照：`git archive HEAD`，HEAD 为 `f96c366b8b4496134c7da9e5a63a82e5f99f56a9`，不包含当时尚未提交的 Credits 修复。
- 编译命令（`-c` 必须保留，visit 计数断言依赖它）：

  ```bash
  /Applications/Inky.app/Contents/Resources/app.asar.unpacked/main-process/ink/inklecate_mac \
    -c -j -o /tmp/kurokawa-phase0-rework/current.json \
    "Ink Projects/即刻入职/即刻入职.ink"
  ```

- 两款编译器均 exit 0，`{"compile-success":true}`、`{"issues":[]}`，产物 `inkVersion` 为 21。
- 未修改基线 `baseline.json` 的 SHA-256：`ff12bf57c5d1ad6ea0b0f56f207820ef957a8505617d4becca38e09465cb4630`。
- Credits 修复后的 `current.json` 的 SHA-256：`223dc9c4275b7d622ae4195a631a1e8d9388ec00a65e4dacb9ed1f78db455f84`。
- 基线的跨编译器产物相同；Credits 修复会改变编译产物，不能用修复前旧记录描述修复后产物。

## 2. Smoke 回归

> **脚本已删除，以下命令不能复跑。** 本节保留它只为说明 29 项结果当时如何产生。

历史执行方式（`tools/phase0_smoke.cjs`，已于 2026-10-28 按主创要求删除）：

```bash
# 历史命令，仅作记录；当前仓库中该路径不存在
INKJS_MODULE="/absolute/path/to/inkjs" \
  node "Ink Projects/即刻入职/tools/phase0_smoke.cjs" \
  /path/to/current.json
```

- 修复后：29 passed / 0 failed，exit 0。
- 未修改基线：26 passed / 3 failed，exit 1。三条通关后进入 Credits 的路径均以 `RUNTIME ERROR: ran out of content. Do you need a '-> DONE' or '-> END'?` 失败；未通关时 Credits→回标题的对照用例通过。
- 覆盖新游戏、市场部邀请函、首次导航仅面试／上班，以及自然面试→GAME OVER→重连。
- 七条普通路线首次 +10／重复 +5，且每次恰好一个 `COUNT_GAME_OVER`；两个 Shutdown 不增加精神数值是既有行为，仍待主创确认。直接进入节点并注入状态的用例均标为 `[direct,state-injected]`。
- 覆盖 FINE 健身、OK／BAD 休息，以及强制 WORK／BREAK 从正常主菜单进入 `Dream__Router.Check`，再经 Shutdown→DRONE；以 `VisitCountAtPathString` 证明 Dream1–Dream7 均未访问。
- 自然全九路线采用纯点选，无 `ChoosePathString`、无变量注入；顺序为健身→下班→面试→出差→小憩→居家休息→电影→办公室 Shutdown→居家 Shutdown。SAN 依次为 `10/20/30/40/50/60/70/70/70`，`COUNT_GAME_OVER` 为 1–9；最后一次断连后第 9 次重连→和解→现实→制作人员正常 END。**此项为历史结果，当前 `__Tests/` 的 11 项不含纯点选自然通关。**
- 终局 visit 增量：正常通关 `Ending__Final_Reconciliation = 1`、`Ending__No8_Reality = 1`；`Flow__Startup`、`Flow__Navigator`、`Dream1`–`Dream7` 均为 0。已进入和解状态直接到现实时 `Final = 0`、`Reality = 1`。
- 未通关 Credits→回标题的对照用例通过；`ResetState` 与结局回顾无计数副作用。
- 循环保护使用 `ContinueAsync(10)` 分片推进，完成一行才读取 `currentText`；每个场景有 5 秒总预算和最多 500 行限制。

## 3. Credits 根因与修复

修复前源码为“条件 choice + 末尾列 0 的 `-> END`”。Ink 把该 `-> END` 解析进 choice 分支；`HAS_ENTERED_FINAL_RECONCILIATION = true` 时条件 choice 不生成，流程在制作人员正文后耗尽内容并报 `ran out of content`。

候选工作树在条件 choice 之前加入显式 `{HAS_ENTERED_FINAL_RECONCILIATION == true: -> END}`，false 时仍显示“回到标题”，未改文本、变量或剧情设定。该修复现已移植到 `kimi/Ink`；同一 smoke 的三条失败路径在修复后均正常 END。

## 4. 与迁移前对比

对比 PR #3 第一父提交 `c672c60`：

- 变量／Knot 重命名本身不改变剧情，包括 `INDEX`→`SAN_SCORE`、`Flag__*`→`COUNT_ROUTE_*`、`Count__Game_Over`→`COUNT_GAME_OVER` 等。
- 启动优先级从旧稿“先随机梦境、再由 Wakeup 判断”改为 `Dream__Router.Check`／`Flow__Startup.Check` 的显式顺序：DRONE → No.8 和解／现实 → 强制闯入 → FINE／梦境；终局不再由 `Base__Wakeup` 无条件进入。
- 最终和解独立设置 `HAS_ENTERED_FINAL_RECONCILIATION`，并直接接 `Ending__No8_Reality`；旧稿在 Wakeup 末尾以“感谢游玩”占位。
- `Break__Home` 从仅 BAD 放宽为 OK／BAD，对应“OK 与 BAD 都可考虑休息”。
- 强制闯入集中到 `Get__Forced_Intrusion()`，原有条件优先级保持不变。

## 5. 已知风险与未完成项

- Gym 的 `Game_Over_Plus` 读取同文件 `= Game_Over` Stitch 的局部访问计数，不是 `COUNT_GAME_OVER`；`COUNT_GAME_OVER = 3` 时显示 1。数字的叙事含义留待确认。
- 已删除测试中的“前 8 次”设计断言；`PREVIOUS_WAKEUPS = COUNT_GAME_OVER - 1` 的显示语义仍需核对，不把当前快照当作正确设计。
- Shutdown 不增加 `SAN_SCORE` 是既有行为，待主创确认。
- Dream7 仍未进入 `Dream__Router.Shuffle` 池；本次未改动。
- `Endings/No8_Reality.ink` 仍有作者 TODO／草稿段落，本次未改。
- `ResetState` 用例只证明引擎层重置，未测试图形界面或 `#RESTART` 宿主。
- 未在 Inky／InkShell 图形界面执行；自然全路线与终局证据来自 inklecate `-c` + InkJS 运行时，作者验收尚未进行。

## 6. 当前复跑边界（2026-10-28）

| 验证层次 | 结果 | 现在能否复跑 |
| --- | --- | --- |
| 两款 inklecate 交叉编译 | 通过（历史） | 可重编译当前源码，按第 1 节命令手工执行；历史产物哈希需同一基线快照 |
| Phase 0 的 18 项 smoke | 通过（历史） | 否，临时 `.phase0-tools/` 已清理 |
| 29 项 smoke（含纯点击自然通关） | 通过（历史） | **否**，`tools/phase0_smoke.cjs` 已删除 |
| `__Tests/` 11 项回归 | 通过 | **是**，当前唯一测试入口 |

- 当前标准复跑命令（在 `__Tests/` 下）：`npm ci --no-audit --no-fund && npm test`，固定 `inkjs@2.4.0`。
- 该 11 项包含 `ChoosePathString` 与变量注入，覆盖编译、计数、强制闯入、No.8 状态注入与 `ResetState`；它不驱动完整九路线自然通关，也不替代 Inky GUI 与作者验收。
- 若将来需要重新自动验证自然通关，应新写纯点选驱动测试并纳入 `__Tests/`，而不是恢复 `tools/phase0_smoke.cjs`。

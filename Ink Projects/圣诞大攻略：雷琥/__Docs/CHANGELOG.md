# 文档变更记录

所有日期使用 YYYY-MM-DD。这里记录维护文档的变化，不替代 Git 提交历史。

## 2026-10-27

- 新建 `__Docs/` 文档目录。
- 新增故事线与结局目录，整理入口文件、场景文件、变量文件和 F1–F11 的分流关系。
- 新增 Ink 脚本维护规范，记录变量、分支、跨文件引用与结局登记的建议约定。
- 新增逻辑审查记录，登记源码初审发现，并根据作者澄清区分真正的逻辑问题与有意的叙事设计。
- 新增回归测试清单，列出编译、路线、隐藏结局、多周目解锁、结局统计与 UI 文案测试。
- 根据作者确认的设计意图新增 `REFACTOR_PLAN.md`，并同步更新逻辑审查、故事线和回归测试文档。
- 实现 A-02/A-07：在 `Z_VAR.ink` 增加 F1–F11 正片结局达成标记；`CountFinale` 与 `FinaleList` 改用这些标记；结局回顾和开发者菜单的预览入口启用 `IsPreviewMode`，不再把预览当作正式达成。
- 将 F9/F10 的隐藏路线条件改为正片达成 F2/F7；同步 F8 正文分类为“一般结局”。
- 尚未运行 Ink 编译器或完整交互测试；宿舍线 A-01 的条件重写仍在重构计划中。

## 2026-10-28

- 确认上一轮结局状态源码修改已直接位于 `main`，源码基线提交为 `c672c60798eb7d81da701de94a3329a90da8da47`；没有需要重复合并的独立 PR。
- 新增 `HANDOFF_DEEPSEEK.md`，交代当前实现状态、作者确认的 A-01 至 A-07 设计边界、待办任务、测试矩阵、分支策略与 ChatGPT 审核要求。
- 更新 `README.md` 与 `REFACTOR_PLAN.md`，明确后续实现应在 Work 模式的独立分支完成，审核通过后再合并到 `main`。
- 本次只整理维护/交接文档，没有继续修改游戏源码。Ink 编译与完整交互测试仍未执行。
- 在独立分支 `kimi/leihu-a01-ending-review` 引入真实 Ink 回归运行器，使用 Inky 0.15.2 的 native 1.2.1 与 inkjs-compatible 编译器，以及真实 inkjs 2.2.3；修改前基线为两套环境各 18/18 通过。
- 实施 A-01：宿舍线改用 `Choose_X > 0` 显式资格，保留好感度分界与全零默认 F7，并增加 `RouteDecision` 测试锚点；没有修改剧情正文、选项或数值增减。
- 新增 A-01 的 16 组注入矩阵。修改后两套环境均编译成功、各 18/19 通过；唯一失败为候选优先级导致正常 F7 不可达，阻断正片 F10 回归。
- A-02/A-05/A-07 相关自动回归通过；实际宿主 RESTART 按钮与完整图形界面游玩未验证。多角色优先级和 F7/F10 可达性仍待作者确认，分支不合并。
- 将旧 `HANDOFF_DEEPSEEK.md` 替换为 `HANDOFF_KIMI_CODE.md`，记录当前未提交状态、唯一失败测试与 KIMI CODE 后续任务；同步文档索引和引用。

## 2026-10-29

- 作者确认：本轮按 `__Docs/__RAW.txt`（RAW 原稿）的逻辑实现，“好感度 + 大体偏向”取代上一轮临时的 `Choose_X > 0`／夜痕 → 岑烨 → 雷琥固定优先级。A-02 至 A-07 维持不变，剧情正文与选项不变。
- `G_Dormitory.ink`：开场“夜痕的事”保持 `Choose_YeHen++`、好感不变；“岑烨的事”改为 `Choose_CenYe++` 并删除此处 `Rate_LeiHu++`；“雷琥的事”保留 `Rate_LeiHu++`，新增 `Choose_LeiHu++` 与当前周目状态 `Dormitory_LeiHu_Direct = true`。招呼与午后活动的增减未改动。
- `G_Dormitory.ink`（RAW 逐项复核补漏）：“会不会累？”分支按 RAW 357“选择B后（好感提升）”补 `Rate_LeiHu++`，与“工资高吗？”一致；两条三级分支的基础好感都为 3。
- `Z_VAR.ink`：新增 `Dormitory_LeiHu_Direct = false`，并在 `CleanData` 重置；它不是正式结局记录，不跨普通周目保留。
- `G_Dormitory.RouteDecision`：`Rate_LeiHu >= 3` 仍进 F8；低好感时 `Dormitory_LeiHu_Direct` 直接进 F7，否则按唯一最高 `Choose_*` 分流（Y→F5、C→F6、L→F7），平局与全零保留默认 F7。全部使用明确数值比较，未恢复 `(Choose_X or Choose_Y)` 隐式布尔写法；锚点保留。
- `H_Tenement.ink`：按 RAW 补回两处好感——“自己动手”与浴室门口“帮他整理好叠在门口”各 `Rate_LeiHu++`；其余数值（含“看你热成那样”+1、午后正事 +2）未改动，RAW 未给出精确增量的加分点不另行发明。
- `__Tests/regression.cjs`：A-01 注入矩阵扩为 2 种好感 × 8 种计数 × Direct 真/假共 32 组；正常 F8/F9/F10 路径改用雷琥开场（`first=2, activity=2`）；新增岑烨／雷琥开场、Direct 重置、出租屋两处加分以及追问两个三级分支（1 → 2 → 3）的逐步断言；45 条正常路径枚举的分布断言更新为 F5=6、F6=6、F7=12、F8=21。测试总数仍为 19，未删除、跳过或放宽任何正常 F7/F10 断言。
- 实测结果：`node --check` 通过；`python3 __Tests/run-regression.py` 在 native 1.2.1 与 inkjs-compatible 两套编译器输出上均为 19/19，正常 `F2 → F7 → F10` 不再注入变量即可通过；45 条正常路径的实测分布为 F5=6、F6=6、F7=12、F8=21。
- 同步更新 `HANDOFF_KIMI_CODE.md`、`LOGIC_AUDIT.md`、`REFACTOR_PLAN.md`、`STORY_FLOW_AND_ENDINGS.md`、`TEST_CHECKLIST.md` 与 `README.md` 中的当前状态；上一轮的“候选优先级／F7 不可达／18/19”记录明确标为历史。

# 《即刻入职》开发文档

- **当前状态：** 目录与命名迁移已合并到 `main`（[PR #3](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/pull/3)，merge commit [`728b84c2`](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/commit/728b84c201693db1a4774e2ee4402873914eb4e1)）。2026-10-28 的架构评估结论：现有 `Core/Systems/Flow/Routes/Dreams/Endings/UI` 模块边界与 `__Docs`／`__Tests` 分离继续保留，当前不需要再次大规模重构或批量改名；路线结算重复与历史命名只作为后续小步技术债处理（见 [REFACTOR_PLAN.md](REFACTOR_PLAN.md) 第 1.1 节）。
- **测试入口：** `__Tests/` 是当前**唯一可复跑**的测试入口（`inkjs@2.4.0`，12 项；在 `__Tests/` 下执行 `npm ci --no-audit --no-fund && npm test`）。包含原有 11 项状态／计数回归及新增的纯点击九路线自然通关。原 `tools/phase0_smoke.cjs` 已按主创要求删除，不恢复第二套测试轨道。
- **验证边界：** 当前摘要版已通过 12 项回归，包括种子 `1/7/42` 从标题到九路线、最终和解、现实 No.8、制作人员及通关后回顾的自然流程；这不代表所有分支无 BUG，已知问题见下。历史 Phase 0 的 18／29 项 smoke、两款 inklecate 与自然通关结果仍见 [PHASE0_VALIDATION.md](PHASE0_VALIDATION.md)，旧 29 项脚本仍不可复跑。Inky GUI 实机回归、宿主 `#RESTART` 与作者验收仍未完成；两条 Shutdown 的 SAN、Dream7、No.8 TODO 等设计事项仍然有效。
- **文档位置：** 当前统一使用 `__Docs/`；不再维护 `docs/` 双轨副本。
- **后续执行：** 重构工作由 KIMI CODE 接手与审阅；后续如新增自然通关验证，应纳入 `__Tests/`，不恢复已删除的 `tools/` 脚本。

## 正文摘要验证模式（2026-11-09）

当前 `.ink` 源码使用摘要显示，供快速点选验证：127 段阅读正文保留在原位置的 Ink 原生 `/* … */` 注释中，紧接一条约十几字的 `【摘要】`。直接编辑注释内的原文即可继续创作，不需要维护第二份小说；恢复某段正文时移除包裹它的注释，并删除对应摘要。

- 选择标签、条件、变量、路线计数、跳转、gather 层级及 `# CLEAR`／`# RESTART`／`# IMAGE` 等标签保留。选项本身仍显示原文字样，以便核对可见性和选择结果。
- 次数表达式保留在摘要中；餐点 shuffle 和分隔线 sequence 保留类型、顺序和分项数，仅将输出文字缩短，避免改变随机抽取与序列推进。
- 不使用 HTML 的 `<!-- … -->` 隐藏 Ink 正文；它不是 Ink 编译期注释，不能确保原文和内联表达式停止执行。
- 本轮只改变显示文本，不修复既有逻辑问题：Dream4 的“点菜”与行动选项混排及点选后停止、更新日志两页之间无法返回标题，仍保留供后续定位。`Drone` 重置选择后的残留 `w` 也未修改。
- 标题、制作人员、日志与故障页正文同样摘要化；图片标签保留，因此宿主仍可能显示原图。

## 文档入口

1. [KIMI_CODE_HANDOFF.md](KIMI_CODE_HANDOFF.md)：KIMI CODE 的执行交接、Phase 0／Phase 1 真实验证结果、边界和下一步。
2. [REFACTOR_PLAN.md](REFACTOR_PLAN.md)：架构评估结论、分阶段重构计划、优先级、每阶段验收标准。
3. [PHASE0_VALIDATION.md](PHASE0_VALIDATION.md)：历史 inklecate 交叉编译、29 项 smoke、完整自然通关与 Credits 修复记录；文首标明脚本已删除、命令不可复跑。
4. [STORY_FLOW.md](STORY_FLOW.md)：故事设计约束与当前源码流程图；明确区分设计目标和已实现行为。
5. [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)：当前命名规律、推荐变量与 Knot 写法、注释约定、Ink 排版约定。

## 当前目录职责

| 目录／文件 | 角色 |
| --- | --- |
| `即刻入职.ink` | 集中 INCLUDE 与运行入口 |
| `Core/Variables.ink` | 全局状态变量 |
| `Systems/` | 精神状态、身份状态、强制闯入、环境检查 |
| `Flow/` | 启动、导航、行动选择 |
| `Routes/Work/`、`Routes/Break/` | 工作／请假事件与结算 |
| `Dreams/` | 梦境路由与梦境正文 |
| `Endings/Routes/` | 普通路线结局正文 |
| `Endings/Final_Reconciliation.ink` | 空白空间中的最终和解 |
| `Endings/No8_Reality.ink` | 和解后的现实苏醒与 No.8 结局 |
| `Endings/Route_Gallery.ink` | 路线回顾 |
| `UI/` | 标题、菜单、日志、异常页、制作人员 |
| `Dev/` | 调试／开发兜底，不应默认接入正式流程；`TEST`／`Legacy` 不进入正式入口 |
| `__Tests/` | 当前唯一可复跑的编译与回归入口（`inkjs@2.4.0`，CommonJS） |

## 维护约定

- **运行时源码是实现事实来源，主创设定是叙事意图来源。** 两者不一致时，先记录差异，不要由实现者自行决定剧情含义。
- 改路线门槛、精神状态、计数或终局顺序时，同次提交必须更新故事图和测试记录。
- 复跑测试：在 `__Tests/` 下执行 `npm ci --no-audit --no-fund && npm test`；该命令先编译再跑回归。这是当前唯一可复跑的测试入口。
- 新增代码遵循 `INK_STYLE_GUIDE.md`；旧变量与 Knot 不做无测试的大规模批量改名。
- 工作流程：可按主创偏好在 `main` 直接修改；提交和推送仍只在明确要求时执行，不自行 commit／push。
- 涉及源码或测试的改动，说明编译器版本、测试命令、实际结果和未验证项。区分状态注入与从入口纯点选自然通关；后者注明实际运行的种子、路线顺序与通过范围，不能据单一路径宣称所有分支无 BUG。历史结论引用 `PHASE0_VALIDATION.md`，并注明其脚本已删除。
- 需要新的自然通关自动化时，在 `__Tests/` 内新增纯点选驱动测试；不要恢复 `tools/phase0_smoke.cjs` 或旧的 `docs/` 目录。
- 不修改“黑川物流”Obsidian 知识库；本工程只负责 Ink 项目与其文档。

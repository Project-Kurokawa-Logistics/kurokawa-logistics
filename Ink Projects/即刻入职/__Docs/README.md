# 《即刻入职》开发文档

- **当前状态：** 目录与命名迁移已合并到 `main`（[PR #3](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/pull/3)，merge commit [`728b84c2`](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/commit/728b84c201693db1a4774e2ee4402873914eb4e1)）。
- **验证边界：** 2026-10-28 已使用 InkJS 2.4.0 编译入口文件，0 错误、0 警告；Phase 0 的 18 项 smoke 与 Phase 1 在 `__Tests/` 建立的 11 项可复用回归均全部通过。后续 Phase 0 补测已完成两款 inklecate 交叉编译、29 项 smoke 与完整自然通关；Inky GUI 实机回归和作者验收仍未运行，文档中仍未确认的设计事项（如两条 Shutdown 的 SAN）仍然有效。
- **文档位置：** 当前统一使用 `__Docs/`；不再维护 `docs/` 双轨副本。
- **后续执行：** 重构工作由 KIMI CODE 接手与审阅；本轮测试与文档由默认编码子代理 DS FLASH 实际编写。

## 文档入口

1. [KIMI_CODE_HANDOFF.md](KIMI_CODE_HANDOFF.md)：KIMI CODE 的执行交接、Phase 0／Phase 1 真实验证结果、边界和下一步。
2. [REFACTOR_PLAN.md](REFACTOR_PLAN.md)：分阶段重构计划、优先级、每阶段验收标准。
3. [PHASE0_VALIDATION.md](PHASE0_VALIDATION.md)：后续 inklecate 交叉编译、29 项 smoke、完整自然通关与 Credits 修复记录。
4. [STORY_FLOW.md](STORY_FLOW.md)：故事设计约束与当前源码流程图；明确区分设计目标和已实现行为。
5. [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)：当前命名规律、推荐变量与 Knot 写法、Ink 排版约定。

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
| `Dev/` | 调试／开发兜底，不应默认接入正式流程 |
| `__Tests/` | 可复用的最小编译与回归入口（`inkjs@2.4.0`，CommonJS） |

## 维护约定

- **运行时源码是实现事实来源，主创设定是叙事意图来源。** 两者不一致时，先记录差异，不要由实现者自行决定剧情含义。
- 改路线门槛、精神状态、计数或终局顺序时，同次提交必须更新故事图和测试记录。
- 复跑测试：在 `__Tests/` 下执行 `npm ci --no-audit --no-fund && npm test`；该命令先编译再跑回归。
- 新增代码遵循 `INK_STYLE_GUIDE.md`；旧变量与 Knot 不做无测试的大规模批量改名。
- 所有源码修改在独立分支进行；PR 中说明编译器版本、测试命令、实际结果和未验证项。
- 不修改“黑川物流”Obsidian 知识库；本工程只负责 Ink 项目与其文档。

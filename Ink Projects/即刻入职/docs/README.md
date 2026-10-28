# 《即刻入职》开发文档

- **当前状态：** 目录与命名迁移已合并到 `main`（[PR #3](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/pull/3)，merge commit [`728b84c2`](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/commit/728b84c201693db1a4774e2ee4402873914eb4e1)）。
- **验证边界：** 目前没有确认 Ink 编译或完整实机回归通过；文档中标注的待核查事项仍然有效。
- **文档位置：** 本工程在 GitHub 中跟踪的文档目录为 `docs/`。

## 文档入口

1. [WORK_HANDOFF.md](WORK_HANDOFF.md)：交给 Work 模式 DeepSeek 的实现交接、不可破坏的故事约束、当前风险与审核清单。
2. [REFACTOR_PLAN.md](REFACTOR_PLAN.md)：分阶段重构计划、优先级、每阶段验收标准。
3. [STORY_FLOW.md](STORY_FLOW.md)：故事设计约束与当前源码流程图；明确区分设计目标和已实现行为。
4. [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)：当前命名规律、推荐变量与 Knot 写法、Ink 排版约定。

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

## 维护约定

- **运行时源码是实现事实来源，主创设定是叙事意图来源。** 两者不一致时，先记录差异，不要由实现者自行决定剧情含义。
- 改路线门槛、精神状态、计数或终局顺序时，同次提交必须更新故事图和测试记录。
- 新增代码遵循 `INK_STYLE_GUIDE.md`；旧变量与 Knot 不做无测试的大规模批量改名。
- 所有源码修改在独立分支进行；PR 中说明编译器版本、测试命令、实际结果和未验证项。
- 不修改“黑川物流”Obsidian 知识库；本工程只负责 Ink 项目与其文档。

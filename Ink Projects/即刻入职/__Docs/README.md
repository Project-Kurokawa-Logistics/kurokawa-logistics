# 《即刻入职》开发文档

- **更新日期：** 2026-11-20
- **工程目录：** `Ink Projects/即刻入职/`
- **正文状态：** 全工程 `.ink` 源码均为正文直接生效（仅保留 `Systems/Environment.ink` 与 `UI/Menus/Main.ink` 中的 `【DEV】` 调试块注释）。其中 `Endings/Final_Reconciliation.ink` 当前保留单行占位与逻辑变量，完整图文正文统一在 Obsidian 仓库 `黑川物流/Content/临时发布/即刻入职/终局.md` 维护，定稿后回填。
- **测试入口：** `__Tests/` 是唯一可复跑的编译与回归入口（固定 `inkjs@2.4.0`，共 13 项回归，含种子 `1/7/42` 的纯点击九路线自然通关）。

```bash
cd "Ink Projects/即刻入职/__Tests"
npm ci --no-audit --no-fund
npm test
```

## 文档入口

1. [NARRATIVE_DESIGN.md](NARRATIVE_DESIGN.md)：主创确认的世界观时间点、角色内核、全路线彩蛋、硬性叙事约束与九条路线设计要点。
2. [STORY_FLOW.md](STORY_FLOW.md)：主流程图、行动选项条件、精神状态与梦境概率、身份状态及终局机制。
3. [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)：目录职责、变量与 Knot 命名规范、注释与排版约定、关键实现注意事项。

## 目录职责

| 目录／文件 | 角色 |
| --- | --- |
| `即刻入职.ink` | 集中 `INCLUDE` 与运行入口（共 47 条） |
| `Core/Variables.ink` | 全局状态变量 |
| `Systems/` | 精神状态、身份状态、强制闯入、环境检查 |
| `Flow/` | 启动、导航、行动选择 |
| `Routes/Work/`、`Routes/Break/` | 工作／请假事件与结算 |
| `Dreams/` | 梦境路由与梦境正文 |
| `Endings/Routes/` | 普通路线结局正文 |
| `Endings/Final_Reconciliation.ink` | 空白空间最终和解（当前为逻辑占位，正文在 Obsidian `终局.md`） |
| `Endings/No8_Reality.ink` | 和解后的现实苏醒与 No.8 结局 |
| `Endings/Route_Gallery.ink` | 结局回溯 |
| `UI/` | 标题、菜单、日志、异常页、制作人员 |
| `Dev/` | 调试／开发兜底（`TEST`／`Legacy` 不进入正式入口） |
| `__Docs/` | 工程开发与叙事设计文档 |
| `__Tests/` | 编译与回归测试入口（`inkjs@2.4.0`） |

## 已知待办与未确认项

- **待修逻辑问题：**
  - `Dreams/Router.ink` 以 `<- Dream4` 启动线程，Dream4 的点菜选项会与醒来后的行动选项混排，点选后可能停在无选项状态；
  - `UI/Pages/Logs.ink` 的返回菜单调用不可达，2026／2025 日志页只能互跳，无法返回标题；
  - `UI/Pages/Drone.ink` 的 `++ [确认重置]w` 会残留输出字符 `w`，随后发出 `# RESTART`。
- **待主创确认／补写项：**
  - `Dream7` 已被 `INCLUDE` 但未加入随机池，是否启用待定；
  - `Endings/No8_Reality.ink` 仍为短草稿，待扩写现实苏醒场景；
  - `Systems/Environment.ink` 与 `UI/Menus/Main.ink` 中的 `【DEV】` 调试注释块是否保留；
  - Inky GUI 实机回归、宿主 `# RESTART` 与最终作者验收。

## 维护约定

- **运行时源码是实现事实来源，主创确认是叙事意图来源。** 两者不一致时先核对，不自行改动设定。
- 修改路线条件、精神状态、计数或终局顺序后，同步更新 [STORY_FLOW.md](STORY_FLOW.md) 并在 `__Tests/` 补齐回归测试。
- 新增代码遵循 [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)；不修改“黑川物流”Obsidian 知识库（除非主创明确要求）。

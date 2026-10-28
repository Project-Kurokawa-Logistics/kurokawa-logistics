# 《即刻入职》Work / DeepSeek 代码实现交接

- 更新日期：2026-10-28
- 目标分支：`main`
- 目录迁移：已通过 [PR #3](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/pull/3) 合并
- 迁移合并提交：[`728b84c2`](https://github.com/Project-Kurokawa-Logistics/kurokawa-logistics/commit/728b84c201693db1a4774e2ee4402873914eb4e1)
- 当前验证状态：**尚未运行 Ink 编译或完整实机回归测试**
- 文档目录：当前 GitHub 工程实际跟踪的是 `Ink Projects/即刻入职/docs/`；不要假设该目录已叫作 `__Docs/`。

## 1. 协作分工

### DeepSeek（Work 模式）

1. 先阅读本文、[REFACTOR_PLAN.md](REFACTOR_PLAN.md)、[STORY_FLOW.md](STORY_FLOW.md) 和 [INK_STYLE_GUIDE.md](INK_STYLE_GUIDE.md)。
2. 先做编译／引用／状态流的审查，再按任务单修改代码；不要一上来重写全部 Ink 文件。
3. 在独立工作分支提交改动。每次提交尽量只解决一个可验证的问题，并更新相关文档。
4. 每个任务结束时报告：修改文件、行为变化、测试方法、测试结果、未解决问题。没有运行的测试必须明确写“未运行”。
5. 未经主创确认，不改故事设定、不扩写成正式剧情、不批量改名、不直接推送 `main`。

### ChatGPT（审核）

- 审查 diff、变量读写、Knot／Stitch／Divert 引用、选项可达性、状态更新顺序和结局统计。
- 检查实现是否符合本交接文档的故事约束；区分代码事实、主创设定和 AI 提议。
- 有可用编译器时要求先编译，再审查回归测试结果；无法执行时说明验证边界，不把静态检查说成测试通过。
- 对有风险的改动要求 DeepSeek 给出最小补丁和复现路径；未确认的故事决策交还主创。

### 主创（最终决定）

剧情、人物动机、结局含义、未完成文本是否成为正式设定，都以主创确认为准。AI 生成的草稿不能自动视为正典。

## 2. 不可破坏的故事约束

1. 《即刻入职》发生在洛书已在现实中被 AZ 抓住之后；反复醒来首先发生在精神空间。
2. 开局会收到黑川物流的市场部面试邀请函。**第一次导航只应提供“去黑川物流面试”与“去公司上班”**，不应一开始就展示电影、快递等后续选项。
3. 路线第一次经历增加精神数值 10，重复经历增加 5。当前数值越高，精神状态越差；不要因变量名 `SAN_SCORE` 就自行反转方向。
4. FINE 状态才考虑健身；BAD 状态会倾向休息。OK 与 BAD 都可以考虑休息，不能把休息限制成只有 BAD。
5. 精神状态恶化且部分路线仍未经历时，再次醒来可能触发 AZ 强制闯入。进入 DRONE 后，环境检测应显示世界内的故障／乱码表现。
6. 设计目标是不鼓励玩家反复刷同一条路线：首次与重复经历的数值增量必须保持区别。
7. 所有普通路线的结局都指向“被入职”。若全部路线完成、洛书仍保有自我，最终必须先在空白空间醒来并完成与自己的和解；**这是最后一次精神空间的醒来**。之后才进入现实苏醒场景，接受 AZ 的安排，成为黑川物流市场部部长 No.8。
8. 空白空间不是普通结局画廊的一项；不得把它提前到普通路线之前，也不得在其后再安排一次普通精神空间醒来。
9. Ink 仍是互动小说引擎，必须保留。目录不要添加数字前缀；Obsidian 的“黑川物流”知识库不属于本次 Ink 工程改动范围。

## 3. 当前目录地图

| 路径 | 职责 |
| --- | --- |
| `即刻入职.ink` | 入口与集中 `INCLUDE` |
| `Core/Variables.ink` | 全局状态变量 |
| `Systems/Sanity.ink` | 精神状态分级 |
| `Systems/Aboard_Status.ink` | Prototype／DRONE／No.8 身份与终局状态判定 |
| `Systems/Intrusion.ink` | AZ 强制闯入条件 |
| `Systems/Environment.ink` | 启动时环境检查与页面分流 |
| `Flow/Startup.ink` | 醒来后的强制分流与启动叙述 |
| `Flow/Navigator.ink` | 按精神状态、已经历路线决定当天叙述 |
| `Flow/Going_To.ink` | 面试／上班／请假等行动选择 |
| `Routes/Work/`、`Routes/Break/` | 工作与请假事件、状态增量、GAME OVER 返回 |
| `Dreams/Router.ink`、`Dreams/Dream*.ink` | 梦境概率和梦境正文 |
| `Endings/Routes/` | 各普通路线的结局正文 |
| `Endings/Final_Reconciliation.ink` | 空白空间中的最终和解 |
| `Endings/No8_Reality.ink` | 和解后的现实苏醒／No.8 结局 |
| `Endings/Route_Gallery.ink` | 已经历路线的回顾入口 |
| `UI/` | 标题、菜单、日志、DRONE 页面与制作人员 |
| `Dev/` | 开发测试和调试兜底；不要默认把测试节点接入正式运行流程 |

## 4. 关键状态与实现约定

- `SAN_SCORE`：初始值为 `-1`；普通路线首次经历通常 +10，重复经历通常 +5。数值阈值见 `Systems/Sanity.ink`。
- `COUNT_ROUTE_WORK_*`、`COUNT_ROUTE_BREAK_*`：路线经历计数；0 表示未经历，非 0 表示已经历。不要把它们随意改成布尔值，因为首次／重复经历需要计数。
- `COUNT_GAME_OVER`：当前用作断开连接／重新连接次数相关的状态。必须核对每条路线是否恰好增加一次，以及它与正文中的“第几次醒来”是否同义。
- `COUNT_MENU_SEPARATOR`：菜单分隔线隐藏入口的点击计数，与剧情路线计数分开。
- `HAS_ENTERED_FINAL_RECONCILIATION`：空白空间终局的阶段标记。要实测其赋值时机、重启时的重置行为，以及是否能保证空白空间只发生一次。
- `UNLOCKED_NO8_DATABASE`：已声明的隐藏解锁变量；请搜索所有读写，确认它是否确实被赋值、是否仍有必要，不要自行删除。
- `Get__Sanity_State(score)`：返回 `FINE`、`OK`、`BAD` 或 `AWFUL`。
- `Get__Aboard_Status()`：返回 `Prototype`、`DRONE` 或 `No.8`。
- `Get__Forced_Intrusion()`：返回 `WORK`、`BREAK` 或 `NONE`。
- `Dream__Router` 目前的随机候选是 Dream1–Dream6；Dream7 虽被入口文件 INCLUDE，但未出现在 Shuffle 列表中。先按设计确认，不要自行加入。

## 5. 必须优先核查的风险

1. **编译与引用：** 目录迁移后所有 INCLUDE、Divert、函数调用是否都能解析；是否存在重复 Knot、未定义目标或 Ink 语法错误。
2. **终局顺序：** No.8 状态是否先进入 `Ending__Final_Reconciliation`，然后才进入 `Ending__No8_Reality`；空白空间是否真的是最后一次精神空间醒来。
3. **计数边界：** 每条路线是否只增加一次 `COUNT_GAME_OVER`；小憩、办公室与居家强制结局的计数／精神增量是否符合主创意图。
4. **首次导航：** 初始 `SAN_SCORE = -1` 时是否只有面试与上班两个选择。
5. **OK／BAD 休息：** 两种状态下休息选项都应可考虑；FINE 健身条件不能误放宽。
6. **强制闯入：** BAD／AWFUL、路线未经历与 Shutdown 计数的组合是否会按预期进入 AZ 闯入，再在下一次环境检查进入 DRONE。
7. **可见开发文本：** `UI/Menus/Main.ink` 中仍有 `【DEV】` 精神状态诊断文本；确认是否应在正式玩家界面隐藏或加开发模式开关。
8. **作者草稿：** `Endings/No8_Reality.ink` 目前含有 AI 起草的短段落和 TODO，必须由主创审阅、扩写或替换；不能当作正式定稿。

## 6. 最小验收清单

- [ ] 项目使用的 Ink 编译器能成功编译入口文件。
- [ ] 所有 INCLUDE、函数、Knot、Stitch 和 Divert 均可解析。
- [ ] 新游戏第一次导航只有面试／上班。
- [ ] 同一普通路线第一次 +10，重复 +5；路线计数与 `COUNT_GAME_OVER` 无重复、无漏记。
- [ ] FINE 可见健身选择；OK 与 BAD 都可考虑休息。
- [ ] BAD／AWFUL 与未经历路线的组合覆盖强制闯入测试。
- [ ] DRONE 环境页显示乱码／故障效果，普通状态仍进入正常标题／流程。
- [ ] 全部路线经历后，No.8 判定正确。
- [ ] 最终顺序严格为“空白空间和解 → 现实苏醒 → No.8”，中间没有额外普通醒来。
- [ ] 重置／重新开始不会遗留不应保留的状态。
- [ ] 测试结果与未解决问题记录在提交说明或本目录文档中。

**当前状态提醒：** PR #3 已合并目录和命名迁移，但合并不代表 Ink 编译或剧情回归已经通过。下一步应先验证，不要立即进行大规模变量改名。

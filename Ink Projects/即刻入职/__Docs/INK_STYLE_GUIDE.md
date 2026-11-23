# 《即刻入职》Ink 命名与代码格式约定

- 更新日期：2026-11-20
- 目的：保持 Ink 脚本结构清晰、便于协作审阅，避免误改变量或跳转逻辑。

## 1. 目录与命名约定

### 目录结构

| 目录 | 用途 |
| --- | --- |
| `Core/` | 全局变量（集中放在 `Core/Variables.ink`） |
| `Systems/` | 状态函数、身份判定、强制闯入、环境检查 |
| `Flow/` | 启动、导航、行动选择 |
| `Routes/Work/`、`Routes/Break/` | 事件与结算 |
| `Dreams/` | 梦境路由和正文 |
| `Endings/Routes/` | 普通路线的结局正文 |
| `Endings/` | 最终和解、现实 No.8、结局回溯 |
| `UI/` | 菜单、标题、日志、异常页、制作人员 |
| `Dev/` | 开发测试与兜底节点（默认不接入正式流程） |
| `__Docs/` | 开发与叙事设计文档 |
| `__Tests/` | 编译与回归测试入口（`inkjs@2.4.0`，CommonJS） |

目录不使用数字前缀；文件名采用易读英文词组与下划线（如 `Business_Trip.ink`、`Final_Reconciliation.ink`）。

### Knot、Stitch 与函数

- Knot 使用双下划线表达模块层级（如 `Flow__Startup`、`Work__Route_Hub`、`Ending__Final_Reconciliation`、`Menu__Main`）。
- 历史 Stitch 名（`Check`、`Choice`、`Morning`、`Afternoon`、`Evening`、`Game_Over` 等）不要仅为形式统一而批量改名，避免破坏 Divert 上下文。
- 函数以动词说明返回值：`Get__Sanity_State(score)`、`Get__Aboard_Status()`、`Get__Forced_Intrusion()`。

### 全局变量

| 类型 | 示例 | 约定 |
| --- | --- | --- |
| 精神数值 | `SAN_SCORE` | 越高状态越差；初始 `-1` 为首次启动哨兵，首次打开邀请函后为 `0` |
| 路线经历次数 | `COUNT_ROUTE_WORK_GYM` | 实际进入次数（`0` 未经历，非 `0` 已经历），不改为 bool |
| 结算／重连序号 | `COUNT_GAME_OVER` | 九条路线已完成结算的总次数，也是「重新连接：第 N 次」序号 |
| 菜单隐藏点击 | `COUNT_MENU_SEPARATOR` | 主菜单分隔线点击次数；第 6 次触发隐藏入口 |
| 阶段布尔值 | `HAS_ENTERED_FINAL_RECONCILIATION` | `HAS_*`／`IS_*` 表达阶段状态 |
| 解锁布尔值 | `UNLOCKED_NO8_DATABASE` | 第 6 次分隔线点击置 `true`，用于隐藏初始化／重新连接入口 |

状态字符串 `FINE`、`OK`、`BAD`、`AWFUL`、`Prototype`、`DRONE`、`No.8` 拼写必须完全一致。

## 2. 注释与正文写法

### 注释约定

- **解释性注释使用中文**，面向主创与维护者说明“为什么存在该条件／顺序”。
- **代码标识符保留源码原名**（如 `SAN_SCORE`、`COUNT_GAME_OVER`、`Dream__Router.Check`），不翻译或另造别名。

### 正文与大纲占位

- 全工程 `.ink` 文件均采用正文直接生效，不再使用 `/* ... */` + `【摘要】` 包裹阅读文本。
- 大纲占位直接写入 `.ink` 时，列表条目**不要以 `- ` 开头**（Ink 会解析为 gather 收束点），请使用 `· ` 等普通符号。
- `END`、`DONE`、`->`、`<-`、`# CLEAR` 语义各不相同，不可机械互换；尤其不要将 `<-` 线程与隧道调用互换。

### 排版参考

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
    -> Menu__Game_Over
```

## 3. 维护规则与关键注意事项

1. 新增 `.ink` 文件后同步加入 `即刻入职.ink` 的 `INCLUDE` 列表（`Dev/` 测试文件除外）。
2. 不要在选项呈现或预览过程中偷偷增加路线计数；副作用应只发生在真正进入路线／结算的位置。
3. 保留作者原文与特殊乱码表现；未完文本或 Obsidian 同步中的段落不要擅自替换为自拟定稿。
4. 修改条件时保持原有分支优先级（Ink 条件按书写顺序判定）。
5. **特别留意：**
   - `SAN_SCORE` 数值越高状态越差，不要按名称误判方向；
   - `Work__Gym` 中的 `Game_Over + 1` 是 `Work__Gym.Game_Over` Stitch 的历史访问次数加当前一次，不是 `COUNT_GAME_OVER`，不可替换；
   - `Systems/Environment.ink` 与 `UI/Menus/Main.ink` 中的 `【DEV】` 状态诊断文本当前由块注释隐藏；
   - 每次改动脚本后在 `__Tests/` 执行 `npm test`，确保 47 个 `INCLUDE` 0 错误 0 警告且全部 13 项回归通过。

# 《即刻入职》故事线路图与状态说明

- 更新日期：2026-10-28
- 对应架构：目录迁移后的 `main`（PR #3）
- **验证声明：** 本文根据当前 Ink 源码静态整理，未执行 Ink 编译或全路径实机测试。箭头表示源码中的可见转移，不保证每条路径已被运行验证。

## 1. 主流程图

```mermaid
flowchart TD
    Entry["即刻入职.ink"] --> Env{"Check__Environment"}
    Env -->|"Get__Aboard_Status() = DRONE"| Drone["Page__Drone：乱码／故障页"]
    Env -->|"其他状态"| Title["Page__Title → Menu__Main"]
    Title -->|"初始化／重新连接"| Router["Dream__Router.Check"]
    Title -->|"结局回顾"| Gallery["Ending__Route_Gallery.Index"]
    Router -->|"状态为 DRONE"| Env
    Router -->|"No.8 且未进入和解"| White["Ending__Final_Reconciliation"]
    Router -->|"No.8 且已进入和解"| Reality["Ending__No8_Reality"]
    Router -->|"强制闯入条件成立"| Startup["Flow__Startup.Check"]
    Router -->|"FINE"| Startup
    Router -->|"OK／BAD／AWFUL 的梦境判定"| Chance["Dream__Router.Check__Dream_Chance"]
    Chance -->|"触发梦境"| Dreams["Dream1–Dream6"]
    Chance -->|"不触发"| Startup
    Dreams --> Startup
    Startup -->|"强制 WORK"| WorkShutdown["Work__Shutdown"]
    Startup -->|"强制 BREAK"| BreakShutdown["Break__Shutdown"]
    Startup -->|"常规流程"| Nav["Flow__Navigator.Index"]
    Nav --> Going["Flow__Going_To.Choice"]
    Going --> Work["Work__Route_Hub"]
    Going --> Break["Break__Interview／Cinema／Home／Shutdown"]
    Work --> End["路线结算 → Menu__Game_Over"]
    Break --> End
    WorkShutdown --> End
    BreakShutdown --> End
    End -->|"断开连接／重新连接"| Env
    White --> Reality
```

### 启动、梦境和强制闯入的优先级

`Dream__Router.Check` 当前按以下顺序判断：

1. DRONE → 回到环境检查／异常页。
2. No.8 且 `HAS_ENTERED_FINAL_RECONCILIATION == false` → 空白空间最终和解。
3. No.8 且该标记为 true → 现实苏醒的 No.8 结局。
4. `Get__Forced_Intrusion() != "NONE"` → 进入启动分流，由 `Flow__Startup.Check` 决定强制 WORK 或 BREAK。
5. FINE → 直接进入正常启动流程。
6. 其他精神状态 → 按梦境概率决定是否进入随机梦境，再进入正常启动流程。

这意味着 No.8 与强制闯入检查优先于普通随机梦境。需要通过实机测试确认每个状态组合的实际可达性。

## 2. 作者确认的故事设计约束

以下是主创明确的叙事目标，不应仅因为当前代码与之不一致就反过来修改设定：

- 故事发生在洛书已于现实中被 AZ 抓住之后。反复醒来首先发生在精神空间。
- 开局收到黑川物流市场部面试邀请函；首次导航仅有面试与上班两个选择。
- 第一次经历某条普通路线增加精神数值 10，重复经历增加 5；反复刷同一条路线不应成为最佳策略。
- FINE 时才考虑健身；BAD 时更想休息；OK 与 BAD 都允许考虑休息。
- 精神状态恶化且部分路线尚未经历时，下一次醒来可能触发 AZ 强制闯入；其后在 DRONE 状态下显示故障乱码。
- 所有普通路线的结局都是被入职。若所有路线完成且洛书仍保有自我，必须在空白空间中完成与自己的和解；这是最后一次精神空间的醒来。随后才在现实中醒来，接受 AZ 的安排，成为黑川物流市场部部长 No.8。
- 空白空间是最终和解，不是普通路线回顾项，也不能在其后再插入一次普通梦境／精神空间醒来。

## 3. 行动选择与路线

### 初始行动

入口 `SAN_SCORE = -1`，`Get__Sanity_State(-1)` 应返回 FINE。当前 `Flow__Going_To.Choice` 的条件设计为：

| 选项 | 当前条件 |
| --- | --- |
| 请假去黑川物流面试 | FINE 或 OK |
| 请假出门看电影 | OK 或 BAD |
| 请假在家休息／收快递 | OK 或 BAD |
| 异常乱码的居家终结选项 | AWFUL |
| 去公司上班 | 非 BAD／AWFUL，或办公室终结尚未经历 |

因此首次 FINE 导航应只显示面试和上班。请用实际运行验证，而不要只依据静态条件判断。

### 工作路线

- `Work__Route_Hub.Morning` 先检查部分已经历路线；若健身、下班、出差、小憩均有记录，会转入办公室终结。
- 上午可能进入出差路线；下午根据精神状态处理小憩；晚上 FINE 状态才显示健身选项，另可选择下班回家。
- BAD 状态的下午逻辑当前会直接转入小憩流程；OK 状态进入小憩选择；FINE 状态跳过小憩分支。
- 具体分支还受已经历路线和前置条件影响，不能把上述概括当作每次都出现的固定菜单。

### 请假路线

| 路线 | 目标含义 | 当前可见入口条件 |
| --- | --- | --- |
| `Break__Interview` | 黑川物流面试 | FINE／OK |
| `Break__Cinema` | 出门看电影 | OK／BAD |
| `Break__Home` | 在家休息／收快递 | OK／BAD |
| `Break__Shutdown` | AZ 强制闯入／居家终结 | AWFUL 的特殊选项或启动强制分支 |

## 4. 精神状态与梦境概率

`Systems/Sanity.ink` 的当前判定顺序：

| 状态 | 源码条件 |
| --- | --- |
| AWFUL | `score >= 60`，且健身、下班、出差、小憩、办公室、面试、电影、收快递这 8 条普通路线都有记录 |
| BAD | `score >= 60`，但不满足 AWFUL 的路线集合条件 |
| OK | `30 <= score < 60` |
| FINE | `score < 30` |

`Dream__Router.Check__Dream_Chance` 当前梦境概率：

| 状态 | 概率／行为 |
| --- | --- |
| FINE | 不抽梦，直接正常启动 |
| OK | 50% |
| BAD | 75% |
| AWFUL | 100% |

随机池目前只有 Dream1–Dream6。Dream7 虽在入口文件中被 INCLUDE，但未在 `Dream__Router.Shuffle` 中调用；是否加入随机池是待主创确认的设计决定。

## 5. 身份状态、路线计数和终局

### 路线计数

- `COUNT_ROUTE_WORK_*`、`COUNT_ROUTE_BREAK_*`：0 表示未经历，非 0 表示已经历；数值还用于区分第一次与重复经历。
- 普通路线的结算逻辑应是第一次 +10、重复 +5。
- `COUNT_GAME_OVER` 参与重新连接／醒来次数显示。必须逐条确认每条路线恰好增加一次；不要默认它与“醒来次数”完全同义。

### 身份状态

`Systems/Aboard_Status.ink` 当前优先检查：

1. 5 条 Work 路线与 4 条 Break 路线全部有记录 → `No.8`。
2. 部分 BAD／非 FINE 状态、路线缺失且相应 Shutdown 已发生 → `DRONE`。
3. 其他状态 → `Prototype`。

隐藏菜单可以把多条路线计数直接设为 1，因此“计数满足 No.8 门槛”不一定意味着玩家自然经历过每条路线。测试时应把正常通关与隐藏菜单捷径分开。

### 最终两阶段

```text
所有路线达到 No.8 判定
  → Ending__Final_Reconciliation
  → 在空白精神空间中醒来并与自己和解
  → Ending__No8_Reality
  → 现实中醒来，接受 AZ 的安排，成为市场部部长 No.8
```

当前 `Ending__Final_Reconciliation.ink` 在场景开始时设置 `HAS_ENTERED_FINAL_RECONCILIATION = true`，并用 `COUNT_GAME_OVER - 1` 生成前几次醒来的数量。两项都需要在运行时核对，尤其是计数是否差一。现实结局文件目前仍有 TODO 和 AI 草稿，需要主创审阅。

## 6. 当前需验证的问题

- [ ] Ink 编译、所有 INCLUDE 与 Divert 目标。
- [ ] 初始导航确实只有面试／上班。
- [ ] 首次 +10、重复 +5，且 `COUNT_GAME_OVER` 每次只增加一次。
- [ ] OK／BAD 休息选项和 FINE 健身条件。
- [ ] 强制闯入触发后，下一次环境检查进入 DRONE 乱码页。
- [ ] 全路线自然经历时 No.8 门槛正确；隐藏菜单捷径单独测试。
- [ ] 空白空间 → 现实 No.8 的顺序不可逆，不出现额外普通醒来。
- [ ] 结局回顾不意外改变路线计数或精神状态。
- [ ] 主菜单中的 `【DEV】` 调试信息是否需要隐藏。

本图用于沟通和审查；任何实现变更后都要同步更新。若故事设定与代码不一致，应在文档中标出差异并交给主创决定，不要由实现者自行推断。

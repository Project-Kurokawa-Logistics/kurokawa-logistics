# 变量与状态索引

> 本文是初始人工索引，不是自动扫描结果；只列出本次阅读中已确认的代表性变量。新增/删除变量后应同步更新。

## 1. 核心变量

| 变量 | 当前可见初值/用途 | 来源 |
|---|---|---|
| NAME__AZ | 初值为 "No.AZ"；主角显示名称相关 | [Characters/AZ.ink](../Characters/AZ.ink) |
| Careers__AZ | 初值为 "No.AZ"；郊区会写入“冒险者”并用于分支，不代表完整职业系统已经实现 | [Characters/AZ.ink](../Characters/AZ.ink)、[Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink) |
| Count__GAME_OVER | 初值为 0；在深渊、地城及远森镇死亡选项中递增，当前未发现读取处 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Maps/Abyss/Rift.ink](../Maps/Abyss/Rift.ink)、[Maps/Forest/Dungeon.ink](../Maps/Forest/Dungeon.ink)、[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) |
| Count__Start | 初值为 0；新游戏、重新连接及章节跳转等入口递增，并控制主菜单的新游戏／重新连接选项 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Menus/Main.ink](../Menus/Main.ink)、[Menus/JumpTo.ink](../Menus/JumpTo.ink) |
| Count__Chapter | 初值为 0；章节推进时递增，重新连接、身份选择及各章节跳转按现状写入不同值 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Menus/Main.ink](../Menus/Main.ink)、[Menus/JumpTo.ink](../Menus/JumpTo.ink)、[Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink)、[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) |
| Place__ShanFeiMiMiYingDi | 初值为“山匪秘密营地”；后续有节点将其改成其他地点描述 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Maps/Forest/Boulevard.ink](../Maps/Forest/Boulevard.ink) |
| Count__不明生物的尸体 | 初值为 0；物品/资源计数 | [Misc/Items.ink](../Misc/Items.ink) |
| Count__枯树的碎片 | 初值为 0；物品/资源计数 | [Misc/Items.ink](../Misc/Items.ink) |
| Race__Arshasy | 在远森镇相关剧情中出现，并被赋值为“人类” | [Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) |
| Path__ShouFuAiRen | 初值为空字符串；首都酒馆记录“缓慢地接近”或“大胆地接近”，并决定后续分支 | [Maps/Ruoment_City/Capital.ink](../Maps/Ruoment_City/Capital.ink) |
| Path__BuySomeCai | 初值为空字符串；首都集市记录“腊肉”“香薰”或“麦秆”，在大胆接近路线中决定后续差分 | [Maps/Ruoment_City/Capital.ink](../Maps/Ruoment_City/Capital.ink) |

## 2. 命名类别（按源码用法归纳）

| 前缀/模式 | 常见用途 | 注意事项 |
|---|---|---|
| NAME__ | 名称/显示身份 | 若改名，检查所有直接引用与分支判断。 |
| Careers__ | 职业或社会身份 | 有文本根据具体字符串值分支；改动字符串可能改变剧情路径。 |
| Race__ | 角色种族/状态 | 应核对角色叙述与变量是否一致。 |
| Count__ | 计数器、章节/物品计数 | 需要确认递增位置与重置策略。 |
| Achievement__ | 成就标记；常见用法为 ++ | 具体解锁条件应对照 [Misc/Achievements.ink](../Misc/Achievements.ink)。 |
| Place__ | 地点或据点描述 | 文本参数变化后检查相关显示。 |
| TEMP__ | 命名上表示临时剧情标记 | 目前源码使用 VAR TEMP__... 声明；它不是仅凭名称即可判断生命周期的依据。应逐个检查初始化与重置。 |

## 3. 当前可见的剧情旗标

### 远森镇与角色互动

在 [Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) 中能看到以下一组节点内旗标：

- 旧胶奴处理选择：TEMP__Make_BanCangPin、TEMP__WuHuaJiGeJiaoNu、TEMP__Make_ZuoJiGeQiGuan。
- 阿沙西修改选项：TEMP__Arshasy_Mark_Entourage、TEMP__Arshasy_Asceticism、TEMP__Arshasy_Wear_Accessories、TEMP__Arshasy_Force_Modify_Hobbies、TEMP__Arshasy_Change_Name。
- 能力提升选择：TEMP__PowerUp_Arshasy、TEMP__PowerUp_Aize、TEMP__PowerUp_Lind。
- 追捕/冲突分支：TEMP__NianGuoQu、TEMP__ZhuanXinJieJueZheJiGeJiaHuo、TEMP__FanJi、TEMP__RangTaAnXi。

在 [Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink) 中，TEMP__WoChiYiGeRen 初值为 0；选择对应行动后递增并返回 MedicalTent，使该选项不再出现；选择分析新生物时又将它重置为 0。这是当前源码行为，不代表其跨线路或回溯保留规则已经确定。

以上仅列出已确认的代表性变量；其他旗标是否在所有返回路径中正确重置，尚未全部审计。

## 4. 结局与死法访问记录

[Misc/Finales.ink](../Misc/Finales.ink) 的目录读取以下 stitch 的访问计数，而非同名 VAR：

| stitch | 当前静态剧情入口 |
|---|---|
| Lord_of_the_Black_Goo_Demon | [Maps/Abyss/START.ink](../Maps/Abyss/START.ink) 的交流分支 |
| BaiHuMengJiang | [Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink) 的退休分支 |
| YiZheRenXin | [Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) 的 Ending_Today 随缘分支 |
| PoChan | [Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) 的 DealCommercial 第一项和 Choose_7 追捕分支 |

[Misc/Shutdown.ink](../Misc/Shutdown.ink) 的六个死法同样通过 stitch 访问计数显示。目录重看详情和调试强制展示也会增加访问计数，因此这些数值不能直接解释为唯一通关次数。

**待验证／待确认：** 各剧情入口的实际可达性仍需逐条运行验证；现有访问计数是否继续用于结局和死法目录，以及它们如何跨线路保留，仍需逐项映射，不得在结构迁移中自行改成新规则。

## 5. 多线路记录（已确认目标设计，尚未实现）

- 每条开局线路是独立游戏进程，线路完成后应记录对应的完成标记；全部线路完成后，故事结局之后进入真结局。
- 再次开局可以选择其他线路，不提供二周目加成；完成标记和重试次数标签可在后续线路的指定不显眼位置读取。
- 线路完成标记与重试次数标签是跨线路记录，不是线路内世界状态，也不是 AZ 叙事回溯的状态快照。
- 当前 `Count__Start` 只按现有菜单逻辑递增，不能直接改名为或等同于重试次数；现有结局／死法访问计数也不能直接等同于线路完成标记。
- 新记录的变量名、类型、写入点、读取点和持久化方式尚未设计。其他物品、角色、成就、结局和死法状态的保留范围仍需逐项确定。

## 6. 变量变更检查清单

新增或修改变量时，建议确认：

- [ ] 是否有明确初值。
- [ ] 是否有字符串值参与条件判断；大小写/中文文本是否一致。
- [ ] 是一次性选项旗标、计数器，还是需要跨章节保留的状态。
- [ ] 返回同一 knot 后是否应保留该值。
- [ ] 是否存在重置语句把前面的选择效果清掉。
- [ ] 是否需要在结局目录、成就或其他角色文件中同步更新。
- [ ] 文档中的用途描述是否仍与源码一致。

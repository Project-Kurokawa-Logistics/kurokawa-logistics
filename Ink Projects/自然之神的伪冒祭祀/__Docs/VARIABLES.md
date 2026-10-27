# 变量与状态索引

> 本文是初始人工索引，不是自动扫描结果；只列出本次阅读中已确认的代表性变量。新增/删除变量后应同步更新。

## 1. 核心变量

| 变量 | 当前可见初值/用途 | 来源 |
|---|---|---|
| NAME__AZ | 初值为 "No.AZ"；主角显示名称相关 | [Characters/AZ.ink](../Characters/AZ.ink) |
| Careers__AZ | 初值为 "No.AZ"；后续可被设为“冒险者”等职业 | [Characters/AZ.ink](../Characters/AZ.ink)、[Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink) |
| Count__GAME_OVER | 初值为 0；在后期冲突选项中递增 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) |
| Count__Start | 初值为 0；当前用途尚未在此文档中完整追踪 | [Misc/Parameters.ink](../Misc/Parameters.ink) |
| Count__Chapter | 初值为 0；章节推进时递增 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) |
| Place__ShanFeiMiMiYingDi | 初值为“山匪秘密营地”；后续有节点将其改成其他地点描述 | [Misc/Parameters.ink](../Misc/Parameters.ink)、[Maps/Forest/Boulevard.ink](../Maps/Forest/Boulevard.ink) |
| Count__不明生物的尸体 | 初值为 0；物品/资源计数 | [Misc/Items.ink](../Misc/Items.ink) |
| Count__枯树的碎片 | 初值为 0；物品/资源计数 | [Misc/Items.ink](../Misc/Items.ink) |
| Race__Arshasy | 在远森镇相关剧情中出现，并被赋值为“人类” | [Maps/Forest/FarMoriTown.ink](../Maps/Forest/FarMoriTown.ink) |

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

在 [Maps/Ruoment_City/Suburban.ink](../Maps/Ruoment_City/Suburban.ink) 中还可见 TEMP__WoChiYiGeRen，用于限制医疗帐篷内某个选择的重复出现。

以上仅列出已确认的代表性变量；其是否在所有返回路径中正确重置，尚未全部审计。

## 4. 结局标记

[Misc/Finales.ink](../Misc/Finales.ink) 的目录使用以下标记来判断是否显示对应结局：

- Lord_of_the_Black_Goo_Demon
- BaiHuMengJiang
- YiZheRenXin
- PoChan

**待验证：** 需要全量追踪这些标记在哪些节点被设置，以及每个结局是否至少存在一条当前可达路线。不要只新增目录条目而忘记添加/验证相应的解锁状态。

## 5. 变量变更检查清单

新增或修改变量时，建议确认：

- [ ] 是否有明确初值。
- [ ] 是否有字符串值参与条件判断；大小写/中文文本是否一致。
- [ ] 是一次性选项旗标、计数器，还是需要跨章节保留的状态。
- [ ] 返回同一 knot 后是否应保留该值。
- [ ] 是否存在重置语句把前面的选择效果清掉。
- [ ] 是否需要在结局目录、成就或其他角色文件中同步更新。
- [ ] 文档中的用途描述是否仍与源码一致。

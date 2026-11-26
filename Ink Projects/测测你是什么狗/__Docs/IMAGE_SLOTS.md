# 图片素材槽位对照表（IMAGE Slots）

项目中已为标题封面及全部 12 张犬种结果卡预留好标准 `# IMAGE:` 标签。准备妥当图片后，任选以下两种方式之一接入即可：

## 方式 A：本地相对路径（导出网页包直接放入 `images/` 目录）

在 Inky 执行 `File -> Export for web...` 后，在导出的网页目录下新建 `images/` 文件夹，按下列文件名放入对应图片，无需改动 `.ink` 源码即可直接显示：

| 槽位用途（五字称号） | 预设相对路径 | 所在文件 |
| :--- | :--- | :--- |
| 标题页封面图 | `images/cover_title.png` | [`Flow/Title.ink`](../Flow/Title.ink) |
| 01 · 天生大骚狗 | `images/dog_01_dasaogou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 02 · 纯情小奶狗 | `images/dog_02_xiaonaigou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 03 · 硬汉大狼狗 | `images/dog_03_dalanggou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 04 · 熟男老母狗 | `images/dog_04_laomugou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 05 · 邪恶萨摩耶 | `images/dog_05_samoye.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 06 · 社畜牛马狗 | `images/dog_06_niumagou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 07 · 傲娇小败犬 | `images/dog_07_baiquan.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 08 · 发疯哈士奇 | `images/dog_08_hashiqi.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 09 · 高智商边牧 | `images/dog_09_bianmu.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 10 · 狂热纪律狗 | `images/dog_10_jilvgou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 11 · 赛博机械狗 | `images/dog_11_jixiegou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |
| 12 · 看门老实狗 | `images/dog_12_laoshigou.png` | [`Results/Cards.ink`](../Results/Cards.ink) |

---

## 方式 B：替换为图床 HTTPS 外链（与《即刻入职》一致）

若使用 `img.cntracker.net` 等外链图床，直接修改 [`Flow/Title.ink`](../Flow/Title.ink) 和 [`Results/Cards.ink`](../Results/Cards.ink) 中的 `# IMAGE:` 行即可。

> [!IMPORTANT]
> **Ink 语法特别提醒**：Ink 会将双斜杠 `//` 识别为单行注释！填写 `https://` 外链时，**务必使用反斜杠转义斜杠**（与《即刻入职》保持一致）：
>
> ```ink
> // ✅ 正确写法（转义斜杠）：
> # IMAGE: https:\/\/img.cntracker.net\/img\/example.png
>
> // ❌ 错误写法（// 后面的网址会被当成注释吞掉）：
> # IMAGE: https://img.cntracker.net/img/example.png
> ```

替换完成后：
1. 如修改了图片路径，同步更新 `__Tests/regression.cjs` 顶部 `DOGS` 数组中的 `image` 断言字段（若仅用于本地网页包放置图片则无需改动）。
2. 在标题页连续点击 5 次 `————————` 分隔线即可开启全图鉴预览，逐张检查 12 张结果卡的插画裁切与留白效果。

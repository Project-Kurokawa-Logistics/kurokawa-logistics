# 🚚 黑川物流 · Kurokawa Logistics

🌐 官网：[kurokawa-logistics.com](https://kurokawa-logistics.com)

## 分支结构

| 分支 | 用途 | 谁能推 |
|---|---|---|
| `dev` | 开发者自由实验区，随意改写提交 | 所有受邀协作者 |
| `main` | 正式备份，主创定稿 | 仅管理员 |

日常更改统一提交到 `dev`，定稿后由管理员通过 Pull Request 合并到 `main`。

## 🚀 快速上手

### 1. 准备工具

- **[GitHub Desktop](https://desktop.github.com/)** —— 新手推荐，图形界面操作 git
  - 如果你是 git 熟手，直接用命令行 git 就行
- **[Obsidian（黑曜石）](https://obsidian.md/download)** —— 打开和编辑内容

### 2. 拉取仓库

**GitHub Desktop：**
左上角 `File` → `Clone Repository` → 切到 `URL` 标签页 → 粘贴：

```
https://github.com/Ander-Index/kurokawa-logistics.git
```

→ `Clone`，选一个你顺手存放的本地位置。

**命令行：**

```bash
git clone https://github.com/Ander-Index/kurokawa-logistics.git
```

### 3. 受邀加入仓库

想要直接推送的权限？**直接在群里吆喝一声，管理员看得到**，会给你发协作者邀请。接受邀请后即可直接推送 `dev`。

> 没受邀也没关系：fork 本仓库，改完后提 Pull Request 到 `dev` 即可。

### 4. 用 Obsidian 打开

打开 Obsidian → 「打开另一个库 / Open another vault」→「打开本地文件夹」→ 选择你克隆下来的目录里的 **`黑川物流`** 子文件夹。

> ⚠️ 注意：vault 是仓库里的 `黑川物流` 文件夹，不是仓库根目录。

### 5. 把更改推送到 dev 分支

**先切到 dev 分支，再开始改：**

**GitHub Desktop：** 顶部 `Branch` 菜单 → 切换到 `dev` → 改完后左下角填提交说明 → `Commit to dev` → `Push origin`

**命令行：**

```bash
git switch dev
git add -A
git commit -m "你改了什么"
git push
```

> ⚠️ 协作者请推送到 `dev`；更新 `main` 由管理员合并 Pull Request 完成。

## 📌 其他约定

- 换行符已由仓库统一强制为 **LF**，任何设备都不用手动设置
- `.obsidian/` 个人配置（设置、收藏夹、工作区）**不会同步**，每个人都用自己的编辑习惯

## 手机浏览器地址栏颜色

在笔记中添加名为 `theme-color` 的**文本属性**，填入 `#2563EB` 这样的颜色值。源码形式如下（合并到笔记已有的属性中）：

```yaml
---
theme-color: "#2563EB"
---
```

在 Obsidian 的「发布更改」中，发布 `publish.js` 和修改过的笔记。脚本会在打开和切换笔记时更新网页的 `theme-color`；支持该功能的手机浏览器会据此调整地址栏等界面颜色。首次发布后刷新网页，再用手机 Chrome 检查效果。

支持 `#RGB` 和 `#RRGGBB`。没有填写、清空或格式错误时恢复浏览器或网站原有配色；如果想设置全站默认颜色，可修改 `publish.js` 颜色功能中的 `DEFAULT_COLOR`。`publish.js` 需要绑定自定义域名，本站已满足该条件。KK-L.com 跳转到主站后也会使用同一套设置。

这项功能使用 Publish 当前的内部笔记缓存和导航事件；Publish 升级后如果接口变化，需要相应调整脚本。地址栏最终是否采用颜色由浏览器决定。

## 每篇笔记的页面背景图

在笔记开头添加 `background-image` **文本属性**，填入完整的图片链接即可；默认按桌面壁纸的「居中填充」方式适配所属笔记窗格。源码示例（合并到已有属性中，不要另建第二组 `---`）：

```yaml
---
background-image: "https://example.com/wallpaper.jpg"
background-mode: "居中填充"
background-rotation: 15
---
```

`background-mode` 是可选的文本属性，支持以下值：

| 值（中文 / 英文） | 显示效果 |
|---|---|
| `居中填充` / `cover`（默认） | 保持比例、居中铺满笔记窗格，超出部分裁切 |
| `平铺` / `tile` | 按原始尺寸重复铺满笔记窗格 |
| `拉伸` / `stretch` | 拉伸至笔记窗格宽高，可能改变比例 |
| `居中` / `center` | 保持原始尺寸居中，不缩放、不重复 |
| `适应` / `contain` | 保持比例、完整显示图片，空余区域显示主题底色 |

`background-rotation` 是可选的**数字属性**，单位为度。`15` 表示顺时针倾斜 15°，`-15` 表示逆时针倾斜 15°；省略、填写 `0` 或无效值时不旋转。只旋转背景图片，正文保持原样，图片始终裁切在所属窗格内。倾斜时，「居中填充」「平铺」「拉伸」会扩展绘制区域以补足边角；「居中」保留原始图片尺寸，超出部分裁切；「适应」会缩小绘制区域以完整保留旋转后的图片。

图片以 **10% 不透明度（90% 透明）**叠加到所属笔记窗格的主题底色上，文字保持原有清晰度，明亮与暗黑模式会自动适配。正文滚动时图片保持在窗格背景中。桌面堆叠的每个窗格分别使用自己的图片和显示模式，切换焦点不会串用背景；未设置图片的笔记保持原有背景。图片不会铺到窗格外的空白区域、左右侧栏、手机顶栏、导航抽屉或弹窗。

在 Obsidian 的「发布更改」中发布 `publish.js` 和设置了属性的笔记，然后刷新网页。样式包含在脚本中，无需修改或重新发布 `publish.css`。官方发布的自定义脚本需要自定义域名，本站已满足；本功能用于发布网站，不会改变 Obsidian 本地笔记背景。

请填写浏览器可以直接打开的图片地址，推荐 HTTPS；库内图片可使用它发布后的完整图片链接。没有填写、清空、链接格式无效或打开不存在的页面时，对应窗格会清除背景；无法识别的模式使用「居中填充」。图片地址无法访问时只显示主题底色。需要全站调整图片可见程度时，可修改 `publish.js` 中的 `BACKGROUND_OPACITY`（默认 `0.10`）。

## 浏览器识别 PWA 安装入口

应用名称为「黑川物流」，使用黑底白标 Logo，从官网首页启动，以独立窗口显示。Manifest 的默认主题色为黑色；浏览器支持时，各笔记的 `theme-color` 属性继续控制应用标题栏配色。

安装配置与图标位于 `pwa/public/pwa/`。先将这些资源部署到 Cloudflare 的 `kurokawa-logistics.com/pwa/*` 路由，再在 Obsidian 的「发布更改」中发布 `publish.js`。具体部署及验证步骤见 [PWA 部署说明](pwa/README.md)。该路由只提供安装资源，正文继续通过 Obsidian Publish 发布。

支持的浏览器会读取安装配置，并根据自身规则显示原生安装图标或提示。主页在收到可安装通知后显示安装按钮；检测到本站 PWA 已安装时，同一按钮改为「在 PWA 中打开」，点击后由浏览器决定是否交给已安装的应用。没有可用安装入口时显示「你还可以将 黑川物流 添加到主屏幕来获得最完整的体验。」；已在 PWA 窗口内时隐藏整块区域。脚本保留浏览器默认安装推广。`KK-L.com` 继续跳转到主站，应用归属主站域名。

PWA 统计沿用本站 GA4：`pwa_install_click` 记录主页安装按钮点击，`pwa_view` 记录通过独立应用窗口查看本站。在 GA4 事件报告中按名称筛选并查看「总用户数」可了解人数，「事件数」可了解次数。具体统计口径见 [PWA 部署说明](pwa/README.md#google-analytics-统计)。

## 按笔记开启 Twikoo 评论

评论默认关闭。只在笔记的复选框属性 `comments` 为 `true`，并设置了永久文本属性 `comment-id` 时显示评论区：

```yaml
---
comments: true
comment-id: "kkl-story-0001"
---
```

`comment-id` 可包含英文字母、数字、小数点、下划线、冒号和连字符，最长 128 个字符。开始收集评论后不要修改它，也不要把它分配给其他笔记；标题、文件路径和 `permalink` 改变不会影响评论串。缺少这两个属性、`comments: false` 或 ID 无效时，不加载 Twikoo 脚本。多个堆叠窗格分别读取所属笔记的属性。评论挂载到 Publish 管理的文章页脚，并在内容变化时更新页脚高度；不要直接追加到 `.markdown-preview-sizer`，其子节点会被虚拟滚动重建。页脚清空或暂时移出 DOM 后，脚本会保留并重新挂回同一评论节点，避免重复初始化或丢失未提交输入。

评论前端固定为 Twikoo `2.0.17`，优先从 npmmirror 加载，失败时回退到 jsDelivr，两个地址使用相同的 SHA-384 完整性哈希，脚本请求不发送 Referer。后端由 GitHub 仓库 [Ander-Index/kkl-twikoo](https://github.com/Ander-Index/kkl-twikoo) 通过 Netlify 自动部署，使用 MongoDB Atlas；连接地址为 `https://kkl-twikoo.netlify.app/.netlify/functions/twikoo`。

2026-10-30 配置记录：Netlify 站点与 GitHub 仓库统一命名为 `kkl-twikoo`，后端匿名评论的写入、读取和删除已验证，测试数据已清理。首页 `黑川物流/欢迎光临黑川物流～☕️.md`（`permalink: welcome`）已配置 `comments: true` 和永久 `comment-id: "welcome"`，评论串为 `/notes/welcome`。线上前端、CDN 完整性哈希和云函数版本已核对一致，配置与评论读取均返回成功。针对 Publish 虚拟滚动移除评论节点的问题，脚本已改为文章页脚挂载，并通过 Obsidian 发布。线上首页已验证评论表单显示、跳转正文再返回后的草稿保留；验证草稿已清空，未发送测试评论。管理端 `REQUIRED_FIELDS` 最终设为 `nick,mail`：昵称和邮箱必填，个人链接选填，访客无需注册账号。该配置已通过公开 API 和真实首页表单核对。此前的匿名提交测试评论已删除，评论串为空。即时通知最终改为 NapCat OneBot 群聊（`PUSHOO_CHANNEL=onebot`），替代此前的 Qmsg 和私聊方案。NapCat 地址与访问令牌仅保存在 Twikoo 配置中，不进入本仓库或文档；群消息已由用户确认送达。邮件通知使用 QQ SMTP 发件、Outlook 收件，并设置 `SC_MAIL_NOTIFY=true` 与群通知并行；测试邮件和真实评论邮件均已由用户确认正常。Cap 在测试后已恢复启用，测试评论已删除。

后端更新在上述 GitHub 仓库中进行并推送到 `main`，Netlify 会自动部署。本仓库只维护 Obsidian Publish 前端，不使用 CLI 手动部署覆盖该站点。

在 Netlify 站点的 **Site configuration → Environment variables** 设置 `MONGODB_URI`，值只在 Netlify 中保存，不要写进仓库或聊天；将其标记为私密不会影响函数运行时读取。Atlas 的 Network Access 需要允许 Netlify 使用的动态出口地址；Twikoo 官方方案为 `0.0.0.0/0`，数据库仍由独立用户名和密码保护。参见 [Twikoo Atlas 配置](https://twikoo.js.org/mongodb-atlas.html)。

修改 `publish.js` 或 `publish.css` 后，在 Obsidian 的「发布更改」中发布它们及启用了评论的笔记。评论区出现后，点击右下角齿轮设置管理员密码。升级 Twikoo 时同步修改后端仓库的 `package.json` 和本仓库 `publish.js` 的版本，重新生成脚本完整性哈希，并先核对前后端兼容性。

# 黑川物流 PWA 安装资源

这个目录将安装配置和应用图标托管到主站的 `/pwa/` 路径。内容继续由 Obsidian Publish 提供；浏览器从主站读取 Manifest 后，按自身规则显示原生安装入口或提示。

## 当前部署

2026-10-26 已部署到 Cloudflare Worker `kurokawa-logistics-pwa`，路由为 `kurokawa-logistics.com/pwa/*`。更新后的 `publish.js` 已通过 Obsidian Publish 发布。

已验证[线上 Manifest](https://kurokawa-logistics.com/pwa/manifest.webmanifest) 和四个图标均返回正确的内容类型，且与本地文件完全一致；Chrome 地址栏已显示原生的「安装“黑川物流”」按钮。浏览器主动弹出安装提示的时机仍由其自身规则决定。

主页与安装按钮脚本也已发布，线上文件与本地一致。在 Chrome 中点击主页的「安装黑川物流」，已验证会打开浏览器原生的「安装应用」窗口；验证后取消，未实际安装。

同日已发布 `pwa_install_click` / `pwa_view` 统计及用户提供的白底圆标图标。新图标使用 `-v2.png` 文件名，Manifest 和四个新图标均已核对线上文件与本地一致；旧图标文件继续保留。PWA 模式识别、导航去重、前后台切换、安装按钮与 Google tag 复用已通过本地模拟检查，GA4 报表入库仍需在账户内查看。

同日已发布主页入口的状态切换和清单自引用。Chrome 实测已安装的同一资料中会显示「在 PWA 中打开」，点击后成功进入本站独立应用窗口，应用内隐藏整个安装区域；主屏幕提示也已在线上确认。安装检测是异步的，读取清单完成后才会更新按钮。

Cloudflare Worker 使用 Static Assets，无需运行自定义 Worker 脚本。资源的本地路径与公开网址对应如下：

| 文件 | 公开网址 |
|---|---|
| `public/pwa/manifest.webmanifest` | `https://kurokawa-logistics.com/pwa/manifest.webmanifest` |
| `public/pwa/icons/` 中的图片 | `https://kurokawa-logistics.com/pwa/icons/` 下的同名图片 |

`wrangler.jsonc` 只绑定 `kurokawa-logistics.com/pwa/*`，不接管正文、首页或 `KK-L.com` 的跳转。`workers.dev` 和部署预览网址均关闭，应用统一使用现有主站域名。这个项目不注册浏览器 Service Worker，不提供离线缓存。

## 本地检查

在仓库根目录运行：

```sh
npm --prefix pwa install
npm --prefix pwa run check
npm --prefix pwa run dev
```

启动后可以打开 `http://127.0.0.1:8787/pwa/manifest.webmanifest` 检查 JSON，也可以检查其中的每个图标地址。端口 8787 只用于本地预览安装资源，不是主站的完整预览。

## 发布到 Cloudflare

首次使用 Wrangler 时，在终端运行 `npx --prefix pwa wrangler login`，并选择有权管理 `kurokawa-logistics.com` 的 Cloudflare 账号。然后在仓库根目录运行：

```sh
npm --prefix pwa run deploy
```

Wrangler 会部署名为 `kurokawa-logistics-pwa` 的静态资源 Worker，并创建配置中指定的路由。若账号下有多个 Cloudflare 账户，可在当前终端设置 `CLOUDFLARE_ACCOUNT_ID` 指向主站所属账户；不要把令牌或本机凭据写进仓库。

如果通过 Cloudflare 插件或控制台部署，上传 `public/` 内的资源，保留 `pwa/` 这一层路径，并把同一个 Worker 绑定到以下 Route：

```text
kurokawa-logistics.com/pwa/*
```

这是现有主站的一条路径路由，不要把整个 `kurokawa-logistics.com` 配成该静态资源 Worker 的 Custom Domain。控制台里的路由入口为 `Workers & Pages → 该 Worker → Settings → Domains & Routes → Add → Route`，区域选择 `kurokawa-logistics.com`。部署前查看已有路由，保留其他用途的配置。

在 Obsidian 的「发布更改」里发布更新后的 `publish.js`，它会为页面引入主站上的 Manifest 和图标。本目录不通过 Obsidian Publish 发布。

## 验证安装识别

1. 访问公开的 Manifest URL，确认响应是 JSON，且内容类型为 `application/manifest+json`，不是 Publish 的 HTML 页面。
2. 确认 Manifest 中的图标地址能够直接打开，图像尺寸与声明一致。
3. 用尚未安装本站应用的 Chrome 或 Edge 打开主站，在开发者工具的 `Application → Manifest` 查看浏览器解析结果和安装问题。
4. 正常浏览并与网页交互，观察浏览器提供的安装入口或提示。浏览器会考虑设备支持、互动情况、是否已安装及用户此前的选择，网站不能保证每次打开都弹出安装窗口。
5. 安装后检查名称、图标、独立窗口和标题栏配色；页面的 `theme-color` 在浏览器支持时覆盖 Manifest 的默认主题色。

主页复用同一块安装区域，按浏览器状态显示不同入口：

| 状态 | 显示内容 |
|---|---|
| 浏览器提供 `beforeinstallprompt` | 显示主页原有的安装按钮文案，点击调起原生安装窗口 |
| `getInstalledRelatedApps()` 确认本站 PWA 已安装 | 按钮改为「在 PWA 中打开」 |
| 没有可用的安装入口，或浏览器不支持检测 | 隐藏按钮，显示「你还可以将 黑川物流 添加到主屏幕来获得最完整的体验。」 |
| 已在 PWA 独立窗口内浏览 | 隐藏整块安装区域 |

安装入口保留浏览器默认推广行为，每个安装事件只使用一次。取消安装后回到主屏幕提示；收到 `appinstalled` 后改为打开入口。在浏览器返回前台时重新检查安装状态，检测失败时保留当前入口，不用 Cookie 或本地标记猜测是否安装。

安装检测依赖 Manifest 的 `related_applications` 自引用，应用 ID 为 `https://kurokawa-logistics.com/`，清单地址为 `/pwa/manifest.webmanifest`；保持 `prefer_related_applications: false`，仍推广本 PWA。桌面 Chrome/Edge 140+ 和 Android Chrome 的相关版本支持检测；无法跨浏览器、跨资料检测安装，Safari 等平台显示主屏幕提示。

「在 PWA 中打开」在真实点击回调中同步调用 `window.open(当前页面, '_blank', 'noopener')`，为浏览器提供可交给应用捕获的新顶层导航。是否启动已安装的应用取决于浏览器及用户的链接打开设置；用户禁用应用链接捕获时可能打开普通标签页。它不会被记为 `pwa_install_click`，只有真正进入独立窗口后才记录 `pwa_view`。

区域支持 Publish 异步加载、站内切换与堆叠窗格，继续使用主页的 `data-pwa-install-ui` / `data-pwa-install` 标记及 `.cuigeng-hint` 提示文字。安装文案与原提示可以在主页编辑，脚本在切换状态时保留并恢复它们；修改入口结构需同时发布主页和 `publish.js`。

后续替换图标或修改 Manifest 时，更新 `public/` 后重新部署即可；浏览器可能稍后才更新已安装应用的信息。

替换图标应使用新文件名并更新 Manifest 的 `icons.src`，Apple 图标还要同步修改 `publish.js` 中的 `apple-touch-icon` 链接。保持 Manifest 地址和 `id` 不变，以继续识别为同一个应用。新版桌面 Chrome 可能要求用户审阅名称和图标的变化；Safari 等平台不能保证旧安装图标自动更新，可能需要重新添加。参见 [Chrome 的 Manifest 更新机制](https://developer.chrome.com/blog/improvements-to-web-app-updates)和 [PWA 元数据更新的平台差异](https://web.dev/learn/pwa/update)。

## Google Analytics 统计

`publish.js` 向本站现有 GA4 媒体资源 `G-39LLSCKKW6` 发送两个 PWA 自定义事件：

| 事件名称 | 记录时机 | 人数口径 |
|---|---|---|
| `pwa_install_click` | 点击主页有效的安装按钮，先调起原生提示，再发送事件 | 点击过主页安装按钮的用户数，不表示完成安装；地址栏安装入口不在此点击统计内 |
| `pwa_view` | 独立应用窗口首次查看、切换笔记或回到前台 | 在选定日期范围内通过独立应用窗口查看本站的用户数 |

在 GA4 的事件报告中按上述名称筛选，看「总用户数」了解去重人数，看「事件数」了解行为次数。两个数据直接使用事件名称和内置用户指标，不需要创建自定义维度；常规报表处理需要时间，可先用实时报告检查事件。

`pwa_view` 根据 `(display-mode: standalone)` 或 Apple 的 `navigator.standalone` 判断当前窗口，不把普通浏览器标签页计入。页面隐藏时不记录，重复导航通知和同页锚点跳转不会重复记录；回到前台会新记一条。因此其事件数表示查看记录次数，不是启动次数或会话数。GA4 在选定日期范围内自行去重用户，脚本不生成用户标识。

统计与原有催更事件共用 Google tag，已有 `gtag` 时复用；未加载时按需加载一次，兜底配置不额外发送 `page_view`。没有安装成功或卸载事件。数据从发布后开始累计，统计拦截、Cookie 清除和设备差异会影响覆盖与去重。

## 配置来源

- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/)：静态文件可以直接部署，未命中的文件返回 404。
- [Cloudflare Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)：路由可限定为现有域名的一个路径。
- [Chrome 安装条件](https://web.dev/articles/install-criteria)：安装配置、HTTPS、图标和浏览器互动条件。
- [已安装应用检测](https://developer.chrome.com/docs/capabilities/get-installed-related-apps)：浏览器支持及清单自引用配置。
- [PWA 导航管理](https://developer.chrome.com/docs/capabilities/pwa-navigation-management)：链接捕获和用户偏好。

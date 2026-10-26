# 黑川物流 PWA 安装资源

这个目录将安装配置和应用图标托管到主站的 `/pwa/` 路径。内容继续由 Obsidian Publish 提供；浏览器从主站读取 Manifest 后，按自身规则显示原生安装入口或提示。

## 当前部署

2026-10-26 已部署到 Cloudflare Worker `kurokawa-logistics-pwa`，路由为 `kurokawa-logistics.com/pwa/*`。更新后的 `publish.js` 已通过 Obsidian Publish 发布。

已验证[线上 Manifest](https://kurokawa-logistics.com/pwa/manifest.webmanifest) 和四个图标均返回正确的内容类型，且与本地文件完全一致；Chrome 地址栏已显示原生的「安装“黑川物流”」按钮。浏览器主动弹出安装提示的时机仍由其自身规则决定。

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

网站不会拦截 `beforeinstallprompt`，也不会添加自定义安装弹窗。后续替换图标或修改 Manifest 时，更新 `public/` 后重新部署即可；浏览器可能稍后才更新已安装应用的信息。

## 配置来源

- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/)：静态文件可以直接部署，未命中的文件返回 404。
- [Cloudflare Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)：路由可限定为现有域名的一个路径。
- [Chrome 安装条件](https://web.dev/articles/install-criteria)：安装配置、HTTPS、图标和浏览器互动条件。

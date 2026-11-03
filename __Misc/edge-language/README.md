# Obsidian Publish 页面语言修正

Obsidian Publish 最初返回的 HTML 声明为 `<html lang="en">`，正文及自定义脚本随后才加载。`publish.js` 修改的是运行后的 DOM，可能晚于 Chrome 的首次语言检测。本 Worker 在浏览器解析前，将正常 HTML 页面的根元素改为 `lang="zh-CN"`，并增加 `Content-Language: zh-CN`。

它不禁用翻译，不添加 `notranslate`，也不翻译正文。Chrome 仍会综合页面声明、正文模型和用户偏好判断语言，不能保证所有混合语言页面都被同样识别。

## 当前部署

2026-11-03 已部署，主站 Route ID 为 `10350655d1644176ac688919b7b590d3`，请求限额模式已确认 `request_limit_fail_open: true`；`workers.dev` 与预览地址均关闭。现有 `/pwa/*` 路由保持原样。

线上首页和普通笔记均返回中文 HTML/HTTP 声明，首页正文与修正前逐字节比较只有根元素语言不同。PWA 清单与图标仍与本地资源一致。Chrome 的 Detection Logs 实测：修正前 HTML 语言及 Adopted language 为 `en`；修正后的 Content-Language、HTML 语言及 Adopted language 均为 `zh-CN`，两次首次采样都显示尚无正文，验证了初始声明对本站的影响。

`npm test` 的 8 项真实运行时检查通过，涵盖原内容及独立响应头保留、压缩、流式处理，以及非页面响应透传。

## 路由与边界

- Worker：`kurokawa-logistics-language`。
- Route：`kurokawa-logistics.com/*`，通过 `fetch(request)` 继续使用现有 Obsidian Publish 源站，不替换 DNS 或设置 Worker Custom Domain。
- 原有 `kurokawa-logistics.com/pwa/*` 更具体，继续交给独立的 PWA 静态资源 Worker。
- 仅修改状态为 200、类型为 `text/html` 的 GET/HEAD 响应；附件、JSON、POST、重定向及错误响应直接返回。
- HTML 使用流式 HTMLRewriter，只修改根元素语言；保留正文、脚本、CSP、Cookie 和缓存策略，移除已不适用于新正文的长度与校验头。
- 保留 `publish.js` 中的中文声明作为兜底。`KK-L.com` 仍跳转到主站。

## 本地检查与部署

```sh
npm --prefix __Misc/edge-language ci
npm --prefix __Misc/edge-language run check
npm --prefix __Misc/edge-language test
npm --prefix __Misc/edge-language run build
```

本地测试使用 Miniflare 的真实 HTMLRewriter 和本地模拟源站，不向外部网站发送测试请求。`build` 仅执行 Wrangler dry run。

通过已连接的 Cloudflare 插件或有权限的 Wrangler 账号部署。先上传脚本，在临时检查路径验证，再绑定主站路由。修改路由前检查已有配置，保留 `/pwa/*`。本功能不是安全控制，应将新增路由的请求限额模式设为 **fail open**：超出免费请求额度时回到原始 Publish 页面，而非阻断网站。不要为此开启付费计划。

回滚时，只删除或停用本 Worker 的主站 Route 即可恢复直接访问 Publish；不要删除 PWA 路由，不需要改 DNS。

## 验证

用 `curl` 检查原始响应，应该同时看到：

```http
Content-Language: zh-CN
```

```html
<html lang="zh-CN">
```

检查首页、普通笔记及 `/pwa/manifest.webmanifest`，确认后者仍是未被改写的 Manifest。Chrome 可以在 `chrome://translate-internals/` 的 Detection Logs 中查看本次采样的 HTML 语言、HTTP 语言和最终采用的语言。页面语言识别可能被缓存，验证时使用完整刷新或新标签页。

## 依据

- [Chrome 语言声明合并逻辑](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/components/translate/core/language_detection/language_detection_util.cc)：有效的根元素 `lang` 优先于 HTTP 语言声明，正文模型也参与判断。
- [Cloudflare HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)：流式修改 HTML。
- [Cloudflare Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)：在现有源站前运行 Worker，最具体路径优先。

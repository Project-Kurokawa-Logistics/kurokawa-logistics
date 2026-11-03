// Obsidian Publish 的原始页面仍声明为英语；在浏览器解析前修正语言。
// 此 Worker 使用 Route 访问现有源站，不作为站点的 Custom Domain 源站。
export default {
  async fetch(request) {
    const upstream = await fetch(request);
    const contentType = (upstream.headers.get('content-type') || '')
      .split(';')[0].trim().toLowerCase();

    // 只处理正常的页面读取，原样保留 API、附件、重定向和错误响应。
    if ((request.method !== 'GET' && request.method !== 'HEAD') ||
        upstream.status !== 200 || contentType !== 'text/html') {
      return upstream;
    }

    const response = new Response(upstream.body, upstream);
    response.headers.set('Content-Language', 'zh-CN');
    // 内容已变化，不能继续使用源站正文长度或内容校验值。
    for (const header of ['content-length', 'etag', 'content-md5', 'digest',
      'content-digest', 'repr-digest', 'last-modified']) {
      response.headers.delete(header);
    }

    if (request.method === 'HEAD' || !response.body) return response;
    return new HTMLRewriter().on('html', {
      element(element) {
        element.setAttribute('lang', 'zh-CN');
      }
    }).transform(response);
  }
};

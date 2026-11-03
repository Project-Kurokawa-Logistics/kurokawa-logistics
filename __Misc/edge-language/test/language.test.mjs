import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { after, before, test } from 'node:test';
import { Miniflare } from 'miniflare';

const html = '<!doctype html><html lang="en" data-site="publish"><head>' +
  '<base href="https://publish.obsidian.md"><title>黑川物流</title>' +
  '<script>const example = \'<html lang="en">\';</script></head>' +
  '<body><!-- <html lang="en"> --><main>中文正文 &amp; English</main></body></html>';
const rewritten = html.replace('<html lang="en" data-site=', '<html lang="zh-CN" data-site=');
const csp = "default-src 'self'; script-src 'self' https://publish.obsidian.md";
const cookies = ['first=1; Path=/; HttpOnly', 'second=2; Path=/; SameSite=Lax'];
const binary = Buffer.from([0, 255, 17, 128, 60, 104, 116, 109, 108, 0]);
let server;
let mf;
let finishStream;
let streamEnded = false;
const originRequests = [];

function metadata(response, contentType = 'text/html; charset=utf-8') {
  response.setHeader('content-type', contentType);
  response.setHeader('content-security-policy', csp);
  response.setHeader('set-cookie', cookies);
  response.setHeader('etag', '"upstream-en"');
  response.setHeader('last-modified', 'Tue, 03 Nov 2026 00:00:00 GMT');
  response.setHeader('content-md5', 'obsolete-body-hash');
  response.setHeader('digest', 'sha-256=obsolete');
  response.setHeader('content-digest', 'sha-256=:obsolete:');
  response.setHeader('repr-digest', 'sha-256=:obsolete:');
  response.setHeader('cache-control', 'public, max-age=60');
  response.setHeader('x-upstream', 'preserved');
}

before(async () => {
  server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    originRequests.push({ method: request.method, url: request.url,
      body: Buffer.concat(chunks), marker: request.headers['x-request-marker'] });
    const path = new URL(request.url, 'http://local.test').pathname;
    if (path === '/binary') {
      metadata(response, 'image/png');
      response.end(binary);
    } else if (path === '/json') {
      metadata(response, 'application/json');
      response.end('{"language":"en","example":"<html lang=\\"en\\">"}');
    } else if (path === '/redirect') {
      metadata(response);
      response.writeHead(302, { location: '/target' });
      response.end(html);
    } else if (path === '/error') {
      metadata(response);
      response.writeHead(404);
      response.end(html);
    } else if (path === '/empty') {
      response.writeHead(204, { 'x-upstream': 'preserved' });
      response.end();
    } else if (path === '/missing-language') {
      metadata(response, 'Text/HTML; charset=UTF-8');
      response.end('<!doctype html><HTML class="publish"><head></head><body>中文</body></HTML>');
    } else if (path === '/gzip') {
      metadata(response);
      const compressed = gzipSync(html);
      response.setHeader('content-encoding', 'gzip');
      response.setHeader('content-length', compressed.length);
      response.end(compressed);
    } else if (path === '/stream') {
      metadata(response);
      response.flushHeaders();
      // A substantial first segment also crosses normal runtime stream-buffer thresholds.
      response.write('<!doctype html><html lang="en"><head></head><body>' + '首段'.repeat(32768));
      finishStream = () => {
        if (response.writableEnded) return;
        streamEnded = true;
        response.end('<p>最后一段</p></body></html>');
      };
    } else {
      metadata(response);
      response.setHeader('content-length', Buffer.byteLength(html));
      response.end(html);
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  mf = new Miniflare({
    cf: false,
    telemetry: { enabled: false },
    workers: [{ config: {
      name: 'language',
      compatibilityDate: '2026-11-03',
      manifest: {
        mainModule: 'index.js',
        modules: { 'index.js': {
          type: 'esm',
          contents: await readFile(new URL('../src/index.js', import.meta.url), 'utf8')
        } }
      }
    } }],
    upstream: `http://127.0.0.1:${server.address().port}`
  });
});

after(async () => {
  finishStream?.();
  await mf?.dispose();
  server?.closeAllConnections();
  if (server?.listening) await new Promise(resolve => server.close(resolve));
});

function fetchPage(path, options) {
  return mf.dispatchFetch('https://kurokawa-logistics.com' + path, options);
}

test('rewrites only the root HTML language and retains page contents and independent headers', async () => {
  const response = await fetchPage('/welcome?check=language', {
    headers: { 'x-request-marker': 'passed-to-origin' }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-language'), 'zh-CN');
  assert.equal(await response.text(), rewritten);
  assert.equal(response.headers.get('content-security-policy'), csp);
  assert.deepEqual(response.headers.getSetCookie(), cookies);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=60');
  assert.equal(response.headers.get('x-upstream'), 'preserved');
  assert.equal(originRequests.at(-1).url, '/welcome?check=language');
  assert.equal(originRequests.at(-1).marker, 'passed-to-origin');
  for (const header of ['etag', 'last-modified', 'content-md5', 'digest', 'content-digest', 'repr-digest']) {
    assert.equal(response.headers.get(header), null, header + ' must not describe the old body');
  }
});

test('adds a missing root language, including uppercase HTML MIME and tag names', async () => {
  const response = await fetchPage('/missing-language');
  assert.equal(response.headers.get('content-language'), 'zh-CN');
  assert.match(await response.text(), /<HTML class="publish" lang="zh-CN">/);
});

test('passes JSON and binary responses through byte-for-byte with original metadata', async () => {
  for (const [path, expected] of [
    ['/binary', binary],
    ['/json', Buffer.from('{"language":"en","example":"<html lang=\\"en\\">"}')]
  ]) {
    const response = await fetchPage(path);
    assert.equal(response.headers.get('content-language'), null);
    assert.equal(response.headers.get('etag'), '"upstream-en"');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
  }
});

test('preserves redirects, error HTML and no-body status responses', async () => {
  const redirect = await fetchPage('/redirect', { redirect: 'manual' });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('location'), '/target');
  assert.equal(redirect.headers.get('content-language'), null);
  assert.equal(await redirect.text(), html);
  const error = await fetchPage('/error');
  assert.equal(error.status, 404);
  assert.equal(error.headers.get('content-language'), null);
  assert.equal(await error.text(), html);
  const empty = await fetchPage('/empty');
  assert.equal(empty.status, 204);
  assert.equal(await empty.text(), '');
});

test('passes POST request bodies through and does not rewrite an HTML POST response', async () => {
  const response = await fetchPage('/post', { method: 'POST', body: 'test-payload' });
  assert.equal(response.headers.get('content-language'), null);
  assert.equal(await response.text(), html);
  assert.equal(originRequests.at(-1).method, 'POST');
  assert.equal(originRequests.at(-1).body.toString(), 'test-payload');
});

test('HEAD provides corrected language metadata without creating a response body', async () => {
  const response = await fetchPage('/welcome', { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-language'), 'zh-CN');
  assert.equal(response.headers.get('content-security-policy'), csp);
  assert.equal(response.headers.get('etag'), null);
  assert.equal(await response.text(), '');
  assert.equal(originRequests.at(-1).method, 'HEAD');
});

test('rewrites a gzip-compressed upstream response without corrupting its body', async () => {
  const response = await fetchPage('/gzip');
  assert.equal(response.headers.get('content-language'), 'zh-CN');
  assert.equal(await response.text(), rewritten);
});

test('streams the rewritten first segment before the upstream response is complete', async () => {
  const deadline = (promise, stage) => Promise.race([
    promise,
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error(stage + ' buffered before origin completed')), 3000);
      timer.unref();
    })
  ]);
  try {
    const response = await deadline(fetchPage('/stream', {
      headers: { 'accept-encoding': 'identity' }
    }), 'Headers');
    const reader = response.body.getReader();
    const first = await deadline(reader.read(), 'First body segment');
    assert.equal(streamEnded, false);
    assert.match(new TextDecoder().decode(first.value), /<html lang="zh-CN">/);
    finishStream();
    const remaining = [];
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      remaining.push(chunk.value);
    }
    assert.match(Buffer.concat(remaining).toString(), /最后一段/);
  } finally {
    finishStream?.();
  }
});

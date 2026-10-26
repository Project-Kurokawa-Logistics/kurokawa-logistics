/* ========================================================================
 * 黑川物流 · Obsidian Publish 自定义脚本
 *
 * 功能目录
 *   01 · 站点语言：声明页面主要使用简体中文。
 *   02 · 页面外观：浏览器配色与按笔记属性设置的页面背景图。
 *   03 · 催更按钮：点击统计、共享计数及按钮反馈。
 *   04 · KKN 语法高亮：已停用，历史代码保留备用。
 *   05 · PWA：原生安装入口、安装按钮点击统计与独立窗口使用统计。
 *
 * 外部服务
 *   Google Analytics：03 / 05 记录催更点击、PWA 安装按钮点击及 PWA 查看。
 *     复用已有 Google tag；尚未加载时从 googletagmanager.com 加载。
 *   Abacus / abacus.jasoncameron.dev：03 保存、读取累计催更点击次数。
 *   02 使用 Publish 已加载的笔记缓存；背景图由浏览器从填写的链接加载。
 *   05 从主站 /pwa/ 加载安装配置与图标；资源部署说明见仓库 pwa/README.md。
 *
 * 发布方式：将本文件放在 Obsidian 仓库根目录，在「发布更改」中发布。
 * 自定义 JavaScript 需要绑定自定义域名；修改后刷新网页以加载新脚本。
 * ======================================================================== */


/* ========================================================================
 * 01 · 站点语言
 * ========================================================================
 * Publish 默认输出 <html lang="en">。改为 zh-CN，让翻译提示和
 * 读屏软件识别页面主要语言；这不会翻译页面正文。
 * ======================================================================== */
document.documentElement.lang = 'zh-CN';


/* ========================================================================
 * 02 · 页面外观（theme-color + background-image）
 * ========================================================================
 * 用法：给笔记添加文本属性 theme-color，例如 "#2563EB"。
 * 背景用法：文本属性 background-image 填图片链接；background-mode 可选。
 * 倾斜用法：数字属性 background-rotation 填角度，正数顺时针、负数逆时针。
 * 显示模式：居中填充（默认）、平铺、拉伸、居中、适应。
 * 背景只叠加在所属笔记窗格的主题底色上，以 5% 不透明度显示。
 * 堆叠窗格分别使用各自笔记的背景属性，导航栏和其他窗格不受影响。
 * 时机：首次加载以及 Publish 的 navigated（切换笔记）事件。
 *
 * Android Chrome 等支持的浏览器可据此调整地址栏等界面配色。
 * 桌面 Chrome 的普通标签页不会因此变色，安装的网页应用可以使用；
 * 最终效果取决于浏览器、版本和设置，脚本只提供颜色建议。
 *
 * 笔记缓存和导航事件属于 Publish 内部接口。升级后若接口不可用，
 * 本功能会在有限次数的尝试后停止连接。
 * ======================================================================== */
(function () {
  /* ---------- 配置与状态 ---------- */

  // 默认留空：未填写或填写无效时恢复原配色。可改成 '#2563EB'。
  var DEFAULT_COLOR = '';
  // 0.05 表示图片只显示 5%，其余 95% 为当前明亮 / 暗黑主题底色。
  var BACKGROUND_OPACITY = 0.05;
  // 只保存本功能创建的 meta，便于恢复时保留网站原有标签。
  var themeMeta = null;
  var backgroundStyle = null;
  var rotatedBackgrounds = new WeakMap();
  var backgroundResizeObserver = null;
  var attempts = 0;

  /* ---------- 校验属性 ---------- */

  // 本功能只接受文本形式的 #RGB / #RRGGBB；首尾空格会被忽略。
  // 浏览器支持更多 CSS 颜色写法，这里主动限定格式以方便维护。
  function parseColor(value) {
    if (typeof value !== 'string') return '';
    var color = value.trim();
    return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : '';
  }

  // 使用完整的 HTTP(S) 图片链接；CSS 字符串另行转义，不能注入样式。
  function parseImageUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      var url = new URL(value.trim());
      return /^(https?:)$/.test(url.protocol) ? url.href : '';
    } catch (e) {
      return '';
    }
  }

  function parseBackgroundMode(value) {
    var mode = typeof value === 'string' ? value.trim().toLowerCase() : '';
    switch (mode) {
      case '平铺': case 'tile':
        return { size: 'auto', repeat: 'repeat' };
      case '拉伸': case 'stretch':
        return { size: '100% 100%', repeat: 'no-repeat' };
      case '居中': case 'center':
        return { size: 'auto', repeat: 'no-repeat' };
      case '适应': case 'contain':
        return { size: 'contain', repeat: 'no-repeat' };
      default:
        // 未填写、居中填充 / cover 或无法识别的值都按壁纸逻辑填满。
        return { size: 'cover', repeat: 'no-repeat' };
    }
  }

  function parseBackgroundRotation(value) {
    if (typeof value === 'string' && value.trim()) value = Number(value);
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
    return value % 360;
  }

  /* ---------- 更新网页 meta ---------- */

  function applyColor(color) {
    if (!color) {
      // 当前笔记没有颜色时清除上一笔记的覆盖，恢复原有配色。
      if (themeMeta && themeMeta.parentNode) {
        themeMeta.parentNode.removeChild(themeMeta);
      }
      return;
    }
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
    }
    themeMeta.content = color;
    // 放在 head 最前面，优先于原有 theme-color；原标签仍保留。
    if (!themeMeta.parentNode) {
      document.head.insertBefore(themeMeta, document.head.firstChild);
    }
  }

  /* ---------- 独立背景层与明暗主题 ---------- */

  function clearBackgroundRotation(pane) {
    var state = rotatedBackgrounds.get(pane);
    if (state) {
      backgroundResizeObserver.unobserve(pane);
      state.layer.remove();
      rotatedBackgrounds.delete(pane);
    }
    pane.classList.remove('has-rotated-note-background');
    pane.style.removeProperty('--note-background-rotation');
  }

  function resizeRotatedBackground(pane, state) {
    var width = state.layer.clientWidth;
    var height = state.layer.clientHeight;
    if (!width || !height) return;
    var radians = state.rotation * Math.PI / 180;
    var cosine = Math.abs(Math.cos(radians));
    var sine = Math.abs(Math.sin(radians));
    var paintWidth = width;
    var paintHeight = height;
    if (state.mode.size === 'contain') {
      // 缩小绘制区域，使旋转后的整个矩形仍在窗格内，保留完整图片。
      var scale = Math.min(width / (width * cosine + height * sine),
        height / (width * sine + height * cosine));
      paintWidth = width * scale;
      paintHeight = height * scale;
    } else {
      // 反向旋转窗格四角，得到所需绘制区域；居中 / 平铺保留原图尺寸。
      // 多留 1 像素，避免旋转的抗锯齿边缘出现细缝。
      paintWidth = Math.ceil(width * cosine + height * sine) + 1;
      paintHeight = Math.ceil(width * sine + height * cosine) + 1;
    }
    state.layer.style.setProperty('--note-background-paint-width', paintWidth + 'px');
    state.layer.style.setProperty('--note-background-paint-height', paintHeight + 'px');
  }

  function applyBackgroundRotation(pane, rotation, mode) {
    if (!rotation) {
      clearBackgroundRotation(pane);
      return;
    }
    if (!backgroundResizeObserver) {
      backgroundResizeObserver = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var target = entry.target;
          var state = rotatedBackgrounds.get(target);
          // 已关闭的堆叠窗格无需继续观察，也不保留其装饰节点。
          if (!target.isConnected) clearBackgroundRotation(target);
          else if (state) resizeRotatedBackground(target, state);
        });
      });
    }
    var state = rotatedBackgrounds.get(pane);
    if (!state) {
      var layer = document.createElement('div');
      layer.className = 'note-background-layer';
      layer.setAttribute('aria-hidden', 'true');
      state = { layer: layer };
      rotatedBackgrounds.set(pane, state);
      pane.appendChild(layer);
      backgroundResizeObserver.observe(pane);
    }
    state.rotation = rotation;
    state.mode = mode;
    pane.style.setProperty('--note-background-rotation', rotation + 'deg');
    pane.classList.add('has-rotated-note-background');
    resizeRotatedBackground(pane, state);
  }

  function applyBackground(pane, imageUrl, mode, rotation) {
    if (!imageUrl) {
      clearBackgroundRotation(pane);
      pane.classList.remove('has-note-background');
      pane.style.removeProperty('--note-background-image');
      pane.style.removeProperty('--note-background-size');
      pane.style.removeProperty('--note-background-repeat');
      return;
    }

    if (!backgroundStyle) {
      backgroundStyle = document.createElement('style');
      // 样式随脚本发布；只在有背景图的笔记窗格、屏幕显示时生效。
      var mask = 'color-mix(in srgb, var(--background-primary) ' +
        ((1 - BACKGROUND_OPACITY) * 100) + '%, transparent)';
      backgroundStyle.textContent = [
        '@media screen {',
        '  .published-container .publish-renderer.has-note-background {',
        '    background-color: var(--background-primary);',
        // 底色不透明，避免堆叠时透出后面笔记的文字和图片。
        '    background-image: linear-gradient(' + mask + ', ' + mask + '),',
        '      var(--note-background-image);',
        '    background-position: center;',
        '    background-size: auto, var(--note-background-size);',
        '    background-repeat: no-repeat, var(--note-background-repeat);',
        // 正文在窗格内部滚动，图片始终按所属窗格的尺寸适配。
        '    background-attachment: scroll;',
        '  }',
        // 独立裁切层只旋转图片，保留正文、sticky 窗格和弹窗的定位。
        '  .published-container .publish-renderer.has-rotated-note-background {',
        '    background-image: none; isolation: isolate;',
        '  }',
        '  body:not(.sliding-windows) .publish-renderer.has-rotated-note-background {',
        '    position: relative;',
        '  }',
        '  .has-rotated-note-background > .note-background-layer {',
        '    position: absolute; inset: 0; overflow: hidden;',
        '    pointer-events: none; z-index: -1;',
        '  }',
        '  .has-rotated-note-background > .note-background-layer::before {',
        '    content: ""; position: absolute; left: 50%; top: 50%;',
        '    width: var(--note-background-paint-width, 100%);',
        '    height: var(--note-background-paint-height, 100%);',
        '    transform: translate(-50%, -50%) rotate(var(--note-background-rotation));',
        '    opacity: ' + BACKGROUND_OPACITY + ';',
        '    background-image: var(--note-background-image);',
        '    background-position: center;',
        '    background-size: var(--note-background-size);',
        '    background-repeat: var(--note-background-repeat);',
        '  }',
        '}',
        '@media print { .note-background-layer { display: none; } }'
      ].join('\n');
      document.head.appendChild(backgroundStyle);
    }
    pane.style.setProperty('--note-background-image',
      'url(' + JSON.stringify(imageUrl) + ')');
    pane.style.setProperty('--note-background-size', mode.size);
    pane.style.setProperty('--note-background-repeat', mode.repeat);
    pane.classList.add('has-note-background');
    applyBackgroundRotation(pane, rotation, mode);
  }

  /* ---------- 接入 Publish 的笔记缓存与导航 ---------- */

  function connectPublish() {
    var publish = window.publish;
    var cache = publish && publish.site && publish.site.cache;
    var container = document.querySelector('.published-container');
    if (!publish || !publish.render || !cache || !container ||
        typeof cache.getCache !== 'function' || typeof publish.on !== 'function') {
      // 当前 Publish 会先加载缓存再执行本脚本；这是兼容性兜底。
      // 如果接口尚未准备好，每 200 毫秒重试，最多等待约 10 秒。
      if (++attempts < 50) setTimeout(connectPublish, 200);
      return;
    }

    function updateAppearance() {
      // 使用实际笔记路径读取属性，因此笔记设置 permalink 也能找到。
      var filepath = publish.render.currentFilepath;
      var file = filepath && !container.classList.contains('has-not-found')
        ? cache.getCache(filepath) : null;
      var properties = file && file.frontmatter;
      var color = parseColor(properties && properties['theme-color']);
      applyColor(color || parseColor(DEFAULT_COLOR));
      // 堆叠模式保留多个 renderer，必须逐一读取各自的实际笔记路径。
      // 背景属性写在所属窗格上，切换焦点不会覆盖其他已打开的笔记。
      var renderers = Array.isArray(publish.stack) ? publish.stack.slice() : [];
      if (renderers.indexOf(publish.render) === -1) renderers.push(publish.render);
      for (var i = 0; i < renderers.length; i++) {
        var renderer = renderers[i];
        var pane = renderer && renderer.renderContainerEl;
        if (!pane) continue;
        var paneFile = renderer.currentFilepath
          ? cache.getCache(renderer.currentFilepath) : null;
        var paneProperties = paneFile && paneFile.frontmatter;
        applyBackground(pane,
          parseImageUrl(paneProperties && paneProperties['background-image']),
          parseBackgroundMode(paneProperties && paneProperties['background-mode']),
          parseBackgroundRotation(paneProperties && paneProperties['background-rotation']));
      }
    }

    // 站内切换通常不会整页刷新，必须随导航更新，避免沿用上一页颜色。
    // 普通跳转、前进后退及滑动窗格切换均由 Publish 处理并通知。
    publish.on('navigated', updateAppearance);
    // Publish 的 404 页面不会触发 navigated，补充清理上一页的外观。
    var wasNotFound = container.classList.contains('has-not-found');
    new MutationObserver(function () {
      var isNotFound = container.classList.contains('has-not-found');
      if (isNotFound !== wasNotFound) {
        wasNotFound = isNotFound;
        updateAppearance();
      }
    }).observe(container, { attributes: true, attributeFilter: ['class'] });
    // 脚本加载时也立即同步一次，覆盖当前已经打开的笔记。
    updateAppearance();
  }

  connectPublish();
})();


/* ---------- 03 / 05 共用的 Google Analytics 事件入口 ---------- */
// 只在需要发送事件时加载；沿用站点现有 GA4 媒体资源。
var kurokawaTrackEvent = (function () {
  var GA_ID = 'G-39LLSCKKW6';

  return function (name, parameters) {
    try {
      if (typeof window.gtag !== 'function') {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        // 先配置后发送事件；此兜底不额外发送 page_view，避免重复浏览量。
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { send_page_view: false });
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);
      }
      var details = {
        send_to: GA_ID,
        page_title: document.title,
        page_location: window.location.href
      };
      if (parameters) {
        Object.keys(parameters).forEach(function (key) { details[key] = parameters[key]; });
      }
      window.gtag('event', name, details);
    } catch (error) {
      // 统计被拦截或不可用时，不影响安装提示、阅读或按钮反馈。
    }
  };
})();


/* ========================================================================
 * 03 · 催更按钮（Google Analytics + Abacus + 点击反馈）
 * ========================================================================
 * 页面元素约定：
 *   [data-cuigeng]       · 可点击的催更按钮。
 *   [data-cuigeng-count] · 显示累计次数的容器。
 *   [data-cuigeng-num]   · 容器内显示数字的元素。
 *
 * 点击后分别执行三件事：
 *   A. 向 Google Analytics 记录 cuigeng_click，含当前页面标题和地址。
 *   B. 请求 Abacus 将本站共享计数加 1，再更新页面上的数字。
 *   C. 按钮显示「已收到催更」，3 秒后恢复。
 *
 * 计数表示点击次数，不代表独立人数；反馈动画期间再次点击也会计数。
 * 两个网络请求分别处理失败，按钮反馈不等待它们返回。
 * ======================================================================== */
(function () {
  /* ---------- 配置 ---------- */

  // Abacus 是独立计数服务，和 02 的 theme-color 功能没有关联。
  // {op} 替换为 get（只读）或 hit（加 1）；后两段标识本站的共享计数。
  var COUNTER_URL =
    'https://abacus.jasoncameron.dev/{op}/kurokawa-logistics/cuigeng-homepage';

  /* ---------- B · Abacus 共享点击计数 ---------- */

  // 更新当前页面全部计数容器，包括同一内容的多个显示位置。
  function setCountDisplays(n) {
    var els = document.querySelectorAll('[data-cuigeng-count]');
    for (var i = 0; i < els.length; i++) {
      var num = els[i].querySelector('[data-cuigeng-num]');
      if (num) num.textContent = String(n);
      els[i].hidden = false;
    }
  }

  // increment=false 只读取，true 加 1；失败或无数字时返回 null。
  // 失败时调用方跳过数字更新，不会主动隐藏已经显示的数字。
  function fetchCount(increment, callback) {
    var url = COUNTER_URL.replace('{op}', increment ? 'hit' : 'get');
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        callback(typeof d.value === 'number' ? d.value : null);
      })
      .catch(function () { callback(null); });
  }

  // Publish 稍后才插入正文，每秒检查计数容器是否出现。
  // 本次整页生命周期内只读取一次；站内返回首页不会自动再次读取。
  var countPolled = false;
  setInterval(function () {
    if (countPolled) return;
    if (!document.querySelector('[data-cuigeng-count]')) return;
    countPolled = true;
    fetchCount(false, function (n) {
      if (n !== null) setCountDisplays(n);
    });
  }, 1000);

  /* ---------- C · 点击入口与按钮反馈 ---------- */

  // 在 document 上处理点击，让站内切换后新插入的按钮也能响应。
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest
      ? e.target.closest('[data-cuigeng]')
      : null;
    if (!btn) return;

    // A. 记录点击事件（不等待计数服务）。
    kurokawaTrackEvent('cuigeng_click', {
      event_category: 'engagement',
      event_label: 'homepage_welcome'
    });

    // B. 累计次数加 1，成功后显示返回的数字（包括 0）。
    fetchCount(true, function (n) {
      if (n !== null) setCountDisplays(n);
    });

    // C. 立即给出 3 秒反馈；期间不重复启动动画，但仍记录每次点击。
    if (!btn.dataset.cuigengDone) {
      btn.dataset.cuigengDone = '1';
      var original = btn.innerHTML;
      btn.classList.add('cuigeng-btn--done');
      btn.innerHTML = '✅ 已收到催更！';
      setTimeout(function () {
        btn.innerHTML = original;
        btn.classList.remove('cuigeng-btn--done');
        delete btn.dataset.cuigengDone;
      }, 3000);
    }
  });
})();

/* ========================================================================
 * 04 · KKN（胶兽语伪终端）语法高亮 · 已停用
 * ========================================================================
 * 下方代码全部保持注释，不会执行，也不影响前三项功能。
 *
 * 主题考量：黑川表面机械、内里人情 → 报文保持纯黑白更像人在说话；
 *          龙珀表面人情、内里条框 → 彩色 log 才有异化感（故 log 保留）。
 *
 * 恢复方式：仅去掉下方从 (function () { 到 })(); 代码行的行首 "// "。
 * 保留这一段说明注释；恢复后需要重新发布 publish.js 并验证效果。
 * ======================================================================== */
// 历史 KKN 高亮代码（含非 BMP 图标代理对修复）：
// (function () {
//   var VERB_ICON_ALT = '󰘳|󰲽|||||||||||||||';
//
//   function defineKkn() {
//     if (!window.Prism || !Prism.languages) return false;
//     if (Prism.languages.kkn) return true;
//
//     Prism.languages.kkn = {
//       'frame': {
//         pattern: /[⏇⏈]/,
//         alias: 'important'
//       },
//       'verb': {
//         pattern: new RegExp('(^|[\\n\\r])[ \\t　]*(' + VERB_ICON_ALT + ')(?=　)', 'm'),
//         lookbehind: true,
//         alias: 'keyword'
//       },
//       'separator': {
//         pattern: /%{3,}|-{3,}/m,
//         alias: 'comment'
//       },
//       'job': {
//         pattern: /＃\d{1,3}/,
//         alias: 'number'
//       },
//       'string': [
//         /"[^"\n]*"/,
//         /「[^」\n]*」/
//       ],
//       'property': {
//         pattern: /[^\s　：｜、，。！？%]+(?=：|:)/,
//         alias: 'property'
//       },
//       'arrow': {
//         pattern: /[→←↑↓]+/,
//         alias: 'operator'
//       },
//       'number': /\b\d+(?:\.\d+)?%?\b/
//     };
//     Prism.languages.KKN = Prism.languages.kkn;
//     return true;
//   }
//
//   function rehighlight() {
//     if (!window.Prism || !Prism.languages || !Prism.languages.kkn) return;
//     if (typeof Prism.highlightElement !== 'function') return;
//     var blocks = document.querySelectorAll('code');
//     for (var i = 0; i < blocks.length; i++) {
//       var el = blocks[i];
//       if (!/language-["']?kkn["']?/i.test(el.className)) continue;
//       el.textContent = el.textContent;
//       try { Prism.highlightElement(el); } catch (e) {}
//     }
//   }
//
//   var attempts = [0, 800, 2500, 6000];
//   for (var i = 0; i < attempts.length; i++) {
//     (function (delay) {
//       setTimeout(function () {
//         if (defineKkn()) rehighlight();
//       }, delay);
//     })(attempts[i]);
//   }
// })();


/* ========================================================================
 * 05 · PWA 安装配置与使用统计
 * ========================================================================
 * /pwa/ 下的 Manifest 和图标由 Cloudflare 单独托管；详见 pwa/README.md。
 * Manifest 声明应用名称、图标、启动页、独立窗口和默认主题色。
 * 主页按钮：可安装时调用原生提示；检测到已安装时请求在应用中打开。
 * 不能提供安装入口时显示添加到主屏幕的提示；在应用窗口内隐藏该区域。
 * 保存 beforeinstallprompt，但不取消默认行为，保留浏览器自身的安装推广。
 * 是否弹出以及何时弹出，取决于浏览器、访问互动和用户之前的安装选择。
 * GA4：pwa_install_click 记录有效安装按钮点击；pwa_view 记录独立窗口查看。
 * ======================================================================== */
(function () {
  /* ---------- 主页安装按钮 ---------- */

  var installPrompt = null;
  var installed = false;
  var installationCheck = 0;
  var standalone = window.matchMedia
    ? window.matchMedia('(display-mode: standalone)') : null;

  function isPwaWindow() {
    return !!((standalone && standalone.matches) ||
      (window.navigator && window.navigator.standalone));
  }

  function canPromptInstall() {
    return !!installPrompt && !installed && !isPwaWindow();
  }

  /* ---------- PWA 查看人数：按事件的「总用户数」查看 ---------- */

  var lastPwaLocation = null;
  function trackPwaView() {
    if (!isPwaWindow()) {
      lastPwaLocation = null;
      return;
    }
    if (document.visibilityState === 'hidden') return;
    // 同页锚点、重复导航通知不重复计数；切换笔记或返回上一页可再次记录。
    var location = window.location.href.split('#')[0];
    if (location === lastPwaLocation) return;
    lastPwaLocation = location;
    kurokawaTrackEvent('pwa_view');
  }

  // 常驻应用回到前台也记录一次，覆盖隔日继续使用同一页面的情况。
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') lastPwaLocation = null;
    else trackPwaView();
  });

  var navigationAttempts = 0;
  function connectPwaAnalytics() {
    var publish = window.publish;
    if (publish && publish.render && typeof publish.on === 'function') {
      publish.on('navigated', trackPwaView);
      trackPwaView();
      return;
    }
    // Publish 正文稍后加载；最多等待约 10 秒，然后仍可记录独立窗口访问。
    if (++navigationAttempts < 50) setTimeout(connectPwaAnalytics, 200);
    else trackPwaView();
  }
  connectPwaAnalytics();

  function updateInstallButtons() {
    var mode = isPwaWindow() ? 'hidden' : installed ? 'open' :
      canPromptInstall() ? 'install' : 'help';
    var areas = document.querySelectorAll('[data-pwa-install-ui]');
    for (var i = 0; i < areas.length; i++) {
      var area = areas[i];
      area.hidden = mode === 'hidden';
      // 现有 flex 样式可能覆盖浏览器默认的 [hidden]，因此同时控制 display。
      area.style.display = mode === 'hidden' ? 'none' : '';
      var button = area.querySelector('[data-pwa-install]');
      if (button) {
        if (button._pwaInstallLabel === undefined) button._pwaInstallLabel = button.textContent;
        var label = mode === 'open' ? '在 黑川物流 中打开' : button._pwaInstallLabel;
        // 仅在文案变化时写入，避免触发正文观察器的循环。
        if (button.textContent !== label) button.textContent = label;
        var available = mode === 'install' || mode === 'open';
        button.hidden = !available;
        button.style.display = available ? '' : 'none';
        button.disabled = !available;
      }
      var hint = area.querySelector('.cuigeng-hint');
      if (hint) {
        if (hint._pwaInstallHint === undefined) hint._pwaInstallHint = hint.textContent;
        var description = mode === 'help'
          ? '您还可以将 黑川物流 添加到主屏幕来获得最完整的体验。'
          : mode === 'open' ? '以独立应用窗口打开本站' : hint._pwaInstallHint;
        if (hint.textContent !== description) hint.textContent = description;
      }
    }
  }

  function checkInstalledPwa() {
    if (isPwaWindow() || !window.navigator ||
        typeof window.navigator.getInstalledRelatedApps !== 'function') return;
    var check = ++installationCheck;
    try {
      window.navigator.getInstalledRelatedApps().then(function (apps) {
        if (check !== installationCheck) return;
        // 只识别本站 PWA，不能把其他关联应用当成本站已安装。
        installed = apps.some(function (app) {
          if (app.platform !== 'webapp') return false;
          try {
            if (app.id) return new URL(app.id, origin + '/').href === origin + '/';
            return new URL(app.url, origin + '/').href ===
              origin + '/pwa/manifest.webmanifest';
          } catch (error) { return false; }
        });
        if (installed) installPrompt = null;
        updateInstallButtons();
      }, function () {
        // 不支持或拒绝检测时保留当前可用入口，不猜测安装状态。
      });
    } catch (error) {
      // 接口存在但不可用时保留原生安装/主屏幕提示。
    }
  }

  function clearInstallPrompt(event) {
    if (installPrompt !== event) return;
    installPrompt = null;
    updateInstallButtons();
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    if (typeof event.prompt !== 'function') return;
    ++installationCheck;
    installed = false;
    // 不调用 preventDefault：浏览器仍可按自身策略展示原生推广。
    installPrompt = event;
    updateInstallButtons();
    // 用户也可能从地址栏安装；原生提示被接受或关闭后，旧事件不可再次使用。
    if (event.userChoice && typeof event.userChoice.then === 'function') {
      event.userChoice.then(function () { clearInstallPrompt(event); },
        function () { clearInstallPrompt(event); });
    }
  });

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest
      ? event.target.closest('[data-pwa-install]') : null;
    if (!button || isPwaWindow()) return;
    if (installed) {
      // 新的无 opener 顶层导航可交给浏览器捕获到已安装的应用。
      // 是否交给 PWA 仍取决于浏览器支持和用户的“在应用中打开链接”设置。
      window.open(window.location.href, '_blank', 'noopener');
      return;
    }
    if (!canPromptInstall()) return;
    var promptEvent = installPrompt;
    // 每个事件只能调用一次 prompt；先清除，防止连续点击重复弹出。
    installPrompt = null;
    updateInstallButtons();
    try {
      // 必须直接在用户点击回调中调用，保留浏览器要求的用户操作状态。
      var result = promptEvent.prompt();
      if (result && typeof result.catch === 'function') result.catch(function () {});
    } catch (error) {
      // 浏览器已使用或撤销该事件时，等待下一次可安装通知。
    }
    // 先同步调起原生提示，再发送统计；点击不等于用户确认安装。
    kurokawaTrackEvent('pwa_install_click');
  });

  window.addEventListener('appinstalled', function () {
    ++installationCheck;
    installed = true;
    installPrompt = null;
    updateInstallButtons();
  });
  if (standalone && typeof standalone.addEventListener === 'function') {
    standalone.addEventListener('change', function () {
      updateInstallButtons();
      trackPwaView();
      checkInstalledPwa();
    });
  }
  window.addEventListener('focus', checkInstalledPwa);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'hidden') checkInstalledPwa();
  });
  // Publish 正文异步插入、站内跳转及堆叠窗格都会产生新的主页按钮。
  new MutationObserver(function () {
    updateInstallButtons();
  }).observe(document.body, { childList: true, subtree: true });
  updateInstallButtons();

  /* ---------- 安装清单与图标 ---------- */

  // Publish 设置了指向 obsidian.md 的 <base>，必须明确使用当前网页域名。
  var origin = window.location.origin;

  if (!document.querySelector('link[rel="manifest"]')) {
    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.type = 'application/manifest+json';
    manifest.href = origin + '/pwa/manifest.webmanifest';
    manifest.addEventListener('load', checkInstalledPwa);
    document.head.appendChild(manifest);
  }

  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    var icon = document.createElement('link');
    icon.rel = 'apple-touch-icon';
    icon.sizes = '180x180';
    icon.href = origin + '/pwa/icons/apple-touch-icon-v2.png';
    document.head.appendChild(icon);
  }

  ['application-name', 'apple-mobile-web-app-title'].forEach(function (name) {
    if (document.querySelector('meta[name="' + name + '"]')) return;
    var meta = document.createElement('meta');
    meta.name = name;
    meta.content = '黑川物流';
    document.head.appendChild(meta);
  });
  checkInstalledPwa();
})();

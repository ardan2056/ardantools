/* ===== Ardan Tools — core app: icons, utilities, router, layout, pages ===== */
(function () {
  'use strict';

  /* ---------- Icons (stroke, 24x24) ---------- */
  var P = {
    logo: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/>',
    fileImage: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.3-1.3a2 2 0 0 0-2.8 0L10 22"/>',
    type: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    braces: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    minimize: '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',
    resize: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    merge: '<path d="m8 6 4-4 4 4"/><path d="M12 2v10.3a4 4 0 0 1-1.17 2.87L4 22"/><path d="m20 22-5-5"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
    binary: '<rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4M14 10h4M6 14h2v6M14 4h2v6"/>',
    table: '<path d="M12 3v18"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>',
    case: '<path d="m3 15 4-8 4 8"/><path d="M4 13h6"/><circle cx="18" cy="12" r="3"/><path d="M21 9v6"/>',
    markdown: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 15V9l3 3 3-3v6"/><path d="M17 9v6l-2-2m2 2 2-2"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    pen: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    userX: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5M22 8l-5 5"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    gift: '<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>',
    grip: '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><circle cx="16" cy="8" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/>',
    arrowUp: '<path d="m18 15-6-6-6 6"/>',
    arrowDown: '<path d="m6 9 6 6 6-6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    wifi: '<path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    send: '<path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
    wand: '<path d="m15 4 5 5M3 21l12-12M14 4l1-1M20 10l1-1M17 3h.01M21 7h.01"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.grid) + '</svg>';
  }

  /* ---------- Utilities ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function formatBytes(b) {
    if (!isFinite(b)) return '—';
    if (b < 1024) return b + ' B';
    var u = ['KB', 'MB', 'GB'], i = -1;
    do { b /= 1024; i++; } while (b >= 1024 && i < u.length - 1);
    return (b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2)) + ' ' + u[i];
  }
  function toast(msg, type) {
    var wrap = $('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'toast' + (type === 'error' ? ' error' : '');
    t.innerHTML = icon(type === 'error' ? 'alert' : 'checkCircle', 'icon-sm') + '<span>' + esc(msg) + '</span>';
    wrap.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, 2200);
  }
  function copyText(text, label) {
    if (!text) { toast('Nothing to copy yet', 'error'); return Promise.resolve(false); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
      ta.remove(); return ok;
    }
    var p = (navigator.clipboard && navigator.clipboard.writeText) ? navigator.clipboard.writeText(text).then(function () { return true; }, fallback) : Promise.resolve(fallback());
    return p.then(function (ok) { toast(ok ? (label || 'Copied to clipboard') : 'Copy failed: select and copy manually', ok ? '' : 'error'); return ok; });
  }
  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function baseName(name) { return name.replace(/\.[^.]+$/, ''); }
  function uniqueName(name, used) {
    if (!used[name]) { used[name] = 1; return name; }
    var b = baseName(name), ext = name.slice(b.length), n = used[name]++;
    return b + '-' + n + ext;
  }
  var scriptCache = {};
  function loadScript(src) {
    if (scriptCache[src]) return scriptCache[src];
    scriptCache[src] = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { res(); };
      s.onerror = function () { delete scriptCache[src]; rej(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
    return scriptCache[src];
  }
  var assetBase = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/js\/app\.js.*$/, '') : '';
  })();
  function asset(p) { return assetBase + p; }
  var LIB = {
    zip: function () { return loadScript(asset('vendor/jszip.min.js')).then(function () { return window.JSZip; }); },
    pdflib: function () { return loadScript(asset('vendor/pdf-lib.min.js')).then(function () { return window.PDFLib; }); },
    marked: function () { return loadScript(asset('vendor/marked.umd.js')).then(function () { return window.marked; }); },
    pdfjs: function () {
      if (LIB._pdfjs) return LIB._pdfjs;
      LIB._pdfjs = import(asset('vendor/pdf.min.mjs')).then(function (m) {
        var lib = m.GlobalWorkerOptions ? m : (m.default || m);
        lib.GlobalWorkerOptions.workerSrc = asset('vendor/pdf.worker.min.mjs');
        return lib;
      });
      LIB._pdfjs.catch(function () { LIB._pdfjs = null; });
      return LIB._pdfjs;
    },
    heic: function () {
      return loadScript('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js')
        .catch(function () { return loadScript('https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js'); })
        .then(function () { return window.heic2any; });
    }
  };
  function zipAndDownload(items, zipName) {
    return LIB.zip().then(function (JSZip) {
      var zip = new JSZip(), used = {};
      items.forEach(function (it) { zip.file(uniqueName(it.name, used), it.blob); });
      return zip.generateAsync({ type: 'blob' });
    }).then(function (blob) { download(blob, zipName); toast('ZIP archive ready'); });
  }

  /* ---------- Router ---------- */
  var ROUTES = ['/', '/about', '/privacy', '/terms', '/contact'];
  var MODE = (function () {
    if (location.protocol === 'file:' || /^#\//.test(location.hash)) return 'hash';
    var p = location.pathname.replace(/\/index\.html$/, '/');
    if (ROUTES.indexOf(p) >= 0 || /^\/(tools|categories)\//.test(p)) return 'path';
    return 'hash';
  })();
  function href(path) { return MODE === 'path' ? path : '#' + path; }
  function currentPath() {
    if (MODE === 'path') return location.pathname.replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1') || '/';
    var h = location.hash.replace(/^#/, '');
    return h.charAt(0) === '/' ? h : '/';
  }
  function navigate(path) {
    if (MODE === 'path') { history.pushState({}, '', path); render(); }
    else location.hash = path;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-link]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (MODE === 'path') { e.preventDefault(); navigate(a.getAttribute('data-path')); }
  });
  window.addEventListener('popstate', function () { if (MODE === 'path') render(); });
  window.addEventListener('hashchange', function () { if (MODE === 'hash') render(); });

  function L(path, inner, cls, extra) {
    return '<a href="' + href(path) + '" data-link data-path="' + path + '"' + (cls ? ' class="' + cls + '"' : '') + (extra || '') + '>' + inner + '</a>';
  }

  /* ---------- Layout ---------- */
  var LOGO = '<span style="font-weight:800;font-size:19px;line-height:1;letter-spacing:-.04em">A</span>';
  function header(active) {
    var nav = Object.keys(CATEGORIES).map(function (k) {
      return L('/categories/' + k, esc(CATEGORIES[k].name), active === k ? 'active' : '');
    }).join('');
    var mob = Object.keys(CATEGORIES).map(function (k) {
      return L('/categories/' + k, icon(CATEGORIES[k].icon) + esc(CATEGORIES[k].navLabel));
    }).join('') + L('/about', icon('info') + 'About') + L('/contact', icon('mail') + 'Contact');
    return '<header class="site-header"><div class="container header-inner">' +
      L('/', '<span class="logo-mark">' + LOGO + '</span><span class="logo-text"><span class="logo-name">' + esc(SITE.name) + '</span><span class="logo-tag">' + esc(SITE.tagline) + '</span></span>', 'logo', ' aria-label="' + esc(SITE.name) + ' home"') +
      '<nav class="main-nav" aria-label="Categories">' + nav + '</nav>' +
      '<div class="header-right">' +
      '<span class="pill pill-green" title="All processing happens in your browser"><span class="dot"></span>Browser-Only</span>' +
      '<div class="lang-menu"><button class="pill lang-btn" id="langBtn" aria-haspopup="true">' + icon('globe', 'icon-sm') + 'EN' + icon('chevronDown', 'icon-sm') + '</button>' +
      '<div class="lang-pop" id="langPop"><button type="button">English ' + icon('check', 'icon-sm') + '</button></div></div>' +
      L('/about', 'About', 'header-about') +
      '<button class="menu-toggle" id="menuToggle" aria-label="Open menu">' + icon('menu') + '</button>' +
      '</div></div><nav class="mobile-nav" id="mobileNav">' + mob + '</nav></header>';
  }
  function trustStrip() {
    var items = [
      ['shieldCheck', '100% Client-Side Privacy', 'Your files stay in your browser. Nothing is ever uploaded or stored on a server.'],
      ['zap', 'Client-Side Execution', 'Zero network latency. Processing runs instantly on your local device.'],
      ['userX', 'No Registration Required', 'Free and unlimited. No accounts, no email, no credit cards.']
    ];
    return '<section class="trust-strip"><div class="container trust-grid">' + items.map(function (i) {
      return '<div class="trust-item"><span class="t-icon">' + icon(i[0]) + '</span><div><h4>' + i[1] + '</h4><p>' + i[2] + '</p></div></div>';
    }).join('') + '</div></section>';
  }
  function footer() {
    var cats = Object.keys(CATEGORIES).map(function (k) { return '<li>' + L('/categories/' + k, esc(CATEGORIES[k].navLabel)) + '</li>'; }).join('');
    var pop = POPULAR.map(function (s) { return '<li>' + L('/tools/' + s, esc(TOOL_MAP[s].name)) + '</li>'; }).join('');
    return trustStrip() + '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><h5>Tools by Category</h5><ul>' + cats + '</ul></div>' +
      '<div><h5>Popular Tools</h5><ul>' + pop + '</ul></div>' +
      '<div><h5>Company &amp; Legal</h5><ul><li>' + L('/privacy', 'Privacy Policy') + '</li><li>' + L('/terms', 'Terms of Service') + '</li><li>' + L('/about', 'About Us') + '</li><li>' + L('/contact', 'Contact') + '</li></ul></div>' +
      '<div><div class="footer-brand"><span class="logo-mark">' + LOGO + '</span><span class="logo-name">' + esc(SITE.name) + '</span></div>' +
      '<div class="promise-box"><div class="p-head">' + icon('shieldCheck', 'icon-sm') + 'Privacy Promise</div><p>' + esc(SITE.name) + ' operates strictly client-side. WebAssembly and native Web APIs run locally in your browser, so no images, documents, or data are ever transmitted to external servers.</p></div></div>' +
      '</div><div class="footer-bottom"><span>© ' + SITE.year + ' ' + esc(SITE.name) + '. Fast · Free · Private · Zero Server Uploads.</span><span>Crafted for speed, privacy, and modern creative workflows</span></div></div></footer>';
  }
  function adSlot(type) {
    var a = ADS[type] || ADS.creative;
    return '<div class="ad-wrap"><div class="ad-label">Advertisement</div><div class="ad-card">' +
      '<span class="ad-icon" style="background:' + a.color + '">' + icon(a.icon, 'icon-lg') + '</span>' +
      '<div class="ad-body"><div class="ad-tags"><span class="ad-tag">' + esc(a.tag) + '</span><span class="ad-sponsored">Sponsored</span></div>' +
      '<h4>' + esc(a.title) + '</h4><div class="ad-sub">' + esc(a.sub) + '</div><p>' + esc(a.text) + '</p></div>' +
      '<div class="ad-cta">' + (/^\//.test(a.href) ? L(a.href, esc(a.cta) + icon('arrowRight', 'icon-sm'), 'btn btn-dark') : '<a class="btn btn-dark" href="' + esc(a.href) + '" target="_blank" rel="noopener sponsored">' + esc(a.cta) + icon('arrowRight', 'icon-sm') + '</a>') +
      '<span class="ad-verified">' + icon('checkCircle', 'icon-sm') + 'Verified external partner</span></div></div></div>';
  }
  function toolCard(t) {
    var c = CATEGORIES[t.cat];
    return '<article class="tool-card cat-' + t.cat + '"><div class="tool-card-top"><span class="tool-icon">' + icon(t.icon) + '</span><span class="cat-label">' + esc(c.name) + '</span></div>' +
      '<h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p>' + L('/tools/' + t.slug, 'Use Tool ' + icon('arrowRight', 'icon-sm'), 'btn btn-sm card-link') + '</article>';
  }
  function setMeta(title, desc) {
    document.title = title;
    var m = $('meta[name=description]');
    if (m && desc) m.setAttribute('content', desc);
  }

  /* ---------- Pages ---------- */
  function pageHome() {
    setMeta(SITE.name + ' — Fast, Free & Private Online Utilities', 'Free browser-based tools for images, PDFs, text, and developers. Files never leave your device.');
    var counts = { all: TOOLS.length };
    TOOLS.forEach(function (t) { counts[t.cat] = (counts[t.cat] || 0) + 1; });
    var tabs = [['all', 'All Tools']].concat(Object.keys(CATEGORIES).map(function (k) { return [k, CATEGORIES[k].name]; }));
    var feats = [
      ['lock', 'True In-Browser Privacy', 'Your files are processed in your device\'s memory. They never reach our servers, so there is nothing to leak, log, or sell.'],
      ['cpu', 'Instant Processing', 'No upload queue and no download-link delay. Work happens on your local CPU using WebAssembly and native web APIs.'],
      ['gift', 'No Sign-Up or Paywalls', 'Every tool is unlimited and free. No email, no credit card, and no subscription required.']
    ];
    var html = header('') + '<main>' +
      '<section class="hero"><div class="container">' +
      '<div class="hero-eyebrow"><span class="spark">' + icon('sparkles', 'icon-sm') + '</span>Fast · 100% Free · Private · Zero Signup</div>' +
      '<h1>Essential Online Utilities, <span class="grad-text">Zero Server Uploads.</span></h1>' +
      '<p class="lead">Convert, compress, resize, format, and generate content directly in your browser. Your files never leave your device.</p>' +
      '<div class="hero-trust-bar"><span class="ht-item">' + icon('checkCircle', 'icon-sm') + '100% Free</span><span class="ht-sep">•</span><span class="ht-item">' + icon('shieldCheck', 'icon-sm') + 'No Registration</span><span class="ht-sep">•</span><span class="ht-item">' + icon('zap', 'icon-sm') + 'Client-Side</span></div>' +
      '<div class="hero-cta"><a href="#all-tools" class="btn btn-primary btn-lg" id="exploreBtn">' + icon('grid') + 'Explore All Tools</a>' + L('/about', 'How it works', 'btn btn-lg') + '</div>' +
      '</div></section>' +
      '<section class="section section-tools" id="all-tools"><div class="container">' +
      '<div class="section-head"><span class="kicker">' + icon('grid', 'icon-sm') + 'Tool Directory</span><h2>All Free Utilities</h2><p>Select any tool to start instant, private processing.</p></div>' +
      '<div class="tool-search">' + icon('search') + '<input type="search" id="toolSearch" placeholder="Search tools… e.g. compress image, pdf, json, svg, uuid" autocomplete="off" aria-label="Search tools"><button class="clear-search" id="clearSearch" aria-label="Clear search">' + icon('x') + '</button></div>' +
      '<div class="filter-tabs" role="tablist">' + tabs.map(function (t, i) {
        return '<button class="filter-tab' + (i === 0 ? ' active' : '') + '" data-filter="' + t[0] + '" role="tab">' + t[1] + '<span class="count">' + counts[t[0]] + '</span></button>';
      }).join('') + '</div>' +
      '<div class="tool-grid" id="toolGrid"></div>' +
      '</div></section>' +
      '<section class="section-sm"><div class="container" style="max-width:900px">' + adSlot('creative') + '</div></section>' +
      '<section class="section"><div class="container"><div class="section-head"><span class="kicker">Why ' + esc(SITE.name) + '</span><h2>Engineered for Speed &amp; Absolute Privacy</h2><p>Built on modern web standards so the work happens on your device, not ours.</p></div>' +
      '<div class="feature-grid">' + feats.map(function (f) { return '<div class="feature-card"><span class="f-icon">' + icon(f[0]) + '</span><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div></div></section>' +
      '</main>' + footer();
    app.innerHTML = html;

    var filter = 'all', q = '';
    var grid = $('#toolGrid'), input = $('#toolSearch'), clr = $('#clearSearch');
    function draw() {
      var words = q.toLowerCase().split(/\s+/).filter(Boolean);
      var list = TOOLS.filter(function (t) {
        if (filter !== 'all' && t.cat !== filter) return false;
        var hay = (t.name + ' ' + t.desc + ' ' + t.keywords + ' ' + t.cat + ' ' + t.label).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) >= 0; });
      });
      grid.innerHTML = list.length ? list.map(toolCard).join('') :
        '<div class="empty-state" style="grid-column:1/-1"><h3>No tools found</h3><p>Try a different keyword, like "pdf", "image", or "json".</p></div>';
      clr.style.display = q ? 'block' : 'none';
    }
    input.addEventListener('input', function () { q = input.value.trim(); draw(); });
    clr.addEventListener('click', function () { input.value = ''; q = ''; draw(); input.focus(); });
    $$('.filter-tab').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.filter-tab').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); filter = b.getAttribute('data-filter'); draw();
      });
    });
    $('#exploreBtn').addEventListener('click', function (e) { e.preventDefault(); $('#all-tools').scrollIntoView({ behavior: 'smooth' }); });
    draw();
  }

  function pageCategory(key) {
    var c = CATEGORIES[key];
    if (!c) return pageNotFound();
    setMeta(c.title + ' | ' + SITE.name, c.desc);
    var list = TOOLS.filter(function (t) { return t.cat === key; });
    var others = Object.keys(CATEGORIES).filter(function (k) { return k !== key; });
    app.innerHTML = header(key) + '<main><div class="container">' +
      '<nav class="breadcrumb" aria-label="Breadcrumb">' + L('/', 'Home') + '<span class="sep">›</span><span class="current">' + esc(c.title) + '</span>' + L('/#all-tools', 'All Categories', 'all-cats') + '</nav>' +
      '<div class="tool-head cat-' + key + '"><span class="cat-label">' + list.length + ' tools</span><h1 style="margin-top:12px">' + esc(c.title) + '</h1><p class="intro">' + esc(c.desc) + '</p></div>' +
      '<div class="tool-grid">' + list.map(toolCard).join('') + '</div>' +
      '<div style="margin:44px 0">' + adSlot(key === 'developer' ? 'developer' : key === 'image' ? 'creative' : 'privacy') + '</div>' +
      '<div class="content-block" style="margin-bottom:56px"><h2>Explore Other Categories</h2><div class="cat-overview">' + others.map(function (k) {
        var cc = CATEGORIES[k], n = TOOLS.filter(function (t) { return t.cat === k; }).length;
        return L('/categories/' + k, '<span class="tool-icon">' + icon(cc.icon) + '</span><h3>' + esc(cc.title) + '</h3><p>' + n + ' tools · ' + esc(cc.desc) + '</p>', 'cat-tile cat-' + k);
      }).join('') + '</div></div>' +
      '</div></main>' + footer();
  }

  function staticPage(title, sub, body, metaDesc) {
    setMeta(title + ' | ' + SITE.name, metaDesc || sub);
    app.innerHTML = header('') + '<main><div class="container"><section class="page-hero"><h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</section>' + body + '<div style="height:60px"></div></div></main>' + footer();
  }
  function pageAbout() {
    staticPage('About ' + esc(SITE.name), 'Fast. Free. Private. No Signup.',
      '<div class="prose-card">' +
      '<h2>Why We Built This Platform</h2>' +
      '<p>Students, developers, and office workers constantly need small, simple tasks done: converting HEIC photos to JPG, resizing images, merging PDF pages, counting words, or formatting JSON.</p>' +
      '<p>Most utility sites make these jobs harder than they should be, with fake download buttons, slow upload queues, forced registration, and subscription fees. Yet modern phones and laptops are more than powerful enough to do this work directly in the browser. So we built a toolkit that does exactly that.</p>' +
      '<h2>Our Architectural Principles</h2>' +
      '<div class="principles">' +
      '<div class="principle"><span class="f-icon">' + icon('lock') + '</span><h3>Privacy by Design</h3><p>Files stay on your computer. There are no server databases storing your sensitive records.</p></div>' +
      '<div class="principle"><span class="f-icon">' + icon('cpu') + '</span><h3>Client-Side First</h3><p>Processing uses web standards like Canvas, Web Workers, and Typed Arrays for speed.</p></div>' +
      '<div class="principle"><span class="f-icon">' + icon('zap') + '</span><h3>Zero Friction</h3><p>No accounts, no email gates, no CAPTCHAs, and no subscription traps.</p></div>' +
      '</div>' +
      '<h2>Start Using the Tools</h2><p>Explore our directory of ' + TOOLS.length + ' free utilities for images, PDFs, text, and development.</p>' +
      '<p style="margin-top:16px">' + L('/', icon('grid') + 'Browse all ' + TOOLS.length + ' tools', 'btn btn-primary') + '</p>' +
      '</div>', 'Learn why ' + SITE.name + ' processes everything in your browser.');
  }
  function pagePrivacy() {
    staticPage('Privacy Policy', 'Privacy-first architecture. <br><span class="updated">Last updated: September 2026</span>',
      '<div class="prose-card">' +
      '<h2>Our Technical Privacy Commitment</h2><p>At ' + esc(SITE.name) + ', privacy is built into the architecture rather than being only a legal promise. Our tools run entirely in your web browser using modern technologies such as WebAssembly and the HTML5 Canvas API.</p>' +
      '<h2>1. How Your Data &amp; Files are Handled</h2>' +
      '<h3>Zero Server Uploads</h3><p>Image conversion, JSON formatting, word counting, document compression, and every other operation happen on your own device. Your files are never sent to our servers.</p>' +
      '<h3>No Content Logging</h3><p>We do not view, record, or sell your file contents, filenames, text inputs, or outputs.</p>' +
      '<h2>2. Information We Collect Automatically</h2><p>We collect anonymized, non-identifying usage data to understand how the platform is used and to fix performance problems:</p>' +
      '<ul><li><strong>Tool usage metrics:</strong> page views, completions, error codes, and approximate file-size ranges.</li><li><strong>Device &amp; browser metadata:</strong> browser, operating system, and country-level location, collected via analytics tools such as Google Analytics.</li><li><strong>Strict exclusion:</strong> file contents, text, and filenames are never included in analytics.</li></ul>' +
      '<h2>3. Third-Party Advertising &amp; Cookies</h2><p>Advertising from partners such as Adsterra and Google AdSense keeps these tools free. These partners may use cookies and tracking beacons to show ads based on your previous browsing. You can block cookies in your browser settings or opt out of personalized advertising through the Digital Advertising Alliance (DAA) or the Network Advertising Initiative (NAI).</p>' +
      '<h2>4. Contact Regarding Privacy</h2><p>For privacy questions, technical concerns, or security reports, please reach us through our ' + L('/contact', 'Contact page') + '.</p>' +
      '</div>', 'How ' + SITE.name + ' handles your data: zero server uploads and no content logging.');
  }
  function pageTerms() {
    staticPage('Terms of Service', 'Please read these terms carefully. <br><span class="updated">Last updated: September 2026</span>',
      '<div class="prose-card">' +
      '<h2>1. Acceptance of Terms</h2><p>By accessing or using ' + esc(SITE.name) + ', you agree to be bound by these Terms of Service. If you do not agree, please do not use our utilities.</p>' +
      '<h2>2. Nature of Service &amp; Browser Processing</h2><p>We provide client-side utilities such as image converters, compressors, PDF tools, word counters, and JSON formatters. All processing happens inside your browser, so performance depends on your device and browser.</p>' +
      '<h2>3. Permitted and Prohibited Use</h2><p>You may use the tools only for lawful purposes. You agree not to:</p><ul><li>Reverse-engineer, disrupt, or interfere with the platform.</li><li>Overload the service or use bots and scrapers to generate abusive traffic or bypass security measures.</li><li>Process content that infringes copyright or other intellectual property rights.</li></ul>' +
      '<h2>4. Disclaimer of Warranties</h2><p>The tools are provided "as is" without warranties of any kind. Conversions may not always be lossless, bug-free, or compatible with every legacy system. Always keep backups of your original files.</p>' +
      '<h2>5. Limitation of Liability</h2><p>To the fullest extent permitted by law, ' + esc(SITE.name) + ' is not liable for any direct or indirect damages arising from the use of, or inability to use, the service, including data loss or corruption.</p>' +
      '</div>', 'Terms of Service for ' + SITE.name + '.');
  }
  function pageContact() {
    staticPage('Contact Us', 'Have a tool request, found a bug, or want to partner with us? Send us a message.',
      '<div class="contact-layout"><div class="tool-panel"><form class="contact-form" id="contactForm" novalidate>' +
      '<div class="grid-2"><div class="field"><label for="cName">Name</label><input class="input" id="cName" placeholder="Your name"></div>' +
      '<div class="field"><label for="cEmail">Email Address</label><input class="input" id="cEmail" type="email" placeholder="you@example.com"></div></div>' +
      '<div class="field"><label for="cSubject">Subject <span class="req">*</span></label><select class="input" id="cSubject"><option>Tool Feedback / Suggestion</option><option>Bug Report</option><option>New Feature Request</option><option>Partnership / Inquiries</option></select></div>' +
      '<div class="field"><label for="cMsg">Message</label><textarea class="input" id="cMsg" rows="6" placeholder="Tell us what\'s on your mind…"></textarea></div>' +
      '<button class="btn btn-primary btn-lg" type="submit">' + icon('send') + 'Send Message</button><div id="cStatus"></div></form></div>' +
      '<div style="display:grid;gap:14px;align-content:start">' +
      '<div class="box"><h2 style="font-size:17px">' + icon('mail') + ' Get in touch</h2><p style="color:var(--muted);font-size:14px">We read every message. Tool requests and bug reports help shape the roadmap.</p></div>' +
      '<div class="box"><h2 style="font-size:17px">Popular topics</h2><ul class="check-list"><li>' + icon('check', 'icon-sm') + 'Suggest a new free tool</li><li>' + icon('check', 'icon-sm') + 'Report a file that didn\'t convert</li><li>' + icon('check', 'icon-sm') + 'Advertising &amp; partnerships</li></ul></div>' +
      '</div></div>', 'Contact the ' + SITE.name + ' team.');
    $('#contactForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#cMsg').value.trim(), st = $('#cStatus'), em = $('#cEmail').value.trim();
      if (!msg) { st.innerHTML = '<div class="notice notice-error">' + icon('alert') + 'Please write a message first.</div>'; return; }
      if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { st.innerHTML = '<div class="notice notice-error">' + icon('alert') + 'Please enter a valid email address.</div>'; return; }
      var body = msg + '\n\n— ' + ($('#cName').value.trim() || 'Anonymous') + (em ? ' <' + em + '>' : '');
      var url = 'mailto:' + SITE.contactEmail + '?subject=' + encodeURIComponent('[' + SITE.name + '] ' + $('#cSubject').value) + '&body=' + encodeURIComponent(body);
      st.innerHTML = '<div class="notice notice-info">' + icon('info') + '<span>Your email app should open with the message ready to send. If it doesn\'t, email us at <strong>' + esc(SITE.contactEmail) + '</strong>.</span></div>';
      location.href = url;
    });
  }
  function pageNotFound() {
    staticPage('Page not found', 'The page you are looking for doesn\'t exist or was moved.', '<p style="text-align:center">' + L('/', 'Back to all tools', 'btn btn-primary') + '</p>');
  }

  function pageTool(slug) {
    var t = TOOL_MAP[slug];
    if (!t) return pageNotFound();
    var c = CATEGORIES[t.cat];
    setMeta(t.name + ' - Free & Private Online Utility | ' + SITE.name, t.intro);
    var rel = t.related.map(function (s) { return TOOL_MAP[s]; }).filter(Boolean);
    app.innerHTML = header(t.cat) + '<main><div class="container">' +
      '<nav class="breadcrumb" aria-label="Breadcrumb">' + L('/', 'Home') + '<span class="sep">›</span>' + L('/categories/' + t.cat, esc(c.name)) + '<span class="sep">›</span><span class="current">' + esc(t.name) + '</span></nav>' +
      '<header class="tool-head"><span class="private-badge">' + icon('shieldCheck', 'icon-sm') + esc(t.badge || '100% Private In-Browser Processing') + '</span><h1>' + esc(t.name) + '</h1><p class="intro">' + esc(t.intro) + '</p>' +
      '<div class="formats"><span class="f-label">Supported:</span>' + t.formats.map(function (f) { return '<span class="chip">' + esc(f) + '</span>'; }).join('') + '</div></header>' +
      '<section class="tool-panel" id="toolRoot"></section>' +
      '<section class="content-block"><h2>Related Utilities</h2><div class="related-grid">' + rel.map(function (r) {
        return '<article class="related-card"><span class="r-label">' + esc(r.label) + '</span><h3>' + esc(r.name) + '</h3><p>' + esc(r.desc) + '</p>' + L('/tools/' + r.slug, 'Use Tool ' + icon('arrowRight', 'icon-sm'), 'btn btn-sm card-link', ' style="align-self:flex-start"') + '</article>';
      }).join('') + '</div></section>' +
      '<section class="content-block">' + adSlot(t.ad) + '</section>' +
      '<section class="content-block"><h2>How to Use ' + esc(t.name) + '</h2><div class="steps">' + t.howto.map(function (s, i) {
        return '<div class="step"><span class="s-num">' + (i + 1) + '</span><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
      }).join('') + '</div></section>' +
      '<section class="content-block two-col">' +
      '<div class="box"><h2>Key Features</h2><ul class="check-list">' + t.features.map(function (f) { return '<li>' + icon('checkCircle', 'icon-sm') + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="privacy-callout">' + icon('shieldCheck') + '<span><strong>Privacy Guarantee:</strong> ' + esc(t.privacy) + '</span></div></div>' +
      '<div class="box"><h2>Common Use Cases</h2><ol class="use-list">' + t.uses.map(function (u) { return '<li><span>' + esc(u) + '</span></li>'; }).join('') + '</ol></div>' +
      '</section>' +
      '<section class="content-block" style="margin-bottom:60px"><h2>Frequently Asked Questions</h2><div class="faq">' + t.faq.map(function (f, i) {
        return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(f[0]) + '<span class="chev">' + icon('chevronDown') + '</span></summary><p>' + esc(f[1]) + '</p></details>';
      }).join('') + '</div></section>' +
      '</div></main>' + footer();
    var impl = window.TOOL_IMPL && window.TOOL_IMPL[slug];
    var root = $('#toolRoot');
    if (impl) {
      try { impl(root, t); } catch (err) { console.error(err); root.innerHTML = '<div class="notice notice-error">' + icon('alert') + 'This tool failed to start: ' + esc(err.message) + '</div>'; }
    }
  }

  /* ---------- Render ---------- */
  var app;
  var cleanup = [];
  function render() {
    cleanup.forEach(function (fn) { try { fn(); } catch (e) { } });
    cleanup = [];
    var path = currentPath(), m;
    var anchor = null;
    if (MODE === 'path' && location.hash) anchor = location.hash.slice(1);
    if (MODE === 'hash' && path.indexOf('#') > 0) { anchor = path.split('#')[1]; path = path.split('#')[0] || '/'; }
    if (path === '/' || path === '') pageHome();
    else if ((m = path.match(/^\/tools\/([\w-]+)$/))) pageTool(m[1]);
    else if ((m = path.match(/^\/categories\/([\w-]+)$/))) pageCategory(m[1]);
    else if (path === '/about') pageAbout();
    else if (path === '/privacy') pagePrivacy();
    else if (path === '/terms') pageTerms();
    else if (path === '/contact') pageContact();
    else pageNotFound();
    bindHeader();
    if (anchor && document.getElementById(anchor)) document.getElementById(anchor).scrollIntoView();
    else window.scrollTo(0, 0);
  }
  function bindHeader() {
    var mt = $('#menuToggle'), mn = $('#mobileNav'), lb = $('#langBtn'), lp = $('#langPop');
    if (mt) mt.addEventListener('click', function () { mn.classList.toggle('open'); });
    if (lb) lb.addEventListener('click', function (e) { e.stopPropagation(); lp.classList.toggle('open'); });
    if (lp) lp.addEventListener('click', function () { lp.classList.remove('open'); });
  }
  document.addEventListener('click', function () { var lp = $('#langPop'); if (lp) lp.classList.remove('open'); });

  /* ---------- Shared tool helpers ---------- */
  function dropzone(opts) {
    var multi = opts.maxFiles !== 1;
    var el = document.createElement('label');
    el.className = 'dropzone' + (opts.compact ? ' compact' : '');
    el.innerHTML = '<input type="file"' + (multi ? ' multiple' : '') + ' accept="' + esc(opts.accept || '') + '">' +
      '<div class="dz-icon">' + icon('upload') + '</div><h3>' + esc(opts.title) + '</h3><p>' + esc(opts.sub || '') + '</p>' +
      '<p style="margin-top:12px"><span class="dz-browse">Browse files</span> or drag &amp; drop</p>';
    var input = el.querySelector('input');
    function take(fileList) {
      var files = Array.prototype.slice.call(fileList || []);
      if (!files.length) return;
      var ok = [], rejected = [];
      files.forEach(function (f) {
        if (opts.test && !opts.test(f)) rejected.push(f.name + ' (unsupported format)');
        else if (opts.maxMB && f.size > opts.maxMB * 1048576) rejected.push(f.name + ' (over ' + opts.maxMB + 'MB)');
        else ok.push(f);
      });
      if (opts.maxFiles && ok.length > opts.maxFiles) {
        if (opts.maxFiles === 1) ok = ok.slice(0, 1);
        else { toast('Only the first ' + opts.maxFiles + ' files were added', 'error'); ok = ok.slice(0, opts.maxFiles); }
      }
      if (rejected.length) toast('Skipped: ' + rejected.slice(0, 3).join(', ') + (rejected.length > 3 ? '…' : ''), 'error');
      if (ok.length) opts.onFiles(ok);
      input.value = '';
    }
    input.addEventListener('change', function () { take(input.files); });
    ['dragenter', 'dragover'].forEach(function (ev) { el.addEventListener(ev, function (e) { e.preventDefault(); el.classList.add('drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { el.addEventListener(ev, function (e) { e.preventDefault(); el.classList.remove('drag'); }); });
    el.addEventListener('drop', function (e) { take(e.dataTransfer && e.dataTransfer.files); });
    return el;
  }
  function loadImage(src) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error('Could not decode image')); };
      img.src = src;
    });
  }
  function fileToImage(file) {
    var url = URL.createObjectURL(file);
    return loadImage(url).then(function (img) { img._url = url; return img; }, function (e) { URL.revokeObjectURL(url); throw e; });
  }
  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (res, rej) {
      canvas.toBlob(function (b) { b ? res(b) : rej(new Error('Encoding failed')); }, type, quality);
    });
  }
  function readText(file) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsText(file); });
  }
  function readArrayBuffer(file) {
    if (file.arrayBuffer) return file.arrayBuffer();
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsArrayBuffer(file); });
  }
  function readDataURL(file) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(file); });
  }
  function pickFile(accept) {
    return new Promise(function (res) {
      var i = document.createElement('input'); i.type = 'file'; i.accept = accept || '';
      i.addEventListener('change', function () { res(i.files[0] || null); });
      i.click();
    });
  }

  window.FT = {
    icon: icon, esc: esc, $: $, $$: $$, formatBytes: formatBytes, toast: toast, copyText: copyText, download: download,
    baseName: baseName, LIB: LIB, zipAndDownload: zipAndDownload, dropzone: dropzone, loadImage: loadImage, fileToImage: fileToImage,
    canvasToBlob: canvasToBlob, readText: readText, readArrayBuffer: readArrayBuffer, readDataURL: readDataURL, pickFile: pickFile,
    href: href, link: L, onCleanup: function (fn) { cleanup.push(fn); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    app = document.getElementById('app');
    render();
  });
})();

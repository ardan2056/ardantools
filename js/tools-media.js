/* ===== Image, PDF & QR tools ===== */
(function () {
  'use strict';
  var F = window.FT, icon = F.icon, esc = F.esc;
  var IMPL = window.TOOL_IMPL = window.TOOL_IMPL || {};
  var MIME_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

  function supportsWebP() {
    try { return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0; } catch (e) { return false; }
  }
  function makeCanvas(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  /* High-quality draw: steps down by halves for large reductions */
  function drawScaled(img, w, h, bg) {
    var sw = img.naturalWidth || img.width, sh = img.naturalHeight || img.height, src = img;
    while (sw / 2 > w && sh / 2 > h) {
      var tmp = makeCanvas(sw / 2, sh / 2), tc = tmp.getContext('2d');
      tc.imageSmoothingQuality = 'high'; tc.drawImage(src, 0, 0, tmp.width, tmp.height);
      src = tmp; sw = tmp.width; sh = tmp.height;
    }
    var c = makeCanvas(w, h), ctx = c.getContext('2d');
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }
  function colorField(id, val) {
    return '<span class="color-input"><input type="color" id="' + id + '" value="' + val + '"><input type="text" id="' + id + 'Hex" value="' + val + '" maxlength="7" spellcheck="false"></span>';
  }
  function bindColor(root, id, onChange) {
    var c = F.$('#' + id, root), t = F.$('#' + id + 'Hex', root);
    c.addEventListener('input', function () { t.value = c.value; onChange && onChange(); });
    t.addEventListener('input', function () { if (/^#[0-9a-f]{6}$/i.test(t.value)) { c.value = t.value; onChange && onChange(); } });
    return function () { return c.value; };
  }

  /* ---------- PNG-8 encoder (palette quantization) for real PNG compression ---------- */
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(bytes) { var c = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function chunk(type, data) {
    var out = new Uint8Array(12 + data.length), dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    for (var i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(data, 8);
    dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
    return out;
  }
  function deflate(bytes) {
    var cs = new CompressionStream('deflate');
    var stream = new Blob([bytes]).stream().pipeThrough(cs);
    return new Response(stream).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function quantize(data, maxColors) {
    // median cut on a sample of pixels (RGBA)
    var n = data.length / 4, step = Math.max(1, Math.floor(n / 120000)), px = [];
    for (var i = 0; i < n; i += step) { var o = i * 4; px.push([data[o], data[o + 1], data[o + 2], data[o + 3]]); }
    var boxes = [px];
    while (boxes.length < maxColors) {
      var bi = -1, best = -1, bd = 0;
      boxes.forEach(function (b, idx) {
        if (b.length < 2) return;
        for (var d = 0; d < 4; d++) {
          var mn = 255, mx = 0;
          for (var j = 0; j < b.length; j++) { var v = b[j][d]; if (v < mn) mn = v; if (v > mx) mx = v; }
          var r = (mx - mn) * (d === 3 ? 1.5 : 1);
          if (r > best) { best = r; bi = idx; bd = d; }
        }
      });
      if (bi < 0 || best <= 0) break;
      var box = boxes[bi].sort(function (a, b) { return a[bd] - b[bd]; }), mid = box.length >> 1;
      boxes.splice(bi, 1, box.slice(0, mid), box.slice(mid));
    }
    return boxes.map(function (b) {
      var s = [0, 0, 0, 0];
      b.forEach(function (p) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3] += p[3]; });
      return s.map(function (v) { return Math.round(v / b.length); });
    });
  }
  function encodePNG8(imgData, maxColors) {
    if (typeof CompressionStream === 'undefined') return Promise.reject(new Error('no CompressionStream'));
    var w = imgData.width, h = imgData.height, d = imgData.data;
    var pal = quantize(d, maxColors), cache = new Map();
    var raw = new Uint8Array((w + 1) * h);
    for (var y = 0; y < h; y++) {
      raw[y * (w + 1)] = 0;
      for (var x = 0; x < w; x++) {
        var o = (y * w + x) * 4, r = d[o], g = d[o + 1], b = d[o + 2], a = d[o + 3];
        var key = (r >> 2) << 18 | (g >> 2) << 12 | (b >> 2) << 6 | (a >> 2), idx = cache.get(key);
        if (idx === undefined) {
          var bestD = Infinity; idx = 0;
          for (var p = 0; p < pal.length; p++) {
            var q = pal[p], dr = q[0] - r, dg = q[1] - g, db = q[2] - b, da = q[3] - a;
            var dist = dr * dr * 2 + dg * dg * 4 + db * db + da * da * 3;
            if (dist < bestD) { bestD = dist; idx = p; }
          }
          cache.set(key, idx);
        }
        raw[y * (w + 1) + 1 + x] = idx;
      }
    }
    var ihdr = new Uint8Array(13), dv = new DataView(ihdr.buffer);
    dv.setUint32(0, w); dv.setUint32(4, h); ihdr[8] = 8; ihdr[9] = 3;
    var plte = new Uint8Array(pal.length * 3), trns = new Uint8Array(pal.length), hasAlpha = false;
    pal.forEach(function (c, i) { plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2]; trns[i] = c[3]; if (c[3] < 255) hasAlpha = true; });
    return deflate(raw).then(function (z) {
      var parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', plte)];
      if (hasAlpha) parts.push(chunk('tRNS', trns));
      parts.push(chunk('IDAT', z), chunk('IEND', new Uint8Array(0)));
      return new Blob(parts, { type: 'image/png' });
    });
  }

  /* ---------- Generic batch image tool ---------- */
  function batchTool(root, t, cfg) {
    var items = [], seq = 0, running = false;
    root.innerHTML = (cfg.optionsHTML ? '<div class="toolbar" style="gap:18px;margin-bottom:18px;align-items:flex-end" id="btOpts">' + cfg.optionsHTML + '</div>' : '') + '<div id="btDrop"></div><div id="btList" class="file-list"></div><div id="btFoot"></div>';
    var drop = F.dropzone({
      accept: t.accept, maxMB: t.maxMB, maxFiles: t.maxFiles, title: t.dropTitle, sub: t.dropSub, test: cfg.test,
      onFiles: function (files) {
        var room = t.maxFiles - items.length;
        if (room <= 0) return F.toast('Queue is full (' + t.maxFiles + ' files max)', 'error');
        if (files.length > room) { F.toast('Only ' + room + ' more file(s) fit in the queue', 'error'); files = files.slice(0, room); }
        files.forEach(function (f) { items.push({ id: ++seq, file: f, url: cfg.noThumb ? '' : URL.createObjectURL(f), status: 'ready' }); });
        if (cfg.onAdd) cfg.onAdd(items);
        draw();
        if (cfg.auto) runAll();
      }
    });
    F.$('#btDrop', root).appendChild(drop);
    if (cfg.bind) cfg.bind(root, function () { invalidate(); if (cfg.auto) runAll(); });
    F.onCleanup(function () { items.forEach(revoke); });

    function revoke(it) { if (it.url) URL.revokeObjectURL(it.url); if (it.result && it.result.url) URL.revokeObjectURL(it.result.url); }
    function invalidate() {
      items.forEach(function (it) { if (it.result && it.result.url) URL.revokeObjectURL(it.result.url); it.result = null; if (it.status !== 'error') it.status = 'ready'; else { it.status = 'ready'; it.error = null; } });
      draw();
    }
    function runAll() {
      if (running) { runAll.again = true; return; }
      running = true;
      var queue = items.filter(function (it) { return it.status === 'ready'; });
      (function next() {
        if (!queue.length) {
          running = false; draw();
          if (runAll.again) { runAll.again = false; if (items.some(function (it) { return it.status === 'ready'; })) runAll(); }
          return;
        }
        var it = queue.shift();
        if (items.indexOf(it) < 0) return next();
        it.status = 'working'; draw();
        Promise.resolve().then(function () { return cfg.process(it); }).then(function (res) {
          if (it.status !== 'working') return;
          res.url = URL.createObjectURL(res.blob);
          it.result = res; it.status = 'done';
        }, function (err) {
          console.error(err);
          it.status = 'error'; it.error = err && err.message ? err.message : 'Failed';
        }).then(function () { draw(); setTimeout(next, 0); });
      })();
    }
    function draw() {
      var list = F.$('#btList', root), foot = F.$('#btFoot', root);
      drop.classList.toggle('compact', items.length > 0);
      list.innerHTML = items.map(function (it) {
        var r = it.result, meta = '<span>' + F.formatBytes(it.file.size) + '</span>';
        if (it.status === 'working') meta += '<span class="spinner"></span><span>Processing…</span>';
        else if (it.status === 'ready') meta += '<span class="badge badge-muted">Ready</span>';
        else if (it.status === 'error') meta += '<span class="badge badge-bad">' + esc(it.error) + '</span>';
        else if (r) {
          meta += '<span>→</span><strong>' + F.formatBytes(r.blob.size) + '</strong>';
          if (r.dims) meta += '<span>' + r.dims + '</span>';
          if (cfg.showSavings) {
            var pct = Math.round((1 - r.blob.size / it.file.size) * 100);
            meta += pct > 0 ? '<span class="badge badge-good">−' + pct + '%</span>' : '<span class="badge badge-muted">' + (r.kept ? 'Already optimized' : '+' + Math.abs(pct) + '%') + '</span>';
          } else meta += '<span class="badge badge-good">Done</span>';
        }
        var thumb = (r && r.url && cfg.thumbFromResult) ? r.url : it.url;
        return '<div class="file-item" data-id="' + it.id + '"><div class="file-thumb' + (cfg.checker ? ' checker' : '') + '">' + (thumb ? '<img src="' + thumb + '" alt="">' : icon('image')) + '</div>' +
          '<div class="file-info"><div class="file-name" title="' + esc(it.file.name) + '">' + esc(r ? r.name : it.file.name) + '</div><div class="file-meta">' + meta + '</div></div>' +
          '<div class="file-actions">' + (r ? '<button class="btn btn-sm btn-primary" data-act="dl">' + icon('download', 'icon-sm') + 'Download</button>' : '') +
          '<button class="icon-btn danger" data-act="rm" title="Remove">' + icon('x', 'icon-sm') + '</button></div></div>';
      }).join('');
      if (!items.length) { foot.innerHTML = ''; return; }
      var done = items.filter(function (it) { return it.result; }), ready = items.filter(function (it) { return it.status === 'ready'; });
      var origTotal = 0, newTotal = 0;
      done.forEach(function (it) { origTotal += it.file.size; newTotal += it.result.blob.size; });
      var summary = done.length ? done.length + ' of ' + items.length + ' processed' + (cfg.showSavings && origTotal ? ' · ' + F.formatBytes(origTotal) + ' → ' + F.formatBytes(newTotal) + ' · saved <strong>' + Math.max(0, Math.round((1 - newTotal / origTotal) * 100)) + '%</strong>' : '') : items.length + ' file' + (items.length > 1 ? 's' : '') + ' in queue';
      foot.innerHTML = '<div class="list-footer"><span class="summary">' + summary + '</span><div class="toolbar">' +
        '<button class="btn btn-danger" data-act="clear">' + icon('trash') + 'Clear All</button>' +
        (!cfg.auto ? '<button class="btn' + (done.length ? '' : ' btn-primary') + '" data-act="run"' + (ready.length && !running ? '' : ' disabled') + '>' + icon('refresh') + (cfg.runLabel || 'Convert All') + '</button>' : '') +
        '<button class="btn' + (done.length ? ' btn-primary' : '') + '" data-act="zip"' + (done.length ? '' : ' disabled') + '>' + icon('download') + 'Download All (ZIP)</button></div></div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.getAttribute('data-act'), row = b.closest('.file-item'), it = row && items.filter(function (x) { return x.id === +row.getAttribute('data-id'); })[0];
      if (act === 'dl' && it) F.download(it.result.blob, it.result.name);
      else if (act === 'rm' && it) { revoke(it); it.status = 'removed'; items.splice(items.indexOf(it), 1); draw(); }
      else if (act === 'clear') { items.forEach(revoke); items = []; draw(); }
      else if (act === 'run') runAll();
      else if (act === 'zip') {
        var done = items.filter(function (x) { return x.result; });
        if (done.length === 1) F.download(done[0].result.blob, done[0].result.name);
        else F.zipAndDownload(done.map(function (x) { return { name: x.result.name, blob: x.result.blob }; }), cfg.zipName || 'images.zip');
      }
    });
    draw();
    return { items: function () { return items; } };
  }
  function qualityField(id, val, label) {
    return '<div class="field" style="min-width:240px;flex:1;max-width:360px"><label for="' + id + '">' + (label || 'Quality') + '</label><div class="range-row"><input type="range" id="' + id + '" min="10" max="100" value="' + val + '"><span class="val" id="' + id + 'Val">' + val + '%</span></div></div>';
  }
  function bindQuality(root, id, onChange) {
    var r = F.$('#' + id, root), v = F.$('#' + id + 'Val', root), t;
    r.addEventListener('input', function () { v.textContent = r.value + '%'; clearTimeout(t); t = setTimeout(onChange, 350); });
    return function () { return +r.value / 100; };
  }

  /* ---------------- Image Compressor ---------------- */
  IMPL['image-compressor'] = function (root, t) {
    var getQ, getFmt;
    var webp = supportsWebP();
    batchTool(root, t, {
      auto: true, showSavings: true, zipName: 'compressed-images.zip',
      optionsHTML: qualityField('icQ', 70, 'Compression Quality') +
        '<div class="field"><label for="icFmt">Output Format</label><select class="input" id="icFmt" style="width:auto"><option value="same">Same as original</option><option value="image/jpeg">JPG</option>' + (webp ? '<option value="image/webp">WebP (smallest)</option>' : '') + '</select></div>' +
        '<p class="meta" style="flex-basis:100%;margin:-6px 0 0">Lower quality = smaller files. 60–80% is the sweet spot for photos. PNGs are reduced with smart palette quantization.</p>',
      bind: function (r, change) { getQ = bindQuality(r, 'icQ', change); var s = F.$('#icFmt', r); s.onchange = change; getFmt = function () { return s.value; }; },
      process: function (it) {
        var q = getQ(), fmt = getFmt(), f = it.file;
        var mime = fmt === 'same' ? (MIME_EXT[f.type] ? f.type : 'image/jpeg') : fmt;
        return F.fileToImage(f).then(function (img) {
          var c = drawScaled(img, img.naturalWidth, img.naturalHeight, mime === 'image/jpeg' ? '#ffffff' : null);
          URL.revokeObjectURL(img._url);
          var p;
          if (mime === 'image/png') {
            var colors = Math.max(16, Math.min(256, Math.round(16 + (q - 0.1) / 0.9 * 240)));
            var data = c.getContext('2d').getImageData(0, 0, c.width, c.height);
            p = encodePNG8(data, colors).catch(function () { return F.canvasToBlob(c, 'image/png'); });
          } else p = F.canvasToBlob(c, mime, q);
          return p.then(function (blob) {
            var name = F.baseName(f.name) + '-compressed.' + MIME_EXT[mime];
            if (blob.size >= f.size && mime === f.type) return { blob: f, name: name, kept: true, dims: c.width + '×' + c.height };
            return { blob: blob, name: name, dims: c.width + '×' + c.height };
          });
        });
      }
    });
  };

  /* ---------------- Image Resizer ---------------- */
  IMPL['image-resizer'] = function (root, t) {
    var mode = 'px';
    var api = batchTool(root, t, {
      runLabel: 'Resize All', zipName: 'resized-images.zip',
      optionsHTML:
        '<div class="field"><span class="label">Resize By</span><div class="seg" id="irMode"><button class="active" data-m="px">Pixels</button><button data-m="pct">Percentage</button></div></div>' +
        '<div class="field" id="irPx" style="flex-direction:row;gap:10px;align-items:flex-end">' +
        '<div class="field"><label for="irW">Width (px)</label><input class="input" type="number" id="irW" min="1" max="16000" placeholder="Auto" style="width:120px"></div>' +
        '<button class="icon-btn" id="irLockBtn" title="Lock aspect ratio" style="margin-bottom:5px;color:var(--primary)">' + icon('link', 'icon-sm') + '</button>' +
        '<div class="field"><label for="irH">Height (px)</label><input class="input" type="number" id="irH" min="1" max="16000" placeholder="Auto" style="width:120px"></div></div>' +
        '<div class="field" id="irPct" style="display:none;min-width:240px"><label for="irP">Scale</label><div class="range-row"><input type="range" id="irP" min="5" max="400" value="50"><span class="val" id="irPVal">50%</span></div></div>' +
        '<label class="switch" style="margin-bottom:8px"><input type="checkbox" id="irLock" checked><span class="track"></span>Lock Aspect Ratio</label>' +
        '<div class="field"><label for="irFmt">Format</label><select class="input" id="irFmt" style="width:auto"><option value="same">Same as original</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option>' + (supportsWebP() ? '<option value="image/webp">WebP</option>' : '') + '</select></div>' +
        '<p class="meta" id="irHint" style="flex-basis:100%;margin:-6px 0 0">With the lock on, enter just a width (or height) and every image keeps its own proportions.</p>',
      onAdd: function (items) {
        var w = F.$('#irW', root), h = F.$('#irH', root);
        if (!w.value && !h.value && items[0]) {
          F.fileToImage(items[0].file).then(function (img) {
            ref = img.naturalWidth / img.naturalHeight;
            w.value = img.naturalWidth; h.value = img.naturalHeight; URL.revokeObjectURL(img._url);
          }).catch(function () { });
        }
      },
      bind: function (r, change) {
        var w = F.$('#irW', r), h = F.$('#irH', r), lock = F.$('#irLock', r), p = F.$('#irP', r);
        F.$$('#irMode button', r).forEach(function (b) {
          b.onclick = function () {
            mode = b.getAttribute('data-m');
            F.$$('#irMode button', r).forEach(function (x) { x.classList.toggle('active', x === b); });
            F.$('#irPx', r).style.display = mode === 'px' ? '' : 'none';
            F.$('#irPct', r).style.display = mode === 'pct' ? '' : 'none';
            change();
          };
        });
        w.addEventListener('input', function () { if (lock.checked && ref && w.value) h.value = Math.max(1, Math.round(w.value / ref)); lastEdited = 'w'; change(); });
        h.addEventListener('input', function () { if (lock.checked && ref && h.value) w.value = Math.max(1, Math.round(h.value * ref)); lastEdited = 'h'; change(); });
        lock.onchange = function () { F.$('#irLockBtn', r).style.color = lock.checked ? 'var(--primary)' : ''; change(); };
        F.$('#irLockBtn', r).onclick = function (e) { e.preventDefault(); lock.checked = !lock.checked; lock.onchange(); };
        p.addEventListener('input', function () { F.$('#irPVal', r).textContent = p.value + '%'; change(); });
        F.$('#irFmt', r).onchange = change;
      },
      process: function (it) {
        var f = it.file, fmt = F.$('#irFmt', root).value;
        var mime = fmt === 'same' ? (MIME_EXT[f.type] ? f.type : 'image/png') : fmt;
        return F.fileToImage(f).then(function (img) {
          var iw = img.naturalWidth, ih = img.naturalHeight, w, h;
          if (mode === 'pct') { var s = +F.$('#irP', root).value / 100; w = iw * s; h = ih * s; }
          else {
            var W = +F.$('#irW', root).value, H = +F.$('#irH', root).value, lock = F.$('#irLock', root).checked;
            if (lock) {
              if (lastEdited === 'h' && H) { h = H; w = H * iw / ih; }
              else if (W) { w = W; h = W * ih / iw; }
              else if (H) { h = H; w = H * iw / ih; }
              else { w = iw; h = ih; }
            } else { w = W || iw; h = H || ih; }
          }
          w = Math.max(1, Math.min(16000, Math.round(w))); h = Math.max(1, Math.min(16000, Math.round(h)));
          var c = drawScaled(img, w, h, mime === 'image/jpeg' ? '#ffffff' : null);
          URL.revokeObjectURL(img._url);
          return F.canvasToBlob(c, mime, 0.92).then(function (blob) {
            return { blob: blob, name: F.baseName(f.name) + '-' + w + 'x' + h + '.' + MIME_EXT[mime], dims: iw + '×' + ih + ' → ' + w + '×' + h };
          });
        });
      }
    });
    var ref = 0, lastEdited = 'w';
    return api;
  };

  /* ---------------- JPG → PNG ---------------- */
  IMPL['jpg-to-png'] = function (root, t) {
    batchTool(root, t, {
      runLabel: 'Convert All', zipName: 'converted-png.zip',
      test: function (f) { return /jpe?g$/i.test(f.type) || /\.jpe?g$/i.test(f.name); },
      process: function (it) {
        return F.fileToImage(it.file).then(function (img) {
          var c = drawScaled(img, img.naturalWidth, img.naturalHeight);
          URL.revokeObjectURL(img._url);
          return F.canvasToBlob(c, 'image/png').then(function (b) { return { blob: b, name: F.baseName(it.file.name) + '.png', dims: c.width + '×' + c.height }; });
        });
      }
    });
  };

  /* ---------------- PNG → JPG ---------------- */
  IMPL['png-to-jpg'] = function (root, t) {
    var getQ, getBg;
    batchTool(root, t, {
      runLabel: 'Convert All', zipName: 'converted-jpg.zip', checker: true,
      test: function (f) { return /png$/i.test(f.type) || /\.png$/i.test(f.name); },
      optionsHTML: qualityField('pjQ', 90, 'JPG Quality') + '<div class="field"><label>Background for transparency</label>' + colorField('pjBg', '#ffffff') + '</div>',
      bind: function (r, change) { getQ = bindQuality(r, 'pjQ', change); getBg = bindColor(r, 'pjBg', change); },
      process: function (it) {
        return F.fileToImage(it.file).then(function (img) {
          var c = drawScaled(img, img.naturalWidth, img.naturalHeight, getBg());
          URL.revokeObjectURL(img._url);
          return F.canvasToBlob(c, 'image/jpeg', getQ()).then(function (b) { return { blob: b, name: F.baseName(it.file.name) + '.jpg', dims: c.width + '×' + c.height }; });
        });
      }
    });
  };

  /* ---------------- HEIC → JPG ---------------- */
  IMPL['heic-to-jpg'] = function (root, t) {
    var getQ;
    batchTool(root, t, {
      runLabel: 'Convert All', zipName: 'heic-to-jpg.zip', noThumb: true, thumbFromResult: true,
      test: function (f) { return /hei[cf]$/i.test(f.type) || /\.hei[cf]$/i.test(f.name); },
      optionsHTML: qualityField('hjQ', 92, 'JPG Quality') + '<p class="meta" style="flex:1;min-width:220px;margin:0 0 6px">The HEIC decoder (≈1&nbsp;MB) loads on first use. Safari can decode HEIC natively.</p>',
      bind: function (r, change) { getQ = bindQuality(r, 'hjQ', change); },
      process: function (it) {
        var q = getQ(), f = it.file, name = F.baseName(f.name) + '.jpg';
        function viaCanvas(img) {
          var c = drawScaled(img, img.naturalWidth, img.naturalHeight, '#ffffff');
          URL.revokeObjectURL(img._url);
          return F.canvasToBlob(c, 'image/jpeg', q).then(function (b) { return { blob: b, name: name, dims: c.width + '×' + c.height }; });
        }
        return F.fileToImage(f).then(viaCanvas, function () {
          return F.LIB.heic().catch(function () { throw new Error('HEIC decoder could not load. Check your internet connection and try again.'); }).then(function (heic2any) {
            if (!heic2any) throw new Error('HEIC decoder unavailable');
            return heic2any({ blob: f, toType: 'image/jpeg', quality: q });
          }).then(function (out) {
            var b = Array.isArray(out) ? out[0] : out;
            return { blob: b, name: name };
          }, function (e) {
            var m = e && e.message ? e.message : '';
            if (/could not load/i.test(m)) throw e;
            throw new Error('Not a valid HEIC/HEIF photo');
          });
        });
      }
    });
  };

  /* ---------------- SVG → PNG/JPG ---------------- */
  function svgSize(svg) {
    function num(v) { if (!v || /%$/.test(v)) return 0; var n = parseFloat(v); if (/em$/.test(v)) n *= 16; else if (/pt$/.test(v)) n *= 4 / 3; else if (/in$/.test(v)) n *= 96; else if (/cm$/.test(v)) n *= 37.8; else if (/mm$/.test(v)) n *= 3.78; return n || 0; }
    var w = num(svg.getAttribute('width')), h = num(svg.getAttribute('height'));
    var vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
    if (vb.length === 4 && vb[2] > 0 && vb[3] > 0) {
      if (!w && !h) { w = vb[2]; h = vb[3]; }
      else if (!w) w = h * vb[2] / vb[3];
      else if (!h) h = w * vb[3] / vb[2];
    }
    return { w: w || 300, h: h || 150 };
  }
  IMPL['svg-to-png'] = function (root, t) {
    var scale = 2, fmt = 'image/png', getBg;
    batchTool(root, t, {
      runLabel: 'Convert All', zipName: 'svg-converted.zip', checker: true, thumbFromResult: false,
      test: function (f) { return /svg/i.test(f.type) || /\.svg$/i.test(f.name); },
      optionsHTML:
        '<div class="field"><span class="label">Scale</span><div class="seg" id="svScale">' + [1, 2, 4, 8].map(function (s) { return '<button data-s="' + s + '"' + (s === 2 ? ' class="active"' : '') + '>' + s + 'x</button>'; }).join('') + '</div></div>' +
        '<div class="field"><span class="label">Output Format</span><div class="seg" id="svFmt"><button class="active" data-f="image/png">PNG</button><button data-f="image/jpeg">JPG</button></div></div>' +
        '<div class="field" id="svBgWrap" style="opacity:.45"><label>JPG Background</label>' + colorField('svBg', '#ffffff') + '</div>',
      bind: function (r, change) {
        F.$$('#svScale button', r).forEach(function (b) { b.onclick = function () { scale = +b.getAttribute('data-s'); F.$$('#svScale button', r).forEach(function (x) { x.classList.toggle('active', x === b); }); change(); }; });
        F.$$('#svFmt button', r).forEach(function (b) { b.onclick = function () { fmt = b.getAttribute('data-f'); F.$$('#svFmt button', r).forEach(function (x) { x.classList.toggle('active', x === b); }); F.$('#svBgWrap', r).style.opacity = fmt === 'image/jpeg' ? 1 : .45; change(); }; });
        getBg = bindColor(r, 'svBg', change);
      },
      process: function (it) {
        return F.readText(it.file).then(function (txt) {
          var doc = new DOMParser().parseFromString(txt, 'image/svg+xml'), svg = doc.documentElement;
          if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) throw new Error('Invalid SVG file');
          var sz = svgSize(svg), W = Math.round(sz.w * scale), H = Math.round(sz.h * scale);
          if (W * H > 16384 * 16384 / 4) throw new Error('Output too large; try a smaller scale');
          if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 ' + sz.w + ' ' + sz.h);
          svg.setAttribute('width', W); svg.setAttribute('height', H);
          if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          var blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
          var url = URL.createObjectURL(blob);
          return F.loadImage(url).then(function (img) {
            URL.revokeObjectURL(url);
            var c = makeCanvas(W, H), ctx = c.getContext('2d');
            if (fmt === 'image/jpeg') { ctx.fillStyle = getBg(); ctx.fillRect(0, 0, W, H); }
            ctx.drawImage(img, 0, 0, W, H);
            return F.canvasToBlob(c, fmt, 0.95).then(function (b) {
              return { blob: b, name: F.baseName(it.file.name) + '@' + scale + 'x.' + (fmt === 'image/png' ? 'png' : 'jpg'), dims: W + '×' + H };
            });
          }, function () { URL.revokeObjectURL(url); throw new Error('This SVG could not be rendered'); });
        });
      }
    });
  };

  /* ---------------- PDF helpers ---------------- */
  function pdfError(e) {
    var m = (e && (e.name || '') + ' ' + (e.message || '')) || '';
    if (/password|encrypt/i.test(m)) return 'This PDF is password-protected. Remove the password and try again.';
    if (/Invalid PDF|InvalidPDF|No PDF header|Failed to parse/i.test(m)) return 'This file is not a valid PDF or is damaged.';
    return (e && e.message) || 'Could not read this PDF.';
  }
  function fileRow(name, metaHTML, actionsHTML, thumbIcon) {
    return '<div class="file-item"><div class="file-thumb" style="color:var(--c-pdf);background:var(--c-pdf-soft)">' + icon(thumbIcon || 'file') + '</div><div class="file-info"><div class="file-name">' + esc(name) + '</div><div class="file-meta">' + metaHTML + '</div></div><div class="file-actions">' + (actionsHTML || '') + '</div></div>';
  }

  /* ---------------- PDF Compressor ---------------- */
  IMPL['pdf-compressor'] = function (root, t) {
    var file = null, out = null, busy = false, level = 'target', targetMB = 2, note = '';
    var LEVELS = {
      target: { name: 'Target Size', desc: 'Automatically finds the best quality that fits under your size limit (e.g. 2 MB for job portals).' },
      lossless: { name: 'Lossless', desc: 'Rebuilds the file structure and removes redundant objects. Text stays selectable. Smallest savings.' },
      recommended: { name: 'Recommended', desc: 'Re-renders pages at 150 DPI with balanced JPEG quality. Great for email.', dpi: 150, q: 0.72 },
      extreme: { name: 'Extreme', desc: 'Re-renders pages at 96 DPI with strong compression. Smallest files; best for screens.', dpi: 96, q: 0.5 }
    };
    root.innerHTML = '<div id="pcDrop"></div><div id="pcBody"></div>';
    var drop = F.dropzone({ accept: t.accept, maxMB: 0, maxFiles: 1, title: t.dropTitle, sub: t.dropSub, test: function (f) { return /pdf/i.test(f.type) || /\.pdf$/i.test(f.name); }, onFiles: function (fs) { file = fs[0]; out = null; note = ''; draw(); } });
    F.$('#pcDrop', root).appendChild(drop);
    function targetBytes() { return Math.round(targetMB * 1024 * 1024); }
    function draw() {
      drop.style.display = file ? 'none' : '';
      var body = F.$('#pcBody', root);
      if (!file) { body.innerHTML = ''; return; }
      var res = '';
      if (out) {
        var pct = Math.round((1 - out.size / file.size) * 100);
        var fits = level !== 'target' || out.size <= targetBytes();
        res = '<div class="grid-3" style="margin-top:18px"><div class="stat"><div class="s-val">' + F.formatBytes(file.size) + '</div><div class="s-label">Original Size</div></div>' +
          '<div class="stat ' + (fits ? 'accent' : '') + '"><div class="s-val">' + F.formatBytes(out.size) + '</div><div class="s-label">Compressed Size' + (level === 'target' ? (fits ? ' · under ' + targetMB + ' MB ✓' : ' · above target') : '') + '</div></div>' +
          '<div class="stat ' + (pct > 0 ? 'good' : '') + '"><div class="s-val">' + (pct > 0 ? '−' + pct + '%' : '0%') + '</div><div class="s-label">' + (pct > 0 ? 'Saved ' + F.formatBytes(file.size - out.size) : 'Already optimized') + '</div></div></div>' +
          (note ? '<div class="notice ' + (fits ? 'notice-ok' : 'notice-error') + '">' + icon(fits ? 'checkCircle' : 'alert') + '<span>' + note + '</span></div>' : '') +
          (pct <= 0 && level !== 'target' ? '<div class="notice notice-info">' + icon('info') + '<span>This PDF is already well optimized at this level. Try a stronger level, or keep your original.</span></div>' : '');
      }
      body.innerHTML = fileRow(file.name, '<span>' + F.formatBytes(file.size) + '</span>' + (file.size <= targetBytes() && level === 'target' ? '<span class="badge badge-good">already under ' + targetMB + ' MB</span>' : ''), '<button class="icon-btn danger" data-act="reset" title="Remove">' + icon('x', 'icon-sm') + '</button>') +
        '<div class="field" style="margin-top:18px"><span class="label">Compression Level</span><div class="pc-levels" id="pcLevels">' + Object.keys(LEVELS).map(function (k) {
          var L = LEVELS[k];
          return '<button class="btn' + (k === level ? ' btn-primary' : '') + '" data-level="' + k + '" style="flex-direction:column;align-items:flex-start;white-space:normal;text-align:left;padding:14px;height:100%"><strong>' + L.name + (k === 'target' ? ' ★' : '') + '</strong><span style="font-weight:500;font-size:12.5px;opacity:.85">' + L.desc + '</span></button>';
        }).join('') + '</div></div>' +
        (level === 'target' ? '<div class="toolbar" style="margin-top:14px;gap:10px;flex-wrap:wrap"><label class="label" for="pcTarget">Target size</label>' +
          '<div class="color-input" style="padding:0 10px 0 0"><input class="input" type="number" id="pcTarget" min="0.1" max="5000" step="0.1" value="' + targetMB + '" style="width:90px;border:0;box-shadow:none"><span class="meta" style="font-weight:700">MB</span></div>' +
          [0.5, 1, 2, 5, 10, 20, 50].map(function (m) { return '<button class="btn btn-sm' + (m === targetMB ? ' btn-dark' : '') + '" data-mb="' + m + '">' + (m < 1 ? '500 KB' : m + ' MB') + '</button>'; }).join('') + '</div>' : '') +
        '<div id="pcProg"></div>' + res +
        '<div class="list-footer"><span class="summary">' + (out ? 'Ready to download' : level === 'target' ? 'Compress to under ' + targetMB + ' MB' : 'Choose a level, then compress') + '</span><div class="toolbar">' +
        '<button class="btn" data-act="reset">' + icon('upload') + 'Choose Another PDF</button>' +
        '<button class="btn' + (out ? '' : ' btn-primary') + '" data-act="run"' + (busy ? ' disabled' : '') + '>' + (busy ? '<span class="spinner"></span>' : icon('minimize')) + (out ? 'Compress Again' : 'Compress PDF') + '</button>' +
        (out ? '<button class="btn btn-primary" data-act="dl">' + icon('download') + 'Download PDF</button>' : '') + '</div></div>';
      var ti = F.$('#pcTarget', root);
      if (ti) ti.addEventListener('change', function () { var v = parseFloat(ti.value); if (v > 0) { targetMB = Math.round(v * 100) / 100; out = null; note = ''; draw(); } });
    }
    function progress(label, frac) {
      var el = F.$('#pcProg', root); if (!el) return;
      el.innerHTML = '<div style="margin-top:16px"><div class="meta">' + esc(label) + '</div><div class="progress"><span style="width:' + Math.round((frac || 0) * 100) + '%"></span></div></div>';
    }
    function lossless(buf) {
      return F.LIB.pdflib().then(function (PDFLib) { return PDFLib.PDFDocument.load(buf, { updateMetadata: false }); })
        .then(function (doc) { return doc.save({ useObjectStreams: true, addDefaultPage: false }); })
        .then(function (bytes) { return new Blob([bytes], { type: 'application/pdf' }); });
    }
    function buildFromJpegs(PDFLib, sizes, blobs) {
      return PDFLib.PDFDocument.create().then(function (doc) {
        return blobs.reduce(function (p, b, i) {
          return p.then(function () { return b.arrayBuffer(); }).then(function (ab) { return doc.embedJpg(ab); }).then(function (img) {
            var pg = doc.addPage([sizes[i][0], sizes[i][1]]);
            pg.drawImage(img, { x: 0, y: 0, width: sizes[i][0], height: sizes[i][1] });
          });
        }, Promise.resolve()).then(function () { return doc.save({ useObjectStreams: true }); });
      }).then(function (bytes) { return new Blob([bytes], { type: 'application/pdf' }); });
    }
    /* Render every page once at `dpi` and encode it at each quality in `qs`. */
    function rasterPass(pdf, dpi, qs, label, onPage) {
      var sizes = [], perQ = qs.map(function () { return []; });
      var i = 0;
      function next() {
        if (i >= pdf.numPages) return Promise.resolve({ sizes: sizes, perQ: perQ });
        i++;
        onPage(i);
        return pdf.getPage(i).then(function (page) {
          var base = page.getViewport({ scale: 1 }), vp = page.getViewport({ scale: dpi / 72 });
          sizes.push([base.width, base.height]);
          var c = makeCanvas(vp.width, vp.height), ctx = c.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
          return page.render({ canvasContext: ctx, viewport: vp, canvas: c }).promise.then(function () {
            return qs.reduce(function (p, q, k) {
              return p.then(function () { return F.canvasToBlob(c, 'image/jpeg', q); }).then(function (b) { perQ[k].push(b); });
            }, Promise.resolve());
          }).then(function () { page.cleanup(); c.width = c.height = 1; return next(); });
        });
      }
      return next();
    }
    function compressFixed(buf, L) {
      return Promise.all([F.LIB.pdfjs(), F.LIB.pdflib()]).then(function (libs) {
        return libs[0].getDocument({ data: new Uint8Array(buf.slice(0)) }).promise.then(function (pdf) {
          return rasterPass(pdf, L.dpi, [L.q], '', function (i) { progress('Compressing page ' + i + ' of ' + pdf.numPages + '…', (i - 1) / pdf.numPages); })
            .then(function (r) { return buildFromJpegs(libs[1], r.sizes, r.perQ[0]); });
        });
      });
    }
    function compressTarget(buf) {
      var target = targetBytes();
      var DPIS = [150, 110, 85, 65, 50, 36], QS = [0.82, 0.7, 0.58, 0.47, 0.37, 0.28, 0.2];
      var MINQ = [0.47, 0.47, 0.37, 0.28, 0.2, 0.2]; // keep text clean: lower resolution before dropping quality too far
      var best = null;
      function keep(blob) { if (!best || blob.size < best.size) best = blob; }
      progress('Trying lossless optimization (keeps text selectable)…', 0.02);
      return lossless(buf).catch(function () { return null; }).then(function (ll) {
        if (ll) keep(ll);
        if (file.size <= target) keep(file);
        if (best && best.size <= target) { note = 'Fits under ' + targetMB + ' MB with lossless optimization. Text stays sharp and selectable.'; return best; }
        return Promise.all([F.LIB.pdfjs(), F.LIB.pdflib()]).then(function (libs) {
          return libs[0].getDocument({ data: new Uint8Array(buf.slice(0)) }).promise.then(function (pdf) {
            var overhead = 2048 + pdf.numPages * 600;
            function tryDpi(di) {
              if (di >= DPIS.length) return null;
              var dpi = DPIS[di];
              return rasterPass(pdf, dpi, QS, '', function (i) {
                progress('Pass ' + (di + 1) + ' · ' + dpi + ' DPI · page ' + i + ' of ' + pdf.numPages + '…', (di + (i - 1) / pdf.numPages) / DPIS.length);
              }).then(function (r) {
                var totals = r.perQ.map(function (arr) { return arr.reduce(function (s, b) { return s + b.size; }, overhead); });
                var k = totals.findIndex(function (tot) { return tot <= target; });
                if (k >= 0 && QS[k] < MINQ[di]) k = -1;
                function attempt(k) {
                  if (k < 0 || k >= QS.length || QS[k] < MINQ[di]) return Promise.resolve(null);
                  return buildFromJpegs(libs[1], r.sizes, r.perQ[k]).then(function (blob) {
                    keep(blob);
                    if (blob.size <= target) { note = 'Compressed to under ' + targetMB + ' MB at ' + dpi + ' DPI, ' + Math.round(QS[k] * 100) + '% quality (best quality that fits).'; return blob; }
                    return attempt(k + 1);
                  });
                }
                return attempt(k).then(function (ok) {
                  if (ok) return ok;
                  if (k < 0 && di === DPIS.length - 1) return buildFromJpegs(libs[1], r.sizes, r.perQ[QS.length - 1]).then(function (b) { keep(b); return null; });
                  // skip ahead faster when we are far from the target
                  var ratio = totals[totals.length - 1] / target, step = ratio > 3 ? 2 : 1;
                  return tryDpi(Math.min(DPIS.length - 1, di + step) === di ? di + 1 : Math.min(DPIS.length - 1, di + step));
                });
              });
            }
            return tryDpi(0).then(function (res) {
              if (res) return res;
              note = 'Could not get this PDF under ' + targetMB + ' MB without making it unreadable. Smallest possible: <strong>' + F.formatBytes(best.size) + '</strong>. Try splitting the document or raising the limit.';
              return best;
            });
          });
        });
      });
    }
    function compress() {
      busy = true; out = null; note = ''; draw();
      var L = LEVELS[level];
      F.readArrayBuffer(file).then(function (buf) {
        if (level === 'target') return compressTarget(buf);
        if (!L.dpi) { progress('Optimizing structure…', 0.3); return lossless(buf); }
        return compressFixed(buf, L);
      }).then(function (blob) {
        out = blob.size >= file.size && level !== 'target' ? file : blob;
        busy = false; draw(); F.toast('Compression finished');
      }).catch(function (e) {
        console.error(e); busy = false; draw();
        F.$('#pcProg', root).innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(pdfError(e)) + '</span></div>';
      });
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act],[data-level],[data-mb]'); if (!b || busy) return;
      if (b.hasAttribute('data-level')) { level = b.getAttribute('data-level'); out = null; note = ''; draw(); return; }
      if (b.hasAttribute('data-mb')) { targetMB = +b.getAttribute('data-mb'); out = null; note = ''; draw(); return; }
      var a = b.getAttribute('data-act');
      if (a === 'reset') { file = null; out = null; note = ''; draw(); }
      else if (a === 'run') compress();
      else if (a === 'dl' && out) F.download(out, F.baseName(file.name) + '-compressed.pdf');
    });
  };

  /* ---------------- PDF → JPG ---------------- */
  IMPL['pdf-to-jpg'] = function (root, t) {
    var file = null, pages = [], gen = 0, dpi = 150, q = 0.9;
    root.innerHTML =
      '<div class="toolbar" style="gap:18px;margin-bottom:18px;align-items:flex-end"><div class="field"><span class="label">Resolution</span><div class="seg" id="pjDpi">' + [[72, 'Screen 72 DPI'], [150, 'Standard 150 DPI'], [300, 'Print 300 DPI']].map(function (d) { return '<button data-d="' + d[0] + '"' + (d[0] === 150 ? ' class="active"' : '') + '>' + d[1] + '</button>'; }).join('') + '</div></div>' +
      qualityField('pjQ', 90, 'JPG Quality') + '</div><div id="pjDrop"></div><div id="pjBody"></div>';
    var drop = F.dropzone({ accept: t.accept, maxMB: t.maxMB, maxFiles: 1, title: t.dropTitle, sub: t.dropSub, test: function (f) { return /pdf/i.test(f.type) || /\.pdf$/i.test(f.name); }, onFiles: function (fs) { file = fs[0]; render(); } });
    F.$('#pjDrop', root).appendChild(drop);
    function clearPages() { pages.forEach(function (p) { if (p.url) URL.revokeObjectURL(p.url); }); pages = []; }
    F.onCleanup(clearPages);
    function draw(status) {
      drop.style.display = file ? 'none' : '';
      var body = F.$('#pjBody', root);
      if (!file) { body.innerHTML = ''; return; }
      var done = pages.filter(function (p) { return p.blob; }).length;
      body.innerHTML = fileRow(file.name, '<span>' + F.formatBytes(file.size) + '</span>' + (status || ''), '<button class="icon-btn danger" data-act="reset" title="Remove">' + icon('x', 'icon-sm') + '</button>') +
        '<div class="page-grid">' + pages.map(function (p, i) {
          return '<div class="page-card"><div class="pc-img">' + (p.url ? '<img src="' + p.url + '" alt="Page ' + (i + 1) + '">' : '<span class="spinner"></span>') + '</div><div class="pc-foot"><span>Page ' + (i + 1) + (p.blob ? ' · ' + F.formatBytes(p.blob.size) : '') + '</span>' +
            (p.blob ? '<button class="icon-btn" data-page="' + i + '" title="Download page">' + icon('download', 'icon-sm') + '</button>' : '') + '</div></div>';
        }).join('') + '</div>' +
        '<div class="list-footer"><span class="summary">' + done + ' of ' + pages.length + ' pages converted</span><div class="toolbar"><button class="btn" data-act="reset">' + icon('upload') + 'Choose Another PDF</button>' +
        '<button class="btn btn-primary" data-act="zip"' + (done && done === pages.length ? '' : ' disabled') + '>' + icon('download') + 'Download All (ZIP)</button></div></div>';
    }
    function render() {
      var my = ++gen; clearPages(); draw('<span class="spinner"></span><span>Loading PDF…</span>');
      Promise.all([F.LIB.pdfjs(), F.readArrayBuffer(file)]).then(function (r) {
        return r[0].getDocument({ data: new Uint8Array(r[1]) }).promise;
      }).then(function (pdf) {
        if (my !== gen) return;
        for (var i = 0; i < pdf.numPages; i++) pages.push({});
        draw('<span class="badge badge-info">' + pdf.numPages + ' pages</span>');
        var i2 = 0;
        function next() {
          if (my !== gen || i2 >= pdf.numPages) { if (my === gen) { draw('<span class="badge badge-good">' + pdf.numPages + ' pages ready</span>'); } return; }
          var idx = i2++;
          return pdf.getPage(idx + 1).then(function (page) {
            var vp = page.getViewport({ scale: dpi / 72 });
            var c = makeCanvas(vp.width, vp.height), ctx = c.getContext('2d');
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
            return page.render({ canvasContext: ctx, viewport: vp, canvas: c }).promise.then(function () { return F.canvasToBlob(c, 'image/jpeg', q); }).then(function (b) {
              if (my !== gen) return;
              pages[idx] = { blob: b, url: URL.createObjectURL(b) };
              page.cleanup();
              draw('<span class="badge badge-info">' + (idx + 1) + ' / ' + pdf.numPages + ' rendered</span>');
            });
          }).then(next);
        }
        return next();
      }).catch(function (e) {
        console.error(e); if (my !== gen) return;
        draw(); F.$('#pjBody', root).insertAdjacentHTML('beforeend', '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(pdfError(e)) + '</span></div>');
      });
    }
    F.$$('#pjDpi button', root).forEach(function (b) {
      b.onclick = function () { dpi = +b.getAttribute('data-d'); F.$$('#pjDpi button', root).forEach(function (x) { x.classList.toggle('active', x === b); }); if (file) render(); };
    });
    bindQuality(root, 'pjQ', function () { q = +F.$('#pjQ', root).value / 100; if (file) render(); });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act],[data-page]'); if (!b) return;
      var base = file ? F.baseName(file.name) : 'page';
      if (b.hasAttribute('data-page')) { var i = +b.getAttribute('data-page'); F.download(pages[i].blob, base + '-page-' + (i + 1) + '.jpg'); return; }
      var a = b.getAttribute('data-act');
      if (a === 'reset') { gen++; clearPages(); file = null; draw(); }
      else if (a === 'zip') F.zipAndDownload(pages.map(function (p, i) { return { name: base + '-page-' + String(i + 1).padStart(3, '0') + '.jpg', blob: p.blob }; }), base + '-jpg.zip');
    });
  };

  /* ---------------- Merge PDF ---------------- */
  IMPL['merge-pdf'] = function (root, t) {
    var items = [], seq = 0, result = null, busy = false, dragId = null;
    root.innerHTML = '<div id="mpDrop"></div><div id="mpList" class="file-list"></div><div id="mpFoot"></div>';
    var drop = F.dropzone({
      accept: t.accept, maxMB: t.maxMB, maxFiles: t.maxFiles, title: t.dropTitle, sub: t.dropSub,
      test: function (f) { return /pdf/i.test(f.type) || /\.pdf$/i.test(f.name); },
      onFiles: function (fs) {
        result = null;
        fs.forEach(function (f) {
          var it = { id: ++seq, file: f, pages: null };
          items.push(it);
          F.LIB.pdflib().then(function (PDFLib) { return F.readArrayBuffer(f).then(function (b) { return PDFLib.PDFDocument.load(b, { ignoreEncryption: true, updateMetadata: false }); }); })
            .then(function (d) { it.pages = d.getPageCount(); draw(); }, function (e) { it.error = pdfError(e); draw(); });
        });
        draw();
      }
    });
    F.$('#mpDrop', root).appendChild(drop);
    function draw() {
      drop.classList.toggle('compact', items.length > 0);
      F.$('#mpList', root).innerHTML = items.map(function (it, i) {
        var meta = '<span>' + F.formatBytes(it.file.size) + '</span>' + (it.error ? '<span class="badge badge-bad">' + esc(it.error) + '</span>' : it.pages == null ? '<span class="spinner"></span>' : '<span class="badge badge-info">' + it.pages + ' page' + (it.pages > 1 ? 's' : '') + '</span>');
        return '<div class="file-item" draggable="true" data-id="' + it.id + '"><span class="drag-handle" title="Drag to reorder">' + icon('grip') + '</span><span class="badge badge-muted">' + (i + 1) + '</span>' +
          '<div class="file-thumb" style="color:var(--c-pdf);background:var(--c-pdf-soft)">' + icon('file') + '</div><div class="file-info"><div class="file-name">' + esc(it.file.name) + '</div><div class="file-meta">' + meta + '</div></div>' +
          '<div class="file-actions"><button class="icon-btn" data-act="up" title="Move up"' + (i === 0 ? ' disabled' : '') + '>' + icon('arrowUp', 'icon-sm') + '</button><button class="icon-btn" data-act="down" title="Move down"' + (i === items.length - 1 ? ' disabled' : '') + '>' + icon('arrowDown', 'icon-sm') + '</button><button class="icon-btn danger" data-act="rm" title="Remove">' + icon('x', 'icon-sm') + '</button></div></div>';
      }).join('');
      var foot = F.$('#mpFoot', root);
      if (!items.length) { foot.innerHTML = ''; return; }
      var total = items.reduce(function (s, it) { return s + (it.pages || 0); }, 0), valid = items.filter(function (it) { return !it.error; }).length;
      foot.innerHTML = (result ? '<div class="notice notice-ok">' + icon('checkCircle') + '<span>Merged <strong>' + valid + ' files</strong> into one PDF with <strong>' + result.pages + ' pages</strong> (' + F.formatBytes(result.blob.size) + ').</span></div>' : '') +
        '<div id="mpErr"></div><div class="list-footer"><span class="summary">' + items.length + ' file' + (items.length > 1 ? 's' : '') + ' · ' + total + ' pages total</span><div class="toolbar">' +
        '<button class="btn btn-danger" data-act="clear">' + icon('trash') + 'Clear All</button>' +
        '<button class="btn' + (result ? '' : ' btn-primary') + '" data-act="merge"' + (valid >= 2 && !busy ? '' : ' disabled') + '>' + (busy ? '<span class="spinner"></span>' : icon('merge')) + 'Merge PDF</button>' +
        (result ? '<button class="btn btn-primary" data-act="dl">' + icon('download') + 'Download Merged PDF</button>' : '') + '</div></div>' +
        (valid < 2 ? '<p class="meta" style="text-align:right;margin-top:8px">Add at least two PDFs to merge.</p>' : '');
    }
    function move(from, to) { if (to < 0 || to >= items.length) return; var it = items.splice(from, 1)[0]; items.splice(to, 0, it); result = null; draw(); }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || busy) return;
      var a = b.getAttribute('data-act'), row = b.closest('.file-item'), idx = row ? items.findIndex(function (x) { return x.id === +row.getAttribute('data-id'); }) : -1;
      if (a === 'up') move(idx, idx - 1);
      else if (a === 'down') move(idx, idx + 1);
      else if (a === 'rm') { items.splice(idx, 1); result = null; draw(); }
      else if (a === 'clear') { items = []; result = null; draw(); }
      else if (a === 'dl' && result) F.download(result.blob, 'merged.pdf');
      else if (a === 'merge') {
        busy = true; draw();
        F.LIB.pdflib().then(function (PDFLib) {
          return PDFLib.PDFDocument.create().then(function (out) {
            var list = items.filter(function (it) { return !it.error; });
            return list.reduce(function (p, it) {
              return p.then(function () { return F.readArrayBuffer(it.file); }).then(function (buf) { return PDFLib.PDFDocument.load(buf, { ignoreEncryption: true }); })
                .then(function (src) { return out.copyPages(src, src.getPageIndices()); }).then(function (pgs) { pgs.forEach(function (pg) { out.addPage(pg); }); });
            }, Promise.resolve()).then(function () { return out.save(); }).then(function (bytes) { result = { blob: new Blob([bytes], { type: 'application/pdf' }), pages: out.getPageCount() }; });
          });
        }).then(function () { busy = false; draw(); F.toast('PDFs merged successfully'); }, function (err) {
          console.error(err); busy = false; draw();
          F.$('#mpErr', root).innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(pdfError(err)) + '</span></div>';
        });
      }
    });
    // drag & drop reordering
    var list = F.$('#mpList', root);
    list.addEventListener('dragstart', function (e) { var r = e.target.closest('.file-item'); if (!r) return; dragId = +r.getAttribute('data-id'); r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(dragId)); } catch (x) { } });
    list.addEventListener('dragend', function () { dragId = null; F.$$('.file-item', list).forEach(function (r) { r.classList.remove('dragging', 'drag-over'); }); });
    list.addEventListener('dragover', function (e) { if (dragId == null) return; e.preventDefault(); e.stopPropagation(); var r = e.target.closest('.file-item'); F.$$('.file-item', list).forEach(function (x) { x.classList.toggle('drag-over', x === r); }); });
    list.addEventListener('drop', function (e) {
      if (dragId == null) return; e.preventDefault(); e.stopPropagation();
      var r = e.target.closest('.file-item'); if (!r) return;
      var from = items.findIndex(function (x) { return x.id === dragId; }), to = items.findIndex(function (x) { return x.id === +r.getAttribute('data-id'); });
      dragId = null; move(from, to);
    });
    draw();
  };

  /* ---------------- Split PDF ---------------- */
  function parseRanges(text, max) {
    var groups = [], parts = String(text || '').split(/[,;]+/).map(function (x) { return x.trim(); }).filter(Boolean);
    for (var i = 0; i < parts.length; i++) {
      var m = parts[i].match(/^(\d*)\s*[-–]\s*(\d*)$/), a, b;
      if (m && (m[1] || m[2])) { a = m[1] ? +m[1] : 1; b = m[2] ? +m[2] : max; }
      else if (/^\d+$/.test(parts[i])) { a = b = +parts[i]; }
      else throw new Error('"' + parts[i] + '" is not a valid page or range.');
      if (a < 1 || b < 1 || a > max || b > max) throw new Error('Page ' + (a > max || a < 1 ? a : b) + ' does not exist (this PDF has ' + max + ' pages).');
      var g = [];
      if (a <= b) for (var k = a; k <= b; k++) g.push(k - 1); else for (var k2 = a; k2 >= b; k2--) g.push(k2 - 1);
      groups.push({ label: parts[i].replace(/\s+/g, ''), pages: g });
    }
    return groups;
  }
  function toRanges(idxs) {
    var s = idxs.slice().sort(function (a, b) { return a - b; }), out = [], i = 0;
    while (i < s.length) { var j = i; while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++; out.push(i === j ? String(s[i] + 1) : (s[i] + 1) + '-' + (s[j] + 1)); i = j + 1; }
    return out.join(', ');
  }
  IMPL['split-pdf'] = function (root, t) {
    var file = null, srcBytes = null, numPages = 0, thumbs = [], sel = [], mode = 'extract', gen = 0, busy = false, result = null;
    root.innerHTML =
      '<div class="field" style="margin-bottom:16px"><span class="label">Split Mode</span><div class="seg" id="spMode">' +
      '<button class="active" data-m="extract">' + icon('check', 'icon-sm') + 'Extract Selected Pages</button><button data-m="ranges">' + icon('layers', 'icon-sm') + 'Split by Ranges</button><button data-m="each">' + icon('grid', 'icon-sm') + 'Every Page Separately</button></div>' +
      '<p class="meta" id="spModeHint" style="margin-top:6px"></p></div><div id="spDrop"></div><div id="spBody"></div>';
    var drop = F.dropzone({ accept: t.accept, maxMB: t.maxMB, maxFiles: 1, title: t.dropTitle, sub: t.dropSub, test: function (f) { return /pdf/i.test(f.type) || /\.pdf$/i.test(f.name); }, onFiles: function (fs) { load(fs[0]); } });
    F.$('#spDrop', root).appendChild(drop);
    var HINTS = {
      extract: 'Click pages (or type ranges) to pick them. All chosen pages are saved together as one new PDF.',
      ranges: 'Type ranges separated by commas. Each group becomes its own PDF, e.g. "1-3, 4-6, 7-" makes 3 files.',
      each: 'Every page is saved as a separate PDF, bundled in one ZIP.'
    };
    function clearThumbs() { thumbs.forEach(function (u) { if (u) URL.revokeObjectURL(u); }); thumbs = []; }
    F.onCleanup(clearThumbs);
    function plan() {
      // returns { files: [{name, pages}], error }
      var base = file ? F.baseName(file.name) : 'document';
      if (mode === 'each') return { files: Array.from({ length: numPages }, function (_, i) { return { name: base + '-page-' + (i + 1) + '.pdf', pages: [i] }; }) };
      var txt = (F.$('#spRange', root) || {}).value || '';
      if (mode === 'extract') {
        var pages = sel.slice();
        return pages.length ? { files: [{ name: base + '-pages-' + toRanges(pages).replace(/\s+/g, '').replace(/,/g, '_') + '.pdf', pages: pages }] } : { files: [] };
      }
      try {
        var groups = parseRanges(txt, numPages);
        return { files: groups.map(function (g) { return { name: base + '-' + g.label.replace(/[^\w-]/g, '') + '.pdf', pages: g.pages }; }) };
      } catch (e) { return { files: [], error: e.message }; }
    }
    var typed = false;
    function draw() {
      drop.style.display = file ? 'none' : '';
      F.$('#spModeHint', root).textContent = HINTS[mode];
      var body = F.$('#spBody', root);
      if (!file) { body.innerHTML = ''; return; }
      var pl = plan(), files = pl.files, nPages = files.reduce(function (s, f) { return s + f.pages.length; }, 0);
      var pickSet = {}; (mode === 'ranges' ? files.reduce(function (a, f) { return a.concat(f.pages); }, []) : mode === 'each' ? [] : sel).forEach(function (i) { pickSet[i] = 1; });
      var btnLabel = mode === 'extract' ? 'Extract ' + nPages + ' Page' + (nPages === 1 ? '' : 's') : 'Split into ' + files.length + ' File' + (files.length === 1 ? '' : 's');
      body.innerHTML = fileRow(file.name, '<span>' + F.formatBytes(file.size) + '</span>' + (numPages ? '<span class="badge badge-info">' + numPages + ' pages</span>' : '<span class="spinner"></span>'), '<button class="icon-btn danger" data-act="reset" title="Remove">' + icon('x', 'icon-sm') + '</button>') +
        (mode !== 'each' ? '<div class="toolbar" style="margin-top:16px;gap:10px"><div class="field" style="flex:1;min-width:240px"><label for="spRange">' + (mode === 'extract' ? 'Pages to keep' : 'Ranges (one file per group)') + '</label>' +
          '<input class="input" id="spRange" placeholder="' + (mode === 'extract' ? 'e.g. 1-3, 5, 8-10' : 'e.g. 1-3, 4-6, 7-') + '" value="' + esc(mode === 'extract' && !typed ? toRanges(sel) : (F.$('#spRange', root) ? F.$('#spRange', root).value : '')) + '" autocomplete="off"></div>' +
          (mode === 'extract' ? '<div class="toolbar" style="align-self:flex-end"><button class="btn btn-sm" data-act="all">Select All</button><button class="btn btn-sm" data-act="none">Clear</button><button class="btn btn-sm" data-act="invert">Invert</button></div>' : '') + '</div>' : '') +
        '<div id="spErr">' + (pl.error ? '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(pl.error) + '</span></div>' : '') + '</div>' +
        '<div class="page-grid split-grid">' + Array.from({ length: numPages }, function (_, i) {
          var on = !!pickSet[i];
          return '<div class="page-card' + (on ? ' sel' : '') + (mode === 'extract' ? ' pickable' : '') + '" data-page="' + i + '"><div class="pc-img">' + (thumbs[i] ? '<img src="' + thumbs[i] + '" alt="Page ' + (i + 1) + '">' : '<span class="spinner"></span>') + (on ? '<span class="pc-check">' + icon('check', 'icon-sm') + '</span>' : '') + '</div><div class="pc-foot"><span>Page ' + (i + 1) + '</span></div></div>';
        }).join('') + '</div>' +
        (result ? '<div class="notice notice-ok">' + icon('checkCircle') + '<span>' + result.msg + '</span></div>' : '') +
        '<div class="list-footer"><span class="summary">' + (mode === 'each' ? numPages + ' files will be created' : mode === 'extract' ? nPages + ' of ' + numPages + ' pages selected' : files.length + ' file' + (files.length === 1 ? '' : 's') + ' · ' + nPages + ' pages') + '</span><div class="toolbar">' +
        '<button class="btn" data-act="reset">' + icon('upload') + 'Choose Another PDF</button>' +
        '<button class="btn' + (result ? '' : ' btn-primary') + '" data-act="run"' + (files.length && numPages && !busy ? '' : ' disabled') + '>' + (busy ? '<span class="spinner"></span>' : icon('scissors')) + btnLabel + '</button>' +
        (result ? '<button class="btn btn-primary" data-act="dl">' + icon('download') + (result.zip ? 'Download ZIP' : 'Download PDF') + '</button>' : '') + '</div></div>';
      var ri = F.$('#spRange', root);
      if (ri) ri.addEventListener('input', function () {
        result = null; typed = true;
        if (mode === 'extract') {
          try {
            var seen = {}, order = [];
            parseRanges(ri.value, numPages).forEach(function (g) { g.pages.forEach(function (p) { if (!seen[p]) { seen[p] = 1; order.push(p); } }); });
            sel = order; F.$('#spErr', root).innerHTML = '';
          } catch (e) { F.$('#spErr', root).innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(e.message) + '</span></div>'; return; }
        }
        var pos = ri.selectionStart; draw(); var r2 = F.$('#spRange', root); r2.focus(); try { r2.setSelectionRange(pos, pos); } catch (e) { }
      });
    }
    function load(f) {
      var my = ++gen; file = f; clearThumbs(); numPages = 0; sel = []; result = null; typed = false; draw();
      F.readArrayBuffer(f).then(function (buf) {
        srcBytes = buf;
        return F.LIB.pdfjs().then(function (pdfjs) { return pdfjs.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise; });
      }).then(function (pdf) {
        if (my !== gen) return;
        numPages = pdf.numPages; sel = Array.from({ length: numPages }, function (_, i) { return i; }); draw();
        var i = 0;
        function next() {
          if (my !== gen || i >= numPages) return;
          var idx = i++;
          return pdf.getPage(idx + 1).then(function (page) {
            var v1 = page.getViewport({ scale: 1 }), vp = page.getViewport({ scale: 260 / Math.max(v1.width, v1.height) });
            var c = makeCanvas(vp.width, vp.height), ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
            return page.render({ canvasContext: ctx, viewport: vp, canvas: c }).promise.then(function () { return F.canvasToBlob(c, 'image/jpeg', 0.8); }).then(function (b) {
              if (my !== gen) return;
              thumbs[idx] = URL.createObjectURL(b); page.cleanup();
              var card = root.querySelector('.page-card[data-page="' + idx + '"] .pc-img');
              if (card) { var sp = card.querySelector('.spinner'); if (sp) sp.outerHTML = '<img src="' + thumbs[idx] + '" alt="Page ' + (idx + 1) + '">'; }
            });
          }).then(next);
        }
        return next();
      }).catch(function (e) {
        console.error(e); if (my !== gen) return;
        F.$('#spBody', root).insertAdjacentHTML('beforeend', '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(pdfError(e)) + '</span></div>');
      });
    }
    function run() {
      var files = plan().files; if (!files.length) return;
      busy = true; result = null; draw();
      F.LIB.pdflib().then(function (PDFLib) {
        return PDFLib.PDFDocument.load(srcBytes, { ignoreEncryption: true }).then(function (src) {
          return files.reduce(function (p, f) {
            return p.then(function (acc) {
              return PDFLib.PDFDocument.create().then(function (doc) {
                return doc.copyPages(src, f.pages).then(function (pgs) { pgs.forEach(function (pg) { doc.addPage(pg); }); return doc.save({ useObjectStreams: true }); });
              }).then(function (bytes) { acc.push({ name: f.name, blob: new Blob([bytes], { type: 'application/pdf' }), pages: f.pages.length }); return acc; });
            });
          }, Promise.resolve([]));
        });
      }).then(function (outs) {
        busy = false;
        var total = outs.reduce(function (s, o) { return s + o.blob.size; }, 0);
        result = { outs: outs, zip: outs.length > 1, msg: outs.length > 1 ? 'Created <strong>' + outs.length + ' PDF files</strong> (' + F.formatBytes(total) + ' total), bundled in a ZIP.' : 'Created a new PDF with <strong>' + outs[0].pages + ' page' + (outs[0].pages === 1 ? '' : 's') + '</strong> (' + F.formatBytes(total) + ').' };
        draw(); F.toast('Split complete');
      }, function (e) {
        console.error(e); busy = false; draw();
        F.$('#spErr', root).innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span>' + esc(pdfError(e)) + '</span></div>';
      });
    }
    root.addEventListener('click', function (e) {
      var m = e.target.closest('#spMode button');
      if (m) { mode = m.getAttribute('data-m'); F.$$('#spMode button', root).forEach(function (x) { x.classList.toggle('active', x === m); }); result = null; typed = false; var ri = F.$('#spRange', root); if (ri) ri.value = ''; draw(); return; }
      if (busy) return;
      var card = e.target.closest('.page-card.pickable');
      if (card && mode === 'extract') {
        var i = +card.getAttribute('data-page'), k = sel.indexOf(i);
        if (k >= 0) sel.splice(k, 1); else { sel.push(i); sel.sort(function (a, b) { return a - b; }); }
        typed = false; result = null; draw(); return;
      }
      var b = e.target.closest('[data-act]'); if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'reset') { gen++; clearThumbs(); file = null; srcBytes = null; numPages = 0; sel = []; result = null; draw(); }
      else if (a === 'all') { sel = Array.from({ length: numPages }, function (_, i) { return i; }); typed = false; result = null; draw(); }
      else if (a === 'none') { sel = []; typed = false; result = null; draw(); }
      else if (a === 'invert') { var s = {}; sel.forEach(function (i) { s[i] = 1; }); sel = Array.from({ length: numPages }, function (_, i) { return i; }).filter(function (i) { return !s[i]; }); typed = false; result = null; draw(); }
      else if (a === 'run') run();
      else if (a === 'dl' && result) {
        if (result.zip) F.zipAndDownload(result.outs.map(function (o) { return { name: o.name, blob: o.blob }; }), F.baseName(file.name) + '-split.zip');
        else F.download(result.outs[0].blob, result.outs[0].name);
      }
    });
    draw();
  };

  /* ---------------- QR Code Generator ---------------- */
  function wifiEsc(s) { return String(s).replace(/([\\;,:"])/g, '\\$1'); }
  IMPL['qr-code-generator'] = function (root) {
    var type = 'url', ecl = 'M';
    var DEF = { fg: '#0f172a', bg: '#ffffff' };
    root.innerHTML =
      '<div class="qr-layout"><div>' +
      '<div class="field"><span class="label">Content Type</span><div class="seg" id="qrType" style="width:100%">' +
      [['url', 'link', 'Website URL'], ['text', 'type', 'Plain Text'], ['wifi', 'wifi', 'Wi-Fi Network'], ['email', 'mail', 'Email Address']].map(function (x, i) {
        return '<button data-t="' + x[0] + '"' + (i === 0 ? ' class="active"' : '') + '>' + icon(x[1], 'icon-sm') + x[2] + '</button>';
      }).join('') + '</div></div>' +
      '<div id="qrFields" style="margin-top:16px"></div>' +
      '<div class="divider"></div>' +
      '<div class="grid-2"><div class="field"><label>QR Pattern Color</label>' + colorField('qrFg', DEF.fg) + '</div><div class="field"><label>Background Color</label>' + colorField('qrBg', DEF.bg) + '</div></div>' +
      '<div class="field" style="margin-top:16px"><span class="label">Error Correction Level</span><div class="ecl-group" id="qrEcl">' +
      [['L', '7%'], ['M', '15%'], ['Q', '25%'], ['H', '30%']].map(function (e) { return '<button data-e="' + e[0] + '"' + (e[0] === 'M' ? ' class="active"' : '') + '>Level ' + e[0] + '<small>~' + e[1] + ' recovery</small></button>'; }).join('') + '</div></div>' +
      '</div><div class="qr-preview"><div class="panel-head" style="width:100%;margin:0"><span class="panel-title">' + icon('eye', 'icon-sm') + 'Live High-Res Preview</span><button class="btn btn-sm btn-ghost" id="qrReset">' + icon('refresh', 'icon-sm') + 'Reset</button></div>' +
      '<div class="qr-canvas-wrap"><canvas id="qrCanvas" width="512" height="512" aria-label="QR code preview"></canvas></div><div class="qr-status" id="qrStatus"></div>' +
      '<div class="qr-actions"><button class="btn btn-primary btn-block" id="qrPng">' + icon('download') + 'Download High-Res PNG (512px)</button><div class="grid-2" style="gap:8px"><button class="btn" id="qrSvg">' + icon('pen') + 'Vector SVG</button><button class="btn" id="qrCopy">' + icon('copy') + 'Copy Image</button></div></div>' +
      '<div class="qr-trust">100% Client-Side • No Expiration • Free Commercial Use</div></div></div>';

    var FIELDS = {
      url: '<div class="field"><label for="qUrl">Target Website URL</label><input class="input" id="qUrl" placeholder="https://example.com" value="https://example.com"></div>',
      text: '<div class="field"><label for="qText">Your Message</label><textarea class="input" id="qText" rows="5" placeholder="Type any text…">Hello from Ardan Tools! Scan me 👋</textarea></div>',
      wifi: '<div class="grid-2"><div class="field"><label for="qSsid">Network Name (SSID)</label><input class="input" id="qSsid" placeholder="MyHomeWiFi"></div><div class="field"><label for="qPass">Password</label><input class="input" id="qPass" type="text" placeholder="Wi-Fi password" autocomplete="off"></div></div>' +
        '<div class="grid-2" style="margin-top:14px"><div class="field"><label for="qEnc">Security</label><select class="input" id="qEnc"><option value="WPA">WPA / WPA2 / WPA3</option><option value="WEP">WEP</option><option value="nopass">None (open network)</option></select></div><div class="field" style="justify-content:flex-end"><label class="switch" style="padding-bottom:8px"><input type="checkbox" id="qHidden"><span class="track"></span>Hidden network</label></div></div>',
      email: '<div class="field"><label for="qMail">Email Address</label><input class="input" id="qMail" type="email" placeholder="name@example.com"></div><div class="field" style="margin-top:14px"><label for="qSub">Subject (optional)</label><input class="input" id="qSub" placeholder="Hello!"></div><div class="field" style="margin-top:14px"><label for="qBody">Message (optional)</label><textarea class="input" id="qBody" rows="3"></textarea></div>'
    };
    var canvas = F.$('#qrCanvas', root), status = F.$('#qrStatus', root), current = null;
    var getFg = bindColor(root, 'qrFg', schedule), getBg = bindColor(root, 'qrBg', schedule);
    function val(id) { var el = F.$('#' + id, root); return el ? el.value : ''; }
    function payload() {
      if (type === 'url') {
        var u = val('qUrl').trim(); if (u && !/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u;
        return u;
      }
      if (type === 'text') return val('qText');
      if (type === 'wifi') {
        var ssid = val('qSsid'); if (!ssid) return '';
        var enc = val('qEnc');
        return 'WIFI:T:' + enc + ';S:' + wifiEsc(ssid) + ';' + (enc !== 'nopass' ? 'P:' + wifiEsc(val('qPass')) + ';' : '') + (F.$('#qHidden', root).checked ? 'H:true;' : '') + ';';
      }
      var m = val('qMail').trim(); if (!m) return '';
      var qs = [];
      if (val('qSub')) qs.push('subject=' + encodeURIComponent(val('qSub')));
      if (val('qBody')) qs.push('body=' + encodeURIComponent(val('qBody')));
      return 'mailto:' + m + (qs.length ? '?' + qs.join('&') : '');
    }
    function drawQR(target, qr, px) {
      var quiet = 4, n = qr.size + quiet * 2, ctx = target.getContext('2d');
      target.width = px; target.height = px;
      var cell = px / n;
      ctx.fillStyle = getBg(); ctx.fillRect(0, 0, px, px);
      ctx.fillStyle = getFg();
      for (var y = 0; y < qr.size; y++) for (var x = 0; x < qr.size; x++) {
        if (qr.get(x, y)) {
          var x0 = Math.floor((x + quiet) * cell), y0 = Math.floor((y + quiet) * cell);
          ctx.fillRect(x0, y0, Math.ceil((x + quiet + 1) * cell) - x0, Math.ceil((y + quiet + 1) * cell) - y0);
        }
      }
    }
    var timer;
    function schedule() { status.innerHTML = '<span class="spinner"></span>Generating code…'; clearTimeout(timer); timer = setTimeout(update, 120); }
    function update() {
      var data = payload();
      if (!data) { current = null; var ctx = canvas.getContext('2d'); ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, 512, 512); status.innerHTML = icon('info', 'icon-sm') + 'Enter details to generate your QR code'; return; }
      try {
        current = window.QR.encode(data, ecl);
        drawQR(canvas, current, 512);
        status.innerHTML = icon('checkCircle', 'icon-sm') + 'Version ' + current.version + ' · ' + current.size + '×' + current.size + ' modules · ' + new TextEncoder().encode(data).length + ' bytes';
      } catch (e) { current = null; status.innerHTML = '<span style="color:var(--danger)">' + icon('alert', 'icon-sm') + esc(e.message) + '</span>'; }
    }
    function setType(tp) {
      type = tp;
      F.$$('#qrType button', root).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-t') === tp); });
      F.$('#qrFields', root).innerHTML = FIELDS[tp];
      F.$$('#qrFields input, #qrFields textarea, #qrFields select', root).forEach(function (el) {
        el.addEventListener('input', schedule); el.addEventListener('change', schedule);
      });
      schedule();
    }
    F.$$('#qrType button', root).forEach(function (b) { b.onclick = function () { setType(b.getAttribute('data-t')); }; });
    F.$$('#qrEcl button', root).forEach(function (b) { b.onclick = function () { ecl = b.getAttribute('data-e'); F.$$('#qrEcl button', root).forEach(function (x) { x.classList.toggle('active', x === b); }); schedule(); }; });
    F.$('#qrReset', root).onclick = function () {
      ['qrFg', 'qrBg'].forEach(function (id) { var v = id === 'qrFg' ? DEF.fg : DEF.bg; F.$('#' + id, root).value = v; F.$('#' + id + 'Hex', root).value = v; });
      ecl = 'M'; F.$$('#qrEcl button', root).forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-e') === 'M'); });
      setType('url'); F.toast('Settings reset');
    };
    function fileBase() { return 'qr-code-' + type; }
    F.$('#qrPng', root).onclick = function () {
      if (!current) return F.toast('Enter content first', 'error');
      var c = document.createElement('canvas'); drawQR(c, current, 512);
      F.canvasToBlob(c, 'image/png').then(function (b) { F.download(b, fileBase() + '.png'); });
    };
    F.$('#qrSvg', root).onclick = function () {
      if (!current) return F.toast('Enter content first', 'error');
      var q = 4, n = current.size + q * 2, d = '';
      for (var y = 0; y < current.size; y++) for (var x = 0; x < current.size; x++) if (current.get(x, y)) d += 'M' + (x + q) + ',' + (y + q) + 'h1v1h-1z';
      var svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="1024" height="1024" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="' + getBg() + '"/><path fill="' + getFg() + '" d="' + d + '"/></svg>\n';
      F.download(new Blob([svg], { type: 'image/svg+xml' }), fileBase() + '.svg');
    };
    F.$('#qrCopy', root).onclick = function () {
      if (!current) return F.toast('Enter content first', 'error');
      if (!(navigator.clipboard && window.ClipboardItem)) return F.toast('Your browser can\'t copy images; use Download instead', 'error');
      var c = document.createElement('canvas'); drawQR(c, current, 512);
      var p = F.canvasToBlob(c, 'image/png');
      navigator.clipboard.write([new ClipboardItem({ 'image/png': p })]).then(function () { F.toast('QR image copied'); }, function () { F.toast('Copy blocked by the browser; use Download instead', 'error'); });
    };
    setType('url');
  };

  /* ---------------- HD Photo Enhancer & Super Resolution ---------------- */
  function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

  function applyDeepHD(data, w, h, cfg) {
    var len = w * h;
    var Y = new Float32Array(len);

    // 1. Extract Luminance Y
    for (var i = 0; i < len; i++) {
      var p = i * 4;
      Y[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    }

    // 2. Fast separable box blur for radius 1 (fine edge deblur) and radius 3 (large structure clarity)
    var tmp = new Float32Array(len);
    var blurFine = new Float32Array(len);
    var blurMed = new Float32Array(len);

    function blurPass(src, dst, r) {
      for (var y = 0; y < h; y++) {
        var row = y * w;
        var val = 0;
        for (var x = -r; x <= r; x++) val += src[row + Math.max(0, Math.min(w - 1, x))];
        var count = 2 * r + 1;
        tmp[row] = val / count;
        for (var x = 1; x < w; x++) {
          val += src[row + Math.min(w - 1, x + r)] - src[row + Math.max(0, x - r - 1)];
          tmp[row + x] = val / count;
        }
      }
      for (var x = 0; x < w; x++) {
        var val = 0;
        for (var y = -r; y <= r; y++) val += tmp[Math.max(0, Math.min(h - 1, y)) * w + x];
        var count = 2 * r + 1;
        dst[x] = val / count;
        for (var y = 1; y < h; y++) {
          val += tmp[Math.min(h - 1, y + r) * w + x] - tmp[Math.max(0, y - r - 1) * w + x];
          dst[y * w + x] = val / count;
        }
      }
    }

    blurPass(Y, blurFine, 1);
    blurPass(Y, blurMed, 3);

    var sAmount = (cfg.sharpen || 65) / 22;
    var cAmount = (cfg.clarity || 50) / 28;
    var contrast = (cfg.contrast !== undefined ? cfg.contrast : 20) / 100;
    var vibrance = (cfg.vibrance !== undefined ? cfg.vibrance : 30) / 100;
    var denoise = (cfg.denoise || 0) / 100;

    for (var i = 0; i < len; i++) {
      var p = i * 4;
      var origY = Y[i];
      var fineDetail = origY - blurFine[i];
      var medDetail = blurFine[i] - blurMed[i];

      // Subtle denoise: damp tiny high frequency noise in smooth areas
      if (denoise > 0 && Math.abs(fineDetail) < 7) {
        fineDetail *= (1 - denoise * 0.7);
      }

      // High-pass edge boost & unblur
      var newY = origY + (fineDetail * sAmount) + (medDetail * cAmount);

      // Micro-contrast & de-haze curve
      if (contrast !== 0) {
        newY = 128 + (newY - 128) * (1 + contrast * 0.85);
      }
      newY = clamp(newY);

      // Apply luminance change back to RGB without shifting hue
      var ratio = origY > 0.5 ? (newY / origY) : 1;
      var r = clamp(data[p] * ratio);
      var g = clamp(data[p + 1] * ratio);
      var b = clamp(data[p + 2] * ratio);

      // Vibrance boost (vivid colors for text, clothing, scenery)
      if (vibrance > 0) {
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var sat = max === 0 ? 0 : (max - min) / max;
        var boost = vibrance * (1 - sat) * 0.65;
        var avg = (r + g + b) / 3;
        r = clamp(r + (r - avg) * boost);
        g = clamp(g + (g - avg) * boost);
        b = clamp(b + (b - avg) * boost);
      }

      data[p] = r;
      data[p + 1] = g;
      data[p + 2] = b;
    }
  }

  function renderHDFull(srcCanvas, cfg) {
    var scale = cfg.scale || 2;
    var w = srcCanvas.width, h = srcCanvas.height;
    var targetW = Math.round(w * scale);
    var targetH = Math.round(h * scale);

    var canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (scale > 2) {
      // 2-step upscale with intermediate pass
      var mid = document.createElement('canvas');
      mid.width = Math.round(w * 2);
      mid.height = Math.round(h * 2);
      var mCtx = mid.getContext('2d');
      mCtx.imageSmoothingEnabled = true;
      mCtx.imageSmoothingQuality = 'high';
      mCtx.drawImage(srcCanvas, 0, 0, mid.width, mid.height);
      ctx.drawImage(mid, 0, 0, targetW, targetH);
    } else {
      ctx.drawImage(srcCanvas, 0, 0, targetW, targetH);
    }

    var imgData = ctx.getImageData(0, 0, targetW, targetH);
    applyDeepHD(imgData.data, targetW, targetH, cfg);
    ctx.putImageData(imgData, 0, 0);

    return canvas;
  }

  IMPL['hd-photo-enhancer'] = IMPL['pembuat-foto-hd'] = IMPL['foto-hd'] = IMPL['photo-hd'] = IMPL['hd-photo'] = IMPL['penjernih-foto'] = IMPL['upscale-image'] = function (root) {
    var currentImg = null;
    var currentName = 'photo.jpg';
    var enhancedCanvas = null;

    var PRESETS = {
      auto: { scale: 2, sharpen: 70, clarity: 50, denoise: 15, vibrance: 30, contrast: 25 },
      face: { scale: 2, sharpen: 55, clarity: 35, denoise: 30, vibrance: 25, contrast: 15 },
      landscape: { scale: 4, sharpen: 80, clarity: 60, denoise: 15, vibrance: 40, contrast: 30 },
      doc: { scale: 2, sharpen: 95, clarity: 75, denoise: 20, vibrance: 15, contrast: 45 }
    };

    var currentConfig = Object.assign({}, PRESETS.auto);

    root.innerHTML =
      '<div id="hdDropArea" style="margin-bottom:18px"></div>' +
      '<div id="hdWorkspace" style="display:none" class="hd-studio">' +
        /* Presets and Scale Toolbar */
        '<div class="panel-row" style="gap:12px;flex-wrap:wrap;align-items:center;background:var(--surface-2);padding:12px 16px;border-radius:14px;border:1px solid var(--border)">' +
          '<div><span class="label" style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">Enhance Preset:</span>' +
          '<div class="seg" id="hdPresets">' +
            '<button class="active" data-p="auto">' + icon('sparkles', 'icon-sm') + 'Auto HD</button>' +
            '<button data-p="face">👤 Portrait / Face</button>' +
            '<button data-p="landscape">🌄 Landscape 4K</button>' +
            '<button data-p="doc">📄 Document &amp; Banner</button>' +
            '<button data-p="custom">🎛️ Custom</button>' +
          '</div></div>' +
          '<div><span class="label" style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">Resolution Scale:</span>' +
          '<div class="seg" id="hdScales">' +
            '<button data-s="1">1x (Sharpness Only)</button>' +
            '<button data-s="2" class="active">2x (Full HD)</button>' +
            '<button data-s="4">4x (Ultra HD 4K)</button>' +
          '</div></div>' +
          '<span class="spacer"></span>' +
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
            '<span class="hd-res-badge" id="hdOrigRes">Original: -</span>' +
            '<span>➔</span>' +
            '<span class="hd-res-badge pill-green" id="hdNewRes">Enhanced: -</span>' +
          '</div>' +
        '</div>' +

        /* Split Screen Comparison Viewer (Centered Stage) */
        '<div class="hd-compare-box" id="hdCompareContainer" title="Drag left/right to compare Before vs After">' +
          '<div class="hd-stage" id="hdStage">' +
            '<img id="hdImgAfter" class="hd-img-layer" alt="Enhanced Ultra HD">' +
            '<div class="hd-before-wrap" id="hdBeforeWrap">' +
              '<img id="hdImgBefore" class="hd-img-layer" alt="Original Photo">' +
            '</div>' +
            '<div class="hd-divider" id="hdDivider">' +
              '<div class="hd-handle-circle">↔</div>' +
            '</div>' +
            '<span class="hd-tag hd-tag-before">Before (Original)</span>' +
            '<span class="hd-tag hd-tag-after">' + icon('sparkles', 'icon-sm') + 'After (Ultra HD)</span>' +
          '</div>' +
        '</div>' +

        /* Custom Fine-Tuning Sliders (Hidden unless Custom or expanded) */
        '<div id="hdSlidersBox" style="display:none" class="hd-controls-grid">' +
          '<div class="hd-slider-row"><label><span>Sharpen &amp; Details</span><strong id="hdValSharpen">' + currentConfig.sharpen + '%</strong></label><input type="range" id="hdRangeSharpen" min="0" max="100" value="' + currentConfig.sharpen + '"></div>' +
          '<div class="hd-slider-row"><label><span>Clarity &amp; Micro-contrast</span><strong id="hdValClarity">' + currentConfig.clarity + '%</strong></label><input type="range" id="hdRangeClarity" min="0" max="100" value="' + currentConfig.clarity + '"></div>' +
          '<div class="hd-slider-row"><label><span>Denoise &amp; Artifact Cleaning</span><strong id="hdValDenoise">' + currentConfig.denoise + '%</strong></label><input type="range" id="hdRangeDenoise" min="0" max="100" value="' + currentConfig.denoise + '"></div>' +
          '<div class="hd-slider-row"><label><span>Color Vibrance &amp; Pop</span><strong id="hdValVibrance">' + currentConfig.vibrance + '%</strong></label><input type="range" id="hdRangeVibrance" min="0" max="100" value="' + currentConfig.vibrance + '"></div>' +
          '<div class="hd-slider-row"><label><span>Dynamic Contrast</span><strong id="hdValContrast">' + currentConfig.contrast + '%</strong></label><input type="range" id="hdRangeContrast" min="-30" max="60" value="' + currentConfig.contrast + '"></div>' +
        '</div>' +

        /* Action Buttons */
        '<div class="toolbar" style="gap:12px;margin-top:4px;flex-wrap:wrap">' +
          '<button class="btn btn-primary btn-lg" id="hdDlPng">' + icon('download') + 'Download Ultra HD (PNG)</button>' +
          '<button class="btn btn-dark btn-lg" id="hdDlJpg">' + icon('download') + 'Download HD (JPG 100%)</button>' +
          '<button class="btn" id="hdCopyImg">' + icon('copy') + 'Copy Image</button>' +
          '<span class="spacer"></span>' +
          '<button class="btn btn-danger" id="hdResetBtn">' + icon('trash') + 'Upload Another Photo</button>' +
        '</div>' +
      '</div>';

    var dz = F.dropzone({
      accept: 'image/*,.heic',
      maxFiles: 1,
      compact: false,
      title: 'Drop a photo or image to enhance to Ultra HD',
      sub: 'Supports JPG, PNG, WebP, HEIC, BMP (100% private in-browser processing)',
      onFiles: function (files) {
        var f = files[0];
        if (!f) return;
        currentName = f.name;
        F.toast('Loading photo…');

        if (/\.heic$/i.test(f.name)) {
          F.LIB.heic().then(function (heic2any) {
            return heic2any({ blob: f, toType: 'image/jpeg' });
          }).then(function (blob) {
            loadImageFromBlob(blob);
          }).catch(function (e) {
            F.toast('HEIC decoding failed: ' + e.message, 'error');
          });
        } else {
          loadImageFromBlob(f);
        }
      }
    });
    F.$('#hdDropArea', root).appendChild(dz);

    var workspace = F.$('#hdWorkspace', root);
    var stage = F.$('#hdStage', root);
    var beforeWrap = F.$('#hdBeforeWrap', root);
    var divider = F.$('#hdDivider', root);
    var imgBefore = F.$('#hdImgBefore', root);
    var imgAfter = F.$('#hdImgAfter', root);
    var origRes = F.$('#hdOrigRes', root);
    var newRes = F.$('#hdNewRes', root);
    var slidersBox = F.$('#hdSlidersBox', root);

    function loadImageFromBlob(blob) {
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () {
        currentImg = img;
        dz.classList.add('compact');
        workspace.style.display = 'flex';
        origRes.textContent = 'Original: ' + img.width + ' × ' + img.height + ' px';
        imgBefore.src = url;
        processHD();
      };
      img.src = url;
    }

    function syncStageLayout() {
      // Ensure imgBefore matches imgAfter dimensions pixel for pixel
      var w = imgAfter.clientWidth || imgAfter.naturalWidth;
      var h = imgAfter.clientHeight || imgAfter.naturalHeight;
      if (w && h) {
        imgBefore.style.width = w + 'px';
        imgBefore.style.height = h + 'px';
      }
      // Put slider exactly in the middle of the photo
      beforeWrap.style.width = '50%';
      divider.style.left = '50%';
    }

    function processHD() {
      if (!currentImg) return;
      var srcCanvas = document.createElement('canvas');
      srcCanvas.width = currentImg.width;
      srcCanvas.height = currentImg.height;
      var sCtx = srcCanvas.getContext('2d');
      sCtx.drawImage(currentImg, 0, 0);

      enhancedCanvas = renderHDFull(srcCanvas, currentConfig);
      var afterUrl = enhancedCanvas.toDataURL('image/jpeg', 0.96);
      imgAfter.onload = function () {
        syncStageLayout();
      };
      imgAfter.src = afterUrl;

      newRes.textContent = 'Enhanced: ' + enhancedCanvas.width + ' × ' + enhancedCanvas.height + ' px (' + (currentConfig.scale >= 4 ? 'Ultra HD 4K' : currentConfig.scale === 2 ? 'Full HD' : 'Sharp') + ')';
      syncStageLayout();
      F.toast('Photo enhanced to crystal-clear HD!');
    }

    /* Comparison Slider Logic: drags strictly relative to the centered photo stage */
    var isDragging = false;
    function updateSplit(clientX) {
      var rect = stage.getBoundingClientRect();
      if (!rect.width) return;
      var x = clientX - rect.left;
      var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      beforeWrap.style.width = pct + '%';
      divider.style.left = pct + '%';
    }

    stage.addEventListener('mousedown', function (e) {
      isDragging = true;
      updateSplit(e.clientX);
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      updateSplit(e.clientX);
    });
    window.addEventListener('mouseup', function () { isDragging = false; });

    stage.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) {
        isDragging = true;
        updateSplit(e.touches[0].clientX);
      }
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
      if (isDragging && e.touches && e.touches[0]) {
        updateSplit(e.touches[0].clientX);
      }
    }, { passive: true });
    window.addEventListener('touchend', function () { isDragging = false; });

    window.addEventListener('resize', syncStageLayout);

    /* Preset Selection */
    F.$$('#hdPresets button', root).forEach(function (b) {
      b.onclick = function () {
        var p = b.getAttribute('data-p');
        F.$$('#hdPresets button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        if (p === 'custom') {
          slidersBox.style.display = 'grid';
        } else {
          slidersBox.style.display = 'none';
          Object.assign(currentConfig, PRESETS[p]);
          // Sync scale buttons
          F.$$('#hdScales button', root).forEach(function (sb) {
            sb.classList.toggle('active', +sb.getAttribute('data-s') === currentConfig.scale);
          });
          syncSlidersUI();
          processHD();
        }
      };
    });

    /* Scale Selection */
    F.$$('#hdScales button', root).forEach(function (b) {
      b.onclick = function () {
        var s = +b.getAttribute('data-s');
        F.$$('#hdScales button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        currentConfig.scale = s;
        processHD();
      };
    });

    /* Sliders Event Handling */
    function syncSlidersUI() {
      F.$('#hdRangeSharpen', root).value = currentConfig.sharpen;
      F.$('#hdValSharpen', root).textContent = currentConfig.sharpen + '%';
      F.$('#hdRangeClarity', root).value = currentConfig.clarity;
      F.$('#hdValClarity', root).textContent = currentConfig.clarity + '%';
      F.$('#hdRangeDenoise', root).value = currentConfig.denoise;
      F.$('#hdValDenoise', root).textContent = currentConfig.denoise + '%';
      F.$('#hdRangeVibrance', root).value = currentConfig.vibrance;
      F.$('#hdValVibrance', root).textContent = currentConfig.vibrance + '%';
      F.$('#hdRangeContrast', root).value = currentConfig.contrast || 0;
      F.$('#hdValContrast', root).textContent = (currentConfig.contrast || 0) + '%';
    }

    var debounceProcess = (function () {
      var t;
      return function () { clearTimeout(t); t = setTimeout(processHD, 120); };
    })();

    function bindSlider(id, prop) {
      var r = F.$('#hdRange' + id, root), valSpan = F.$('#hdVal' + id, root);
      r.addEventListener('input', function () {
        currentConfig[prop] = +r.value;
        valSpan.textContent = r.value + '%';
        debounceProcess();
      });
    }
    bindSlider('Sharpen', 'sharpen');
    bindSlider('Clarity', 'clarity');
    bindSlider('Denoise', 'denoise');
    bindSlider('Vibrance', 'vibrance');
    bindSlider('Contrast', 'contrast');

    /* Download Actions */
    F.$('#hdDlPng', root).onclick = function () {
      if (!enhancedCanvas) return F.toast('No enhanced image ready', 'error');
      var dot = currentName.lastIndexOf('.');
      var base = dot >= 0 ? currentName.slice(0, dot) : currentName;
      F.canvasToBlob(enhancedCanvas, 'image/png').then(function (blob) {
        F.download(blob, base + '_UltraHD.png');
        F.toast('Downloaded Ultra HD (PNG)');
      });
    };

    F.$('#hdDlJpg', root).onclick = function () {
      if (!enhancedCanvas) return F.toast('No enhanced image ready', 'error');
      var dot = currentName.lastIndexOf('.');
      var base = dot >= 0 ? currentName.slice(0, dot) : currentName;
      F.canvasToBlob(enhancedCanvas, 'image/jpeg', 0.98).then(function (blob) {
        F.download(blob, base + '_UltraHD.jpg');
        F.toast('Downloaded HD (JPG 100%)');
      });
    };

    F.$('#hdCopyImg', root).onclick = function () {
      if (!enhancedCanvas) return F.toast('No enhanced image ready', 'error');
      if (!(navigator.clipboard && window.ClipboardItem)) return F.toast('Browser does not support copying images; use Download', 'error');
      F.canvasToBlob(enhancedCanvas, 'image/png').then(function (blob) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function () {
          F.toast('HD Image copied to clipboard!');
        }, function () {
          F.toast('Clipboard write error; use Download instead', 'error');
        });
      });
    };

    F.$('#hdResetBtn', root).onclick = function () {
      workspace.style.display = 'none';
      dz.classList.remove('compact');
      currentImg = null;
      enhancedCanvas = null;
    };
  };
})();

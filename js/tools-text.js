/* ===== Text & developer tools ===== */
(function () {
  'use strict';
  var F = window.FT, icon = F.icon, esc = F.esc;
  var IMPL = window.TOOL_IMPL = window.TOOL_IMPL || {};
  var enc = new TextEncoder();
  function byteLen(s) { return enc.encode(s).length; }
  function debounce(fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); }; }
  function plural(n, w) { return n.toLocaleString() + ' ' + w + (n === 1 ? '' : 's'); }

  /* ---------------- Word Counter ---------------- */
  IMPL['word-counter'] = function (root) {
    var SAMPLE = 'The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the English alphabet, which makes it perfect for testing fonts and keyboards.\n\nWriting clearly matters. Whether you are drafting a college essay, a blog post, or a product description, knowing your word count and reading time helps you hit the target length every time!\n\nPaste your own text here to see live statistics update instantly.';
    root.innerHTML =
      '<div class="stats" id="wcStats"></div>' +
      '<div class="panel-row" style="margin:14px 0 16px;gap:10px">' +
      '<span class="pill">' + icon('book', 'icon-sm') + 'Reading speed (200 WPM): <strong id="wcRead">0 min</strong></span>' +
      '<span class="pill">' + icon('mic', 'icon-sm') + 'Speaking speed (130 WPM): <strong id="wcSpeak">0 min</strong></span></div>' +
      '<textarea class="editor prose" id="wcInput" placeholder="Start typing or paste your text here…" spellcheck="true" style="min-height:340px"></textarea>' +
      '<div class="toolbar" style="margin-top:14px"><button class="btn btn-primary" id="wcCopy">' + icon('copy') + 'Copy Text</button>' +
      '<button class="btn btn-danger" id="wcClear">' + icon('trash') + 'Clear</button><button class="btn" id="wcSample">' + icon('wand') + 'Load Sample</button>' +
      '<span class="spacer"></span><span class="meta" id="wcBytes">0 bytes</span></div>';
    var ta = F.$('#wcInput', root);
    function fmtTime(words, wpm) {
      if (!words) return '0 min';
      var sec = Math.round(words / wpm * 60);
      if (sec < 60) return sec + ' sec';
      var m = Math.floor(sec / 60), s = sec % 60;
      return m + ' min' + (s ? ' ' + s + ' sec' : '');
    }
    function update() {
      var v = ta.value;
      var words = (v.match(/[\p{L}\p{N}][\p{L}\p{N}'’_\-.@]*/gu) || []).length;
      var chars = Array.from(v).length;
      var noSp = Array.from(v.replace(/\s/g, '')).length;
      var sentences = v.trim() ? v.split(/[.!?…]+(?=\s|$)|\n{2,}/).filter(function (s) { return /[\p{L}\p{N}]/u.test(s); }).length : 0;
      var paras = v.trim() ? v.split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length : 0;
      var read = words ? Math.max(1, Math.ceil(words / 200)) : 0;
      var data = [['Words', words, 'accent'], ['Characters', chars], ['No Spaces', noSp], ['Sentences', sentences], ['Paragraphs', paras], ['Reading Time', read + ' min']];
      F.$('#wcStats', root).innerHTML = data.map(function (d) {
        return '<div class="stat ' + (d[2] || '') + '"><div class="s-val">' + (typeof d[1] === 'number' ? d[1].toLocaleString() : d[1]) + '</div><div class="s-label">' + d[0] + '</div></div>';
      }).join('');
      F.$('#wcRead', root).textContent = fmtTime(words, 200);
      F.$('#wcSpeak', root).textContent = fmtTime(words, 130);
      F.$('#wcBytes', root).textContent = byteLen(v).toLocaleString() + ' bytes · ' + plural(v ? v.split('\n').length : 0, 'line');
    }
    ta.addEventListener('input', update);
    F.$('#wcCopy', root).onclick = function () { F.copyText(ta.value, 'Text copied'); };
    F.$('#wcClear', root).onclick = function () { ta.value = ''; update(); ta.focus(); };
    F.$('#wcSample', root).onclick = function () { ta.value = SAMPLE; update(); };
    update();
  };

  /* ---------------- JSON Formatter ---------------- */
  function highlightJSON(s) {
    return esc(s).replace(/(&quot;(?:\\u[a-fA-F0-9]{4}|\\[^u]|(?!&quot;).)*?&quot;)(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, function (m, str, colon, lit, num) {
      if (str) return colon ? '<span style="color:#a5b4fc">' + str + '</span>' + colon : '<span style="color:#86efac">' + str + '</span>';
      if (lit) return '<span style="color:#f0abfc">' + lit + '</span>';
      if (num) return '<span style="color:#fdba74">' + num + '</span>';
      return m;
    });
  }
  function jsonErr(err, src) {
    var msg = err.message || String(err), line, col;
    var m = msg.match(/line (\d+) column (\d+)/);
    if (m) { line = +m[1]; col = +m[2]; }
    else if ((m = msg.match(/position (\d+)/))) {
      var pos = +m[1], before = src.slice(0, pos).split('\n');
      line = before.length; col = before[before.length - 1].length + 1;
    }
    return { msg: msg, line: line, col: col };
  }
  function jsonInfo(v) {
    var keys = 0, depth = 0;
    (function walk(x, d) {
      depth = Math.max(depth, d);
      if (Array.isArray(x)) x.forEach(function (y) { walk(y, d + 1); });
      else if (x && typeof x === 'object') Object.keys(x).forEach(function (k) { keys++; walk(x[k], d + 1); });
    })(v, 0);
    var type = Array.isArray(v) ? 'Array (' + v.length + ' items)' : v === null ? 'null' : typeof v === 'object' ? 'Object' : typeof v;
    return { keys: keys, depth: depth, type: type };
  }
  IMPL['json-formatter'] = function (root) {
    var SAMPLE = '{"id":1024,"name":"Ardan Tools","active":true,"version":"1.1.0","tags":["privacy","speed","offline"],"owner":{"team":"Core","members":3,"lead":null},"metrics":{"uptime":99.98,"tools":18,"regions":["ap-southeast","eu-west"]},"features":[{"slug":"json-formatter","free":true},{"slug":"qr-code-generator","free":true}]}';
    root.innerHTML =
      '<div class="toolbar" style="margin-bottom:16px">' +
      '<button class="btn btn-primary" id="jfFormat">' + icon('wand') + 'Format JSON</button>' +
      '<button class="btn" id="jfMinify">' + icon('minimize') + 'Minify</button>' +
      '<label class="meta" for="jfIndent" style="margin-left:6px">Indent</label><select class="input" id="jfIndent" style="width:auto;padding:8px 10px"><option value="2">2 spaces *</option><option value="4">4 spaces</option><option value="tab">Tab</option></select>' +
      '<span class="spacer"></span><button class="btn" id="jfSample">' + icon('sparkles') + 'Sample JSON</button><button class="btn btn-danger" id="jfClear">' + icon('trash') + 'Clear</button></div>' +
      '<div class="grid-2">' +
      '<div><div class="panel-head"><span class="panel-title">' + icon('braces', 'icon-sm') + 'Input (raw or minified JSON)</span><span class="meta" id="jfInMeta">0 chars</span></div>' +
      '<textarea class="editor" id="jfIn" spellcheck="false" placeholder=\'Paste JSON here, e.g. {"hello":"world"}\' style="min-height:420px"></textarea></div>' +
      '<div><div class="panel-head"><span class="panel-title">' + icon('eye', 'icon-sm') + 'Formatted Output</span><span class="toolbar"><button class="btn btn-sm" id="jfCopy">' + icon('copy', 'icon-sm') + 'Copy</button><button class="btn btn-sm" id="jfSave">' + icon('download', 'icon-sm') + 'Save .json</button></span></div>' +
      '<pre class="code-out" id="jfOut" style="min-height:420px;max-height:420px"></pre></div></div>' +
      '<div id="jfStatus"></div>';
    var input = F.$('#jfIn', root), out = F.$('#jfOut', root), status = F.$('#jfStatus', root), indentSel = F.$('#jfIndent', root);
    var result = '', lastAction = 'format';
    function indent() { var v = indentSel.value; return v === 'tab' ? '\t' : +v; }
    function setOut(text) { result = text; out.innerHTML = text ? highlightJSON(text) : '<span style="color:#64748b">Formatted output will appear here…</span>'; }
    function run(action) {
      lastAction = action || lastAction;
      var src = input.value;
      F.$('#jfInMeta', root).textContent = src.length.toLocaleString() + ' chars';
      if (!src.trim()) { setOut(''); status.innerHTML = ''; return; }
      try {
        var v = JSON.parse(src);
        var text = lastAction === 'minify' ? JSON.stringify(v) : JSON.stringify(v, null, indent());
        setOut(text);
        var info = jsonInfo(v);
        status.innerHTML = '<div class="notice notice-ok">' + icon('checkCircle') + '<span><strong>Valid JSON</strong> · ' + esc(info.type) + ' · ' + info.keys + ' keys · depth ' + info.depth + ' · ' + F.formatBytes(byteLen(text)) + (lastAction === 'minify' ? ' minified' : ' formatted') + '</span></div>';
      } catch (err) {
        var e = jsonErr(err, src);
        setOut('');
        status.innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span><strong>Invalid JSON' + (e.line ? ' at line ' + e.line + ', column ' + e.col : '') + ':</strong> <code>' + esc(e.msg) + '</code></span></div>';
      }
    }
    var live = debounce(function () { run(); }, 250);
    input.addEventListener('input', live);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); var s = input.selectionStart; input.setRangeText('  ', s, input.selectionEnd, 'end'); live(); }
    });
    F.$('#jfFormat', root).onclick = function () { run('format'); if (result) toast('Formatted'); };
    F.$('#jfMinify', root).onclick = function () { run('minify'); if (result) toast('Minified'); };
    indentSel.onchange = function () { run('format'); };
    F.$('#jfSample', root).onclick = function () { input.value = SAMPLE; run('format'); };
    F.$('#jfClear', root).onclick = function () { input.value = ''; run(); input.focus(); };
    F.$('#jfCopy', root).onclick = function () { F.copyText(result, 'JSON copied'); };
    F.$('#jfSave', root).onclick = function () {
      if (!result) return F.toast('Nothing to save yet', 'error');
      F.download(new Blob([result], { type: 'application/json' }), lastAction === 'minify' ? 'data.min.json' : 'formatted.json');
    };
    function toast(m) { F.toast(m); }
    setOut(''); run();
  };

  /* ---------------- Base64 ---------------- */
  function b64EncodeBytes(bytes) {
    var bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  }
  function toUrlSafe(s) { return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64DecodeBytes(s) {
    s = s.trim().replace(/^data:[^,]*,/, '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    if (/[^A-Za-z0-9+/=]/.test(s)) throw new Error('Input contains characters that are not valid Base64.');
    while (s.length % 4) s += '=';
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  IMPL['base64-encode-decode'] = function (root) {
    var mode = 'encode', file = null, decodedBytes = null;
    root.innerHTML =
      '<div class="toolbar" style="margin-bottom:16px"><div class="seg" id="b6Mode"><button class="active" data-m="encode">' + icon('lock', 'icon-sm') + 'Encode to Base64</button><button data-m="decode">' + icon('refresh', 'icon-sm') + 'Decode from Base64</button></div>' +
      '<span class="spacer"></span><label class="switch"><input type="checkbox" id="b6Url"><span class="track"></span>URL-Safe Base64</label>' +
      '<button class="btn" id="b6Upload">' + icon('upload') + 'Upload File</button></div>' +
      '<div class="grid-2"><div><div class="panel-head"><span class="panel-title" id="b6InTitle">Raw Input Text / Data</span><button class="btn btn-sm btn-danger" id="b6Clear">' + icon('trash', 'icon-sm') + 'Clear</button></div>' +
      '<textarea class="editor" id="b6In" spellcheck="false" style="min-height:300px;white-space:pre-wrap;word-break:break-all"></textarea><div class="meta" id="b6InMeta" style="margin-top:6px"></div></div>' +
      '<div><div class="panel-head"><span class="panel-title" id="b6OutTitle">Base64 Output</span><span class="toolbar"><button class="btn btn-sm" id="b6Dl" style="display:none">' + icon('download', 'icon-sm') + 'Download File</button><button class="btn btn-sm btn-primary" id="b6Copy">' + icon('copy', 'icon-sm') + 'Copy Output</button></span></div>' +
      '<pre class="code-out" id="b6Out" style="min-height:300px;max-height:300px"></pre><div class="meta" id="b6OutMeta" style="margin-top:6px"></div></div></div><div id="b6Status"></div>';
    var input = F.$('#b6In', root), out = F.$('#b6Out', root), st = F.$('#b6Status', root), urlSafe = F.$('#b6Url', root);
    var result = '';
    input.value = 'Hello, World! Ardan Tools V1.1 🚀';
    function run() {
      st.innerHTML = ''; decodedBytes = null; F.$('#b6Dl', root).style.display = 'none';
      var v = input.value;
      if (file) {
        F.$('#b6InMeta', root).textContent = file.name + ' · ' + F.formatBytes(file.size);
      } else {
        F.$('#b6InMeta', root).textContent = Array.from(v).length.toLocaleString() + ' characters · ' + byteLen(v).toLocaleString() + ' bytes';
      }
      if (mode === 'encode') {
        if (file) return; // handled by file reader
        result = v ? b64EncodeBytes(enc.encode(v)) : '';
        if (urlSafe.checked) result = toUrlSafe(result);
      } else {
        result = '';
        if (v.trim()) {
          try {
            var bytes = b64DecodeBytes(v);
            try { result = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
            catch (e) {
              decodedBytes = bytes;
              result = '[Binary data: ' + bytes.length.toLocaleString() + ' bytes, not valid UTF-8 text]\nUse "Download File" to save the decoded bytes.';
              F.$('#b6Dl', root).style.display = '';
            }
          } catch (err) {
            st.innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span><strong>Invalid Base64:</strong> ' + esc(err.message.replace(/^.*?: /, '')) + '</span></div>';
          }
        }
      }
      show();
    }
    function show() {
      out.textContent = result;
      if (!result) out.innerHTML = '<span style="color:#64748b">Output appears here…</span>';
      F.$('#b6OutMeta', root).textContent = Array.from(result).length.toLocaleString() + ' characters';
    }
    function setMode(m) {
      mode = m; file = null; input.disabled = false;
      F.$$('#b6Mode button', root).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-m') === m); });
      F.$('#b6InTitle', root).textContent = m === 'encode' ? 'Raw Input Text / Data' : 'Base64 Input';
      F.$('#b6OutTitle', root).textContent = m === 'encode' ? 'Base64 Output' : 'Decoded Text Output';
      F.$('#b6Upload', root).style.display = m === 'encode' ? '' : 'none';
      input.placeholder = m === 'encode' ? 'Type or paste text to encode…' : 'Paste a Base64 string (or data: URI) to decode…';
      if (result && m === 'decode' && !input.disabled) input.value = result.indexOf('[Binary') === 0 ? '' : result;
      run();
    }
    F.$$('#b6Mode button', root).forEach(function (b) { b.onclick = function () { if (b.getAttribute('data-m') !== mode) setMode(b.getAttribute('data-m')); }; });
    input.addEventListener('input', run);
    urlSafe.onchange = function () {
      if (file && mode === 'encode') encodeFile(); else run();
    };
    function encodeFile() {
      F.readDataURL(file).then(function (dataUrl) {
        var i = dataUrl.indexOf(',');
        var payload = dataUrl.slice(i + 1);
        result = urlSafe.checked ? dataUrl.slice(0, i + 1) + toUrlSafe(payload) : dataUrl;
        show();
        st.innerHTML = '<div class="notice notice-ok">' + icon('checkCircle') + '<span>Encoded <strong>' + esc(file.name) + '</strong> as a Data URL (' + F.formatBytes(file.size) + ' → ' + F.formatBytes(result.length) + ').</span></div>';
      });
    }
    F.$('#b6Upload', root).onclick = function () {
      F.pickFile('').then(function (f) {
        if (!f) return;
        if (f.size > 20 * 1048576) return F.toast('Please choose a file under 20MB', 'error');
        file = f; input.value = '📎 ' + f.name + ' (' + F.formatBytes(f.size) + ')\nThis file is being encoded as a Base64 Data URL. Click Clear to type text instead.';
        input.disabled = true;
        F.$('#b6InMeta', root).textContent = f.name + ' · ' + F.formatBytes(f.size);
        encodeFile();
      });
    };
    F.$('#b6Clear', root).onclick = function () { file = null; input.disabled = false; input.value = ''; run(); input.focus(); };
    F.$('#b6Copy', root).onclick = function () { F.copyText(decodedBytes ? '' : result, 'Output copied'); };
    F.$('#b6Dl', root).onclick = function () { if (decodedBytes) F.download(new Blob([decodedBytes]), 'decoded.bin'); };
    setMode('encode');
  };

  /* ---------------- CSV <-> JSON ---------------- */
  function parseCSV(text, delim) {
    var rows = [], row = [], field = '', i = 0, q = false, c;
    text = text.replace(/^\uFEFF/, '');
    while (i < text.length) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += c;
      } else if (c === '"' && field === '') q = true;
      else if (c === delim) { row.push(field); field = ''; }
      else if (c === '\r') { /* skip */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
      i++;
    }
    if (q) throw new Error('Unclosed quoted field: a value starts with " but never ends.');
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return !(r.length === 1 && r[0] === ''); });
  }
  function autoVal(v) {
    var t = v.trim();
    if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(t)) return Number(t);
    if (/^(true|false)$/i.test(t)) return t.toLowerCase() === 'true';
    if (/^null$/i.test(t)) return null;
    return v;
  }
  function csvCell(v, delim) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') v = JSON.stringify(v);
    v = String(v);
    return (v.indexOf(delim) >= 0 || /["\r\n]/.test(v) || /^\s|\s$/.test(v)) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  IMPL['csv-to-json'] = function (root) {
    var SAMPLE_CSV = 'id,name,role,department,active,salary\n1,Alice Johnson,Engineer,"Research, Development",true,85000\n2,Budi Santoso,Designer,Product,true,72000\n3,Chen Wei,Analyst,Finance,false,64000';
    var mode = 'csv';
    root.innerHTML =
      '<div class="toolbar" style="margin-bottom:14px"><div class="seg" id="cjMode"><button class="active" data-m="csv">CSV ke JSON</button><button data-m="json">JSON ke CSV</button></div><span class="spacer"></span>' +
      '<button class="btn" id="cjSample">' + icon('sparkles') + 'Sample</button><button class="btn" id="cjUpload">' + icon('upload') + 'Upload File</button></div>' +
      '<div class="toolbar" style="margin-bottom:16px;gap:16px"><div class="field" style="flex-direction:row;align-items:center;gap:8px"><label for="cjDelim">Delimiter <span class="req">*</span></label><select class="input" id="cjDelim" style="width:auto;padding:8px 10px"><option value=",">Comma (,)</option><option value=";">Semicolon (;)</option><option value="\t">Tab (\\t)</option><option value="|">Pipe (|)</option></select></div>' +
      '<label class="switch" id="cjHeaderWrap"><input type="checkbox" id="cjHeader" checked><span class="track"></span>Header Row</label>' +
      '<label class="switch" id="cjAutoWrap"><input type="checkbox" id="cjAuto" checked><span class="track"></span>Auto Parse Numbers</label>' +
      '<div class="field" id="cjIndentWrap" style="flex-direction:row;align-items:center;gap:8px"><label for="cjIndent">JSON Indent</label><select class="input" id="cjIndent" style="width:auto;padding:8px 10px"><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="0">Minified</option></select></div></div>' +
      '<div class="grid-2"><div><div class="panel-head"><span class="panel-title" id="cjInTitle">' + icon('table', 'icon-sm') + 'CSV Table Input</span><button class="btn btn-sm btn-danger" id="cjClear">' + icon('trash', 'icon-sm') + 'Clear</button></div>' +
      '<textarea class="editor" id="cjIn" spellcheck="false" style="min-height:380px"></textarea><div class="meta" id="cjInMeta" style="margin-top:6px"></div></div>' +
      '<div><div class="panel-head"><span class="panel-title" id="cjOutTitle">' + icon('braces', 'icon-sm') + 'Structured JSON Output</span><span class="toolbar"><button class="btn btn-sm" id="cjDl">' + icon('download', 'icon-sm') + 'Download</button><button class="btn btn-sm btn-primary" id="cjCopy">' + icon('copy', 'icon-sm') + 'Copy Output</button></span></div>' +
      '<pre class="code-out" id="cjOut" style="min-height:380px;max-height:380px;white-space:pre;word-break:normal"></pre><div class="meta" id="cjOutMeta" style="margin-top:6px"></div></div></div><div id="cjStatus"></div>';
    var input = F.$('#cjIn', root), out = F.$('#cjOut', root), st = F.$('#cjStatus', root);
    var delim = F.$('#cjDelim', root), header = F.$('#cjHeader', root), auto = F.$('#cjAuto', root), indentSel = F.$('#cjIndent', root);
    var result = '';
    input.value = SAMPLE_CSV;
    function run() {
      st.innerHTML = ''; result = '';
      var v = input.value, d = delim.value, rowsInfo = '';
      try {
        if (!v.trim()) { /* empty */ }
        else if (mode === 'csv') {
          var rows = parseCSV(v, d), data;
          if (header.checked) {
            var keys = (rows.shift() || []).map(function (k, i) { return k.trim() || 'column' + (i + 1); });
            data = rows.map(function (r) {
              var o = {};
              keys.forEach(function (k, i) { var cell = r[i] === undefined ? '' : r[i]; o[k] = auto.checked ? autoVal(cell) : cell; });
              return o;
            });
          } else data = rows.map(function (r) { return r.map(function (c) { return auto.checked ? autoVal(c) : c; }); });
          rowsInfo = plural(data.length, 'row') + ' detected';
          var ind = +indentSel.value;
          result = JSON.stringify(data, null, ind || undefined);
        } else {
          var j = JSON.parse(v);
          if (!Array.isArray(j)) j = [j];
          var cols = [], seen = {}, isArr = j.every(Array.isArray);
          var lines = [];
          if (isArr) lines = j.map(function (r) { return r.map(function (c) { return csvCell(c, d); }).join(d); });
          else {
            j.forEach(function (o) { if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { if (!seen[k]) { seen[k] = 1; cols.push(k); } }); });
            if (header.checked) lines.push(cols.map(function (c) { return csvCell(c, d); }).join(d));
            j.forEach(function (o) { lines.push(cols.map(function (c) { return csvCell(o == null ? '' : o[c], d); }).join(d)); });
          }
          rowsInfo = plural(j.length, 'record') + ' detected';
          result = lines.join('\n');
        }
      } catch (err) {
        st.innerHTML = '<div class="notice notice-error">' + icon('alert') + '<span><strong>' + (mode === 'csv' ? 'CSV parse error' : 'Invalid JSON') + ':</strong> <code>' + esc(err.message) + '</code></span></div>';
      }
      F.$('#cjInMeta', root).textContent = v.length.toLocaleString() + ' characters' + (rowsInfo ? ' · ' + rowsInfo : '');
      out.textContent = result;
      if (!result) out.innerHTML = '<span style="color:#64748b">Output appears here…</span>';
      F.$('#cjOutMeta', root).textContent = result.length.toLocaleString() + ' characters';
    }
    function setMode(m) {
      var prev = result;
      mode = m;
      F.$$('#cjMode button', root).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-m') === m); });
      F.$('#cjInTitle', root).innerHTML = m === 'csv' ? icon('table', 'icon-sm') + 'CSV Table Input' : icon('braces', 'icon-sm') + 'JSON Array Input';
      F.$('#cjOutTitle', root).innerHTML = m === 'csv' ? icon('braces', 'icon-sm') + 'Structured JSON Output' : icon('table', 'icon-sm') + 'CSV Table Output';
      F.$('#cjAutoWrap', root).style.display = m === 'csv' ? '' : 'none';
      F.$('#cjIndentWrap', root).style.display = m === 'csv' ? '' : 'none';
      if (prev) input.value = prev;
      run();
    }
    F.$$('#cjMode button', root).forEach(function (b) { b.onclick = function () { if (b.getAttribute('data-m') !== mode) setMode(b.getAttribute('data-m')); }; });
    [delim, header, auto, indentSel].forEach(function (el) { el.onchange = run; });
    input.addEventListener('input', debounce(run, 200));
    F.$('#cjSample', root).onclick = function () {
      input.value = mode === 'csv' ? SAMPLE_CSV.replace(/,/g, delim.value === ',' ? ',' : delim.value).replace('"Research' + delim.value + ' Development"', '"Research, Development"') : JSON.stringify([{ id: 1, name: 'Alice Johnson', role: 'Engineer', department: 'Research, Development', active: true, salary: 85000 }, { id: 2, name: 'Budi Santoso', role: 'Designer', department: 'Product', active: true, salary: 72000 }], null, 2);
      run();
    };
    F.$('#cjUpload', root).onclick = function () {
      F.pickFile('.csv,.tsv,.txt,.json,text/csv,application/json').then(function (f) {
        if (!f) return;
        F.readText(f).then(function (txt) {
          var isJson = /\.json$/i.test(f.name) || /^\s*[\[{]/.test(txt);
          if (/\.tsv$/i.test(f.name)) delim.value = '\t';
          if (isJson && mode !== 'json') setMode('json');
          if (!isJson && mode !== 'csv') setMode('csv');
          input.value = txt; run(); F.toast('Loaded ' + f.name);
        });
      });
    };
    F.$('#cjClear', root).onclick = function () { input.value = ''; run(); input.focus(); };
    F.$('#cjCopy', root).onclick = function () { F.copyText(result, 'Output copied'); };
    F.$('#cjDl', root).onclick = function () {
      if (!result) return F.toast('Nothing to download yet', 'error');
      if (mode === 'csv') F.download(new Blob([result], { type: 'application/json' }), 'converted.json');
      else F.download(new Blob(['\uFEFF' + result], { type: 'text/csv' }), 'converted.csv');
    };
    run();
  };

  /* ---------------- Case Converter ---------------- */
  var SMALL = /^(a|an|the|and|but|or|nor|for|so|yet|as|at|by|in|of|off|on|per|to|up|via|vs|with|from|into|onto|over|than)$/i;
  function words(s) {
    return (s.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2').replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, '$1 $2').match(/[\p{L}\p{N}]+/gu) || []);
  }
  var CASES = {
    sentence: function (s) {
      return s.toLowerCase().replace(/(^\s*|[.!?…]\s+|\n\s*)(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); }).replace(/\bi\b/g, 'I');
    },
    lower: function (s) { return s.toLowerCase(); },
    upper: function (s) { return s.toUpperCase(); },
    title: function (s) {
      return s.split('\n').map(function (line) {
        var parts = line.toLowerCase().split(/(\s+)/), idx = [];
        parts.forEach(function (p, i) { if (/\S/.test(p)) idx.push(i); });
        return parts.map(function (p, i) {
          if (!/\S/.test(p)) return p;
          var first = i === idx[0], last = i === idx[idx.length - 1];
          var core = p.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
          if (!first && !last && SMALL.test(core)) return p;
          return p.replace(/\p{L}/u, function (c) { return c.toUpperCase(); }).replace(/([-–—\/])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); });
        }).join('');
      }).join('\n');
    },
    camel: function (s) { return s.split('\n').map(function (l) { return words(l).map(function (w, i) { w = w.toLowerCase(); return i ? w.charAt(0).toUpperCase() + w.slice(1) : w; }).join(''); }).join('\n'); },
    snake: function (s) { return s.split('\n').map(function (l) { return words(l).map(function (w) { return w.toLowerCase(); }).join('_'); }).join('\n'); },
    kebab: function (s) { return s.split('\n').map(function (l) { return words(l).map(function (w) { return w.toLowerCase(); }).join('-'); }).join('\n'); },
    constant: function (s) { return s.split('\n').map(function (l) { return words(l).map(function (w) { return w.toUpperCase(); }).join('_'); }).join('\n'); },
    alternating: function (s) { var n = 0; return Array.from(s).map(function (c) { if (!/\p{L}/u.test(c)) return c; return (n++ % 2) ? c.toUpperCase() : c.toLowerCase(); }).join(''); }
  };
  IMPL['case-converter'] = function (root) {
    var SAMPLE = 'The quick brown fox jumps over the lazy dog while learning about text case styles.';
    var btns = [['sentence', 'Sentence case'], ['lower', 'lower case'], ['upper', 'UPPER CASE'], ['title', 'Title Case'], ['camel', 'camelCase'], ['snake', 'snake_case'], ['kebab', 'kebab-case'], ['constant', 'CONSTANT_CASE'], ['alternating', 'aLtErNaTiNg cAsE']];
    root.innerHTML = '<div class="case-btns" id="ccBtns">' + btns.map(function (b) { return '<button data-c="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div>' +
      '<div class="divider"></div><div class="panel-head"><span class="panel-title">' + icon('type', 'icon-sm') + 'Text Input &amp; Output</span><span class="toolbar"><button class="btn btn-sm" id="ccSample">' + icon('sparkles', 'icon-sm') + 'Sample</button><button class="btn btn-sm btn-danger" id="ccClear">' + icon('trash', 'icon-sm') + 'Clear</button></span></div>' +
      '<textarea class="editor prose" id="ccText" style="min-height:260px" placeholder="Type or paste your text, then pick a case style above…"></textarea>' +
      '<div class="toolbar" style="margin-top:14px"><div class="panel-row" id="ccStats" style="gap:8px"></div><span class="spacer"></span><button class="btn btn-primary" id="ccCopy">' + icon('copy') + 'Copy Text</button></div>';
    var ta = F.$('#ccText', root);
    ta.value = SAMPLE;
    function stats() {
      var v = ta.value;
      F.$('#ccStats', root).innerHTML = '<span class="pill">Characters: <strong>' + Array.from(v).length + '</strong></span><span class="pill">Words: <strong>' + (v.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu) || []).length + '</strong></span><span class="pill">Lines: <strong>' + (v ? v.split('\n').length : 0) + '</strong></span>';
    }
    F.$$('#ccBtns button', root).forEach(function (b) {
      b.onclick = function () {
        if (!ta.value) return F.toast('Type some text first', 'error');
        ta.value = CASES[b.getAttribute('data-c')](ta.value);
        F.$$('#ccBtns button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        stats();
      };
    });
    ta.addEventListener('input', function () { F.$$('#ccBtns button', root).forEach(function (x) { x.classList.remove('active'); }); stats(); });
    F.$('#ccSample', root).onclick = function () { ta.value = SAMPLE; stats(); };
    F.$('#ccClear', root).onclick = function () { ta.value = ''; stats(); ta.focus(); };
    F.$('#ccCopy', root).onclick = function () { F.copyText(ta.value, 'Text copied'); };
    stats();
  };

  /* ---------------- Markdown ---------------- */
  function sanitize(html) {
    var doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    doc.querySelectorAll('script,iframe,object,embed,style,link,meta,base,form').forEach(function (n) { n.remove(); });
    doc.querySelectorAll('*').forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (a) {
        if (/^on/i.test(a.name) || (/^(href|src|xlink:href|action)$/i.test(a.name) && /^\s*(javascript|vbscript|data:text\/html)/i.test(a.value))) n.removeAttribute(a.name);
      });
    });
    return doc.body.firstChild.innerHTML;
  }
  var MD_CSS = 'body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.7;color:#0f172a;max-width:780px;margin:40px auto;padding:0 20px}h1,h2{border-bottom:1px solid #e2e8f0;padding-bottom:.3em}a{color:#4f46e5}code{font-family:ui-monospace,Menlo,Consolas,monospace;background:#f1f5f9;padding:.15em .4em;border-radius:5px;font-size:.9em}pre{background:#0f172a;color:#e2e8f0;padding:14px 16px;border-radius:10px;overflow:auto}pre code{background:none;color:inherit;padding:0}blockquote{border-left:4px solid #c7d2fe;margin:0 0 1em;padding:.2em 1em;color:#475569;background:#eef2ff}table{border-collapse:collapse;width:100%}th,td{border:1px solid #e2e8f0;padding:7px 12px;text-align:left}th{background:#f1f5f9}img{max-width:100%}';
  IMPL['markdown-to-html'] = function (root) {
    var SAMPLE = [
      '# Welcome to the Markdown Editor', '',
      'Write **Markdown** on the left and see a *live preview* on the right.', 'Everything runs ~~on a server~~ in your browser.', '',
      '## Features', '',
      '- Headings, **bold**, *italic*, and `inline code`', '- [Links](https://commonmark.org) and images', '- Tables, blockquotes, and task lists', '',
      '### Task List', '', '- [x] Write documentation', '- [ ] Export to HTML', '',
      '> "Simplicity is the ultimate sophistication."', '',
      '| Tool | Category | Free |', '|------|----------|------|', '| Word Counter | Text | ✅ |', '| QR Generator | Image | ✅ |', '',
      '```js', 'function greet(name) {', '  return `Hello, ${name}!`;', '}', '```'
    ].join('\n');
    var tab = 'preview', html = '';
    root.innerHTML =
      '<div class="toolbar" style="margin-bottom:14px"><button class="btn" id="mdSample">' + icon('sparkles') + 'Sample</button><button class="btn btn-danger" id="mdClear">' + icon('trash') + 'Clear</button>' +
      '<span class="spacer"></span><button class="btn" id="mdCopy">' + icon('copy') + 'Copy HTML</button><button class="btn btn-primary" id="mdDl">' + icon('download') + 'Download .html</button></div>' +
      '<div class="md-split"><div><div class="panel-head"><span class="panel-title">' + icon('markdown', 'icon-sm') + 'Raw Input</span><span class="meta" id="mdStats"></span></div>' +
      '<textarea class="editor" id="mdIn" spellcheck="false" style="white-space:pre-wrap"></textarea></div>' +
      '<div><div class="panel-head"><span class="panel-title">' + icon('eye', 'icon-sm') + 'Rendered Output</span><div class="seg" id="mdTabs"><button class="active" data-t="preview">Preview</button><button data-t="code">HTML Code</button></div></div>' +
      '<div class="md-preview markdown-body" id="mdPrev"></div><pre class="code-out" id="mdCode" style="display:none"></pre></div></div>';
    var input = F.$('#mdIn', root), prev = F.$('#mdPrev', root), code = F.$('#mdCode', root);
    input.value = SAMPLE;
    prev.innerHTML = '<div class="qr-status"><span class="spinner"></span>Loading Markdown engine…</div>';
    F.LIB.marked().then(function (marked) {
      function render() {
        var v = input.value;
        html = sanitize(marked.parse(v, { gfm: true, breaks: false }));
        prev.innerHTML = html || '<p style="color:var(--muted)">Preview appears here…</p>';
        code.textContent = html;
        var w = (v.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu) || []).length;
        F.$('#mdStats', root).textContent = w + ' words · ' + Array.from(v).length + ' chars · ' + (v ? v.split('\n').length : 0) + ' lines';
      }
      input.addEventListener('input', debounce(render, 120));
      F.$('#mdSample', root).onclick = function () { input.value = SAMPLE; render(); };
      F.$('#mdClear', root).onclick = function () { input.value = ''; render(); input.focus(); };
      render();
    }, function () { prev.innerHTML = '<div class="notice notice-error">Could not load the Markdown engine.</div>'; });
    F.$$('#mdTabs button', root).forEach(function (b) {
      b.onclick = function () {
        tab = b.getAttribute('data-t');
        F.$$('#mdTabs button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        prev.style.display = tab === 'preview' ? '' : 'none'; code.style.display = tab === 'code' ? '' : 'none';
      };
    });
    F.$('#mdCopy', root).onclick = function () { F.copyText(html, 'HTML copied'); };
    F.$('#mdDl', root).onclick = function () {
      if (!html) return F.toast('Nothing to export yet', 'error');
      var title = (input.value.match(/^#\s+(.+)$/m) || [, 'Document'])[1];
      var doc = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + esc(title) + '</title>\n<style>' + MD_CSS + '</style>\n</head>\n<body>\n' + html + '\n</body>\n</html>\n';
      F.download(new Blob([doc], { type: 'text/html' }), (title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'document') + '.html');
    };
  };

  /* ---------------- Hash & UUID ---------------- */
  // MD5 over bytes (RFC 1321)
  function md5(bytes) {
    var K = [], S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
    for (var i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
    var len = bytes.length, nBlocks = ((len + 8) >>> 6) + 1, words = new Uint32Array(nBlocks * 16);
    for (i = 0; i < len; i++) words[i >> 2] |= bytes[i] << ((i % 4) * 8);
    words[len >> 2] |= 0x80 << ((len % 4) * 8);
    var bitLen = len * 8;
    words[nBlocks * 16 - 2] = bitLen >>> 0;
    words[nBlocks * 16 - 1] = Math.floor(bitLen / 4294967296);
    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    for (var blk = 0; blk < nBlocks; blk++) {
      var A = a0, B = b0, C = c0, D = d0, off = blk * 16;
      for (i = 0; i < 64; i++) {
        var f, g;
        if (i < 16) { f = (B & C) | (~B & D); g = i; }
        else if (i < 32) { f = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (i < 48) { f = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { f = C ^ (B | ~D); g = (7 * i) % 16; }
        var tmp = D; D = C; C = B;
        var x = (A + f + K[i] + words[off + g]) >>> 0;
        B = (B + ((x << S[i]) | (x >>> (32 - S[i])))) >>> 0;
        A = tmp;
      }
      a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
    }
    return [a0, b0, c0, d0].map(function (v) {
      var h = '';
      for (var j = 0; j < 4; j++) h += ('0' + ((v >>> (j * 8)) & 255).toString(16)).slice(-2);
      return h;
    }).join('');
  }
  window.FT.md5 = md5;
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    var b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    var h = hex(b);
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  IMPL['hash-uuid-generator'] = function (root) {
    var count = 5, list = [], hashSrc = null, hashes = {};
    root.innerHTML =
      '<div class="seg" id="huTabs" style="margin-bottom:18px"><button class="active" data-t="uuid">' + icon('refresh', 'icon-sm') + 'UUID v4 Generator</button><button data-t="hash">' + icon('hash', 'icon-sm') + 'Text Hash Calculator (SHA / MD5)</button></div>' +
      '<div id="huUuid"><div class="toolbar" style="gap:14px;margin-bottom:16px"><span class="label">Quantity</span><div class="seg" id="huCount">' + [1, 5, 10, 25, 50].map(function (n) { return '<button data-n="' + n + '"' + (n === 5 ? ' class="active"' : '') + '>' + n + '</button>'; }).join('') + '</div>' +
      '<label class="switch"><input type="checkbox" id="huUpper"><span class="track"></span>Uppercase</label><label class="switch"><input type="checkbox" id="huNoHy"><span class="track"></span>Remove Hyphens</label>' +
      '<span class="spacer"></span><button class="btn btn-primary" id="huRegen">' + icon('refresh') + 'Regenerate</button></div>' +
      '<div class="panel-head"><span class="panel-title" id="huTitle"></span><span class="toolbar"><button class="btn btn-sm" id="huCopyAll">' + icon('copy', 'icon-sm') + 'Copy All</button><button class="btn btn-sm" id="huTxt">' + icon('download', 'icon-sm') + 'Download .txt</button></span></div>' +
      '<ul class="uuid-list" id="huList"></ul></div>' +
      '<div id="huHash" style="display:none"><div class="panel-head"><span class="panel-title">Input Text</span><span class="toolbar"><label class="switch"><input type="checkbox" id="huHUpper"><span class="track"></span>Uppercase</label><button class="btn btn-sm" id="huFile">' + icon('upload', 'icon-sm') + 'Hash a File</button><button class="btn btn-sm btn-danger" id="huHClear">' + icon('trash', 'icon-sm') + 'Clear</button></span></div>' +
      '<textarea class="editor" id="huIn" style="min-height:150px;white-space:pre-wrap" placeholder="Type or paste text to hash…">Hello, World!</textarea><div class="meta" id="huInMeta" style="margin:6px 0 16px"></div>' +
      '<div class="hash-rows" id="huRows"></div></div>';
    function fmtU(u) {
      if (F.$('#huNoHy', root).checked) u = u.replace(/-/g, '');
      return F.$('#huUpper', root).checked ? u.toUpperCase() : u.toLowerCase();
    }
    function regen() { list = []; for (var i = 0; i < count; i++) list.push(uuid()); drawU(); }
    function drawU() {
      F.$('#huTitle', root).textContent = count + ' Generated UUID' + (count > 1 ? 's' : '') + ' (RFC 4122 v4)';
      F.$('#huList', root).innerHTML = list.map(function (u, i) {
        return '<li><span class="n">' + (i + 1) + '</span><span class="u">' + fmtU(u) + '</span><button class="icon-btn" data-i="' + i + '" title="Copy">' + icon('copy', 'icon-sm') + '</button></li>';
      }).join('');
    }
    F.$('#huList', root).addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]'); if (b) F.copyText(fmtU(list[+b.getAttribute('data-i')]), 'UUID copied');
    });
    F.$$('#huCount button', root).forEach(function (b) {
      b.onclick = function () { count = +b.getAttribute('data-n'); F.$$('#huCount button', root).forEach(function (x) { x.classList.toggle('active', x === b); }); regen(); };
    });
    F.$('#huUpper', root).onchange = drawU; F.$('#huNoHy', root).onchange = drawU;
    F.$('#huRegen', root).onclick = function () { regen(); F.toast('New UUIDs generated'); };
    F.$('#huCopyAll', root).onclick = function () { F.copyText(list.map(fmtU).join('\n'), 'All UUIDs copied'); };
    F.$('#huTxt', root).onclick = function () { F.download(new Blob([list.map(fmtU).join('\n') + '\n'], { type: 'text/plain' }), 'uuids.txt'); };

    var ALGOS = [['MD5', 128], ['SHA-1', 160], ['SHA-256', 256], ['SHA-512', 512]];
    function drawH() {
      var up = F.$('#huHUpper', root).checked;
      F.$('#huRows', root).innerHTML = ALGOS.map(function (a) {
        var v = hashes[a[0]] || '';
        return '<div class="hash-row"><div class="h-name">' + a[0] + '<span class="h-bits">' + a[1] + '-bit</span></div><div class="h-val">' + (v ? (up ? v.toUpperCase() : v) : '<span style="color:#94a3b8">—</span>') + '</div><button class="icon-btn" data-a="' + a[0] + '" title="Copy">' + icon('copy', 'icon-sm') + '</button></div>';
      }).join('');
    }
    F.$('#huRows', root).addEventListener('click', function (e) {
      var b = e.target.closest('button[data-a]');
      if (b) { var v = hashes[b.getAttribute('data-a')]; F.copyText(F.$('#huHUpper', root).checked ? (v || '').toUpperCase() : v, b.getAttribute('data-a') + ' copied'); }
    });
    var gen = 0;
    function computeHashes(bytes) {
      var my = ++gen;
      hashes = { MD5: md5(bytes) };
      drawH();
      if (!(window.crypto && crypto.subtle)) {
        F.$('#huInMeta', root).innerHTML += ' · <span style="color:var(--danger)">SHA needs HTTPS (secure context)</span>';
        return;
      }
      Promise.all(ALGOS.slice(1).map(function (a) { return crypto.subtle.digest(a[0], bytes); })).then(function (res) {
        if (my !== gen) return;
        res.forEach(function (r, i) { hashes[ALGOS[i + 1][0]] = hex(r); });
        drawH();
      });
    }
    var hin = F.$('#huIn', root);
    function textHash() {
      hashSrc = null;
      var v = hin.value;
      F.$('#huInMeta', root).textContent = Array.from(v).length + ' characters · ' + byteLen(v) + ' bytes (UTF-8)';
      computeHashes(enc.encode(v));
    }
    hin.addEventListener('input', debounce(textHash, 120));
    F.$('#huHUpper', root).onchange = drawH;
    F.$('#huHClear', root).onclick = function () { hin.disabled = false; hin.value = ''; textHash(); hin.focus(); };
    F.$('#huFile', root).onclick = function () {
      F.pickFile('').then(function (f) {
        if (!f) return;
        if (f.size > 500 * 1048576) return F.toast('Please choose a file under 500MB', 'error');
        F.$('#huInMeta', root).innerHTML = '<span class="spinner"></span> Reading ' + esc(f.name) + '…';
        F.readArrayBuffer(f).then(function (buf) {
          hin.value = '📎 ' + f.name + ' (' + F.formatBytes(f.size) + ')\nHashes below are for this file\'s contents. Click Clear to hash text instead.';
          hin.disabled = true;
          F.$('#huInMeta', root).textContent = 'File checksum · ' + f.size.toLocaleString() + ' bytes';
          computeHashes(new Uint8Array(buf));
        });
      });
    };
    F.$$('#huTabs button', root).forEach(function (b) {
      b.onclick = function () {
        var t = b.getAttribute('data-t');
        F.$$('#huTabs button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        F.$('#huUuid', root).style.display = t === 'uuid' ? '' : 'none';
        F.$('#huHash', root).style.display = t === 'hash' ? '' : 'none';
      };
    });
    regen(); textHash();
  };

  /* ---------------- CSS & HTML Minifier ---------------- */
  function protect(src, re, store) { return src.replace(re, function (m) { store.push(m); return '\u0000' + (store.length - 1) + '\u0000'; }); }
  function restore(src, store) { return src.replace(/\u0000(\d+)\u0000/g, function (m, i) { return store[+i]; }); }
  function minifyCSS(css) {
    var st = [];
    css = protect(css, /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, st);
    css = css.replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,>~])\s*/g, '$1')
      .replace(/\s*:\s*/g, ':')
      .replace(/;}/g, '}')
      .replace(/([\s:,(])0\.(\d)/g, '$1.$2')
      .replace(/\s*!important/g, '!important')
      .trim();
    // restore needed space in selectors like "a :hover" isn't common; keep media queries valid
    css = css.replace(/@media([^{]+)\{/g, function (m, q) { return '@media' + q.replace(/\)and\(/g, ') and (').replace(/and\(/g, 'and (') + '{'; });
    return restore(css, st);
  }
  function beautifyCSS(css, ind) {
    var st = [], out = '', depth = 0, i, c;
    css = minifyCSS(css);
    css = protect(css, /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, st);
    function pad() { return new Array(depth + 1).join(ind); }
    var parenDepth = 0;
    for (i = 0; i < css.length; i++) {
      c = css[i];
      if (c === '(') parenDepth++;
      if (c === ')') parenDepth--;
      if (c === '{') { out = out.replace(/\s+$/, '') + ' {\n'; depth++; out += pad(); }
      else if (c === '}') {
        depth = Math.max(0, depth - 1);
        out = out.replace(/\s+$/, '');
        out += ('{;}'.indexOf(out.slice(-1)) >= 0 ? '' : ';') + '\n' + pad() + '}\n';
        if (depth === 0) out += '\n';
        out += pad();
      }
      else if (c === ';' && parenDepth === 0) { out += ';\n' + pad(); }
      else if (c === ':' && depth > 0 && parenDepth === 0 && (function () { var r = css.slice(i + 1), k = r.search(/[{;}]/); return k < 0 || r[k] !== '{'; })()) { out += ': '; }
      else if (c === ',' && depth === 0) { out += ',\n'; }
      else if (c === ',' && parenDepth === 0) { out += ', '; }
      else out += c;
    }
    out = out.replace(/;\s*;/g, ';').replace(/\{\s*;/g, '{').replace(/\n\s*\n\s*\n/g, '\n\n').replace(/;\n(\s*)}/g, ';\n$1}');
    out = out.replace(/\(([\w-]+):(?=\S)/g, '($1: ');
    return restore(out.trim() + '\n', st);
  }
  var VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|!doctype)$/i;
  function minifyHTML(html) {
    var st = [];
    html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, function (m, a, b) { return '<style' + a + '>' + minifyCSS(b) + '</style>'; });
    html = protect(html, /<(pre|textarea|script)\b[\s\S]*?<\/\1>/gi, st);
    html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s+>/g, '>')
      .trim();
    st = st.map(function (s) { return /^<script/i.test(s) ? s.replace(/^(<script[^>]*>)\s+/i, '$1').replace(/\s+(<\/script>)$/i, '$1') : s; });
    return restore(html, st);
  }
  function beautifyHTML(html, ind) {
    var st = [];
    html = protect(html, /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, st);
    var tokens = html.replace(/>\s+</g, '><').match(/<[^>]+>|[^<]+/g) || [];
    var out = [], depth = 0;
    function pad() { return new Array(depth + 1).join(ind); }
    tokens.forEach(function (tok) {
      var t = tok.trim();
      if (!t) return;
      if (/^<\//.test(t)) { depth = Math.max(0, depth - 1); out.push(pad() + t); }
      else if (/^</.test(t)) {
        var name = (t.match(/^<\s*([\w!-]+)/) || [])[1] || '';
        out.push(pad() + t.replace(/\s+/g, ' ').replace(/\s+(\/?>)$/, '$1'));
        if (!VOID.test(name) && !/\/>$/.test(t) && !/^<!--/.test(t) && !/^<!/.test(t)) depth++;
      } else if (/\u0000\d+\u0000/.test(t)) out.push(pad() + t);
      else out.push(pad() + t.replace(/\s+/g, ' '));
    });
    // collapse <tag>text</tag> onto one line
    var res = out.join('\n').replace(/^(\s*)(<([\w-]+)[^>]*>)\n\s*([^<\n]{0,80})\n\s*(<\/\3>)/gm, '$1$2$4$5');
    return restore(res, st) + '\n';
  }
  IMPL['css-html-minifier'] = function (root) {
    var SAMPLE_CSS = '/* Main layout styles */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: "Inter", sans-serif;\n  background-color: #ffffff;\n}\n\n/* Navigation bar */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n}\n\n.navbar a:hover {\n  color: #4f46e5;\n  text-decoration: underline;\n}\n\n@media (max-width: 768px) {\n  .navbar { flex-direction: column; }\n}';
    var SAMPLE_HTML = '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <!-- Page metadata -->\n    <meta charset="UTF-8">\n    <title>My Landing Page</title>\n    <style>\n      body { margin: 0; font-family: sans-serif; }\n    </style>\n  </head>\n  <body>\n    <header class="hero">\n      <h1>  Welcome to my site  </h1>\n      <p>\n        Fast, free and private tools.\n      </p>\n    </header>\n    <a href="/tools"  class="btn">Get Started</a>\n  </body>\n</html>';
    var lang = 'css', action = 'minify', result = '';
    root.innerHTML =
      '<div class="toolbar" style="margin-bottom:16px;gap:12px"><div class="seg" id="mnLang"><button class="active" data-l="css">CSS Stylesheet</button><button data-l="html">HTML Document</button></div>' +
      '<div class="seg" id="mnAct"><button class="active" data-a="minify">' + icon('minimize', 'icon-sm') + 'Minify (Compress)</button><button data-a="beautify">' + icon('wand', 'icon-sm') + 'Beautify (Format)</button></div>' +
      '<span class="spacer"></span><button class="btn" id="mnSample">' + icon('sparkles') + 'Sample CSS</button></div>' +
      '<div class="grid-3" id="mnStats" style="margin-bottom:18px"></div>' +
      '<div class="grid-2"><div><div class="panel-head"><span class="panel-title" id="mnInTitle">Input Source (CSS)</span><button class="btn btn-sm btn-danger" id="mnClear">' + icon('trash', 'icon-sm') + 'Clear</button></div>' +
      '<textarea class="editor" id="mnIn" spellcheck="false" style="min-height:400px"></textarea><div class="meta" id="mnInMeta" style="margin-top:6px"></div></div>' +
      '<div><div class="panel-head"><span class="panel-title" id="mnOutTitle">Minified Result</span><span class="toolbar"><button class="btn btn-sm btn-primary" id="mnCopy">' + icon('copy', 'icon-sm') + 'Copy</button><button class="btn btn-sm" id="mnDl">' + icon('download', 'icon-sm') + 'Download</button></span></div>' +
      '<pre class="code-out" id="mnOut" style="min-height:400px;max-height:400px"></pre><div class="meta" id="mnOutMeta" style="margin-top:6px"></div></div></div>';
    var input = F.$('#mnIn', root), out = F.$('#mnOut', root);
    input.value = SAMPLE_CSS;
    function lines(s) { return s ? s.split('\n').length : 0; }
    function run() {
      var v = input.value;
      try {
        result = !v.trim() ? '' : action === 'minify' ? (lang === 'css' ? minifyCSS(v) : minifyHTML(v)) : (lang === 'css' ? beautifyCSS(v, '  ') : beautifyHTML(v, '  '));
      } catch (e) { result = ''; F.toast('Could not process this code', 'error'); }
      var a = byteLen(v), b = byteLen(result), diff = a - b, pct = a ? Math.round(diff / a * 100) : 0;
      F.$('#mnStats', root).innerHTML =
        '<div class="stat"><div class="s-val">' + F.formatBytes(a) + '</div><div class="s-label">Original Size</div></div>' +
        '<div class="stat accent"><div class="s-val">' + F.formatBytes(b) + '</div><div class="s-label">' + (action === 'minify' ? 'Minified' : 'Beautified') + ' Size</div></div>' +
        '<div class="stat ' + (diff >= 0 ? 'good' : '') + '"><div class="s-val">' + (diff >= 0 ? pct + '%' : '+' + Math.abs(pct) + '%') + '</div><div class="s-label">' + (diff >= 0 ? 'Savings (' + F.formatBytes(diff) + ')' : 'Size increase (' + F.formatBytes(-diff) + ')') + '</div></div>';
      out.textContent = result;
      if (!result) out.innerHTML = '<span style="color:#64748b">Result appears here…</span>';
      F.$('#mnInMeta', root).textContent = lines(v) + ' lines · ' + a.toLocaleString() + ' bytes';
      F.$('#mnOutMeta', root).textContent = lines(result.replace(/\n$/, '')) + ' lines · ' + b.toLocaleString() + ' bytes';
    }
    function sync() {
      F.$('#mnInTitle', root).textContent = 'Input Source (' + lang.toUpperCase() + ')';
      F.$('#mnOutTitle', root).textContent = action === 'minify' ? 'Minified Result' : 'Beautified Result';
      F.$('#mnSample', root).innerHTML = icon('sparkles') + 'Sample ' + lang.toUpperCase();
      out.style.whiteSpace = action === 'minify' ? 'pre-wrap' : 'pre';
      run();
    }
    F.$$('#mnLang button', root).forEach(function (b) {
      b.onclick = function () {
        if (lang === b.getAttribute('data-l')) return;
        lang = b.getAttribute('data-l');
        F.$$('#mnLang button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        if (input.value === SAMPLE_CSS || input.value === SAMPLE_HTML || !input.value.trim()) input.value = lang === 'css' ? SAMPLE_CSS : SAMPLE_HTML;
        sync();
      };
    });
    F.$$('#mnAct button', root).forEach(function (b) {
      b.onclick = function () { action = b.getAttribute('data-a'); F.$$('#mnAct button', root).forEach(function (x) { x.classList.toggle('active', x === b); }); sync(); };
    });
    input.addEventListener('input', debounce(run, 150));
    F.$('#mnSample', root).onclick = function () { input.value = lang === 'css' ? SAMPLE_CSS : SAMPLE_HTML; run(); };
    F.$('#mnClear', root).onclick = function () { input.value = ''; run(); input.focus(); };
    F.$('#mnCopy', root).onclick = function () { F.copyText(result, 'Result copied'); };
    F.$('#mnDl', root).onclick = function () {
      if (!result) return F.toast('Nothing to download yet', 'error');
      var name = (action === 'minify' ? 'style.min.' : 'style.') + lang;
      if (lang === 'html') name = action === 'minify' ? 'index.min.html' : 'index.html';
      F.download(new Blob([result], { type: lang === 'css' ? 'text/css' : 'text/html' }), name);
    };
    sync();
  };

  /* ---------------- Random Number Generator (RNG) ---------------- */
  function secureRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min > max) { var t = min; min = max; max = t; }
    var range = max - min + 1;
    if (range <= 0) return min;
    if (window.crypto && window.crypto.getRandomValues && range <= 0xFFFFFFFF) {
      var maxUnbiased = Math.floor(0x100000000 / range) * range;
      var buf = new Uint32Array(1);
      do {
        window.crypto.getRandomValues(buf);
      } while (buf[0] >= maxUnbiased);
      return min + (buf[0] % range);
    }
    return Math.floor(Math.random() * range) + min;
  }

  IMPL['random-number-generator'] = IMPL['rng'] = function (root) {
    root.innerHTML =
      '<div class="seg" id="rngTabs" style="margin-bottom:18px">' +
        '<button class="active" data-m="numbers">' + icon('hash', 'icon-sm') + 'Random Numbers</button>' +
        '<button data-m="dice">' + icon('dice', 'icon-sm') + 'Dice Roller</button>' +
        '<button data-m="coin">' + icon('refresh', 'icon-sm') + 'Coin Flip</button>' +
        '<button data-m="list">' + icon('sparkles', 'icon-sm') + 'List / Raffle Picker</button>' +
      '</div>' +

      /* Numbers Panel */
      '<div id="rngPanelNumbers">' +
        '<div class="panel-row" style="gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:flex-end">' +
          '<div style="flex:1;min-width:110px"><label class="field-label" style="display:block;font-size:12px;font-weight:700;margin-bottom:4px">Min</label><input type="number" id="rngMin" class="editor" style="min-height:auto;padding:8px 12px" value="1"></div>' +
          '<div style="flex:1;min-width:110px"><label class="field-label" style="display:block;font-size:12px;font-weight:700;margin-bottom:4px">Max</label><input type="number" id="rngMax" class="editor" style="min-height:auto;padding:8px 12px" value="100"></div>' +
          '<div style="flex:1;min-width:110px"><label class="field-label" style="display:block;font-size:12px;font-weight:700;margin-bottom:4px">Quantity</label><input type="number" id="rngCount" class="editor" style="min-height:auto;padding:8px 12px" value="1" min="1" max="1000"></div>' +
          '<div style="align-self:flex-end;margin-bottom:4px"><button class="btn btn-primary" id="rngGen">' + icon('dice') + 'Generate</button></div>' +
        '</div>' +
        '<div class="toolbar" style="gap:14px;margin-bottom:16px;flex-wrap:wrap">' +
          '<label class="switch"><input type="checkbox" id="rngUnique"><span class="track"></span>Unique Only (No Duplicates)</label>' +
          '<label class="switch"><input type="checkbox" id="rngSort"><span class="track"></span>Sort Ascending</label>' +
          '<span class="spacer"></span>' +
          '<span class="label" style="font-size:12px">Presets:</span>' +
          '<div class="seg" id="rngPresets">' +
            '<button data-min="1" data-max="6">1-6</button>' +
            '<button data-min="1" data-max="10">1-10</button>' +
            '<button data-min="1" data-max="100">1-100</button>' +
            '<button data-min="1000" data-max="9999">PIN 4</button>' +
          '</div>' +
        '</div>' +
        '<div id="rngNumOutput" class="rng-hero"><div class="rng-hero-num" id="rngBigNum">-</div><div class="meta" id="rngNumMeta" style="margin-top:6px">Click Generate to roll</div></div>' +
        '<div id="rngMultiWrap" style="display:none;margin-top:14px">' +
          '<div class="panel-head"><span class="panel-title" id="rngMultiTitle">Generated Numbers</span>' +
          '<span class="toolbar"><button class="btn btn-sm" id="rngCopyAll">' + icon('copy', 'icon-sm') + 'Copy All</button><button class="btn btn-sm" id="rngDlTxt">' + icon('download', 'icon-sm') + 'Download .txt</button></span></div>' +
          '<div class="rng-grid" id="rngMultiGrid"></div>' +
        '</div>' +
      '</div>' +

      /* Dice Panel */
      '<div id="rngPanelDice" style="display:none">' +
        '<div class="toolbar" style="gap:10px;margin-bottom:16px;flex-wrap:wrap">' +
          '<span class="label" style="font-size:13px;font-weight:700">Quick Dice:</span>' +
          '<div class="seg" id="rngDiceTypes">' +
            '<button data-d="4">d4</button><button data-d="6" class="active">d6</button><button data-d="8">d8</button><button data-d="10">d10</button><button data-d="12">d12</button><button data-d="20">d20</button><button data-d="100">d100</button>' +
          '</div>' +
          '<span class="label" style="font-size:13px;font-weight:700;margin-left:10px">Dice Count:</span>' +
          '<div class="seg" id="rngDiceCount">' +
            '<button data-c="1" class="active">1</button><button data-c="2">2</button><button data-c="3">3</button><button data-c="4">4</button><button data-c="6">6</button>' +
          '</div>' +
          '<span class="spacer"></span>' +
          '<button class="btn btn-primary" id="rngRollDice">' + icon('dice') + 'Roll Dice</button>' +
        '</div>' +
        '<div class="rng-hero">' +
          '<div class="rng-dice-row" id="rngDiceDisplay"></div>' +
          '<div style="font-size:22px;font-weight:800;color:var(--text);margin-top:10px">Total: <span id="rngDiceTotal" style="color:var(--primary)">-</span></div>' +
        '</div>' +
      '</div>' +

      /* Coin Panel */
      '<div id="rngPanelCoin" style="display:none">' +
        '<div class="toolbar" style="gap:10px;margin-bottom:16px">' +
          '<button class="btn btn-primary btn-lg" id="rngFlipCoin" style="min-width:160px">' + icon('refresh') + 'Flip Coin</button>' +
          '<button class="btn" id="rngFlip10">Flip 10x</button>' +
          '<button class="btn" id="rngFlip100">Flip 100x</button>' +
          '<button class="btn btn-danger" id="rngCoinReset">' + icon('trash') + 'Reset Stats</button>' +
        '</div>' +
        '<div class="rng-hero">' +
          '<div class="rng-hero-num" id="rngCoinResult" style="font-size:42px">🪙 Ready</div>' +
          '<div class="meta" id="rngCoinStats" style="margin-top:12px;font-size:14px;font-weight:600">Heads: 0 (0%) · Tails: 0 (0%) · Total: 0</div>' +
        '</div>' +
      '</div>' +

      /* List / Raffle Panel */
      '<div id="rngPanelList" style="display:none">' +
        '<div class="panel-head"><span class="panel-title">Enter List of Items or Names (one per line)</span><span class="toolbar"><button class="btn btn-sm" id="rngListSample">' + icon('sparkles', 'icon-sm') + 'Load Sample</button><button class="btn btn-sm btn-danger" id="rngListClear">' + icon('trash', 'icon-sm') + 'Clear</button></span></div>' +
        '<textarea class="editor" id="rngListInput" style="min-height:160px" placeholder="Alice\nBob\nCharlie\nDiana\nEvan"></textarea>' +
        '<div class="toolbar" style="gap:12px;margin:14px 0;flex-wrap:wrap">' +
          '<label class="field-label" style="font-size:13px;font-weight:700">Winners to Pick:</label>' +
          '<input type="number" id="rngPickCount" class="editor" style="min-height:auto;width:80px;padding:6px 10px" value="1" min="1">' +
          '<button class="btn btn-primary" id="rngPickWinner">' + icon('sparkles') + 'Pick Winner(s)</button>' +
          '<button class="btn" id="rngShuffleList">' + icon('refresh') + 'Shuffle All</button>' +
        '</div>' +
        '<div class="rng-hero" id="rngListHero" style="display:none">' +
          '<div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--primary);margin-bottom:8px">🎉 Selected Winner(s)</div>' +
          '<div class="rng-hero-num" id="rngWinnerDisplay" style="font-size:32px"></div>' +
        '</div>' +
      '</div>';

    /* Tab Switching */
    F.$$('#rngTabs button', root).forEach(function (b) {
      b.onclick = function () {
        var m = b.getAttribute('data-m');
        F.$$('#rngTabs button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        F.$('#rngPanelNumbers', root).style.display = m === 'numbers' ? '' : 'none';
        F.$('#rngPanelDice', root).style.display = m === 'dice' ? '' : 'none';
        F.$('#rngPanelCoin', root).style.display = m === 'coin' ? '' : 'none';
        F.$('#rngPanelList', root).style.display = m === 'list' ? '' : 'none';
      };
    });

    /* --- Numbers Mode --- */
    var lastNumbers = [];
    function generateNumbers() {
      var min = parseInt(F.$('#rngMin', root).value, 10) || 1;
      var max = parseInt(F.$('#rngMax', root).value, 10) || 100;
      var count = Math.min(1000, Math.max(1, parseInt(F.$('#rngCount', root).value, 10) || 1));
      var unique = F.$('#rngUnique', root).checked;
      var sort = F.$('#rngSort', root).checked;

      if (min > max) { var tmp = min; min = max; max = tmp; F.$('#rngMin', root).value = min; F.$('#rngMax', root).value = max; }
      var range = max - min + 1;
      if (unique && count > range) {
        F.toast('Cannot pick ' + count + ' unique numbers from range of ' + range, 'error');
        return;
      }

      var nums = [];
      if (unique) {
        var seen = {};
        while (nums.length < count) {
          var val = secureRandomInt(min, max);
          if (!seen[val]) { seen[val] = true; nums.push(val); }
        }
      } else {
        for (var i = 0; i < count; i++) {
          nums.push(secureRandomInt(min, max));
        }
      }

      if (sort) nums.sort(function (a, b) { return a - b; });
      lastNumbers = nums;

      if (count === 1) {
        F.$('#rngBigNum', root).textContent = nums[0].toLocaleString();
        F.$('#rngNumMeta', root).textContent = 'Range: ' + min + ' to ' + max + ' · Web Crypto CSPRNG';
        F.$('#rngMultiWrap', root).style.display = 'none';
      } else {
        F.$('#rngBigNum', root).textContent = count.toLocaleString() + ' Numbers';
        F.$('#rngNumMeta', root).textContent = 'Range: ' + min + ' to ' + max + (unique ? ' · Unique only' : '') + (sort ? ' · Sorted' : '');
        F.$('#rngMultiTitle', root).textContent = count + ' Generated Numbers';
        F.$('#rngMultiGrid', root).innerHTML = nums.map(function (n) { return '<span class="rng-chip">' + n.toLocaleString() + '</span>'; }).join('');
        F.$('#rngMultiWrap', root).style.display = '';
      }
      F.toast('Generated ' + count + ' random number' + (count > 1 ? 's' : ''));
    }

    F.$('#rngGen', root).onclick = generateNumbers;
    F.$('#rngPresets', root).addEventListener('click', function (e) {
      var b = e.target.closest('button[data-min]');
      if (!b) return;
      F.$('#rngMin', root).value = b.getAttribute('data-min');
      F.$('#rngMax', root).value = b.getAttribute('data-max');
      F.$('#rngCount', root).value = 1;
      generateNumbers();
    });
    F.$('#rngCopyAll', root).onclick = function () {
      if (!lastNumbers.length) return;
      F.copyText(lastNumbers.join(', '), 'Numbers copied');
    };
    F.$('#rngDlTxt', root).onclick = function () {
      if (!lastNumbers.length) return;
      F.download(new Blob([lastNumbers.join('\n') + '\n'], { type: 'text/plain' }), 'random_numbers.txt');
    };

    /* --- Dice Mode --- */
    var diceType = 6, diceCount = 1;
    function rollDice() {
      var rolls = [], sum = 0;
      for (var i = 0; i < diceCount; i++) {
        var r = secureRandomInt(1, diceType);
        rolls.push(r);
        sum += r;
      }
      F.$('#rngDiceDisplay', root).innerHTML = rolls.map(function (r) {
        return '<div class="rng-die">' + r + '</div>';
      }).join('');
      F.$('#rngDiceTotal', root).textContent = sum + (diceCount > 1 ? ' (' + rolls.join(' + ') + ')' : '');
      F.toast('Rolled ' + diceCount + 'd' + diceType);
    }
    F.$$('#rngDiceTypes button', root).forEach(function (b) {
      b.onclick = function () {
        diceType = +b.getAttribute('data-d');
        F.$$('#rngDiceTypes button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        rollDice();
      };
    });
    F.$$('#rngDiceCount button', root).forEach(function (b) {
      b.onclick = function () {
        diceCount = +b.getAttribute('data-c');
        F.$$('#rngDiceCount button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
        rollDice();
      };
    });
    F.$('#rngRollDice', root).onclick = rollDice;

    /* --- Coin Mode --- */
    var coinHeads = 0, coinTails = 0;
    function updateCoinStats() {
      var tot = coinHeads + coinTails;
      var hPct = tot ? Math.round((coinHeads / tot) * 100) : 0;
      var tPct = tot ? Math.round((coinTails / tot) * 100) : 0;
      F.$('#rngCoinStats', root).textContent = 'Heads: ' + coinHeads + ' (' + hPct + '%) · Tails: ' + coinTails + ' (' + tPct + '%) · Total: ' + tot;
    }
    function flipCoins(times) {
      var last = '';
      for (var i = 0; i < times; i++) {
        var flip = secureRandomInt(0, 1) === 1 ? 'Heads' : 'Tails';
        if (flip === 'Heads') coinHeads++; else coinTails++;
        last = flip;
      }
      F.$('#rngCoinResult', root).textContent = (last === 'Heads' ? '🪙 HEADS' : '🪙 TAILS');
      updateCoinStats();
      F.toast(times === 1 ? last + '!' : 'Flipped ' + times + ' times');
    }
    F.$('#rngFlipCoin', root).onclick = function () { flipCoins(1); };
    F.$('#rngFlip10', root).onclick = function () { flipCoins(10); };
    F.$('#rngFlip100', root).onclick = function () { flipCoins(100); };
    F.$('#rngCoinReset', root).onclick = function () {
      coinHeads = 0; coinTails = 0;
      F.$('#rngCoinResult', root).textContent = '🪙 Ready';
      updateCoinStats();
      F.toast('Stats reset');
    };

    /* --- List / Raffle Mode --- */
    var SAMPLE_LIST = 'Sarah Jenkins\nDavid Miller\nAlya Putri\nKenji Sato\nAlex Rivera\nFatima Al-Hassan\nMichael Chang';
    F.$('#rngListSample', root).onclick = function () { F.$('#rngListInput', root).value = SAMPLE_LIST; };
    F.$('#rngListClear', root).onclick = function () { F.$('#rngListInput', root).value = ''; F.$('#rngListHero', root).style.display = 'none'; };
    F.$('#rngPickWinner', root).onclick = function () {
      var lines = F.$('#rngListInput', root).value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      if (!lines.length) return F.toast('Please enter at least 1 item in the list', 'error');
      var k = Math.min(lines.length, Math.max(1, parseInt(F.$('#rngPickCount', root).value, 10) || 1));
      var winners = [];
      var copy = lines.slice();
      for (var i = 0; i < k; i++) {
        var idx = secureRandomInt(0, copy.length - 1);
        winners.push(copy.splice(idx, 1)[0]);
      }
      F.$('#rngWinnerDisplay', root).innerHTML = winners.map(function (w, i) {
        return '<div style="font-size:' + (k > 3 ? '20px' : '28px') + ';font-weight:800;color:var(--text)">' + (k > 1 ? '#' + (i + 1) + ' ' : '') + esc(w) + '</div>';
      }).join('');
      F.$('#rngListHero', root).style.display = '';
      F.toast('Selected ' + k + ' winner' + (k > 1 ? 's' : '') + '!');
    };
    F.$('#rngShuffleList', root).onclick = function () {
      var lines = F.$('#rngListInput', root).value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      if (lines.length < 2) return F.toast('Need at least 2 items to shuffle', 'error');
      for (var i = lines.length - 1; i > 0; i--) {
        var j = secureRandomInt(0, i);
        var t = lines[i]; lines[i] = lines[j]; lines[j] = t;
      }
      F.$('#rngListInput', root).value = lines.join('\n');
      F.toast('List shuffled!');
    };

    // Initial roll
    generateNumbers();
    rollDice();
  };

  window.FT._text = { minifyCSS: minifyCSS, beautifyCSS: beautifyCSS, minifyHTML: minifyHTML, beautifyHTML: beautifyHTML, parseCSV: parseCSV, CASES: CASES };
})();

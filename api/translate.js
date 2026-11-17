module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    let q = '';
    let from = 'auto';
    let to = 'id';

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      q = (body && (body.text || body.q)) || '';
      from = (body && body.from) || 'auto';
      to = (body && body.to) || 'id';
    } else {
      const url = new URL(req.url, 'http://localhost');
      q = url.searchParams.get('text') || url.searchParams.get('q') || '';
      from = url.searchParams.get('from') || 'auto';
      to = url.searchParams.get('to') || 'id';
    }

    if (!q || !q.trim()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.end(JSON.stringify({ success: true, translation: '' }));
    }

    const apiUrl = 'https://translate.google.com/translate_a/single?client=at&dt=t&dj=1&hl=id&ie=UTF-8&oe=UTF-8&sl=' +
      encodeURIComponent(from) + '&tl=' + encodeURIComponent(to) + '&q=' + encodeURIComponent(q);

    const apiRes = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1'
      }
    });

    if (!apiRes.ok) {
      throw new Error('Google Translate HTTP ' + apiRes.status);
    }

    const data = await apiRes.json();
    let translation = q;
    if (data && data.sentences && data.sentences.length) {
      translation = data.sentences.map(s => s.trans || '').join('');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: true, translation: translation, from: from, to: to }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

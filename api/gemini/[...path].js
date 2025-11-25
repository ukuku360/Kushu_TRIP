export default async function handler(req, res) {
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key configuration missing' });
  }

  try {
    // req.query contains the path segments because of the file name [...path].js
    // But req.url is the full URL.
    // We want to extract the part after /api/gemini/
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.replace(/^\/api\/gemini/, '');
    
    const targetUrl = new URL(`https://generativelanguage.googleapis.com/v1beta${path}`);
    
    // Copy query params
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
}

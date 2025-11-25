export default async function handler(req, res) {
  const apiKey = process.env.VITE_BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Brave Search API Key configuration missing' });
  }

  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    
    // Construct target URL
    // Default to 'web' search if not specified in path (since this handler is for /api/search)
    const targetUrl = new URL('https://api.search.brave.com/res/v1/web/search');
    
    // Copy all query parameters
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'X-Subscription-Token': apiKey,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    // Set cache control
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Brave Search Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Brave Search API' });
  }
}

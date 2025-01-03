import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Just return basic URL info without trying to fetch metadata
    const urlObj = new URL(url);
    const metadata = {
      title: urlObj.hostname,
      description: url,
      url: url,
      favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`
    };

    res.json(metadata);
  } catch (error) {
    console.error('Link preview error:', error);
    res.json({
      title: url,
      url: url
    });
  }
} 
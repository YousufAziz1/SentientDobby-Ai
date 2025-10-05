const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const base = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const safeMode = String(process.env.OPENROUTER_SAFE_MODE || '').toLowerCase() === 'true';

  // Safe fallback list for free keys or no key
  const safeList = [
    { id: 'openai/gpt-4o-mini', label: 'OpenAI GPT-4o Mini' }
  ];

  if (!apiKey || safeMode) {
    return res.json(safeList);
  }

  try {
    const resp = await axios.get(`${base}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.CLIENT_ORIGIN || 'http://localhost:3001',
        'X-Title': process.env.OPENROUTER_TITLE || 'SentientAGIDobby'
      },
      timeout: 20000
    });
    const items = Array.isArray(resp.data?.data) ? resp.data.data : [];
    const list = items.map(m => ({ id: m.id, label: m.name || m.id })).filter(x => !!x.id);
    // If API returns empty for some reason, use safe fallback
    if (!list.length) return res.json(safeList);
    return res.json(list);
  } catch (e) {
    // On error, fall back to safe list so UI still works
    return res.json(safeList);
  }
});

module.exports = router;

const axios = require('axios');

async function chatCompletion(model, messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const base = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const demo = String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || !apiKey;
  if (demo) {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const echoed = lastUser?.content?.slice(0, 600) || '';
    const hint = 'This is a demo reply (no API key required).';
    return `${hint}\n\nYou said: ${echoed}`.trim();
  }

  const safeModel = model || process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-4o-mini';
  const payload = { model: safeModel, messages, stream: false };
  try {
    const resp = await axios.post(`${base}/chat/completions`, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.CLIENT_ORIGIN || 'http://localhost:3001',
        'X-Title': process.env.OPENROUTER_TITLE || 'SentientAGIDobby'
      },
      timeout: 60000
    });
    return resp.data?.choices?.[0]?.message?.content || '';
  } catch (e) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    const msg = typeof data === 'string' ? data : JSON.stringify(data || {});
    // Provide a meaningful message back to client for debugging
    return `OpenRouter error (status ${status || 'unknown'}). Details: ${msg}`;
  }
}

module.exports = { chatCompletion };

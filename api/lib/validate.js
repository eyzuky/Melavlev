// Shared helpers for validating admin API requests.

export function requireJson(req, res) {
  const method = req.method;
  if (method === 'GET' || method === 'DELETE' || method === 'HEAD') return true;
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (!ct.includes('application/json')) {
    res.status(415).json({ error: 'Content-Type must be application/json' });
    return false;
  }
  return true;
}

export function clampStr(v, max) {
  if (v == null) return '';
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

export function clampInt(v, { min = -2147483648, max = 2147483647, fallback = 0 } = {}) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

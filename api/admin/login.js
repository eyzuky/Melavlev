import { checkPassword, signToken, sessionCookieHeader } from '../../lib/auth.js';
import { checkLoginRateLimit, recordLoginAttempt, getClientIp } from '../../lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  const ip = getClientIp(req);

  try {
    const limit = await checkLoginRateLimit(ip);
    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds));
      return res.status(429).json({
        error: 'יותר מדי ניסיונות. נסו שוב מאוחר יותר.',
        retryAfter: limit.retryAfterSeconds,
      });
    }

    const { password } = req.body || {};
    if (typeof password !== 'string' || password.length === 0 || password.length > 200) {
      await recordLoginAttempt(ip, false);
      return res.status(401).json({ error: 'סיסמה שגויה' });
    }

    if (!checkPassword(password)) {
      await recordLoginAttempt(ip, false);
      return res.status(401).json({ error: 'סיסמה שגויה' });
    }

    await recordLoginAttempt(ip, true);
    const token = signToken();
    res.setHeader('Set-Cookie', sessionCookieHeader(token));
    return res.json({ ok: true });
  } catch (err) {
    // Don't leak internal errors to the client.
    console.error('login error:', err.message);
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
}

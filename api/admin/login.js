import { checkPassword, signToken, sessionCookieHeader } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const { password } = req.body;
    if (!password || !checkPassword(password)) {
      return res.status(401).json({ error: 'סיסמה שגויה' });
    }

    const token = signToken();
    res.setHeader('Set-Cookie', sessionCookieHeader(token));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

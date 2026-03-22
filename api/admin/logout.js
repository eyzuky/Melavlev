import { clearSessionCookieHeader } from '../lib/auth.js';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', clearSessionCookieHeader());
  return res.json({ ok: true });
}

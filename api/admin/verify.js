import { getSession } from '../../lib/auth.js';

export default function handler(req, res) {
  const session = getSession(req);
  return res.json({ valid: session.valid });
}

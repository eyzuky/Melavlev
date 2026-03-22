import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');

  const sql = getDb();

  if (req.method === 'GET') {
    const tab = req.query.tab || 'site';
    const rows = await sql`
      SELECT key, value_he, value_en FROM content WHERE tab = ${tab} ORDER BY id ASC
    `;
    return res.json({ entries: rows });
  }

  if (req.method === 'PUT') {
    const { tab, entries } = req.body;
    if (!tab || !entries) return res.status(400).json({ error: 'tab and entries required' });

    for (const { key, value_he, value_en } of entries) {
      await sql`
        INSERT INTO content (tab, key, value_he, value_en)
        VALUES (${tab}, ${key}, ${value_he || ''}, ${value_en || ''})
        ON CONFLICT (tab, key) DO UPDATE SET
          value_he = EXCLUDED.value_he,
          value_en = EXCLUDED.value_en,
          updated_at = NOW()
      `;
    }
    return res.json({ ok: true });
  }

  return res.status(405).send('Method not allowed');
}

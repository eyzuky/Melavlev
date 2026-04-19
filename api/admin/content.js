import getDb from '../../lib/db.js';
import { getSession } from '../../lib/auth.js';
import { requireJson, clampStr } from '../../lib/validate.js';

const TAB_PATTERN = /^[a-z0-9_]{1,50}$/i;
const KEY_PATTERN = /^[a-z0-9_]{1,200}$/i;
const MAX_VALUE_LEN = 5000;
const MAX_ENTRIES_PER_REQUEST = 500;

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');
  if (!requireJson(req, res)) return;

  const sql = getDb();

  if (req.method === 'GET') {
    const tab = String(req.query.tab || 'site');
    if (!TAB_PATTERN.test(tab)) return res.status(400).json({ error: 'invalid tab' });
    const rows = await sql`
      SELECT key, value_he, value_en FROM content WHERE tab = ${tab} ORDER BY id ASC
    `;
    return res.json({ entries: rows });
  }

  if (req.method === 'PUT') {
    const { tab, entries } = req.body || {};
    if (!tab || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'tab and entries required' });
    }
    if (!TAB_PATTERN.test(tab)) {
      return res.status(400).json({ error: 'invalid tab' });
    }
    if (entries.length > MAX_ENTRIES_PER_REQUEST) {
      return res.status(413).json({ error: 'too many entries in single request' });
    }

    for (const entry of entries) {
      const key = String(entry?.key || '');
      if (!KEY_PATTERN.test(key)) {
        return res.status(400).json({ error: `invalid key: ${key.slice(0, 50)}` });
      }
      const valueHe = clampStr(entry.value_he, MAX_VALUE_LEN);
      const valueEn = clampStr(entry.value_en, MAX_VALUE_LEN);
      await sql`
        INSERT INTO content (tab, key, value_he, value_en)
        VALUES (${tab}, ${key}, ${valueHe}, ${valueEn})
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

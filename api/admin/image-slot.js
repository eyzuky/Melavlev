import getDb from '../../lib/db.js';
import { getSession } from '../../lib/auth.js';
import { del } from '@vercel/blob';
import { requireJson, clampStr } from '../../lib/validate.js';

const ALLOWED_CATEGORIES = new Set(['general', 'project', 'hero', 'pillar', 'gallery', 'solution']);
const KEY_PATTERN = /^[a-z0-9_]{1,200}$/i;
const MAX_KEY_LEN = 200;
const MAX_ALT_LEN = 500;

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');
  if (!requireJson(req, res)) return;

  if (req.method !== 'PUT') return res.status(405).send('Method not allowed');

  const sql = getDb();
  const body = req.body || {};

  const rawKey = body.image_key && String(body.image_key).trim();
  if (!rawKey || !KEY_PATTERN.test(rawKey)) {
    return res.status(400).json({ error: 'image_key required (a-z, 0-9, _)' });
  }
  const image_key = clampStr(rawKey, MAX_KEY_LEN);
  const url = body.url ? clampStr(body.url, 2000) : null;
  const alt_he = clampStr(body.alt_he, MAX_ALT_LEN);
  const alt_en = clampStr(body.alt_en, MAX_ALT_LEN);
  const category = ALLOWED_CATEGORIES.has(body.category) ? body.category : 'general';

  const existing = await sql`
    SELECT id, url FROM images WHERE image_key = ${image_key} LIMIT 1
  `;

  if (existing.length > 0) {
    const row = existing[0];
    if (url && url !== row.url) {
      try { await del(row.url); } catch {}
      await sql`
        UPDATE images
        SET url = ${url}, alt_he = ${alt_he}, alt_en = ${alt_en}, category = ${category}
        WHERE id = ${row.id}
      `;
    } else {
      await sql`
        UPDATE images
        SET alt_he = ${alt_he}, alt_en = ${alt_en}, category = ${category}
        WHERE id = ${row.id}
      `;
    }
    return res.json({ ok: true, id: row.id });
  }

  if (!url) return res.status(400).json({ error: 'url required for new slot' });
  const rows = await sql`
    INSERT INTO images (url, image_key, alt_he, alt_en, category, sort_order)
    VALUES (${url}, ${image_key}, ${alt_he}, ${alt_en}, ${category}, 0)
    RETURNING id
  `;
  return res.json({ ok: true, id: rows[0].id });
}

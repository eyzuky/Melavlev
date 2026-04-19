import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';
import { del } from '@vercel/blob';
import { requireJson, clampStr, clampInt } from '../lib/validate.js';

const ALLOWED_CATEGORIES = new Set(['general', 'project', 'hero', 'pillar', 'gallery', 'solution']);
const CATEGORY_PATTERN = /^[a-z0-9_-]{1,30}$/i;
const MAX_KEY_LEN = 200;
const MAX_ALT_LEN = 500;

function validateCategory(v) {
  if (!v) return 'general';
  const s = String(v);
  if (!CATEGORY_PATTERN.test(s)) return null;
  if (!ALLOWED_CATEGORIES.has(s)) return null;
  return s;
}

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');
  if (!requireJson(req, res)) return;

  const sql = getDb();

  if (req.method === 'GET') {
    const category = req.query.category ? validateCategory(req.query.category) : null;
    if (req.query.category && !category) return res.status(400).json({ error: 'invalid category' });
    let rows;
    if (category) {
      rows = await sql`SELECT * FROM images WHERE category = ${category} ORDER BY sort_order ASC`;
    } else {
      rows = await sql`SELECT * FROM images ORDER BY sort_order ASC`;
    }
    return res.json({ images: rows });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const category = validateCategory(body.category) || 'general';
    if (!body.url || typeof body.url !== 'string') {
      return res.status(400).json({ error: 'url required' });
    }
    const rows = await sql`
      INSERT INTO images (url, image_key, alt_he, alt_en, category, project_id, sort_order)
      VALUES (
        ${clampStr(body.url, 2000)},
        ${body.image_key ? clampStr(body.image_key, MAX_KEY_LEN) : null},
        ${clampStr(body.alt_he, MAX_ALT_LEN)},
        ${clampStr(body.alt_en, MAX_ALT_LEN)},
        ${category},
        ${body.project_id ? clampInt(body.project_id) : null},
        ${clampInt(body.sort_order, { min: 0, max: 10000 })}
      )
      RETURNING *
    `;
    return res.json({ image: rows[0] });
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    if (!body.id) return res.status(400).send('id required');
    const category = validateCategory(body.category) || 'general';
    await sql`
      UPDATE images SET
        image_key = ${body.image_key ? clampStr(body.image_key, MAX_KEY_LEN) : null},
        alt_he = ${clampStr(body.alt_he, MAX_ALT_LEN)},
        alt_en = ${clampStr(body.alt_en, MAX_ALT_LEN)},
        category = ${category},
        project_id = ${body.project_id ? clampInt(body.project_id) : null},
        sort_order = ${clampInt(body.sort_order, { min: 0, max: 10000 })}
      WHERE id = ${clampInt(body.id)}
    `;
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const id = clampInt(req.query.id);
    if (!id) return res.status(400).send('id required');
    const rows = await sql`SELECT url FROM images WHERE id = ${id}`;
    if (rows[0]?.url) {
      try { await del(rows[0].url); } catch {}
    }
    await sql`DELETE FROM images WHERE id = ${id}`;
    return res.json({ ok: true });
  }

  return res.status(405).send('Method not allowed');
}

import getDb from '../../lib/db.js';
import { getSession } from '../../lib/auth.js';
import { requireJson, clampStr, clampInt } from '../../lib/validate.js';

const MAX_TEXT = 2000;
const MAX_DESCRIPTION = 10000;

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');
  if (!requireJson(req, res)) return;

  const sql = getDb();

  if (req.method === 'GET') {
    const projects = await sql`SELECT * FROM projects ORDER BY sort_order ASC`;
    const images = await sql`SELECT * FROM images WHERE project_id IS NOT NULL ORDER BY sort_order ASC`;
    const result = projects.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? safeJsonParse(p.tags) : p.tags,
      images: images.filter(img => img.project_id === p.id),
    }));
    return res.json({ projects: result });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const tags = validateTags(body.tags);
    if (tags == null) return res.status(400).json({ error: 'invalid tags (must be JSON array)' });
    const rows = await sql`
      INSERT INTO projects (title_he, title_en, description_he, description_en, results_he, results_en, tags, sort_order, is_featured, video_url)
      VALUES (
        ${clampStr(body.title_he, MAX_TEXT)},
        ${clampStr(body.title_en, MAX_TEXT)},
        ${clampStr(body.description_he, MAX_DESCRIPTION)},
        ${clampStr(body.description_en, MAX_DESCRIPTION)},
        ${clampStr(body.results_he, MAX_DESCRIPTION)},
        ${clampStr(body.results_en, MAX_DESCRIPTION)},
        ${tags},
        ${clampInt(body.sort_order, { min: 0, max: 10000 })},
        ${!!body.is_featured},
        ${validateVideoUrl(body.video_url)}
      )
      RETURNING *
    `;
    return res.json({ project: rows[0] });
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    if (!body.id) return res.status(400).send('id required');
    const tags = validateTags(body.tags);
    if (tags == null) return res.status(400).json({ error: 'invalid tags (must be JSON array)' });
    await sql`
      UPDATE projects SET
        title_he = ${clampStr(body.title_he, MAX_TEXT)},
        title_en = ${clampStr(body.title_en, MAX_TEXT)},
        description_he = ${clampStr(body.description_he, MAX_DESCRIPTION)},
        description_en = ${clampStr(body.description_en, MAX_DESCRIPTION)},
        results_he = ${clampStr(body.results_he, MAX_DESCRIPTION)},
        results_en = ${clampStr(body.results_en, MAX_DESCRIPTION)},
        tags = ${tags},
        sort_order = ${clampInt(body.sort_order, { min: 0, max: 10000 })},
        is_featured = ${!!body.is_featured},
        video_url = ${validateVideoUrl(body.video_url)},
        updated_at = NOW()
      WHERE id = ${clampInt(body.id)}
    `;
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const id = clampInt(req.query.id);
    if (!id) return res.status(400).send('id required');
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return res.json({ ok: true });
  }

  return res.status(405).send('Method not allowed');
}

function safeJsonParse(s) {
  try { return JSON.parse(s); } catch { return []; }
}

function validateTags(raw) {
  if (raw == null || raw === '') return '[]';
  const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
  if (str.length > 4000) return null;
  try {
    const arr = JSON.parse(str);
    if (!Array.isArray(arr)) return null;
    if (arr.length > 50) return null;
    return JSON.stringify(arr);
  } catch {
    return null;
  }
}

function validateVideoUrl(url) {
  if (!url) return null;
  const s = clampStr(url, 500);
  try {
    const u = new URL(s);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return s;
  } catch {
    return null;
  }
}

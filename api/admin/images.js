import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';
import { del } from '@vercel/blob';

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');

  const sql = getDb();

  if (req.method === 'GET') {
    const category = req.query.category;
    let rows;
    if (category) {
      rows = await sql`SELECT * FROM images WHERE category = ${category} ORDER BY sort_order ASC`;
    } else {
      rows = await sql`SELECT * FROM images ORDER BY sort_order ASC`;
    }
    return res.json({ images: rows });
  }

  if (req.method === 'POST') {
    const body = req.body;
    const rows = await sql`
      INSERT INTO images (url, image_key, alt_he, alt_en, category, project_id, sort_order)
      VALUES (${body.url}, ${body.image_key || null}, ${body.alt_he || ''}, ${body.alt_en || ''}, ${body.category || 'general'}, ${body.project_id || null}, ${body.sort_order || 0})
      RETURNING *
    `;
    return res.json({ image: rows[0] });
  }

  if (req.method === 'PUT') {
    const body = req.body;
    if (!body.id) return res.status(400).send('id required');
    await sql`
      UPDATE images SET
        image_key = ${body.image_key || null},
        alt_he = ${body.alt_he || ''},
        alt_en = ${body.alt_en || ''},
        category = ${body.category || 'general'},
        project_id = ${body.project_id || null},
        sort_order = ${body.sort_order || 0}
      WHERE id = ${body.id}
    `;
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).send('id required');
    const rows = await sql`SELECT url FROM images WHERE id = ${parseInt(id)}`;
    if (rows[0]?.url) {
      try { await del(rows[0].url); } catch {}
    }
    await sql`DELETE FROM images WHERE id = ${parseInt(id)}`;
    return res.json({ ok: true });
  }

  return res.status(405).send('Method not allowed');
}

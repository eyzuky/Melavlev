import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');

  const sql = getDb();

  if (req.method === 'GET') {
    const projects = await sql`SELECT * FROM projects ORDER BY sort_order ASC`;
    const images = await sql`SELECT * FROM images WHERE project_id IS NOT NULL ORDER BY sort_order ASC`;
    const result = projects.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      images: images.filter(img => img.project_id === p.id),
    }));
    return res.json({ projects: result });
  }

  if (req.method === 'POST') {
    const body = req.body;
    const rows = await sql`
      INSERT INTO projects (title_he, title_en, description_he, description_en, results_he, results_en, tags, sort_order, is_featured)
      VALUES (${body.title_he || ''}, ${body.title_en || ''}, ${body.description_he || ''}, ${body.description_en || ''}, ${body.results_he || ''}, ${body.results_en || ''}, ${body.tags || '[]'}, ${body.sort_order || 0}, ${body.is_featured || false})
      RETURNING *
    `;
    return res.json({ project: rows[0] });
  }

  if (req.method === 'PUT') {
    const body = req.body;
    if (!body.id) return res.status(400).send('id required');
    await sql`
      UPDATE projects SET
        title_he = ${body.title_he || ''}, title_en = ${body.title_en || ''},
        description_he = ${body.description_he || ''}, description_en = ${body.description_en || ''},
        results_he = ${body.results_he || ''}, results_en = ${body.results_en || ''},
        tags = ${body.tags || '[]'}, sort_order = ${body.sort_order || 0},
        is_featured = ${body.is_featured || false}, updated_at = NOW()
      WHERE id = ${body.id}
    `;
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).send('id required');
    await sql`DELETE FROM projects WHERE id = ${parseInt(id)}`;
    return res.json({ ok: true });
  }

  return res.status(405).send('Method not allowed');
}

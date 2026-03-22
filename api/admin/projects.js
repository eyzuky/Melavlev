import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const session = await getSession(req);
  if (!session.valid) return new Response('Unauthorized', { status: 401 });

  const sql = getDb();
  const { searchParams } = new URL(req.url);

  if (req.method === 'GET') {
    const projects = await sql`
      SELECT * FROM projects ORDER BY sort_order ASC
    `;
    const images = await sql`
      SELECT * FROM images WHERE project_id IS NOT NULL ORDER BY sort_order ASC
    `;
    const result = projects.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      images: images.filter(img => img.project_id === p.id),
    }));
    return new Response(JSON.stringify({ projects: result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const rows = await sql`
      INSERT INTO projects (title_he, title_en, description_he, description_en, results_he, results_en, tags, sort_order, is_featured)
      VALUES (${body.title_he || ''}, ${body.title_en || ''}, ${body.description_he || ''}, ${body.description_en || ''}, ${body.results_he || ''}, ${body.results_en || ''}, ${body.tags || '[]'}, ${body.sort_order || 0}, ${body.is_featured || false})
      RETURNING *
    `;
    return new Response(JSON.stringify({ project: rows[0] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    if (!body.id) return new Response('id required', { status: 400 });
    await sql`
      UPDATE projects SET
        title_he = ${body.title_he || ''},
        title_en = ${body.title_en || ''},
        description_he = ${body.description_he || ''},
        description_en = ${body.description_en || ''},
        results_he = ${body.results_he || ''},
        results_en = ${body.results_en || ''},
        tags = ${body.tags || '[]'},
        sort_order = ${body.sort_order || 0},
        is_featured = ${body.is_featured || false},
        updated_at = NOW()
      WHERE id = ${body.id}
    `;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'DELETE') {
    const id = searchParams.get('id');
    if (!id) return new Response('id required', { status: 400 });
    await sql`DELETE FROM projects WHERE id = ${parseInt(id)}`;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}

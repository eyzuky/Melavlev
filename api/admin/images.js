import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';
import { del } from '@vercel/blob';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const session = await getSession(req);
  if (!session.valid) return new Response('Unauthorized', { status: 401 });

  const sql = getDb();
  const { searchParams } = new URL(req.url);

  if (req.method === 'GET') {
    const category = searchParams.get('category');
    let rows;
    if (category) {
      rows = await sql`SELECT * FROM images WHERE category = ${category} ORDER BY sort_order ASC`;
    } else {
      rows = await sql`SELECT * FROM images ORDER BY sort_order ASC`;
    }
    return new Response(JSON.stringify({ images: rows }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const rows = await sql`
      INSERT INTO images (url, image_key, alt_he, alt_en, category, project_id, sort_order)
      VALUES (${body.url}, ${body.image_key || null}, ${body.alt_he || ''}, ${body.alt_en || ''}, ${body.category || 'general'}, ${body.project_id || null}, ${body.sort_order || 0})
      RETURNING *
    `;
    return new Response(JSON.stringify({ image: rows[0] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    if (!body.id) return new Response('id required', { status: 400 });
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
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'DELETE') {
    const id = searchParams.get('id');
    if (!id) return new Response('id required', { status: 400 });
    const rows = await sql`SELECT url FROM images WHERE id = ${parseInt(id)}`;
    if (rows[0]?.url) {
      try { await del(rows[0].url); } catch {}
    }
    await sql`DELETE FROM images WHERE id = ${parseInt(id)}`;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}

import getDb from '../lib/db.js';
import { getSession } from '../lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const session = await getSession(req);
  if (!session.valid) return new Response('Unauthorized', { status: 401 });

  const sql = getDb();

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'site';

    const rows = await sql`
      SELECT key, value_he, value_en FROM content WHERE tab = ${tab} ORDER BY id ASC
    `;
    return new Response(JSON.stringify({ entries: rows }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'PUT') {
    const { tab, entries } = await req.json();
    if (!tab || !entries) {
      return new Response(JSON.stringify({ error: 'tab and entries required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

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

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}

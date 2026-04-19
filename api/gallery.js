import getDb from '../lib/db.js';

export default async function handler(req, res) {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, url, alt_he, alt_en, sort_order
      FROM images
      WHERE category = 'gallery'
      ORDER BY sort_order ASC, id DESC
    `;
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.json({ items: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

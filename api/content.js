import getDb from '../lib/db.js';

export default async function handler(req, res) {
  const tab = req.query.tab || 'site';

  try {
    const sql = getDb();

    if (tab === 'images') {
      const rows = await sql`
        SELECT image_key, url, alt_he, alt_en
        FROM images
        WHERE image_key IS NOT NULL AND image_key != ''
        ORDER BY sort_order ASC
      `;
      const content = {};
      for (const row of rows) {
        content[row.image_key] = {
          url: row.url,
          he: row.alt_he || '',
          en: row.alt_en || row.alt_he || '',
        };
      }
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.json(content);
    }

    const rows = await sql`
      SELECT key, value_he, value_en
      FROM content
      WHERE tab = ${tab}
    `;

    const content = {};
    for (const row of rows) {
      content[row.key] = {
        he: row.value_he || '',
        en: row.value_en || row.value_he || '',
      };
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.json(content);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

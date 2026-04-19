import getDb from '../lib/db.js';

export default async function handler(req, res) {
  try {
    const sql = getDb();

    const projects = await sql`
      SELECT id, title_he, title_en, description_he, description_en,
             results_he, results_en, tags, sort_order, is_featured, video_url
      FROM projects
      ORDER BY sort_order ASC
    `;

    const images = await sql`
      SELECT id, url, alt_he, alt_en, project_id, image_key, sort_order
      FROM images
      WHERE project_id IS NOT NULL
      ORDER BY sort_order ASC
    `;

    const projectsWithImages = projects.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      images: images.filter(img => img.project_id === p.id),
    }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.json({ projects: projectsWithImages });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

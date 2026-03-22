import getDb from './lib/db.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const sql = getDb();

    const projects = await sql`
      SELECT id, title_he, title_en, description_he, description_en,
             results_he, results_en, tags, sort_order, is_featured
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

    return new Response(JSON.stringify({ projects: projectsWithImages }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

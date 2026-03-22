export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get('tab') || 'site';

  const apiKey = process.env.GOOGLE_API_KEY;
  const sheetId = process.env.GOOGLE_SPREADSHEET_ID;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tab)}?key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
    const data = await res.json();

    const rows = data.values || [];
    const content = {};
    const isImagesTab = tab === 'images';

    for (const row of rows) {
      const key = row[0];
      if (!key || key === 'key') continue;

      if (isImagesTab) {
        // images tab: key | drive_file_id | alt_text_he | alt_text_en
        content[key] = {
          fileId: row[1] || '',
          he: row[2] || '',
          en: row[3] || row[2] || '',
        };
      } else {
        // standard tab: key | value_he | value_en
        content[key] = {
          he: row[1] || '',
          en: row[2] || row[1] || '',
        };
      }
    }

    return new Response(JSON.stringify(content), {
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

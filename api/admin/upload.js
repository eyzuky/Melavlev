import { put } from '@vercel/blob';
import { getSession } from '../lib/auth.js';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');

  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    // Read the raw body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // Parse multipart boundary from content-type
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return res.status(400).json({ error: 'No boundary found' });

    const boundary = boundaryMatch[1];
    const parts = buffer.toString('latin1').split(`--${boundary}`);

    let fileBuffer = null;
    let fileName = 'upload.jpg';

    for (const part of parts) {
      if (part.includes('filename="')) {
        const nameMatch = part.match(/filename="([^"]+)"/);
        if (nameMatch) fileName = nameMatch[1];

        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;

        const bodyStart = headerEnd + 4;
        const bodyEnd = part.lastIndexOf('\r\n');
        const fileData = part.slice(bodyStart, bodyEnd);
        fileBuffer = Buffer.from(fileData, 'latin1');
      }
    }

    if (!fileBuffer) return res.status(400).json({ error: 'No file found' });

    const blob = await put(`melavlev/${Date.now()}-${fileName}`, fileBuffer, {
      access: 'public',
    });

    return res.json({ url: blob.url, pathname: blob.pathname });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

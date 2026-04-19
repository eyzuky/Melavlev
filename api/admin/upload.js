import { put } from '@vercel/blob';
import { getSession } from '../../lib/auth.js';

export const config = {
  api: { bodyParser: false },
};

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
]);
const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4', 'video/webm', 'video/quicktime',
]);
const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif',
  'mp4', 'webm', 'mov',
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_REQUEST_BYTES = MAX_VIDEO_BYTES + 1024 * 1024; // extra MB for headers/boundary

function sanitizeFilename(name) {
  // Strip paths, keep extension, allow safe chars only.
  const base = name.replace(/.*[\\/]/, '');
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-128) || 'upload';
}

function extOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : '';
}

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session.valid) return res.status(401).send('Unauthorized');

  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
      total += chunk.length;
      if (total > MAX_REQUEST_BYTES) {
        return res.status(413).json({ error: 'הקובץ גדול מדי' });
      }
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return res.status(400).json({ error: 'Missing multipart boundary' });

    const boundary = boundaryMatch[1];
    const parts = buffer.toString('latin1').split(`--${boundary}`);

    let fileBuffer = null;
    let fileName = 'upload';
    let partContentType = '';

    for (const part of parts) {
      if (!part.includes('filename="')) continue;
      const nameMatch = part.match(/filename="([^"]+)"/);
      if (nameMatch) fileName = nameMatch[1];
      const ctMatch = part.match(/Content-Type: ([^\r\n]+)/i);
      if (ctMatch) partContentType = ctMatch[1].trim().toLowerCase();

      const headerEnd = part.indexOf('\r\n\r\n');
      if (headerEnd === -1) continue;
      const bodyStart = headerEnd + 4;
      const bodyEnd = part.lastIndexOf('\r\n');
      const fileData = part.slice(bodyStart, bodyEnd);
      fileBuffer = Buffer.from(fileData, 'latin1');
      break;
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'לא נמצא קובץ' });
    }

    const safeName = sanitizeFilename(fileName);
    const ext = extOf(safeName);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return res.status(415).json({ error: `סיומת קובץ לא נתמכת: .${ext}` });
    }

    const isImage = ALLOWED_IMAGE_TYPES.has(partContentType);
    const isVideo = ALLOWED_VIDEO_TYPES.has(partContentType);
    if (!isImage && !isVideo) {
      return res.status(415).json({ error: `סוג קובץ לא נתמך: ${partContentType || 'unknown'}` });
    }

    const sizeLimit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (fileBuffer.length > sizeLimit) {
      const mb = Math.round(sizeLimit / (1024 * 1024));
      return res.status(413).json({ error: `הקובץ חורג מהגודל המותר (${mb}MB)` });
    }

    const blob = await put(`melavlev/${Date.now()}-${safeName}`, fileBuffer, {
      access: 'public',
      contentType: partContentType,
    });

    return res.json({ url: blob.url, pathname: blob.pathname });
  } catch (err) {
    console.error('upload error:', err.message);
    return res.status(500).json({ error: 'שגיאה בהעלאה' });
  }
}

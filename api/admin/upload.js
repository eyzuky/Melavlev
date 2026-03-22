import { put } from '@vercel/blob';
import { getSession } from '../lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const session = await getSession(req);
  if (!session.valid) return new Response('Unauthorized', { status: 401 });

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blob = await put(`melavlev/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return new Response(JSON.stringify({ url: blob.url, pathname: blob.pathname }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

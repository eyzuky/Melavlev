import { checkPassword, signToken, sessionCookieHeader } from '../lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { password } = await req.json();
    if (!password || !checkPassword(password)) {
      return new Response(JSON.stringify({ error: 'סיסמה שגויה' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await signToken();
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookieHeader(token),
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

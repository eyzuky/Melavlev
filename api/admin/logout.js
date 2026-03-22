import { clearSessionCookieHeader } from '../lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookieHeader(),
    },
  });
}

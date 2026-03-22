import { getSession } from '../lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const session = await getSession(req);
  return new Response(JSON.stringify({ valid: session.valid }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

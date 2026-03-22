const COOKIE_NAME = 'admin_session';
const MAX_AGE = 86400; // 24 hours

async function hmacSign(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const data = enc.encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', key, data);
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  const dataB64 = btoa(JSON.stringify(payload));
  return `${dataB64}.${sigHex}`;
}

async function hmacVerify(token, secret) {
  const [dataB64, sigHex] = token.split('.');
  if (!dataB64 || !sigHex) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );

  const data = enc.encode(atob(dataB64));
  const sig = new Uint8Array(sigHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const valid = await crypto.subtle.verify('HMAC', key, sig, data);
  if (!valid) return null;

  const payload = JSON.parse(atob(dataB64));
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

export async function signToken() {
  const secret = process.env.ADMIN_SECRET;
  const payload = { exp: Date.now() + MAX_AGE * 1000 };
  return hmacSign(payload, secret);
}

export async function verifyToken(token) {
  const secret = process.env.ADMIN_SECRET;
  return hmacVerify(token, secret);
}

export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
}

export async function getSession(req) {
  const cookies = parseCookies(req.headers.get('cookie'));
  const token = cookies[COOKIE_NAME];
  if (!token) return { valid: false };
  const payload = await verifyToken(token);
  return { valid: !!payload };
}

export function sessionCookieHeader(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookieHeader() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (input.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    result |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

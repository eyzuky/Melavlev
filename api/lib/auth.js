import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 86400; // 24 hours

function hmacSign(payload, secret) {
  const data = JSON.stringify(payload);
  const dataB64 = Buffer.from(data).toString('base64');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return `${dataB64}.${sig}`;
}

function hmacVerify(token, secret) {
  const [dataB64, sigHex] = token.split('.');
  if (!dataB64 || !sigHex) return null;

  const data = Buffer.from(dataB64, 'base64').toString();
  const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(sigHex), Buffer.from(expectedSig))) return null;

  const payload = JSON.parse(data);
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

export function signToken() {
  const secret = process.env.ADMIN_SECRET;
  const payload = { exp: Date.now() + MAX_AGE * 1000 };
  return hmacSign(payload, secret);
}

export function verifyToken(token) {
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

export function getSession(req) {
  // Support both Node.js req (req.headers.cookie) and Web API Request (req.headers.get)
  const cookieHeader = typeof req.headers.get === 'function'
    ? req.headers.get('cookie')
    : req.headers.cookie;
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return { valid: false };
  const payload = verifyToken(token);
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
  try {
    return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return false;
  }
}

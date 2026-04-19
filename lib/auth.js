import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 86400; // 24 hours

function requireSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SECRET env var is missing or too short (min 32 chars required)');
  }
  return secret;
}

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

  const sigBuf = Buffer.from(sigHex, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  let payload;
  try { payload = JSON.parse(data); } catch { return null; }
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

export function signToken() {
  const secret = requireSecret();
  const payload = { exp: Date.now() + MAX_AGE * 1000 };
  return hmacSign(payload, secret);
}

export function verifyToken(token) {
  try {
    const secret = requireSecret();
    return hmacVerify(token, secret);
  } catch {
    return null;
  }
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
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookieHeader() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

// Constant-time password check. Pads both sides to a fixed length before compare so
// the work is uniform regardless of input length (no length-based timing leak).
export function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) {
    throw new Error('ADMIN_PASSWORD env var is missing or too short (min 8 chars required)');
  }
  const inputStr = typeof input === 'string' ? input : '';
  const PAD_LEN = Math.max(expected.length, inputStr.length, 64);
  const inputBuf = Buffer.alloc(PAD_LEN, 0);
  const expectedBuf = Buffer.alloc(PAD_LEN, 0);
  Buffer.from(inputStr).copy(inputBuf);
  Buffer.from(expected).copy(expectedBuf);
  const sameLength = inputStr.length === expected.length;
  const sameContent = crypto.timingSafeEqual(inputBuf, expectedBuf);
  return sameLength && sameContent;
}

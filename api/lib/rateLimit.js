import crypto from 'crypto';
import getDb from './db.js';

const WINDOW_SECONDS = 15 * 60;
const MAX_FAILS_PER_WINDOW = 5;

function hashIp(ip) {
  const secret = process.env.ADMIN_SECRET || '';
  return crypto.createHash('sha256').update(`${secret}:${ip}`).digest('hex');
}

export function getClientIp(req) {
  const fwd = (typeof req.headers.get === 'function'
    ? req.headers.get('x-forwarded-for')
    : req.headers['x-forwarded-for']) || '';
  const first = fwd.split(',')[0].trim();
  if (first) return first;
  return (
    (typeof req.headers.get === 'function'
      ? req.headers.get('x-real-ip')
      : req.headers['x-real-ip']) ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      ip_hash TEXT NOT NULL,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      success BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts (ip_hash, attempted_at)`;
}

// Returns { allowed, retryAfterSeconds, remaining } — safe to call before checking password.
export async function checkLoginRateLimit(ip) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const ipHash = hashIp(ip);
    const rows = await sql`
      SELECT attempted_at FROM login_attempts
      WHERE ip_hash = ${ipHash}
        AND success = FALSE
        AND attempted_at > NOW() - (${WINDOW_SECONDS} * interval '1 second')
      ORDER BY attempted_at ASC
    `;
    if (rows.length < MAX_FAILS_PER_WINDOW) {
      return { allowed: true, remaining: MAX_FAILS_PER_WINDOW - rows.length };
    }
    const oldest = new Date(rows[0].attempted_at).getTime();
    const retryAt = oldest + WINDOW_SECONDS * 1000;
    const retryAfterSeconds = Math.max(1, Math.ceil((retryAt - Date.now()) / 1000));
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  } catch {
    // If rate-limit store fails, fall open (don't lock users out on infra errors)
    // but still enforce password check downstream.
    return { allowed: true, remaining: MAX_FAILS_PER_WINDOW };
  }
}

export async function recordLoginAttempt(ip, success) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const ipHash = hashIp(ip);
    await sql`INSERT INTO login_attempts (ip_hash, success) VALUES (${ipHash}, ${success})`;

    // On success, clear prior failures so the next bad actor doesn't burn the legit user's budget.
    if (success) {
      await sql`DELETE FROM login_attempts WHERE ip_hash = ${ipHash} AND success = FALSE`;
    }
  } catch {
    // best-effort — never let logging break login
  }
}

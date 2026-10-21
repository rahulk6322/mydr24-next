// HTTP Basic auth for /admin and /api/admin. Used by src/proxy.ts and re-checked
// inside the protected routes (defence in depth). Disabled when ADMIN_PASSWORD is unset.

export function adminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkBasicAuth(authorization: string | null): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(authorization.slice(6));
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep < 1) return false;
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);
  return safeEqual(user, process.env.ADMIN_USER || "admin") && safeEqual(pass, password);
}

export const BASIC_AUTH_CHALLENGE = { "WWW-Authenticate": 'Basic realm="MyDR24 Admin", charset="UTF-8"' };

export function buildApiUrl(
  path: string,
  env: { DEV?: boolean; VITE_API_BASE?: string } = import.meta.env,
): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (env.DEV) {
    return normalizedPath;
  }

  const rawBase = env.VITE_API_BASE;
  const apiBase = rawBase && rawBase.trim().length > 0
    ? rawBase.trim()
    : 'https://aasra-backend-kej7.onrender.com';

  const safeBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  return new URL(normalizedPath, `${safeBase}/`).toString();
}

export function buildApiUrl(
  path: string,
  env: { DEV?: boolean; VITE_API_BASE?: string } = import.meta.env,
): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (env.DEV) {
    return normalizedPath;
  }

  const apiBase = (env.VITE_API_BASE ?? '').trim();
  if (!apiBase) {
    return normalizedPath;
  }

  const safeBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  return new URL(normalizedPath, `${safeBase}/`).toString();
}

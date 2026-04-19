/**
 * Lecture légère du payload JWT (sans vérification de signature) pour l’UI.
 * Les droits effectifs restent côté API.
 */
export function getRolesFromJwt(token: string | null): string[] {
  if (!token) return [];
  try {
    const parts = token.split('.');
    if (parts.length < 2) return [];
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);

    const atobFn =
      typeof globalThis.atob === 'function' ? globalThis.atob.bind(globalThis) : null;
    if (!atobFn) return [];

    const json = decodeURIComponent(
      atobFn(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(json) as { roles?: string | string[] };
    if (Array.isArray(payload.roles)) return payload.roles;
    if (typeof payload.roles === 'string') return [payload.roles];
    return [];
  } catch {
    return [];
  }
}

export function hasAdminRole(token: string | null): boolean {
  return getRolesFromJwt(token).includes('ROLE_ADMIN');
}

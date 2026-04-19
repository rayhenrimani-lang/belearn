import { apiFetch, ApiError, parseJsonSafe, unwrapHydraMember, hydraTotalItems } from './api';

export type UtilisateurApi = {
  '@id'?: string;
  id: number;
  email: string;
  nom?: string | null;
  prenom?: string | null;
  telephone?: string | null;
  /** API Platform peut exposer un tableau (getRoles) */
  roles?: string[] | string | null;
};

export function formatRoleLabel(roles: UtilisateurApi['roles']): string {
  const r = normalizePrimaryRole(roles);
  if (r === 'ROLE_ADMIN') return 'Administrateur';
  if (r === 'ROLE_FORMATEUR') return 'Formateur';
  return 'Apprenant';
}

export function normalizePrimaryRole(roles: UtilisateurApi['roles']): string {
  if (typeof roles === 'string') return roles;
  if (Array.isArray(roles)) {
    const admin = roles.find((x) => x === 'ROLE_ADMIN');
    if (admin) return admin;
    const form = roles.find((x) => x === 'ROLE_FORMATEUR');
    if (form) return form;
    return roles[0] ?? 'ROLE_USER';
  }
  return 'ROLE_USER';
}

export async function fetchUtilisateursCollection(): Promise<{
  members: UtilisateurApi[];
  totalItems: number | null;
}> {
  const res = await apiFetch('/utilisateurs', { method: 'GET' });
  const data = await parseJsonSafe<unknown>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }
  if (!res.ok) {
    throw new ApiError(`Impossible de charger les utilisateurs (${res.status}).`, res.status, data);
  }

  const members = unwrapHydraMember<UtilisateurApi>(data);
  const total = hydraTotalItems(data);
  return { members, totalItems: total };
}

export async function fetchUtilisateurById(id: number): Promise<UtilisateurApi> {
  const res = await apiFetch(`/utilisateurs/${encodeURIComponent(String(id))}`, { method: 'GET' });
  const data = await parseJsonSafe<UtilisateurApi>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }
  if (!res.ok || !data || typeof data !== 'object' || !('id' in data)) {
    throw new ApiError(`Utilisateur introuvable (${res.status}).`, res.status, data);
  }
  return data;
}

export type CreateUtilisateurPayload = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  /** Un seul rôle « principal » côté entité */
  roles: string[];
};

export async function createUtilisateur(payload: CreateUtilisateurPayload): Promise<UtilisateurApi> {
  const res = await apiFetch('/utilisateurs', {
    method: 'POST',
    body: JSON.stringify({
      nom: payload.nom,
      prenom: payload.prenom,
      email: payload.email,
      telephone: payload.telephone,
      password: payload.password,
      roles: payload.roles,
    }),
  });
  const data = await parseJsonSafe<UtilisateurApi>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }
  if (!res.ok) {
    const msg =
      (data as { 'hydra:description'?: string })?.['hydra:description'] ||
      `Création impossible (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  if (!data || typeof data !== 'object') {
    throw new ApiError('Réponse serveur invalide.', res.status, data);
  }
  return data;
}

export type PatchUtilisateurPayload = {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  roles?: string[];
};

export async function patchUtilisateur(
  id: number,
  payload: PatchUtilisateurPayload
): Promise<UtilisateurApi> {
  const res = await apiFetch(`/utilisateurs/${encodeURIComponent(String(id))}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafe<UtilisateurApi>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }
  if (!res.ok) {
    const msg =
      (data as { 'hydra:description'?: string })?.['hydra:description'] ||
      `Mise à jour impossible (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  if (!data || typeof data !== 'object') {
    throw new ApiError('Réponse serveur invalide.', res.status, data);
  }
  return data;
}

export async function deleteUtilisateur(id: number): Promise<void> {
  const res = await apiFetch(`/utilisateurs/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });
  const data = await parseJsonSafe<unknown>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }
  if (!res.ok && res.status !== 204) {
    throw new ApiError(`Suppression impossible (${res.status}).`, res.status, data);
  }
}

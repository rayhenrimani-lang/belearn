import { apiFetch, ApiError, parseJsonSafe, unwrapHydraMember } from './api';

type LoginSuccess = { token?: string };
type LoginErrorBody = { message?: string; error?: string };

export async function loginRequest(email: string, password: string): Promise<string> {
  const res = await apiFetch('/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonSafe<LoginSuccess & LoginErrorBody>(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (res.status === 401 ? 'Email ou mot de passe incorrect.' : `Erreur ${res.status}`);
    throw new ApiError(msg, res.status, data);
  }

  if (!data?.token) {
    throw new ApiError('Réponse serveur invalide (token manquant).', res.status, data);
  }

  return data.token;
}

export async function registerRequest(email: string, password: string): Promise<void> {
  const res = await apiFetch('/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonSafe<{
    error?: string;
    message?: string;
    detail?: string;
    title?: string;
  }>(res);

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      data?.detail ||
      data?.title ||
      (res.status === 409 ? 'Cet email est déjà utilisé.' : `Erreur ${res.status}`);
    throw new ApiError(msg, res.status, data);
  }
}

/**
 * POST /api/register puis POST /api/login — retourne le JWT.
 */
export async function registerThenLogin(email: string, password: string): Promise<string> {
  await registerRequest(email, password);
  return loginRequest(email, password);
}

export type UserRow = {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  roles?: string[] | string;
};

export async function fetchUsersRequest(): Promise<UserRow[]> {
  const res = await apiFetch('/utilisateurs', { method: 'GET' });

  const data = await parseJsonSafe<unknown>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }

  if (!res.ok) {
    throw new ApiError(`Impossible de charger les utilisateurs (${res.status}).`, res.status, data);
  }

  const rows = unwrapHydraMember<UserRow>(data);
  if (!Array.isArray(rows)) {
    throw new ApiError('Format de réponse inattendu.', res.status, data);
  }

  return rows;
}

export type CourseRow = {
  id: number;
  title: string | null;
  description: string | null;
  instructorName?: string | null;
  coverImage?: string | null;
  rating?: number;
};

export async function fetchCoursesRequest(): Promise<CourseRow[]> {
  const res = await apiFetch('/cours', { method: 'GET' });

  const data = await parseJsonSafe<unknown>(res);

  if (res.status === 401) {
    throw new ApiError('Session expirée ou non autorisée.', 401, data);
  }

  if (!res.ok) {
    throw new ApiError(`Impossible de charger les cours (${res.status}).`, res.status, data);
  }

  const rows = unwrapHydraMember<CourseRow>(data);
  if (!Array.isArray(rows)) {
    throw new ApiError('Format de réponse inattendu.', res.status, data);
  }

  return rows;
}

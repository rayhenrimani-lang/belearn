import { API_BASE_URL } from '../config/api';
import { getStoredToken } from './authStorage';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export type ApiFetchOptions = RequestInit & { skipAuth?: boolean };

/**
 * `API_BASE_URL` inclut déjà `/api`. Les chemins sont du type `/themes`, `/login`.
 */
export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { skipAuth, headers: hdrs, ...rest } = options;
  const base = API_BASE_URL.replace(/\/$/, '');
  const pathPart = path.startsWith('http') ? path : `${base}/${path.replace(/^\//, '')}`;

  const headers = new Headers(hdrs);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json, application/ld+json');
  }
  if (rest.body && typeof rest.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!skipAuth) {
    const token = await getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(pathPart, { ...rest, headers });
}

export function unwrapHydraMember<T>(data: unknown): T[] {
  if (data && typeof data === 'object' && 'hydra:member' in data) {
    const m = (data as { 'hydra:member': T[] })['hydra:member'];
    return Array.isArray(m) ? m : [];
  }
  if (Array.isArray(data)) return data as T[];
  return [];
}

export function hydraTotalItems(data: unknown): number | null {
  if (data && typeof data === 'object' && 'hydra:totalItems' in data) {
    const n = (data as { 'hydra:totalItems': number })['hydra:totalItems'];
    return typeof n === 'number' ? n : null;
  }
  return null;
}

// —— Types catalogue (API Platform / Hydra) ——

export type Theme = {
  id: number;
  nom: string;
  description: string | null;
  imageUrl: string | null;
};

export type Course = {
  id: number;
  titre: string;
  description: string | null;
  statut: string;
  theme?: { id: number; nom?: string } | string | null;
};

export type Lesson = {
  id: number;
  titre: string;
  type?: string;
  contenu?: string | null;
  cours?: { id: number } | string | null;
};

async function getJsonOrError(
  res: Response,
  errUnauth: string,
  errGeneric: string
): Promise<unknown> {
  const data = await parseJsonSafe<unknown>(res);
  if (res.status === 401) {
    throw new ApiError(errUnauth, 401, data);
  }
  if (!res.ok) {
    throw new ApiError(
      typeof data === 'object' && data && 'hydra:description' in data
        ? String((data as { 'hydra:description': string })['hydra:description'])
        : `${errGeneric} (${res.status})`,
      res.status,
      data
    );
  }
  return data;
}

export async function fetchThemes(): Promise<Theme[]> {
  const res = await apiFetch('/themes', { method: 'GET', skipAuth: true });
  const data = await getJsonOrError(res, 'Session expirée.', 'Impossible de charger les thèmes');
  return unwrapHydraMember<Theme>(data);
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await apiFetch('/cours', { method: 'GET', skipAuth: true });
  const data = await getJsonOrError(res, 'Session expirée.', 'Impossible de charger les cours');
  return unwrapHydraMember<Course>(data);
}

export async function fetchCoursesByTheme(themeId: number): Promise<Course[]> {
  const res = await apiFetch(`/cours?theme.id=${encodeURIComponent(String(themeId))}`, {
    method: 'GET',
    skipAuth: true,
  });
  const data = await getJsonOrError(res, 'Session expirée.', 'Impossible de charger les cours');
  return unwrapHydraMember<Course>(data);
}

export async function fetchCourseById(courseId: number): Promise<Course> {
  const res = await apiFetch(`/cours/${encodeURIComponent(String(courseId))}`, {
    method: 'GET',
    skipAuth: true,
  });
  const data = await getJsonOrError(res, 'Session expirée.', 'Impossible de charger le cours');
  if (!data || typeof data !== 'object') {
    throw new ApiError('Réponse invalide.', res.status, data);
  }
  return data as Course;
}

export async function fetchLessonsByCourse(courseId: number): Promise<Lesson[]> {
  const res = await apiFetch(`/lecons?cours.id=${encodeURIComponent(String(courseId))}`, {
    method: 'GET',
    skipAuth: true,
  });
  const data = await getJsonOrError(res, 'Session expirée.', 'Impossible de charger les leçons');
  return unwrapHydraMember<Lesson>(data);
}

export async function fetchLessonById(lessonId: number): Promise<Lesson> {
  const res = await apiFetch(`/lecons/${encodeURIComponent(String(lessonId))}`, {
    method: 'GET',
    skipAuth: true,
  });
  const data = await getJsonOrError(res, 'Session expirée.', 'Impossible de charger la leçon');
  if (!data || typeof data !== 'object') {
    throw new ApiError('Réponse invalide.', res.status, data);
  }
  return data as Lesson;
}

/** Alias utilisé par certains écrans Expo. */
export async function fetchLessons(courseId: number): Promise<Lesson[]> {
  return fetchLessonsByCourse(courseId);
}

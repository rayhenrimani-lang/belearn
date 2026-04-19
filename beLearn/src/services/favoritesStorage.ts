import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@belearn/favorite_course_ids';

export async function getFavoriteCourseIds(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => Number(x)).filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

export async function setFavoriteCourseIds(ids: number[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
}

export async function toggleFavoriteCourseId(courseId: number): Promise<number[]> {
  const current = await getFavoriteCourseIds();
  const set = new Set(current);
  if (set.has(courseId)) {
    set.delete(courseId);
  } else {
    set.add(courseId);
  }
  const next = [...set];
  await setFavoriteCourseIds(next);
  return next;
}

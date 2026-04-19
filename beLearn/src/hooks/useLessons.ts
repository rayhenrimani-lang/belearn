import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLessonsByCourse, type Lesson } from '../services/api';
import { ApiError } from '../services/api';

export function useLessons(courseId?: number) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstVisit = useRef(true);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (firstVisit.current) setLoading(true);
    setError(null);
    
    try {
      if (courseId === undefined || !Number.isFinite(courseId) || courseId <= 0) {
        setLessons([]);
        return;
      }

      const data = await fetchLessonsByCourse(courseId);
      setLessons(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Impossible de charger les leçons.';
      setError(msg);
    } finally {
      firstVisit.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseId]);

  useFocusEffect(
    useCallback(() => {
      void load(false);
    }, [load])
  );

  return { lessons, loading, refreshing, error, refresh: () => void load(true) };
}

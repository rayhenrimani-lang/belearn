import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchCoursesByTheme, type Course } from '../services/api';
import { ApiError } from '../services/api';

export function useCourses(themeId?: number) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstVisit = useRef(true);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (firstVisit.current) setLoading(true);
    setError(null);
    try {
      let data: Course[];

      if (themeId !== undefined && Number.isFinite(themeId) && themeId > 0) {
        data = await fetchCoursesByTheme(themeId);
      } else {
        data = [];
      }
      
      setCourses(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Impossible de charger les cours.';
      setError(msg);
    } finally {
      firstVisit.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, [themeId]);

  useFocusEffect(
    useCallback(() => {
      void load(false);
    }, [load])
  );

  return { courses, loading, refreshing, error, refresh: () => void load(true) };
}

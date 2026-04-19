import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchThemes, type Theme } from '../services/api';
import { ApiError } from '../services/api';

export function useThemes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstVisit = useRef(true);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (firstVisit.current) setLoading(true);
    setError(null);
    
    try {
      const data = await fetchThemes();
      setThemes(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Impossible de charger les thèmes.';
      setError(msg);
    } finally {
      firstVisit.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(false);
    }, [load])
  );

  return { themes, loading, refreshing, error, refresh: () => void load(true) };
}

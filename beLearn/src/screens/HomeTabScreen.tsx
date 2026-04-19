import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CourseCard } from '../components/CourseCard';
import { SearchBar } from '../components/SearchBar';
import { useCourses } from '../hooks/useCourses';
import { getFavoriteCourseIds, toggleFavoriteCourseId } from '../services/favoritesStorage';
import { colors, spacing, typography } from '../theme/tokens';

export function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  const { courses, loading, refreshing, refresh, error } = useCourses();
  const [query, setQuery] = useState('');
  const [favIds, setFavIds] = useState<Set<number>>(new Set());

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const ids = await getFavoriteCourseIds();
        setFavIds(new Set(ids));
      })();
    }, [])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        (c.title ?? '').toLowerCase().includes(q) ||
        (c.description ?? '').toLowerCase().includes(q) ||
        (c.instructorName ?? '').toLowerCase().includes(q)
    );
  }, [courses, query]);

  const onToggleFav = async (id: number) => {
    const next = await toggleFavoriteCourseId(id);
    setFavIds(new Set(next));
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.headerBlock}>
        <Text style={styles.greeting}>{`Bonjour ${String.fromCodePoint(0x1f44b)}`}</Text>
        <Text style={styles.welcomeLine}>Bienvenue dans votre plateforme d&apos;apprentissage</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <Text style={[typography.section, styles.sectionTitle]}>Cours populaires</Text>

      {loading && courses.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && courses.length === 0 ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              favorite={favIds.has(item.id)}
              onToggleFavorite={() => void onToggleFav(item.id)}
              onPress={() => {}}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun cours ne correspond à votre recherche.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  headerBlock: { marginBottom: spacing.md },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  welcomeLine: {
    ...typography.subtitle,
    marginTop: spacing.sm,
    maxWidth: 340,
  },
  searchWrap: { marginBottom: spacing.lg },
  sectionTitle: { marginBottom: spacing.md },
  listContent: { paddingBottom: spacing.xl },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: colors.danger, textAlign: 'center', marginTop: spacing.lg },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
});

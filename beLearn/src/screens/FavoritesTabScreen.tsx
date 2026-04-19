import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CourseCard } from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';
import { getFavoriteCourseIds, toggleFavoriteCourseId } from '../services/favoritesStorage';
import { colors, spacing, typography } from '../theme/tokens';

export function FavoritesTabScreen() {
  const insets = useSafeAreaInsets();
  const { courses, loading } = useCourses();
  const [favIds, setFavIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        setFavIds(await getFavoriteCourseIds());
      })();
    }, [])
  );

  const favorites = useMemo(() => {
    const set = new Set(favIds);
    return courses.filter((c) => set.has(c.id));
  }, [courses, favIds]);

  const onToggleFav = async (id: number) => {
    const next = await toggleFavoriteCourseId(id);
    setFavIds(next);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <Text style={[typography.title, styles.title]}>Favoris</Text>
      <Text style={styles.sub}>Vos cours enregistrés</Text>

      {!loading && favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Aucun favori pour le moment</Text>
          <Text style={styles.emptyText}>
            Touchez le cœur sur une carte cours pour l&apos;ajouter ici.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              favorite
              onToggleFavorite={() => void onToggleFav(item.id)}
              onPress={() => {}}
            />
          )}
          contentContainerStyle={styles.listContent}
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
  title: { marginBottom: spacing.xs },
  sub: { ...typography.subtitle, marginBottom: spacing.lg },
  listContent: { paddingBottom: spacing.xl },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});

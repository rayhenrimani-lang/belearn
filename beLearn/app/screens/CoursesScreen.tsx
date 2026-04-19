import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '@/src/hooks/useCourses';
import type { Course } from '@/src/services/api';
import { SurfaceCard } from '@/src/components/microlearn/SurfaceCard';
import { pickCourseGradient } from '@/src/components/microlearn/design';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme/theme';

function pseudoProgress(courseId: number): number {
  return 25 + (courseId * 17) % 70;
}

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ themeId?: string | string[]; themeName?: string | string[] }>();
  const themeIdStr = Array.isArray(params.themeId) ? params.themeId[0] : params.themeId;
  const themeNameRaw = Array.isArray(params.themeName) ? params.themeName[0] : params.themeName;

  const themeId = themeIdStr != null && themeIdStr !== '' ? Number(themeIdStr) : NaN;
  const resolvedThemeId =
    Number.isFinite(themeId) && themeId > 0 ? themeId : undefined;

  const { courses, loading, refreshing, error, refresh } = useCourses(resolvedThemeId);

  const renderCourseCard = ({ item, index }: { item: Course; index: number }) => {
    const [c1, c2] = pickCourseGradient(index);
    const progress = pseudoProgress(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.93}
        onPress={() =>
          router.push(
            `/LessonsScreen?courseId=${item.id}&courseTitle=${encodeURIComponent(item.titre)}&themeName=${encodeURIComponent(themeNameRaw ?? '')}`
          )
        }
      >
        <SurfaceCard style={styles.courseWrap} padded={false}>
          <LinearGradient colors={[c1, c2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cover}>
            <View style={styles.coverBadge}>
              <Ionicons name="play-circle" size={22} color={colors.textWhite} />
            </View>
            <Text style={styles.coverLabel}>{item.statut}</Text>
          </LinearGradient>

          <View style={styles.courseBody}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {item.titre}
            </Text>
            <Text style={styles.courseDesc} numberOfLines={3}>
              {item.description}
            </Text>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>
                {new Date(item.dateCreation).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.progressBlock}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressHint}>Progression estimée · {progress}%</Text>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.lessonsCta}>Voir les leçons</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </View>
          </View>
        </SurfaceCard>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.muted}>Chargement des cours…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errTitle}>Erreur</Text>
        <Text style={styles.errMsg}>{error}</Text>
        <TouchableOpacity style={styles.retry} onPress={refresh}>
          <Text style={styles.retryTxt}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.topTitles}>
          <Text style={styles.screenTitle} numberOfLines={1}>
            {themeNameRaw ?? 'Cours'}
          </Text>
          <Text style={styles.screenSub}>
            {courses.length} cours disponible{courses.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCourseCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>Aucun cours</Text>
            <Text style={styles.emptySub}>Ce thème n’a pas encore de cours.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backBtn: {
    padding: spacing.sm,
  },
  topTitles: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  screenSub: {
    ...typography.caption,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  courseWrap: {
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.lg,
  },
  cover: {
    height: 120,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  coverBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  coverLabel: {
    alignSelf: 'flex-start',
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.95,
  },
  courseBody: {
    padding: spacing.md,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  courseDesc: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  metaText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  progressBlock: {
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
  },
  progressHint: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
  },
  lessonsCta: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  muted: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errTitle: {
    ...typography.h3,
    color: colors.error,
    marginTop: spacing.md,
  },
  errMsg: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: spacing.md,
  },
  retry: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  retryTxt: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
  emptySub: {
    ...typography.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useLessons } from '@/src/hooks/useLessons';
import type { Lesson } from '@/src/services/api';
import { SurfaceCard } from '@/src/components/microlearn/SurfaceCard';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function LessonsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    courseId?: string | string[];
    courseTitle?: string | string[];
    themeName?: string | string[];
  }>();
  const courseIdRaw = params.courseId;
  const courseTitle = Array.isArray(params.courseTitle) ? params.courseTitle[0] : params.courseTitle;
  const themeName = Array.isArray(params.themeName) ? params.themeName[0] : params.themeName;
  const courseIdStr = Array.isArray(courseIdRaw) ? courseIdRaw[0] : courseIdRaw;

  const courseId =
    courseIdStr != null && courseIdStr !== '' ? Number(courseIdStr) : NaN;
  const resolvedCourseId =
    Number.isFinite(courseId) && courseId > 0 ? courseId : undefined;

  const { lessons, loading, refreshing, error, refresh } = useLessons(resolvedCourseId);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [progress, setProgress] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (lessons.length > 0) {
      const initialProgress: { [key: number]: number } = {};
      lessons.forEach((lesson, index) => {
        initialProgress[lesson.id] = index === 0 ? 100 : 0;
      });
      setProgress(initialProgress);
    }
  }, [lessons]);

  const handlePlayLesson = (lesson: Lesson) => {
    if (lesson.urlVideo) {
      setSelectedLesson(lesson);
      setVideoModalVisible(true);
      setProgress((prev) => ({
        ...prev,
        [lesson.id]: 50,
      }));
    }
  };

  const handleVideoComplete = () => {
    if (selectedLesson) {
      setProgress((prev) => ({
        ...prev,
        [selectedLesson.id]: 100,
      }));
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const renderLessonItem = ({ item, index }: { item: Lesson; index: number }) => {
    const isCompleted = progress[item.id] === 100;
    const isInProgress = progress[item.id] === 50;
    const isLocked = index > 0 && !isCompleted && !isInProgress;
    const hasVideo = Boolean(item.urlVideo);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => !isLocked && handlePlayLesson(item)}
        disabled={isLocked || !hasVideo}
      >
        <SurfaceCard
          style={[
            styles.lessonRow,
            isCompleted && styles.lessonDone,
            isInProgress && styles.lessonActive,
          ]}
          padded={false}
        >
          <View style={[styles.strip, hasVideo ? styles.stripVideo : styles.stripText]} />
          <View style={styles.lessonMain}>
            <View style={styles.lessonTop}>
              <View style={styles.badgeOrder}>
                <Text style={styles.badgeOrderText}>{index + 1}</Text>
              </View>
              <View style={styles.lessonTexts}>
                <Text style={styles.lessonTitle} numberOfLines={2}>
                  {item.titre}
                </Text>
                <View style={styles.chipRow}>
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{item.type}</Text>
                  </View>
                  <View style={[styles.chip, styles.chipMuted]}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.chipMutedText}>{formatDuration(item.duree)}</Text>
                  </View>
                </View>
              </View>
            </View>
            {item.contenu ? (
              <Text style={styles.preview} numberOfLines={2}>
                {item.contenu}
              </Text>
            ) : null}
          </View>
          <View style={styles.playCol}>
            {isCompleted ? (
              <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            ) : isInProgress ? (
              <Ionicons name="time" size={28} color={colors.warning} />
            ) : isLocked ? (
              <Ionicons name="lock-closed" size={26} color={colors.textTertiary} />
            ) : hasVideo ? (
              <View style={styles.playFab}>
                <Ionicons name="play" size={22} color={colors.textWhite} />
              </View>
            ) : (
              <Ionicons name="document-text-outline" size={26} color={colors.textTertiary} />
            )}
          </View>
        </SurfaceCard>
      </TouchableOpacity>
    );
  };

  const calculateCourseProgress = () => {
    if (lessons.length === 0) return 0;
    const completedCount = Object.values(progress).filter((p) => p === 100).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.muted}>Chargement des leçons…</Text>
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

  const vid = selectedLesson?.urlVideo
    ? getYouTubeVideoId(selectedLesson.urlVideo)
    : null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {courseTitle || 'Leçons'}
          </Text>
          {themeName ? <Text style={styles.subtitle}>{themeName}</Text> : null}
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${calculateCourseProgress()}%` }]}
              />
            </View>
            <Text style={styles.progressLabel}>{calculateCourseProgress()} % complété</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={lessons}
        renderItem={renderLessonItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>Aucune leçon</Text>
            <Text style={styles.emptySub}>Ce cours n’a pas encore de leçons.</Text>
          </View>
        }
      />

      <Modal
        visible={videoModalVisible}
        animationType="slide"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={[styles.modalRoot, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setVideoModalVisible(false)} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedLesson?.titre}
            </Text>
            <View style={{ width: 26 }} />
          </View>
          {selectedLesson?.urlVideo && vid ? (
            <View style={styles.videoBox}>
              <YoutubeIframe
                videoId={vid}
                height={220}
                width={screenWidth - 32}
                onEnd={handleVideoComplete}
                play
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backBtn: {
    padding: spacing.sm,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  progressWrap: {
    gap: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  lessonDone: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  lessonActive: {
    borderColor: colors.warning,
    borderWidth: 1,
  },
  strip: {
    width: 5,
  },
  stripVideo: {
    backgroundColor: colors.primary,
  },
  stripText: {
    backgroundColor: colors.info,
  },
  lessonMain: {
    flex: 1,
    padding: spacing.md,
  },
  lessonTop: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badgeOrder: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOrderText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  lessonTexts: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundTertiary,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  chipMuted: {
    backgroundColor: colors.borderLight,
  },
  chipMutedText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  preview: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  playCol: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },
  playFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
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
  modalRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    flex: 1,
    marginHorizontal: spacing.md,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  videoBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
});

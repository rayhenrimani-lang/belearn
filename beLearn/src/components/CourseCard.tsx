import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/theme';
import type { Course } from '../services/api';

function coverUri(course: Course): string {
  return `https://picsum.photos/seed/belearn-${course.id}/640/360`;
}

type Props = {
  course: Course;
  onPress?: () => void;
  progress?: number;
};

export function CourseCard({ course, onPress, progress = 0 }: Props) {
  const desc = course.description?.trim() || 'Découvrez ce cours sur notre plateforme.';
  const snippet = desc.length > 120 ? `${desc.slice(0, 120)}...` : desc;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: coverUri(course) }} style={styles.image} contentFit="cover" />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{course.statut}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {course.titre}
        </Text>
        <Text style={styles.desc} numberOfLines={3}>
          {snippet}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.meta}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.date}>
              {new Date(course.date_creation).toLocaleDateString()}
            </Text>
          </View>
          
          {progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: { opacity: 0.96 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 160 },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textWhite,
  },
  body: { padding: spacing.md },
  title: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

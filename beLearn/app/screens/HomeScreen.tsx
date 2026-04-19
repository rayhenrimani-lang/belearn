import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemes } from '@/src/hooks/useThemes';
import { useAuth } from '@/src/context/AuthContext';
import type { Theme } from '@/src/services/api';
import { ScreenHeader } from '@/src/components/microlearn/ScreenHeader';
import { SurfaceCard } from '@/src/components/microlearn/SurfaceCard';
import { pickAccent } from '@/src/components/microlearn/design';
import { displayNameFromEmail } from '@/src/utils/displayName';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userEmail } = useAuth();
  const { themes, loading, refreshing, error, refresh } = useThemes();

  const displayName = displayNameFromEmail(userEmail);
  const initial = displayName.slice(0, 1).toUpperCase();

  const goProfile = useCallback(() => {
    router.push('/(tabs)/profile');
  }, [router]);

  const renderThemeCard = ({ item, index }: { item: Theme; index: number }) => {
    const accent = pickAccent(index);
    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() =>
          router.push(
            `/CoursesScreen?themeId=${item.id}&themeName=${encodeURIComponent(item.nom)}`
          )
        }
      >
        <SurfaceCard style={styles.themeCard} padded={false}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.themeImage} />
          ) : (
            <View style={[styles.themeImage, { backgroundColor: accent }]}>
              <Ionicons name="layers-outline" size={40} color={colors.textWhite} />
            </View>
          )}
          <View style={styles.themeBody}>
            <Text style={styles.themeName}>{item.nom}</Text>
            <Text style={styles.themeDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.themeFooter}>
              <Text style={styles.cta}>Voir les cours</Text>
              <Ionicons name="chevron-forward" size={20} color={accent} />
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
        <Text style={styles.loadingText}>Chargement des thèmes…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorTitle}>Erreur</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retry} onPress={refresh}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        onPressAvatar={goProfile}
        avatarLetter={initial}
        onPressMenu={() => {}}
        onPressNotification={() => {}}
      />

      <FlatList
        data={themes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderThemeCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.greeting}>Bonjour, {displayName} 👋</Text>
            <Text style={styles.subGreeting}>Explorez nos thèmes et commencez à apprendre</Text>
            <Text style={styles.sectionLabel}>Thèmes</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>Aucun thème pour le moment</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  headerBlock: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subGreeting: {
    ...typography.caption,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  themeCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.md,
  },
  themeImage: {
    width: '100%',
    height: 132,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBody: {
    padding: spacing.md,
  },
  themeName: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  themeDescription: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  themeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
  },
  cta: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginTop: spacing.md,
  },
  errorMessage: {
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
  retryText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    marginTop: spacing.md,
    color: colors.textTertiary,
    fontSize: 16,
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../src/theme/theme';
import { commonStyles } from '../../src/styles/commonStyles';

export default function NavigationTest() {
  const router = useRouter();

  const screens = [
    {
      name: 'HomeScreen',
      path: '/screens/HomeScreen',
      description: 'Browse themes and courses',
      icon: 'home-outline',
    },
    {
      name: 'CoursesScreen',
      path: '/screens/CoursesScreen?themeId=1&themeName=Développement Web',
      description: 'View courses for a theme',
      icon: 'book-outline',
    },
    {
      name: 'LessonsScreen',
      path: '/screens/LessonsScreen?courseId=1&courseTitle=HTML & CSS Fundamentals&themeName=Développement Web',
      description: 'View lessons and watch videos',
      icon: 'play-circle-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Navigation Test</Text>
        <Text style={styles.headerSubtitle}>Test all screens and API calls</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {screens.map((screen, index) => (
          <TouchableOpacity
            key={index}
            style={styles.screenCard}
            onPress={() => router.push(screen.path)}
          >
            <View style={styles.screenHeader}>
              <View style={styles.screenIcon}>
                <Ionicons name={screen.icon as any} size={24} color={colors.textWhite} />
              </View>
              <Text style={styles.screenName}>{screen.name}</Text>
            </View>
            <Text style={styles.screenDescription}>{screen.description}</Text>
            <View style={styles.screenFooter}>
              <Text style={styles.screenPath}>{screen.path}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.infoTitle}>API Configuration</Text>
          <Text style={styles.infoText}>
            Base URL: http://192.168.61.185:8001/api
          </Text>
          <Text style={styles.infoText}>
            Make sure Symfony API is running on port 8001
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  screenCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.card,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  screenIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  screenName: {
    ...typography.h3,
  },
  screenDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  screenFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenPath: {
    ...typography.small,
    color: colors.textTertiary,
    flex: 1,
    marginRight: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoTitle: {
    ...typography.h4,
    color: colors.primary,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

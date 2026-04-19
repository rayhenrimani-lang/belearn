import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { hasAdminRole } from '@/src/utils/jwtRoles';
import { fetchCourses, ApiError } from '@/src/services/api';
import {
  fetchUtilisateursCollection,
  normalizePrimaryRole,
  type UtilisateurApi,
} from '@/src/services/utilisateursApi';
import { colors, spacing, radius, typography, cardShadow } from '@/src/theme/tokens';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token, userEmail, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFormateurs, setTotalFormateurs] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const isAdmin = hasAdminRole(token);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [{ members }, courses] = await Promise.all([
        fetchUtilisateursCollection(),
        fetchCourses(),
      ]);
      const formateurs = members.filter(
        (u: UtilisateurApi) => normalizePrimaryRole(u.roles) === 'ROLE_FORMATEUR'
      ).length;
      setTotalUsers(members.length);
      setTotalFormateurs(formateurs);
      setTotalCourses(courses.length);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Chargement impossible.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAdmin) void load(false);
      else setLoading(false);
    }, [load, isAdmin])
  );

  if (!isAdmin) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + spacing.lg }]}>
        <Ionicons name="shield-outline" size={56} color={colors.textTertiary} />
        <Text style={styles.deniedTitle}>Accès réservé aux administrateurs</Text>
        <Text style={styles.deniedText}>
          Connectez-vous avec un compte ROLE_ADMIN pour accéder à cette zone.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/login-modern')}>
          <Text style={styles.primaryBtnText}>Retour connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement du tableau de bord…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />
      }>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcome}>Bienvenue</Text>
          <Text style={styles.email} numberOfLines={1}>
            {userEmail ?? 'Administrateur'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => void logout()} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => void load(true)}>
            <Text style={styles.retry}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Vue d’ensemble</Text>
      <View style={styles.cardsRow}>
        <StatCard
          icon="people"
          label="Utilisateurs"
          value={String(totalUsers)}
          accent={colors.info}
        />
        <StatCard
          icon="school"
          label="Formateurs"
          value={String(totalFormateurs)}
          accent={colors.secondary}
        />
      </View>
      <View style={styles.cardsRow}>
        <StatCard
          icon="library"
          label="Cours"
          value={String(totalCourses)}
          accent={colors.success}
          wide
        />
      </View>

      <Text style={styles.sectionTitle}>Gestion</Text>
      <TouchableOpacity
        style={styles.navCard}
        onPress={() => router.push('/admin/users')}
        activeOpacity={0.9}>
        <View style={[styles.navIcon, { backgroundColor: `${colors.primary}18` }]}>
          <Ionicons name="people-outline" size={26} color={colors.primary} />
        </View>
        <View style={styles.navTextWrap}>
          <Text style={styles.navTitle}>Utilisateurs</Text>
          <Text style={styles.navSubtitle}>Liste, rôles et suppression</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navCard}
        onPress={() => router.push('/admin/addUser')}
        activeOpacity={0.9}>
        <View style={[styles.navIcon, { backgroundColor: `${colors.success}22` }]}>
          <Ionicons name="person-add-outline" size={26} color={colors.success} />
        </View>
        <View style={styles.navTextWrap}>
          <Text style={styles.navTitle}>Ajouter un utilisateur</Text>
          <Text style={styles.navSubtitle}>Créer formateur ou apprenant</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  wide,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent: string;
  wide?: boolean;
}) {
  return (
    <View style={[styles.statCard, wide && styles.statCardWide, cardShadow]}>
      <View style={[styles.statIconWrap, { backgroundColor: `${accent}22` }]}>
        <Ionicons name={icon} size={24} color={accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcome: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  email: {
    ...typography.heading,
    maxWidth: 280,
  },
  logoutBtn: {
    padding: spacing.sm,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '42%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardWide: {
    minWidth: '100%',
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    marginTop: 4,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  navIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextWrap: {
    flex: 1,
    marginLeft: spacing.md,
  },
  navTitle: {
    ...typography.subheading,
    fontSize: 17,
  },
  navSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  retry: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  deniedTitle: {
    ...typography.heading,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  deniedText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  primaryBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
  primaryBtnText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 16,
  },
});

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { hasAdminRole } from '@/src/utils/jwtRoles';
import {
  deleteUtilisateur,
  fetchUtilisateursCollection,
  formatRoleLabel,
  type UtilisateurApi,
} from '@/src/services/utilisateursApi';
import { ApiError } from '@/src/services/api';
import { colors, spacing, radius, typography, cardShadow } from '@/src/theme/tokens';

export default function AdminUsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [list, setList] = useState<UtilisateurApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = hasAdminRole(token);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const { members } = await fetchUtilisateursCollection();
      setList(members);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Impossible de charger la liste.';
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

  const onDelete = (item: UtilisateurApi) => {
    Alert.alert(
      'Supprimer l’utilisateur',
      `Supprimer ${item.email} ? Cette action est définitive.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUtilisateur(item.id);
              setList((prev) => prev.filter((u) => u.id !== item.id));
            } catch (e) {
              const msg = e instanceof ApiError ? e.message : 'Suppression impossible.';
              Alert.alert('Erreur', msg);
            }
          },
        },
      ]
    );
  };

  if (!isAdmin) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.denied}>Accès refusé</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom + spacing.md }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarBtn} onPress={() => router.push('/admin/addUser')}>
          <Ionicons name="add" size={22} color={colors.textWhite} />
          <Text style={styles.toolbarBtnText}>Ajouter</Text>
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

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun utilisateur à afficher.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, cardShadow]}>
            <View style={styles.cardMain}>
              <Text style={styles.email} numberOfLines={1}>
                {item.email}
              </Text>
              <View style={styles.rolePill}>
                <Text style={styles.roleText}>{formatRoleLabel(item.roles)}</Text>
              </View>
              {(item.prenom || item.nom) && (
                <Text style={styles.name}>
                  {[item.prenom, item.nom].filter(Boolean).join(' ')}
                </Text>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  router.push({
                    pathname: '/admin/editUser',
                    params: { id: String(item.id) },
                  })
                }>
                <Ionicons name="create-outline" size={22} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => onDelete(item)}>
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  toolbarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  toolbarBtnText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardMain: {
    flex: 1,
    marginRight: spacing.sm,
  },
  email: {
    ...typography.subheading,
    fontSize: 16,
  },
  name: {
    ...typography.caption,
    marginTop: 4,
  },
  rolePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  roleText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    padding: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  errorBanner: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
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
  denied: {
    ...typography.heading,
  },
  link: {
    marginTop: spacing.md,
    color: colors.primary,
    fontWeight: '600',
  },
});

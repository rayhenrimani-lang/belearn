import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { hasAdminRole } from '@/src/utils/jwtRoles';
import {
  fetchUtilisateurById,
  patchUtilisateur,
  normalizePrimaryRole,
} from '@/src/services/utilisateursApi';
import { ApiError } from '@/src/services/api';
import { colors, spacing, radius, typography } from '@/src/theme/tokens';

const ROLE_OPTIONS = [
  { value: 'ROLE_ADMIN', label: 'Administrateur' },
  { value: 'ROLE_FORMATEUR', label: 'Formateur' },
  { value: 'ROLE_USER', label: 'Apprenant (ROLE_USER)' },
] as const;

export default function AdminEditUserScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const { token } = useAuth();
  const isAdmin = hasAdminRole(token);

  const userId = idParam ? parseInt(idParam, 10) : NaN;

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]['value']>('ROLE_USER');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(userId) || userId <= 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const u = await fetchUtilisateurById(userId);
      setNom(u.nom ?? '');
      setPrenom(u.prenom ?? '');
      setEmail(u.email ?? '');
      setTelephone(u.telephone ?? '');
      const r = normalizePrimaryRole(u.roles);
      if (r === 'ROLE_ADMIN' || r === 'ROLE_FORMATEUR' || r === 'ROLE_USER') {
        setRole(r);
      } else {
        setRole('ROLE_USER');
      }
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Chargement impossible.';
      Alert.alert('Erreur', msg, [{ text: 'OK', onPress: () => router.back() }]);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    if (isAdmin && Number.isFinite(userId) && userId > 0) void load();
    else if (isAdmin) setLoading(false);
  }, [isAdmin, userId, load]);

  const submit = async () => {
    const n = nom.trim();
    const p = prenom.trim();
    const e = email.trim();
    const t = telephone.trim();
    if (!n || !p || !e || !t) {
      Alert.alert('Champs requis', 'Remplissez nom, prénom, email et téléphone.');
      return;
    }
    if (!Number.isFinite(userId) || userId <= 0) return;

    setSaving(true);
    try {
      await patchUtilisateur(userId, {
        nom: n,
        prenom: p,
        email: e,
        telephone: t,
        roles: [role],
      });
      Alert.alert('Succès', 'Utilisateur mis à jour.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Enregistrement impossible.';
      Alert.alert('Erreur', msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.denied}>Accès refusé</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement…</Text>
      </View>
    );
  }

  if (!Number.isFinite(userId) || userId <= 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.denied}>Identifiant invalide</Text>
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
      keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={nom}
        onChangeText={setNom}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={prenom}
        onChangeText={setPrenom}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={telephone}
        onChangeText={setTelephone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Rôle</Text>
      <View style={styles.roleRow}>
        {ROLE_OPTIONS.map((opt) => {
          const selected = role === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.roleChip, selected && styles.roleChipSelected]}
              onPress={() => setRole(opt.value)}>
              <Text style={[styles.roleChipText, selected && styles.roleChipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.submit, saving && styles.submitDisabled]}
        onPress={() => void submit()}
        disabled={saving}>
        {saving ? (
          <ActivityIndicator color={colors.textWhite} />
        ) : (
          <Text style={styles.submitText}>Enregistrer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.text,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  roleChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  roleChipSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}14`,
  },
  roleChipText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  submit: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 16,
  },
  denied: {
    ...typography.heading,
  },
});

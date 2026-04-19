import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { hasAdminRole } from '@/src/utils/jwtRoles';
import { createUtilisateur } from '@/src/services/utilisateursApi';
import { ApiError } from '@/src/services/api';
import { colors, spacing, radius, typography } from '@/src/theme/tokens';

const ROLE_OPTIONS = [
  { value: 'ROLE_FORMATEUR', label: 'Formateur' },
  { value: 'ROLE_USER', label: 'Apprenant (ROLE_USER)' },
] as const;

export default function AdminAddUserScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const isAdmin = hasAdminRole(token);

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]['value']>('ROLE_USER');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const n = nom.trim();
    const p = prenom.trim();
    const e = email.trim();
    const t = telephone.trim();
    if (!n || !p || !e || !t || !password) {
      Alert.alert('Champs requis', 'Remplissez tous les champs.');
      return;
    }

    setLoading(true);
    try {
      await createUtilisateur({
        nom: n,
        prenom: p,
        email: e,
        telephone: t,
        password,
        roles: [role],
      });
      Alert.alert('Succès', 'Utilisateur créé.', [
        { text: 'OK', onPress: () => router.replace('/admin/users') },
      ]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Création impossible.';
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.denied}>Accès refusé</Text>
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
        placeholder="Nom"
        placeholderTextColor={colors.textTertiary}
      />

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={prenom}
        onChangeText={setPrenom}
        autoCapitalize="words"
        placeholder="Prénom"
        placeholderTextColor={colors.textTertiary}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="email@exemple.com"
        placeholderTextColor={colors.textTertiary}
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={telephone}
        onChangeText={setTelephone}
        keyboardType="phone-pad"
        placeholder="0612345678"
        placeholderTextColor={colors.textTertiary}
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.textTertiary}
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
        style={[styles.submit, loading && styles.submitDisabled]}
        onPress={() => void submit()}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.textWhite} />
        ) : (
          <Text style={styles.submitText}>Créer l’utilisateur</Text>
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

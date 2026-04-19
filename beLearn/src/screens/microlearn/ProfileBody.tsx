import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SurfaceCard } from '../../components/microlearn/SurfaceCard';
import { PrimaryButton } from '../../components/microlearn/PrimaryButton';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/theme';

export type ProfileBodyProps = {
  displayName: string;
  email: string | null;
  onEditProfile: () => void;
  onLogout: () => void | Promise<void>;
};

export function ProfileBody({ displayName, email, onEditProfile, onLogout }: ProfileBodyProps) {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  const confirmLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment quitter votre session ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setBusy(true);
            try {
              await onLogout();
            } finally {
              setBusy(false);
            }
          })();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Profil</Text>
      <Text style={styles.pageSubtitle}>Votre compte MicroLearn</Text>

      <SurfaceCard style={styles.heroCard}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {displayName.slice(0, 1).toUpperCase() || '?'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.email}>{email ?? '—'}</Text>
        </View>
      </SurfaceCard>

      <PrimaryButton label="Modifier le profil" onPress={onEditProfile} variant="outline" />

      <PrimaryButton
        label="Se déconnecter"
        onPress={confirmLogout}
        variant="dangerOutline"
        loading={busy}
        style={styles.logoutBtn}
      />

      <Text style={styles.version}>MicroLearn · v1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pageTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.sm,
    ...shadows.lg,
  },
  avatarRing: {
    padding: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundTertiary,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textWhite,
  },
  name: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  logoutBtn: {
    marginTop: spacing.sm,
  },
  version: {
    ...typography.small,
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.textTertiary,
  },
});

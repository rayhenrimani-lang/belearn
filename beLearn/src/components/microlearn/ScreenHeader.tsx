import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme/theme';

type Props = {
  /** Titre central (ex. MicroLearn) */
  title?: string;
  onPressMenu?: () => void;
  onPressNotification?: () => void;
  onPressAvatar?: () => void;
  avatarLetter?: string;
};

export function ScreenHeader({
  title = 'MicroLearn',
  onPressMenu,
  onPressNotification,
  onPressAvatar,
  avatarLetter,
}: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onPressMenu}
        hitSlop={12}
        accessibilityLabel="Menu"
      >
        <Ionicons name="menu-outline" size={26} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onPressNotification}
          hitSlop={12}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatar}
          onPress={onPressAvatar}
          accessibilityLabel="Profil"
        >
          <Text style={styles.avatarText}>
            {(avatarLetter ?? '?').slice(0, 1).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: Platform.OS === 'ios' ? -0.3 : 0,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});

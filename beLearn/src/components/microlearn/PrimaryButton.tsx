import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'dangerOutline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'filled',
  loading,
  disabled,
  style,
}: Props) {
  const isOutline = variant !== 'filled';
  const isDanger = variant === 'dangerOutline';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOutline ? styles.outline : styles.filled,
        isDanger && styles.dangerOutline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.88}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.textWhite} />
      ) : (
        <Text
          style={[
            styles.label,
            isOutline && styles.labelOutline,
            isDanger && styles.labelDanger,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dangerOutline: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  labelOutline: {
    color: colors.primary,
  },
  labelDanger: {
    color: colors.error,
  },
});

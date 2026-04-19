import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/tokens';

type Props = {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
};

export function StarRating({ rating, max = 5, size = 14, showValue = true }: Props) {
  const full = Math.floor(Math.min(rating, max));
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;

  return (
    <View style={styles.row}>
      {[...Array(full)].map((_, i) => (
        <Ionicons key={`f-${i}`} name="star" size={size} color={colors.star} />
      ))}
      {half === 1 ? <Ionicons name="star-half" size={size} color={colors.star} /> : null}
      {[...Array(empty)].map((_, i) => (
        <Ionicons key={`e-${i}`} name="star-outline" size={size} color={colors.textMuted} />
      ))}
      {showValue ? <Text style={styles.value}>{rating.toFixed(1)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: {
    marginLeft: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

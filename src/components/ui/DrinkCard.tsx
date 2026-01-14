/**
 * 술렌다 DrinkCard 컴포넌트
 * 주종 선택 카드 (2x2 그리드용)
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { Text } from './Text';

export type DrinkType = 'soju' | 'beer' | 'wine' | 'whiskey' | 'makgeolli' | 'etc';

interface DrinkCardProps {
  type: DrinkType;
  label: string;
  icon: string;
  selected?: boolean;
  onPress?: () => void;
}

const drinkEmojis: Record<DrinkType, string> = {
  soju: '🍶',
  beer: '🍺',
  wine: '🍷',
  whiskey: '🥃',
  makgeolli: '🍵',
  etc: '🍸',
};

export function DrinkCard({
  type,
  label,
  icon,
  selected = false,
  onPress,
}: DrinkCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        { borderColor: selected ? colors.drinks[type] : colors.border.light },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${colors.drinks[type]}20` },
        ]}
      >
        <Text style={styles.icon}>{icon || drinkEmojis[type]}</Text>
      </View>
      <Text variant="caption" color={selected ? 'primary' : 'secondary'} center>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  selected: {
    backgroundColor: colors.background.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
  },
});

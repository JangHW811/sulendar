/**
 * 술렌다 DrinkCard 컴포넌트
 * 주종 선택 카드 (2x2 그리드용) - 투톤 아이콘 적용
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Text } from './Text';
import {
  SojuIcon,
  BeerIcon,
  WineIcon,
  WhiskeyIcon,
  MakgeolliIcon,
  EtcDrinkIcon,
} from './Icons';

export type DrinkType = 'soju' | 'beer' | 'wine' | 'whiskey' | 'makgeolli' | 'etc';

interface DrinkCardProps {
  type: DrinkType;
  label: string;
  icon?: string; // 레거시 지원용 (사용 안 함)
  selected?: boolean;
  onPress?: () => void;
}

// 주종별 투톤 아이콘 매핑
const DrinkIcons: Record<DrinkType, React.ComponentType<{ size?: number; color?: string }>> = {
  soju: SojuIcon,
  beer: BeerIcon,
  wine: WineIcon,
  whiskey: WhiskeyIcon,
  makgeolli: MakgeolliIcon,
  etc: EtcDrinkIcon,
};

export function DrinkCard({
  type,
  label,
  selected = false,
  onPress,
}: DrinkCardProps) {
  const IconComponent = DrinkIcons[type];
  const drinkColor = colors.drinks[type];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        { borderColor: selected ? drinkColor : colors.border.light },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${drinkColor}15` },
        ]}
      >
        <IconComponent size={36} color={drinkColor} />
      </View>
      <Text 
        variant="caption" 
        style={{ color: selected ? colors.text.primary : colors.text.secondary, fontWeight: selected ? '600' : '400' }}
        center
      >
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
    ...shadows.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * 술렌다 AmountSelector 컴포넌트
 * 수량 선택 (+/- 버튼)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { Text } from './Text';

interface AmountSelectorProps {
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function AmountSelector({
  value,
  unit = '병',
  min = 0,
  max = 99,
  step = 0.5,
  onChange,
}: AmountSelectorProps) {
  const decrease = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const formatValue = (val: number) => {
    return val % 1 === 0 ? val.toString() : val.toFixed(1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value <= min && styles.buttonDisabled]}
        onPress={decrease}
        disabled={value <= min}
        activeOpacity={0.7}
      >
        <Text variant="heading" color={value <= min ? 'muted' : 'primary'}>
          −
        </Text>
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text variant="display" color="primary">
          {formatValue(value)}
        </Text>
        <Text variant="caption" color="secondary">
          {unit}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, value >= max && styles.buttonDisabled]}
        onPress={increase}
        disabled={value >= max}
        activeOpacity={0.7}
      >
        <Text variant="heading" color={value >= max ? 'muted' : 'primary'}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
});

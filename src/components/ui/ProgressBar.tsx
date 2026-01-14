/**
 * 술렌다 ProgressBar 컴포넌트
 * 단계별 진행 상태 표시 (대시 형태)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < current ? styles.active : styles.inactive,
            index === 0 && styles.first,
            index === total - 1 && styles.last,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
  },
  active: {
    backgroundColor: colors.primary.main,
  },
  inactive: {
    backgroundColor: colors.border.default,
  },
  first: {
    borderTopLeftRadius: borderRadius.full,
    borderBottomLeftRadius: borderRadius.full,
  },
  last: {
    borderTopRightRadius: borderRadius.full,
    borderBottomRightRadius: borderRadius.full,
  },
});

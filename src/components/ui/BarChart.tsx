/**
 * 술렌다 BarChart 컴포넌트
 * 간단한 막대 그래프
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { Text } from './Text';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  maxValue?: number;
  height?: number;
}

export function BarChart({ data, maxValue, height = 150 }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.barsContainer, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / max) * height;
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.color || colors.primary.main,
                    },
                  ]}
                />
              </View>
              <Text variant="small" color="secondary" center style={styles.label}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  barContainer: {
    width: '70%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    minHeight: 4,
  },
  label: {
    marginTop: spacing.xs,
  },
});

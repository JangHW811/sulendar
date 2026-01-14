/**
 * 술렌다 Header 컴포넌트
 * Sticky + Blur 효과 헤더
 */

import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface HeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  rightElement?: React.ReactNode;
}

export function Header({ title, subtitle, emoji, rightElement }: HeaderProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.titleRow}>
        <Text variant="display" color="primary">
          {title} {emoji}
        </Text>
        {rightElement}
      </View>
      {subtitle && (
        <Text variant="body" color="secondary">
          {subtitle}
        </Text>
      )}
    </View>
  );

  // Web에서는 BlurView가 제대로 작동하지 않을 수 있어서 fallback 처리
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webBlur as ViewStyle]}>
        {content}
      </View>
    );
  }

  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      {content}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  webBlur: {
    backgroundColor: 'rgba(240, 248, 255, 0.85)',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

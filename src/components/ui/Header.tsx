/**
 * 술렌다 Header 컴포넌트
 * Sticky + Glassmorphism Blur 효과 헤더
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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

  // Web에서는 CSS backdrop-filter 사용
  if (Platform.OS === 'web') {
    // Web용 인라인 스타일로 backdrop-filter 적용
    const webStyle = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(12px) saturate(120%)',
      WebkitBackdropFilter: 'blur(12px) saturate(120%)',
    };

    return (
      <div style={webStyle as React.CSSProperties}>
        {content}
      </div>
    );
  }

  return (
    <BlurView intensity={60} tint="light" style={styles.container}>
      <View style={styles.blurOverlay} />
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
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 248, 255, 0.5)',
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

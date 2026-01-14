/**
 * 술렌다 타이포그래피 시스템
 * Geometric Sans-serif 스타일
 */

import { TextStyle } from 'react-native';

export const typography = {
  // Display - 큰 제목
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  } as TextStyle,

  // Heading - 섹션 제목
  heading: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  } as TextStyle,

  // Title - 카드/항목 제목
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  // Body - 본문
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  // Caption - 설명, 라벨
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  // Small - 작은 텍스트
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,
} as const;

export type Typography = typeof typography;

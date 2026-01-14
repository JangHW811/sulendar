/**
 * 술렌다 컬러 시스템
 * 소프트 블루 그라데이션 기반 미니멀 디자인
 */

export const colors = {
  // Primary - 메인 블루 계열
  primary: {
    light: '#C4E4F5',
    main: '#7EC8E8',
    dark: '#5BA8C8',
    gradient: ['#A8D4F0', '#7EC8E8'] as const,
  },

  // Background
  background: {
    primary: '#F0F8FF',
    secondary: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.85)',
    glass: 'rgba(255, 255, 255, 0.6)',
  },

  // Text
  text: {
    primary: '#0D1B2A',
    secondary: '#6B7B8C',
    muted: '#9AA5B1',
    inverse: '#FFFFFF',
  },

  // Accent
  accent: {
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
  },

  // Border & Divider
  border: {
    light: 'rgba(0, 0, 0, 0.06)',
    default: 'rgba(0, 0, 0, 0.1)',
  },

  // Drink type colors (주종별 컬러)
  drinks: {
    soju: '#4ADE80',      // 초록 - 소주
    beer: '#FBBF24',      // 노랑 - 맥주
    wine: '#F87171',      // 빨강 - 와인
    whiskey: '#C084FC',   // 보라 - 위스키
    makgeolli: '#F5F5DC', // 베이지 - 막걸리
    etc: '#94A3B8',       // 그레이 - 기타
  },
} as const;

export type Colors = typeof colors;

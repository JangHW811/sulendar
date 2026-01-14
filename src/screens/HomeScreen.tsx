/**
 * 술렌다 - 홈 화면 (캘린더 뷰)
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Card, Calendar, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { DRINK_INFO, DrinkLog } from '../types';

// 목업 데이터
const MOCK_LOGS: DrinkLog[] = [
  { id: '1', userId: 'u1', date: '2026-01-10', drinkType: 'soju', amount: 1, volumeMl: 360, createdAt: '' },
  { id: '2', userId: 'u1', date: '2026-01-10', drinkType: 'beer', amount: 2, volumeMl: 1000, createdAt: '' },
  { id: '3', userId: 'u1', date: '2026-01-08', drinkType: 'wine', amount: 0.5, volumeMl: 375, createdAt: '' },
  { id: '4', userId: 'u1', date: '2026-01-05', drinkType: 'soju', amount: 2, volumeMl: 720, createdAt: '' },
  { id: '5', userId: 'u1', date: '2026-01-14', drinkType: 'beer', amount: 1, volumeMl: 500, createdAt: '' },
];

interface Props {
  onAddDrink?: () => void;
}

export function HomeScreen({ onAddDrink }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // 선택된 날짜의 기록
  const selectedLogs = useMemo(() => {
    return MOCK_LOGS.filter((log) => log.date === selectedDate);
  }, [selectedDate]);

  // 마킹된 날짜들
  const markedDates = useMemo(() => {
    const marks: Record<string, { marked: boolean; color: string }> = {};
    MOCK_LOGS.forEach((log) => {
      marks[log.date] = {
        marked: true,
        color: colors.drinks[log.drinkType],
      };
    });
    return marks;
  }, []);

  // 이번 주 통계
  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekLogs = MOCK_LOGS.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek;
    });

    const totalMl = weekLogs.reduce((sum, log) => sum + log.volumeMl, 0);
    const drinkDays = new Set(weekLogs.map((log) => log.date)).size;

    return { totalMl, drinkDays, totalLogs: weekLogs.length };
  }, []);

  return (
    <LinearGradient
      colors={[colors.background.primary, '#E8F4FC']}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" />

      {/* Sticky Header */}
      <Header
        title="술렌다"
        emoji="🍺"
        subtitle="오늘도 건강한 음주 생활!"
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 이번 주 요약 */}
        <Card style={styles.summaryCard}>
          <Text variant="title" color="primary" style={styles.summaryTitle}>
            이번 주 요약
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="display" color="primary">
                {weekStats.drinkDays}
              </Text>
              <Text variant="caption" color="secondary">
                음주일
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text variant="display" color="primary">
                {(weekStats.totalMl / 1000).toFixed(1)}L
              </Text>
              <Text variant="caption" color="secondary">
                총 음주량
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text variant="display" color="primary">
                {7 - weekStats.drinkDays}
              </Text>
              <Text variant="caption" color="secondary">
                금주일
              </Text>
            </View>
          </View>
        </Card>

        {/* 캘린더 */}
        <Calendar
          selectedDate={selectedDate}
          markedDates={markedDates}
          onSelectDate={setSelectedDate}
        />

        {/* 선택된 날짜 기록 */}
        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <Text variant="title" color="primary">
              {selectedDate === today ? '오늘' : selectedDate.slice(5).replace('-', '/')} 기록
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddDrink}
              activeOpacity={0.7}
            >
              <Text variant="body" color="inverse">+ 추가</Text>
            </TouchableOpacity>
          </View>

          {selectedLogs.length === 0 ? (
            <Card variant="glass" style={styles.emptyCard}>
              <Text variant="body" color="secondary" center>
                기록이 없어요 ✨
              </Text>
              <Text variant="caption" color="muted" center>
                {selectedDate === today
                  ? '오늘은 금주하셨군요!'
                  : '이 날은 술을 안 마셨어요'}
              </Text>
            </Card>
          ) : (
            selectedLogs.map((log) => (
              <Card key={log.id} style={styles.logCard}>
                <View style={styles.logRow}>
                  <View
                    style={[
                      styles.logIcon,
                      { backgroundColor: `${colors.drinks[log.drinkType]}20` },
                    ]}
                  >
                    <Text style={styles.logEmoji}>
                      {DRINK_INFO[log.drinkType].icon}
                    </Text>
                  </View>
                  <View style={styles.logInfo}>
                    <Text variant="title" color="primary">
                      {DRINK_INFO[log.drinkType].label}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {log.amount}병 ({log.volumeMl}ml)
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 120, // Header 높이만큼 여백
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  summaryTitle: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.default,
  },
  logsSection: {
    marginTop: spacing.lg,
  },
  logsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  emptyCard: {
    padding: spacing.xl,
    gap: spacing.xs,
  },
  logCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logEmoji: {
    fontSize: 24,
  },
  logInfo: {
    flex: 1,
    gap: spacing.xs,
  },
});

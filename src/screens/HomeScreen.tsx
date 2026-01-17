import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Card, Calendar, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { DRINK_INFO } from '../types';
import { useDrinkLogsByMonth, useDeleteDrinkLog } from '../hooks';

interface Props {
  onAddDrink?: (selectedDate: string) => void;
}

export function HomeScreen({ onAddDrink }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  const now = new Date();
  const { data: logs = [], isLoading } = useDrinkLogsByMonth(
    now.getFullYear(),
    now.getMonth() + 1
  );
  
  const deleteMutation = useDeleteDrinkLog();

  const selectedLogs = useMemo(() => {
    return logs.filter((log) => log.date === selectedDate);
  }, [logs, selectedDate]);

  const markedDates = useMemo(() => {
    // 날짜별로 주종별 음주량 집계
    const dateStats: Record<string, Record<string, number>> = {};
    
    logs.forEach((log) => {
      if (!dateStats[log.date]) {
        dateStats[log.date] = {};
      }
      if (!dateStats[log.date][log.drinkType]) {
        dateStats[log.date][log.drinkType] = 0;
      }
      dateStats[log.date][log.drinkType] += log.volumeMl;
    });

    // 날짜별로 상위 3개 주종 색상 추출
    const marks: Record<string, { marked: boolean; colors: string[] }> = {};
    
    Object.entries(dateStats).forEach(([date, drinkTotals]) => {
      const sortedDrinks = Object.entries(drinkTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([drinkType]) => colors.drinks[drinkType as keyof typeof colors.drinks]);
      
      marks[date] = {
        marked: true,
        colors: sortedDrinks,
      };
    });

    return marks;
  }, [logs]);

  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek;
    });

    const totalMl = weekLogs.reduce((sum, log) => sum + log.volumeMl, 0);
    // 날짜를 YYYY-MM-DD 형식으로 정규화하여 중복 제거 (같은 날 여러 주종 = 1일)
    const drinkDays = new Set(weekLogs.map((log) => log.date.split('T')[0])).size;

    return { totalMl, drinkDays };
  }, [logs]);

  const handleDeleteLog = (logId: string) => {
    deleteMutation.mutate(logId);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.background.primary, '#ECFDF5']}
        style={[styles.gradient, styles.loadingContainer]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background.primary, '#ECFDF5']}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" />

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

        <Calendar
          selectedDate={selectedDate}
          markedDates={markedDates}
          onSelectDate={setSelectedDate}
        />

        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <Text variant="title" color="primary">
              {selectedDate === today ? '오늘' : selectedDate.slice(5).replace('-', '/')} 기록
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAddDrink?.(selectedDate)}
              activeOpacity={0.7}
            >
              <Text variant="body" color="inverse">+ 추가</Text>
            </TouchableOpacity>
          </View>

          {selectedLogs.length === 0 ? (
            <Card variant="glass" style={styles.emptyCard}>
              <Text variant="body" color="secondary" center>
                기록이 없어요
              </Text>
              <Text variant="caption" color="muted" center>
                {selectedDate === today
                  ? '오늘은 금주하셨군요!'
                  : '이 날은 술을 안 마셨어요'}
              </Text>
            </Card>
          ) : (
            selectedLogs.map((log) => (
              <TouchableOpacity
                key={log.id}
                onLongPress={() => handleDeleteLog(log.id)}
                activeOpacity={0.8}
              >
                <Card style={styles.logCard}>
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
              </TouchableOpacity>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 120,
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

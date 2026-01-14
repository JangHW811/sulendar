import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { DRINK_INFO, DrinkLog } from '../types';
import { useAuth } from '../context';
import { drinkLogsService } from '../services';

interface Props {
  onAddDrink?: () => void;
}

export function HomeScreen({ onAddDrink }: Props) {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMonthLogs = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const monthLogs = await drinkLogsService.getByMonth(
        user.id,
        now.getFullYear(),
        now.getMonth() + 1
      );
      setLogs(monthLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMonthLogs();
  }, [loadMonthLogs]);

  const selectedLogs = useMemo(() => {
    return logs.filter((log) => log.date === selectedDate);
  }, [logs, selectedDate]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked: boolean; color: string }> = {};
    logs.forEach((log) => {
      marks[log.date] = {
        marked: true,
        color: colors.drinks[log.drinkType],
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
    const drinkDays = new Set(weekLogs.map((log) => log.date)).size;

    return { totalMl, drinkDays, totalLogs: weekLogs.length };
  }, [logs]);

  const handleDeleteLog = async (logId: string) => {
    try {
      await drinkLogsService.delete(logId);
      setLogs((prev) => prev.filter((log) => log.id !== logId));
    } catch (error) {
      console.error('Failed to delete log:', error);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.background.primary, '#E8F4FC']}
        style={[styles.gradient, styles.loadingContainer]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background.primary, '#E8F4FC']}
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
              onPress={onAddDrink}
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

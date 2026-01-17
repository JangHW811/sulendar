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
import { Text, Card, BarChart, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { DRINK_INFO, DrinkType } from '../types';
import { useDrinkLogsByDateRange } from '../hooks';

type Period = 'week' | 'month';

export function StatsScreen() {
  const [period, setPeriod] = useState<Period>('week');

  const now = new Date();
  const startDate = new Date();
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setDate(now.getDate() - 30);
  }

  const { data: logs = [], isLoading } = useDrinkLogsByDateRange(
    startDate.toISOString().split('T')[0],
    now.toISOString().split('T')[0]
  );

  const totalStats = useMemo(() => {
    const totalMl = logs.reduce((sum, log) => sum + log.volumeMl, 0);
    const drinkDays = new Set(logs.map((log) => log.date)).size;
    const totalAlcohol = logs.reduce((sum, log) => {
      const info = DRINK_INFO[log.drinkType];
      return sum + (log.volumeMl * info.alcoholPercent / 100);
    }, 0);

    return { totalMl, drinkDays, totalAlcohol: Math.round(totalAlcohol) };
  }, [logs]);

  const weeklyData = useMemo(() => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayTotals = days.map(() => 0);

    logs.forEach((log) => {
      const dayOfWeek = new Date(log.date).getDay();
      dayTotals[dayOfWeek] += log.volumeMl;
    });

    return days.map((label, index) => ({
      label,
      value: dayTotals[index],
      color: dayTotals[index] > 500 ? colors.accent.warning : colors.primary.main,
    }));
  }, [logs]);

  const drinkTypeStats = useMemo(() => {
    const totals: Record<DrinkType, number> = {
      soju: 0,
      beer: 0,
      wine: 0,
      whiskey: 0,
      makgeolli: 0,
      etc: 0,
    };

    logs.forEach((log) => {
      totals[log.drinkType] += log.volumeMl;
    });

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(totals)
      .filter(([_, ml]) => ml > 0)
      .map(([type, ml]) => ({
        type: type as DrinkType,
        ml,
        percent: Math.round((ml / grandTotal) * 100),
      }))
      .sort((a, b) => b.ml - a.ml);
  }, [logs]);

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

      <Header title="통계" emoji="📊" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'week' && styles.periodButtonActive,
            ]}
            onPress={() => setPeriod('week')}
          >
            <Text
              variant="body"
              color={period === 'week' ? 'inverse' : 'secondary'}
            >
              이번 주
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setPeriod('month')}
          >
            <Text
              variant="body"
              color={period === 'month' ? 'inverse' : 'secondary'}
            >
              이번 달
            </Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="caption" color="secondary">총 음주량</Text>
              <Text variant="heading" color="primary">
                {(totalStats.totalMl / 1000).toFixed(1)}L
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" color="secondary">음주일</Text>
              <Text variant="heading" color="primary">
                {totalStats.drinkDays}일
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" color="secondary">순 알코올</Text>
              <Text variant="heading" color="primary">
                {totalStats.totalAlcohol}ml
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text variant="title" color="primary" style={styles.cardTitle}>
            요일별 음주량
          </Text>
          <BarChart data={weeklyData} height={120} />
        </Card>

        <Card style={styles.chartCard}>
          <Text variant="title" color="primary" style={styles.cardTitle}>
            주종별 비율
          </Text>
          <View style={styles.drinkTypeList}>
            {drinkTypeStats.length === 0 ? (
              <Text variant="body" color="secondary" center>
                데이터가 없어요
              </Text>
            ) : (
              drinkTypeStats.map((item) => (
                <View key={item.type} style={styles.drinkTypeItem}>
                  <View style={styles.drinkTypeLeft}>
                    <Text style={styles.drinkTypeIcon}>
                      {DRINK_INFO[item.type].icon}
                    </Text>
                    <Text variant="body" color="primary">
                      {DRINK_INFO[item.type].label}
                    </Text>
                  </View>
                  <View style={styles.drinkTypeRight}>
                    <View style={styles.percentBarContainer}>
                      <View
                        style={[
                          styles.percentBar,
                          {
                            width: `${item.percent}%`,
                            backgroundColor: colors.drinks[item.type],
                          },
                        ]}
                      />
                    </View>
                    <Text variant="caption" color="secondary" style={styles.percentText}>
                      {item.percent}%
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </Card>

        <Card variant="glass" style={styles.tipCard}>
          <Text variant="title" color="primary">건강 팁</Text>
          <Text variant="body" color="secondary" style={styles.tipText}>
            {totalStats.drinkDays >= 4
              ? '이번 주 음주일이 많아요. 간에게 휴식을 주세요!'
              : totalStats.totalMl > 2000
              ? '음주량이 많은 편이에요. 천천히 줄여보는 건 어떨까요?'
              : '좋은 음주 습관을 유지하고 계시네요!'}
          </Text>
        </Card>
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
    paddingTop: 100,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  periodButtonActive: {
    backgroundColor: colors.primary.main,
  },
  summaryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  chartCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  drinkTypeList: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  drinkTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drinkTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  drinkTypeIcon: {
    fontSize: 24,
  },
  drinkTypeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.lg,
  },
  percentBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  percentBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  percentText: {
    width: 36,
    textAlign: 'right',
  },
  tipCard: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  tipText: {
    lineHeight: 22,
  },
});

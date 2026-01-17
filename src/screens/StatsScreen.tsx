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
import {
  SojuIcon,
  BeerIcon,
  WineIcon,
  WhiskeyIcon,
  MakgeolliIcon,
  EtcDrinkIcon,
} from '../components/ui';

type Period = 'week' | 'month';

const DrinkIcons: Record<DrinkType, React.ComponentType<{ size?: number; color?: string }>> = {
  soju: SojuIcon,
  beer: BeerIcon,
  wine: WineIcon,
  whiskey: WhiskeyIcon,
  makgeolli: MakgeolliIcon,
  etc: EtcDrinkIcon,
};

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function StatsScreen() {
  const [period, setPeriod] = useState<Period>('week');

  // 이번 주: 이번 주 월요일 ~ 오늘
  // 이번 달: 이번 달 1일 ~ 오늘
  const now = new Date();
  const startDate = useMemo(() => {
    const date = new Date();
    if (period === 'week') {
      const day = date.getDay();
      const diff = day === 0 ? 6 : day - 1; // 월요일 기준
      date.setDate(date.getDate() - diff);
    } else {
      date.setDate(1);
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }, [period]);

  const { data: logs = [], isLoading } = useDrinkLogsByDateRange(
    startDate.toISOString().split('T')[0],
    now.toISOString().split('T')[0]
  );

  // 총 통계
  const totalStats = useMemo(() => {
    const totalMl = logs.reduce((sum, log) => sum + log.volumeMl, 0);
    const drinkDays = new Set(logs.map((log) => log.date)).size;
    const totalAlcohol = logs.reduce((sum, log) => {
      const info = DRINK_INFO[log.drinkType];
      return sum + (log.volumeMl * info.alcoholPercent / 100);
    }, 0);

    return { totalMl, drinkDays, totalAlcohol: Math.round(totalAlcohol) };
  }, [logs]);

  // 이번 주: 요일별 음주량 (월~일)
  const weeklyData = useMemo(() => {
    const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // 월~일 순서
    const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    const dayTotals = new Array(7).fill(0);

    logs.forEach((log) => {
      const dayOfWeek = new Date(log.date).getDay();
      const index = dayOrder.indexOf(dayOfWeek);
      if (index !== -1) {
        dayTotals[index] += log.volumeMl;
      }
    });

    const maxValue = Math.max(...dayTotals, 1);
    
    return dayLabels.map((label, index) => ({
      label,
      value: dayTotals[index],
      color: dayTotals[index] > maxValue * 0.7 ? colors.accent.warning : colors.primary.main,
    }));
  }, [logs]);

  // 이번 달: 가장 많이 마신 요일
  const mostDrinkDay = useMemo(() => {
    const dayTotals = new Array(7).fill(0);
    const dayCounts = new Array(7).fill(0);

    logs.forEach((log) => {
      const dayOfWeek = new Date(log.date).getDay();
      dayTotals[dayOfWeek] += log.volumeMl;
      dayCounts[dayOfWeek]++;
    });

    // 평균으로 계산 (해당 요일이 여러 번 있을 수 있으므로)
    const dayAverages = dayTotals.map((total, i) => 
      dayCounts[i] > 0 ? total / dayCounts[i] : 0
    );

    const maxIndex = dayAverages.indexOf(Math.max(...dayAverages));
    const maxAvg = dayAverages[maxIndex];

    if (maxAvg === 0) return null;

    return {
      day: DAY_NAMES[maxIndex],
      averageMl: Math.round(maxAvg),
      totalMl: dayTotals[maxIndex],
    };
  }, [logs]);

  // 주종별 통계
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

  // 가장 많이 마신 주종
  const topDrink = drinkTypeStats.length > 0 ? drinkTypeStats[0] : null;

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

      <Header title="통계" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 기간 선택 */}
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

        {/* 요약 카드 */}
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

        {period === 'week' ? (
          /* 이번 주: 요일별 음주량 차트 */
          <Card style={styles.chartCard}>
            <Text variant="title" color="primary" style={styles.cardTitle}>
              요일별 음주량
            </Text>
            {logs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="body" color="secondary" center>
                  이번 주 음주 기록이 없어요
                </Text>
              </View>
            ) : (
              <BarChart data={weeklyData} height={140} />
            )}
          </Card>
        ) : (
          <>
            {/* 이번 달: 가장 많이 마신 요일 */}
            <Card style={styles.chartCard}>
              <Text variant="title" color="primary" style={styles.cardTitle}>
                가장 많이 마신 요일
              </Text>
              {mostDrinkDay ? (
                <View style={styles.highlightContainer}>
                  <View style={styles.highlightBox}>
                    <Text variant="display" color="primary">
                      {mostDrinkDay.day}요일
                    </Text>
                    <Text variant="body" color="secondary">
                      평균 {(mostDrinkDay.averageMl / 1000).toFixed(1)}L
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text variant="body" color="secondary" center>
                    이번 달 음주 기록이 없어요
                  </Text>
                </View>
              )}
            </Card>

            {/* 이번 달: 가장 많이 마신 주종 */}
            <Card style={styles.chartCard}>
              <Text variant="title" color="primary" style={styles.cardTitle}>
                가장 많이 마신 주종
              </Text>
              {topDrink ? (
                <View style={styles.highlightContainer}>
                  <View style={[styles.highlightBox, styles.drinkHighlight]}>
                    <View style={styles.topDrinkIcon}>
                      {React.createElement(DrinkIcons[topDrink.type], { 
                        size: 48, 
                        color: colors.drinks[topDrink.type] 
                      })}
                    </View>
                    <Text variant="display" color="primary">
                      {DRINK_INFO[topDrink.type].label}
                    </Text>
                    <Text variant="body" color="secondary">
                      {(topDrink.ml / 1000).toFixed(1)}L ({topDrink.percent}%)
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text variant="body" color="secondary" center>
                    이번 달 음주 기록이 없어요
                  </Text>
                </View>
              )}
            </Card>
          </>
        )}

        {/* 주종별 비율 (공통) */}
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
                    <View style={styles.drinkTypeIcon}>
                      {React.createElement(DrinkIcons[item.type], { 
                        size: 24, 
                        color: colors.drinks[item.type] 
                      })}
                    </View>
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

        {/* 건강 팁 */}
        <Card variant="glass" style={styles.tipCard}>
          <Text variant="title" color="primary">건강 팁</Text>
          <Text variant="body" color="secondary" style={styles.tipText}>
            {totalStats.drinkDays >= 4
              ? '음주일이 많아요. 간에게 휴식을 주세요!'
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
  emptyState: {
    paddingVertical: spacing.xl,
  },
  highlightContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  highlightBox: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  drinkHighlight: {
    gap: spacing.sm,
  },
  topDrinkIcon: {
    marginBottom: spacing.xs,
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
    width: 28,
    alignItems: 'center',
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

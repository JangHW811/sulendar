import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Card, Button, AmountSelector, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context';
import { goalsService, drinkLogsService } from '../services';
import type { Goal } from '../types';

interface GoalState {
  weeklyLimit: {
    enabled: boolean;
    bottles: number;
    goalId: string | null;
  };
  soberChallenge: {
    enabled: boolean;
    days: number;
    startDate: string | null;
    goalId: string | null;
  };
}

export function GoalsScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [weeklyUsed, setWeeklyUsed] = useState(0);
  const [goals, setGoals] = useState<GoalState>({
    weeklyLimit: {
      enabled: false,
      bottles: 5,
      goalId: null,
    },
    soberChallenge: {
      enabled: false,
      days: 7,
      startDate: null,
      goalId: null,
    },
  });

  const loadGoals = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const activeGoals = await goalsService.getActive(user.id);
      
      const weeklyGoal = activeGoals.find((g) => g.type === 'weekly_limit');
      const soberGoal = activeGoals.find((g) => g.type === 'sober_challenge');

      setGoals({
        weeklyLimit: {
          enabled: !!weeklyGoal,
          bottles: weeklyGoal?.targetValue || 5,
          goalId: weeklyGoal?.id || null,
        },
        soberChallenge: {
          enabled: !!soberGoal,
          days: soberGoal?.targetValue || 7,
          startDate: soberGoal?.startDate || null,
          goalId: soberGoal?.id || null,
        },
      });

      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const weekLogs = await drinkLogsService.getByDateRange(
        user.id,
        startOfWeek.toISOString().split('T')[0],
        now.toISOString().split('T')[0]
      );
      const totalBottles = weekLogs.reduce((sum, log) => sum + log.amount, 0);
      setWeeklyUsed(totalBottles);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (goals.weeklyLimit.enabled) {
        if (goals.weeklyLimit.goalId) {
          await goalsService.update(goals.weeklyLimit.goalId, {
            targetValue: goals.weeklyLimit.bottles,
          });
        } else {
          const newGoal = await goalsService.create({
            userId: user.id,
            type: 'weekly_limit',
            targetValue: goals.weeklyLimit.bottles,
            startDate: new Date().toISOString().split('T')[0],
          });
          setGoals((prev) => ({
            ...prev,
            weeklyLimit: { ...prev.weeklyLimit, goalId: newGoal.id },
          }));
        }
      } else if (goals.weeklyLimit.goalId) {
        await goalsService.deactivate(goals.weeklyLimit.goalId);
        setGoals((prev) => ({
          ...prev,
          weeklyLimit: { ...prev.weeklyLimit, goalId: null },
        }));
      }

      if (goals.soberChallenge.enabled) {
        if (goals.soberChallenge.goalId) {
          await goalsService.update(goals.soberChallenge.goalId, {
            targetValue: goals.soberChallenge.days,
          });
        } else {
          const startDate = new Date().toISOString().split('T')[0];
          const newGoal = await goalsService.create({
            userId: user.id,
            type: 'sober_challenge',
            targetValue: goals.soberChallenge.days,
            startDate,
          });
          setGoals((prev) => ({
            ...prev,
            soberChallenge: {
              ...prev.soberChallenge,
              goalId: newGoal.id,
              startDate,
            },
          }));
        }
      } else if (goals.soberChallenge.goalId) {
        await goalsService.deactivate(goals.soberChallenge.goalId);
        setGoals((prev) => ({
          ...prev,
          soberChallenge: { ...prev.soberChallenge, goalId: null, startDate: null },
        }));
      }

      const isWeb = typeof window !== 'undefined' && !('ReactNativeWebView' in window);
      if (isWeb) {
        window.alert('목표가 저장되었습니다.');
      } else {
        Alert.alert('저장 완료', '목표가 저장되었습니다.');
      }
    } catch (error: any) {
      const isWeb = typeof window !== 'undefined' && !('ReactNativeWebView' in window);
      const message = error.message || '다시 시도해주세요';
      if (isWeb) {
        window.alert(`저장 실패: ${message}`);
      } else {
        Alert.alert('저장 실패', message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleWeeklyLimit = () => {
    setGoals((prev) => ({
      ...prev,
      weeklyLimit: { ...prev.weeklyLimit, enabled: !prev.weeklyLimit.enabled },
    }));
  };

  const toggleSoberChallenge = () => {
    setGoals((prev) => ({
      ...prev,
      soberChallenge: {
        ...prev.soberChallenge,
        enabled: !prev.soberChallenge.enabled,
        startDate: !prev.soberChallenge.enabled
          ? new Date().toISOString().split('T')[0]
          : prev.soberChallenge.startDate,
      },
    }));
  };

  const getSoberDays = () => {
    if (!goals.soberChallenge.startDate) return 0;
    const start = new Date(goals.soberChallenge.startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const soberDays = getSoberDays();
  const soberProgress = Math.min(100, (soberDays / goals.soberChallenge.days) * 100);
  const weeklyProgress = Math.min(100, (weeklyUsed / goals.weeklyLimit.bottles) * 100);

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
        title="목표"
        emoji="🎯"
        subtitle="건강한 음주 습관을 만들어요"
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleRow}>
              <Text style={styles.goalIcon}>🍶</Text>
              <View>
                <Text variant="title" color="primary">주간 음주 제한</Text>
                <Text variant="caption" color="secondary">
                  일주일 최대 음주량 설정
                </Text>
              </View>
            </View>
            <Switch
              value={goals.weeklyLimit.enabled}
              onValueChange={toggleWeeklyLimit}
              trackColor={{ false: colors.border.default, true: colors.primary.light }}
              thumbColor={goals.weeklyLimit.enabled ? colors.primary.main : '#f4f3f4'}
            />
          </View>

          {goals.weeklyLimit.enabled && (
            <View style={styles.goalContent}>
              <View style={styles.divider} />
              <Text variant="body" color="secondary" center style={styles.goalLabel}>
                주간 최대
              </Text>
              <AmountSelector
                value={goals.weeklyLimit.bottles}
                unit="병"
                min={1}
                max={20}
                step={1}
                onChange={(value) =>
                  setGoals((prev) => ({
                    ...prev,
                    weeklyLimit: { ...prev.weeklyLimit, bottles: value },
                  }))
                }
              />
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${weeklyProgress}%` },
                    ]}
                  />
                </View>
                <Text variant="caption" color="secondary">
                  이번 주: {weeklyUsed}병 / {goals.weeklyLimit.bottles}병
                </Text>
              </View>
            </View>
          )}
        </Card>

        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleRow}>
              <Text style={styles.goalIcon}>🏆</Text>
              <View>
                <Text variant="title" color="primary">금주 챌린지</Text>
                <Text variant="caption" color="secondary">
                  연속 금주일 도전
                </Text>
              </View>
            </View>
            <Switch
              value={goals.soberChallenge.enabled}
              onValueChange={toggleSoberChallenge}
              trackColor={{ false: colors.border.default, true: colors.primary.light }}
              thumbColor={goals.soberChallenge.enabled ? colors.primary.main : '#f4f3f4'}
            />
          </View>

          {goals.soberChallenge.enabled && (
            <View style={styles.goalContent}>
              <View style={styles.divider} />
              
              <View style={styles.challengeStatus}>
                <View style={styles.dDayBadge}>
                  <Text variant="small" color="inverse">D+{soberDays}</Text>
                </View>
                <Text variant="heading" color="primary">
                  {soberDays}일째 금주 중!
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      styles.progressSuccess,
                      { width: `${soberProgress}%` },
                    ]}
                  />
                </View>
                <Text variant="caption" color="secondary">
                  목표: {goals.soberChallenge.days}일 ({Math.round(soberProgress)}% 달성)
                </Text>
              </View>

              <View style={styles.targetDaysRow}>
                <Text variant="body" color="secondary">목표 일수</Text>
                <View style={styles.targetDaysButtons}>
                  {[7, 14, 30].map((days) => (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.targetDayButton,
                        goals.soberChallenge.days === days && styles.targetDayButtonActive,
                      ]}
                      onPress={() =>
                        setGoals((prev) => ({
                          ...prev,
                          soberChallenge: { ...prev.soberChallenge, days },
                        }))
                      }
                    >
                      <Text
                        variant="caption"
                        color={goals.soberChallenge.days === days ? 'inverse' : 'primary'}
                      >
                        {days}일
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </Card>

        <Card variant="glass" style={styles.motivationCard}>
          <Text variant="title" color="primary">오늘의 동기부여</Text>
          <Text variant="body" color="secondary" style={styles.motivationText}>
            "작은 변화가 큰 차이를 만듭니다. 오늘 하루도 건강한 선택을 응원해요!"
          </Text>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '목표 저장하기'}
        </Button>
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
  goalCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  goalIcon: {
    fontSize: 32,
  },
  goalContent: {
    marginTop: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginBottom: spacing.md,
  },
  goalLabel: {
    marginBottom: spacing.sm,
  },
  progressContainer: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
  },
  progressSuccess: {
    backgroundColor: colors.accent.success,
  },
  challengeStatus: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dDayBadge: {
    backgroundColor: colors.accent.success,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  targetDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  targetDaysButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  targetDayButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.glass,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  targetDayButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  motivationCard: {
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  motivationText: {
    lineHeight: 22,
    fontStyle: 'italic',
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});

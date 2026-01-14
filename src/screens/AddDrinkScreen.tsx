/**
 * 술렌다 - 음주 기록 추가 화면
 * 프로토타입 페이지
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Text,
  Button,
  ProgressBar,
  DrinkCard,
  AmountSelector,
  Card,
} from '../components/ui';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { DrinkType } from '../components/ui';

type Step = 'select-drink' | 'select-amount';

interface DrinkOption {
  type: DrinkType;
  label: string;
  icon: string;
}

const drinkOptions: DrinkOption[] = [
  { type: 'soju', label: '소주', icon: '🍶' },
  { type: 'beer', label: '맥주', icon: '🍺' },
  { type: 'wine', label: '와인', icon: '🍷' },
  { type: 'whiskey', label: '위스키', icon: '🥃' },
  { type: 'makgeolli', label: '막걸리', icon: '🍵' },
  { type: 'etc', label: '기타', icon: '🍸' },
];

export function AddDrinkScreen() {
  const [step, setStep] = useState<Step>('select-drink');
  const [selectedDrink, setSelectedDrink] = useState<DrinkType | null>(null);
  const [amount, setAmount] = useState(1);

  const currentStep = step === 'select-drink' ? 1 : 2;
  const totalSteps = 2;

  const handleNext = () => {
    if (step === 'select-drink' && selectedDrink) {
      setStep('select-amount');
    } else if (step === 'select-amount') {
      // TODO: 저장 로직
      console.log('저장:', { drink: selectedDrink, amount });
    }
  };

  const handleBack = () => {
    if (step === 'select-amount') {
      setStep('select-drink');
    }
  };

  const getSelectedDrinkLabel = () => {
    return drinkOptions.find((d) => d.type === selectedDrink)?.label || '';
  };

  return (
    <LinearGradient
      colors={[colors.background.primary, '#E8F4FC']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <ProgressBar current={currentStep} total={totalSteps} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {step === 'select-drink' ? (
            <>
              {/* Question */}
              <View style={styles.questionContainer}>
                <Text variant="display" color="primary" center>
                  오늘 뭐 마셨어요?
                </Text>
                <Text variant="body" color="secondary" center>
                  마신 주종을 선택해주세요
                </Text>
              </View>

              {/* Drink Grid */}
              <View style={styles.grid}>
                {drinkOptions.map((drink) => (
                  <View key={drink.type} style={styles.gridItem}>
                    <DrinkCard
                      type={drink.type}
                      label={drink.label}
                      icon={drink.icon}
                      selected={selectedDrink === drink.type}
                      onPress={() => setSelectedDrink(drink.type)}
                    />
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Question */}
              <View style={styles.questionContainer}>
                <Text variant="display" color="primary" center>
                  얼마나 마셨어요?
                </Text>
                <Text variant="body" color="secondary" center>
                  {getSelectedDrinkLabel()} 몇 병 드셨나요?
                </Text>
              </View>

              {/* Amount Card */}
              <Card variant="glass" padding="lg" style={styles.amountCard}>
                <View style={styles.selectedDrinkPreview}>
                  <Text style={styles.bigEmoji}>
                    {drinkOptions.find((d) => d.type === selectedDrink)?.icon}
                  </Text>
                  <Text variant="title" color="primary">
                    {getSelectedDrinkLabel()}
                  </Text>
                </View>

                <AmountSelector
                  value={amount}
                  unit="병"
                  min={0.5}
                  max={20}
                  step={0.5}
                  onChange={setAmount}
                />
              </Card>
            </>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {step === 'select-amount' && (
              <Button variant="secondary" size="lg" onPress={handleBack}>
                이전
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              fullWidth={step === 'select-drink'}
              onPress={handleNext}
              disabled={step === 'select-drink' && !selectedDrink}
              style={step === 'select-amount' ? styles.flexButton : undefined}
            >
              {step === 'select-drink' ? '다음' : '저장하기'}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  questionContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
  },
  amountCard: {
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
  selectedDrinkPreview: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  bigEmoji: {
    fontSize: 64,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flexButton: {
    flex: 1,
  },
});

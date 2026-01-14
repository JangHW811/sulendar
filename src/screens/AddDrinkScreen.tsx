import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useAuth } from '../context';
import { drinkLogsService } from '../services';

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

interface Props {
  onClose?: () => void;
  selectedDate?: string;
}

export function AddDrinkScreen({ onClose, selectedDate }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('select-drink');
  const [selectedDrink, setSelectedDrink] = useState<DrinkType | null>(null);
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = step === 'select-drink' ? 1 : 2;
  const totalSteps = 2;

  const handleNext = async () => {
    if (step === 'select-drink' && selectedDrink) {
      setStep('select-amount');
    } else if (step === 'select-amount' && selectedDrink && user) {
      setIsLoading(true);
      try {
        const date = selectedDate || new Date().toISOString().split('T')[0];
        await drinkLogsService.create({
          userId: user.id,
          date,
          drinkType: selectedDrink,
          amount,
        });
        Alert.alert('저장 완료', '음주 기록이 저장되었습니다.', [
          { text: '확인', onPress: onClose },
        ]);
      } catch (error: any) {
        Alert.alert('저장 실패', error.message || '다시 시도해주세요');
      } finally {
        setIsLoading(false);
      }
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

        <View style={styles.header}>
          <ProgressBar current={currentStep} total={totalSteps} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {step === 'select-drink' ? (
            <>
              <View style={styles.questionContainer}>
                <Text variant="display" color="primary" center>
                  오늘 뭐 마셨어요?
                </Text>
                <Text variant="body" color="secondary" center>
                  마신 주종을 선택해주세요
                </Text>
              </View>

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
              <View style={styles.questionContainer}>
                <Text variant="display" color="primary" center>
                  얼마나 마셨어요?
                </Text>
                <Text variant="body" color="secondary" center>
                  {getSelectedDrinkLabel()} 몇 병 드셨나요?
                </Text>
              </View>

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
              disabled={(step === 'select-drink' && !selectedDrink) || isLoading}
              style={step === 'select-amount' ? styles.flexButton : undefined}
            >
              {isLoading ? '저장 중...' : step === 'select-drink' ? '다음' : '저장하기'}
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

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Text,
  Button,
  DrinkCard,
  AmountSelector,
} from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import type { DrinkType } from '../components/ui';
import { useCreateDrinkLog } from '../hooks';
import { DRINK_INFO } from '../types';

interface DrinkOption {
  type: DrinkType;
  label: string;
}

const drinkOptions: DrinkOption[] = [
  { type: 'soju', label: '소주' },
  { type: 'beer', label: '맥주' },
  { type: 'wine', label: '와인' },
  { type: 'whiskey', label: '위스키' },
  { type: 'makgeolli', label: '막걸리' },
  { type: 'etc', label: '기타' },
];

interface Props {
  onClose?: () => void;
  selectedDate?: string;
}

export function AddDrinkScreen({ onClose, selectedDate }: Props) {
  const [selectedDrink, setSelectedDrink] = useState<DrinkType | null>(null);
  const [amount, setAmount] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const currentScrollY = useRef(0);
  const contentHeight = useRef(0);
  const scrollViewHeight = useRef(0);

  const createMutation = useCreateDrinkLog();

  const smoothScrollToEnd = () => {
    const maxScroll = Math.max(0, contentHeight.current - scrollViewHeight.current);
    if (maxScroll <= 0) return;

    const startY = currentScrollY.current;
    const distance = maxScroll - startY;
    
    scrollY.setValue(0);
    Animated.timing(scrollY, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    scrollY.addListener(({ value }) => {
      const newY = startY + distance * value;
      scrollViewRef.current?.scrollTo({ y: newY, animated: false });
    });
  };

  const handleSelectDrink = (type: DrinkType) => {
    setSelectedDrink(type);
    // 주종 선택 시 수량 선택 영역으로 스무스 스크롤
    setTimeout(() => {
      smoothScrollToEnd();
    }, 300);
  };

  const handleSave = () => {
    if (!selectedDrink) return;
    
    const date = selectedDate || new Date().toISOString().split('T')[0];
    
    createMutation.mutate(
      { date, drinkType: selectedDrink, amount },
      {
        onSuccess: () => {
          const isWeb = typeof window !== 'undefined' && !('ReactNativeWebView' in window);
          if (isWeb) {
            window.alert('음주 기록이 저장되었습니다.');
            onClose?.();
          } else {
            Alert.alert('저장 완료', '음주 기록이 저장되었습니다.', [
              { text: '확인', onPress: onClose },
            ]);
          }
        },
        onError: (error: any) => {
          const isWeb = typeof window !== 'undefined' && !('ReactNativeWebView' in window);
          const message = error.message || '다시 시도해주세요';
          if (isWeb) {
            window.alert(`저장 실패: ${message}`);
          } else {
            Alert.alert('저장 실패', message);
          }
        },
      }
    );
  };

  const getSelectedDrinkLabel = () => {
    return drinkOptions.find((d) => d.type === selectedDrink)?.label || '';
  };

  return (
    <LinearGradient
      colors={[colors.background.primary, '#ECFDF5']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            currentScrollY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          onContentSizeChange={(w, h) => {
            contentHeight.current = h;
          }}
          onLayout={(e) => {
            scrollViewHeight.current = e.nativeEvent.layout.height;
          }}
        >
          {/* 주종 선택 */}
          <View style={styles.section}>
            <Text variant="title" color="primary">
              오늘 뭐 마셨어요?
            </Text>
            <View style={styles.grid}>
              {drinkOptions.map((drink) => (
                <View key={drink.type} style={styles.gridItem}>
                  <DrinkCard
                    type={drink.type}
                    label={drink.label}
                    icon=""
                    selected={selectedDrink === drink.type}
                    onPress={() => handleSelectDrink(drink.type)}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* 수량 선택 - 주종 선택 후 표시 */}
          {selectedDrink && (
            <View style={styles.section}>
              <Text variant="title" color="primary">
                {getSelectedDrinkLabel()} 얼마나 마셨어요?
              </Text>
              <View style={styles.amountContainer}>
                <AmountSelector
                  value={amount}
                  unit={DRINK_INFO[selectedDrink].unit}
                  min={0.5}
                  max={selectedDrink === 'whiskey' ? 30 : 20}
                  step={0.5}
                  onChange={setAmount}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSave}
            disabled={!selectedDrink || createMutation.isPending}
          >
            {createMutation.isPending ? '저장 중...' : '저장하기'}
          </Button>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
  },
  amountContainer: {
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

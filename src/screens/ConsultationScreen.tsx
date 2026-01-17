/**
 * 술렌다 - AI 건강 상담 화면
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Card, Button, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useDrinkLogsByDateRange } from '../hooks';
import { DRINK_INFO } from '../types';
import { useAuth } from '../context';
import { geminiService, ChatMessage } from '../services';
import {
  loadRewardedAd,
  showRewardedAd,
  isRewardedAdReady,
  isAdMobSupported,
} from '../services/admob';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ConsultationScreen() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [hasWatchedAd, setHasWatchedAd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // 앱 시작 시 광고 미리 로드
  useEffect(() => {
    if (isAdMobSupported()) {
      loadRewardedAd();
    }
  }, []);

  // 이번 주 음주 데이터 조회
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const { data: weekLogs = [] } = useDrinkLogsByDateRange(
    startOfWeek.toISOString().split('T')[0],
    now.toISOString().split('T')[0]
  );

  // 주간 요약 계산
  const weeklySummary = useMemo(() => {
    const totalMl = weekLogs.reduce((sum, log) => sum + log.volumeMl, 0);
    // 날짜를 YYYY-MM-DD 형식으로 정규화하여 중복 제거
    const drinkDays = new Set(weekLogs.map((log) => log.date.split('T')[0])).size;
    
    // 가장 많이 마신 주종 찾기
    const drinkTotals: Record<string, number> = {};
    weekLogs.forEach((log) => {
      drinkTotals[log.drinkType] = (drinkTotals[log.drinkType] || 0) + log.volumeMl;
    });
    
    const mainDrinkType = Object.entries(drinkTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;
    const mainDrink = mainDrinkType ? DRINK_INFO[mainDrinkType as keyof typeof DRINK_INFO]?.label : '없음';

    return { totalMl, drinkDays, mainDrink, logs: weekLogs };
  }, [weekLogs]);

  const startConsultation = () => {
    setHasWatchedAd(true);
    // 환영 메시지 추가
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `안녕하세요! 저는 술렌다 AI 건강 상담사입니다. 🏥\n\n이번 주 음주 기록을 분석해봤어요:\n• 총 음주량: ${(weeklySummary.totalMl / 1000).toFixed(1)}L\n• 음주일: ${weeklySummary.drinkDays}일\n• 주로 마신 술: ${weeklySummary.mainDrink}\n\n궁금한 점이 있으시면 편하게 물어보세요!`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleWatchAd = async () => {
    // 웹 환경에서는 AdMob 지원 안 함 - 바로 상담 시작
    if (!isAdMobSupported()) {
      // 웹에서는 2초 딜레이 후 상담 시작 (UX용)
      setAdLoading(true);
      setTimeout(() => {
        setAdLoading(false);
        startConsultation();
      }, 1500);
      return;
    }

    // 모바일: AdMob 리워드 광고 표시
    setAdLoading(true);

    try {
      // 광고가 준비되지 않았으면 로드
      if (!isRewardedAdReady()) {
        const loaded = await loadRewardedAd();
        if (!loaded) {
          Alert.alert(
            '광고 로드 실패',
            '광고를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
            [{ text: '확인' }]
          );
          setAdLoading(false);
          return;
        }
      }

      // 광고 표시
      const rewarded = await showRewardedAd();
      
      if (rewarded) {
        startConsultation();
      } else {
        Alert.alert(
          '광고 시청 필요',
          '광고를 끝까지 시청해야 상담을 받을 수 있어요.',
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      console.error('Ad error:', error);
      Alert.alert(
        '오류',
        '광고 표시 중 오류가 발생했습니다.',
        [{ text: '확인' }]
      );
    } finally {
      setAdLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Gemini API 호출
      const userContext = profile ? {
        weight: profile.weight ?? undefined,
        height: profile.height ?? undefined,
        name: profile.name ?? undefined,
      } : undefined;
      
      const response = await geminiService.chat(
        userText,
        conversationHistory,
        weeklySummary,
        userContext
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 대화 히스토리 업데이트 (Gemini API 형식)
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: response }] },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    '이번 주 음주량이 건강에 어떤 영향을 줄까요?',
    '숙취 해소에 좋은 방법이 있나요?',
    '음주량을 줄이려면 어떻게 해야 하나요?',
  ];

  return (
    <LinearGradient
      colors={[colors.background.primary, '#ECFDF5']}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" />

      {/* Sticky Header */}
      <Header
        title="AI 상담"
        subtitle="※ 의학적 조언이 아닌 참고 정보입니다"
      />

      {!hasWatchedAd ? (
        // 광고 시청 전 화면
        <View style={styles.adContainer}>
          <Card style={styles.adCard}>
            <Text style={styles.adIcon}>🎬</Text>
            <Text variant="heading" color="primary" center>
              무료 AI 상담받기
            </Text>
            <Text variant="body" color="secondary" center style={styles.adDescription}>
              짧은 광고를 시청하면{'\n'}AI 건강 상담을 무료로 받을 수 있어요!
            </Text>

            {/* 이번 주 요약 미리보기 */}
            <Card variant="glass" style={styles.previewCard}>
              <Text variant="caption" color="secondary">이번 주 음주 요약</Text>
              <View style={styles.previewRow}>
                <Text variant="title" color="primary">
                  {(weeklySummary.totalMl / 1000).toFixed(1)}L
                </Text>
                <Text variant="body" color="secondary">
                  / {weeklySummary.drinkDays}일
                </Text>
              </View>
            </Card>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleWatchAd}
              disabled={adLoading}
            >
              {adLoading ? '광고 로딩 중...' : '광고 보고 상담 시작하기'}
            </Button>

            {!isAdMobSupported() && (
              <Text variant="small" color="muted" center style={styles.webNotice}>
                웹에서는 광고 없이 바로 시작됩니다
              </Text>
            )}
          </Card>
        </View>
      ) : (
        // 채팅 화면
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text
                  variant="body"
                  color={message.role === 'user' ? 'inverse' : 'primary'}
                >
                  {message.content}
                </Text>
              </View>
            ))}

            {isLoading && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Text variant="body" color="secondary">
                  입력 중...
                </Text>
              </View>
            )}

            {/* 추천 질문 */}
            {messages.length <= 1 && (
              <View style={styles.suggestionsContainer}>
                <Text variant="caption" color="secondary" style={styles.suggestionsTitle}>
                  이런 질문을 해보세요
                </Text>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionButton}
                    onPress={() => setInputText(question)}
                  >
                    <Text variant="caption" color="primary">
                      {question}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* 입력 영역 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor={colors.text.muted}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <Text variant="body" color="inverse">
                전송
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  adContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
  },
  adCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  adIcon: {
    fontSize: 64,
  },
  adDescription: {
    lineHeight: 24,
  },
  previewCard: {
    width: '100%',
    padding: spacing.md,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  webNotice: {
    marginTop: spacing.sm,
  },
  chatContainer: {
    flex: 1,
    paddingTop: 100,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: spacing.xs,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.card,
    borderBottomLeftRadius: spacing.xs,
  },
  suggestionsContainer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  suggestionsTitle: {
    marginBottom: spacing.xs,
  },
  suggestionButton: {
    padding: spacing.md,
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    color: colors.text.primary,
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

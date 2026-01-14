/**
 * 술렌다 - AI 건강 상담 화면
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Card, Button, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 목업 데이터 - 이번 주 음주 요약
const WEEKLY_SUMMARY = {
  totalMl: 2160,
  drinkDays: 3,
  mainDrink: '소주',
  avgPerDay: 720,
};

export function ConsultationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [hasWatchedAd, setHasWatchedAd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleWatchAd = () => {
    // TODO: AdMob 리워드 광고 연동
    // 임시로 2초 후 광고 시청 완료 처리
    setIsLoading(true);
    setTimeout(() => {
      setHasWatchedAd(true);
      setIsLoading(false);
      // 환영 메시지 추가
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content: `안녕하세요! 저는 술렌다 AI 건강 상담사입니다. 🏥\n\n이번 주 음주 기록을 분석해봤어요:\n• 총 음주량: ${(WEEKLY_SUMMARY.totalMl / 1000).toFixed(1)}L\n• 음주일: ${WEEKLY_SUMMARY.drinkDays}일\n• 주로 마신 술: ${WEEKLY_SUMMARY.mainDrink}\n\n궁금한 점이 있으시면 편하게 물어보세요!`,
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // TODO: Gemini API 연동
    // 목업 응답
    setTimeout(() => {
      const responses = [
        '좋은 질문이에요! 이번 주 음주량을 보면, 하루 평균 알코올 섭취량이 권장량을 약간 초과하고 있어요. 간 건강을 위해 주 2-3일은 금주일로 두시는 것을 추천드려요.',
        '음주 후 충분한 수분 섭취와 휴식이 중요합니다. 물을 많이 마시고, 다음 날 가벼운 운동을 해보시는 건 어떨까요?',
        '체중과 음주량을 고려했을 때, 현재 페이스라면 건강에 큰 무리는 없지만, 장기적으로는 조금씩 줄여나가시는 것이 좋겠습니다.',
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const suggestedQuestions = [
    '이번 주 음주량이 건강에 어떤 영향을 줄까요?',
    '숙취 해소에 좋은 방법이 있나요?',
    '음주량을 줄이려면 어떻게 해야 하나요?',
  ];

  return (
    <LinearGradient
      colors={[colors.background.primary, '#E8F4FC']}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" />

      {/* Sticky Header */}
      <Header
        title="AI 상담"
        emoji="🤖"
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
                  {(WEEKLY_SUMMARY.totalMl / 1000).toFixed(1)}L
                </Text>
                <Text variant="body" color="secondary">
                  / {WEEKLY_SUMMARY.drinkDays}일
                </Text>
              </View>
            </Card>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleWatchAd}
              disabled={isLoading}
            >
              {isLoading ? '광고 로딩 중...' : '광고 보고 상담 시작하기'}
            </Button>
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

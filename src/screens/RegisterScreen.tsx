/**
 * 술렌다 - 회원가입 화면
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Input, Card } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  onRegister?: () => void;
  onNavigateToLogin?: () => void;
}

export function RegisterScreen({ onRegister, onNavigateToLogin }: Props) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    // TODO: Supabase Auth 연동
    setTimeout(() => {
      setIsLoading(false);
      onRegister?.();
    }, 1000);
  };

  return (
    <LinearGradient
      colors={[colors.background.primary, '#E8F4FC']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
                <Text variant="title" color="primary">← 뒤로</Text>
              </TouchableOpacity>
              <Text variant="display" color="primary">
                회원가입
              </Text>
              <Text variant="body" color="secondary">
                술렌다와 함께 건강한 음주 생활을 시작하세요
              </Text>
            </View>

            {/* Form */}
            <Card style={styles.formCard}>
              <Input
                label="이름"
                placeholder="홍길동"
                value={formData.name}
                onChangeText={(v) => updateField('name', v)}
                error={errors.name}
              />

              <Input
                label="이메일"
                placeholder="example@email.com"
                value={formData.email}
                onChangeText={(v) => updateField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="비밀번호"
                placeholder="6자 이상 입력"
                value={formData.password}
                onChangeText={(v) => updateField('password', v)}
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력"
                value={formData.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                secureTextEntry
                error={errors.confirmPassword}
              />

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleRegister}
                disabled={isLoading}
                style={styles.registerButton}
              >
                {isLoading ? '가입 중...' : '가입하기'}
              </Button>
            </Card>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text variant="body" color="secondary">
                이미 계정이 있으신가요?{' '}
              </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text variant="body" color="primary" style={styles.linkText}>
                  로그인
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  formCard: {
    padding: spacing.lg,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  linkText: {
    fontWeight: '600',
  },
});

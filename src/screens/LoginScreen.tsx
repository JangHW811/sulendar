/**
 * 술렌다 - 로그인 화면
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Input, Card } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

interface Props {
  onLogin?: () => void;
  onNavigateToRegister?: () => void;
}

export function LoginScreen({ onLogin, onNavigateToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    // TODO: Supabase Auth 연동
    setTimeout(() => {
      setIsLoading(false);
      onLogin?.();
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
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Logo & Title */}
          <View style={styles.header}>
            <Text style={styles.logo}>🍺</Text>
            <Text variant="display" color="primary" center>
              술렌다
            </Text>
            <Text variant="body" color="secondary" center>
              건강한 음주 생활의 시작
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <Input
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="비밀번호"
              placeholder="6자 이상 입력"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text variant="caption" color="muted" style={styles.dividerText}>
                또는
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text variant="body" color="primary">Google로 시작</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
                <Text style={styles.socialIcon}>💬</Text>
                <Text variant="body" color="primary">카카오로 시작</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text variant="body" color="secondary">
              계정이 없으신가요?{' '}
            </Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text variant="body" color="primary" style={styles.linkText}>
                회원가입
              </Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  formCard: {
    padding: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    marginHorizontal: spacing.md,
  },
  socialButtons: {
    gap: spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.secondary,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderColor: '#FEE500',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: '700',
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

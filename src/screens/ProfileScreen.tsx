import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Input, Card, Header } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context';

interface Props {
  onLogout?: () => void;
}

export function ProfileScreen({ onLogout }: Props) {
  const { user, profile, signOut, updateProfile, isLoading: authLoading } = useAuth();
  const [localProfile, setLocalProfile] = useState({
    name: '',
    email: '',
    weight: '',
    height: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        name: profile.name || '',
        email: profile.email || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
      });
    } else if (user) {
      setLocalProfile((prev) => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [profile, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: localProfile.name || undefined,
        weight: localProfile.weight ? Number(localProfile.weight) : undefined,
        height: localProfile.height ? Number(localProfile.height) : undefined,
      });
      setIsEditing(false);
      Alert.alert('저장 완료', '프로필이 업데이트되었습니다.');
    } catch (error: any) {
      Alert.alert('저장 실패', error.message || '다시 시도해주세요');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              onLogout?.();
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: '🔔', label: '알림 설정', onPress: () => {} },
    { icon: '📊', label: '데이터 내보내기', onPress: () => {} },
    { icon: '🔒', label: '개인정보 처리방침', onPress: () => {} },
    { icon: '📄', label: '이용약관', onPress: () => {} },
    { icon: '❓', label: '도움말', onPress: () => {} },
  ];

  const bmi = localProfile.weight && localProfile.height
    ? (Number(localProfile.weight) / Math.pow(Number(localProfile.height) / 100, 2)).toFixed(1)
    : '-';

  if (authLoading) {
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

      <Header title="프로필" emoji="👤" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(localProfile.name || localProfile.email || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="heading" color="primary">
                {localProfile.name || '이름 없음'}
              </Text>
              <Text variant="caption" color="secondary">{localProfile.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text variant="body" color="primary">
              {isEditing ? '취소' : '수정'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.bodyCard}>
          <Text variant="title" color="primary" style={styles.sectionTitle}>
            신체 정보
          </Text>
          <Text variant="caption" color="secondary" style={styles.sectionSubtitle}>
            AI 상담 시 정확한 분석에 사용됩니다
          </Text>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="이름"
                value={localProfile.name}
                onChangeText={(v) => setLocalProfile((p) => ({ ...p, name: v }))}
              />
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="체중 (kg)"
                    value={localProfile.weight}
                    onChangeText={(v) => setLocalProfile((p) => ({ ...p, weight: v }))}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="키 (cm)"
                    value={localProfile.height}
                    onChangeText={(v) => setLocalProfile((p) => ({ ...p, height: v }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장하기'}
              </Button>
            </View>
          ) : (
            <View style={styles.bodyStats}>
              <View style={styles.bodyStat}>
                <Text variant="caption" color="secondary">체중</Text>
                <Text variant="heading" color="primary">
                  {localProfile.weight ? `${localProfile.weight}kg` : '-'}
                </Text>
              </View>
              <View style={styles.bodyStatDivider} />
              <View style={styles.bodyStat}>
                <Text variant="caption" color="secondary">키</Text>
                <Text variant="heading" color="primary">
                  {localProfile.height ? `${localProfile.height}cm` : '-'}
                </Text>
              </View>
              <View style={styles.bodyStatDivider} />
              <View style={styles.bodyStat}>
                <Text variant="caption" color="secondary">BMI</Text>
                <Text variant="heading" color="primary">{bmi}</Text>
              </View>
            </View>
          )}
        </Card>

        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text variant="body" color="primary">{item.label}</Text>
              </View>
              <Text variant="body" color="muted">→</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          로그아웃
        </Button>

        <Text variant="caption" color="muted" center style={styles.version}>
          술렌다 v1.0.0
        </Text>
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
  profileCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  editButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  bodyCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: spacing.md,
  },
  bodyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyStat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  bodyStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.default,
  },
  editForm: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  menuCard: {
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  logoutButton: {
    marginBottom: spacing.md,
  },
  version: {
    marginTop: spacing.sm,
  },
});

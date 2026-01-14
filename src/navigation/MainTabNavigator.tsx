/**
 * 술렌다 - 메인 탭 네비게이터
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  StatsScreen,
  GoalsScreen,
  ConsultationScreen,
  ProfileScreen,
} from '../screens';
import { MainTabParamList } from './types';
import { colors } from '../theme/colors';
import { Text } from '../components/ui';
import { spacing } from '../theme/spacing';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface Props {
  onAddDrink: () => void;
  onLogout: () => void;
}

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
        {icon}
      </Text>
      <Text
        variant="small"
        color={focused ? 'primary' : 'muted'}
        style={focused && styles.tabLabelActive}
      >
        {label}
      </Text>
    </View>
  );
}

export function MainTabNavigator({ onAddDrink, onLogout }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="홈" focused={focused} />
          ),
        }}
      >
        {() => <HomeScreen onAddDrink={onAddDrink} />}
      </Tab.Screen>

      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📊" label="통계" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🎯" label="목표" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Consultation"
        component={ConsultationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🤖" label="상담" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="프로필" focused={focused} />
          ),
        }}
      >
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderTopColor: colors.border.light,
    borderTopWidth: 1,
    height: 80,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  tabIcon: {
    alignItems: 'center',
    gap: 2,
  },
  tabEmoji: {
    fontSize: 24,
    opacity: 0.6,
  },
  tabEmojiActive: {
    opacity: 1,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
});

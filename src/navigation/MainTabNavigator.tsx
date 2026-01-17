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
import {
  Text,
  HomeIcon,
  ChartIcon,
  TargetIcon,
  ChatIcon,
  UserIcon,
} from '../components/ui';
import { spacing } from '../theme/spacing';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface Props {
  onAddDrink: (selectedDate: string) => void;
}

interface TabIconProps {
  IconComponent: React.ComponentType<{ size?: number; color?: string; filled?: boolean }>;
  label: string;
  focused: boolean;
}

function TabIcon({ IconComponent, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabIcon}>
      <IconComponent
        size={24}
        color={focused ? colors.primary.main : colors.text.muted}
        filled={focused}
      />
      <Text
        variant="small"
        style={{ 
          color: focused ? colors.primary.main : colors.text.muted, 
          fontWeight: focused ? '600' : '400',
          fontSize: 11,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export function MainTabNavigator({ onAddDrink }: Props) {
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
            <TabIcon IconComponent={HomeIcon} label="홈" focused={focused} />
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
            <TabIcon IconComponent={ChartIcon} label="통계" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={TargetIcon} label="목표" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Consultation"
        component={ConsultationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={ChatIcon} label="상담" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={UserIcon} label="프로필" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderTopWidth: 0,
    height: 68,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tabIcon: {
    alignItems: 'center',
    gap: 2,
    minWidth: 50,
  },
});

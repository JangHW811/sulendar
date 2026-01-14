/**
 * 술렌다 - 인증 네비게이터
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegisterScreen } from '../screens';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {
  onLogin: () => void;
}

export function AuthNavigator({ onLogin }: Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onLogin={onLogin}
            onNavigateToRegister={() => props.navigation.navigate('Register')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <RegisterScreen
            {...props}
            onRegister={onLogin}
            onNavigateToLogin={() => props.navigation.navigate('Login')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

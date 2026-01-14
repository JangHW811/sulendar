/**
 * 술렌다 - 루트 네비게이터
 */

import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AddDrinkScreen } from '../screens';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth">
          {() => <AuthNavigator onLogin={handleLogin} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Main">
            {({ navigation }) => (
              <MainTabNavigator
                onAddDrink={() => navigation.navigate('AddDrink')}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AddDrink"
            component={AddDrinkScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AddDrinkScreen } from '../screens';
import { RootStackParamList } from './types';
import { useAuth } from '../context';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const LOADING_TIMEOUT_MS = 10000; // 10초 타임아웃

export function RootNavigator() {
  const { session, isLoading } = useAuth();
  const [forceShowAuth, setForceShowAuth] = useState(false);

  // 로딩 타임아웃 - 10초 지나면 로그인 화면으로
  useEffect(() => {
    if (!isLoading) {
      setForceShowAuth(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn('Auth loading timeout - showing login screen');
      setForceShowAuth(true);
    }, LOADING_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading && !forceShowAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const shouldShowAuth = !session || forceShowAuth;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {shouldShowAuth ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main">
            {({ navigation }) => (
              <MainTabNavigator 
                onAddDrink={(selectedDate) => navigation.navigate('AddDrink', { selectedDate })} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AddDrink"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          >
            {({ navigation, route }) => (
              <AddDrinkScreen 
                onClose={() => navigation.goBack()} 
                selectedDate={route.params?.selectedDate}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});

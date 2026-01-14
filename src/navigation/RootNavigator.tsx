import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AddDrinkScreen } from '../screens';
import { RootStackParamList } from './types';
import { useAuth } from '../context';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main">
            {({ navigation }) => (
              <MainTabNavigator onAddDrink={() => navigation.navigate('AddDrink')} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AddDrink"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          >
            {({ navigation }) => (
              <AddDrinkScreen onClose={() => navigation.goBack()} />
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

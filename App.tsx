/**
 * 술렌다 - 음주 기록 캘린더 앱
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

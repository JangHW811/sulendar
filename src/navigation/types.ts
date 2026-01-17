/**
 * 술렌다 네비게이션 타입 정의
 */

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AddDrink: { selectedDate?: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Goals: undefined;
  Consultation: undefined;
  Profile: undefined;
};

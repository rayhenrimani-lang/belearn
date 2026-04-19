import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth/jwt_token';
const USER_EMAIL_KEY = '@auth/user_email';
/** Ancienne clé utilisée par certains écrans de login Expo. */
const LEGACY_TOKEN_KEY = 'token';

export async function getStoredToken(): Promise<string | null> {
  const jwt = await AsyncStorage.getItem(TOKEN_KEY);
  if (jwt) {
    return jwt;
  }
  return AsyncStorage.getItem(LEGACY_TOKEN_KEY);
}

export async function getStoredUserEmail(): Promise<string | null> {
  return AsyncStorage.getItem(USER_EMAIL_KEY);
}

export async function saveSession(token: string, email: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_EMAIL_KEY, email);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY, LEGACY_TOKEN_KEY]);
}

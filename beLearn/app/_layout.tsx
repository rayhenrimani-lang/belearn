import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
import { AuthProvider } from '@/src/context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login-modern" options={{ headerShown: false }} />
        <Stack.Screen name="register-modern" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
        <Stack.Screen name="register-complete" options={{ headerShown: false }} />
        <Stack.Screen name="accueil" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="screens/NavigationTest" options={{ headerShown: false }} />
        <Stack.Screen name="screens/HomeScreen" options={{ headerShown: false }} />
        <Stack.Screen name="CoursesScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LessonsScreen" options={{ headerShown: false }} />
        <Stack.Screen name="screens/CoursesScreen" options={{ headerShown: false }} />
        <Stack.Screen name="screens/LessonsScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
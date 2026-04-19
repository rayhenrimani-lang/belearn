import { Stack } from 'expo-router';
import { colors } from '@/src/theme/tokens';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textWhite,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="dashboard" options={{ title: 'Tableau de bord' }} />
      <Stack.Screen name="users" options={{ title: 'Utilisateurs' }} />
      <Stack.Screen name="addUser" options={{ title: 'Nouvel utilisateur' }} />
      <Stack.Screen name="editUser" options={{ title: 'Modifier utilisateur' }} />
    </Stack>
  );
}

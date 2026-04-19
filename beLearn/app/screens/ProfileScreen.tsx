import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { ProfileBody } from '@/src/screens/microlearn/ProfileBody';
import { displayNameFromEmail } from '@/src/utils/displayName';

export default function ProfileScreen() {
  const router = useRouter();
  const { userEmail, logout } = useAuth();

  const displayName = displayNameFromEmail(userEmail);

  const handleEdit = () => {
    Alert.alert('Modifier le profil', 'Cette fonctionnalité sera disponible prochainement.');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ProfileBody
      displayName={displayName}
      email={userEmail}
      onEditProfile={handleEdit}
      onLogout={handleLogout}
    />
  );
}

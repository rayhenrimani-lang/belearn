import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ProfileBody } from './microlearn/ProfileBody';
import { displayNameFromEmail } from '../utils/displayName';

export function ProfileTabScreen() {
  const { userEmail, logout } = useAuth();

  return (
    <ProfileBody
      displayName={displayNameFromEmail(userEmail)}
      email={userEmail}
      onEditProfile={() =>
        Alert.alert('Modifier le profil', 'Fonctionnalité à venir.')
      }
      onLogout={logout}
    />
  );
}

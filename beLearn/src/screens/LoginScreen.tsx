import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { ApiError } from '../services/api';
import { colors, radius, softShadow, spacing, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      Alert.alert('Champs requis', 'Veuillez saisir email et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmed, password);
    } catch (e) {
      if (e instanceof ApiError) {
        Alert.alert('Connexion impossible', e.message);
      } else {
        Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
      ]}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoRow}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.logo}>
          <Ionicons name="school" size={40} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.brand}>BeLearn</Text>
      <Text style={styles.tagline}>Apprenez à votre rythme, comme sur les grandes plateformes.</Text>

      <View style={[styles.card, softShadow]}>
        <Text style={styles.cardTitle}>Connexion</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            loading && styles.btnDisabled,
            pressed && !loading && styles.btnPressed,
          ]}
          onPress={() => void onSubmit()}
          disabled={loading}>
          <Text style={styles.primaryBtnText}>{loading ? 'Connexion…' : 'Se connecter'}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.linkWrap} onPress={() => navigation.navigate('Register')} disabled={loading}>
        <Text style={styles.linkText}>
          Pas encore de compte ?{' '}
          <Text style={styles.linkBold}>Créer un compte</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );

  if (Platform.OS === 'web') {
    return <View style={styles.flex}>{form}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {form}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  logoRow: { alignItems: 'center', marginBottom: spacing.md },
  logo: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  tagline: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: { opacity: 0.65 },
  btnPressed: { opacity: 0.9 },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  linkWrap: { marginTop: spacing.xl, alignItems: 'center', padding: spacing.sm },
  linkText: { fontSize: 15, color: colors.textSecondary },
  linkBold: { color: colors.primary, fontWeight: '700' },
});

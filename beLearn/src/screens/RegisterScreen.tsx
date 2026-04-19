import React, { useRef, useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const submitLockRef = useRef(false);

  const onSubmit = async () => {
    if (loading || submitLockRef.current) return;

    const trimmed = email.trim();
    if (!trimmed || !password) {
      Alert.alert('Champs requis', 'Email et mot de passe sont obligatoires.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe', 'Utilisez au moins 6 caractères.');
      return;
    }

    submitLockRef.current = true;
    setLoading(true);
    let success = false;
    try {
      await register(trimmed, password);
      success = true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Une erreur inattendue est survenue.';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }

    if (success) {
      Alert.alert('Compte créé avec succès', 'Bienvenue sur BeLearn.');
    }
  };

  const scroll = (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
      ]}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoRow}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.logo}>
          <Ionicons name="person-add" size={36} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.brand}>Créer un compte</Text>
      <Text style={styles.tagline}>Rejoignez BeLearn et accédez à tous les parcours.</Text>

      <View style={[styles.card, softShadow]}>
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
          placeholder="Mot de passe (6 caractères min.)"
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
          <Text style={styles.primaryBtnText}>{loading ? 'Création…' : 'Créer Compte'}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.linkWrap} onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.linkText}>
          Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );

  if (Platform.OS === 'web') {
    return <View style={styles.flex}>{scroll}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {scroll}
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
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../src/theme/theme';
import { commonStyles } from '../src/styles/commonStyles';

export default function LoginModern() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call
      console.log('Login attempt:', formData);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Succès', 'Connexion réussie!', [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]);
      }, 2000);
      
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="school-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>MicroLearn</Text>
          <Text style={styles.appSubtitle}>Apprenez à votre rythme</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Connexion</Text>
          <Text style={styles.formSubtitle}>Accédez à votre espace d'apprentissage</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textTertiary}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={colors.textTertiary}
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <View style={styles.rememberContainer}>
              <TouchableOpacity 
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.checkbox}
              >
                <Ionicons 
                  name={rememberMe ? "checkbox" : "square-outline"} 
                  size={20} 
                  color={rememberMe ? colors.primary : colors.textSecondary} 
                />
              </TouchableOpacity>
              <Text style={styles.rememberText}>Se souvenir de moi</Text>
            </View>
            
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Vous n'avez pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/register-modern')}>
              <Text style={styles.registerLink}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appTitle: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  formContainer: {
    gap: spacing.lg,
  },
  formTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: spacing.sm,
  },
  rememberText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primary,
  },
  loginButton: {
    ...commonStyles.button,
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    ...commonStyles.buttonDisabled,
  },
  loginButtonText: {
    ...commonStyles.buttonText,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  registerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../src/theme/theme';
import { commonStyles } from '../src/styles/commonStyles';

export default function RegisterComplete() {
  const router = useRouter();
  
  // Get passed data from router params
  const { email, phone, cacheKey } = router.params as {
    email: string;
    phone: string;
    cacheKey: string;
  };

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.nom || !formData.prenom || !formData.password || !formData.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://192.168.61.185:8001/api/register-verified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cache_key: cacheKey,
          nom: formData.nom,
          prenom: formData.prenom,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      Alert.alert(
        'Succès!',
        'Compte créé avec succès! Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login-modern')
          }
        ]
      );

    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
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
      <View style={styles.content}>
        {/* Success Indicator */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Email vérifié!</Text>
          <Text style={styles.successSubtitle}>
            {email}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Complétez votre profil</Text>
          <Text style={styles.formSubtitle}>
            Dernières informations pour créer votre compte
          </Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor={colors.textTertiary}
              value={formData.nom}
              onChangeText={(value) => updateFormData('nom', value)}
              autoCapitalize="words"
            />
          </View>

          {/* First Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor={colors.textTertiary}
              value={formData.prenom}
              onChangeText={(value) => updateFormData('prenom', value)}
              autoCapitalize="words"
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

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={colors.textTertiary}
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Créer le compte</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.replace('/login-modern')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  successIcon: {
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.success,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  formContainer: {
    gap: spacing.md,
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
  registerButton: {
    ...commonStyles.button,
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    ...commonStyles.buttonDisabled,
  },
  registerButtonText: {
    ...commonStyles.buttonText,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});

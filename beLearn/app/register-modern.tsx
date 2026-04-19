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
import { colors, spacing, borderRadius, shadows, typography } from '../src/theme/theme';
import { commonStyles } from '../src/styles/commonStyles';

export default function RegisterModern() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions d\'utilisation');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Basic phone validation
    if (formData.phone.length < 8) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://192.168.61.185:8001/api/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code de vérification');
      }

      // Navigate to verification screen
      router.push({
        pathname: '/verification',
        params: {
          email: formData.email,
          phone: formData.phone,
          cacheKey: data.cache_key
        }
      });

    } catch (error: any) {
      setLoading(false);
      Alert.alert('Erreur', error.message);
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MicroLearn</Text>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la plateforme pour commencer</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              placeholderTextColor={colors.textTertiary}
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              autoCapitalize="words"
            />
          </View>

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

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              placeholderTextColor={colors.textTertiary}
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={styles.checkbox}
            >
              <Ionicons 
                name={acceptTerms ? "checkbox" : "square-outline"} 
                size={20} 
                color={acceptTerms ? colors.primary : colors.textSecondary} 
              />
            </TouchableOpacity>
            <Text style={styles.termsText}>
              J'accepte les conditions d'utilisation
            </Text>
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
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/login-modern')}>
              <Text style={styles.loginLink}>Se connecter</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    marginLeft: spacing.md,
  },
  titleContainer: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  formContainer: {
    gap: spacing.md,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkbox: {
    marginRight: spacing.sm,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
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

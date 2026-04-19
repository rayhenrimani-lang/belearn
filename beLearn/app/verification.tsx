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

export default function Verification() {
  const router = useRouter();
  
  // Get passed data from router params
  const { email, phone, cacheKey } = router.params as {
    email: string;
    phone: string;
    cacheKey: string;
  };

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://192.168.61.185:8001/api/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cache_key: cacheKey,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Code de vérification invalide');
      }

      Alert.alert(
        'Succès',
        'Email vérifié avec succès!',
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/register-complete',
              params: { email, phone, cacheKey }
            })
          }
        ]
      );

    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setResending(true);

    try {
      const response = await fetch(`http://192.168.61.185:8001/api/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code');
      }

      // Reset timer
      setTimeLeft(15 * 60);
      setCanResend(false);
      setVerificationCode('');

      Alert.alert(
        'Code envoyé',
        'Un nouveau code de vérification a été envoyé à votre email',
        [
          {
            text: 'OK',
            onPress: () => {
              // Update cache key if provided
              if (data.cache_key) {
                router.setParams({ cacheKey: data.cache_key });
              }
            }
          }
        ]
      );

    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // Only allow numbers and max 6 digits
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) {
      setVerificationCode(numericText);
    }
  };

  const renderCodeInput = (index: number) => (
    <View key={index} style={styles.codeInputContainer}>
      <TextInput
        style={[
          styles.codeInput,
          verificationCode[index] && styles.codeInputFilled
        ]}
        value={verificationCode[index] || ''}
        onChangeText={(text) => {
          const newCode = verificationCode.split('');
          newCode[index] = text;
          const fullCode = newCode.join('');
          handleCodeChange(fullCode);
          
          // Auto-focus next input
          if (text && index < 5) {
            // Focus next input would require refs, simplified here
          }
        }}
        keyboardType="numeric"
        maxLength={1}
        textAlign="center"
        autoFocus={index === 0}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="mail-unread-outline" size={48} color={colors.primary} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Vérification</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un code de vérification à
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* Code Inputs */}
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Entrez le code à 6 chiffres</Text>
          <View style={styles.codeInputs}>
            {[0, 1, 2, 3, 4, 5].map(renderCodeInput)}
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {canResend ? "Vous pouvez renvoyer le code" : `Code expirera dans ${formatTime(timeLeft)}`}
          </Text>
        </View>

        {/* Verify Button */}
        <TouchableOpacity 
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerifyCode}
          disabled={loading || verificationCode.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>Vérifier</Text>
          )}
        </TouchableOpacity>

        {/* Resend Button */}
        <TouchableOpacity 
          style={[styles.resendButton, !canResend && styles.buttonDisabled]}
          onPress={handleResendCode}
          disabled={!canResend || resending}
        >
          {resending ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={[styles.resendButtonText, !canResend && styles.resendButtonTextDisabled]}>
              Renvoyer le code
            </Text>
          )}
        </TouchableOpacity>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Vous n'avez pas reçu l'email ? Vérifiez vos spams ou contactez le support.
          </Text>
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
  header: {
    marginBottom: spacing.xxl,
  },
  backButton: {
    padding: spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emailText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  codeContainer: {
    marginBottom: spacing.xl,
  },
  codeLabel: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  codeInputContainer: {
    flex: 1,
  },
  codeInput: {
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: colors.textWhite,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  timerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  verifyButton: {
    ...commonStyles.button,
    marginBottom: spacing.lg,
  },
  buttonDisabled: {
    ...commonStyles.buttonDisabled,
  },
  verifyButtonText: {
    ...commonStyles.buttonText,
  },
  resendButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  resendButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: colors.textTertiary,
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  helpText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

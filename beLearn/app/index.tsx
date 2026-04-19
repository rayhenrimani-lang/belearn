import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../src/theme/theme";
import { commonStyles } from "../src/styles/commonStyles";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <View style={styles.logoBox}>
        <Ionicons name="school-outline" size={48} color={colors.textWhite} />
      </View>

      {/* Title */}
      <Text style={styles.title}>MicroLearn</Text>
      <Text style={styles.subtitle}>
        Apprenez à votre rythme 
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/login-modern")}
      >
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.outline]}
        onPress={() => router.push("/register-modern")}
      >
        <Text style={[styles.btnText, { color: colors.primary }]}>
          Créer un compte
        </Text>
      </TouchableOpacity>

      {/* Quick access to app */}
      <TouchableOpacity
        style={styles.quickAccess}
        onPress={() => router.push("/screens/NavigationTest")}
      >
        <Text style={styles.quickAccessText}>🚀 Test Navigation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAccess}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.quickAccessText}>Voir l'app (démo)</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  logoBox: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    ...commonStyles.card,
  },

  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },

  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  btn: {
    ...commonStyles.button,
    width: "80%",
    marginBottom: spacing.md,
  },

  outline: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  btnText: {
    ...commonStyles.buttonText,
  },
  
  quickAccess: {
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  
  quickAccessText: {
    ...typography.caption,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
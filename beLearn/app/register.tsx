import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { registerUser } from "../api";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleRegisterPress = async () => {
    if (!nom || !prenom || !telephone || !email || !password) {
      Alert.alert("Erreur", "Remplir tous les champs !");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await registerUser(nom, prenom, telephone, email, password);
      console.log("RESPONSE:", res);

      if (res && !res.error) {
        Alert.alert("Succès", "Compte créé !", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        const errorMessage = res?.message || res?.error || "Problème serveur";
        setError(errorMessage);
        Alert.alert("Erreur", errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Connexion échouée";
      setError(errorMessage);
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#8D3DAF", "#C77DFF"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BeLearn</Text>
        <Text style={styles.subtitle}>Créer un compte</Text>

        {/* Nom */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#7B2CBF" />
          <TextInput
            placeholder="Nom"
            placeholderTextColor="#999"
            style={styles.input}
            value={nom}
            onChangeText={setNom}
          />
        </View>

        {/* Prénom */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#7B2CBF" />
          <TextInput
            placeholder="Prénom"
            placeholderTextColor="#999"
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
          />
        </View>

        {/* Téléphone */}
        <View style={styles.inputContainer}>
          <Feather name="phone" size={20} color="#7B2CBF" />
          <TextInput
            placeholder="Téléphone"
            placeholderTextColor="#999"
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#7B2CBF" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#7B2CBF" />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegisterPress}
            onPressIn={!loading ? handlePressIn : undefined}
            onPressOut={!loading ? handlePressOut : undefined}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Créer un compte</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Already have account */}
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.registerText}>
            Déjà un compte?{" "}
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#eee", marginBottom: 30 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: { flex: 1, height: 50, color: "#333", marginLeft: 10 },
  button: {
    backgroundColor: "#7B2CBF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  registerText: { color: "#eee", fontSize: 14, textAlign: "center" },
});
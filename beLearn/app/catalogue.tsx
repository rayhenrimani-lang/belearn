import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Catalogue() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Catalogue des cours</Text>

      {/* Search */}
      <TextInput
        placeholder="🔍 Rechercher..."
        style={styles.input}
      />

      {/* Categories */}
      <View style={styles.grid}>
        <View style={[styles.box, { backgroundColor: "#7B2CBF" }]}>
          <Text style={styles.boxText}>💻 Développement</Text>
        </View>

        <View style={[styles.box, { backgroundColor: "#F4A261" }]}>
          <Text style={styles.boxText}>🎨 Design</Text>
        </View>

        <View style={[styles.box, { backgroundColor: "#2A9D8F" }]}>
          <Text style={styles.boxText}>📢 Marketing</Text>
        </View>

        <View style={[styles.box, { backgroundColor: "#3A86FF" }]}>
          <Text style={styles.boxText}>🤖 IA</Text>
        </View>
      </View>

      {/* Recent course */}
      <View style={styles.recent}>
        <Text style={styles.cardTitle}>JavaScript pour débutants</Text>
        <Text>⭐ 4.9 • 1h30</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F7FF" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  box: {
    width: "48%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  boxText: {
    color: "#fff",
    fontWeight: "bold",
  },

  recent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
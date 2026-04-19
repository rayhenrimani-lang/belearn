import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";

const data = [
  { id: 1, title: "Développement Web", rating: "4.8", duration: "2h 30min" },
  { id: 2, title: "UI/UX Design", rating: "4.6", duration: "1h 45min" },
  { id: 3, title: "Marketing Digital", rating: "4.7", duration: "1h 20min" },
];

export default function Search() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Rechercher un cours</Text>

      {/* Search input */}
      <TextInput
        placeholder="🔍 Rechercher un cours..."
        style={styles.input}
      />

      {/* Tags */}
      <View style={styles.tags}>
        {["Dev", "Design", "Marketing", "IA"].map((tag, i) => (
          <Text key={i} style={styles.tag}>{tag}</Text>
        ))}
      </View>

      {/* Results */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>⭐ {item.rating} • {item.duration}</Text>
          </View>
        )}
      />
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  tags: {
    flexDirection: "row",
    marginBottom: 20,
  },

  tag: {
    backgroundColor: "#E0D4FF",
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
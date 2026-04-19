import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { fetchCourses } from "../../src/services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    console.log("🚀 Loading courses...");

    try {
      const data = await fetchCourses();

      console.log("📚 Courses from API:", data);

      setCourses(data);
    } catch (err) {
      console.log("❌ Error:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>TEST LOADING...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.titre}
            </Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
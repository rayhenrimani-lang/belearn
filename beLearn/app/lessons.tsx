import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { fetchLessons } from "../src/services/api";
import { useLocalSearchParams } from "expo-router";

export default function Lessons() {
  const { courseId } = useLocalSearchParams();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    const data = await fetchLessons(Number(courseId));
    setLessons(data);
  }

  return (
    <FlatList
      data={lessons}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 20 }}>
          <Text>{item.titre}</Text>
        </View>
      )}
    />
  );
}
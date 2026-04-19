import { Platform } from "react-native";

const LOCAL_IP = "127.0.0.1"; 
const PORT = 8000;

function getHost(): string {
  if (Platform.OS === "android") return "10.0.2.2";
  if (Platform.OS === "ios") return "localhost";
  if (Platform.OS === "web") return "localhost";
  return LOCAL_IP;
}

export const API_BASE_URL = `http://${getHost()}:${PORT}/api`;
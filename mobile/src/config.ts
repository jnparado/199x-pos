import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const KEY = "199x-api-url";
let current = "";

export function getApiUrl(): string {
  return current || defaultApiUrl();
}

export function setCurrentApiUrl(url: string) {
  current = url.replace(/\/$/, "");
}

function fromExpoHost(): string | null {
  const host = Constants.expoConfig?.hostUri || Constants.linkingUri || "";
  const match = host.match(/(\d+\.\d+\.\d+\.\d+)/);
  if (match) return `http://${match[1]}:3000`;
  return null;
}

export function defaultApiUrl(): string {
  return fromExpoHost() || (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");
}

export async function loadApiUrl(): Promise<string> {
  const saved = await AsyncStorage.getItem(KEY);
  const url = saved || defaultApiUrl();
  setCurrentApiUrl(url);
  return url;
}

export async function saveApiUrl(url: string): Promise<string> {
  const clean = url.replace(/\/$/, "");
  setCurrentApiUrl(clean);
  await AsyncStorage.setItem(KEY, clean);
  return clean;
}

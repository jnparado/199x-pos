import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClub } from "@/src/club";
import { colors, staffPins } from "@/src/theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "→"];

export default function LoginScreen() {
  const { login, error: serverError } = useClub();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(next = pin) {
    try {
      await login(next);
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setPin("");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: 20 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Image
          source={require("../assets/images/199x-logo.jpg")}
          style={{ width: 180, height: 180, borderRadius: 36, alignSelf: "center" }}
        />
        <Text style={{ color: colors.green, textAlign: "center", marginTop: 16, letterSpacing: 3, fontWeight: "800" }}>
          AUGUST 2026
        </Text>
        <Text style={{ color: colors.gold, textAlign: "center", marginTop: 6, fontSize: 28, fontStyle: "italic" }}>
          Coffee+Bar POS
        </Text>
        <Text style={{ color: colors.muted, textAlign: "center", marginTop: 8 }}>Enter your 4-digit PIN</Text>
        <Text style={{ color: colors.text, textAlign: "center", marginTop: 16, fontSize: 36, letterSpacing: 14, fontWeight: "800" }}>
          {pin.padEnd(4, "•")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
          {KEYS.map((key) => (
            <Pressable
              key={key}
              onPress={() => {
                if (key === "C") {
                  setPin("");
                  setError(null);
                  return;
                }
                if (key === "→") {
                  void submit();
                  return;
                }
                const next = (pin + key).slice(0, 4);
                setPin(next);
                if (next.length === 4) void submit(next);
              }}
              style={{
                width: "31%",
                height: 56,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: key === "→" ? colors.green : key === "C" ? colors.red : "#161616",
              }}
            >
              <Text style={{ color: key === "→" ? "#000" : colors.text, fontSize: 20, fontWeight: "800" }}>{key}</Text>
            </Pressable>
          ))}
        </View>
        {error || serverError ? (
          <Text style={{ color: colors.red, textAlign: "center", marginTop: 12 }}>{error || serverError}</Text>
        ) : null}
        <View style={{ marginTop: 18, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {staffPins.map((item: string) => (
            <Text key={item} style={{ color: colors.muted, width: "47%", fontSize: 12 }}>
              {item}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

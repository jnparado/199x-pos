import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useClub } from "@/src/club";
import { defaultApiUrl, getApiUrl, saveApiUrl } from "@/src/config";
import { colors } from "@/src/theme";

export default function MoreScreen() {
  const { user, logout, refresh, error } = useClub();
  const router = useRouter();
  const [url, setUrl] = useState(getApiUrl());
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, gap: 14 }}>
      <Image
        source={require("../../assets/images/199x-logo.jpg")}
        style={{ width: 96, height: 96, borderRadius: 22, alignSelf: "center", marginTop: 8 }}
      />
      <Text style={{ color: colors.gold, textAlign: "center", fontSize: 22, fontStyle: "italic" }}>199X Coffee+Bar</Text>
      <Text style={{ color: colors.muted, textAlign: "center" }}>{user?.name} · {user?.role}</Text>

      <Text style={{ color: colors.text, fontWeight: "800", marginTop: 8 }}>POS server</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={defaultApiUrl()}
        placeholderTextColor={colors.muted}
        style={{
          height: 48,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.line,
          color: colors.text,
          paddingHorizontal: 14,
        }}
      />
      <Pressable
        onPress={async () => {
          await saveApiUrl(url);
          setSaved("Saved. Connecting…");
          try {
            await refresh();
            setSaved("Connected to 199X POS.");
          } catch (err) {
            setSaved(err instanceof Error ? err.message : "Could not connect");
          }
        }}
        style={{ height: 46, borderRadius: 12, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ color: "#000", fontWeight: "800" }}>Save & connect</Text>
      </Pressable>
      <Text style={{ color: colors.muted, fontSize: 12 }}>
        iPhone simulator uses localhost. Android emulator uses 10.0.2.2. A real phone needs your computer IP, like http://192.168.1.10:3000
      </Text>
      {saved || error ? <Text style={{ color: saved?.includes("Connected") ? colors.green : colors.gold }}>{saved || error}</Text> : null}

      <Pressable
        onPress={() => {
          logout();
          router.replace("/login");
        }}
        style={{ height: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.red, alignItems: "center", justifyContent: "center", marginTop: 8 }}
      >
        <Text style={{ color: colors.red, fontWeight: "800" }}>Logout</Text>
      </Pressable>
    </View>
  );
}

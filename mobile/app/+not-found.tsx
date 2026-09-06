import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { colors } from "@/src/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg, padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>This screen does not exist.</Text>
        <Link href="/" style={{ marginTop: 16 }}>
          <Text style={{ color: colors.green, fontWeight: "700" }}>Go home</Text>
        </Link>
      </View>
    </>
  );
}

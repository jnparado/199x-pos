import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useClub } from "@/src/club";
import { colors } from "@/src/theme";

export default function Index() {
  const { ready, user } = useClub();
  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }
  return <Redirect href={user ? "/(tabs)" : "/login"} />;
}

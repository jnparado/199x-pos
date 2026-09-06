import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useClub } from "@/src/club";
import { colors } from "@/src/theme";

export default function TabLayout() {
  const { ready, user } = useClub();
  if (!ready) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "800" },
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.line },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Dashboard", tabBarIcon: () => <Text>📊</Text> }}
      />
      <Tabs.Screen name="pos" options={{ title: "POS", tabBarIcon: () => <Text>🍸</Text> }} />
      <Tabs.Screen name="tables" options={{ title: "Tables", tabBarIcon: () => <Text>🪑</Text> }} />
      <Tabs.Screen name="bar" options={{ title: "Bar", tabBarIcon: () => <Text>🔔</Text> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tabs>
  );
}

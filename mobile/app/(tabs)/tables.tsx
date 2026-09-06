import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import * as api from "@/src/api";
import { useClub } from "@/src/club";
import { money, orderTotals } from "@/src/money";
import { colors } from "@/src/theme";

const DOT: Record<string, string> = {
  available: colors.green,
  occupied: colors.red,
  reserved: colors.gold,
  closed: "#71717a",
};

export default function TablesScreen() {
  const { state, user, setActiveOrderId, run } = useClub();
  const router = useRouter();
  const [name, setName] = useState("");

  if (!state || !user) {
    return <Text style={{ color: colors.muted, padding: 20 }}>Sign in to see tables.</Text>;
  }

  async function openTable(tableId: string, asTab: boolean) {
    const table = state!.tables.find((item) => item.id === tableId);
    if (table?.orderId && table.status === "occupied") {
      setActiveOrderId(table.orderId);
      router.push("/(tabs)/pos");
      return;
    }
    await run(async () => {
      const result = await api.openOrder({
        tableId,
        serverId: user!.id,
        customerName: name || undefined,
        asTab,
      });
      const order = result.state.orders.find((item) => item.tableId === tableId && item.status !== "void");
      if (order) setActiveOrderId(order.id);
      return result;
    });
    router.push("/(tabs)/pos");
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Customer name (tab)"
        placeholderTextColor={colors.muted}
        style={{
          height: 48,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.line,
          color: colors.text,
          paddingHorizontal: 14,
          backgroundColor: colors.card,
        }}
      />
      {(["floor", "vip", "bar"] as const).map((section) => (
        <View key={section}>
          <Text style={{ color: colors.muted, fontWeight: "800", letterSpacing: 1, marginBottom: 8 }}>
            {section.toUpperCase()}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {state.tables
              .filter((table) => table.section === section)
              .map((table) => {
                const order = state.orders.find((item) => item.id === table.orderId);
                const due = order ? orderTotals(order, state.venue.taxRate, state.venue.serviceRate).due : 0;
                return (
                  <View
                    key={table.id}
                    style={{
                      width: "48%",
                      backgroundColor: colors.card,
                      borderColor: colors.line,
                      borderWidth: 1,
                      borderRadius: 16,
                      padding: 12,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.text, fontWeight: "800" }}>{table.label}</Text>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: DOT[table.status] }} />
                    </View>
                    <Text style={{ color: colors.muted, marginTop: 4 }}>{table.seats} seats</Text>
                    <Text style={{ color: colors.gold, marginTop: 6 }}>{money(due)}</Text>
                    <Pressable
                      onPress={() => void openTable(table.id, false)}
                      style={{ marginTop: 10, height: 36, borderRadius: 10, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={{ color: "#000", fontWeight: "800" }}>
                        {table.status === "occupied" ? "Open" : "Seat"}
                      </Text>
                    </Pressable>
                    <Pressable onPress={() => void openTable(table.id, true)} style={{ marginTop: 6, height: 32, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: colors.text }}>Tab</Text>
                    </Pressable>
                  </View>
                );
              })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

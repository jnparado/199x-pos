import { Pressable, ScrollView, Text, View } from "react-native";
import * as api from "@/src/api";
import { useClub } from "@/src/club";
import { colors } from "@/src/theme";

const NEXT: Record<string, "preparing" | "ready" | "served"> = {
  new: "preparing",
  preparing: "ready",
  ready: "served",
};

export default function BarScreen() {
  const { state, run } = useClub();
  if (!state) return <Text style={{ color: colors.muted, padding: 20 }}>Loading bar display…</Text>;

  const tickets = state.orders.filter(
    (order) =>
      (order.status === "sent" || order.status === "open") &&
      order.ticketStatus !== "served" &&
      order.items.some((item) => !item.voided),
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      {tickets.length === 0 ? (
        <Text style={{ color: colors.muted }}>No open bar tickets.</Text>
      ) : null}
      {tickets.map((order) => (
        <View key={order.id} style={{ backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: colors.text, fontWeight: "800" }}>#{order.number}</Text>
            <Text style={{ color: colors.green, textTransform: "uppercase", fontWeight: "800" }}>{order.ticketStatus}</Text>
          </View>
          {order.items
            .filter((item) => !item.voided)
            .map((item) => (
              <Text key={item.id} style={{ color: colors.text, marginTop: 6 }}>
                {item.name} × {item.quantity}
              </Text>
            ))}
          {NEXT[order.ticketStatus] ? (
            <Pressable
              onPress={() => void run(() => api.setTicket(order.id, NEXT[order.ticketStatus]))}
              style={{ marginTop: 12, height: 42, borderRadius: 12, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#000", fontWeight: "800" }}>Mark {NEXT[order.ticketStatus]}</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

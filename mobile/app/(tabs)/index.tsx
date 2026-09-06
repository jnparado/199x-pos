import { ScrollView, Text, View } from "react-native";
import { useClub, useDashboard } from "@/src/club";
import { money } from "@/src/money";
import { colors } from "@/src/theme";

export default function DashboardScreen() {
  const { state, user } = useClub();
  const stats = useDashboard(state);

  if (!state || !stats) {
    return <Text style={{ color: colors.muted, padding: 20 }}>Loading dashboard…</Text>;
  }

  const cards = [
    ["Gross sales", money(stats.gross), colors.green],
    ["Net / revenue", money(stats.net), colors.blue],
    ["Profit", money(stats.profit), colors.gold],
    ["Orders", String(stats.orders), colors.orange],
    ["Open tables", String(stats.openTables), colors.red],
    ["Open tabs", String(stats.openTabs), colors.green],
    ["Cash", money(stats.byPay.cash || 0), colors.gold],
    ["Card / e-wallet", money((stats.byPay.card || 0) + (stats.byPay.gcash || 0) + (stats.byPay.maya || 0)), colors.blue],
  ] as const;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ color: colors.green, letterSpacing: 2, fontWeight: "800", fontSize: 12 }}>TODAY</Text>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>{state.venue.name}</Text>
      <Text style={{ color: colors.muted }}>{user?.name} · {user?.role} · {state.venue.city}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {cards.map(([label, value, accent]) => (
          <View
            key={label}
            style={{
              width: "48%",
              backgroundColor: colors.card,
              borderColor: colors.line,
              borderWidth: 1,
              borderLeftWidth: 4,
              borderLeftColor: accent,
              borderRadius: 16,
              padding: 12,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800" }}>{label.toUpperCase()}</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 6 }}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={{ backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 14 }}>
        <Text style={{ color: colors.text, fontWeight: "800" }}>Best-selling drinks</Text>
        {stats.best.length === 0 ? (
          <Text style={{ color: colors.muted, marginTop: 8 }}>No paid sales yet today.</Text>
        ) : (
          stats.best.map((item, index) => (
            <View key={item.name} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: colors.text }}>{index + 1}. {item.name}</Text>
              <Text style={{ color: colors.gold }}>{item.qty} · {money(item.sales)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

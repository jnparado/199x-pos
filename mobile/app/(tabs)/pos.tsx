import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as api from "@/src/api";
import { useClub } from "@/src/club";
import { isHappyHour, lineTotal, money, orderTotals } from "@/src/money";
import { colors } from "@/src/theme";
import type { PayMethod } from "@/src/types";

const METHODS: PayMethod[] = ["cash", "card", "gcash", "maya", "bank"];

export default function PosScreen() {
  const { state, user, activeOrder, setActiveOrderId, run } = useClub();
  const [categoryId, setCategoryId] = useState("beer");
  const [query, setQuery] = useState("");
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<PayMethod>("cash");
  const happy = isHappyHour();

  const products = useMemo(() => {
    if (!state) return [];
    const q = query.trim().toLowerCase();
    return state.products.filter((product) => {
      if (!product.active) return false;
      if (product.categoryId !== categoryId && !q) return false;
      return !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q);
    });
  }, [state, categoryId, query]);

  if (!state || !user) {
    return <Text style={{ color: colors.muted, padding: 20 }}>Sign in to use the register.</Text>;
  }

  const order = activeOrder;
  const totals = order ? orderTotals(order, state.venue.taxRate, state.venue.serviceRate) : null;
  const table = state.tables.find((item) => item.id === order?.tableId);

  async function ensureOrder() {
    if (order) return order.id;
    const result = await run(() => api.openOrder({ serverId: user!.id, customerName: "Walk-up" }));
    if (result.orderId) setActiveOrderId(result.orderId);
    return result.orderId;
  }

  async function ring(productId: string) {
    const orderId = order?.id || (await ensureOrder());
    if (!orderId) return;
    await run(() => api.addItem(orderId, productId));
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 24 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
          {state.categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setCategoryId(category.id)}
              style={{
                height: 40,
                paddingHorizontal: 14,
                borderRadius: 12,
                justifyContent: "center",
                backgroundColor: categoryId === category.id ? colors.green : "#161616",
              }}
            >
              <Text style={{ color: categoryId === category.id ? "#000" : colors.text, fontWeight: "700" }}>
                {category.emoji} {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products, SKU…"
          placeholderTextColor={colors.muted}
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.line,
            color: colors.text,
            paddingHorizontal: 12,
            marginBottom: 10,
          }}
        />
        {happy ? (
          <Text style={{ color: colors.green, fontWeight: "800", marginBottom: 8 }}>Happy hour is on</Text>
        ) : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {products.map((product) => {
            const price = happy && product.happyHourPrice != null ? product.happyHourPrice : product.price;
            return (
              <Pressable
                key={product.id}
                onPress={() => void ring(product.id)}
                style={{
                  width: "48%",
                  minHeight: 88,
                  backgroundColor: colors.card,
                  borderColor: colors.line,
                  borderWidth: 1,
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "700" }}>{product.name}</Text>
                <Text style={{ color: colors.gold, marginTop: 8 }}>{money(price)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 18, backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>CURRENT ORDER</Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 4 }}>
            {order ? `#${order.number}${order.tabNo ? ` · ${order.tabNo}` : ""}` : "No order"}
          </Text>
          <Text style={{ color: colors.muted }}>{table?.label || "Walk-up"} · {order?.customerName || user.name}</Text>
          {(order?.items || []).map((item) => (
            <View key={item.id} style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: item.voided ? colors.muted : colors.text, textDecorationLine: item.voided ? "line-through" : "none" }}>
                  {item.quantity}× {item.name}
                </Text>
                <Text style={{ color: colors.gold }}>{money(lineTotal(item))}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                <Small onPress={() => void run(() => api.changeQty(order!.id, item.id, -1))} label="−" />
                <Small onPress={() => void run(() => api.changeQty(order!.id, item.id, 1))} label="+" />
                <Small onPress={() => void run(() => api.voidItem(order!.id, item.id))} label="Void" danger />
              </View>
            </View>
          ))}
          {totals && order ? (
            <View style={{ marginTop: 12, gap: 4 }}>
              <Row label="Subtotal" value={money(totals.sub)} />
              <Row label="Service" value={money(totals.service)} />
              <Row label="Tax" value={money(totals.tax)} />
              <Row label="TOTAL" value={money(totals.total)} strong />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                <Action label="Hold" onPress={() => void run(() => api.holdOrder(order.id))} />
                <Action label="Send" onPress={() => void run(() => api.sendOrder(order.id))} />
                <Action label="10% off" onPress={() => void run(() => api.applyDiscount(order.id, { kind: "percent", label: "10% off", amount: totals.sub * 0.1 }))} />
                <Action label="PAY" primary onPress={() => setPaying(true)} />
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => void ensureOrder()}
              style={{ marginTop: 12, height: 44, borderRadius: 12, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#000", fontWeight: "800" }}>New walk-up order</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Modal visible={paying} transparent animationType="slide" onRequestClose={() => setPaying(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.65)" }}>
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 }}>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
              Pay {totals ? money(totals.due) : ""}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {METHODS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setMethod(item)}
                  style={{
                    paddingHorizontal: 12,
                    height: 40,
                    borderRadius: 10,
                    justifyContent: "center",
                    backgroundColor: method === item ? colors.green : "#161616",
                  }}
                >
                  <Text style={{ color: method === item ? "#000" : colors.text, fontWeight: "800", textTransform: "uppercase" }}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
              <Pressable onPress={() => setPaying(false)} style={{ flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>Close</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  if (!order || !totals) return;
                  await run(() => api.payOrder(order.id, method, totals.due));
                  setPaying(false);
                  Alert.alert("Paid", `Order #${order.number} is paid.`);
                }}
                style={{ flex: 1, height: 48, borderRadius: 12, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#000", fontWeight: "800" }}>Collect</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: strong ? "800" : "500" }}>{value}</Text>
    </View>
  );
}

function Small({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ minWidth: 36, height: 32, borderRadius: 8, backgroundColor: "#1c1c1c", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }}>
      <Text style={{ color: danger ? colors.red : colors.text, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

function Action({ label, onPress, primary }: { label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 10,
        justifyContent: "center",
        backgroundColor: primary ? colors.green : "#161616",
      }}
    >
      <Text style={{ color: primary ? "#000" : colors.text, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as api from "./api";
import { loadApiUrl } from "./config";
import { isToday, orderTotals } from "./money";
import type { ClubState, Order, Staff } from "./types";

type ClubContextValue = {
  state: ClubState | null;
  user: Staff | null;
  ready: boolean;
  busy: boolean;
  error: string | null;
  apiUrl: string;
  activeOrder: Order | null;
  setActiveOrderId: (id: string | null) => void;
  login: (pin: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  run: <T extends { state: ClubState }>(fn: () => Promise<T>) => Promise<T>;
};

const ClubContext = createContext<ClubContextValue | null>(null);

export function ClubProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClubState | null>(null);
  const [user, setUser] = useState<Staff | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await api.fetchClub();
    setState(next);
  }, []);

  useEffect(() => {
    void (async () => {
      const url = await loadApiUrl();
      setApiUrl(url);
      const saved = await AsyncStorage.getItem("pos-club-user");
      if (saved) {
        try {
          setUser(JSON.parse(saved) as Staff);
        } catch {
          await AsyncStorage.removeItem("pos-club-user");
        }
      }
      const savedOrder = await AsyncStorage.getItem("pos-club-order");
      if (savedOrder) setActiveOrderId(savedOrder);
      try {
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Cannot reach 199X POS server");
      }
      setReady(true);
    })();
  }, [refresh]);

  const login = useCallback(async (pin: string) => {
    const result = await api.login(pin);
    if (!result.user) throw new Error("Invalid PIN");
    setUser(result.user);
    setState(result.state);
    await AsyncStorage.setItem("pos-club-user", JSON.stringify(result.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    void AsyncStorage.removeItem("pos-club-user");
  }, []);

  const run = useCallback(async <T extends { state: ClubState }>(fn: () => Promise<T>) => {
    setBusy(true);
    setError(null);
    try {
      const result = await fn();
      setState(result.state);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
      throw err;
    } finally {
      setBusy(false);
    }
  }, []);

  const activate = useCallback((id: string | null) => {
    setActiveOrderId(id);
    if (id) void AsyncStorage.setItem("pos-club-order", id);
    else void AsyncStorage.removeItem("pos-club-order");
  }, []);

  const activeOrder =
    state?.orders.find((order) => order.id === activeOrderId) ??
    state?.orders.find((order) => order.status === "open" || order.status === "sent") ??
    null;

  const value = useMemo(
    () => ({
      state,
      user,
      ready,
      busy,
      error,
      apiUrl,
      activeOrder,
      setActiveOrderId: activate,
      login,
      logout,
      refresh,
      run,
    }),
    [state, user, ready, busy, error, apiUrl, activeOrder, activate, login, logout, refresh, run],
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub() {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used inside ClubProvider");
  return ctx;
}

export function useDashboard(state: ClubState | null) {
  return useMemo(() => {
    if (!state) return null;
    const today = state.orders.filter((order) => isToday(order.createdAt));
    const paid = today.filter((order) => order.status === "paid");
    const open = state.orders.filter(
      (order) => order.status === "open" || order.status === "sent" || order.status === "held",
    );
    const totals = paid.map((order) =>
      orderTotals(order, state.venue.taxRate, state.venue.serviceRate),
    );
    const gross = totals.reduce((sum, item) => sum + item.total, 0);
    const tax = totals.reduce((sum, item) => sum + item.tax, 0);
    const net = gross - tax;
    const byPay: Record<string, number> = {};
    for (const order of paid) {
      for (const payment of order.payments) {
        byPay[payment.method] = (byPay[payment.method] || 0) + payment.amount;
      }
    }
    const productCounts = new Map<string, { name: string; qty: number; sales: number }>();
    for (const order of paid) {
      for (const item of order.items) {
        if (item.voided) continue;
        const current = productCounts.get(item.productId) || { name: item.name, qty: 0, sales: 0 };
        current.qty += item.quantity;
        current.sales += item.unitPrice * item.quantity;
        productCounts.set(item.productId, current);
      }
    }
    const cost = paid.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((inner, item) => {
          const product = state.products.find((entry) => entry.id === item.productId);
          return inner + (product?.cost || 0) * item.quantity;
        }, 0)
      );
    }, 0);
    return {
      orders: today.length,
      openTables: state.tables.filter((table) => table.status === "occupied").length,
      openTabs: open.filter((order) => order.tabNo).length,
      gross,
      net,
      profit: net - cost,
      byPay,
      best: [...productCounts.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
      lowProducts: state.products.filter(
        (product) => !product.recipeId && product.inventory <= product.minimumStock,
      ),
      lowIngredients: state.ingredients.filter(
        (ingredient) => ingredient.stock <= ingredient.minimumStock,
      ),
      recent: state.orders.slice(0, 8),
    };
  }, [state]);
}

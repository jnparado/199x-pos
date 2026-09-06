import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isHappyHour, nid, nowIso, orderTotals } from "./money";
import { seedState } from "./seed";
import type {
  ClubState,
  Discount,
  InventoryTxn,
  Order,
  PayMethod,
} from "./types";

const file = path.join(process.cwd(), "data", "club-store.json");

const globalStore = globalThis as typeof globalThis & {
  __posClub?: ClubState;
};

function load(): ClubState {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as ClubState;
  } catch {
    return seedState();
  }
}

function save(state: ClubState) {
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Failed to persist club POS", error);
  }
}

export function getState(): ClubState {
  if (!globalStore.__posClub) {
    globalStore.__posClub = load();
  }
  if (globalStore.__posClub.venue.name === "POS Club") {
    globalStore.__posClub.venue.name = "199X Kadayawan";
  }
  return globalStore.__posClub;
}

function commit(): ClubState {
  const state = getState();
  save(state);
  return state;
}

function touch(order: Order): Order {
  return { ...order, updatedAt: nowIso() };
}

export function login(pin: string) {
  const user = getState().staff.find((staff) => staff.pin === pin && staff.active);
  if (!user) throw new Error("Invalid PIN");
  return user;
}

export function openOrder(input: {
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  serverId: string;
  asTab?: boolean;
}): Order {
  const state = getState();
  const createdAt = nowIso();
  const order: Order = {
    id: nid("ord"),
    number: state.nextOrder++,
    tabNo: input.asTab ? `TAB-${String(state.nextTab++).padStart(5, "0")}` : undefined,
    tableId: input.tableId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    serverId: input.serverId,
    status: "open",
    ticketStatus: "new",
    items: [],
    payments: [],
    createdAt,
    updatedAt: createdAt,
  };
  state.orders.unshift(order);
  if (input.tableId) {
    const table = state.tables.find((item) => item.id === input.tableId);
    if (table) {
      table.status = "occupied";
      table.orderId = order.id;
    }
  }
  commit();
  return order;
}

export function addItem(orderId: string, productId: string, note?: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  const product = state.products.find((item) => item.id === productId);
  if (!order || !product || order.status === "paid" || order.status === "void") {
    throw new Error("Cannot add item");
  }
  const happy = isHappyHour() && product.happyHourPrice != null;
  const existing = order.items.find(
    (item) => item.productId === productId && !item.voided && !item.note && !note,
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    order.items.push({
      id: nid("ln"),
      productId,
      name: product.name,
      unitPrice: happy ? product.happyHourPrice! : product.price,
      quantity: 1,
      note,
    });
  }
  deductInventory(state, productId, 1);
  const next = touch(order);
  Object.assign(order, next);
  commit();
  return order;
}

export function changeQty(orderId: string, lineId: string, delta: number) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  const line = order.items.find((item) => item.id === lineId);
  if (!line || line.voided) throw new Error("Line not found");
  const nextQty = line.quantity + delta;
  if (delta > 0) deductInventory(state, line.productId, delta);
  if (delta < 0) restock(state, line.productId, Math.abs(delta));
  if (nextQty <= 0) {
    order.items = order.items.filter((item) => item.id !== lineId);
  } else {
    line.quantity = nextQty;
  }
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function voidItem(orderId: string, lineId: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  const line = order.items.find((item) => item.id === lineId);
  if (!line) throw new Error("Line not found");
  line.voided = true;
  restock(state, line.productId, line.quantity);
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function voidOrder(orderId: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  for (const line of order.items) {
    if (!line.voided) restock(state, line.productId, line.quantity);
    line.voided = true;
  }
  order.status = "void";
  releaseTable(state, order);
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function holdOrder(orderId: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  order.status = order.status === "held" ? "open" : "held";
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function sendOrder(orderId: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  order.status = "sent";
  order.ticketStatus = "preparing";
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function setTicket(orderId: string, ticketStatus: Order["ticketStatus"]) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  order.ticketStatus = ticketStatus;
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function applyDiscount(orderId: string, discount: Discount) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  order.discount = discount;
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function setNote(orderId: string, lineId: string, note: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  const line = order.items.find((item) => item.id === lineId);
  if (!line) throw new Error("Line not found");
  line.note = note;
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function transferOrder(orderId: string, tableId: string) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  releaseTable(state, order);
  order.tableId = tableId;
  const table = state.tables.find((item) => item.id === tableId);
  if (table) {
    table.status = "occupied";
    table.orderId = order.id;
  }
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function mergeOrders(fromId: string, intoId: string) {
  const state = getState();
  const from = state.orders.find((item) => item.id === fromId);
  const into = state.orders.find((item) => item.id === intoId);
  if (!from || !into) throw new Error("Order not found");
  into.items.push(...from.items);
  from.items = [];
  from.status = "void";
  releaseTable(state, from);
  Object.assign(into, touch(into));
  Object.assign(from, touch(from));
  commit();
  return into;
}

export function payOrder(orderId: string, method: PayMethod, amount: number) {
  const state = getState();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Order not found");
  order.payments.push({
    id: nid("pay"),
    method,
    amount,
    createdAt: nowIso(),
  });
  const totals = orderTotals(order, state.venue.taxRate, state.venue.serviceRate);
  if (totals.paid + 0.01 >= totals.total) {
    order.status = "paid";
    order.paidAt = nowIso();
    order.ticketStatus = "served";
    releaseTable(state, order);
  }
  Object.assign(order, touch(order));
  commit();
  return order;
}

export function reserveTable(tableId: string) {
  const state = getState();
  const table = state.tables.find((item) => item.id === tableId);
  if (!table) throw new Error("Table not found");
  table.status = table.status === "reserved" ? "available" : "reserved";
  commit();
  return table;
}

export function adjustIngredient(ingredientId: string, qty: number, kind: InventoryTxn["kind"], note: string) {
  const state = getState();
  const ingredient = state.ingredients.find((item) => item.id === ingredientId);
  if (!ingredient) throw new Error("Ingredient not found");
  ingredient.stock += qty;
  state.txns.unshift({
    id: nid("txn"),
    ingredientId,
    kind,
    qty,
    note,
    createdAt: nowIso(),
  });
  commit();
  return ingredient;
}

export function resetClub() {
  globalStore.__posClub = seedState();
  return commit();
}

function deductInventory(state: ClubState, productId: string, qty: number) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  const recipe = state.recipes.find((item) => item.id === product.recipeId);
  if (recipe) {
    for (const part of recipe.items) {
      const ingredient = state.ingredients.find((item) => item.id === part.ingredientId);
      if (ingredient) {
        ingredient.stock = Math.max(0, ingredient.stock - part.qty * qty);
        state.txns.unshift({
          id: nid("txn"),
          ingredientId: ingredient.id,
          kind: "sale",
          qty: -(part.qty * qty),
          note: `Sold ${qty}× ${product.name}`,
          createdAt: nowIso(),
        });
      }
    }
    return;
  }
  product.inventory = Math.max(0, product.inventory - qty);
  state.txns.unshift({
    id: nid("txn"),
    productId: product.id,
    kind: "sale",
    qty: -qty,
    note: `Sold ${qty}× ${product.name}`,
    createdAt: nowIso(),
  });
}

function restock(state: ClubState, productId: string, qty: number) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  const recipe = state.recipes.find((item) => item.id === product.recipeId);
  if (recipe) {
    for (const part of recipe.items) {
      const ingredient = state.ingredients.find((item) => item.id === part.ingredientId);
      if (ingredient) ingredient.stock += part.qty * qty;
    }
    return;
  }
  product.inventory += qty;
}

function releaseTable(state: ClubState, order: Order) {
  if (!order.tableId) return;
  const table = state.tables.find((item) => item.id === order.tableId);
  if (table && table.orderId === order.id) {
    table.status = "available";
    table.orderId = undefined;
  }
}

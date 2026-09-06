export type Role =
  | "owner"
  | "manager"
  | "cashier"
  | "bartender"
  | "server"
  | "kitchen";

export type TableStatus = "available" | "occupied" | "reserved" | "closed";
export type OrderStatus = "open" | "held" | "sent" | "paid" | "void";
export type TicketStatus = "new" | "preparing" | "ready" | "served";
export type PayMethod = "cash" | "card" | "gcash" | "maya" | "bank";
export type DiscountKind = "percent" | "fixed" | "happy_hour" | "senior" | "pwd" | "promo";

export type Staff = {
  id: string;
  name: string;
  role: Role;
  pin: string;
  active: boolean;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  price: number;
  cost: number;
  happyHourPrice?: number;
  unit: string;
  inventory: number;
  minimumStock: number;
  active: boolean;
  recipeId?: string;
};

export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minimumStock: number;
  cost: number;
};

export type RecipeItem = {
  ingredientId: string;
  qty: number;
};

export type Recipe = {
  id: string;
  productId: string;
  items: RecipeItem[];
};

export type FloorTable = {
  id: string;
  label: string;
  section: "floor" | "bar" | "vip";
  seats: number;
  status: TableStatus;
  orderId?: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note?: string;
  voided?: boolean;
};

export type Payment = {
  id: string;
  method: PayMethod;
  amount: number;
  createdAt: string;
};

export type Discount = {
  kind: DiscountKind;
  label: string;
  amount: number;
};

export type Order = {
  id: string;
  number: number;
  tabNo?: string;
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  serverId: string;
  status: OrderStatus;
  ticketStatus: TicketStatus;
  items: OrderItem[];
  payments: Payment[];
  discount?: Discount;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
};

export type InventoryTxn = {
  id: string;
  ingredientId?: string;
  productId?: string;
  kind: "in" | "out" | "waste" | "sale" | "adjust";
  qty: number;
  note: string;
  createdAt: string;
};

export type ClubState = {
  venue: {
    name: string;
    city: string;
    taxRate: number;
    serviceRate: number;
  };
  staff: Staff[];
  categories: Category[];
  products: Product[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  tables: FloorTable[];
  orders: Order[];
  txns: InventoryTxn[];
  nextOrder: number;
  nextTab: number;
};

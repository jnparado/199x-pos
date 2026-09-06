export type MenuCategory =
  | "draft"
  | "bottles"
  | "wine"
  | "cocktails"
  | "spirits"
  | "shots"
  | "na"
  | "food";

export type TicketStatus = "open" | "sent" | "paid" | "void";
export type PaymentMethod = "cash" | "card" | "split" | "comp";
export type SeatKind = "bar" | "table" | "booth" | "patio" | "walkup";

export type Modifier = {
  id: string;
  label: string;
  price: number;
};

export type MenuItem = {
  id: string;
  sku: string;
  name: string;
  category: MenuCategory;
  price: number;
  happyHourPrice?: number;
  description?: string;
  modifiers?: Modifier[];
  popular?: boolean;
  source: "local" | "existing-pos";
};

export type TicketLine = {
  id: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: Modifier[];
  note?: string;
  comped?: boolean;
};

export type Payment = {
  id: string;
  method: PaymentMethod;
  amount: number;
  tendered?: number;
  createdAt: string;
};

export type Seat = {
  id: string;
  label: string;
  kind: SeatKind;
  capacity: number;
};

export type Ticket = {
  id: string;
  number: number;
  seatId: string;
  guestName?: string;
  guestCount: number;
  server: string;
  status: TicketStatus;
  lines: TicketLine[];
  payments: Payment[];
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  syncedToExisting: boolean;
};

export type PosConnection = {
  mode: "local" | "connected";
  existingPosUrl: string;
  healthy: boolean;
  lastSyncAt: string | null;
  message: string;
};

export type CatalogResponse = {
  items: MenuItem[];
  connection: PosConnection;
};

export type TicketPayload = {
  seatId: string;
  guestName?: string;
  guestCount: number;
  server: string;
};

export type PayPayload = {
  method: PaymentMethod;
  amount: number;
  tendered?: number;
};

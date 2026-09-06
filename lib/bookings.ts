import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type BookingKind = "table" | "private" | "event";

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  kind: BookingKind;
  eventId?: string;
  notes?: string;
  createdAt: string;
  status: "pending";
};

const file = path.join(process.cwd(), "data", "bookings.json");

const globalStore = globalThis as typeof globalThis & {
  __bookings?: Booking[];
};

function load(): Booking[] {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Booking[];
  } catch {
    return [];
  }
}

function save(list: Booking[]) {
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(list, null, 2));
  } catch (error) {
    console.error("Failed to persist bookings", error);
  }
}

function all(): Booking[] {
  if (!globalStore.__bookings) globalStore.__bookings = load();
  return globalStore.__bookings;
}

export function createBooking(input: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const booking: Booking = {
    ...input,
    id: `bk_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  const list = all();
  list.unshift(booking);
  save(list);
  return booking;
}

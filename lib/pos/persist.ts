import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Ticket } from "../types";

export type PersistedSlice = {
  tickets: Ticket[];
  nextNumber: number;
};

export type PersistedStores = {
  bar: PersistedSlice;
  legacy: PersistedSlice;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "pos-store.json");

export function loadPersisted(): PersistedStores | null {
  try {
    const raw = readFileSync(dataFile, "utf8");
    return JSON.parse(raw) as PersistedStores;
  } catch {
    return null;
  }
}

export function savePersisted(data: PersistedStores): void {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

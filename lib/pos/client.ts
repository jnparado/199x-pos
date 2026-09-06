import { nowIso } from "../format";
import type { CatalogResponse, MenuItem, PosConnection, Ticket } from "../types";
import { getPosConfig } from "./config";
import {
  getBarStore,
  getLegacyStore,
  legacyCatalog,
  listTickets,
  localCatalog,
  upsertTicket,
} from "./store";

type ExistingHealth = { ok: boolean; venue?: string };
type ExistingCatalog = { items?: MenuItem[] };
type ExistingTickets = { tickets?: Ticket[] };

function usesBuiltInLegacy(url: string): boolean {
  return url.includes("/api/legacy-pos");
}

async function existingFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; data?: T; message: string }> {
  const config = getPosConfig();

  if (usesBuiltInLegacy(config.existingPosUrl)) {
    return handleBuiltInLegacy<T>(path, init);
  }

  const url = `${config.existingPosUrl}${path}`;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        message: `Existing POS returned ${response.status} for ${path}`,
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data, message: "Connected" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not reach existing POS";
    return { ok: false, message };
  }
}

function handleBuiltInLegacy<T>(
  path: string,
  init?: RequestInit,
): { ok: boolean; data?: T; message: string } {
  const config = getPosConfig();

  if (path === "/health") {
    return {
      ok: true,
      data: {
        ok: true,
        venue: `${config.venueName} existing register`,
      } as T,
      message: "Connected",
    };
  }

  if (path === "/catalog") {
    return {
      ok: true,
      data: { items: legacyCatalog() } as T,
      message: "Connected",
    };
  }

  if (path === "/tickets" && (!init?.method || init.method === "GET")) {
    return {
      ok: true,
      data: { tickets: listTickets(getLegacyStore()) } as T,
      message: "Connected",
    };
  }

  if (path === "/tickets" && init?.method === "POST") {
    const ticket = JSON.parse(String(init.body)) as Ticket;
    const saved = upsertTicket(getLegacyStore(), {
      ...ticket,
      syncedToExisting: true,
    });
    return { ok: true, data: { ticket: saved } as T, message: "Connected" };
  }

  return { ok: false, message: `Legacy POS has no handler for ${path}` };
}

export async function checkExistingPos(): Promise<PosConnection> {
  const config = getPosConfig();
  const result = await existingFetch<ExistingHealth>("/health");

  return {
    mode: result.ok ? "connected" : "local",
    existingPosUrl: config.existingPosUrl,
    healthy: result.ok,
    lastSyncAt: result.ok ? nowIso() : null,
    message: result.ok
      ? `Linked to ${result.data?.venue || "existing POS"}`
      : `${result.message}. Running on local catalog.`,
  };
}

export async function getMergedCatalog(): Promise<CatalogResponse> {
  const connection = await checkExistingPos();
  const local = localCatalog();

  if (!connection.healthy) {
    return { items: local, connection };
  }

  const remote = await existingFetch<ExistingCatalog>("/catalog");
  if (!remote.ok || !remote.data?.items) {
    return {
      items: local,
      connection: {
        ...connection,
        healthy: false,
        mode: "local",
        message: remote.message,
      },
    };
  }

  const bySku = new Map<string, MenuItem>();
  for (const item of local) {
    bySku.set(item.sku, item);
  }
  for (const item of remote.data.items) {
    bySku.set(item.sku, { ...item, source: "existing-pos" });
  }

  return {
    items: [...bySku.values()],
    connection: {
      ...connection,
      lastSyncAt: nowIso(),
      message: `Catalog synced · ${remote.data.items.length} items from existing POS`,
    },
  };
}

export async function pushTicket(ticket: Ticket): Promise<Ticket> {
  const store = getBarStore();
  const connection = await checkExistingPos();

  if (!connection.healthy) {
    return upsertTicket(store, { ...ticket, syncedToExisting: false });
  }

  const remote = await existingFetch<{ ticket?: Ticket }>("/tickets", {
    method: "POST",
    body: JSON.stringify(ticket),
  });

  return upsertTicket(store, {
    ...ticket,
    syncedToExisting: remote.ok,
  });
}

export async function pullRemoteTickets(): Promise<Ticket[]> {
  const remote = await existingFetch<ExistingTickets>("/tickets");
  if (!remote.ok || !remote.data?.tickets) {
    return listTickets(getBarStore());
  }
  return remote.data.tickets;
}

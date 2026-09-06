export function money(centsOrDollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(centsOrDollars);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function ticketLabel(ticket: { number: number; guestName?: string }): string {
  return ticket.guestName ? `#${ticket.number} · ${ticket.guestName}` : `#${ticket.number}`;
}

export function isHappyHour(date = new Date()): boolean {
  const hour = date.getHours();
  const day = date.getDay();
  if (day === 0) return false;
  return hour >= 16 && hour < 19;
}

export function lineTotal(line: {
  unitPrice: number;
  quantity: number;
  modifiers: { price: number }[];
  comped?: boolean;
}): number {
  if (line.comped) return 0;
  const extras = line.modifiers.reduce((sum, modifier) => sum + modifier.price, 0);
  return (line.unitPrice + extras) * line.quantity;
}

export function ticketSubtotal(
  lines: {
    unitPrice: number;
    quantity: number;
    modifiers: { price: number }[];
    comped?: boolean;
  }[],
): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function taxOn(subtotal: number, rate = 0.08875): number {
  return Math.round(subtotal * rate * 100) / 100;
}

export function paidTotal(payments: { amount: number }[]): number {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

import type { Discount, Order, OrderItem } from "./types";

export const TAX_RATE = 0.12;
export const SERVICE_RATE = 0.1;

export function money(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function nid(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function isHappyHour(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 17 && hour < 19;
}

export function lineTotal(item: OrderItem): number {
  if (item.voided) return 0;
  return item.unitPrice * item.quantity;
}

export function subtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function discountAmount(sub: number, discount?: Discount): number {
  return discount?.amount ?? 0;
}

export function serviceCharge(sub: number, rate = SERVICE_RATE): number {
  return Math.round(sub * rate * 100) / 100;
}

export function taxOn(amount: number, rate = TAX_RATE): number {
  return Math.round(amount * rate * 100) / 100;
}

export function orderTotals(order: Order, taxRate = TAX_RATE, serviceRate = SERVICE_RATE) {
  const sub = subtotal(order.items);
  const disc = discountAmount(sub, order.discount);
  const afterDisc = Math.max(sub - disc, 0);
  const service = serviceCharge(afterDisc, serviceRate);
  const tax = taxOn(afterDisc + service, taxRate);
  const total = afterDisc + service + tax;
  const paid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    sub,
    disc,
    service,
    tax,
    total,
    paid,
    due: Math.max(total - paid, 0),
  };
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isToday(iso: string): boolean {
  return iso.slice(0, 10) === todayKey();
}

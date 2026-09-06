import type { Order, OrderItem } from "./types";

export function money(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function isHappyHour(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 17 && hour < 19;
}

export function lineTotal(item: OrderItem): number {
  if (item.voided) return 0;
  return item.unitPrice * item.quantity;
}

export function orderTotals(order: Order, taxRate = 0.12, serviceRate = 0.1) {
  const sub = order.items.reduce((sum, item) => sum + lineTotal(item), 0);
  const disc = order.discount?.amount ?? 0;
  const afterDisc = Math.max(sub - disc, 0);
  const service = Math.round(afterDisc * serviceRate * 100) / 100;
  const tax = Math.round((afterDisc + service) * taxRate * 100) / 100;
  const total = afterDisc + service + tax;
  const paid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return { sub, disc, service, tax, total, paid, due: Math.max(total - paid, 0) };
}

export function isToday(iso: string): boolean {
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
}


import { createBooking, type BookingKind } from "@/lib/bookings";
import { corsHeaders, withCors } from "@/lib/club/cors";

const KINDS = new Set<BookingKind>(["table", "private", "event"]);

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    kind: BookingKind;
    eventId: string;
    notes: string;
  }>;

  const name = body.name?.trim() || "";
  const phone = body.phone?.trim() || "";
  const date = body.date?.trim() || "";
  const time = body.time?.trim() || "";
  const guests = Number(body.guests);
  const kind = body.kind;

  if (!name || !phone || !date || !time || !kind || !KINDS.has(kind) || !Number.isFinite(guests) || guests < 1) {
    return withCors(Response.json({ error: "Please complete name, phone, date, time, guests, and booking type." }, { status: 400 }));
  }

  const booking = createBooking({
    name,
    phone,
    email: body.email?.trim() || undefined,
    date,
    time,
    guests: Math.min(Math.round(guests), 40),
    kind,
    eventId: body.eventId?.trim() || undefined,
    notes: body.notes?.trim() || undefined,
  });

  return withCors(Response.json({ booking }));
}

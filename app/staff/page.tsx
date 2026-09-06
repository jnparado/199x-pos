"use client";

import { useClub } from "@/lib/club/use-club";

const MATRIX: { feature: string; roles: string[] }[] = [
  { feature: "POS", roles: ["owner", "manager", "cashier", "bartender", "server"] },
  { feature: "Refund / void", roles: ["owner", "manager"] },
  { feature: "Inventory", roles: ["owner", "manager"] },
  { feature: "Reports", roles: ["owner", "manager"] },
  { feature: "Settings", roles: ["owner", "manager"] },
  { feature: "User management", roles: ["owner", "manager"] },
];

export default function StaffPage() {
  const { state, user } = useClub();
  if (!state) return <p className="p-6 text-zinc-400">Loading staff…</p>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Team</p>
        <h1 className="mt-1 text-2xl font-semibold">Staff & roles</h1>
        <p className="mt-2 text-sm text-zinc-400">Signed in as {user?.name} ({user?.role}).</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {state.staff.map((staff) => (
          <div key={staff.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="font-semibold">{staff.name}</p>
            <p className="text-sm capitalize text-zinc-400">{staff.role} · PIN {staff.pin}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-white/4 text-zinc-400">
            <tr>
              <th className="px-3 py-2">Feature</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2">Cashier</th>
              <th className="px-3 py-2">Bartender</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => (
              <tr key={row.feature} className="border-t border-white/6">
                <td className="px-3 py-2">{row.feature}</td>
                {["owner", "manager", "cashier", "bartender"].map((role) => (
                  <td key={role} className="px-3 py-2">
                    {row.roles.includes(role) ? "✓" : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

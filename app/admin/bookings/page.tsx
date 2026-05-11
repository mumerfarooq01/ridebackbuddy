"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Booking {
  id: string;
  createdAt: string;
  status: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  region: string;
  paymentMethod: string;
  stops: number;
  fareTotal: number;
  fullName: string;
  phone: string;
  email: string;
  passengers: number;
  accessibility: boolean;
  specialNotes: string | null;
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber-800",
  confirmed: "bg-mint/20 text-green-800",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Bookings</h1>
          <p className="text-muted text-sm mt-1">{bookings.length} total</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filter === s ? "bg-navy text-white" : "bg-white border border-mist text-muted hover:border-navy"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-mist rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cloud">
                <tr>
                  {["Customer", "Service", "Pickup", "Fare", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-cloud/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-navy">{b.fullName}</p>
                      <p className="text-muted text-xs">{b.phone}</p>
                      <p className="text-muted text-xs">{b.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-navy capitalize">{b.serviceType.replace("-", " ")}</p>
                      <p className="text-muted text-xs">{b.pickupDate} {b.pickupTime}</p>
                    </td>
                    <td className="px-5 py-4 max-w-[180px]">
                      <p className="text-navy text-xs truncate" title={b.pickupAddress}>{b.pickupAddress}</p>
                      <p className="text-muted text-xs truncate" title={b.dropoffAddress}>→ {b.dropoffAddress}</p>
                      {b.specialNotes && <p className="text-muted text-xs italic mt-1 truncate">{b.specialNotes}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy">${b.fareTotal.toFixed(2)}</p>
                      <p className="text-muted text-xs capitalize">{b.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border-none outline-none cursor-pointer ${statusColors[b.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

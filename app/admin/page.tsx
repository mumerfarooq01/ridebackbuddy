"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, MessageSquare, Clock, CheckCircle } from "lucide-react";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalContacts: number;
  unreadContacts: number;
  recentBookings: {
    id: string;
    fullName: string;
    serviceType: string;
    pickupDate: string;
    fareTotal: number;
    status: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber-800",
  confirmed: "bg-mint/20 text-green-800",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-navy" },
    { label: "Pending", value: stats.pendingBookings, icon: Clock, color: "text-amber-600" },
    { label: "Confirmed", value: stats.confirmedBookings, icon: CheckCircle, color: "text-green-600" },
    { label: "Unread Messages", value: stats.unreadContacts, icon: MessageSquare, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of your operations</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">{card.label}</p>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className={`font-heading text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-mist rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-mist">
          <h2 className="font-heading font-semibold text-navy">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cloud">
              <tr>
                {["Customer", "Service", "Date", "Fare", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {stats.recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-cloud/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">{b.fullName}</td>
                  <td className="px-6 py-4 text-muted capitalize">{b.serviceType.replace("-", " ")}</td>
                  <td className="px-6 py-4 text-muted">{b.pickupDate}</td>
                  <td className="px-6 py-4 font-medium text-navy">${b.fareTotal.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted">No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

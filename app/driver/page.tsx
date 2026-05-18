"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, User, Phone, CheckCircle } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string | null;
  vehicleInfo: string | null;
  status: string;
}

interface Booking {
  id: string;
  status: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  fullName: string;
  phone: string;
  passengers: number;
  fareTotal: number;
  specialNotes: string | null;
  accessibility: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
};

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  busy: "bg-amber/20 text-amber-800 border-amber/30",
  offline: "bg-gray-100 text-gray-500 border-gray-200",
};

const DRIVER_STATUSES = ["available", "busy", "offline"];

export default function DriverDashboard() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/driver/me").then((r) => r.json()),
      fetch("/api/driver/bookings").then((r) => r.json()),
    ])
      .then(([d, b]) => {
        setDriver(d);
        setBookings(b);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/driver/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDriver((d) => (d ? { ...d, status } : d));
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!driver) return null;

  const upcoming = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled");
  const past = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-mist shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-navy">{driver.name}</h1>
            <p className="text-muted text-sm">{driver.email}</p>
            {driver.vehicleInfo && (
              <p className="text-muted text-xs mt-0.5">{driver.vehicleInfo}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors[driver.status] ?? "bg-gray-100 text-gray-500"}`}
            >
              {STATUS_LABELS[driver.status] ?? driver.status}
            </span>
          </div>
        </div>

        {/* Status toggle */}
        <div className="mt-4 pt-4 border-t border-mist">
          <p className="text-xs text-muted font-medium mb-2">Update your status</p>
          <div className="flex gap-2 flex-wrap">
            {DRIVER_STATUSES.map((s) => (
              <button
                key={s}
                disabled={updatingStatus || driver.status === s}
                onClick={() => updateStatus(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all disabled:opacity-50 ${
                  driver.status === s
                    ? "bg-navy text-white"
                    : "bg-white border border-mist text-muted hover:border-navy"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-mist p-4">
          <p className="text-muted text-xs font-medium">Total Rides</p>
          <p className="font-heading text-2xl font-bold text-navy mt-1">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-mist p-4">
          <p className="text-muted text-xs font-medium">Upcoming</p>
          <p className="font-heading text-2xl font-bold text-navy mt-1">{upcoming.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-mist p-4 col-span-2 sm:col-span-1">
          <p className="text-muted text-xs font-medium">Completed</p>
          <p className="font-heading text-2xl font-bold text-navy mt-1">
            {bookings.filter((b) => b.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Upcoming rides */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="font-heading font-semibold text-navy mb-3">Upcoming Rides</h2>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </section>
      )}

      {/* Past rides */}
      {past.length > 0 && (
        <section>
          <h2 className="font-heading font-semibold text-navy mb-3">Past Rides</h2>
          <div className="space-y-3">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} muted />
            ))}
          </div>
        </section>
      )}

      {bookings.length === 0 && (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center">
          <CheckCircle className="w-10 h-10 text-mist mx-auto mb-3" />
          <p className="text-navy font-medium">No rides assigned yet</p>
          <p className="text-muted text-sm mt-1">
            Set your status to Available so admins can assign you rides.
          </p>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking: b, muted = false }: { booking: Booking; muted?: boolean }) {
  const bookingStatusColors: Record<string, string> = {
    pending: "bg-amber/20 text-amber-800",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div className={`bg-white rounded-2xl border border-mist shadow-sm p-5 ${muted ? "opacity-70" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-navy capitalize">
              {b.serviceType.replace("-", " ")}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${bookingStatusColors[b.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {b.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted text-xs mt-0.5">
            <Clock className="w-3 h-3" />
            {b.pickupDate} at {b.pickupTime}
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-navy">${b.fareTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex items-start gap-2 text-xs">
          <MapPin className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
          <span className="text-navy">{b.pickupAddress}</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <MapPin className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
          <span className="text-muted">{b.dropoffAddress}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-mist">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <User className="w-3 h-3" />
          <span className="text-navy font-medium">{b.fullName}</span>
          <span>· {b.passengers} pax</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Phone className="w-3 h-3" />
          {b.phone}
        </div>
      </div>

      {b.specialNotes && (
        <p className="mt-2 text-xs text-muted italic bg-cloud rounded-lg px-3 py-2">
          {b.specialNotes}
        </p>
      )}
    </div>
  );
}

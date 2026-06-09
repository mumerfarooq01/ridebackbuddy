"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  UserCheck,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  CalendarClock,
  CreditCard,
  Accessibility,
  Route,
} from "lucide-react";

interface DriverSummary {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: string;
  vehicleInfo?: string | null;
  licenseNo?: string | null;
}

interface Booking {
  id: string;
  createdAt: string;
  status: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupLat: number | null;
  pickupLng: number | null;
  dropoffAddress: string;
  dropoffLat: number | null;
  dropoffLng: number | null;
  estimatedDistance: number | null;
  region: string;
  paymentMethod: string;
  stops: number;
  use407: boolean;
  km407: number;
  fareTotal: number;
  fullName: string;
  phone: string;
  email: string;
  passengers: number;
  accessibility: boolean;
  specialNotes: string | null;
  driverId: string | null;
  driver: DriverSummary | null;
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber-800",
  confirmed: "bg-mint/20 text-green-800",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
};

const driverStatusDot: Record<string, string> = {
  available: "bg-green-500",
  busy: "bg-amber-400",
  offline: "bg-gray-400",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-navy text-sm">{value}</p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-mist rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber">{icon}</span>
        <h2 className="font-heading text-sm font-bold text-navy uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [drivers, setDrivers] = useState<DriverSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/bookings/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/drivers").then((r) => r.json()),
    ])
      .then(([b, d]) => {
        if (!b) setNotFound(true);
        else setBooking(b);
        setDrivers(d);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBooking((prev) => (prev ? { ...prev, status } : prev));
  };

  const assignDriver = async (driverId: string | null) => {
    setAssigning(true);
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });
      const driver = driverId ? (drivers.find((d) => d.id === driverId) ?? null) : null;
      setBooking((prev) => (prev ? { ...prev, driverId, driver } : prev));
    } finally {
      setAssigning(false);
    }
  };

  const deleteBooking = async () => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    router.push("/admin/bookings");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/admin/bookings")}
          className="flex items-center gap-2 text-muted hover:text-navy transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to bookings
        </button>
        <div className="bg-white border border-mist rounded-2xl shadow-sm p-12 text-center text-muted">
          Booking not found.
        </div>
      </div>
    );
  }

  const b = booking;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/admin/bookings")}
          className="flex items-center gap-2 text-muted hover:text-navy transition-colors text-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to bookings
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-navy capitalize">
                {b.serviceType.replace("-", " ")}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status] ?? "bg-gray-100 text-gray-600"}`}
              >
                {b.status}
              </span>
            </div>
            <p className="text-muted text-sm mt-1">
              Booked {new Date(b.createdAt).toLocaleString()} · #{b.id.slice(-8)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={b.status}
              onChange={(e) => updateStatus(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border-none outline-none cursor-pointer ${statusColors[b.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={deleteBooking}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip */}
        <Section title="Trip" icon={<Route className="w-4 h-4" />}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Pickup</p>
                <p className="text-navy text-sm">{b.pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Drop-off</p>
                <p className="text-navy text-sm">{b.dropoffAddress}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-mist">
              <Field label="Region" value={b.region} />
              <Field label="Stops" value={b.stops} />
              <Field
                label="Distance"
                value={b.estimatedDistance != null ? `${b.estimatedDistance.toFixed(1)} km` : "—"}
              />
              <Field label="407 ETR" value={b.use407 ? `Yes (${b.km407.toFixed(1)} km)` : "No"} />
            </div>
          </div>
        </Section>

        {/* Schedule */}
        <Section title="Schedule" icon={<CalendarClock className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Pickup date" value={b.pickupDate} />
            <Field label="Pickup time" value={b.pickupTime} />
            <Field label="Passengers" value={b.passengers} />
            <Field
              label="Accessibility"
              value={
                b.accessibility ? (
                  <span className="inline-flex items-center gap-1 text-amber-800">
                    <Accessibility className="w-4 h-4" /> Required
                  </span>
                ) : (
                  "Not required"
                )
              }
            />
          </div>
          {b.specialNotes && (
            <div className="mt-4 pt-4 border-t border-mist">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Special notes</p>
              <p className="text-navy text-sm italic">{b.specialNotes}</p>
            </div>
          )}
        </Section>

        {/* Customer */}
        <Section title="Customer" icon={<User className="w-4 h-4" />}>
          <div className="space-y-3">
            <Field label="Name" value={b.fullName} />
            <div className="flex flex-col sm:flex-row sm:gap-8 gap-3">
              <a
                href={`tel:${b.phone}`}
                className="inline-flex items-center gap-2 text-navy text-sm hover:text-amber transition-colors"
              >
                <Phone className="w-4 h-4 text-muted" /> {b.phone}
              </a>
              <a
                href={`mailto:${b.email}`}
                className="inline-flex items-center gap-2 text-navy text-sm hover:text-amber transition-colors"
              >
                <Mail className="w-4 h-4 text-muted" /> {b.email}
              </a>
            </div>
          </div>
        </Section>

        {/* Payment */}
        <Section title="Payment" icon={<CreditCard className="w-4 h-4" />}>
          <div className="flex items-end justify-between">
            <Field label="Method" value={<span className="capitalize">{b.paymentMethod}</span>} />
            <div className="text-right">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Fare total</p>
              <p className="text-navy text-2xl font-bold">${b.fareTotal.toFixed(2)}</p>
            </div>
          </div>
        </Section>

        {/* Driver */}
        <Section title="Driver" icon={<Car className="w-4 h-4" />}>
          <div className="space-y-4">
            {b.driver ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${driverStatusDot[b.driver.status] ?? "bg-gray-400"}`}
                  />
                  <span className="text-navy text-sm font-semibold">{b.driver.name}</span>
                  <span className="text-muted text-xs capitalize">({b.driver.status})</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {b.driver.phone && <Field label="Phone" value={b.driver.phone} />}
                  {b.driver.email && <Field label="Email" value={b.driver.email} />}
                  {b.driver.vehicleInfo && <Field label="Vehicle" value={b.driver.vehicleInfo} />}
                  {b.driver.licenseNo && <Field label="License" value={b.driver.licenseNo} />}
                </div>
              </div>
            ) : (
              <p className="text-muted text-sm">No driver assigned yet.</p>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-mist">
              <UserCheck className="w-4 h-4 text-muted flex-shrink-0" />
              <select
                value={b.driverId ?? ""}
                disabled={assigning}
                onChange={(e) => assignDriver(e.target.value || null)}
                className="text-sm text-navy border border-mist rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber cursor-pointer disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

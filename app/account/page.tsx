"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Car, Phone, CalendarCheck, RotateCcw } from "lucide-react";

interface Driver { name: string; phone: string; vehicleInfo: string | null }
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
  specialNotes: string | null;
  fullName: string;
  phone: string;
  email: string;
  fareTotal: number;
  passengers: number;
  accessibility: boolean;
  driver: Driver | null;
}

export default function AccountPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/bookings")
      .then((r) => r.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled");
  const past     = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">My Bookings</h1>
        <p className="text-muted text-sm mt-1">{bookings.length} total ride{bookings.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center">
          <CalendarCheck className="w-10 h-10 text-mist mx-auto mb-3" />
          <p className="font-semibold text-navy">No bookings yet</p>
          <p className="text-muted text-sm mt-1 mb-4">Your past and upcoming rides will appear here.</p>
          <a href="/book"
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-navy font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
            Book a Ride →
          </a>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="font-heading font-semibold text-navy mb-3 text-sm uppercase tracking-wide text-muted">Upcoming</h2>
              <div className="space-y-4">{upcoming.map((b) => <BookingCard key={b.id} b={b} />)}</div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="font-heading font-semibold text-navy mb-3 text-sm uppercase tracking-wide text-muted">Past Rides</h2>
              <div className="space-y-4 opacity-80">{past.map((b) => <BookingCard key={b.id} b={b} />)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function BookingCard({ b }: { b: Booking }) {
  const router = useRouter();

  const statusColors: Record<string, string> = {
    pending:   "bg-amber/20 text-amber-800",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-600",
  };

  const handleRebook = () => {
    const data = {
      serviceType:       b.serviceType,
      pickupAddress:     b.pickupAddress,
      pickupLat:         b.pickupLat,
      pickupLng:         b.pickupLng,
      dropoffAddress:    b.dropoffAddress,
      dropoffLat:        b.dropoffLat,
      dropoffLng:        b.dropoffLng,
      estimatedDistance: b.estimatedDistance,
      region:            b.region,
      paymentMethod:     b.paymentMethod,
      stops:             b.stops,
      use407:            b.use407,
      km407:             b.km407,
      specialNotes:      b.specialNotes,
      fullName:          b.fullName,
      phone:             b.phone,
      email:             b.email,
      passengers:        b.passengers,
      accessibility:     b.accessibility,
    };
    sessionStorage.setItem("ridebackRebook", JSON.stringify(data));
    router.push("/book");
  };

  return (
    <div className="bg-white rounded-2xl border border-mist shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-semibold text-navy capitalize">{b.serviceType.replace(/-/g, " ")}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[b.status] ?? "bg-gray-100 text-gray-600"}`}>
              {b.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted text-xs mt-0.5">
            <Clock className="w-3 h-3" /> {b.pickupDate} at {b.pickupTime}
          </div>
        </div>
        <p className="font-semibold text-navy whitespace-nowrap">${b.fareTotal.toFixed(2)}</p>
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

      <div className="pt-3 border-t border-mist flex items-center justify-between gap-4 flex-wrap">
        {b.driver ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Car className="w-3 h-3" />
              <span className="text-navy font-medium">{b.driver.name}</span>
              {b.driver.vehicleInfo && <span>· {b.driver.vehicleInfo}</span>}
            </div>
            <a href={`tel:${b.driver.phone}`}
              className="flex items-center gap-1.5 text-xs text-amber font-semibold hover:underline">
              <Phone className="w-3 h-3" /> {b.driver.phone}
            </a>
          </div>
        ) : <div />}

        <button
          onClick={handleRebook}
          className="flex items-center gap-1.5 text-xs font-semibold text-navy bg-amber/15 hover:bg-amber/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3 h-3" /> Book Again
        </button>
      </div>
    </div>
  );
}

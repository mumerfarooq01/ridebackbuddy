"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, KeyRound, Car, Phone, BadgeCheck } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string | null;
  vehicleInfo: string | null;
  status: string;
  createdAt: string;
  _count: { bookings: number };
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  busy: "bg-amber/20 text-amber-800",
  offline: "bg-gray-100 text-gray-500",
};

const STATUSES = ["available", "busy", "offline"];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwModal, setPwModal] = useState<{ id: string; name: string } | null>(null);
  const [newPw, setNewPw] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    licenseNo: "",
    vehicleInfo: "",
  });

  useEffect(() => {
    fetch("/api/admin/drivers")
      .then((r) => r.json())
      .then(setDrivers)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error } = await res.json();
        alert(error);
        return;
      }
      const driver = await res.json();
      setDrivers((prev) => [{ ...driver, _count: { bookings: 0 } }, ...prev]);
      setForm({ name: "", email: "", password: "", phone: "", licenseNo: "", vehicleInfo: "" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this driver? Their bookings will be unassigned.")) return;
    await fetch(`/api/admin/drivers/${id}`, { method: "DELETE" });
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/drivers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const handlePasswordChange = async () => {
    if (!pwModal) return;
    if (!newPw || newPw.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    await fetch(`/api/admin/drivers/${pwModal.id}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPw }),
    });
    setPwModal(null);
    setNewPw("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Drivers</h1>
          <p className="text-muted text-sm mt-1">{drivers.length} registered</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-amber text-navy rounded-xl text-sm font-semibold hover:bg-amber/80 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-mist rounded-2xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-navy mb-4">New Driver</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Password *</label>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Phone *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">License No.</label>
              <input
                value={form.licenseNo}
                onChange={(e) => setForm((f) => ({ ...f, licenseNo: e.target.value }))}
                className="w-full px-3 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Vehicle Info</label>
              <input
                placeholder="e.g. 2022 Toyota Camry – White"
                value={form.vehicleInfo}
                onChange={(e) => setForm((f) => ({ ...f, vehicleInfo: e.target.value }))}
                className="w-full px-3 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:border-amber"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-mist text-sm text-muted hover:border-navy transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Creating…" : "Create Driver"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drivers table */}
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
                  {["Driver", "Contact", "Vehicle", "Rides", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-cloud/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-navy">{d.name}</p>
                      <p className="text-muted text-xs">{d.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-navy text-xs">
                        <Phone className="w-3 h-3 text-muted" />
                        {d.phone}
                      </div>
                      {d.licenseNo && (
                        <div className="flex items-center gap-1 text-muted text-xs mt-0.5">
                          <BadgeCheck className="w-3 h-3" />
                          {d.licenseNo}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {d.vehicleInfo ? (
                        <div className="flex items-center gap-1 text-navy text-xs">
                          <Car className="w-3 h-3 text-muted" />
                          {d.vehicleInfo}
                        </div>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-navy font-semibold">{d._count.bookings}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border-none outline-none cursor-pointer ${statusColors[d.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPwModal({ id: d.id, name: d.name })}
                          title="Change password"
                          className="text-muted hover:text-navy transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          title="Delete driver"
                          className="text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted">
                      No drivers yet. Add your first driver above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password modal */}
      {pwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="font-heading font-semibold text-navy mb-1">Change Password</h2>
            <p className="text-muted text-sm mb-4">{pwModal.name}</p>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full px-3 py-2 border border-mist rounded-lg text-sm mb-4 focus:outline-none focus:border-amber"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setPwModal(null); setNewPw(""); }}
                className="px-4 py-2 rounded-xl border border-mist text-sm text-muted hover:border-navy transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

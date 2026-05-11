"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Contact {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

const STATUSES = ["unread", "read", "replied"];

const statusColors: Record<string, string> = {
  unread: "bg-amber/20 text-amber-800",
  read: "bg-blue-50 text-blue-700",
  replied: "bg-mint/20 text-green-800",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = filter === "all" ? contacts : contacts.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Contact Messages</h1>
          <p className="text-muted text-sm mt-1">{contacts.length} total</p>
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
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white border border-mist rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-semibold text-navy">{c.name}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(c.createdAt).toLocaleDateString("en-CA")}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted mb-3">
                    <a href={`tel:${c.phone}`} className="hover:text-amber">{c.phone}</a>
                    <a href={`mailto:${c.email}`} className="hover:text-amber">{c.email}</a>
                  </div>
                  <p className="text-ink text-sm leading-relaxed bg-cloud rounded-xl px-4 py-3">{c.message}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-mist text-xs text-navy focus:outline-none focus:border-amber"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteContact(c.id)}
                    className="flex items-center justify-center w-full py-1.5 rounded-lg border border-mist text-muted hover:border-red-300 hover:text-red-500 transition-colors text-xs gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white border border-mist rounded-2xl p-12 text-center text-muted">
              No messages found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Star, Calendar } from "lucide-react";

interface Application {
  id: string;
  createdAt: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  area: string;
  experience: string;
  availability: string;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  pending:  "bg-amber/20 text-amber-800",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

const tabs = ["pending", "approved", "rejected"] as const;

export default function DriverApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/driver-applications")
      .then((r) => r.json())
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (action === "approve" && !confirm("Approve this application? A driver account will be created and credentials emailed to the applicant.")) return;
    if (action === "reject" && !confirm("Reject this application?")) return;

    setActing(id);
    try {
      const res = await fetch(`/api/admin/driver-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const newStatus = action === "approve" ? "approved" : "rejected";
        setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a));
      }
    } finally {
      setActing(null);
    }
  };

  const filtered = applications.filter((a) => a.status === activeTab);
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Driver Applications</h1>
        <p className="text-muted text-sm mt-1">{applications.length} total · {pendingCount} pending review</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-mist rounded-xl p-1 w-fit">
        {tabs.map((tab) => {
          const count = applications.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-2 ${
                activeTab === tab ? "bg-amber text-navy shadow-sm" : "text-muted hover:text-navy"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab ? "bg-navy/20 text-navy" : "bg-mist text-muted"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center">
          <Clock className="w-8 h-8 text-mist mx-auto mb-3" />
          <p className="font-semibold text-navy">No {activeTab} applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-mist shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading font-semibold text-navy text-lg">
                      {a.firstName} {a.lastName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[a.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    Applied {new Date(a.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>

                {a.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(a.id, "reject")}
                      disabled={acting === a.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(a.id, "approve")}
                      disabled={acting === a.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {acting === a.id ? "Approving…" : "Approve"}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`mailto:${a.email}`} className="text-navy hover:underline truncate">{a.email}</a>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`tel:${a.phone}`} className="text-navy hover:underline">{a.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-navy">{a.area}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Star className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-navy">{a.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-navy">{a.availability}</span>
                </div>
              </div>

              {a.notes && (
                <div className="mt-4 bg-cloud rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-navy">{a.notes}</p>
                </div>
              )}

              {a.status === "approved" && (
                <div className="mt-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl px-4 py-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Driver account created — credentials emailed. Edit vehicle & license from the Drivers page.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

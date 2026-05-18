"use client";

import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

interface LoginEntry {
  id: string;
  createdAt: string;
  role: string;
  entityName: string;
  email: string;
  ip: string | null;
  userAgent: string | null;
}

const roleBadge: Record<string, string> = {
  admin:    "bg-navy/10 text-navy",
  driver:   "bg-amber/20 text-amber-800",
  customer: "bg-green-100 text-green-700",
};

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown";
  if (/iPhone|iPad/.test(ua)) return "iPhone / iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac/.test(ua)) return "Mac";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

export default function LoginHistoryPage() {
  const [logs, setLogs] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const url = filter === "all" ? "/api/admin/login-history" : `/api/admin/login-history?role=${filter}`;
    setLoading(true);
    fetch(url).then((r) => r.json()).then(setLogs).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Login History</h1>
          <p className="text-muted text-sm mt-1">All sign-ins across admin, drivers, and customers.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "admin", "driver", "customer"].map((r) => (
            <button key={r} onClick={() => setFilter(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filter === r ? "bg-navy text-white" : "bg-white border border-mist text-muted hover:border-navy"
              }`}>
              {r}
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
                  {["User", "Role", "Device", "IP", "Date & Time"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cloud/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy">{log.entityName}</p>
                      <p className="text-muted text-xs">{log.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${roleBadge[log.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-muted text-xs">
                        <Monitor className="w-3 h-3" /> {parseUA(log.userAgent)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-xs">{log.ip ?? "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-muted whitespace-nowrap">
                      <p>{new Date(log.createdAt).toLocaleDateString("en-CA")}</p>
                      <p>{new Date(log.createdAt).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}</p>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">No login records found.</td>
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

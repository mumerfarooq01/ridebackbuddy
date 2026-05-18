"use client";

import { useEffect, useState } from "react";
import { User, Phone, KeyRound, CheckCircle, AlertCircle, Monitor, Clock } from "lucide-react";

interface Profile { id: string; name: string; email: string; phone: string | null; createdAt: string }
interface LoginEntry { id: string; createdAt: string; ip: string | null; userAgent: string | null }

const inputCls = "w-full px-4 py-3 rounded-xl border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors text-sm";
type AlertType = { type: "success" | "error"; message: string } | null;

function Alert({ alert }: { alert: AlertType }) {
  if (!alert) return null;
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
      alert.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
    }`}>
      {alert.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {alert.message}
    </div>
  );
}

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (/iPhone|iPad/.test(ua)) return "iPhone / iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Mac/.test(ua)) return "Mac";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown device";
}

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileAlert, setProfileAlert]   = useState<AlertType>(null);

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [pwSaving, setPwSaving]     = useState(false);
  const [pwAlert, setPwAlert]       = useState<AlertType>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/account/profile").then((r) => r.json()),
      fetch("/api/account/login-history").then((r) => r.json()),
    ]).then(([p, h]) => {
      setProfile(p); setName(p.name ?? ""); setEmail(p.email ?? ""); setPhone(p.phone ?? "");
      setLoginHistory(Array.isArray(h) ? h : []);
    }).finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setProfileSaving(true); setProfileAlert(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (res.ok) { setProfile((p) => p ? { ...p, ...data } : p); setProfileAlert({ type: "success", message: "Profile updated." }); }
      else setProfileAlert({ type: "error", message: data.error ?? "Update failed." });
    } finally { setProfileSaving(false); }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault(); setPwAlert(null);
    if (newPw !== confirmPw) { setPwAlert({ type: "error", message: "Passwords do not match." }); return; }
    if (newPw.length < 8)   { setPwAlert({ type: "error", message: "Min. 8 characters." }); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/account/profile/password", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok) { setPwAlert({ type: "success", message: "Password updated." }); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }
      else setPwAlert({ type: "error", message: data.error ?? "Update failed." });
    } finally { setPwSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-60">
      <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Profile &amp; Security</h1>
        <p className="text-muted text-sm mt-1">
          Member since {profile ? new Date(profile.createdAt).toLocaleDateString("en-CA") : ""}
        </p>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-mist shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center">
            <User className="w-5 h-5 text-amber" />
          </div>
          <h2 className="font-heading font-semibold text-navy">Personal Info</h2>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Full Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</span>
              </label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>
          <Alert alert={profileAlert} />
          <div className="flex justify-end">
            <button type="submit" disabled={profileSaving}
              className="px-6 py-2.5 rounded-xl bg-amber hover:bg-amber-light text-navy font-semibold text-sm disabled:opacity-50 transition-all">
              {profileSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-mist shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-navy">Change Password</h2>
            <p className="text-muted text-xs">Use this if you logged in with a temporary password.</p>
          </div>
        </div>
        <form onSubmit={changePw} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Current / Temporary Password</label>
            <input required type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">New Password</label>
              <input required type="password" minLength={8} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Confirm New Password</label>
              <input required type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputCls} />
            </div>
          </div>
          <Alert alert={pwAlert} />
          <div className="flex justify-end">
            <button type="submit" disabled={pwSaving}
              className="px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white font-semibold text-sm disabled:opacity-50 transition-all">
              {pwSaving ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Login history */}
      <div className="bg-white rounded-2xl border border-mist shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-navy">Login History</h2>
            <p className="text-muted text-xs">Last 20 sign-ins to your account.</p>
          </div>
        </div>
        {loginHistory.length === 0 ? (
          <p className="text-muted text-sm">No login history yet.</p>
        ) : (
          <div className="space-y-2">
            {loginHistory.map((log, i) => (
              <div key={log.id} className="flex items-center justify-between py-2.5 border-b border-mist last:border-0">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-muted flex-shrink-0" />
                  <div>
                    <p className="text-sm text-navy font-medium">{parseUA(log.userAgent)}</p>
                    <p className="text-xs text-muted">{log.ip ?? "IP unknown"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">{new Date(log.createdAt).toLocaleDateString("en-CA")}</p>
                  <p className="text-xs text-muted">{new Date(log.createdAt).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}</p>
                  {i === 0 && <span className="text-xs text-green-600 font-semibold">Current</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

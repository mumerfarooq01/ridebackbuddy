"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, KeyRound } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewUser>({ name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers).finally(() => setLoading(false));
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setCurrentUserId(d.user?.id ?? null));
  }, []);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setShowModal(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create user");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError("New passwords do not match");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    setPwSaving(true);
    const res = await fetch(`/api/admin/users/${currentUserId}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    setPwSaving(false);
    if (res.ok) {
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
      setTimeout(() => { setShowPwModal(false); setPwSuccess(false); }, 1500);
    } else {
      const data = await res.json();
      setPwError(data.error || "Failed to update password");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-white border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Users</h1>
          <p className="text-muted text-sm mt-1">Manage admin accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber hover:opacity-90 text-navy px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber/20"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-mist rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cloud">
              <tr>
                {["Name", "Email", "Role", "Created", "", ""].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-cloud/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">{u.name}</td>
                  <td className="px-6 py-4 text-muted">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-navy/10 text-navy rounded-full text-xs font-semibold capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(u.createdAt).toLocaleDateString("en-CA")}</td>
                  <td className="px-6 py-4">
                    {u.id === currentUserId && (
                      <button
                        onClick={() => setShowPwModal(true)}
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-navy transition-colors"
                        title="Change password"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Change password
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Change password modal */}
      {showPwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-navy">Change Password</h2>
              <button onClick={() => { setShowPwModal(false); setPwError(""); setPwSuccess(false); }} className="text-muted hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-semibold text-navy">Password updated!</p>
              </div>
            ) : (
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted mb-1.5">Current Password</label>
                  <input
                    type="password" required value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">New Password</label>
                  <input
                    type="password" required minLength={8} value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    placeholder="Min. 8 characters" className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">Confirm New Password</label>
                  <input
                    type="password" required value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                    className={inputCls}
                  />
                </div>

                {pwError && <p className="text-red-500 text-sm">{pwError}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowPwModal(false); setPwError(""); }}
                    className="flex-1 py-3 rounded-xl border border-mist text-muted hover:bg-cloud transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="flex-1 bg-amber hover:opacity-90 text-navy py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {pwSaving ? "Saving…" : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create user modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-navy">New Admin User</h2>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Full Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith" className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com" className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Password</label>
                <input
                  type="password" required minLength={8} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters" className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputCls}
                >
                  <option value="admin">Admin</option>
                  <option value="dispatcher">Dispatcher</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-mist text-muted hover:bg-cloud transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber hover:opacity-90 text-navy py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {saving ? "Creating…" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

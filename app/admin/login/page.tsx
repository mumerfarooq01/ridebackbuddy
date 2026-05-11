"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber/30">
            <Car className="w-7 h-7 text-navy" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-navy">RideBack Buddy</h1>
          <p className="text-muted text-sm mt-1">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-mist shadow-sm rounded-2xl p-8 space-y-5"
        >
          <h2 className="font-heading text-lg font-semibold text-navy">Sign in</h2>

          <div>
            <label className="flex items-center gap-2 text-sm text-muted mb-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ridebackbuddy.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-muted mb-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber hover:opacity-90 text-navy py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber/20 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

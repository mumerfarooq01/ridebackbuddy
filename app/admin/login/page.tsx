"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import logoImage from "@/app/assets/images/logo.png";

export default function AdminLogin() {
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [view, setView] = useState<"login" | "forgot">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!res.ok) {
        setForgotError("Something went wrong. Please try again.");
      } else {
        setForgotSent(true);
      }
    } catch {
      setForgotError("Network error. Please check your connection.");
    } finally {
      setForgotLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src={logoImage} alt="RideBack Buddy" width={160} height={160} className="h-28 w-auto mx-auto mb-3" />
          <p className="text-muted text-sm">Admin Dashboard</p>
        </div>

        {view === "login" ? (
          <form onSubmit={handleSubmit} className="bg-white border border-mist shadow-sm rounded-2xl p-8 space-y-5">
            <h2 className="font-heading text-lg font-semibold text-navy">Sign in</h2>

            <div>
              <label className="flex items-center gap-2 text-sm text-muted mb-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ridebackbuddy.com"
                className={inputCls}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-muted mb-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-12`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-amber hover:opacity-90 text-navy py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-amber/20 disabled:opacity-50">
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="text-center text-sm">
              <button type="button" onClick={() => { setView("forgot"); setForgotSent(false); setForgotEmail(""); setForgotError(""); }}
                className="text-muted hover:text-amber transition-colors font-medium">
                Forgot password?
              </button>
            </p>
          </form>
        ) : (
          <div className="bg-white border border-mist shadow-sm rounded-2xl p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setView("login")} className="text-muted hover:text-navy transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-heading text-lg font-semibold text-navy">Reset Password</h2>
            </div>

            {forgotSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-navy">Check your email</p>
                <p className="text-muted text-sm">
                  If <strong>{forgotEmail}</strong> is registered, we&apos;ve sent a temporary password. Use it to log in, then update it from your Profile.
                </p>
                <button onClick={() => setView("login")}
                  className="text-amber font-semibold text-sm hover:underline">
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-muted text-sm">Enter your email and we&apos;ll send you a temporary password.</p>
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted mb-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <input type="email" required value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@ridebackbuddy.com"
                    className={inputCls}
                  />
                </div>
                {forgotError && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">{forgotError}</p>
                )}
                <button type="submit" disabled={forgotLoading}
                  className="w-full bg-amber hover:opacity-90 text-navy py-3 rounded-xl font-semibold transition-all disabled:opacity-50">
                  {forgotLoading ? "Sending…" : "Submit"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

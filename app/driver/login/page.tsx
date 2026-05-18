"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import logoImage from "@/app/assets/images/logo.png";

const inputCls =
  "w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber transition-colors";

export default function DriverLoginPage() {
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    try {
      const res = await fetch("/api/auth/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/driver");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/driver/forgot-password", {
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

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-2">
          <Image src={logoImage} alt="RideBack Buddy" width={140} height={140} className="h-24 w-auto" />
          <p className="text-muted text-sm">Driver Portal</p>
        </div>

        {view === "login" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-mist p-8">
            <h1 className="font-heading text-xl font-bold text-navy mb-1">Welcome back</h1>
            <p className="text-muted text-sm mb-6">Sign in to your driver account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Email</label>
                <input type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Password</label>
                <input type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              </div>

              {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber text-navy font-semibold text-sm hover:bg-amber/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </button>

              <p className="text-center text-sm">
                <button type="button" onClick={() => { setView("forgot"); setForgotSent(false); setForgotEmail(""); setForgotError(""); }}
                  className="text-muted hover:text-amber transition-colors text-xs font-medium">
                  Forgot password?
                </button>
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-mist p-8 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("login")} className="text-muted hover:text-navy transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-heading text-lg font-semibold text-navy">Reset Password</h2>
            </div>

            {forgotSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-navy text-sm">Check your email</p>
                <p className="text-muted text-xs leading-relaxed">
                  If <strong>{forgotEmail}</strong> is registered, we&apos;ve sent a temporary password. Log in with it, then update from your Profile.
                </p>
                <button onClick={() => setView("login")}
                  className="text-amber font-semibold text-sm hover:underline">
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-muted text-sm">Enter your email and we&apos;ll send a temporary password.</p>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Email</label>
                  <input type="email" required value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)} className={inputCls} />
                </div>
                {forgotError && (
                  <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{forgotError}</p>
                )}
                <button type="submit" disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-amber text-navy font-semibold text-sm hover:bg-amber/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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

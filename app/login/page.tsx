"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import logoImage from "@/app/assets/images/logo.png";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors text-sm";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/customer/forgot-password", {
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
    <div className="min-h-screen bg-cloud flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src={logoImage} alt="RideBack Buddy" width={140} height={140} className="h-24 w-auto mx-auto mb-3" />
          </Link>
        </div>

        {view === "login" ? (
          <div className="bg-white rounded-2xl border border-mist shadow-sm p-8 space-y-5">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Sign in</h1>
              <p className="text-muted text-sm mt-1">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-amber font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputCls} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-amber hover:bg-amber-light text-navy font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </button>

              <p className="text-center">
                <button type="button" onClick={() => { setView("forgot"); setForgotSent(false); setForgotEmail(""); setForgotError(""); }}
                  className="text-muted hover:text-amber text-sm transition-colors">
                  Forgot password?
                </button>
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-mist shadow-sm p-8 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("login")} className="text-muted hover:text-navy transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-heading text-xl font-bold text-navy">Reset Password</h2>
            </div>

            {forgotSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-navy">Check your email</p>
                <p className="text-muted text-sm">
                  If <strong>{forgotEmail}</strong> is registered, we&apos;ve sent a temporary password. Log in then update it from your profile.
                </p>
                <button onClick={() => setView("login")} className="text-amber font-semibold text-sm hover:underline">
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-muted text-sm">Enter your email and we&apos;ll send a temporary password.</p>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
                  <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className={inputCls} />
                </div>
                {forgotError && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-2 rounded-xl">{forgotError}</p>
                )}
                <button type="submit" disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-amber hover:bg-amber-light text-navy font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

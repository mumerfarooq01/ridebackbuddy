"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logoImage from "@/app/assets/images/logo.png";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors text-sm";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (res.ok) {
        router.push("/account");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Registration failed");
      }
    } finally {
      setLoading(false);
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

        <div className="bg-white rounded-2xl border border-mist shadow-sm p-8 space-y-5">
          <div>
            <h1 className="font-heading text-2xl font-bold text-navy">Create account</h1>
            <p className="text-muted text-sm mt-1">
              Already have one?{" "}
              <Link href="/login" className="text-amber font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Full Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Phone <span className="text-muted/60">(optional)</span></label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  required type={showPw ? "text" : "password"} minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" className={`${inputCls} pr-11`}
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
              Create Account
            </button>

            <p className="text-center text-xs text-muted">
              By creating an account you agree to our terms of service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

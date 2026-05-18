"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logoLight from "@/app/assets/images/logo-light.png";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/driver/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/auth/driver/logout", { method: "POST" });
    router.push("/driver/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cloud">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <Link href="/driver">
          <Image src={logoLight} alt="RideBack Buddy" width={120} height={120} className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/driver/profile"
            className={`flex items-center gap-2 text-sm transition-colors ${
              pathname === "/driver/profile" ? "text-amber" : "text-white/70 hover:text-white"
            }`}
          >
            <CircleUserRound className="w-4 h-4" /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

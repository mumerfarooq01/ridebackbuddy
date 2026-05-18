"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, CalendarCheck } from "lucide-react";
import logoImage from "@/app/assets/images/logo.png";

const navLinks = [
  { href: "/account", label: "My Bookings", icon: CalendarCheck, exact: true },
  { href: "/account/profile", label: "Profile & Security", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isActive = (link: { href: string; exact?: boolean }) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <div className="min-h-screen bg-cloud">
      {/* Top nav */}
      <header className="bg-white border-b border-mist px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src={logoImage} alt="RideBack Buddy" width={120} height={120} className="h-10 w-auto" />
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-muted hover:text-navy text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-mist p-3 space-y-1">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold text-muted uppercase tracking-wider">My Account</p>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(link) ? "bg-amber text-navy" : "text-muted hover:bg-cloud hover:text-navy"
                }`}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

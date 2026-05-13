"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Users,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (link: { href: string; exact?: boolean }) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-cloud flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-navy flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
            <Car className="w-4 h-4 text-navy" />
          </div>
          <span className="font-heading font-bold text-white text-sm">
            RideBack Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(link)
                  ? "bg-amber text-navy"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-mist px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-mist transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <span className="font-heading font-bold text-navy text-sm">
            RideBack Admin
          </span>
        </header>

        <main className="flex-1 p-6 pt-30">{children}</main>
      </div>
    </div>
  );
}

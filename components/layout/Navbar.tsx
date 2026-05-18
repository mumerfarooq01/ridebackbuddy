"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImage from "@/app/assets/images/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/about", label: "About Us" },
  // { href: "/contact", label: "Contact" },
  { href: "/drive-with-us", label: "Drive with Us" },
];

interface CustomerSession {
  name: string;
  email: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch customer session
  useEffect(() => {
    fetch("/api/auth/customer/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setCustomer(data ?? null))
      .catch(() => setCustomer(null));
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    setCustomer(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const textCls =
    isHome && !isScrolled
      ? "text-white/85 hover:text-white"
      : "text-muted hover:text-navy";

  // Hide on pages that have their own nav (account dashboard, admin, driver portals)
  if (pathname.startsWith("/account") || pathname.startsWith("/admin") || pathname.startsWith("/driver")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-mist"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src={logoImage}
              alt="RideBack Buddy"
              width={220}
              height={60}
              className="h-14 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                  isHome && !isScrolled
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-muted hover:text-navy hover:bg-mist"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:6475017433"
              className={`flex items-center gap-2 text-base transition-colors ${
                isHome && !isScrolled
                  ? "text-white/75 hover:text-white"
                  : "text-muted hover:text-amber"
              }`}
            >
              <Phone className="w-4 h-4" />
              647-501-7433
            </a>

            {customer ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${textCls}`}
                >
                  <CircleUserRound className="w-6 h-6" />
                  <span className="max-w-[120px] truncate">
                    {customer.name.split(" ")[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-mist overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-mist">
                        <p className="text-xs font-semibold text-navy truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {customer.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-navy hover:bg-cloud transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted" /> My
                        Bookings
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-navy hover:bg-cloud transition-colors"
                      >
                        <CircleUserRound className="w-4 h-4 text-muted" />{" "}
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-mist"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${textCls}`}
              >
                Sign In
              </Link>
            )}

            <Link
              href="/book"
              className="bg-amber hover:bg-amber-light text-navy px-5 py-2.5 rounded-lg font-heading font-semibold text-sm transition-all duration-150 hover:-translate-y-0.5 shadow-md"
            >
              Book a ride
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isHome && !isScrolled
                ? "text-white/85 hover:text-white hover:bg-white/10"
                : "text-muted hover:text-navy hover:bg-mist"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-mist shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-muted hover:text-navy hover:bg-mist rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-mist space-y-2">
                <a
                  href="tel:6475017433"
                  className="flex items-center gap-2 px-4 py-3 text-base text-amber font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  647-501-7433
                </a>

                {customer ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-xs text-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-navy truncate">
                        {customer.name}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-navy hover:bg-mist rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted" /> My
                      Bookings
                    </Link>
                    <Link
                      href="/account/profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-navy hover:bg-mist rounded-lg transition-colors"
                    >
                      <CircleUserRound className="w-4 h-4 text-muted" /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-center border border-mist text-navy px-5 py-3 rounded-lg font-heading font-semibold transition-colors hover:bg-mist"
                  >
                    Sign In
                  </Link>
                )}

                <Link
                  href="/book"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-center bg-amber hover:bg-amber-light text-navy px-5 py-3 rounded-lg font-heading font-semibold shadow-md transition-colors"
                >
                  Book a ride
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

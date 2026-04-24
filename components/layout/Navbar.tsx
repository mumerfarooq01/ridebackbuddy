"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImage from "@/app/assets/images/logo.png";
import logoLight from "@/app/assets/images/logo-light.png";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/book", label: "Book a Ride" },
  { href: "/about", label: "About Us" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              src={isHome && !isScrolled ? logoLight : logoImage}
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
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <div className="pt-3 border-t border-mist">
                <a
                  href="tel:6475017433"
                  className="flex items-center gap-2 px-4 py-3 text-base text-amber font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  647-501-7433
                </a>
                <Link
                  href="/book"
                  onClick={() => setIsMobileOpen(false)}
                  className="block mt-2 text-center bg-amber hover:bg-amber-light text-navy px-5 py-3 rounded-lg font-heading font-semibold shadow-md transition-colors"
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

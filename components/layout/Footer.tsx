import Link from "next/link";
import { Car, Phone, Clock, MapPin, Globe, Share2, ExternalLink } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/book", label: "Book a Ride" },
  { href: "/about", label: "About Us" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

const phoneNumbers = [
  { label: "Main", number: "647-501-7433" },
  { label: "Hamilton", number: "289-683-4323" },
  { label: "Burlington/Oakville", number: "905-805-4323" },
  { label: "Mississauga", number: "416-752-4323" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">
                  Ride Home
                </span>
                <span className="text-[10px] text-gold uppercase tracking-widest leading-tight">
                  Designated Drivers
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ontario&apos;s trusted designated driver service since 2011.
              We get you AND your car home safely.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent-red/20 transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent-red/20 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent-red/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Phone Numbers */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Call Us
            </h4>
            <ul className="space-y-3">
              {phoneNumbers.map((p) => (
                <li key={p.number}>
                  <a
                    href={`tel:${p.number.replace(/-/g, "")}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-gold text-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>
                      <span className="text-gray-500">{p.label}:</span> {p.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Hours of Operation
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 mt-0.5 text-gold" />
                <div>
                  <p className="text-gray-300">Sun – Thu</p>
                  <p>8:00 PM – 2:30 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 mt-0.5 text-gold" />
                <div>
                  <p className="text-gray-300">Fri – Sat</p>
                  <p>8:00 PM – 3:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-400 pt-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent-red" />
                <p>Mississauga, Oakville, Burlington, Hamilton & GTA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Ride Home Designated Drivers. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Serving Ontario&apos;s GTA since 2011
          </p>
        </div>
      </div>
    </footer>
  );
}

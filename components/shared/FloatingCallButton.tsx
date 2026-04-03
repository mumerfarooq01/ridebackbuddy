"use client";

import { Phone } from "lucide-react";

export default function FloatingCallButton() {
  return (
    <a
      href="tel:6475017433"
      className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-brand rounded-full flex items-center justify-center shadow-xl shadow-accent-red/30 animate-pulse-glow hover:scale-110 transition-transform"
      aria-label="Call Now"
    >
      <Phone className="w-6 h-6 text-white" />
    </a>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTABanner({
  title = "Don't Risk It. Book Your Ride Tonight.",
  subtitle = "Two professional drivers per trip — one for you, one for your car.",
  buttonText = "Book a Ride Now",
  buttonHref = "/book",
}: CTABannerProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-red/20 via-navy to-accent-red/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,57,70,0.15),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto text-center px-4"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 bg-gradient-brand hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl shadow-accent-red/25"
        >
          {buttonText}
        </Link>
      </motion.div>
    </section>
  );
}

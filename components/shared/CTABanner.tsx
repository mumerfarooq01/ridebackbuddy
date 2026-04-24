"use client";

import Link from "next/link";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTABanner({
  title = "Ready when you are.",
  subtitle = "Open the app, or book from any browser. Your car is about to have a very safe night.",
  buttonText = "Book your RideBack →",
  buttonHref = "/book",
}: CTABannerProps) {
  return (
    <section
      className="py-16 text-center"
      style={{ background: "linear-gradient(135deg, #FFB627, #FFCB66)" }}
    >
      <div className="max-w-[1180px] mx-auto px-6">
        <h2 className="font-heading font-bold text-navy text-[clamp(26px,3vw,38px)] tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-navy/70 max-w-[560px] mx-auto mb-7 text-base leading-relaxed">
          {subtitle}
        </p>
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-heading font-semibold text-base px-6 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}

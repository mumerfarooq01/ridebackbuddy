"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const trustItems = [
  {
    icon: "🧾",
    title: "Vetted drivers",
    description: "Criminal record check. 5+ yrs licensed. Annual training.",
  },
  {
    icon: "🛡️",
    title: "Commercial insurance",
    description: "Hired & non-owned auto policy sits above your own.",
  },
  {
    icon: "📹",
    title: "Dashcam every ride",
    description: "Disclosed at booking. Footage retained per PIPEDA.",
  },
  {
    icon: "📷",
    title: "Vehicle photo check",
    description: "Before and after — so there are no surprises.",
  },
];

export default function TrustBar() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".trust-card", {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
      },
    });
  }, { scope: container });

  return (
    <section id="safety" ref={container} className="py-20 md:py-28 bg-cloud">
      <div className="max-w-[1180px] mx-auto px-6">
        <span className="text-amber font-heading font-semibold tracking-[2px] text-sm uppercase">
          Safety &amp; trust
        </span>
        <h2 className="font-heading font-bold text-navy mt-2 mb-10 text-[clamp(26px,3vw,38px)] leading-[1.15] tracking-tight">
          Tight ops so you don&rsquo;t have to worry.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="trust-card bg-white border border-mist rounded-[18px] p-6 text-center"
            >
              <div className="w-11 h-11 rounded-full bg-[#FFE7B5] flex items-center justify-center mx-auto mb-3 text-xl">
                {item.icon}
              </div>
              <h4 className="font-heading font-semibold text-navy mb-1.5">{item.title}</h4>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

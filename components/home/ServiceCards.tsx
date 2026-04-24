"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const values = [
  {
    icon: "🚗",
    title: "Your car comes home",
    description:
      "No taxi back in the morning. No parking ticket at 7 am. No awkward rescue favour from your brother-in-law.",
  },
  {
    icon: "🛡️",
    title: "Fully insured, fully vetted",
    description:
      "Commercial hired-auto insurance above your policy. Every driver background-checked, trained, and dashcam-equipped.",
  },
  {
    icon: "💳",
    title: "Flat fare, no surge",
    description:
      "You see the price before you book. No demand pricing at midnight on New Year's Eve. Ever.",
  },
  {
    icon: "👥",
    title: "Your car, your driver",
    description:
      "Our driver comes to you and drives your own vehicle home. You're a passenger in your own car — comfortable and in control.",
  },
  {
    icon: "🇨🇦",
    title: "Built for Canada",
    description:
      "Winter tires, block heaters, Interac. We know that Friday night at −22°C is when you need us most.",
  },
  {
    icon: "🏢",
    title: "Corporate-friendly",
    description:
      "One monthly invoice. Pre-authorized limits for holiday parties and client dinners. HR dashboard included.",
  },
];

export default function ServiceCards() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".value-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-20 md:py-28 bg-cloud">
      <div className="max-w-[1180px] mx-auto px-6">
        <span className="text-amber font-heading font-semibold tracking-[2px] text-sm uppercase">
          Why RideBack Buddy
        </span>
        <h2 className="font-heading font-bold text-navy mt-2 mb-3 text-[clamp(26px,3vw,38px)] leading-[1.15] tracking-tight">
          The only ride home that brings your car too.
        </h2>
        <p className="text-muted max-w-[620px] mb-10">
          Rideshare leaves the car at the restaurant. Cabs do the same. We don&rsquo;t.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className="value-card bg-white rounded-[18px] p-7"
            >
              <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center text-xl mb-4">
                {v.icon}
              </div>
              <h3 className="font-heading font-semibold text-navy text-[20px] mb-2">{v.title}</h3>
              <p className="text-muted text-[15px] leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

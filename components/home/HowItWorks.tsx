"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    n: "1",
    title: "Open the app",
    description:
      "Tell us where you are and which vehicle is yours. We'll quote a flat fare in seconds.",
  },
  {
    n: "2",
    title: "We arrive in 10 minutes",
    description:
      "Your designated driver arrives at your location, ready to take the wheel of your own vehicle.",
  },
  {
    n: "3",
    title: "Ride home in your car",
    description:
      "Sit back as a passenger in your own vehicle. Your driver takes you safely home — every traffic law followed.",
  },
  {
    n: "4",
    title: "Wake up at home",
    description:
      "Car parked in your driveway. Keys on the counter. Night handled.",
  },
];

export default function HowItWorks() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<Element>(".step-card").forEach((card) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true,
        },
      });
    });
  }, { scope: container });

  return (
    <section id="how" ref={container} className="py-20 md:py-28 bg-white">
      <div className="max-w-[1180px] mx-auto px-6">
        <span className="text-amber font-heading font-semibold tracking-[2px] text-sm uppercase">
          How it works
        </span>
        <h2 className="font-heading font-bold text-navy mt-2 mb-3 text-[clamp(26px,3vw,38px)] leading-[1.15] tracking-tight">
          From &ldquo;I shouldn&rsquo;t drive&rdquo; to your driveway, in four simple steps.
        </h2>
        <p className="text-muted max-w-[620px] mb-10">
          No cabs, no morning-after car retrieval, no logistics at 1&nbsp;am. Just two people who show up.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.n}
              className="step-card bg-white border border-mist rounded-[18px] p-6 relative hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(11,42,74,.10)] transition-all duration-200"
            >
              <div className="font-heading text-[40px] font-bold text-amber leading-none">{step.n}</div>
              <h3 className="font-heading font-semibold text-navy text-[20px] mt-2 mb-3">{step.title}</h3>
              <p className="text-muted text-[15px] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

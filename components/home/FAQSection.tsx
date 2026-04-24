"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const faqs = [
  {
    q: "Is my car actually insured?",
    a: "Yes. Your own policy provides primary coverage. Our commercial hired-auto policy sits on top for liability and damage while our driver is at the wheel. Plain-English details are in the Terms link at booking.",
  },
  {
    q: "How does the pick-up work?",
    a: "Our driver comes directly to your location and drives your own car home with you as a passenger. You never leave your vehicle behind — it arrives in your driveway the same night.",
  },
  {
    q: "What if I drive a manual transmission or a Tesla?",
    a: "Just tell us at booking. We match you with a driver trained on that vehicle. Manuals, EVs, and even classic cars are fine.",
  },
  {
    q: "How is this different from Uber or a taxi?",
    a: "Rideshare and taxis pick you up in their car and leave yours behind. We use your car. You wake up with it in the driveway. That's the whole idea.",
  },
  {
    q: "Do you serve all of Canada?",
    a: "We're launching city by city, starting with a pilot metro in 2026. Enter your postal code in the app to see live coverage — and to request service if we're not there yet.",
  },
  {
    q: "Can I book for someone else?",
    a: "Absolutely. Enter their name and phone number at booking and pay on your card. Common for parents, spouses, or corporate accounts covering employees.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free to cancel up to 5 minutes after booking. After that, a flat $15 cancellation applies so our drivers (already on the way) are paid for their time.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".faq-item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.07,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
      },
    });
  }, { scope: container });

  return (
    <section id="faq" ref={container} className="py-20 md:py-28 bg-white">
      <div className="max-w-[820px] mx-auto px-6">
        <span className="text-amber font-heading font-semibold tracking-[2px] text-sm uppercase">
          Answers
        </span>
        <h2 className="font-heading font-bold text-navy mt-2 mb-8 text-[clamp(26px,3vw,38px)] leading-[1.15] tracking-tight">
          Common questions.
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item bg-white border rounded-xl overflow-hidden transition-colors duration-150 ${
                open === idx ? "border-navy" : "border-mist"
              }`}
            >
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-heading font-semibold text-navy text-[17px] pr-4">
                  {faq.q}
                </span>
                <span className="text-amber text-2xl font-bold flex-shrink-0 leading-none">
                  {open === idx ? "–" : "+"}
                </span>
              </button>
              {open === idx && (
                <div className="px-5 pb-5 text-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Sample fares derived from the official formula:
//   distanceFare = $31.00 + ceil(max(km - 10, 0)) × $2.75
const examples = [
  { km: "Up to 10 km", fare: "$31.00", note: "Flat base fare" },
  { km: "20 km",       fare: "$58.50", note: "$31 + 10 × $2.75" },
  { km: "30 km",       fare: "$86.00", note: "$31 + 20 × $2.75" },
  { km: "45 km",       fare: "$127.25", note: "$31 + 35 × $2.75" },
  { km: "60 km",       fare: "$171.25", note: "$31 + 50 × $2.75" },
  { km: "80 km",       fare: "$226.25", note: "$31 + 70 × $2.75" },
];

const addons = [
  { label: "Out-of-area surcharge", value: "$5 – $20", note: "Depends on destination region" },
  { label: "Credit card / account", value: "+$1.00",   note: "Applied when not paying cash" },
  { label: "Intermediate stops",    value: "+$3.00",   note: "Per stop between pickup and home" },
  { label: "407 ETR toll route",    value: "+$15 base", note: "+$0.25/km while on 407" },
];

export default function Pricing() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<Element>(".price-card").forEach((card) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });
    });
  }, { scope: container });

  return (
    <section id="pricing" ref={container} className="py-20 md:py-28 bg-white">
      <div className="max-w-[1180px] mx-auto px-6">
        <span className="text-amber font-heading font-semibold tracking-[2px] text-sm uppercase">
          Pricing
        </span>
        <h2 className="font-heading font-bold text-navy mt-2 mb-3 text-[clamp(26px,3vw,38px)] leading-[1.15] tracking-tight">
          Flat, fair, and the same at 1&thinsp;pm or 1&thinsp;am.
        </h2>
        <p className="text-muted max-w-[620px] mb-10">
          $31.00 covers your first 10&nbsp;km. After that, $2.75 per km (rounded up to the next whole km).
          No surge pricing — ever.
        </p>

        {/* Rate cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">

          {/* Base rate */}
          <div className="price-card bg-white rounded-[18px] p-7 border border-mist">
            <h3 className="text-muted text-sm uppercase tracking-[2px] font-heading font-semibold">Base fare</h3>
            <div className="font-heading font-bold text-navy text-[44px] leading-tight my-1">
              $31<small className="text-muted font-medium text-base"> flat</small>
            </div>
            <p className="text-muted text-sm mb-5">Includes the first 10&nbsp;km.</p>
            <ul className="space-y-0 text-[15px] text-ink">
              {["Covers 0–10 km door to door", "Driver picks you up in your own car", "Fully insured, avg 10-min arrival"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 py-2 border-t border-mist first:border-0 first:pt-0">
                  <span className="text-mint font-bold flex-shrink-0 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Per-km rate — featured */}
          <div className="price-card relative bg-white rounded-[18px] p-7 border border-amber shadow-[0_10px_28px_rgba(255,182,39,.25)]">
            <span className="absolute -top-3 right-4 bg-amber text-navy text-xs font-heading font-bold px-3 py-1 rounded-full">
              After 10 km
            </span>
            <h3 className="text-muted text-sm uppercase tracking-[2px] font-heading font-semibold">Per-km rate</h3>
            <div className="font-heading font-bold text-navy text-[44px] leading-tight my-1">
              $2.75<small className="text-muted font-medium text-base"> / km</small>
            </div>
            <p className="text-muted text-sm mb-5">Each km over 10, rounded up.</p>
            <ul className="space-y-0 text-[15px] text-ink">
              {["11 km = $33.75 total", "20 km = $58.50 total", "30 km = $86.00 total"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 py-2 border-t border-mist first:border-0 first:pt-0">
                  <span className="text-mint font-bold flex-shrink-0 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Add-ons */}
          <div className="price-card bg-white rounded-[18px] p-7 border border-mist">
            <h3 className="text-muted text-sm uppercase tracking-[2px] font-heading font-semibold">Add-ons</h3>
            <div className="font-heading font-bold text-navy text-[44px] leading-tight my-1">
              From <small className="text-muted font-medium text-base">$1</small>
            </div>
            <p className="text-muted text-sm mb-5">Optional extras — all additive.</p>
            <ul className="space-y-0 text-[15px] text-ink">
              {["Out-of-area: $5–$20", "Card payment: +$1.00", "Each stop: +$3.00", "407 ETR: +$15 + $0.25/km"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 py-2 border-t border-mist first:border-0 first:pt-0">
                  <span className="text-mint font-bold flex-shrink-0 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Example fares table */}
        <div className="price-card bg-cloud rounded-[18px] p-7 border border-mist mb-6">
          <h3 className="font-heading font-semibold text-navy mb-4">Sample fares (distance only, no add-ons)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
            {examples.map((ex) => (
              <div key={ex.km} className="flex items-center justify-between border-b border-mist pb-2">
                <div>
                  <p className="text-sm font-medium text-navy">{ex.km}</p>
                  <p className="text-xs text-muted">{ex.note}</p>
                </div>
                <span className="font-heading font-bold text-navy text-lg tabular-nums">{ex.fare}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons detail */}
        <div className="price-card bg-cloud rounded-[18px] p-7 border border-mist mb-6">
          <h3 className="font-heading font-semibold text-navy mb-4">Additional fees</h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {addons.map((a) => (
              <div key={a.label} className="flex items-start justify-between border-b border-mist pb-2">
                <div>
                  <p className="text-sm font-medium text-navy">{a.label}</p>
                  <p className="text-xs text-muted">{a.note}</p>
                </div>
                <span className="font-heading font-semibold text-navy text-sm tabular-nums ml-4 whitespace-nowrap">{a.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-muted text-sm max-w-[520px]">
            Destination not on the list? <strong className="text-navy">Call Dispatch</strong> — we&apos;ll quote your exact fare on the spot.
            No food stops on any ride.
          </p>
          <Link href="/book"
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-navy font-heading font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap">
            Get your quote →
          </Link>
        </div>
      </div>
    </section>
  );
}

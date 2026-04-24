"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const stats = [
  { value: "$49", label: "Flat starting fare" },
  { value: "10 min", label: "Average pickup" },
  { value: "0 km", label: "Your car leaves behind" },
  { value: "24/7", label: "Support line" },
];

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    /* ── content entrance ── */
    gsap.from(".hero-text", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power4.out",
    });
    gsap.from(".hero-phone", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out",
    });

    /* ── ambient orb floats — transform only, no layout thrash ── */
    gsap.to(".orb-amber-1", {
      y: -38,
      x: 18,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".orb-amber-2", {
      y: 28,
      x: -22,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5,
    });
    gsap.to(".orb-mint", {
      y: -22,
      x: 14,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 5,
    });
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative overflow-hidden text-white min-h-[100dvh] flex items-center"
    >

      {/* ── 1. BASE GRADIENT — deep cinematic navy ── */}
      <div className="absolute inset-0 bg-[linear-gradient(158deg,#050F1D_0%,#081828_25%,#0B2A4A_55%,#0D3258_80%,#14406F_100%)]" />

      {/* ── 2. AMBIENT ORB — large amber bloom, top-left ── */}
      <div
        className="orb-amber-1 absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,182,39,.16) 0%, rgba(255,182,39,.04) 50%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* ── 3. AMBIENT ORB — mid amber, right edge ── */}
      <div
        className="orb-amber-2 absolute top-1/3 -right-56 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,182,39,.09) 0%, transparent 65%)",
          filter: "blur(64px)",
        }}
      />

      {/* ── 4. AMBIENT ORB — faint mint, bottom-left ── */}
      <div
        className="orb-mint absolute -bottom-28 left-[15%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(22,199,154,.07) 0%, transparent 65%)",
          filter: "blur(56px)",
        }}
      />

      {/* ── 5. PERSPECTIVE ROAD GRID — brand-context depth ── */}
      <svg
        viewBox="0 0 1200 520"
        className="absolute bottom-0 inset-x-0 w-full h-[55%] pointer-events-none"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        style={{ opacity: 0.055 }}
      >
        {/* fan lines from vanishing point */}
        {[0, 140, 280, 430, 600, 770, 920, 1060, 1200].map((x, i) => (
          <line key={i} x1={600} y1={40} x2={x} y2={520}
            stroke="#FFB627" strokeWidth="0.8" />
        ))}
        {/* horizontal cross-lines with perspective spacing */}
        {[160, 270, 360, 440, 520].map((y, i) => (
          <line key={i} x1={0} y1={y} x2={1200} y2={y}
            stroke="#FFB627" strokeWidth="0.6" />
        ))}
      </svg>

      {/* ── 6. DOT MATRIX TEXTURE ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,.28) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.14,
        }}
      />

      {/* ── 7. EDGE VIGNETTE — pulls attention to center content ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 110% 90% at 50% 40%, transparent 35%, rgba(3,10,22,.65) 100%)",
        }}
      />


      {/* ── CONTENT ── */}
      <div className="relative z-[5] w-full max-w-[1180px] mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 py-24 pb-36 items-center">

        {/* Left */}
        <div>
          {/* Liquid-glass badge */}
          <span className="hero-text inline-flex items-center gap-2 border border-amber/25 bg-white/[0.07] backdrop-blur-sm text-[#FFE7B5] px-3.5 py-1.5 rounded-full font-heading font-semibold text-sm tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="w-2 h-2 rounded-full bg-amber ring-4 ring-amber/25 flex-shrink-0" />
            Now booking · Canada
          </span>

          <h1 className="hero-text font-heading font-bold leading-[1.05] tracking-tight mt-5 text-[clamp(36px,5vw,60px)]">
            Get home safely —<br />
            <span className="text-amber">car and all.</span>
          </h1>

          <p className="hero-text mt-4 mb-7 text-[#CADCFC] text-lg max-w-[560px] leading-relaxed">
            Our driver comes to you, gets behind the wheel of{" "}
            <em>your own car</em>, and takes you safely home. You wake up with
            your car in the driveway — no taxi back in the morning.
          </p>

          <div className="hero-text flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-navy font-heading font-semibold text-base px-5 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,182,39,.35)] active:scale-[0.98]"
            >
              Book a ride in 60 seconds →
            </Link>
            {/* Liquid-glass ghost button */}
            <Link
              href="#how"
              className="inline-flex items-center gap-2 bg-white/[0.07] backdrop-blur-sm border border-white/20 text-white font-heading font-semibold text-base px-5 py-3.5 rounded-xl hover:bg-white/[0.12] hover:border-white/40 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              See how it works
            </Link>
          </div>

          {/* Stats row */}
          <div className="hero-text flex flex-wrap gap-x-8 gap-y-4 mt-10 pt-8 border-t border-white/10">
            {stats.map((s) => (
              <div key={s.label}>
                <b className="block font-heading font-bold text-white text-[22px] leading-tight">
                  {s.value}
                </b>
                <span className="text-[#8DA6D9] text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div className="hero-phone flex justify-center lg:justify-end">
          <div
            className="bg-white rounded-[28px] p-4 w-[300px] flex-shrink-0"
            style={{
              boxShadow: "0 40px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06), inset 0 1px 0 rgba(255,255,255,.9)",
            }}
          >
            <div className="bg-[#F7F9FC] rounded-[18px] p-4 text-[#1A1D23]">

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-navy text-sm">Your RideBack</span>
                <span className="inline-flex items-center gap-1.5 bg-[rgba(255,231,181,0.6)] text-navy px-2 py-0.5 rounded-full text-[11px] font-heading font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                  On the way
                </span>
              </div>

              {/* Map */}
              <div className="rounded-xl bg-gradient-to-br from-[#d4e6f7] to-[#e8f2fb] h-36 relative overflow-hidden">
                <svg
                  viewBox="0 0 300 144"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M20 100 Q70 60 130 80 T260 50"
                    fill="none"
                    stroke="#14406F"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute top-7 left-9 w-3.5 h-3.5 rounded-full bg-amber ring-[6px] ring-amber/30" />
                <span className="absolute bottom-8 right-14 w-3.5 h-3.5 rounded-full bg-mint ring-[6px] ring-mint/30" />
              </div>

              {/* Driver */}
              <div className="flex items-center gap-2.5 mt-3">
                <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">
                  JM
                </div>
                <div>
                  <p className="font-heading font-semibold text-navy text-sm leading-tight">
                    Jordan M. &amp; Priya S.
                  </p>
                  <p className="text-[#5B6473] text-xs">Your driver · Driving your Corolla</p>
                </div>
              </div>

              {/* Fare */}
              <div className="flex items-center justify-between bg-navy text-white rounded-xl px-3.5 py-2.5 mt-3 font-heading font-semibold text-sm">
                <span>Flat fare</span>
                <span className="text-amber">$69.00</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

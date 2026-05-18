"use client";

import Image from "next/image";
import logoImage from "@/app/assets/images/logo.png";
import {
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Shield,
  Star,
  Users,
  ChevronRight,
  Phone,
} from "lucide-react";

const perks = [
  {
    icon: DollarSign,
    title: "Competitive Pay",
    desc: "Earn great rates per ride with weekly direct deposits. No hidden deductions.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    desc: "Work evenings and weekends on your schedule. You choose when you drive.",
  },
  {
    icon: MapPin,
    title: "Local Routes",
    desc: "Serve your own community — Mississauga, Oakville, Burlington, Hamilton & GTA.",
  },
  {
    icon: Shield,
    title: "Safe & Supported",
    desc: "Full dispatch support every shift. You&apos;re never alone on the road.",
  },
  {
    icon: Users,
    title: "Great Team",
    desc: "Join a tight-knit crew that&apos;s been running strong since 2011.",
  },
  {
    icon: Star,
    title: "Rewarding Work",
    desc: "You&apos;re the reason people get home safely. That matters — and our clients know it.",
  },
];

const requirements = [
  "Valid Ontario G driver's licence (minimum 2 years)",
  "Clean driver's abstract (no major violations)",
  "Reliable vehicle or willingness to drive client's car",
  "Smartphone with data plan",
  "Professional appearance and attitude",
  "Available evenings / weekends (Thu–Sat priority)",
];

const steps = [
  { num: "01", title: "Apply online", desc: "Fill out the short form below — takes under 3 minutes." },
  { num: "02", title: "We review & call", desc: "Our team reaches out within 48 hours for a quick phone screen." },
  { num: "03", title: "Onboarding", desc: "Complete a brief orientation and get set up on our dispatch system." },
  { num: "04", title: "Start driving", desc: "Accept your first ride and start earning." },
];

export default function DriveWithUsPage() {
  return (
    <main className="bg-white">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden">
        {/* Background grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-amber/10 border border-amber/30 text-amber px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              Now Hiring · Ontario
            </span>

            <h1 className="font-heading font-bold text-white text-[clamp(36px,5vw,58px)] leading-[1.05] tracking-tight">
              Drive with<br />
              <span className="text-amber">RideBack Buddy</span>
            </h1>

            <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-[520px] mx-auto lg:mx-0">
              Become a designated driver and help people get home safely — while earning great pay on your own schedule across the GTA.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-navy font-heading font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,182,39,.35)] text-base"
              >
                Apply Now <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="tel:6475017433"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-base"
              >
                <Phone className="w-4 h-4" /> Call Us First
              </a>
            </div>

            {/* Mini stats */}
            <div className="mt-10 flex flex-wrap gap-8 justify-center lg:justify-start border-t border-white/10 pt-8">
              {[["13+", "Years operating"], ["500+", "Rides per week"], ["GTA-wide", "Service area"]].map(
                ([val, lbl]) => (
                  <div key={lbl}>
                    <p className="font-heading font-bold text-white text-2xl leading-none">{val}</p>
                    <p className="text-white/50 text-sm mt-0.5">{lbl}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Logo / mascot */}
          <div className="flex-shrink-0">
            <Image
              src={logoImage}
              alt="RideBack Buddy"
              width={340}
              height={340}
              className="w-64 lg:w-80 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── Why drive with us ──────────────────────────────────── */}
      <section className="bg-cloud py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber font-semibold text-sm uppercase tracking-widest mb-2">Why us</p>
            <h2 className="font-heading font-bold text-navy text-[clamp(28px,4vw,42px)]">
              More than just a driving gig
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              We&apos;ve been connecting safe drivers with grateful clients since 2011. Here&apos;s what you get when you join the team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl border border-mist p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-amber" />
                </div>
                <h3 className="font-heading font-semibold text-navy text-lg mb-1">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber font-semibold text-sm uppercase tracking-widest mb-2">Process</p>
            <h2 className="font-heading font-bold text-navy text-[clamp(28px,4vw,42px)]">
              From application to first ride
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-mist z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl border border-mist p-6 shadow-sm text-center">
                  <span className="font-heading font-bold text-amber text-3xl block mb-3">{s.num}</span>
                  <h3 className="font-heading font-semibold text-navy mb-1">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requirements ────────────────────────────────────────── */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber font-semibold text-sm uppercase tracking-widest mb-2">Requirements</p>
            <h2 className="font-heading font-bold text-white text-[clamp(28px,4vw,42px)]">
              What we look for
            </h2>
            <p className="mt-3 text-white/60 max-w-xl mx-auto">
              We hire drivers who are professional, reliable, and committed to passenger safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {requirements.map((r) => (
              <div key={r} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ────────────────────────────────────── */}
      <section id="apply" className="py-20 px-6 bg-cloud">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber font-semibold text-sm uppercase tracking-widest mb-2">Apply</p>
            <h2 className="font-heading font-bold text-navy text-[clamp(28px,4vw,42px)]">
              Ready to join us?
            </h2>
            <p className="mt-3 text-muted">
              Fill out the form and we&apos;ll be in touch within 48 hours.
            </p>
          </div>

          <DriverApplyForm />
        </div>
      </section>

    </main>
  );
}

function DriverApplyForm() {
  return (
    <form
      action="/api/driver-applications"
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        const btn = form.querySelector("button[type=submit]") as HTMLButtonElement;
        btn.disabled = true;
        btn.textContent = "Submitting…";

        const res = await fetch("/api/driver-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          form.innerHTML = `
            <div class="text-center py-10">
              <div class="text-5xl mb-4">🎉</div>
              <h3 class="font-heading font-bold text-navy text-2xl mb-2">Application received!</h3>
              <p class="text-muted">Thanks for applying. We'll review your info and call you within 48 hours.</p>
            </div>`;
        } else {
          btn.disabled = false;
          btn.textContent = "Submit Application";
          alert("Something went wrong. Please try again or call us directly.");
        }
      }}
      className="bg-white rounded-2xl border border-mist shadow-sm p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">First name *</label>
          <input required name="firstName" className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Last name *</label>
          <input required name="lastName" className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Email *</label>
        <input required type="email" name="email" className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber" />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Phone *</label>
        <input required type="tel" name="phone" className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber" />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">City / Area you&apos;d like to serve *</label>
        <select required name="area" className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber bg-white">
          <option value="">Select area</option>
          <option>Mississauga</option>
          <option>Oakville</option>
          <option>Burlington</option>
          <option>Hamilton</option>
          <option>Toronto / GTA</option>
          <option>Multiple areas</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Years of driving experience *</label>
        <select required name="experience" className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber bg-white">
          <option value="">Select</option>
          <option>2–3 years</option>
          <option>4–6 years</option>
          <option>7–10 years</option>
          <option>10+ years</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Availability</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {["Thursday nights", "Friday nights", "Saturday nights", "Sunday nights", "Weeknights"].map((day) => (
            <label key={day} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
              <input type="checkbox" name="availability" value={day} className="accent-amber" />
              {day}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Anything else you&apos;d like us to know?</label>
        <textarea name="notes" rows={3} className="w-full px-3 py-2.5 border border-mist rounded-xl text-sm focus:outline-none focus:border-amber resize-none" />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-amber hover:bg-amber-light text-navy font-heading font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,182,39,.35)]"
      >
        Submit Application →
      </button>

      <p className="text-center text-xs text-muted">
        Prefer to talk first?{" "}
        <a href="tel:6475017433" className="text-amber font-semibold hover:underline">
          Call 647-501-7433
        </a>
      </p>
    </form>
  );
}

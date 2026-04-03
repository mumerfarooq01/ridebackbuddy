"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  PartyPopper,
  Truck,
  HeartPulse,
  ChevronDown,
  DollarSign,
  Check,
} from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import CTABanner from "@/components/shared/CTABanner";

const services = [
  {
    icon: Car,
    title: "Standard DD Service",
    description:
      "Our flagship service — a professional designated driver takes the wheel of YOUR car and drives you home safely. A follow car brings a second driver to ensure seamless service.",
    color: "accent-red",
    pricing: [
      { label: "Minimum fare (first 10 km)", value: "$31.00" },
      { label: "Per additional km", value: "$2.75" },
      { label: "Standby (after 5-min grace)", value: "$1.00/min" },
      { label: "Flat rates for 50km+", value: "Available" },
      { label: "407-ETR charges", value: "Extra if applicable" },
    ],
    useCases: [
      "Night out with friends",
      "Dinner and drinks",
      "Bar hopping",
      "Date night",
    ],
  },
  {
    icon: PartyPopper,
    title: "Special Events & Weddings",
    description:
      "Make your event stress-free. We provide designated drivers for your guests, ensuring everyone gets home safely with their own vehicle.",
    color: "gold",
    pricing: [
      { label: "Group rates", value: "Available" },
      { label: "Standby rates", value: "Available" },
      { label: "Reservation", value: "Valid credit card required" },
    ],
    useCases: [
      "Christmas parties",
      "Corporate events",
      "Weddings & receptions",
      "Golf tournaments",
      "Birthday celebrations",
    ],
  },
  {
    icon: Truck,
    title: "Vehicle Drop Service",
    description:
      "Need your car somewhere? We'll pick it up and deliver it to any location — mechanic, airport, detailer, or wherever you need it.",
    color: "blue-400",
    pricing: [
      { label: "Based on distance", value: "Standard rates apply" },
      { label: "Airport drops", value: "Flat rate available" },
    ],
    useCases: [
      "Drop car to mechanic",
      "Airport vehicle delivery",
      "Detailer drop-off",
      "Vacation prep",
      "Busy schedule assistance",
    ],
  },
  {
    icon: HeartPulse,
    title: "Medical & Senior Service",
    description:
      "Compassionate, reliable transportation for medical appointments, post-procedure rides, and daily errands. Door-to-door assistance included.",
    color: "emerald-400",
    pricing: [
      { label: "Standard rates apply", value: "Starting at $31.00" },
      { label: "Multi-stop errands", value: "Available" },
      { label: "Wait time included", value: "Up to 5 min free" },
    ],
    useCases: [
      "Post-procedure transportation",
      "Pharmacy runs",
      "Grocery trips",
      "Salon & spa appointments",
      "Mobility assistance door-to-door",
    ],
  },
];

const faqs = [
  {
    q: "How is the fare calculated?",
    a: "The minimum fare is $31.00 for the first 10 km. After that, it's $2.75 per additional kilometer. There's a 5-minute grace period for wait time, after which a $1.00/minute standby fee applies.",
  },
  {
    q: "Do I need to pay for both drivers?",
    a: "No! Our posted rates cover both drivers. Two drivers come on every trip — one drives your car and the other follows in our vehicle.",
  },
  {
    q: "Are there extra charges for holidays?",
    a: "Holiday surcharges may apply on peak nights like New Year's Eve, Canada Day, and other major holidays. Contact us for specific holiday pricing.",
  },
  {
    q: "Can I get a flat rate for long distances?",
    a: "Yes! For trips over 50 km, we offer competitive flat rates. Call us for a custom quote based on your route.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash, credit cards, and e-transfer. For event bookings, a valid credit card is required to hold the reservation.",
  },
];

export default function ServicesContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(230,57,70,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold mb-3">
              What We Offer
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Services & Pricing
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Transparent pricing, professional service. Choose the option that
              fits your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-8 md:p-10"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left — info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${service.color}/10 flex items-center justify-center text-${service.color}`}>
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    Perfect For
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.useCases.map((uc) => (
                      <li key={uc} className="flex items-center gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-gold flex-shrink-0" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — pricing */}
                <div className="lg:w-80 shrink-0">
                  <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-gold" />
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                        Pricing
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {service.pricing.map((p) => (
                        <div key={p.label} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{p.label}</span>
                          <span className="text-white font-semibold">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            tag="FAQ"
            title="Pricing Questions"
            description="Got questions about our rates? We've got answers."
          />

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

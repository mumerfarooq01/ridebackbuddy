"use client";

import { motion } from "framer-motion";
import { Phone, PartyPopper, Car, HeartPulse } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const services = [
  {
    icon: Car,
    title: "Standard Designated Driver",
    description:
      "Our core service — a professional driver takes you and your car home safely. Two drivers per trip ensures seamless service.",
    color: "from-accent-red/20 to-accent-red/5",
    iconColor: "text-accent-red",
  },
  {
    icon: PartyPopper,
    title: "Special Events & Weddings",
    description:
      "Christmas parties, corporate events, weddings, golf tournaments — we handle the driving so your guests enjoy the celebration.",
    color: "from-gold/20 to-gold/5",
    iconColor: "text-gold",
  },
  {
    icon: Phone,
    title: "Vehicle Drop Service",
    description:
      "Need your car at the mechanic, airport, or detailer? We'll pick up and drop off your vehicle wherever it needs to go.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: HeartPulse,
    title: "Medical & Senior Service",
    description:
      "Post-procedure transportation, multi-stop errands, and mobility assistance. Door-to-door care for those who need it most.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
];

export default function ServiceCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          tag="Our Services"
          title="Safe Rides for Every Occasion"
          description="Whether it's a night out or a medical appointment, we've got you covered with professional designated drivers."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${service.iconColor}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

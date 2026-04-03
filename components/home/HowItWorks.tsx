"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Wine, Home } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  {
    icon: CalendarCheck,
    step: "01",
    title: "Book Your Ride",
    description:
      "Reserve online or call us. Give us your pickup location, time, and destination.",
  },
  {
    icon: Wine,
    step: "02",
    title: "Enjoy Your Evening",
    description:
      "Relax and have a great time. We'll be there when you're ready to leave.",
  },
  {
    icon: Home,
    step: "03",
    title: "Get Home Safe",
    description:
      "Our driver takes you AND your car home. No need for a taxi or a tow.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-navy-light/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          tag="How It Works"
          title="Three Simple Steps"
          description="Getting home safely has never been easier."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-red/20 to-transparent flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-accent-red" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gold text-navy text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

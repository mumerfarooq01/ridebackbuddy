"use client";

import { motion } from "framer-motion";
import { Award, Users, MapPin } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "13+",
    label: "Years Experience",
  },
  {
    icon: Users,
    value: "2",
    label: "Drivers Per Trip",
  },
  {
    icon: MapPin,
    value: "GTA",
    label: "& Surrounding Areas",
  },
];

export default function TrustBar() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

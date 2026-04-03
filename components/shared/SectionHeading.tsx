"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  tag?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionHeading({
  tag,
  title,
  description,
  centered = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      {tag && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold mb-3">
          {tag}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      {description && (
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">{description}</p>
      )}
    </motion.div>
  );
}

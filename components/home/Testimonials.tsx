"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Mississauga",
    rating: 5,
    text: "Amazing service! The drivers were professional and my car was already home when I woke up. Highly recommend for any night out in the GTA.",
  },
  {
    name: "James K.",
    location: "Oakville",
    rating: 5,
    text: "Used Ride Home for our company holiday party — they handled 15 rides seamlessly. Everyone got home safe with their cars. Will definitely use again!",
  },
  {
    name: "Maria L.",
    location: "Burlington",
    rating: 5,
    text: "My elderly mother needed rides to multiple appointments and the pharmacy. The drivers were patient, kind, and incredibly helpful. A lifesaver!",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          tag="Testimonials"
          title="What Our Customers Say"
          description="Don't just take our word for it."
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 md:p-12 text-center relative"
            >
              <Quote className="w-10 h-10 text-accent-red/30 mx-auto mb-6" />

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold text-gold"
                  />
                ))}
              </div>

              <p className="text-white font-semibold">
                {testimonials[current].name}
              </p>
              <p className="text-gray-500 text-sm">
                {testimonials[current].location}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() =>
                setCurrent(
                  (prev) => (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === current
                      ? "w-6 bg-accent-red"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrent((prev) => (prev + 1) % testimonials.length)
              }
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

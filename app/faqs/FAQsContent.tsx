"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import CTABanner from "@/components/shared/CTABanner";

const faqs = [
  {
    question: "How do I book a ride?",
    answer:
      "You can book a ride by calling us directly, or by using our convenient online booking form. Simply provide your pickup location, destination, date, and time — and we'll handle the rest. A dispatcher will confirm your booking via phone.",
  },
  {
    question: "Do you drive my car or yours?",
    answer:
      "We drive YOUR car! That's the beauty of our service. We send two professional drivers on every trip — one drives your vehicle while the other follows in our company car. You wake up with your car already in your driveway.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We proudly serve Mississauga, Oakville, Burlington, Hamilton, and the Greater Toronto Area (GTA). If you're unsure whether we cover your area, give us a call and we'll do our best to accommodate you.",
  },
  {
    question: "How are fares calculated?",
    answer:
      "Our minimum fare is $31.00 for the first 10 km. After that, it's $2.75 per additional kilometer. There's a 5-minute grace period for wait time, after which a $1.00/minute standby fee applies. Flat rates are available for trips over 50 km. 407-ETR charges apply separately if applicable.",
  },
  {
    question: "Is there a cancellation policy?",
    answer:
      "Yes. We ask for at least 2 hours' notice for cancellations. Late cancellations or no-shows may be subject to a cancellation fee, especially for pre-booked event services where a credit card is on file.",
  },
  {
    question: "Do you operate on holidays?",
    answer:
      "Yes, we operate on all major holidays including New Year's Eve, Canada Day, Christmas, and more. In fact, holidays are our busiest times! We recommend booking early on peak nights to secure your ride. Holiday surcharges may apply.",
  },
  {
    question: "Can I book for a group?",
    answer:
      "Absolutely! We offer group rates for events like Christmas parties, weddings, corporate events, and golf tournaments. Contact us with your event details and we'll create a custom plan to ensure every guest gets home safely.",
  },
  {
    question: "What if I need help getting to my door?",
    answer:
      "Our drivers are happy to assist you from the vehicle to your door. For our Medical & Senior Service, we provide full door-to-door mobility assistance. Just let us know about any accessibility needs when booking.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, all major credit cards, and e-transfer. For event bookings and reservations, a valid credit card is required to hold the booking.",
  },
  {
    question: "Are your drivers insured and background-checked?",
    answer:
      "Yes, all of our drivers undergo thorough background checks and are fully insured. We pride ourselves on professionalism, reliability, and the highest safety standards.",
  },
];

export default function FAQsContent() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,182,39,0.1),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-mist text-xs font-semibold uppercase tracking-widest text-navy mb-3">
              Got Questions?
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Everything you need to know about our designated driver service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="bg-white border border-mist shadow-sm rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-mist/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-amber" />
                </div>
                <span className="text-navy font-medium flex-1 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-300 flex-shrink-0 ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5 pl-[72px]"
                >
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner
        title="Still Have Questions?"
        subtitle="Our team is ready to help. Give us a call or send us a message."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  );
}

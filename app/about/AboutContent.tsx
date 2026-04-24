"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  Award,
  Users,
  Heart,
  MapPin,
  CheckCircle2,
  Car,
} from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import CTABanner from "@/components/shared/CTABanner";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Every driver is background-checked, fully insured, and trained in defensive driving. Your safety is our #1 priority.",
  },
  {
    icon: Clock,
    title: "Reliability",
    description:
      "We arrive on time, every time. Our dispatch team coordinates pickups seamlessly so you never have to wait.",
  },
  {
    icon: Award,
    title: "Professionalism",
    description:
      "From the moment you book to the moment you're home, expect courteous, professional, and discreet service.",
  },
];

const milestones = [
  { year: "2011", event: "Founded in Mississauga, Ontario" },
  { year: "2014", event: "Expanded service to Oakville & Burlington" },
  { year: "2016", event: "Launched Medical & Senior driver service" },
  { year: "2018", event: "Hamilton service area added" },
  { year: "2020", event: "Enhanced safety protocols & contactless payments" },
  { year: "2024", event: "13+ years and counting — trusted across the GTA" },
];

export default function AboutContent() {
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
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              About Ride Home
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Since 2011, we&apos;ve been Ontario&apos;s most trusted designated driver
              service — getting you AND your car home safely.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-navy mb-6">
                13+ Years of Getting People Home Safe
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Ride Home Designated Drivers was founded in 2011 with a simple
                  mission: no one should have to choose between a great night out
                  and getting home safely with their car.
                </p>
                <p>
                  Unlike a taxi or rideshare, we send{" "}
                  <span className="text-navy font-semibold">two drivers</span> on
                  every trip — one drives YOUR car while the other follows. That
                  means you wake up the next morning with your car already in
                  your driveway.
                </p>
                <p>
                  From our roots in Mississauga, we&apos;ve grown to serve Oakville,
                  Burlington, Hamilton, and the entire Greater Toronto Area. Our
                  team of professional, background-checked drivers has safely
                  transported thousands of customers and their vehicles.
                </p>
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Award, value: "13+", label: "Years of Service", color: "text-amber" },
                { icon: Users, value: "2", label: "Drivers Per Trip", color: "text-navy" },
                { icon: Heart, value: "1000s", label: "Happy Customers", color: "text-mint" },
                { icon: MapPin, value: "5+", label: "Cities Served", color: "text-navy" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-mist shadow-sm rounded-2xl p-6 text-center"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <p className="text-2xl font-bold text-navy">{stat.value}</p>
                  <p className="text-sm text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-mist/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Our Values"
            title="What We Stand For"
            description="Three core principles guide everything we do."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="bg-white border border-mist shadow-sm rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-amber" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {value.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            tag="Our Journey"
            title="Milestones"
          />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-mist" />

            <div className="space-y-8">
              {milestones.map((m, idx) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-6 relative"
                >
                  <div className="w-10 h-10 rounded-full bg-amber/20 border-2 border-amber flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle2 className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <span className="text-navy font-bold">{m.year}</span>
                    <p className="text-muted mt-1">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 px-4 bg-mist/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Where We Operate"
            title="Service Area"
            description="We cover Mississauga, Oakville, Burlington, Hamilton, and the Greater Toronto Area."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-mist shadow-sm rounded-2xl overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d369112.62476872595!2d-80.10739500665028!3d43.41810449575328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b469fe76b05b7%3A0x3be01b7542c1504!2sGolden%20Horseshoe%2C%20ON!5e0!3m2!1sen!2sca!4v1710000000000!5m2!1sen!2sca"
              className="w-full h-[400px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Service Area Map"
            />
          </motion.div>
        </div>
      </section>

      {/* Become a Driver CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-mist shadow-sm rounded-2xl p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-amber/20 flex items-center justify-center mx-auto mb-6">
                <Car className="w-8 h-8 text-amber" />
              </div>
              <h2 className="text-3xl font-bold text-navy mb-4">
                Become a Driver
              </h2>
              <p className="text-muted max-w-xl mx-auto mb-8">
                Join our team of professional designated drivers. Flexible hours,
                great pay, and the satisfaction of getting people home safely.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-amber hover:opacity-90 text-navy px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl shadow-amber/25"
              >
                Apply Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

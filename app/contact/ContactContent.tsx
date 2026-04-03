"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  User,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const phoneNumbers = [
  { label: "Main Line", number: "647-501-7433", region: "All Areas" },
  { label: "Hamilton", number: "289-683-4323", region: "Hamilton" },
  { label: "Burlington/Oakville", number: "905-805-4323", region: "Burlington & Oakville" },
  { label: "Mississauga", number: "416-752-4323", region: "Mississauga" },
];

export default function ContactContent() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

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
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Have a question or need to book a ride? We&apos;re here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {formSubmitted ? (
                <div className="glass rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-400">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-8 space-y-5"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Send Us a Message
                  </h3>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <User className="w-4 h-4" /> Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Phone className="w-4 h-4" /> Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="647-555-1234"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Mail className="w-4 h-4" /> Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MessageSquare className="w-4 h-4" /> Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-brand hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-accent-red/20"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Phone Numbers */}
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-accent-red" />
                  Call Us
                </h3>
                <div className="space-y-4">
                  {phoneNumbers.map((p) => (
                    <a
                      key={p.number}
                      href={`tel:${p.number.replace(/-/g, "")}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div>
                        <p className="text-white font-medium group-hover:text-gold transition-colors">
                          {p.number}
                        </p>
                        <p className="text-xs text-gray-500">{p.region}</p>
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {p.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold" />
                  Hours of Operation
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sunday – Thursday</span>
                    <span className="text-white font-medium">8:00 PM – 2:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Friday – Saturday</span>
                    <span className="text-white font-medium">8:00 PM – 3:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Service Area
                </h3>
                <p className="text-gray-400 text-sm">
                  Mississauga, Oakville, Burlington, Hamilton & the Greater Toronto Area
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden"
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
    </>
  );
}

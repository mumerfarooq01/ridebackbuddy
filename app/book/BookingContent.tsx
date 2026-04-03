"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  User,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Accessibility,
  Calculator,
  PartyPopper,
  Truck,
  HeartPulse,
} from "lucide-react";

const formSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type"),
  pickupDate: z.string().min(1, "Please select a date"),
  pickupTime: z.string().min(1, "Please select a time"),
  pickupAddress: z.string().min(3, "Please enter a pickup address"),
  dropoffAddress: z.string().min(3, "Please enter a drop-off address"),
  estimatedDistance: z.string().optional(),
  specialNotes: z.string().optional(),
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  passengers: z.string().min(1, "Please select number of passengers"),
  accessibility: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const serviceTypes = [
  { value: "standard", label: "Standard Designated Driver", icon: Car },
  { value: "event", label: "Special Event / Wedding", icon: PartyPopper },
  { value: "vehicle-drop", label: "Vehicle Drop", icon: Truck },
  { value: "medical", label: "Medical / Senior", icon: HeartPulse },
];

const steps = [
  { label: "Ride Details", icon: Car },
  { label: "Personal Info", icon: User },
  { label: "Review & Confirm", icon: ClipboardCheck },
];

function calculateFare(distanceKm: number): string {
  if (distanceKm <= 0) return "$31.00";
  if (distanceKm <= 10) return "$31.00";
  const extra = (distanceKm - 10) * 2.75;
  return `$${(31 + extra).toFixed(2)}`;
}

export default function BookingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      pickupDate: "",
      pickupTime: "",
      pickupAddress: "",
      dropoffAddress: "",
      estimatedDistance: "",
      specialNotes: "",
      fullName: "",
      phone: "",
      email: "",
      passengers: "1",
      accessibility: false,
    },
  });

  const formValues = watch();
  const distanceNum = parseFloat(formValues.estimatedDistance || "0");

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["serviceType", "pickupDate", "pickupTime", "pickupAddress", "dropoffAddress"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["fullName", "phone", "email", "passengers"];
    }

    const valid = await trigger(fieldsToValidate);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-10 md:p-16 text-center max-w-xl"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Your request has been received. A dispatcher will call to confirm
            your booking shortly.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Estimated fare: {calculateFare(distanceNum)}
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(230,57,70,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Book Your Ride
            </h1>
            <p className="text-lg text-gray-400">
              Fill out the form below and we&apos;ll get you home safe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  idx <= currentStep
                    ? "bg-gradient-brand text-white"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {idx < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`hidden sm:block text-sm ${
                  idx <= currentStep ? "text-white" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-12 lg:w-24 h-px mx-2 transition-colors duration-300 ${
                    idx < currentStep ? "bg-accent-red" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1 — Ride Details */}
              {currentStep === 0 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-8 space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Ride Details
                  </h3>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">
                      Service Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceTypes.map((st) => (
                        <label
                          key={st.value}
                          className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            formValues.serviceType === st.value
                              ? "border-accent-red bg-accent-red/10"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            value={st.value}
                            {...register("serviceType")}
                            className="sr-only"
                          />
                          <st.icon className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-white">{st.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.serviceType && (
                      <p className="text-accent-red text-xs mt-2">
                        {errors.serviceType.message}
                      </p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" /> Pickup Date
                      </label>
                      <input
                        type="date"
                        {...register("pickupDate")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-red focus:outline-none transition-colors"
                      />
                      {errors.pickupDate && (
                        <p className="text-accent-red text-xs mt-1">
                          {errors.pickupDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Clock className="w-4 h-4" /> Pickup Time
                      </label>
                      <input
                        type="time"
                        {...register("pickupTime")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-red focus:outline-none transition-colors"
                      />
                      {errors.pickupTime && (
                        <p className="text-accent-red text-xs mt-1">
                          {errors.pickupTime.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" /> Pickup Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main St, Mississauga, ON"
                      {...register("pickupAddress")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                    />
                    {errors.pickupAddress && (
                      <p className="text-accent-red text-xs mt-1">
                        {errors.pickupAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" /> Drop-off Address
                    </label>
                    <input
                      type="text"
                      placeholder="456 Oak Ave, Oakville, ON"
                      {...register("dropoffAddress")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                    />
                    {errors.dropoffAddress && (
                      <p className="text-accent-red text-xs mt-1">
                        {errors.dropoffAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Distance & Notes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calculator className="w-4 h-4" /> Est. Distance (km)
                      </label>
                      <input
                        type="number"
                        placeholder="15"
                        {...register("estimatedDistance")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <MessageSquare className="w-4 h-4" /> Special Notes
                      </label>
                      <input
                        type="text"
                        placeholder="Any instructions..."
                        {...register("specialNotes")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Personal Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-8 space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Personal Information
                  </h3>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...register("fullName")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                    />
                    {errors.fullName && (
                      <p className="text-accent-red text-xs mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Phone className="w-4 h-4" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="647-555-1234"
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                      />
                      {errors.phone && (
                        <p className="text-accent-red text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Mail className="w-4 h-4" /> Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-accent-red focus:outline-none transition-colors"
                      />
                      {errors.email && (
                        <p className="text-accent-red text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Users className="w-4 h-4" /> Passengers
                      </label>
                      <select
                        {...register("passengers")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-red focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n} className="bg-navy">
                            {n} {n === 1 ? "passenger" : "passengers"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:border-white/20 transition-colors w-full">
                        <input
                          type="checkbox"
                          {...register("accessibility")}
                          className="w-4 h-4 rounded accent-accent-red"
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Accessibility className="w-4 h-4" />
                          Accessibility needs
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Review */}
              {currentStep === 2 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-8 space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Review & Confirm
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                      <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                        Ride Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Service:</span>
                          <p className="text-white">
                            {serviceTypes.find((s) => s.value === formValues.serviceType)?.label || "—"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date & Time:</span>
                          <p className="text-white">
                            {formValues.pickupDate} at {formValues.pickupTime}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Pickup:</span>
                          <p className="text-white">{formValues.pickupAddress}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Drop-off:</span>
                          <p className="text-white">{formValues.dropoffAddress}</p>
                        </div>
                        {formValues.specialNotes && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Notes:</span>
                            <p className="text-white">{formValues.specialNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                      <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                        Personal Info
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <p className="text-white">{formValues.fullName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p className="text-white">{formValues.phone}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <p className="text-white">{formValues.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Passengers:</span>
                          <p className="text-white">{formValues.passengers}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fare Estimate */}
                    <div className="bg-gradient-to-r from-accent-red/10 to-gold/10 rounded-xl p-5 border border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                            Estimated Fare
                          </h4>
                          <p className="text-xs text-gray-400">
                            {distanceNum > 0
                              ? `Based on ${distanceNum} km`
                              : "Based on minimum fare"}
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-white">
                          {calculateFare(distanceNum)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Fare is an estimate. Final price confirmed by dispatcher.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-brand hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-accent-red/20"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-brand hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-accent-red/20"
                >
                  <Check className="w-4 h-4" />
                  Confirm Booking
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

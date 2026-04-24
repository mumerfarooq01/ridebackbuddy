"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, User, ClipboardCheck, ChevronRight, ChevronLeft, Check,
  MapPin, Calendar, Clock, MessageSquare, Phone, Mail, Users,
  Accessibility, Calculator, PartyPopper, Truck, HeartPulse,
  Minus, Plus, AlertTriangle,
} from "lucide-react";

// ── Official Ride Home DD rate sheet ────────────────────────────
//   Base: $31.00 for first 10 km, then $2.75/km (rounded up to next whole km)
const OUT_OF_AREA: Record<string, number> = {
  "Etobicoke": 5,
  "Mississauga (by Airport)": 5,
  "Toronto W (to Church St)": 10,
  "Toronto E (from Jarvis)": 15,
  "Vaughan / Maple": 20,
  "Brampton S of Williams Pkwy": 10,
  "Brampton N of Williams Pkwy": 15,
  "Bolton": 15,
  "Caledon": 15,
  "Kleinberg": 20,
  "Richmond Hill": 20,
  "Nobleton": 20,
  "Milton S of Steeles": 5,
  "Milton N of Steeles": 10,
  "Georgetown": 15,
  "Acton / Campbellville": 15,
  "Guelph": 20,
  "Carlisle": 5,
  "Freelton": 5,
  "Flamborough": 5,
  "Millgrove": 5,
  "Dundas": 5,
  "Ancaster": 5,
  "Copetown": 10,
  "Caledonia": 15,
  "Mt. Hope": 5,
  "Grimsby": 10,
  "Hannon": 5,
  "Stoney Creek (to Fruitland)": 5,
  "Stoney Creek (Winona)": 10,
  "Beamsville": 15,
  "Smithville": 15,
  "Cayuga": 20,
};

const REGION_OPTIONS = [
  { value: "none", label: "Local / No surcharge" },
  ...Object.entries(OUT_OF_AREA).map(([k, v]) => ({
    value: k,
    label: `${k}  (+$${v}.00)`,
  })),
  { value: "other", label: "Other / not listed — Call Dispatch" },
];

interface FareBreakdown {
  km: number;
  distanceFare: number;
  region: string;
  regionSurcharge: number | null;
  ccSurcharge: number;
  stops: number;
  stopsFee: number;
  use407: boolean;
  km407: number;
  toll407: number;
  total: number;
}

function calcFare(
  km: number,
  region: string,
  paymentMethod: string,
  stops: number,
  use407: boolean,
  km407: number,
): FareBreakdown {
  // $31 base + $2.75 per whole km over 10 (rounded up)
  const distanceFare = 31.0 + Math.ceil(Math.max(km - 10, 0)) * 2.75;
  const regionSurcharge = region in OUT_OF_AREA ? OUT_OF_AREA[region] : null;
  const ccSurcharge = paymentMethod === "card" ? 1.0 : 0;
  const stopsFee = stops * 3.0;
  const toll407 = use407 ? 15.0 + km407 * 0.25 : 0;
  const total =
    distanceFare + (regionSurcharge ?? 0) + ccSurcharge + stopsFee + toll407;
  return {
    km, distanceFare, region, regionSurcharge,
    ccSurcharge, stops, stopsFee, use407, km407, toll407, total,
  };
}

// ── Zod schema ──────────────────────────────────────────────────
const formSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type"),
  pickupDate: z.string().min(1, "Please select a date"),
  pickupTime: z.string().min(1, "Please select a time"),
  pickupAddress: z.string().min(3, "Please enter a pickup address"),
  dropoffAddress: z.string().min(3, "Please enter a drop-off address"),
  estimatedDistance: z.string().optional(),
  region: z.string(),
  paymentMethod: z.string(),
  stops: z.number().min(0).max(5),
  use407: z.boolean(),
  km407: z.number().min(0),
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

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white border border-mist text-ink placeholder-gray-400 focus:border-amber focus:outline-none transition-colors";

export default function BookingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
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
      region: "none",
      paymentMethod: "cash",
      stops: 0,
      use407: false,
      km407: 0,
      specialNotes: "",
      fullName: "",
      phone: "",
      email: "",
      passengers: "1",
      accessibility: false,
    },
  });

  const fv = watch();
  const kmNum = Math.max(0, parseFloat(fv.estimatedDistance || "0") || 0);
  const stopsNum = Math.min(5, Math.max(0, Number(fv.stops) || 0));
  const km407Num = Math.max(0, Number(fv.km407) || 0);
  const isOtherRegion = fv.region === "other";
  const km407Error = fv.use407 && km407Num > kmNum && kmNum > 0;

  const fare = calcFare(kmNum, fv.region, fv.paymentMethod, stopsNum, !!fv.use407, km407Num);

  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];
    if (currentStep === 0)
      fields = ["serviceType", "pickupDate", "pickupTime", "pickupAddress", "dropoffAddress"];
    else if (currentStep === 1)
      fields = ["fullName", "phone", "email", "passengers"];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const onSubmit = () => setSubmitted(true);

  // ── Confirmation screen ──────────────────────────────────────
  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-mist shadow-sm rounded-2xl p-10 md:p-16 text-center max-w-xl w-full"
        >
          <div className="w-20 h-20 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-mint" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-navy mb-4">You&apos;re set!</h2>
          <p className="text-muted text-lg leading-relaxed">
            Request received. A dispatcher will call to confirm your booking shortly.
          </p>

          {/* Itemized receipt */}
          <div className="mt-6 rounded-xl border border-mist overflow-hidden text-left">
            <div className="bg-cloud px-5 py-3 border-b border-mist">
              <p className="font-heading font-semibold text-navy text-sm uppercase tracking-wider">
                Fare Estimate
              </p>
            </div>
            <div className="px-5 py-4 space-y-2 text-sm">
              <FareRow label={`Distance (${kmNum > 0 ? `${kmNum} km` : "minimum"})`} amount={fare.distanceFare} />
              {fare.regionSurcharge !== null && (
                <FareRow label={`Out of area: ${fare.region}`} amount={fare.regionSurcharge} />
              )}
              {fare.ccSurcharge > 0 && <FareRow label="Credit card surcharge" amount={fare.ccSurcharge} />}
              {fare.stopsFee > 0 && (
                <FareRow label={`${fare.stops} intermediate stop${fare.stops > 1 ? "s" : ""}`} amount={fare.stopsFee} />
              )}
              {fare.toll407 > 0 && (
                <FareRow label={`407 ETR (${fare.km407} km)`} amount={fare.toll407} />
              )}
              <div className="flex justify-between font-heading font-bold text-navy border-t border-mist pt-3 mt-1">
                <span>Total</span>
                <span className="text-xl">${fare.total.toFixed(2)}</span>
              </div>
            </div>
            <p className="px-5 pb-4 text-xs text-muted">
              Estimate only. Final fare confirmed by dispatcher at pickup.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,182,39,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">Book Your Ride</h1>
            <p className="text-lg text-muted">Fill out the form below and we&apos;ll get you home safe.</p>
          </motion.div>
        </div>
      </section>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${idx <= currentStep ? "bg-amber text-navy shadow-sm" : "bg-white border border-mist text-muted"}`}>
                {idx < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${idx <= currentStep ? "text-navy" : "text-muted"}`}>
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className={`hidden sm:block w-12 lg:w-24 h-px mx-2 transition-colors duration-300 ${idx < currentStep ? "bg-amber" : "bg-mist"}`} />
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

              {/* ── Step 1: Ride Details ─────────────────────── */}
              {currentStep === 0 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
                  className="bg-white border border-mist shadow-sm rounded-2xl p-8 space-y-6"
                >
                  <h3 className="font-heading text-xl font-semibold text-navy">Ride Details</h3>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm text-muted mb-3">Service Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceTypes.map((st) => (
                        <label key={st.value} className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${fv.serviceType === st.value ? "border-amber bg-amber/10" : "border-mist bg-white hover:border-amber/50"}`}>
                          <input type="radio" value={st.value} {...register("serviceType")} className="sr-only" />
                          <st.icon className={`w-5 h-5 ${fv.serviceType === st.value ? "text-amber" : "text-muted"}`} />
                          <span className="text-sm text-navy">{st.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.serviceType && <p className="text-amber text-xs mt-2">{errors.serviceType.message}</p>}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><Calendar className="w-4 h-4" /> Pickup Date</label>
                      <input type="date" {...register("pickupDate")} className={inputCls} />
                      {errors.pickupDate && <p className="text-amber text-xs mt-1">{errors.pickupDate.message}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><Clock className="w-4 h-4" /> Pickup Time</label>
                      <input type="time" {...register("pickupTime")} className={inputCls} />
                      {errors.pickupTime && <p className="text-amber text-xs mt-1">{errors.pickupTime.message}</p>}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted mb-2"><MapPin className="w-4 h-4" /> Pickup Address</label>
                    <input type="text" placeholder="123 Main St, Mississauga, ON" {...register("pickupAddress")} className={inputCls} />
                    {errors.pickupAddress && <p className="text-amber text-xs mt-1">{errors.pickupAddress.message}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted mb-2"><MapPin className="w-4 h-4" /> Drop-off Address</label>
                    <input type="text" placeholder="456 Oak Ave, Oakville, ON" {...register("dropoffAddress")} className={inputCls} />
                    {errors.dropoffAddress && <p className="text-amber text-xs mt-1">{errors.dropoffAddress.message}</p>}
                  </div>

                  {/* Destination Region */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted mb-2"><MapPin className="w-4 h-4" /> Destination Region</label>
                    <select {...register("region")} className={inputCls}>
                      {REGION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted mt-1.5">Select your destination to include any out-of-area surcharge.</p>
                  </div>

                  {/* Call Dispatch — "other" region */}
                  {isOtherRegion && (
                    <div className="flex items-start gap-3 bg-amber/10 border border-amber/40 rounded-xl p-4">
                      <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-navy">When in doubt, please Call Dispatch!</p>
                        <a href="tel:6475017433" className="text-amber font-semibold text-sm hover:underline">647-501-7433</a>
                      </div>
                    </div>
                  )}

                  {/* Distance & Stops */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><Calculator className="w-4 h-4" /> Est. Distance (km)</label>
                      <input type="number" min="0" step="0.1" placeholder="15" {...register("estimatedDistance")} className={inputCls} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><MapPin className="w-4 h-4" /> Intermediate Stops <span className="text-xs">(+$3.00 ea.)</span></label>
                      <div className="flex items-center gap-3 mt-1">
                        <button type="button" onClick={() => setValue("stops", Math.max(0, stopsNum - 1))}
                          className="w-10 h-10 rounded-lg border border-mist flex items-center justify-center text-muted hover:border-navy hover:text-navy transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-heading font-bold text-navy text-lg w-6 text-center">{stopsNum}</span>
                        <button type="button" onClick={() => setValue("stops", Math.min(5, stopsNum + 1))}
                          className="w-10 h-10 rounded-lg border border-mist flex items-center justify-center text-muted hover:border-navy hover:text-navy transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm text-muted mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "cash", label: "Cash" },
                        { value: "card", label: "Card / Account  (+$1.00)" },
                      ].map((pm) => (
                        <label key={pm.value} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${fv.paymentMethod === pm.value ? "border-amber bg-amber/10" : "border-mist hover:border-amber/50"}`}>
                          <input type="radio" value={pm.value} {...register("paymentMethod")} className="sr-only" />
                          <span className="text-sm text-navy font-medium">{pm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 407 ETR */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-mist cursor-pointer hover:border-amber/50 transition-all">
                      <input type="checkbox" {...register("use407")} className="w-4 h-4 rounded accent-amber" />
                      <span className="text-sm text-navy">Using 407 ETR &nbsp;<span className="text-muted">(+$15.00 base + $0.25/km on 407)</span></span>
                    </label>
                    {fv.use407 && (
                      <div>
                        <label className="block text-sm text-muted mb-2">Approx. km on 407</label>
                        <input type="number" min="0" step="1" placeholder="0" {...register("km407")}
                          className={`${inputCls} ${km407Error ? "border-red-400 focus:border-red-400" : ""}`} />
                        {km407Error && <p className="text-red-500 text-xs mt-1">407 km cannot exceed total trip distance.</p>}
                      </div>
                    )}
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted mb-2"><MessageSquare className="w-4 h-4" /> Special Notes</label>
                    <input type="text" placeholder="Manual transmission, child seat in back…" {...register("specialNotes")} className={inputCls} />
                  </div>

                  {/* No food stops — always visible */}
                  <div className="flex items-center gap-3 bg-navy/5 border border-navy/10 rounded-xl px-4 py-3">
                    <AlertTriangle className="w-4 h-4 text-navy flex-shrink-0" />
                    <p className="text-sm font-semibold text-navy">No food stops. No stopping for food.</p>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Personal Info ─────────────────────── */}
              {currentStep === 1 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
                  className="bg-white border border-mist shadow-sm rounded-2xl p-8 space-y-6"
                >
                  <h3 className="font-heading text-xl font-semibold text-navy">Personal Information</h3>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted mb-2"><User className="w-4 h-4" /> Full Name</label>
                    <input type="text" placeholder="Jane Smith" {...register("fullName")} className={inputCls} />
                    {errors.fullName && <p className="text-amber text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><Phone className="w-4 h-4" /> Phone Number</label>
                      <input type="tel" placeholder="647-555-1234" {...register("phone")} className={inputCls} />
                      {errors.phone && <p className="text-amber text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><Mail className="w-4 h-4" /> Email</label>
                      <input type="email" placeholder="jane@example.com" {...register("email")} className={inputCls} />
                      {errors.email && <p className="text-amber text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-muted mb-2"><Users className="w-4 h-4" /> Passengers</label>
                      <select {...register("passengers")} className={inputCls}>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "passenger" : "passengers"}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-mist bg-white cursor-pointer hover:border-amber/50 transition-colors w-full h-[50px]">
                        <input type="checkbox" {...register("accessibility")} className="w-4 h-4 rounded accent-amber" />
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Accessibility className="w-4 h-4" /> Accessibility needs
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Review & Confirm ─────────────────── */}
              {currentStep === 2 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
                  className="bg-white border border-mist shadow-sm rounded-2xl p-8 space-y-6"
                >
                  <h3 className="font-heading text-xl font-semibold text-navy">Review & Confirm</h3>

                  {/* Ride summary */}
                  <div className="bg-mist/30 rounded-xl p-5 border border-mist">
                    <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Ride Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted">Service:</span>
                        <p className="text-navy font-medium">{serviceTypes.find((s) => s.value === fv.serviceType)?.label || "—"}</p>
                      </div>
                      <div>
                        <span className="text-muted">Date & Time:</span>
                        <p className="text-navy font-medium">{fv.pickupDate} at {fv.pickupTime}</p>
                      </div>
                      <div>
                        <span className="text-muted">Pickup:</span>
                        <p className="text-navy font-medium">{fv.pickupAddress}</p>
                      </div>
                      <div>
                        <span className="text-muted">Drop-off:</span>
                        <p className="text-navy font-medium">{fv.dropoffAddress}</p>
                      </div>
                      {fv.region !== "none" && fv.region !== "other" && (
                        <div>
                          <span className="text-muted">Region:</span>
                          <p className="text-navy font-medium">{fv.region}</p>
                        </div>
                      )}
                      {fv.specialNotes && (
                        <div className="col-span-2">
                          <span className="text-muted">Notes:</span>
                          <p className="text-navy font-medium">{fv.specialNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="bg-mist/30 rounded-xl p-5 border border-mist">
                    <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Personal Info</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted">Name:</span><p className="text-navy font-medium">{fv.fullName}</p></div>
                      <div><span className="text-muted">Phone:</span><p className="text-navy font-medium">{fv.phone}</p></div>
                      <div><span className="text-muted">Email:</span><p className="text-navy font-medium">{fv.email}</p></div>
                      <div><span className="text-muted">Passengers:</span><p className="text-navy font-medium">{fv.passengers}</p></div>
                    </div>
                  </div>

                  {/* Itemized fare breakdown */}
                  <div className="rounded-xl border border-amber/25 overflow-hidden">
                    <div className="bg-amber/10 px-5 py-3 border-b border-amber/20">
                      <h4 className="font-heading font-semibold text-navy text-sm uppercase tracking-wider">Fare Estimate</h4>
                    </div>
                    <div className="px-5 py-4 space-y-2 text-sm">
                      <FareRow label={`Distance (${kmNum > 0 ? `${kmNum} km` : "minimum"})`} amount={fare.distanceFare} />
                      {fare.regionSurcharge !== null && (
                        <FareRow label={`Out of area: ${fare.region}`} amount={fare.regionSurcharge} />
                      )}
                      {fare.ccSurcharge > 0 && <FareRow label="Credit card surcharge" amount={fare.ccSurcharge} />}
                      {fare.stopsFee > 0 && (
                        <FareRow label={`${fare.stops} intermediate stop${fare.stops > 1 ? "s" : ""}`} amount={fare.stopsFee} />
                      )}
                      {fare.toll407 > 0 && (
                        <FareRow label={`407 ETR (${fare.km407} km)`} amount={fare.toll407} />
                      )}
                      <div className="flex justify-between font-heading font-bold text-navy border-t border-amber/20 pt-3 mt-1">
                        <span>Total</span>
                        <span className="text-xl">${fare.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="px-5 pb-4 text-xs text-muted">
                      Estimate only — final fare confirmed by dispatcher at pickup.
                    </p>
                  </div>

                  {/* Call Dispatch notice when region = other */}
                  {isOtherRegion && (
                    <div className="flex items-start gap-3 bg-amber/10 border border-amber rounded-xl p-4">
                      <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-navy">When in doubt, please Call Dispatch!</p>
                        <a href="tel:6475017433" className="text-amber font-semibold text-sm hover:underline">647-501-7433</a>
                        <p className="text-xs text-muted mt-1">
                          Your destination isn&apos;t on our surcharge list. A dispatcher will quote your exact fare.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              {currentStep > 0 ? (
                <button type="button" onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-mist text-muted hover:text-navy hover:bg-mist transition-all shadow-sm">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {currentStep < 2 ? (
                <button type="button" onClick={nextStep}
                  className="flex items-center gap-2 bg-amber hover:opacity-90 text-navy px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-amber/20">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isOtherRegion || km407Error}
                  className="flex items-center gap-2 bg-amber hover:opacity-90 text-navy px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-amber/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
                  <Check className="w-4 h-4" /> Confirm Booking
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

// ── Shared fare row helper ───────────────────────────────────────
function FareRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between text-ink">
      <span className="text-muted">{label}</span>
      <span className="font-medium tabular-nums">${amount.toFixed(2)}</span>
    </div>
  );
}

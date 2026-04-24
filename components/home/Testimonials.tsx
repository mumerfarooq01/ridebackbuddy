"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const testimonials = [
  {
    name: "Sarah M.",
    location: "Mississauga",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    text: "Amazing service! The drivers were professional and my car was already home when I woke up. Highly recommend for any night out in the GTA.",
  },
  {
    name: "James K.",
    location: "Oakville",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    text: "Used Ride Home for our company holiday party — they handled 15 rides seamlessly. Everyone got home safe with their cars. Will definitely use again!",
  },
  {
    name: "Maria L.",
    location: "Burlington",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    text: "My elderly mother needed rides to multiple appointments and the pharmacy. The drivers were patient, kind, and incredibly helpful. A lifesaver!",
  },
];

export default function Testimonials() {
  const container = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(() => {
    // Scrubbing text reveal
    if (textRef.current) {
      const words = textRef.current.innerText.split(" ");
      textRef.current.innerHTML = "";
      words.forEach((word) => {
        const span = document.createElement("span");
        span.innerText = word + " ";
        span.className = "opacity-10 transition-opacity duration-300";
        textRef.current?.appendChild(span);
      });

      gsap.to(textRef.current.children, {
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
        },
      });
    }
  }, { scope: container });

  const handleNext = () => setCurrent((p) => (p + 1) % testimonials.length);
  const handlePrev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={container} className="py-32 md:py-48 px-6 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Scrubbing Text Reveal Heading */}
        <div className="mb-24 md:mb-40 max-w-6xl">
          <p ref={textRef} className="font-heading font-bold text-navy leading-[1.1] tracking-tight text-[clamp(28px,4vw,52px)]">
            Don't just take our word for it. Listen to the thousands of Canadians who trust us with their cars and their lives.
          </p>
        </div>

        {/* Elite Feedback Carousel */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
          
          {/* Overlapping Portraits */}
          <div className="w-full lg:w-2/5 relative h-[350px] md:h-[450px] flex items-center justify-center">
            {testimonials.map((t, idx) => (
              <img 
                key={idx}
                src={t.image} 
                alt={t.name}
                className={`absolute w-56 h-56 md:w-80 md:h-80 rounded-[3rem] object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl ${
                  idx === current 
                    ? "z-30 scale-100 opacity-100 filter-none" 
                    : idx === (current - 1 + testimonials.length) % testimonials.length 
                      ? "z-20 scale-90 -translate-x-20 md:-translate-x-32 opacity-40 grayscale blur-[2px]" 
                      : "z-10 scale-90 translate-x-20 md:translate-x-32 opacity-40 grayscale blur-[2px]"
                }`}
              />
            ))}
          </div>

          {/* Minimalist Quote */}
          <div className="w-full lg:w-3/5">
            <div className="flex gap-2 mb-10">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 md:w-8 md:h-8 fill-amber text-amber" />)}
            </div>
            
            <h3 className="font-heading font-bold text-navy leading-[1.15] tracking-tight mb-12 min-h-[180px] md:min-h-[220px] lg:min-h-[160px] text-[clamp(22px,3vw,38px)]">
              "{testimonials[current].text}"
            </h3>
            
            <div className="flex items-center justify-between border-t border-mist pt-10">
              <div>
                <p className="font-heading font-bold text-navy text-xl md:text-2xl mb-1">{testimonials[current].name}</p>
                <p className="text-base text-muted uppercase tracking-widest">{testimonials[current].location}</p>
              </div>

              <div className="flex gap-4">
                <button onClick={handlePrev} className="w-16 h-16 rounded-full border border-mist flex items-center justify-center text-navy hover:bg-mist transition-colors group">
                  <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button onClick={handleNext} className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors group shadow-xl shadow-navy/20">
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

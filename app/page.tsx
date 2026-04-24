import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ServiceCards from "@/components/home/ServiceCards";
import Pricing from "@/components/home/Pricing";
import TrustBar from "@/components/shared/TrustBar";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/shared/CTABanner";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <Hero />
      <HowItWorks />
      <ServiceCards />
      <Pricing />
      <TrustBar />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </main>
  );
}

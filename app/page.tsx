import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ServiceCards from "@/components/home/ServiceCards";
import TrustBar from "@/components/shared/TrustBar";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/shared/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ServiceCards />
      <TrustBar />
      <Testimonials />
      <CTABanner />
    </>
  );
}

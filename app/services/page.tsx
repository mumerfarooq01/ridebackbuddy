import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services & Pricing | Ride Home Designated Drivers",
  description:
    "Explore our designated driver services and transparent pricing. Standard DD, special events, vehicle drop, and medical/senior services in the GTA.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}

import type { Metadata } from "next";
import FAQsContent from "./FAQsContent";

export const metadata: Metadata = {
  title: "FAQs | Ride Home Designated Drivers",
  description:
    "Frequently asked questions about Ride Home Designated Drivers. Learn about booking, pricing, service areas, and more.",
};

export default function FAQsPage() {
  return <FAQsContent />;
}

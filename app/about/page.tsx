import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us | Ride Home Designated Drivers",
  description:
    "Learn about Ride Home Designated Drivers — 13+ years of safe, reliable designated driver service in the GTA, Mississauga, Oakville, Burlington & Hamilton.",
};

export default function AboutPage() {
  return <AboutContent />;
}

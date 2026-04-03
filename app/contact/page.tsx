import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | Ride Home Designated Drivers",
  description:
    "Get in touch with Ride Home Designated Drivers. Call us or send a message. Serving Mississauga, Oakville, Burlington, Hamilton & GTA.",
};

export default function ContactPage() {
  return <ContactContent />;
}

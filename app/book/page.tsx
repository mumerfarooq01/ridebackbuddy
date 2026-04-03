import type { Metadata } from "next";
import BookingContent from "./BookingContent";

export const metadata: Metadata = {
  title: "Book a Ride | Ride Home Designated Drivers",
  description:
    "Book your designated driver ride online. Quick 3-step booking for Mississauga, Oakville, Burlington, Hamilton & GTA.",
};

export default function BookPage() {
  return <BookingContent />;
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCallButton from "@/components/shared/FloatingCallButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ride Home Designated Drivers | Get You AND Your Car Home Safely",
  description:
    "Ontario's trusted designated driver service since 2011. Serving Mississauga, Oakville, Burlington, Hamilton & GTA. Book your safe ride home tonight.",
  keywords:
    "designated driver, ride home, safe ride, GTA driver, Mississauga driver, Oakville, Burlington, Hamilton",
  openGraph: {
    title: "Ride Home Designated Drivers",
    description:
      "Ontario's trusted designated driver service since 2011. Get you AND your car home safely.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-navy text-white`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingCallButton />
      </body>
    </html>
  );
}

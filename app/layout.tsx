import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCallButton from "@/components/shared/FloatingCallButton";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ride Home Designated Drivers | Get You AND Your Car Home Safely",
  description:
    "Ontario's trusted designated driver service since 2011. Serving Mississauga, Oakville, Burlington, Hamilton & GTA. Book your safe ride home tonight.",
  keywords:
    "designated driver, ride home, safe ride, GTA driver, Mississauga driver, Oakville, Burlington, Hamilton",
  icons: {
    icon: [
      { url: "/assets/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/images/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/assets/images/apple-touch-icon.png" },
    other: [
      { rel: "manifest", url: "/assets/images/site.webmanifest" },
    ],
  },
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
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-cloud text-ink`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingCallButton />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.scss";
import LayoutChrome from "./components/LayoutChrome/LayoutChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://xark.info"),
  title: {
    default: "XARK Technologies | RF MMICs, Front-End Modules & Antenna Systems",
    template: "%s | XARK Technologies",
  },
  description:
    "XARK Technologies builds high-performance RF MMICs, front-end modules, switches, power amplifiers, and antenna systems for radar, SatCom, telecom, and critical wireless applications.",
  keywords: [
    "XARK",
    "RF",
    "MMIC",
    "front-end modules",
    "power amplifiers",
    "phased array antennas",
    "satcom",
    "radar",
    "wireless infrastructure",
  ],
  icons: {
    icon: [{ url: "/images/xark-green.png", type: "image/png" }],
    shortcut: "/images/xark-green.png",
    apple: "/images/xark-green.png",
  },
  openGraph: {
    type: "website",
    title: "XARK Technologies | RF MMICs, Front-End Modules & Antenna Systems",
    description:
      "Engineered RF products and subsystems for performance-critical radar, SatCom, telecom, and wireless applications.",
    url: "https://xark.info",
    siteName: "XARK Technologies",
    images: [
      {
        url: "/images/xark-green.png",
        alt: "XARK Technologies logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XARK Technologies | RF MMICs, Front-End Modules & Antenna Systems",
    description:
      "RF MMICs, front-end modules, and antenna systems engineered for mission-critical deployments.",
    images: ["/images/xark-green.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.scss";
import LayoutChrome from "./components/LayoutChrome/LayoutChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://xarktechnologies.com"),
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
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "399x399" },
      { url: "/xark-favicon.png", type: "image/png", sizes: "399x399" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", sizes: "399x399", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "XARK Technologies | RF MMICs, Front-End Modules & Antenna Systems",
    description:
      "Engineered RF products and subsystems for performance-critical radar, SatCom, telecom, and wireless applications.",
    url: "https://xarktechnologies.com",
    siteName: "XARK Technologies",
    images: [
      {
        url: "/icon.png",
        alt: "XARK Technologies icon",
        width: 399,
        height: 399,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XARK Technologies | RF MMICs, Front-End Modules & Antenna Systems",
    description:
      "RF MMICs, front-end modules, and antenna systems engineered for mission-critical deployments.",
    images: ["/icon.png"],
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
        <LayoutChrome>
          {children}
        </LayoutChrome>
      </body>
    </html>
  );
}

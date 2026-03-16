import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.scss";
import LayoutChrome from "./components/LayoutChrome/LayoutChrome";
import { hasRecentSiteAccessGrant, SITE_ACCESS_STORAGE_KEY } from "@/lib/siteAccess";

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
    icon: [{ url: "/xark-favicon.png", type: "image/png" }],
    shortcut: "/xark-favicon.png",
    apple: "/xark-favicon.png",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialHasRecentSiteAccess = hasRecentSiteAccessGrant(
    cookieStore.get(SITE_ACCESS_STORAGE_KEY)?.value ?? null
  );

  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutChrome initialHasRecentSiteAccess={initialHasRecentSiteAccess}>
          {children}
        </LayoutChrome>
      </body>
    </html>
  );
}

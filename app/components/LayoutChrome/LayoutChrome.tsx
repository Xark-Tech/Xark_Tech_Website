"use client";

import { usePathname } from "next/navigation";
import { SITE_BLACKOUT } from "@/lib/siteBlackout";

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import GlobalHoverFx from "../ui/GlobalHoverFx/GlobalHoverFx";
import PagePreloader from "../ui/PagePreloader/PagePreloader";
import RouteTransition from "../ui/RouteTransition/RouteTransition";
import SiteBlackout from "../ui/SiteBlackout/SiteBlackout";

type LayoutChromeProps = {
  children: React.ReactNode;
};

const LayoutChrome = ({ children }: LayoutChromeProps) => {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  if (SITE_BLACKOUT) {
    return <SiteBlackout />;
  }

  return (
    <>
      <PagePreloader />
      <GlobalHoverFx />
      <Header />
      <RouteTransition>{children}</RouteTransition>
      <Footer />
    </>
  );
};

export default LayoutChrome;

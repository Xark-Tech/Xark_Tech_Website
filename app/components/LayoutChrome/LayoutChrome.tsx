"use client";

import { usePathname } from "next/navigation";

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import GlobalHoverFx from "../ui/GlobalHoverFx/GlobalHoverFx";
import PagePreloader from "../ui/PagePreloader/PagePreloader";
import RouteTransition from "../ui/RouteTransition/RouteTransition";
import SiteAccessGate from "../ui/SiteAccessGate/SiteAccessGate";

type LayoutChromeProps = {
  initialHasRecentSiteAccess: boolean;
  children: React.ReactNode;
};

const LayoutChrome = ({ children, initialHasRecentSiteAccess }: LayoutChromeProps) => {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PagePreloader />
      <SiteAccessGate initialHasRecentSiteAccess={initialHasRecentSiteAccess} />
      <GlobalHoverFx />
      <Header />
      <RouteTransition>{children}</RouteTransition>
      <Footer />
    </>
  );
};

export default LayoutChrome;

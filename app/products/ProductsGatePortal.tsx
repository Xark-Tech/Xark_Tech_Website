'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SiteAccessGate from '@/app/components/ui/SiteAccessGate/SiteAccessGate';

interface ProductsGatePortalProps {
    initialHasRecentSiteAccess: boolean;
}

const ProductsGatePortal = ({ initialHasRecentSiteAccess }: ProductsGatePortalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <SiteAccessGate initialHasRecentSiteAccess={initialHasRecentSiteAccess} />,
        document.body,
    );
};

export default ProductsGatePortal;

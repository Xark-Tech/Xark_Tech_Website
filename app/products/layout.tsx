import { cookies } from 'next/headers';
import { hasRecentSiteAccessGrant, SITE_ACCESS_STORAGE_KEY } from '@/lib/siteAccess';
import ProductsGatePortal from './ProductsGatePortal';

export default async function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const initialHasRecentSiteAccess = hasRecentSiteAccessGrant(
        cookieStore.get(SITE_ACCESS_STORAGE_KEY)?.value ?? null,
    );

    return (
        <>
            <ProductsGatePortal initialHasRecentSiteAccess={initialHasRecentSiteAccess} />
            {children}
        </>
    );
}

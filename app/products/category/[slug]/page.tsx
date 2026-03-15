import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeroSection from '@/app/components/PageHeroSection/PageHeroSection';
import TypeProductsCatalog from '@/app/components/products/TypeProductsCatalog/TypeProductsCatalog';
import {
    getAllProductTypeSlugs,
    getProductTypeBySlug,
    getProductCardsByType,
    getProductApplicationOptions,
} from '@/sanity/lib/products';

type TypeListingPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateStaticParams() {
    const slugs = await getAllProductTypeSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TypeListingPageProps): Promise<Metadata> {
    const { slug } = await params;
    const typeData = await getProductTypeBySlug(slug);

    if (!typeData) {
        return {
            title: 'Products | Xark',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${typeData.title} | Products`;
    const description = typeData.subtext;
    const canonicalPath = `/products/category/${typeData.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: canonicalPath,
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    };
}

export default async function TypeListingPage({ params }: TypeListingPageProps) {
    const { slug } = await params;

    const [typeData, products, applicationOptions] = await Promise.all([
        getProductTypeBySlug(slug),
        getProductCardsByType(slug),
        getProductApplicationOptions(),
    ]);

    if (!typeData) {
        notFound();
    }

    return (
        <main>
            <PageHeroSection
                title={
                    <>
                        <span>{typeData.title}</span>
                    </>
                }
                description={typeData.subtext}
                backgroundImage="/images/product-hero.png"
                backgroundAlt={`${typeData.title} products background`}
                showButtons={false}
            />
            <TypeProductsCatalog
                applicationOptions={applicationOptions.map((item) => ({
                    id: item.id,
                    name: item.title,
                    icon: item.icon,
                }))}
                products={products.map((item) => ({
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    cardSubtext: item.cardSubtext,
                    icon: item.icon,
                    points: item.keyPoints,
                    enableDetailPage: item.enableDetailPage,
                    productApplicationIds: item.productApplicationIds,
                }))}
                typeName={typeData.title}
            />
        </main>
    );
}

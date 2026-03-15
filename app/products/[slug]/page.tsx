import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageHeroSection from '@/app/components/PageHeroSection/PageHeroSection';
import ArrowButton from '@/app/components/ui/ArrowButton/ArrowButton';
import SectionHeader from '@/app/components/ui/SectionHeader/SectionHeader';
import ProductDetailTabs from '@/app/components/products/ProductDetailTabs/ProductDetailTabs';
import { getAllProductSlugs, getProductBySlug } from '@/sanity/lib/products';
import './style.scss';

type ProductDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateStaticParams() {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Products | Xark',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = product.seoTitle || product.heroTitle;
    const description = product.seoDescription || product.heroSubtext;
    const canonicalPath = `/products/${product.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            url: canonicalPath,
            images: [
                {
                    url: product.heroImage,
                    alt: product.heroTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [product.heroImage],
        },
    };
}

const page = async ({ params }: ProductDetailPageProps) => {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const pdfLinks = [
        { label: 'Datasheet', href: product.datasheetPdf },
        { label: 'Drawing', href: product.drawingPdf },
        { label: '3D Model', href: product.modelPdf },
    ].filter((item): item is { label: string; href: string } => Boolean(item.href));

    const hasWhereFitsSection = product.whereFitsItems.length > 0;

    return (
        <main className="product-detail-container-main">
            <PageHeroSection
                title={<span className="product-detail-hero-title-text">{product.heroTitle}</span>}
                description={product.heroSubtext}
                backgroundImage={product.heroImage}
                backgroundAlt={product.heroTitle}
                showButtons={false}
            />

            <section className="product-intro-section">
                <div className="container">
                    <div className="product-intro-pill">Introduction</div>
                    <h2>{product.introductionTitle}</h2>
                    <p>{product.introductionSubtext}</p>

                    {pdfLinks.length > 0 && (
                        <div className="product-asset-row">
                            {pdfLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="product-asset-chip"
                                >
                                    <span>{item.label}</span>
                                    <Image
                                        src="/images/icons/green-top-tick-arrow.png"
                                        alt=""
                                        width={18}
                                        height={18}
                                        aria-hidden="true"
                                    />
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="product-intro-cta">
                        <ArrowButton label="Connect with the team" variant="filled" href="/contact" />
                    </div>
                </div>
            </section>

            <section className="product-overview-section">
                <div className="container">
                    <ProductDetailTabs
                        overview={product.overview}
                        specColumnOneTitle={product.specColumnOneTitle}
                        specColumnTwoTitle={product.specColumnTwoTitle}
                        specRows={product.specRows}
                    />
                </div>
            </section>

            {hasWhereFitsSection && (
                <section className="product-fit-section">
                    <div className="container">
                        <SectionHeader
                            alignment="center"
                            title={
                                <>
                                    {product.whereFitsTitle || (
                                        <>
                                            Where <span>{product.title}</span> Fits
                                        </>
                                    )}
                                </>
                            }
                            description={product.whereFitsSubtext}
                        />

                        <div className="product-fit-grid">
                            {product.whereFitsItems.map((card, index) => (
                                <article className="product-fit-card" key={`${card.title}-${index}`}>
                                    <div className="product-fit-card__image">
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="product-fit-card__content">
                                        <h4>{card.title}</h4>
                                        <p>{card.subtext}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default page;

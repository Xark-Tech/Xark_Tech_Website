import React from 'react';
import PageHeroSection from '../components/PageHeroSection/PageHeroSection';
import TypeCategoryCatalog from '../components/products/TypeCategoryCatalog/TypeCategoryCatalog';
import {
    getProductApplicationOptions,
    getProductTypeCards,
    getProductCards,
} from '@/sanity/lib/products';

const page = async () => {
    const [applicationOptions, typeCards, productCards] = await Promise.all([
        getProductApplicationOptions(),
        getProductTypeCards(),
        getProductCards(),
    ]);

    return (
        <main>
            <PageHeroSection
                title={
                    <>
                        Our <span>Products</span>
                    </>
                }
                description="A focused portfolio of MMICs, RF front-end modules, switches, LNAs, PAs, and antenna systems built for integration and repeatable performance."
                backgroundImage="/images/product-hero.png"
                backgroundAlt="Close-up technology background for products page"
                showButtons={false}
            />
            <TypeCategoryCatalog
                applicationOptions={applicationOptions.map((item) => ({
                    id: item.id,
                    name: item.title,
                    icon: item.icon,
                }))}
                typeCards={typeCards.map((item) => ({
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    subtext: item.subtext,
                    icon: item.icon,
                }))}
                products={productCards.map((item) => ({
                    productTypeId: item.productTypeId,
                    productApplicationIds: item.productApplicationIds,
                }))}
            />
        </main>
    );
};

export default page;

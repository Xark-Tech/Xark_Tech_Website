'use client';

import React, { useMemo, useState } from 'react';
import AllProductsSection, { ProductCardItem } from '../AllProductsSection/AllProductsSection';
import CategoryFilter, { CategoryFilterGroup, CategoryFilterItem } from '../CategoryFilter/CategoryFilter';

interface ProductsCatalogProps {
    typeOptions: CategoryFilterItem[];
    applicationOptions: CategoryFilterItem[];
    products: (ProductCardItem & {
        productTypeId: string;
        productApplicationIds: string[];
    })[];
}

const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
    typeOptions,
    applicationOptions,
    products,
}) => {
    const [activeTypeId, setActiveTypeId] = useState<string | null>(null);
    const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null);

    const groups: CategoryFilterGroup[] = useMemo(
        () => [
            {
                id: 'type',
                title: 'Products by Type',
                items: typeOptions,
            },
            {
                id: 'application',
                title: 'Products by Application',
                items: applicationOptions,
            },
        ].filter((group) => group.items.length > 0),
        [typeOptions, applicationOptions],
    );

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const typeMatch = !activeTypeId || product.productTypeId === activeTypeId;
            const applicationMatch =
                !activeApplicationId || product.productApplicationIds.includes(activeApplicationId);
            return typeMatch && applicationMatch;
        });
    }, [products, activeApplicationId, activeTypeId]);

    const handleItemSelect = (groupId: string, item: CategoryFilterItem) => {
        if (groupId === 'type') {
            setActiveTypeId((previous) => (previous === item.id ? null : item.id));
            return;
        }

        if (groupId === 'application') {
            setActiveApplicationId((previous) => (previous === item.id ? null : item.id));
        }
    };

    return (
        <>
            <CategoryFilter
                groups={groups}
                activeSelections={{
                    type: activeTypeId,
                    application: activeApplicationId,
                }}
                onItemSelect={handleItemSelect}
            />
            <AllProductsSection
                items={filteredProducts.map((product) => ({
                    id: product.id,
                    slug: product.slug,
                    title: product.title,
                    cardSubtext: product.cardSubtext,
                    icon: product.icon,
                    points: product.points,
                    enableDetailPage: product.enableDetailPage,
                }))}
            />
        </>
    );
};

export default ProductsCatalog;

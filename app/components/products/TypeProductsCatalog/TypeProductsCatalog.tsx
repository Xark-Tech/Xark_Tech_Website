'use client';

import React, { useMemo, useState } from 'react';
import AllProductsSection, { ProductCardItem } from '../AllProductsSection/AllProductsSection';
import CategoryFilter, { CategoryFilterGroup, CategoryFilterItem } from '../CategoryFilter/CategoryFilter';

interface TypeProductsCatalogProps {
    applicationOptions: CategoryFilterItem[];
    products: (ProductCardItem & {
        productApplicationIds: string[];
    })[];
    typeName: string;
}

const TypeProductsCatalog: React.FC<TypeProductsCatalogProps> = ({
    applicationOptions,
    products,
    typeName,
}) => {
    const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null);

    const groups: CategoryFilterGroup[] = useMemo(
        () =>
            [
                {
                    id: 'application',
                    title: 'Products by Application',
                    items: applicationOptions,
                },
            ].filter((group) => group.items.length > 0),
        [applicationOptions],
    );

    const filteredProducts = useMemo(() => {
        if (!activeApplicationId) {
            return products;
        }

        return products.filter(
            (product) => product.productApplicationIds.includes(activeApplicationId!),
        );
    }, [products, activeApplicationId]);

    const handleItemSelect = (_groupId: string, item: CategoryFilterItem) => {
        setActiveApplicationId((previous) => (previous === item.id ? null : item.id));
    };

    return (
        <>
            <CategoryFilter
                groups={groups}
                activeSelections={{
                    application: activeApplicationId,
                }}
                onItemSelect={handleItemSelect}
            />
            <AllProductsSection
                title={`All ${typeName} Products`}
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

export default TypeProductsCatalog;

'use client';

import React, { useMemo, useState } from 'react';
import TypeCategoryCards, { TypeCategoryCardItem } from '../TypeCategoryCards/TypeCategoryCards';
import CategoryFilter, { CategoryFilterGroup, CategoryFilterItem } from '../CategoryFilter/CategoryFilter';

interface TypeCategoryCatalogProps {
    applicationOptions: CategoryFilterItem[];
    typeCards: TypeCategoryCardItem[];
    products: {
        productTypeId: string;
        productApplicationIds: string[];
    }[];
}

const TypeCategoryCatalog: React.FC<TypeCategoryCatalogProps> = ({
    applicationOptions,
    typeCards,
    products,
}) => {
    const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null);

    const groups: CategoryFilterGroup[] = useMemo(
        () =>
            [
                {
                    id: 'application',
                    title: 'Browse by Use Case',
                    description:
                        'Start with the deployment environment or mission profile, then narrow the portfolio to the product families that fit it.',
                    items: applicationOptions,
                },
            ].filter((group) => group.items.length > 0),
        [applicationOptions],
    );

    const filteredTypeCards = useMemo(() => {
        if (!activeApplicationId) {
            return typeCards;
        }

        const typeIdsWithMatchingProducts = new Set(
            products
                .filter((product) => product.productApplicationIds.includes(activeApplicationId))
                .map((product) => product.productTypeId),
        );

        return typeCards.filter((typeCard) => typeIdsWithMatchingProducts.has(typeCard.id));
    }, [typeCards, products, activeApplicationId]);

    const activeApplicationName = useMemo(
        () => applicationOptions.find((item) => item.id === activeApplicationId)?.name ?? null,
        [applicationOptions, activeApplicationId],
    );

    const catalogTitle = activeApplicationName
        ? `${activeApplicationName} Product Families`
        : 'All Product Families';

    const catalogDescription = activeApplicationName
        ? `These are the product types most relevant to ${activeApplicationName}. Clear the use-case filter above to view the full portfolio.`
        : 'Once you know the use case, browse the portfolio by product type to move into the right family of MMICs, FEMs, switches, amplifiers, and antenna systems.';

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
            <TypeCategoryCards
                eyebrow="Browse by Product Type"
                title={catalogTitle}
                description={catalogDescription}
                items={filteredTypeCards}
            />
        </>
    );
};

export default TypeCategoryCatalog;

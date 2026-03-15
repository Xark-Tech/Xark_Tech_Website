'use client';

import React from 'react';
import Image from 'next/image';
import './style.scss';

export interface CategoryFilterItem {
    id: string;
    name: string;
    icon: string;
}

export interface CategoryFilterGroup {
    id: string;
    title: string;
    description?: string;
    items: CategoryFilterItem[];
}

interface CategoryFilterProps {
    groups?: CategoryFilterGroup[];
    activeSelections?: Record<string, string | null>;
    onItemSelect?: (groupId: string, item: CategoryFilterItem) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    groups = [],
    activeSelections = {},
    onItemSelect,
}) => {
    if (groups.length === 0) {
        return null;
    }

    return (
        <section className="category-filter-container flex items-center justify-center">
            <div className="category-filter container">
                {groups.map((group) => (
                    <div className="category-filter__group" key={group.title}>
                        <div className="category-filter__heading">
                            <h5>{group.title}</h5>
                            {group.description && <p>{group.description}</p>}
                        </div>

                        <div className="filter-items-container">
                            {group.items.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    className={`filter-item${activeSelections[group.id] === item.id ? ' is-active' : ''}`}
                                    onClick={() => onItemSelect?.(group.id, item)}
                                >
                                    <Image src={item.icon} alt="" width={45} height={45} aria-hidden="true" />
                                    <p>{item.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryFilter;

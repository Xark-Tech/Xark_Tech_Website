'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import './style.scss';

export interface BlogCategoryPill {
    id: string;
    title: string;
    slug: string;
}

interface BlogCategoryPillsProps {
    categories: BlogCategoryPill[];
    baseUrl?: string;
}

const BlogCategoryPills: React.FC<BlogCategoryPillsProps> = ({ categories, baseUrl = '/blog' }) => {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category');

    return (
        <div className="blog-category-pills">
            <Link
                href={baseUrl}
                className={`blog-category-pill ${!activeCategory ? 'is-active' : ''}`}
                scroll={false}
            >
                All
            </Link>
            {categories.map((category) => {
                const isActive = activeCategory === category.slug;
                const url = `${baseUrl}?category=${category.slug}`;

                return (
                    <Link
                        key={category.id}
                        href={url}
                        className={`blog-category-pill ${isActive ? 'is-active' : ''}`}
                        scroll={false}
                    >
                        {category.title}
                    </Link>
                );
            })}
        </div>
    );
};

export default BlogCategoryPills;

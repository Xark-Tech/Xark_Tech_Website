'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import SectionHeaderWithAction from '../ui/SectionHeaderWithAction/SectionHeaderWithAction';
import SectionHeader from '../ui/SectionHeader/SectionHeader';
import './style.scss';

export interface BlogPostItem {
    title: string;
    date: string;
    subtext: string;
    image: string;
    href: string;
    categoryTitle?: string;
}

interface BlogSectionProps {
    posts?: BlogPostItem[];
    label?: string;
    title?: React.ReactNode;
    description?: string;
    maxItems?: number;
    showHeaderAction?: boolean;
    showLabel?: boolean;
    showViewAllButton?: boolean;
    viewAllHref?: string;
    enablePagination?: boolean;
    itemsPerPage?: number;
    listingAlignment?: 'left' | 'center';
    categoryFilter?: React.ReactNode;
}

const BlogSection: React.FC<BlogSectionProps> = ({
    posts = [],
    label = 'News & Knowledge',
    title = (
        <>
            The XARK <span>News & Updates</span>
        </>
    ),
    description = 'A concise feed of product updates, engineering insights, and sector signals across radar, SatCom, and wireless.',
    maxItems = 3,
    showHeaderAction = true,
    showLabel = true,
    showViewAllButton = true,
    viewAllHref = '/blog',
    enablePagination = false,
    itemsPerPage = 12,
    listingAlignment = 'center',
    categoryFilter,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const basePosts = useMemo(() => {
        if (maxItems && maxItems > 0) {
            return posts.slice(0, maxItems);
        }
        return posts;
    }, [posts, maxItems]);

    const totalPages = enablePagination ? Math.ceil(basePosts.length / itemsPerPage) : 1;
    const hasPosts = basePosts.length > 0;

    const currentPosts = useMemo(() => {
        if (!enablePagination) {
            return basePosts;
        }

        const start = (currentPage - 1) * itemsPerPage;
        return basePosts.slice(start, start + itemsPerPage);
    }, [basePosts, currentPage, enablePagination, itemsPerPage]);

    useEffect(() => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll('.blog-item');
        if (items.length === 0) return;

        gsap.fromTo(
            items,
            { autoAlpha: 0, y: 30 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.08,
                clearProps: 'all',
            }
        );
    }, [currentPosts]);

    return (
        <section className={`blog-section ${showHeaderAction ? 'blog-section--home' : 'blog-section--listing'}`}>
            <div className="container">
                {showHeaderAction ? (
                    <SectionHeaderWithAction
                        label={showLabel ? label : ''}
                        title={title}
                        description={description}
                        action={
                            showViewAllButton ? (
                                <ArrowButton label="View All" variant="filled" href={viewAllHref} />
                            ) : undefined
                        }
                    />
                ) : (
                    <div className="blog-section__header">
                        <SectionHeader
                            label={showLabel ? label : undefined}
                            title={title}
                            description={description}
                            alignment={listingAlignment}
                        />
                    </div>
                )}

                {categoryFilter && (
                    <div className="blog-section__filter-container">
                        {categoryFilter}
                    </div>
                )}

                {hasPosts ? (
                    <div className="blog-items-container" ref={containerRef}>
                        {currentPosts.map((post, index) => (
                            <Link
                                href={post.href}
                                className="blog-item"
                                key={`${post.title}-${index}`}
                                style={{ opacity: 0, visibility: 'hidden' }}
                            >
                                <div className="blog-item__image-container">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        quality={95}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />

                                    {post.categoryTitle && (
                                        <span className="blog-item__category-badge">{post.categoryTitle}</span>
                                    )}

                                    <span className="blog-item__arrow-link" aria-hidden="true">
                                        <Image src="/images/icons/top-arrow-icon-2.png" alt="" width={20} height={20} />
                                    </span>
                                </div>

                                <div className="blog-item__content">
                                    <h3 className="blog-item__title">{post.title}</h3>

                                    <div className="blog-item__date-row">
                                        <Image src="/images/icons/date-icon-grey.png" alt="" width={18} height={18} />
                                        <span>{post.date}</span>
                                    </div>

                                    <p className="blog-item__subtext">{post.subtext}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="blog-empty-state" role="status" aria-live="polite">
                        No stories published yet. Fresh updates from XARK will appear here soon.
                    </div>
                )}

                {hasPosts && enablePagination && totalPages > 1 && (
                    <div className="blog-pagination">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            const isActive = page === currentPage;

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    className={isActive ? 'is-active' : ''}
                                    onClick={() => setCurrentPage(page)}
                                    aria-label={`Go to page ${page}`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogSection;

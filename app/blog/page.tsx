import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import PageHeroSection from '../components/PageHeroSection/PageHeroSection';
import BlogSection, { BlogPostItem } from '../components/BlogSection/BlogSection';
import BlogCategoryPills from '../components/BlogCategoryPills/BlogCategoryPills';
import { getBlogPosts, getBlogCategories } from '@/sanity/lib/blogPosts';

export const metadata: Metadata = {
    title: 'News & Knowledge | Xark',
    description:
        'Updates, patents, and practical engineering notes on MMICs, RF subsystems, antennas, and system-level RF work.',
    alternates: {
        canonical: '/blog',
    },
};

const formatCardDate = (date: string) =>
    new Date(date)
        .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        })
        .replace(/\//g, '-');

type BlogPageProps = {
    searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { category } = await searchParams;

    // Fetch posts and categories in parallel
    const [posts, categories] = await Promise.all([
        getBlogPosts(),
        getBlogCategories(),
    ]);

    // Filter posts if a category is selected
    const filteredPosts = category
        ? posts.filter((post) => post.categorySlug === category)
        : posts;

    const blogListingPosts: BlogPostItem[] = filteredPosts.map((post) => ({
        title: post.title,
        date: formatCardDate(post.publishedAt),
        subtext: post.excerpt,
        image: post.image,
        href: `/blog/${post.slug}`,
        categoryTitle: post.categoryTitle,
    }));

    return (
        <main>
            <PageHeroSection
                title={
                    <>
                        News &amp; <span>Knowledge</span>
                    </>
                }
                description="Updates, patents, and practical engineering notes on MMICs, RF subsystems, antennas, and system-level RF work, written for teams building real hardware."
                backgroundImage="/images/blog-hero.png"
                backgroundAlt="Circuit and electronics themed background for news and knowledge page"
                showButtons={false}
            />

            <BlogSection
                posts={blogListingPosts}
                title={
                    <>
                        The XARK <span>News &amp; Updates</span>
                    </>
                }
                description="Patents, technical milestones, event notes, and engineering observations from the teams building XARK products and platforms."
                showHeaderAction={false}
                showLabel={false}
                maxItems={0}
                enablePagination
                itemsPerPage={12}
                categoryFilter={
                    <Suspense fallback={<div className="h-10 my-8"></div>}>
                        <BlogCategoryPills categories={categories} baseUrl="/blog" />
                    </Suspense>
                }
            />
        </main>
    );
}

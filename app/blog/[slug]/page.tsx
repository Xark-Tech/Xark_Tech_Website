import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import React, { Suspense, type ReactNode } from 'react';
import BlogSection, { BlogPostItem } from '@/app/components/BlogSection/BlogSection';
import BlogCategoryPills from '@/app/components/BlogCategoryPills/BlogCategoryPills';
import BlogHeroGallery from '@/app/components/blog/BlogHeroGallery/BlogHeroGallery';
import {
    getAllBlogSlugs,
    getBlogPostBySlug,
    getRelatedBlogPosts,
    getBlogCategories,
} from '@/sanity/lib/blogPosts';
import './style.scss';

type BlogDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const formatCardDate = (date: string) =>
    new Date(date)
        .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        })
        .replace(/\//g, '-');

const formatDetailDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

export async function generateStaticParams() {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Blog | Xark',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const canonicalPath = `/blog/${post.slug}`;

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
            publishedTime: `${post.publishedAt}T00:00:00.000Z`,
            url: canonicalPath,
            images: [
                {
                    url: post.image,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [post.image],
        },
    };
}

const portableTextComponents = {
    block: {
        normal: ({ children }: { children?: ReactNode }) => <p>{children}</p>,
        h2: ({ children }: { children?: ReactNode }) => <h2>{children}</h2>,
        h3: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
        blockquote: ({ children }: { children?: ReactNode }) => <blockquote>{children}</blockquote>,
    },
    list: {
        bullet: ({ children }: { children?: ReactNode }) => <ul>{children}</ul>,
        number: ({ children }: { children?: ReactNode }) => <ol>{children}</ol>,
    },
    marks: {
        strong: ({ children }: { children?: ReactNode }) => <strong>{children}</strong>,
        em: ({ children }: { children?: ReactNode }) => <em>{children}</em>,
    },
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;

    // Fetch post and categories in parallel
    const [post, categories] = await Promise.all([
        getBlogPostBySlug(slug),
        getBlogCategories(),
    ]);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedBlogPosts(slug, 3);

    const readMorePosts: BlogPostItem[] = relatedPosts.map((item) => ({
        title: item.title,
        date: formatCardDate(item.publishedAt),
        subtext: item.excerpt,
        image: item.image,
        href: `/blog/${item.slug}`,
    }));

    return (
        <main className="blog-detail-page-container-main">
            <div className="blog-detail-page container">
                <BlogHeroGallery images={post.galleryImages} title={post.title} />

                <article className="blog-detail-article">
                    <p className="blog-detail-article__date">{formatDetailDate(post.publishedAt)}</p>
                    <h1>{post.title}</h1>

                    <div className="blog-detail-article__content">
                        <PortableText value={post.body} components={portableTextComponents} />
                    </div>
                </article>

                <div className="blog-detail-categories-section">
                    <Suspense fallback={<div className="h-10 my-8"></div>}>
                        <BlogCategoryPills categories={categories} baseUrl="/blog" />
                    </Suspense>
                </div>
            </div>

            <div className="blog-detail-read-more">
                <BlogSection
                    posts={readMorePosts}
                    title="Read More"
                    showHeaderAction={false}
                    showLabel={false}
                    description={undefined}
                    listingAlignment="left"
                    maxItems={3}
                    enablePagination={false}
                />
            </div>
        </main>
    );
}

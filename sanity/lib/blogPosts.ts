import groq from "groq";
import type { TypedObject } from "@portabletext/types";

import { client } from "./client";

export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
};

export type BlogCardPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  image: string;
  categoryTitle?: string;
  categorySlug?: string;
};

export type BlogDetailPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  image: string;
  galleryImages: BlogHeroGalleryImage[];
  body: TypedObject[];
  seoTitle?: string;
  seoDescription?: string;
  categoryTitle?: string;
  categorySlug?: string;
};

export type BlogHeroGalleryImage = {
  src: string;
  alt: string;
};

type BlogCategoryRaw = {
  _id?: string;
  title?: string;
  slug?: string;
};

type BlogCardPostRaw = {
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  image?: string | null;
  categoryTitle?: string;
  categorySlug?: string;
};

type BlogDetailPostRaw = BlogCardPostRaw & {
  additionalImages?: Array<{
    src?: string | null;
    alt?: string;
  }>;
  body?: TypedObject[] | unknown[];
  seoTitle?: string;
  seoDescription?: string;
};

const BLOG_CATEGORIES_QUERY = groq`
  *[_type == "blogCategory"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

const BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost"] | order(orderRank asc, publishedAt desc, _createdAt desc) {
    title,
    "slug": slug.current,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    excerpt,
    publishedAt,
    "image": mainImage.asset->url
  }
`;

const BLOG_POST_BY_SLUG_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    excerpt,
    publishedAt,
    "image": mainImage.asset->url,
    "additionalImages": additionalImages[]{
      "src": asset->url,
      alt
    },
    body,
    seoTitle,
    seoDescription
  }
`;

const RELATED_BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost" && slug.current != $slug] | order(orderRank asc, publishedAt desc, _createdAt desc)[0...$limit] {
    title,
    "slug": slug.current,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    excerpt,
    publishedAt,
    "image": mainImage.asset->url
  }
`;

const BLOG_SLUGS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current)][].slug.current
`;

const DEFAULT_IMAGE = "/images/about-section-image.png";

const normalizeCardPost = (item: BlogCardPostRaw): BlogCardPost | null => {
  if (
    typeof item.title !== "string" ||
    typeof item.slug !== "string" ||
    typeof item.excerpt !== "string" ||
    typeof item.publishedAt !== "string"
  ) {
    return null;
  }

  return {
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    publishedAt: item.publishedAt,
    image: item.image || DEFAULT_IMAGE,
    categoryTitle: item.categoryTitle,
    categorySlug: item.categorySlug,
  };
};

const normalizeDetailPost = (item: BlogDetailPostRaw | null): BlogDetailPost | null => {
  if (!item) return null;
  const base = normalizeCardPost(item);
  if (!base) return null;

  return {
    ...base,
    galleryImages: [
      {
        src: base.image,
        alt: base.title,
      },
      ...(Array.isArray(item.additionalImages)
        ? item.additionalImages
            .filter((image) => typeof image?.src === "string")
            .map((image, index) => ({
              src: image.src as string,
              alt:
                typeof image.alt === "string" && image.alt.trim().length > 0
                  ? image.alt
                  : `${base.title} image ${index + 2}`,
            }))
        : []),
    ],
    body: Array.isArray(item.body) ? (item.body as TypedObject[]) : [],
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  };
};

export const getBlogPosts = async (limit?: number): Promise<BlogCardPost[]> => {
  try {
    const response = await client.fetch<BlogCardPostRaw[]>(
      BLOG_POSTS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    const posts = response
      .map(normalizeCardPost)
      .filter((post): post is BlogCardPost => Boolean(post));

    return typeof limit === "number" ? posts.slice(0, limit) : posts;
  } catch {
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogDetailPost | null> => {
  try {
    const response = await client.fetch<BlogDetailPostRaw | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );

    return normalizeDetailPost(response);
  } catch {
    return null;
  }
};

export const getRelatedBlogPosts = async (slug: string, limit = 3): Promise<BlogCardPost[]> => {
  try {
    const response = await client.fetch<BlogCardPostRaw[]>(
      RELATED_BLOG_POSTS_QUERY,
      { slug, limit },
      { next: { revalidate: 60 } },
    );

    return response
      .map(normalizeCardPost)
      .filter((post): post is BlogCardPost => Boolean(post));
  } catch {
    return [];
  }
};

export const getAllBlogSlugs = async (): Promise<string[]> => {
  try {
    const response = await client.fetch<string[]>(
      BLOG_SLUGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return response.filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  } catch {
    return [];
  }
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const response = await client.fetch<BlogCategoryRaw[]>(
      BLOG_CATEGORIES_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return response
      .filter(
        (cat) =>
          typeof cat._id === "string" && typeof cat.title === "string" && typeof cat.slug === "string",
      )
      .map((cat) => ({
        id: cat._id!,
        title: cat.title!,
        slug: cat.slug!,
      }));
  } catch {
    return [];
  }
};

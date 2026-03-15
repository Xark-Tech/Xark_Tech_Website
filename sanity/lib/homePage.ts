import groq from "groq";

import type { ApplicationItem } from "./applications";
import { getApplications } from "./applications";
import { client } from "./client";
import type { BlogCardPost } from "./blogPosts";
import { getBlogPosts } from "./blogPosts";

type HomePageSettingsRaw = {
  featuredApplications?: Array<{
    title?: string;
    previewText?: string | null;
    image?: string | null;
    body?: unknown[] | null;
  }>;
  featuredBlogPosts?: Array<{
    title?: string;
    slug?: string;
    excerpt?: string;
    publishedAt?: string;
    image?: string | null;
    categoryTitle?: string;
    categorySlug?: string;
  }>;
};

const HOME_PAGE_SETTINGS_QUERY = groq`
  *[_type == "homePageSettings" && _id == "homePageSettings"][0]{
    "featuredApplications": featuredApplications[]->{
      title,
      "previewText": pt::text(body[_type == "block"][0..0]),
      "image": mainImage.asset->url,
      body
    },
    "featuredBlogPosts": featuredBlogPosts[]->{
      title,
      "slug": slug.current,
      "categoryTitle": category->title,
      "categorySlug": category->slug.current,
      excerpt,
      publishedAt,
      "image": mainImage.asset->url
    }
  }
`;

const DEFAULT_IMAGE = "/images/about-section-image.png";

const sanitizeApplicationText = (value: string) =>
  value.replace(/\bx(?=Smart\b)/g, "");

const sanitizePortableValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return sanitizeApplicationText(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizePortableValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizePortableValue(nestedValue)]),
    );
  }

  return value;
};

const normalizeApplicationItem = (
  item: NonNullable<HomePageSettingsRaw["featuredApplications"]>[number],
): ApplicationItem | null => {
  if (typeof item.title !== "string") {
    return null;
  }

  return {
    title: sanitizeApplicationText(item.title),
    previewText:
      typeof item.previewText === "string" ? sanitizeApplicationText(item.previewText) : "",
    image: item.image || DEFAULT_IMAGE,
    body: Array.isArray(item.body) ? (sanitizePortableValue(item.body) as unknown[]) : undefined,
  };
};

const normalizeBlogCardPost = (
  item: NonNullable<HomePageSettingsRaw["featuredBlogPosts"]>[number],
): BlogCardPost | null => {
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

export const getHomePageFeaturedApplications = async (limit = 3): Promise<ApplicationItem[]> => {
  try {
    const settings = await client.fetch<HomePageSettingsRaw | null>(
      HOME_PAGE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    const selectedApplications = (settings?.featuredApplications || [])
      .map(normalizeApplicationItem)
      .filter((item): item is ApplicationItem => Boolean(item))
      .slice(0, limit);

    if (selectedApplications.length >= limit) {
      return selectedApplications;
    }

    const selectedTitles = new Set(selectedApplications.map((item) => item.title));
    const fallbackApplications = (await getApplications())
      .filter((item) => !selectedTitles.has(item.title))
      .slice(0, Math.max(limit - selectedApplications.length, 0));

    return [...selectedApplications, ...fallbackApplications].slice(0, limit);
  } catch {
    return getApplications(limit);
  }
};

export const getHomePageFeaturedBlogPosts = async (limit = 3): Promise<BlogCardPost[]> => {
  try {
    const settings = await client.fetch<HomePageSettingsRaw | null>(
      HOME_PAGE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    const selectedPosts = (settings?.featuredBlogPosts || [])
      .map(normalizeBlogCardPost)
      .filter((post): post is BlogCardPost => Boolean(post))
      .slice(0, limit);

    if (selectedPosts.length >= limit) {
      return selectedPosts;
    }

    const selectedSlugs = new Set(selectedPosts.map((post) => post.slug));
    const fallbackPosts = (await getBlogPosts())
      .filter((post) => !selectedSlugs.has(post.slug))
      .slice(0, Math.max(limit - selectedPosts.length, 0));

    return [...selectedPosts, ...fallbackPosts].slice(0, limit);
  } catch {
    return getBlogPosts(limit);
  }
};

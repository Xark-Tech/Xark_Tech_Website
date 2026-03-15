import groq from "groq";

import { client } from "./client";
import type { BlogCardPost } from "./blogPosts";
import { getBlogPosts } from "./blogPosts";

type HomePageSettingsRaw = {
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

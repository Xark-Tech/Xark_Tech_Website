import groq from "groq";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "./client";

export type CareerListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  experience: string;
  location: string;
  employmentType: string;
  summary: string;
};

export type CareerDetail = CareerListItem & {
  body: PortableTextBlock[];
  applicationEmail?: string;
};

type CareerListItemRaw = {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  experience?: string;
  location?: string;
  employmentType?: string;
  summary?: string;
};

type CareerDetailRaw = CareerListItemRaw & {
  body?: PortableTextBlock[];
  applicationEmail?: string;
};

const CAREER_LIST_QUERY = groq`
  *[_type == "career" && isActive == true] | order(sortOrder asc, _createdAt desc) {
    "id": _id,
    "slug": slug.current,
    title,
    category,
    experience,
    location,
    employmentType,
    summary
  }
`;

const CAREER_DETAIL_QUERY = groq`
  *[_type == "career" && slug.current == $slug && isActive == true][0] {
    "id": _id,
    "slug": slug.current,
    title,
    category,
    experience,
    location,
    employmentType,
    summary,
    body,
    applicationEmail
  }
`;

const CAREER_SLUGS_QUERY = groq`
  *[_type == "career" && defined(slug.current) && isActive == true][].slug.current
`;

const normalizeCareerListItem = (item: CareerListItemRaw): CareerListItem | null => {
  if (
    typeof item.id !== "string" ||
    typeof item.slug !== "string" ||
    typeof item.title !== "string" ||
    typeof item.category !== "string" ||
    typeof item.experience !== "string" ||
    typeof item.location !== "string" ||
    typeof item.employmentType !== "string" ||
    typeof item.summary !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    experience: item.experience,
    location: item.location,
    employmentType: item.employmentType,
    summary: item.summary,
  };
};

const normalizeCareerDetail = (item: CareerDetailRaw | null): CareerDetail | null => {
  if (!item) return null;
  const base = normalizeCareerListItem(item);
  if (!base) return null;

  return {
    ...base,
    body: Array.isArray(item.body) ? item.body : [],
    applicationEmail: item.applicationEmail,
  };
};

export const getCareerList = async (): Promise<CareerListItem[]> => {
  try {
    const response = await client.fetch<CareerListItemRaw[]>(
      CAREER_LIST_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return response
      .map(normalizeCareerListItem)
      .filter((item): item is CareerListItem => Boolean(item));
  } catch {
    return [];
  }
};

export const getCareerBySlug = async (slug: string): Promise<CareerDetail | null> => {
  try {
    const response = await client.fetch<CareerDetailRaw | null>(
      CAREER_DETAIL_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );
    return normalizeCareerDetail(response);
  } catch {
    return null;
  }
};

export const getAllCareerSlugs = async (): Promise<string[]> => {
  try {
    const response = await client.fetch<string[]>(
      CAREER_SLUGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return response.filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  } catch {
    return [];
  }
};

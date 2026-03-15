import groq from "groq";

import { client } from "./client";

export type ProductFilterOption = {
  id: string;
  title: string;
  icon: string;
};

export type ProductTypeCard = {
  id: string;
  slug: string;
  title: string;
  subtext: string;
  icon: string;
};

export type ProductCard = {
  id: string;
  slug: string;
  title: string;
  cardSubtext: string;
  icon: string;
  keyPoints: string[];
  enableDetailPage: boolean;
  productTypeId: string;
  productApplicationIds: string[];
};

export type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  heroTitle: string;
  heroSubtext: string;
  heroImage: string;
  introductionTitle: string;
  introductionSubtext: string;
  datasheetPdf?: string;
  drawingPdf?: string;
  modelPdf?: string;
  overview: unknown[];
  specColumnOneTitle?: string;
  specColumnTwoTitle?: string;
  specRows: Array<{ label: string; value: string }>;
  whereFitsTitle?: string;
  whereFitsSubtext?: string;
  whereFitsItems: Array<{ image: string; title: string; subtext: string }>;
  seoTitle?: string;
  seoDescription?: string;
};

type ProductFilterOptionRaw = {
  id?: string;
  title?: string;
  icon?: string | null;
};

type ProductTypeCardRaw = {
  id?: string;
  slug?: string;
  title?: string;
  subtext?: string;
  icon?: string | null;
};

type ProductCardRaw = {
  id?: string;
  slug?: string;
  title?: string;
  cardSubtext?: string;
  icon?: string | null;
  keyPoints?: string[];
  enableDetailPage?: boolean;
  productTypeId?: string;
  productApplicationIds?: string[];
};

type ProductDetailRaw = {
  id?: string;
  slug?: string;
  title?: string;
  heroTitle?: string;
  heroSubtext?: string;
  heroImage?: string | null;
  introductionTitle?: string;
  introductionSubtext?: string;
  datasheetPdf?: string | null;
  drawingPdf?: string | null;
  modelPdf?: string | null;
  overview?: unknown[];
  specColumnOneTitle?: string;
  specColumnTwoTitle?: string;
  specRows?: Array<{ label?: string; value?: string }>;
  whereFitsTitle?: string;
  whereFitsSubtext?: string;
  whereFitsItems?: Array<{ image?: string | null; title?: string; subtext?: string }>;
  seoTitle?: string;
  seoDescription?: string;
};

const FILTER_TYPES_QUERY = groq`
  *[_type == "productTypeOption"] | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    title,
    "icon": icon.asset->url
  }
`;

const TYPE_CARDS_QUERY = groq`
  *[_type == "productTypeOption"] | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    "slug": slug.current,
    title,
    subtext,
    "icon": icon.asset->url
  }
`;

const TYPE_BY_SLUG_QUERY = groq`
  *[_type == "productTypeOption" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    title,
    subtext,
    "icon": icon.asset->url
  }
`;

const TYPE_SLUGS_QUERY = groq`
  *[_type == "productTypeOption" && defined(slug.current)][].slug.current
`;

const PRODUCT_CARDS_BY_TYPE_QUERY = groq`
  *[_type == "product" && productTypeRef->slug.current == $typeSlug] | order(_createdAt desc) {
    "id": _id,
    "slug": slug.current,
    title,
    cardSubtext,
    "icon": cardIcon.asset->url,
    keyPoints,
    "enableDetailPage": coalesce(enableDetailPage, true),
    "productTypeId": productTypeRef->_id,
    "productApplicationIds": productApplicationRef[]->_id
  }
`;

const FILTER_APPLICATIONS_QUERY = groq`
  *[_type == "productApplicationOption"] | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    title,
    "icon": icon.asset->url
  }
`;

const PRODUCT_CARDS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    "id": _id,
    "slug": slug.current,
    title,
    cardSubtext,
    "icon": cardIcon.asset->url,
    keyPoints,
    "enableDetailPage": coalesce(enableDetailPage, true),
    "productTypeId": productTypeRef->_id,
    "productApplicationIds": productApplicationRef[]->_id
  }
`;

const PRODUCT_DETAIL_QUERY = groq`
  *[_type == "product" && slug.current == $slug && coalesce(enableDetailPage, true) == true][0] {
    "id": _id,
    "slug": slug.current,
    title,
    heroTitle,
    heroSubtext,
    "heroImage": heroImage.asset->url,
    introductionTitle,
    introductionSubtext,
    "datasheetPdf": datasheetPdf.asset->url,
    "drawingPdf": drawingPdf.asset->url,
    "modelPdf": modelPdf.asset->url,
    overview,
    specColumnOneTitle,
    specColumnTwoTitle,
    specRows[]{
      label,
      value
    },
    whereFitsTitle,
    whereFitsSubtext,
    whereFitsItems[]{
      "image": image.asset->url,
      title,
      subtext
    },
    seoTitle,
    seoDescription
  }
`;

const PRODUCT_SLUGS_QUERY = groq`
  *[_type == "product" && defined(slug.current) && coalesce(enableDetailPage, true) == true][].slug.current
`;

const DEFAULT_ICON = "/images/icons/p-type/p1.png";
const DEFAULT_IMAGE = "/images/about-section-image.png";

const normalizeFilterOptions = (items: ProductFilterOptionRaw[]): ProductFilterOption[] =>
  items
    .filter((item) => typeof item.id === "string" && typeof item.title === "string")
    .map((item) => ({
      id: item.id as string,
      title: item.title as string,
      icon: item.icon || DEFAULT_ICON,
    }));

const normalizeTypeCards = (items: ProductTypeCardRaw[]): ProductTypeCard[] =>
  items
    .filter(
      (item) =>
        typeof item.id === "string" &&
        typeof item.slug === "string" &&
        typeof item.title === "string" &&
        typeof item.subtext === "string",
    )
    .map((item) => ({
      id: item.id as string,
      slug: item.slug as string,
      title: item.title as string,
      subtext: item.subtext as string,
      icon: item.icon || DEFAULT_ICON,
    }));

const normalizeTypeCard = (item: ProductTypeCardRaw | null): ProductTypeCard | null => {
  if (
    !item ||
    typeof item.id !== "string" ||
    typeof item.slug !== "string" ||
    typeof item.title !== "string" ||
    typeof item.subtext !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    subtext: item.subtext,
    icon: item.icon || DEFAULT_ICON,
  };
};

const normalizeProductCards = (items: ProductCardRaw[]): ProductCard[] =>
  items
    .filter(
      (item) =>
        typeof item.id === "string" &&
        typeof item.slug === "string" &&
        typeof item.title === "string" &&
        typeof item.cardSubtext === "string" &&
        typeof item.productTypeId === "string",
    )
    .map((item) => ({
      id: item.id as string,
      slug: item.slug as string,
      title: item.title as string,
      cardSubtext: item.cardSubtext as string,
      icon: item.icon || DEFAULT_ICON,
      keyPoints: Array.isArray(item.keyPoints)
        ? item.keyPoints.filter((point): point is string => typeof point === "string")
        : [],
      enableDetailPage: typeof item.enableDetailPage === "boolean" ? item.enableDetailPage : true,
      productTypeId: item.productTypeId as string,
      productApplicationIds: Array.isArray(item.productApplicationIds)
        ? item.productApplicationIds.filter((id): id is string => typeof id === "string")
        : [],
    }));

const normalizeProductDetail = (item: ProductDetailRaw | null): ProductDetail | null => {
  if (
    !item ||
    typeof item.id !== "string" ||
    typeof item.slug !== "string" ||
    typeof item.title !== "string" ||
    typeof item.heroTitle !== "string" ||
    typeof item.heroSubtext !== "string" ||
    typeof item.introductionTitle !== "string" ||
    typeof item.introductionSubtext !== "string"
  ) {
    return null;
  }

  const specRows = Array.isArray(item.specRows)
    ? item.specRows
      .filter(
        (row) => typeof row?.label === "string" && typeof row?.value === "string",
      )
      .map((row) => ({
        label: row.label as string,
        value: row.value as string,
      }))
    : [];

  const whereFitsItems = Array.isArray(item.whereFitsItems)
    ? item.whereFitsItems
      .filter(
        (fitItem) =>
          typeof fitItem?.title === "string" && typeof fitItem?.subtext === "string",
      )
      .map((fitItem) => ({
        image: fitItem.image || DEFAULT_IMAGE,
        title: fitItem.title as string,
        subtext: fitItem.subtext as string,
      }))
    : [];

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    heroTitle: item.heroTitle,
    heroSubtext: item.heroSubtext,
    heroImage: item.heroImage || DEFAULT_IMAGE,
    introductionTitle: item.introductionTitle,
    introductionSubtext: item.introductionSubtext,
    datasheetPdf: item.datasheetPdf || undefined,
    drawingPdf: item.drawingPdf || undefined,
    modelPdf: item.modelPdf || undefined,
    overview: Array.isArray(item.overview) ? item.overview : [],
    specColumnOneTitle: item.specColumnOneTitle,
    specColumnTwoTitle: item.specColumnTwoTitle,
    specRows,
    whereFitsTitle: item.whereFitsTitle,
    whereFitsSubtext: item.whereFitsSubtext,
    whereFitsItems,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  };
};

export const getProductTypeOptions = async (): Promise<ProductFilterOption[]> => {
  try {
    const response = await client.fetch<ProductFilterOptionRaw[]>(
      FILTER_TYPES_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return normalizeFilterOptions(response);
  } catch {
    return [];
  }
};

export const getProductApplicationOptions = async (): Promise<ProductFilterOption[]> => {
  try {
    const response = await client.fetch<ProductFilterOptionRaw[]>(
      FILTER_APPLICATIONS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return normalizeFilterOptions(response);
  } catch {
    return [];
  }
};

export const getProductCards = async (): Promise<ProductCard[]> => {
  try {
    const response = await client.fetch<ProductCardRaw[]>(
      PRODUCT_CARDS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return normalizeProductCards(response);
  } catch {
    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail | null> => {
  try {
    const response = await client.fetch<ProductDetailRaw | null>(
      PRODUCT_DETAIL_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );
    return normalizeProductDetail(response);
  } catch {
    return null;
  }
};

export const getAllProductSlugs = async (): Promise<string[]> => {
  try {
    const response = await client.fetch<string[]>(
      PRODUCT_SLUGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return response.filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  } catch {
    return [];
  }
};

export const getProductTypeCards = async (): Promise<ProductTypeCard[]> => {
  try {
    const response = await client.fetch<ProductTypeCardRaw[]>(
      TYPE_CARDS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return normalizeTypeCards(response);
  } catch {
    return [];
  }
};

export const getProductTypeBySlug = async (slug: string): Promise<ProductTypeCard | null> => {
  try {
    const response = await client.fetch<ProductTypeCardRaw | null>(
      TYPE_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );
    return normalizeTypeCard(response);
  } catch {
    return null;
  }
};

export const getAllProductTypeSlugs = async (): Promise<string[]> => {
  try {
    const response = await client.fetch<string[]>(
      TYPE_SLUGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return response.filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  } catch {
    return [];
  }
};

export const getProductCardsByType = async (typeSlug: string): Promise<ProductCard[]> => {
  try {
    const response = await client.fetch<ProductCardRaw[]>(
      PRODUCT_CARDS_BY_TYPE_QUERY,
      { typeSlug },
      { next: { revalidate: 60 } },
    );
    return normalizeProductCards(response);
  } catch {
    return [];
  }
};

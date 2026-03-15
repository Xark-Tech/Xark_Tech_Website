import groq from "groq";

import { client } from "./client";

export type BrandLogo = {
  src: string;
  alt: string;
};

type BrandLogoRaw = {
  src?: string | null;
  alt?: string;
};

const BRAND_LOGOS_QUERY = groq`
  *[_type == "brandLogo"] | order(order asc, _createdAt desc) {
    "src": logo.asset->url,
    "alt": name
  }
`;

const normalizeLogos = (items: BrandLogoRaw[]): BrandLogo[] => {
  const uniqueLogos = new Map<string, BrandLogo>();

  items
    .filter((item) => typeof item.src === "string" && typeof item.alt === "string")
    .forEach((item) => {
      const logo = {
        src: item.src as string,
        alt: item.alt as string,
      };

      uniqueLogos.set(`${logo.alt}::${logo.src}`, logo);
    });

  return Array.from(uniqueLogos.values());
};

export const getBrandLogos = async (): Promise<BrandLogo[]> => {
  try {
    const response = await client.fetch<BrandLogoRaw[]>(
      BRAND_LOGOS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return normalizeLogos(response);
  } catch {
    return [];
  }
};

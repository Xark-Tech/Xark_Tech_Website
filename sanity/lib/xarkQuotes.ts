import groq from "groq";

import { client } from "./client";

export type XarkQuote = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

type XarkQuoteRaw = {
  id?: string;
  quote?: string;
  name?: string;
  role?: string;
};

const XARK_QUOTES_QUERY = groq`
  *[_type == "xarkQuote"] | order(coalesce(sortOrder, 0) asc, _createdAt desc) {
    "id": _id,
    quote,
    name,
    role
  }
`;

const normalizeQuote = (item: XarkQuoteRaw): XarkQuote | null => {
  if (
    typeof item.id !== "string" ||
    typeof item.quote !== "string" ||
    typeof item.name !== "string" ||
    typeof item.role !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    quote: item.quote,
    name: item.name,
    role: item.role,
  };
};

export const getXarkQuotes = async (): Promise<XarkQuote[]> => {
  try {
    const response = await client.fetch<XarkQuoteRaw[]>(
      XARK_QUOTES_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return response
      .map(normalizeQuote)
      .filter((item): item is XarkQuote => Boolean(item));
  } catch {
    return [];
  }
};

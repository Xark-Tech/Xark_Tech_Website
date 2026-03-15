import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl, token } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  token,
  perspective: token ? "previewDrafts" : "published",
  stega: {
    studioUrl,
  },
});

import groq from "groq";

import { client } from "./client";

export type TeamMemberItem = {
  name: string;
  designation: string;
  image: string;
  linkedinUrl?: string;
  imagePosition?: string;
};

type RawTeamMemberItem = {
  name?: string;
  designation?: string;
  image?: string | null;
  linkedinUrl?: string;
  imagePosition?: string;
};

const LEADERSHIP_QUERY = groq`
  *[_type == "leadershipMember"] | order(order asc, _createdAt desc) {
    name,
    designation,
    "image": photo.asset->url,
    linkedinUrl,
    imagePosition
  }
`;

const TECHNICAL_ADVISORS_QUERY = groq`
  *[_type == "technicalAdvisor"] | order(order asc, _createdAt desc) {
    name,
    designation,
    "image": photo.asset->url,
    linkedinUrl,
    imagePosition
  }
`;

const FALLBACK_IMAGE = "/images/about-section-image.png";

const normalizeMembers = (items: RawTeamMemberItem[]): TeamMemberItem[] => {
  return items
    .filter((item) => typeof item.name === "string" && typeof item.designation === "string")
    .map((item) => ({
      name: item.name as string,
      designation: item.designation as string,
      image: item.image || FALLBACK_IMAGE,
      linkedinUrl: typeof item.linkedinUrl === "string" ? item.linkedinUrl : undefined,
      imagePosition: typeof item.imagePosition === "string" ? item.imagePosition : undefined,
    }));
};

export const getLeadershipMembers = async (): Promise<TeamMemberItem[]> => {
  try {
    const response = await client.fetch<RawTeamMemberItem[]>(
      LEADERSHIP_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return normalizeMembers(response);
  } catch {
    return [];
  }
};

export const getTechnicalAdvisors = async (): Promise<TeamMemberItem[]> => {
  try {
    const response = await client.fetch<RawTeamMemberItem[]>(
      TECHNICAL_ADVISORS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return normalizeMembers(response);
  } catch {
    return [];
  }
};


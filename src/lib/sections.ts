import type messages from "@/messages/en.json";

export type SectionKey = keyof (typeof messages)["Sections"];

/** Top-level sections from the approved site map, in display order. */
export const sectionPaths = {
  work: "/work",
  engineering: "/engineering",
  it: "/it",
  computerScience: "/computer-science",
  design: "/design",
  threeD: "/3d",
  startups: "/startups",
  blog: "/blog",
  vlog: "/vlog",
  about: "/about",
  skills: "/skills",
  now: "/now",
  future: "/future",
  contact: "/contact",
} as const satisfies Record<SectionKey, `/${string}`>;

export const sectionKeys = Object.keys(sectionPaths) as SectionKey[];

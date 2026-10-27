import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  // Set automatically by Vercel to the production domain (no protocol).
  VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1).optional(),
});

// Empty strings count as unset so a blank line in .env.local doesn't fail.
const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  VERCEL_PROJECT_PRODUCTION_URL:
    process.env.VERCEL_PROJECT_PRODUCTION_URL || undefined,
});

/** Absolute origin used for canonical URLs, hreflang and feeds. */
export const siteUrl = new URL(
  env.NEXT_PUBLIC_SITE_URL ??
    (env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

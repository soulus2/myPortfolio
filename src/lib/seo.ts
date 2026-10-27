import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Canonical URL and hreflang alternates for a page that exists in both
 * languages. `path` is locale-free, e.g. "/" or "/work/gear-robot".
 * URLs are relative and resolved against `metadataBase`.
 */
export function localizedAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const suffix = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `/${l}${suffix}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${suffix}`;

  return { canonical: `/${locale}${suffix}`, languages };
}

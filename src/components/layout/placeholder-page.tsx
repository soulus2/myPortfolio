import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";
import { sectionPaths, type SectionKey } from "@/lib/sections";

/** Temporary body for sections that are built in later phases. */
export function PlaceholderPage({ section }: { section: SectionKey }) {
  const t = useTranslations();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(`Sections.${section}`)}
      </h1>
      <p className="mt-4 text-foreground/70">{t("Placeholder.comingSoon")}</p>
    </section>
  );
}

export async function placeholderMetadata(
  section: SectionKey,
): Promise<Metadata> {
  const [t, locale] = await Promise.all([
    getTranslations("Sections"),
    getLocale(),
  ]);

  return {
    title: t(section),
    alternates: localizedAlternates(locale, sectionPaths[section]),
  };
}

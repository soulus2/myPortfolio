import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: localizedAlternates(await getLocale(), "/") };
}

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-lg text-foreground/70">{t("intro")}</p>
    </section>
  );
}

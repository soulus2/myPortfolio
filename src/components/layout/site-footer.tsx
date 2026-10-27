import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sectionKeys, sectionPaths } from "@/lib/sections";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="mx-auto w-full max-w-5xl px-4 py-10">
      <nav aria-label={t("Shell.sitemap")}>
        <ul className="flex flex-wrap gap-x-1 gap-y-1">
          {sectionKeys.map((key) => (
            <li key={key}>
              <Link
                href={sectionPaths[key]}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {t(`Sections.${key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-6 px-3 text-sm text-foreground/70">
        {t("Shell.underConstruction")}
      </p>
    </footer>
  );
}

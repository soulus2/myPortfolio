"use client";

import { useTranslations } from "next-intl";

export default function Error({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const t = useTranslations("Error");

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 inline-flex min-h-11 items-center rounded-full border border-foreground/30 px-5 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        {t("retry")}
      </button>
    </section>
  );
}

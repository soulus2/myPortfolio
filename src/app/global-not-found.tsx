import type { Metadata } from "next";
import Link from "next/link";
import en from "@/messages/en.json";
import ka from "@/messages/ka.json";
import { ThemeScript } from "@/components/layout/theme-script";
import "@/styles/globals.css";

// Shown for URLs outside every locale (no proxy redirect applied), so the
// language is unknown: show both.
export const metadata: Metadata = {
  title: `${en.NotFound.title} · ${ka.NotFound.title}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <main className="mx-auto w-full max-w-5xl px-4 py-16">
          <h1 className="text-3xl font-semibold tracking-tight">
            {en.NotFound.title}
          </h1>
          <p className="mt-2 text-2xl font-semibold tracking-tight" lang="ka">
            {ka.NotFound.title}
          </p>
          <ul className="mt-6 flex gap-2">
            <li>
              <Link
                href="/en"
                hrefLang="en"
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {en.NotFound.backHome}
              </Link>
            </li>
            <li>
              <Link
                href="/ka"
                hrefLang="ka"
                lang="ka"
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {ka.NotFound.backHome}
              </Link>
            </li>
          </ul>
        </main>
      </body>
    </html>
  );
}

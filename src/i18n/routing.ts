import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ka"],
  // Used when the browser language is neither English nor Georgian.
  defaultLocale: "en",
  localePrefix: "always",
  // Remember a visitor's language choice for a year instead of the session.
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
  },
  // hreflang is emitted through the Metadata API instead, because pages that
  // fall back to the other language must not advertise an alternate.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

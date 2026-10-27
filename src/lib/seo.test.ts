import { describe, expect, it } from "vitest";
import { localizedAlternates } from "./seo";

describe("localizedAlternates", () => {
  it("points the canonical at the current locale and lists both languages", () => {
    expect(localizedAlternates("ka", "/work/gear-robot")).toEqual({
      canonical: "/ka/work/gear-robot",
      languages: {
        en: "/en/work/gear-robot",
        ka: "/ka/work/gear-robot",
        "x-default": "/en/work/gear-robot",
      },
    });
  });

  it("maps the home page to the bare locale prefix", () => {
    expect(localizedAlternates("en", "/")).toEqual({
      canonical: "/en",
      languages: { en: "/en", ka: "/ka", "x-default": "/en" },
    });
  });
});

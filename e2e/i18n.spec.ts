import { expect, test } from "@playwright/test";

const detection = [
  ["ka-GE", "/ka"],
  ["en-US", "/en"],
  // Neither English nor Georgian: falls back to English.
  ["de-DE", "/en"],
] as const;

for (const [locale, expected] of detection) {
  test.describe(`browser language ${locale}`, () => {
    test.use({ locale });

    test(`/ redirects to ${expected}`, async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(new RegExp(`${expected}$`));
    });
  });
}

test.describe("with an English browser", () => {
  test.use({ locale: "en-US" });

  test("the switcher keeps the page and the choice is remembered", async ({
    page,
  }) => {
    await page.goto("/en/about");
    await page.getByRole("link", { name: "ქართული" }).click();
    await expect(page).toHaveURL(/\/ka\/about$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ka");

    await page.goto("/");
    await expect(page).toHaveURL(/\/ka$/);
  });

  test("viewing a page with the switcher does not change the language", async ({
    page,
  }) => {
    await page.goto("/en/about");
    // Let link prefetching finish before checking the redirect.
    await page.waitForLoadState("networkidle");
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});

for (const locale of ["en", "ka"]) {
  test(`/${locale} sets <html lang="${locale}">`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
  });
}

test("pages declare canonical and hreflang alternates", async ({ page }) => {
  await page.goto("/ka/about");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/ka\/about$/,
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute("href", /\/en\/about$/);
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveAttribute("href", /\/en\/about$/);
});

test("unknown pages show the localized not-found page", async ({ page }) => {
  const response = await page.goto("/ka/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "გვერდი ვერ მოიძებნა",
  );
});

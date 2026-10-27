import { expect, test } from "@playwright/test";

test.describe("with a dark system theme", () => {
  test.use({ colorScheme: "dark" });

  test("follows the system theme by default", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("with a light system theme", () => {
  test.use({ colorScheme: "light" });

  test("the toggle switches the theme and remembers it", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });
});

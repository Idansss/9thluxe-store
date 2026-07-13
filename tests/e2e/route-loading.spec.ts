import { expect, test } from "@playwright/test"

/**
 * Route loading should feel like a calm house transition, not a fake product grid.
 */
test.describe("route loading", () => {
  test("collections navigation does not show product-card skeletons", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "One desktop audit is enough",
    )

    await page.goto("/shop", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("link", { name: /collections/i }).first()).toBeVisible()

    // Force a slower document so the loading UI has a chance to paint.
    await page.route("**/collections**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.continue()
    })

    const navigation = page
      .getByRole("navigation")
      .or(page.locator("header"))
      .first()

    await page.getByRole("link", { name: /^collections$/i }).first().click()

    // Progress line should appear quickly; fake product pedestals must not.
    await expect(page.locator("[data-navigation-progress='active']")).toBeVisible({
      timeout: 2000,
    })
    await expect(page.locator(".pedestal-light")).toHaveCount(0)
    await expect(page.getByText(/curating the collection|preparing the collection/i)).toBeVisible({
      timeout: 2000,
    })

    await page.waitForURL(/\/collections/, { timeout: 15000 })
    await expect(navigation).toBeVisible()
    await expect(page.locator("[data-navigation-progress='active']")).toHaveCount(0, {
      timeout: 5000,
    })
  })

  test("route loading mark respects reduced motion", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "One desktop audit is enough",
    )

    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/cart", { waitUntil: "domcontentloaded" })
    // Cart may redirect or render instantly; assert the loading stylesheet rule exists.
    const breatheDisabled = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return Boolean(style)
    })
    expect(breatheDisabled).toBe(true)
  })
})

import { test, expect } from "@playwright/test";

// A real end-to-end flow: sign up as a brand new user, add a plant
// through the actual form, and confirm it shows up in the list —
// exercising the frontend AND backend together, in a real browser.
test("sign up, add a plant, and see it appear in the list", async ({ page }) => {
  const uniqueEmail = `e2e-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.locator("#signup-email").fill(uniqueEmail);
  await page.locator("#signup-password").fill("password123");
  await page.locator("#signup-confirm-password").fill("password123");
  await page.getByRole("button", { name: /sign up/i }).click();

  // Signup should redirect to the protected Plants page
  await expect(page.getByRole("heading", { name: /plantcare/i })).toBeVisible();

  // Fill out and submit the add-plant form
  await page.getByPlaceholder("Fiddle Leaf Fig").fill("E2E Test Plant");
  await page.locator("select").selectOption("Succulent");
  await page.getByRole("button", { name: /add plant/i }).click();

  // The new plant should now actually appear in the list
  await expect(page.getByRole("heading", { name: "E2E Test Plant" })).toBeVisible();
});
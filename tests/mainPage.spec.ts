import { test, expect } from "@playwright/test";
import { LoginPage, MainPage } from "../pages";

test.describe("verify login process: ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://saucedemo.com");
    const login = new LoginPage(page);
    await login.loginWith("standard_user", "secret_sauce");
  });

  test("check every product has image, price and add to cart button", async ({
    page,
  }) => {
    const main = new MainPage(page);
    const allItems = await main.inventoryItem.all();

    for (const item of allItems) {
      await expect(main.getItemImage(item)).toBeVisible();
      await expect(main.getItemName(item)).toBeVisible();
      await expect(main.getItemName(item)).not.toBeEmpty();
      await expect(main.getItemPrice(item)).toBeVisible();
      await expect(main.getItemPrice(item)).toContainText("$");
      await expect(main.getItemButton(item)).toBeVisible();
      await expect(main.getItemButton(item)).toHaveText("Add to cart");
    }
  });

  test("check sorting by price from low to high", async ({ page }) => {
    const main = new MainPage(page);
    await main.selectSortOption("lohi");
    const prices = await main.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test("verify burger menu functionality", async ({ page }) => {
    const main = new MainPage(page);
    await expect(main.allItemsLink).not.toBeVisible();
    await main.openMenu();
    await expect(main.allItemsLink).toBeVisible();
    await expect(main.logoutLink).toBeVisible();
    await main.closeMenu();
    await expect(main.sidebarMenu).not.toBeVisible();

    await main.openMenu();
    await main.logout();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const login = new LoginPage(page);
    await expect(login.logo).toBeVisible();
  });
});

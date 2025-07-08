import HomePage from "./pages/home.page";
import { test as base } from "@playwright/test";
import SearchPage from "./pages/search.page";
import ProductPage from "./pages/product.page";

export type PageObjects = {
  homePage: HomePage;
  searchPage: SearchPage;
  productPage: ProductPage;
};

export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
});

export { expect, Page, Locator, Response } from "@playwright/test";

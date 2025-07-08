import { test, expect } from "../../pageObjects/pageFixture";

test.describe("Add specific product to cart", () => {
  test("should add 'Acme Circles T-Shirt' to cart", async ({ page, homePage, productPage }) => {
    await test.step("Open home page", async () => {
      await homePage.open();
    });

    await test.step("Click on 'Acme Circles T-Shirt' product", async () => {
      const productCard = homePage.productContainers.filter({
        hasText: "Acme Circles T-Shirt",
      }).first();

      await expect(productCard).toBeVisible();
      await productCard.click();
    });

    await test.step("Select color and size, then add to cart", async () => {
      await expect(productPage.page).toHaveURL(`/product/acme-geometric-circles-t-shirt`);
      await productPage.prepareAndAddToCart({
        color: "Black",
        size: "L",
      });
    });

    await test.step("Verify cart contains the selected product", async () => {
        const cartSidebar = productPage.cartSidebar;
  
        await expect(cartSidebar.host).toBeVisible();
        await expect(cartSidebar.cartItems).toHaveCount(1);
  
        const cartItem = cartSidebar.getCartItemByProductName("Acme Circles T-Shirt");
        await expect(cartItem).toBeVisible();
        await expect(cartItem).toContainText("Acme Circles T-Shirt");
        await expect(cartItem).toContainText("Black");
        await expect(cartItem).toContainText("L");
        await expect(cartItem).toContainText("$15.00USD");
      });
  });
});

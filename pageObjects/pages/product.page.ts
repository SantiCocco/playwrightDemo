// pageObjects/pages/product.page.ts
import { BasePage } from "../base.page";
import CartSidebar from "../components/cartSideBar";
import { expect, Locator } from "@playwright/test";

export default class ProductPage extends BasePage {
  readonly cartSidebar = new CartSidebar(this.page);

  readonly title = this.page.locator("h1");
  readonly addToCartButton = this.page.getByRole("button", { name: /add to cart/i });

  // Optional variant fields
  readonly colorFieldset = this.page.locator('form').filter({
    has: this.page.locator('dt', { hasText: 'Color' })
  });
  readonly sizeFieldset = this.page.locator('form').filter({
    has: this.page.locator('dt', { hasText: 'Size' })
  });

  get colorOptions() {
    return this.colorFieldset.locator('dd button');
  }

  get sizeOptions() {
    return this.sizeFieldset.locator('dd button');
  }

  async selectColor(color: string) {
    if (await this.colorFieldset.count() === 0) {
      throw new Error("Color option is not available on this product");
    }
    const option = this.colorOptions.filter({ hasText: new RegExp(`^${color}$`) });
    await expect(option).toHaveCount(1);
    await option.click();
  }

  async selectSize(size: string) {
    if (await this.sizeFieldset.count() === 0) {
      throw new Error("Size option is not available on this product");
    }
    const option = this.sizeOptions.filter({ hasText: new RegExp(`^${size}$`) });
    await expect(option).toHaveCount(1);
    await option.click();
  }

  /**
   * Select only the variants that exist and are passed
   */
  async prepareAndAddToCart(variant: { color?: string; size?: string }) {
    if (variant.color) {
      await this.selectColor(variant.color);
    }

    if (variant.size) {
      await this.selectSize(variant.size);
    }

    await this.addToCartButton.click();
  }
}

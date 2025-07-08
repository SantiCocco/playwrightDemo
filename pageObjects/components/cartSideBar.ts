import { BasePageComponent } from "../base.pageComponent";
import type { Page } from "@playwright/test";

export default class CartSidebar extends BasePageComponent {
  constructor(page: Page, locator = page.locator('[id^="headlessui-dialog-panel"]')) {
    super(locator);
  }

  readonly cartItems = this.host.locator('li.flex.w-full.flex-col.border-b');
  readonly checkoutButton = this.host.getByRole("button", { name: /proceed to checkout/i });
  readonly closeButton = this.host.getByRole("button", { name: /close cart/i });

  getCartItemByProductName(name: string) {
    return this.cartItems.filter({ hasText: name }).first();
  }
}

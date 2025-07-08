import { BasePageComponent } from "../base.pageComponent";
import type { Page } from "@playwright/test";

export default class NavBar extends BasePageComponent {
  constructor(page: Page, locator = page.locator("nav.relative.flex.items-center.justify-between")) {
    super(locator);
  }

  readonly links = {
    home: this.host.getByRole("link", { name: "Acme Store" }),
    all: this.host.getByRole("link", { name: "All" }),
    shirts: this.host.getByRole("link", { name: "Shirts" }),
    stickers: this.host.getByRole("link", { name: "Stickers" }),
  };

  readonly openCartButton = this.host.getByRole("button", {
    name: "Open cart",
  });

  readonly searchInput = this.host.getByPlaceholder("Search for products...");
}

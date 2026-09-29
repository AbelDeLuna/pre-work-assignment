import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  //expects and checks that the cart contains only one item with the given name and price
  async expectOnlyItem(name: string, price: string) {
    await expect(this.page).toHaveURL(/cart\.html/);
    const items = this.page.getByTestId('inventory-item');
    await expect(items).toHaveCount(1);
    await expect(items.first().getByTestId('inventory-item-name')).toHaveText(name);
    await expect(items.first().getByTestId('inventory-item-price')).toHaveText(price);
  }

  async checkout() {
    await this.page.getByTestId('checkout').click();
  }
}

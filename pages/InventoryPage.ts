import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  private productCard(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  //expect that the inventory page is loaded by checking the URL and the title
  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }

  async getPrice(name: string): Promise<string> {
    return this.productCard(name).getByTestId('inventory-item-price').innerText();
  }

  async addToCart(name: string) {
    await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectCartBadge(count: number) {
    await expect(this.page.getByTestId('shopping-cart-badge')).toHaveText(String(count));
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}

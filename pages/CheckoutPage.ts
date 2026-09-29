import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await this.page.getByTestId('firstName').fill(firstName);
    await this.page.getByTestId('lastName').fill(lastName);
    await this.page.getByTestId('postalCode').fill(postalCode);
    await this.page.getByTestId('continue').click();
  }

  //Adds single item to the checkout overview and checks that the item name and price are correct
  async expectOverviewOneItem(name: string, price: string) {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    const items = this.page.getByTestId('inventory-item');
    await expect(items).toHaveCount(1);
    await expect(items.first().getByTestId('inventory-item-name')).toHaveText(name);
    await expect(items.first().getByTestId('inventory-item-price')).toHaveText(price);
    await expect(this.page.getByTestId('subtotal-label')).toHaveText(`Item total: ${price}`);
  }

  async finish() {
    await this.page.getByTestId('finish').click();
  }

  async expectOrderComplete() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  }
}

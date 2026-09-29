import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { customer, users, products } from '../test-data/data';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

test('standard user can login and purchase a product end to end', async ({ page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const inventory = new InventoryPage(page);
  const login = new LoginPage(page);

  await test.step('Log in with a valid account', async () => {
    await login.goto();
    const { username, password } = users.standard;
    await login.login(username, password);
  });

  await test.step('Verify login succeeded', async () => {
    await inventory.expectLoaded();
  });

  await test.step('Locate the product and confirm its listed price', async () => {
    const listedPrice = await inventory.getPrice(products.backpack.name);
    expect(listedPrice).toBe(products.backpack.price);
  });

  await test.step('Add the product to the cart', async () => {
    await inventory.addToCart(products.backpack.name);
    await inventory.expectCartBadge(1);
  });

  await test.step('Verify the correct product is in the cart', async () => {
    await inventory.openCart();
    await cart.expectOnlyItem(products.backpack.name, products.backpack.price);
  });

  await test.step('Proceed to checkout and enter customer information', async () => {
    await cart.checkout();
    await checkout.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
  });

  await test.step('Verify product and price on the order overview', async () => {
    await checkout.expectOverviewOneItem(products.backpack.name, products.backpack.price);
  });

  await test.step('Complete the order', async () => {
    await checkout.finish();
  });

  await test.step('Verify the order confirmation', async () => {
    await checkout.expectOrderComplete();
  });
});

test('invalid user cannot log in', async ({ page }) => {
  const login = new LoginPage(page);

  await test.step('Attempt to log in with an invalid account', async () => {
    await login.goto();
    const { username, password } = users.invalid;
    await login.login(username, password);
  });

  await test.step('Verify login failed', async () => {
    await expect(page.getByTestId('error')).toBeVisible();
  });
});
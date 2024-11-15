import { expect, test } from '@playwright/test';

test('about page has expected h1', async ({ page }) => {
  await page.goto('/about');
  expect(await page.textContent('h1')).toBe('About Bored Game');
});

test('base page has title and header links', async ({ page }) => {
  await page.goto('/');
  
  // Expect a title "to contain" a substring
  await expect(page).toHaveTitle(/Bored Game \|/);

  // create a locator collection
  const collectionLink = page.getByRole('link', { name: 'COLLECTION' });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(collectionLink).toHaveAttribute('href', '/collection');

  // create a locator collection
  const wishlistLink = page.getByRole('link', { name: 'WISHLIST' });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(wishlistLink).toHaveAttribute('href', '/wishlist');

  // // Click the get started link.
  // await getStarted.click();

  // // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/);
})
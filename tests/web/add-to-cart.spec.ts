/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product and open its details page
 * 2) Set the quantity and click Add to Cart
 * 3) Verify the success message
 * 4) Open the cart and verify the product and quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @sanity @regression @web', async ({ homePage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    const productPage = await test.step('1) Search for the product and open its details page', async () => {
        const searchResultsPage = await homePage.searchProduct(productName);
        expect(await searchResultsPage.isProductDisplayed(productName), 'Product should be listed in the results').toBeTruthy();
        const page = await searchResultsPage.clickProduct(productName);
        expect(await page.isProductPageExists(productName), 'Product details page should be displayed').toBeTruthy();
        return page;
    });

    await test.step('2) Set the quantity and add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
    });

    await test.step('3) Verify the success message', async () => {
        expect(await productPage.getSuccessMessage(), 'Success message should mention the product').toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('4) Open the cart and verify the product and quantity', async () => {
        const cartPage = await productPage.clickShoppingCart();
        expect(await cartPage.isCartPageExists(), 'Shopping cart page should be displayed').toBeTruthy();
        expect(await cartPage.isProductInCart(productName), `Product "${productName}" should be in the cart`).toBeTruthy();
        expect(await cartPage.getProductQuantity(productName), 'Cart quantity should match').toBe(productQuantity);
    });

    console.log('✅ ✔️ Completed successfully!');
});

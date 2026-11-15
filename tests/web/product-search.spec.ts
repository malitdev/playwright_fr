/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product
 * 2) Verify the search results page is displayed
 * 3) Verify the expected product appears in the results
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search test @master @sanity @regression @web', async ({ homePage }) => {
    const { productName } = Helper.getProductDetails();

    const searchResultsPage = await test.step('1) Search for a known product', async () => {
        return await homePage.searchProduct(productName);
    });

    await test.step('2) Verify the search results page is displayed', async () => {
        expect(await searchResultsPage.isSearchResultsPageExists(), 'Search results page should be displayed').toBeTruthy();
    });

    await test.step('3) Verify the expected product appears in the results', async () => {
        expect(await searchResultsPage.isProductDisplayed(productName), `Product "${productName}" should be listed in the results`).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});

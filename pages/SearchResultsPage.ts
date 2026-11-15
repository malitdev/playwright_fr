import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly hdrSearch: Locator;
    private readonly lnkProductNames: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrSearch = page.getByRole('heading', { name: /^Search - / });
        this.lnkProductNames = page.locator('#product-list .product-thumb h4 a');
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the Search heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.hdrSearch.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether a product with the exact name appears in the results
     * @param productName - Product name
     * @returns Promise<boolean> - true if the product is listed
     */
    async isProductDisplayed(productName: string): Promise<boolean> {
        return (await this.lnkProductNames.getByText(productName, { exact: true }).count()) > 0;
    }

    /**
     * Opens the product details page of a listed product
     * @param productName - Product name
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async clickProduct(productName: string): Promise<ProductPage> {
        await this.lnkProductNames.getByText(productName, { exact: true }).click();
        return new ProductPage(this.page);
    }
}

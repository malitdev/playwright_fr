import { Page, Locator } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly hdrProduct: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly lnkShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrProduct = page.getByRole('heading', { level: 1 });
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('#alert .alert-success');
        this.lnkShoppingCart = page.getByTitle('Shopping Cart');
    }

    /**
     * Verifies the product details page is displayed for the given product
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product heading matches
     */
    async isProductPageExists(productName: string): Promise<boolean> {
        try {
            return (await this.hdrProduct.innerText()).trim() === productName;
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Sets the product quantity
     * @param quantity - Quantity to order
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Returns the success message shown after adding a product to the cart
     * @returns Promise<string> - Success message text
     */
    async getSuccessMessage(): Promise<string> {
        await this.alertSuccess.waitFor({ state: 'visible' });
        return (await this.alertSuccess.innerText()).trim();
    }

    /**
     * Opens the shopping cart from the header
     * @returns Promise<CartPage> - Instance of the cart page
     */
    async clickShoppingCart(): Promise<CartPage> {
        await this.lnkShoppingCart.click();
        return new CartPage(this.page);
    }
}

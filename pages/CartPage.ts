import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly hdrCart: Locator;
    private readonly rowsProducts: Locator;
    private readonly rowTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrCart = page.getByRole('heading', { name: /^Shopping Cart/ });
        this.rowsProducts = page.locator('#shopping-cart tbody tr');
        this.rowTotal = page.locator('#shopping-cart tfoot tr', { hasText: /^\s*Total/ });
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the Shopping Cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            await this.hdrCart.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Returns the cart row of a product
     * @param productName - Product name
     */
    private getProductRow(productName: string): Locator {
        return this.rowsProducts.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }

    /**
     * Checks whether a product is present in the cart
     * @param productName - Product name
     * @returns Promise<boolean> - true if the product is in the cart
     */
    async isProductInCart(productName: string): Promise<boolean> {
        return (await this.getProductRow(productName).count()) > 0;
    }

    /**
     * Returns the quantity of a product in the cart
     * @param productName - Product name
     * @returns Promise<string> - Quantity
     */
    async getProductQuantity(productName: string): Promise<string> {
        return await this.getProductRow(productName).locator('input[name="quantity"]').inputValue();
    }

    /**
     * Returns the unit price of a product in the cart
     * @param productName - Product name
     * @returns Promise<string> - Unit price, for example $602.00
     */
    async getProductUnitPrice(productName: string): Promise<string> {
        const cells = this.getProductRow(productName).locator('td');
        return (await cells.nth(4).innerText()).trim();
    }

    /**
     * Returns the cart total
     * @returns Promise<string> - Total, for example $602.00
     */
    async getCartTotal(): Promise<string> {
        return (await this.rowTotal.locator('td').last().innerText()).trim();
    }
}

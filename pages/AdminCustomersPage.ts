import { Page, Locator } from '@playwright/test';
import { AdminCustomerEditPage } from './AdminCustomerEditPage';

export class AdminCustomersPage {
    private readonly page: Page;

    // Locators
    private readonly txtFilterEmail: Locator;
    private readonly btnFilter: Locator;
    private readonly rowsCustomers: Locator;
    private readonly btnEditFirstRow: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.txtFilterEmail = page.locator('#input-email');
        this.btnFilter = page.locator('#button-filter');
        this.rowsCustomers = page.locator('#customer tbody tr');
        this.btnEditFirstRow = this.rowsCustomers.first().locator('a[href*="customer.form"]');
    }

    /**
     * Filters the customer list by email
     * @param email - Customer email address
     */
    async searchByEmail(email: string): Promise<void> {
        await this.txtFilterEmail.fill(email);
        // The filter reloads the list via ajax; wait for it before reading rows
        await Promise.all([
            this.page.waitForResponse(r => r.url().includes('customer.list')),
            this.btnFilter.click(),
        ]);
    }

    /**
     * Returns the number of customer rows shown after filtering
     * @returns Promise<number> - Number of matching rows
     */
    async getCustomerRowCount(): Promise<number> {
        return await this.rowsCustomers.filter({ hasText: '@' }).count();
    }

    /**
     * Returns the text of the first customer row (name, email, group, status, date)
     * @returns Promise<string> - Row text
     */
    async getFirstRowText(): Promise<string> {
        return (await this.rowsCustomers.first().innerText()).trim();
    }

    /**
     * Opens the customer form of the first customer row
     * @returns Promise<AdminCustomerEditPage> - Instance of the customer edit page
     */
    async clickEditFirstCustomer(): Promise<AdminCustomerEditPage> {
        await this.btnEditFirstRow.click();
        return new AdminCustomerEditPage(this.page);
    }
}

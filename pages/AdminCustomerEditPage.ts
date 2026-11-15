import { Page, Locator } from '@playwright/test';

export class AdminCustomerEditPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly chkStatus: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.chkStatus = page.locator('#input-status');
    }

    /**
     * Returns the first name shown in the customer form
     * @returns Promise<string> - First name
     */
    async getFirstName(): Promise<string> {
        return await this.txtFirstName.inputValue();
    }

    /**
     * Returns the last name shown in the customer form
     * @returns Promise<string> - Last name
     */
    async getLastName(): Promise<string> {
        return await this.txtLastName.inputValue();
    }

    /**
     * Returns the email shown in the customer form
     * @returns Promise<string> - Email address
     */
    async getEmail(): Promise<string> {
        return await this.txtEmail.inputValue();
    }

    /**
     * Checks whether the customer status switch is on
     * @returns Promise<boolean> - true if the customer is enabled
     */
    async isStatusEnabled(): Promise<boolean> {
        return await this.chkStatus.isChecked();
    }
}

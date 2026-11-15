import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly hdrMyAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrMyAccount = page.getByRole('heading', { name: 'My Account', exact: true, level: 1 });
    }

    /**
     * Verifies the My Account page is displayed
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.hdrMyAccount.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }
}

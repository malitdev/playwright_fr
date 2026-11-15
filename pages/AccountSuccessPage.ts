import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly hdrConfirmation: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrConfirmation = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.btnContinue = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the account created confirmation is displayed
     * @returns Promise<boolean> - true if the confirmation heading is visible
     */
    async isAccountCreated(): Promise<boolean> {
        try {
            await this.hdrConfirmation.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking account created confirmation: ${error}`);
            return false;
        }
    }

    /**
     * Clicks Continue on the account created page
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.btnContinue.click();
        return new MyAccountPage(this.page);
    }
}

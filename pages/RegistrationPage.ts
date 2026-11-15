import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export class RegistrationPage {
    private readonly page: Page;

    // Locators
    private readonly hdrRegister: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrRegister = page.getByRole('heading', { name: 'Register Account' });
        this.txtFirstName = page.getByLabel('First Name');
        this.txtLastName = page.getByLabel('Last Name');
        this.txtEmail = page.getByLabel('E-Mail');
        this.txtPassword = page.getByLabel('Password');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.getByRole('button', { name: 'Continue' });
    }

    /**
     * Verifies the registration page is displayed
     * @returns Promise<boolean> - true if the Register Account heading is visible
     */
    async isRegistrationPageExists(): Promise<boolean> {
        try {
            return await this.hdrRegister.isVisible();
        } catch (error) {
            console.log(`Error checking registration page: ${error}`);
            return false;
        }
    }

    /**
     * Fills the mandatory registration fields, accepts the Privacy Policy and submits the form
     * @param firstName - First name
     * @param lastName - Last name
     * @param email - Unique email address
     * @param password - Password
     * @returns Promise<AccountSuccessPage> - Instance of the account created page
     */
    async completeRegistration(firstName: string, lastName: string, email: string, password: string): Promise<AccountSuccessPage> {
        try {
            await this.txtFirstName.fill(firstName);
            await this.txtLastName.fill(lastName);
            await this.txtEmail.fill(email);
            await this.txtPassword.fill(password);
            await this.chkPrivacyPolicy.check();
            await this.btnContinue.click();
            return new AccountSuccessPage(this.page);
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }
}

import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly hdrReturningCustomer: Locator;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrReturningCustomer = page.getByRole('heading', { name: 'Returning Customer' });
        this.txtEmail = page.getByPlaceholder('E-Mail Address');
        this.txtPassword = page.getByPlaceholder('Password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
        this.alertWarning = page.locator('#alert .alert, .alert-danger').first();
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the Returning Customer heading is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.hdrReturningCustomer.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Fills the login form and submits it. A blank value leaves the field empty.
     * @param email - Customer email
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        try {
            await this.txtEmail.fill(email.trim());
            await this.txtPassword.fill(password.trim());
            await this.btnLogin.click();
            return new MyAccountPage(this.page);
        } catch (error) {
            console.log(`Error logging in: ${error}`);
            throw error;
        }
    }

    /**
     * Returns the warning message displayed after a failed login
     * @returns Promise<string> - Warning text
     */
    async getWarningMessage(): Promise<string> {
        await this.alertWarning.waitFor({ state: 'visible' });
        return (await this.alertWarning.innerText()).trim();
    }
}

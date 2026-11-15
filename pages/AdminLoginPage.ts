import { Page, Locator } from '@playwright/test';
import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.txtUsername = page.getByPlaceholder('Username');
        this.txtPassword = page.getByPlaceholder('Password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
    }

    /**
     * Opens the admin login page
     * @param adminUrl - Admin portal URL
     */
    async open(adminUrl: string): Promise<void> {
        await this.page.goto(adminUrl);
    }

    /**
     * Logs in to the admin portal
     * @param username - Admin username
     * @param password - Admin password
     * @returns Promise<AdminDashboardPage> - Instance of the admin dashboard page
     */
    async login(username: string, password: string): Promise<AdminDashboardPage> {
        try {
            await this.txtUsername.fill(username);
            await this.txtPassword.fill(password);
            await this.btnLogin.click();
            return new AdminDashboardPage(this.page);
        } catch (error) {
            console.log(`Error logging in to admin portal: ${error}`);
            throw error;
        }
    }
}

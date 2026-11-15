import { Page, Locator } from '@playwright/test';
import { RegistrationPage } from './RegistrationPage';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkLogout: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.lnkMyAccount = page.getByRole('button', { name: 'My Account' });
        this.lnkRegister = page.locator('#top').getByRole('link', { name: 'Register', exact: true });
        this.lnkLogin = page.locator('#top').getByRole('link', { name: 'Login', exact: true });
        this.lnkLogout = page.locator('#top').getByRole('link', { name: 'Logout', exact: true });
        this.txtSearch = page.getByPlaceholder('Search');
        this.btnSearch = page.locator('form.input-group button[type="submit"]');
    }

    /**
     * Opens the My Account dropdown in the header
     */
    async clickMyAccount(): Promise<void> {
        await this.lnkMyAccount.click();
    }

    /**
     * Clicks the Register link in the My Account dropdown
     * @returns Promise<RegistrationPage> - Instance of the registration page
     */
    async clickRegister(): Promise<RegistrationPage> {
        await this.lnkRegister.click();
        return new RegistrationPage(this.page);
    }

    /**
     * Clicks the Login link in the My Account dropdown
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.lnkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Clicks the Logout link in the My Account dropdown
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        return new LogoutPage(this.page);
    }

    /**
     * Checks whether the Logout link is available in the My Account dropdown
     * @returns Promise<boolean> - true if the Logout link exists
     */
    async isLogoutLinkExists(): Promise<boolean> {
        try {
            await this.lnkLogout.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Searches for a product using the header search box
     * @param productName - Product name to search for
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
        return new SearchResultsPage(this.page);
    }
}

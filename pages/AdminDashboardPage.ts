import { Page, Locator } from '@playwright/test';
import { AdminCustomersPage } from './AdminCustomersPage';

export class AdminDashboardPage {
    private readonly page: Page;

    // Locators
    private readonly hdrDashboard: Locator;
    private readonly dlgSecurity: Locator;
    private readonly btnCloseSecurity: Locator;
    private readonly mnuCustomers: Locator;
    private readonly lnkCustomers: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.hdrDashboard = page.getByRole('heading', { name: 'Dashboard' });
        this.dlgSecurity = page.locator('#modal-security');
        this.btnCloseSecurity = page.locator('#modal-security .btn-close');
        this.mnuCustomers = page.locator('#menu-customer > a');
        this.lnkCustomers = page.locator('#menu-customer ul').getByRole('link', { name: 'Customers' });
    }

    /**
     * Verifies the admin dashboard is displayed
     * @returns Promise<boolean> - true if the Dashboard heading is visible
     */
    async isDashboardPageExists(): Promise<boolean> {
        try {
            await this.hdrDashboard.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking admin dashboard: ${error}`);
            return false;
        }
    }

    /**
     * Opens Customers > Customers from the side menu
     * @returns Promise<AdminCustomersPage> - Instance of the customers list page
     */
    async openCustomers(): Promise<AdminCustomersPage> {
        await this.closeSecurityNotification();
        await this.mnuCustomers.click();
        await this.lnkCustomers.click();
        return new AdminCustomersPage(this.page);
    }

    /**
     * Closes the Important Security Notification dialog when it is displayed
     */
    async closeSecurityNotification(): Promise<void> {
        if (await this.dlgSecurity.isVisible()) {
            await this.btnCloseSecurity.click();
            await this.dlgSecurity.waitFor({ state: 'hidden' });
        }
    }
}

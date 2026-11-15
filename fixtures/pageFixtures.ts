import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { AccountSuccessPage } from '../pages/AccountSuccessPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminCustomersPage } from '../pages/AdminCustomersPage';
import { AdminCustomerEditPage } from '../pages/AdminCustomerEditPage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL as string;

type PageFixtures = {
    homePage: HomePage;
    registrationPage: RegistrationPage;
    accountSuccessPage: AccountSuccessPage;
    adminLoginPage: AdminLoginPage;
    adminDashboardPage: AdminDashboardPage;
    adminCustomersPage: AdminCustomersPage;
    adminCustomerEditPage: AdminCustomerEditPage;
    loginPage: LoginPage;
    myAccountPage: MyAccountPage;
    logoutPage: LogoutPage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registrationPage: async ({ page }, use) => {
        await use(new RegistrationPage(page));
    },
    accountSuccessPage: async ({ page }, use) => {
        await use(new AccountSuccessPage(page));
    },
    adminLoginPage: async ({ page }, use) => {
        await use(new AdminLoginPage(page));
    },
    adminDashboardPage: async ({ page }, use) => {
        await use(new AdminDashboardPage(page));
    },
    adminCustomersPage: async ({ page }, use) => {
        await use(new AdminCustomersPage(page));
    },
    adminCustomerEditPage: async ({ page }, use) => {
        await use(new AdminCustomerEditPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

test.afterEach(async ({ page, context }) => {
    if (!page.isClosed()) await page.close();
    await context.close().catch(() => {});
});

export { expect } from '@playwright/test';

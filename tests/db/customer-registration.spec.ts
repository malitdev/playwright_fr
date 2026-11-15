/**
 * Test Case: Register a customer on the storefront, then verify the same customer
 * in the OpenCart Admin Portal and in the MySQL oc_customer table
 *
 * Tags: @master @regression @db
 *
 * Steps:
 * 1) Register a new customer through the frontend
 * 2) Verify the customer in the Admin Portal
 * 3) Verify the customer in MySQL
 */

import dotenv from 'dotenv';
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';

dotenv.config();

test('Customer registration UI, Admin and DB validation test @master @regression @db', async ({
    homePage,
    adminLoginPage,
}) => {
    // Unique customer data, generated once and reused in every layer
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `${Date.now()}.${RandomDataUtil.getEmail()}`.toLowerCase();
    const password = RandomDataUtil.getPassword();

    const adminUrl = new URL('admin/index.php', process.env.WEB_APP_URL).toString();
    const adminUsername = process.env.ADMIN_USERNAME as string;
    const adminPassword = process.env.ADMIN_PASSWORD as string;

    try {
        await test.step('1) Register a customer through the frontend', async () => {
            await homePage.clickMyAccount();
            const registrationPage = await homePage.clickRegister();
            expect(await registrationPage.isRegistrationPageExists(), 'Registration page should be displayed').toBeTruthy();

            const accountSuccessPage = await registrationPage.completeRegistration(firstName, lastName, email, password);
            expect(await accountSuccessPage.isAccountCreated(), 'Account created confirmation should be displayed').toBeTruthy();
        });

        await test.step('2) Verify the customer in the Admin Portal', async () => {
            await adminLoginPage.open(adminUrl);
            const dashboardPage = await adminLoginPage.login(adminUsername, adminPassword);
            expect(await dashboardPage.isDashboardPageExists(), 'Admin dashboard should be displayed').toBeTruthy();

            const customersPage = await dashboardPage.openCustomers();
            await customersPage.searchByEmail(email);
            expect(await customersPage.getCustomerRowCount(), `Admin should list exactly one customer for ${email}`).toBe(1);

            const customerPage = await customersPage.clickEditFirstCustomer();
            expect(await customerPage.getFirstName(), 'Admin first name should match').toBe(firstName);
            expect(await customerPage.getLastName(), 'Admin last name should match').toBe(lastName);
            expect(await customerPage.getEmail(), 'Admin email should match').toBe(email);
            expect(await customerPage.isStatusEnabled(), 'Admin should show the customer as enabled').toBeTruthy();
        });

        await test.step('3) Verify the customer in MySQL', async () => {
            const [rows]: any = await executeQuery(
                'SELECT firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
                [email]
            );

            expect(rows.length, `oc_customer should contain exactly one row for ${email}`).toBe(1);
            expect(rows[0].firstname, 'DB firstname should match').toBe(firstName);
            expect(rows[0].lastname, 'DB lastname should match').toBe(lastName);
            expect(rows[0].email, 'DB email should match').toBe(email);
            expect(rows[0].status, 'DB status should be 1 (enabled)').toBe(1);
            expect(rows[0].date_added, 'DB date_added should exist').toBeTruthy();
        });

        console.log('✅ ✔️ Completed successfully!');
    } finally {
        // Cleanup so the test is repeatable
        await executeQuery('DELETE FROM oc_customer WHERE email = ?', [email]);
    }
});

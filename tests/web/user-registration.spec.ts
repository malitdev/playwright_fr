/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Register
 * 2) Register a new customer with unique data
 * 3) Verify the account created confirmation
 * 4) Verify the My Account area is available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration test @master @sanity @regression @web', async ({ homePage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `${Date.now()}.${RandomDataUtil.getEmail()}`.toLowerCase();
    const password = RandomDataUtil.getPassword();

    const registrationPage = await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickMyAccount();
        const page = await homePage.clickRegister();
        expect(await page.isRegistrationPageExists(), 'Registration page should be displayed').toBeTruthy();
        return page;
    });

    const accountSuccessPage = await test.step('2) Register a new customer', async () => {
        return await registrationPage.completeRegistration(firstName, lastName, email, password);
    });

    await test.step('3) Verify the account created confirmation', async () => {
        expect(await accountSuccessPage.isAccountCreated(), 'Account created confirmation should be displayed').toBeTruthy();
    });

    await test.step('4) Verify the My Account area is available', async () => {
        const myAccountPage = await accountSuccessPage.clickContinue();
        expect(await myAccountPage.isMyAccountPageExists(), 'My Account page should be displayed').toBeTruthy();
        await homePage.clickMyAccount();
        expect(await homePage.isLogoutLinkExists(), 'Logout option should be available for the new account').toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});

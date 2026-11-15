/**
 * Test Case: Valid and Invalid Login Flows
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Login
 * 2) Login with valid credentials, verify My Account
 * 3) Login with invalid credentials, verify the warning
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Valid login test @master @sanity @regression @web', async ({ homePage }) => {
    const { email, password } = Helper.getLoginDetails();

    const loginPage = await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        const page = await homePage.clickLogin();
        expect(await page.isLoginPageExists(), 'Login page should be displayed').toBeTruthy();
        return page;
    });

    await test.step('2) Login with valid credentials', async () => {
        const myAccountPage = await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists(), 'My Account page should be displayed').toBeTruthy();
    });

    await test.step('3) Verify authenticated account navigation', async () => {
        await homePage.clickMyAccount();
        expect(await homePage.isLogoutLinkExists(), 'Logout option should be available after login').toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});

test('Invalid login test @master @regression @web', async ({ homePage }) => {
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword();

    const loginPage = await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickLogin();
    });

    await test.step('2) Login with invalid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify the warning and that the user is not authenticated', async () => {
        expect(await loginPage.getWarningMessage(), 'Warning message should match').toContain('Warning: No match for E-Mail Address and/or Password.');
        await homePage.clickMyAccount();
        expect(await homePage.isLogoutLinkExists(), 'Logout option should not be available').toBeFalsy();
    });

    console.log('✅ ✔️ Completed successfully!');
});

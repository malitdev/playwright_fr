/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Login with valid credentials
 * 2) Logout from My Account
 * 3) Verify the logout page and the redirect to the home page
 * 4) Verify authenticated options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout test @master @sanity @regression @web', async ({ homePage, page }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Login with valid credentials', async () => {
        await homePage.clickMyAccount();
        const loginPage = await homePage.clickLogin();
        const myAccountPage = await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists(), 'Login should succeed').toBeTruthy();
    });

    const logoutPage = await test.step('2) Click Logout', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickLogout();
    });

    await test.step('3) Verify the logout page and click Continue', async () => {
        expect(await logoutPage.isLogoutPageExists(), 'Logout confirmation page should be displayed').toBeTruthy();
        await logoutPage.clickContinue();
        await expect(page, 'Should be redirected to the home page').toHaveURL(/route=common\/home|\/upload\/?$/);
    });

    await test.step('4) Verify authenticated options are not available', async () => {
        await homePage.clickMyAccount();
        expect(await homePage.isLogoutLinkExists(), 'Logout option should not be available').toBeFalsy();
    });

    console.log('✅ ✔️ Completed successfully!');
});

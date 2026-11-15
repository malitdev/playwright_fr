/**
 * Test Case: Login Flow (Data Driven using external JSON file)
 *
 * Tags: @master @regression @web @datadriven
 *
 * Steps (for every row in testdata/opencart_logindata.json):
 * 1) Navigate to My Account > Login
 * 2) Enter the email and password (blank values stay empty)
 * 3) Verify the result matches the "expected" value
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginData = {
    testName: string;
    email: string;
    password: string;
    expected: string;
};

const loginData: LoginData[] = DataProvider.readJson('./testdata/opencart_logindata.json');

loginData.forEach((data, index) => {
    test(`${index + 1} - ${data.testName} (${data.email.trim() || 'blank email'}) @master @regression @web @datadriven`, async ({ homePage }) => {

        const loginPage = await test.step('1) Navigate to the login page', async () => {
            await homePage.clickMyAccount();
            return await homePage.clickLogin();
        });

        const myAccountPage = await test.step('2) Enter the credentials and submit', async () => {
            return await loginPage.login(data.email, data.password);
        });

        await test.step(`3) Verify the expected result: ${data.expected}`, async () => {
            if (data.expected === 'success') {
                expect(await myAccountPage.isMyAccountPageExists(), 'My Account page should be displayed').toBeTruthy();
            } else {
                expect(await loginPage.getWarningMessage(), 'Login warning should be displayed').toContain('Warning: No match for E-Mail Address and/or Password.');
            }
        });

        console.log('✅ ✔️ Completed successfully!');
    });
});

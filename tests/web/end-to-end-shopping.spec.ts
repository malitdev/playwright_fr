/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @regression @web @e2e
 *
 * Steps:
 * 1) Register a new customer with unique data
 * 2) Logout
 * 3) Login with the new credentials
 * 4) Search for a product and add it to the cart
 * 5) Verify the product, quantity, price and total in the cart
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping flow test @master @regression @web @e2e', async ({ homePage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `${Date.now()}.${RandomDataUtil.getEmail()}`.toLowerCase();
    const password = RandomDataUtil.getPassword();
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Register a new customer', async () => {
        await homePage.clickMyAccount();
        const registrationPage = await homePage.clickRegister();
        expect(await registrationPage.isRegistrationPageExists(), 'Registration page should be displayed').toBeTruthy();
        const accountSuccessPage = await registrationPage.completeRegistration(firstName, lastName, email, password);
        expect(await accountSuccessPage.isAccountCreated(), 'Account created confirmation should be displayed').toBeTruthy();
    });

    await test.step('2) Logout', async () => {
        await homePage.clickMyAccount();
        const logoutPage = await homePage.clickLogout();
        expect(await logoutPage.isLogoutPageExists(), 'Logout confirmation page should be displayed').toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('3) Login with the new credentials', async () => {
        await homePage.clickMyAccount();
        const loginPage = await homePage.clickLogin();
        const myAccountPage = await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists(), 'Login with the new account should succeed').toBeTruthy();
    });

    const productPage = await test.step('4) Search for the product and add it to the cart', async () => {
        const searchResultsPage = await homePage.searchProduct(productName);
        expect(await searchResultsPage.isProductDisplayed(productName), 'Product should be listed in the results').toBeTruthy();
        const page = await searchResultsPage.clickProduct(productName);
        await page.setQuantity(productQuantity);
        await page.clickAddToCart();
        expect(await page.getSuccessMessage(), 'Success message should mention the product').toContain(productName);
        return page;
    });

    await test.step('5) Verify the cart', async () => {
        const cartPage = await productPage.clickShoppingCart();
        expect(await cartPage.isProductInCart(productName), `Product "${productName}" should be in the cart`).toBeTruthy();
        expect(await cartPage.getProductQuantity(productName), 'Quantity should match').toBe(productQuantity);

        const unitPrice = Helper.convertPriceToNumber(await cartPage.getProductUnitPrice(productName));
        expect(unitPrice, 'Unit price should match').toBe(Helper.convertPriceToNumber(totalPrice));

        const cartTotal = Helper.convertPriceToNumber(await cartPage.getCartTotal());
        expect(cartTotal, 'Cart total should equal unit price x quantity').toBe(unitPrice * Number(productQuantity));
    });

    console.log('✅ ✔️ Completed successfully!');
});

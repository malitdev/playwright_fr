import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe.serial('CRUD Workflow API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Product: create -> update -> delete
    // ---------------------------------------------------------

    test('Product CRUD Workflow @master @regression @api', async ({ request }) => {

        // Create
        const createPayload = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });
        expect(createResponse.status(), 'Create should return 201').toBe(201);

        const productId = (await createResponse.json()).id;
        expect(productId, 'Create should return a product id').toBeTruthy();

        // Update
        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        const updateUrl = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });
        expect(updateResponse.status(), 'Update should return 200').toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id, 'Updated product id should match the created id').toBe(productId);
        expect(updated.title, 'title should be updated').toBe(updatePayload.title);
        expect(updated.price, 'price should be updated').toBe(updatePayload.price);

        // Delete
        const deleteUrl = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`;
        const deleteResponse = await request.delete(deleteUrl);
        expect(deleteResponse.status(), 'Delete should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // User: create -> update -> delete
    // ---------------------------------------------------------

    test('User CRUD Workflow @master @regression @api', async ({ request }) => {

        // Create
        const createPayload = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });
        expect(createResponse.status(), 'Create should return 201').toBe(201);

        const userId = (await createResponse.json()).id;
        expect(userId, 'Create should return a user id').toBeTruthy();

        // Update
        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updateUrl = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });
        expect(updateResponse.status(), 'Update should return 200').toBe(200);

        const updated = await updateResponse.json();
        expect(updated.username, 'username should be updated').toBe(updatePayload.username);
        expect(updated.email, 'email should be updated').toBe(updatePayload.email);

        // Delete
        const deleteUrl = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`;
        const deleteResponse = await request.delete(deleteUrl);
        expect(deleteResponse.status(), 'Delete should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // Cart: create -> update -> delete
    // ---------------------------------------------------------

    test('Cart CRUD Workflow @master @regression @api', async ({ request }) => {

        // Create
        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });
        expect(createResponse.status(), 'Create should return 201').toBe(201);

        const created = await createResponse.json();
        const cartId = created.id;
        expect(cartId, 'Create should return a cart id').toBeTruthy();
        expect(created.userId, 'userId should match').toBe(USER_ID);
        expect(created.products, 'products should match').toEqual(createPayload.products);

        // Update
        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const updateUrl = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });
        expect(updateResponse.status(), 'Update should return 200').toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id, 'Updated cart id should match the created id').toBe(cartId);
        expect(updated.products[0].quantity, 'Product quantity should be updated').toBe(updatePayload.products[0].quantity);

        // Delete
        const deleteUrl = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`;
        const deleteResponse = await request.delete(deleteUrl);
        expect(deleteResponse.status(), 'Delete should return 200').toBe(200);
    });
});

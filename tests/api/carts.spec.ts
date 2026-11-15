import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Cart list should not be empty').toBeGreaterThan(0);

        carts.forEach((cart: any) => {
            expect(typeof cart.id, 'id should be a number').toBe('number');
            expect(typeof cart.userId, 'userId should be a number').toBe('number');
            expect(Array.isArray(cart.products), 'products should be an array').toBeTruthy();
        });
    });

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const cart = await response.json();

        expect(cart.id, 'Returned id should match the requested id').toBe(CART_ID);
        expect(cart.userId, 'userId should be a number').toBeGreaterThan(0);
        expect(cart.products.length, 'Cart should contain products').toBeGreaterThan(0);
    });

    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Date range should return carts').toBeGreaterThan(0);

        carts.forEach((cart: any) => {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate, `Cart ${cart.id} date should not be before ${START_DATE}`).toBeGreaterThanOrEqual(new Date(START_DATE).getTime());
            expect(cartDate, `Cart ${cart.id} date should not be after ${END_DATE}`).toBeLessThanOrEqual(new Date(END_DATE).getTime());
        });
    });

    test('GET - User Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'User should have carts').toBeGreaterThan(0);

        carts.forEach((cart: any) => {
            expect(cart.userId, `Cart ${cart.id} should belong to user ${USER_ID}`).toBe(USER_ID);
        });
    });

    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, `Should return ${LIMIT} carts`).toBe(LIMIT);
    });

    test('GET - Carts Sorted Ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((cart: any) => cart.id);
        const expectedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Cart ids should be in ascending order').toEqual(expectedIds);
    });

    test('GET - Carts Sorted Descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((cart: any) => cart.id);
        const expectedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Cart ids should be in descending order').toEqual(expectedIds);
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Status should be 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'A cart id should be returned').toBeTruthy();
        expect(created.userId, 'userId should match').toBe(USER_ID);
        expect(created.products, 'products should match').toEqual(payload.products);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Status should be 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned id should match the requested id').toBe(CART_ID);
        expect(updated.products[0].quantity, 'Product quantity should be updated').toBe(payload.products[0].quantity);
        expect(updated.products, 'products should be updated').toEqual(payload.products);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`;
        const response = await request.delete(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted cart id should match').toBe(CART_ID);
    });
});

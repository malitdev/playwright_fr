import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Product list should not be empty').toBeGreaterThan(0);

        products.forEach((product: any) => {
            expect(typeof product.id, 'id should be a number').toBe('number');
            expect(typeof product.title, 'title should be a string').toBe('string');
            expect(typeof product.price, 'price should be a number').toBe('number');
            expect(typeof product.category, 'category should be a string').toBe('string');
            expect(typeof product.image, 'image should be a string').toBe('string');
        });
    });

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const product = await response.json();

        expect(product.id, 'Returned id should match the requested id').toBe(PRODUCT_ID);
        expect(product.title, 'title should not be empty').toBeTruthy();
        expect(typeof product.price, 'price should be a number').toBe('number');
        expect(product.category, 'category should not be empty').toBeTruthy();
        expect(product.image, 'image should not be empty').toBeTruthy();
    });

    test('GET - Products with Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, `Should return ${LIMIT} products`).toBe(LIMIT);
    });

    test('GET - Products Sorted Ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((product: any) => product.id);
        const expectedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Product ids should be in ascending order').toEqual(expectedIds);
    });

    test('GET - Products Sorted Descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((product: any) => product.id);
        const expectedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Product ids should be in descending order').toEqual(expectedIds);
    });

    test('GET - All Categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories), 'Response should be an array').toBeTruthy();
        expect(categories.length, 'Category list should not be empty').toBeGreaterThan(0);
    });

    test('GET - Products by Category @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Category should contain products').toBeGreaterThan(0);

        products.forEach((product: any) => {
            expect(product.category, `Product ${product.id} should belong to ${CATEGORY}`).toBe(CATEGORY);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Status should be 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'A product id should be returned').toBeTruthy();
        expect(created.title, 'title should match').toBe(payload.title);
        expect(created.price, 'price should match').toBe(payload.price);
        expect(created.description, 'description should match').toBe(payload.description);
        expect(created.image, 'image should match').toBe(payload.image);
        expect(created.category, 'category should match').toBe(payload.category);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Status should be 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned id should match the requested id').toBe(PRODUCT_ID);
        expect(updated.title, 'title should be updated').toBe(payload.title);
        expect(updated.price, 'price should be updated').toBe(payload.price);
        expect(updated.description, 'description should be updated').toBe(payload.description);
        expect(updated.category, 'category should be updated').toBe(payload.category);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.delete(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted product id should match').toBe(PRODUCT_ID);
    });
});

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv({ allErrors: true });

    // ---------------------------------------------------------
    // Schemas
    // ---------------------------------------------------------

    test('Product Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(await response.json());

        expect(isValid, `Product schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    test('User Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(await response.json());

        expect(isValid, `User schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    test('Cart Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(await response.json());

        expect(isValid, `Cart schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });
});

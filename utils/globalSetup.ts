import { executeQuery } from './dbClient';

/**
 * Clears OpenCart's failed-login counters so repeated invalid-login runs
 * never hit "exceeded allowed number of login attempts". Skipped if the DB is unreachable (e.g. CI).
 */
export default async function globalSetup(): Promise<void> {
    try {
        await executeQuery('DELETE FROM oc_customer_login');
    } catch (error) {
        console.log(`globalSetup: could not reset oc_customer_login (${error})`);
    }
}

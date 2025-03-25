import { test, expect } from '@playwright/test';
import { AENA_FoodToFly } from '../pages/AENA_FoodToFly';
import { logToFile } from '../utils/logger';

const email = 'daniell.tec@entelgy.com';
const password = 'Arbust0@01';

test.describe('Login Tests', () => {
    test('Debe iniciar sesión correctamente en Chrome y Edge', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new AENA_FoodToFly(page);

        logToFile('Iniciando prueba de login');

        await loginPage.navigate();
        await loginPage.login(email, password);

        await page.waitForTimeout(3000);
        logToFile('Test finalizado');
    });
});

import { Page } from '@playwright/test';
import { logToFile } from '../utils/logger';

export class AENA_FoodToFly {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://foodtofly.aena.es/es/', { waitUntil: 'domcontentloaded', timeout: 120000 });
        logToFile('Página cargada correctamente');
    }

    async login(email: string, password: string) {
        await this.page.click('#topNavigation > div.header-links > div > ul > li:nth-child(3) > a');
        await this.page.waitForTimeout(100000);

        await this.page.fill('#gigya-login-form .gigya-input-text', email);
        await this.page.fill('#gigya-login-form .gigya-input-password', password);

        logToFile('Credenciales ingresadas');

        const submitButton = this.page.locator('#gigya-login-form .gigya-input-submit');
        if (await submitButton.isEnabled()) {
            await submitButton.click();
            logToFile('Formulario enviado correctamente');
        } else {
            logToFile('El botón de submit está deshabilitado');
        }
    }
}

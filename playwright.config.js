import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        headless: false, // Asegura que se ejecute en modo gráfico
        viewport: { width: 1920, height: 1080 },
        slowMo: 100,  // Ralentiza la ejecución para visualizar mejor
    },
    /*projects: [
        {
            name: 'chrome',
            use: { browserName: 'chromium', channel: 'chrome' }, // Usa Chrome en lugar de Chromium
        },
        {
            name: 'edge',
            use: { browserName: 'chromium', channel: 'msedge' }, // Usa Edge
        }
    ]*/
});

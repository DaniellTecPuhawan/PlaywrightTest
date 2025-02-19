const { chromium, firefox, devices } = require('playwright');
const fs = require('fs');

const URL = 'https://aenatravel.aena.es/es/'; // URL objetivo

// Función para agregar registros al archivo log
const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync('AENA_Travel_Headless_Android_session-log.txt', `[${timestamp}] ${message}\n`);
};

// Datos de login como variables separadas. Usa variables de entorno o valores predeterminados.
const email = process.env.EMAIL || 'daniell.tec@entelgy.com';
const password = process.env.PASSWORD || 'Arbust0@EN@1';

(async () => {
    try {
        console.log('Verificando disponibilidad de la URL...');
        logToFile('Verificando disponibilidad de la URL...');

        const tempBrowser = await chromium.launch({ headless: true }); // Modo headless
        const tempPage = await tempBrowser.newPage();
        const response = await tempPage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });

        if (response.status() !== 200) {
            console.error(`Error: La página no está disponible (Código: ${response.status()})`);
            logToFile(`Error: La página no está disponible (Código: ${response.status()})`);
            await tempBrowser.close();
            return;
        }

        console.log('La URL responde con código 200. Continuando ejecución...');
        logToFile('La URL responde con código 200. Continuando ejecución...');
        await tempBrowser.close();

        console.log('Iniciando navegadores...');

        const [chromeBrowser, firefoxBrowser] = await Promise.all([
            chromium.launch({ headless: true }), // Modo headless
            firefox.launch({ headless: true })   // Modo headless
        ]);

        const chromeContext = await chromeBrowser.newContext({ ...devices['Pixel 4'] });
        const firefoxContext = await firefoxBrowser.newContext({
            userAgent: devices['Pixel 4'].userAgent,
            viewport: devices['Pixel 4'].viewport,
        });

        const [chromePage, firefoxPage] = await Promise.all([
            chromeContext.newPage(),
            firefoxContext.newPage()
        ]);

        const blockCookies = (page) => {
            page.route('**/*', (route) => {
                if (route.request().url().includes('cookie')) {
                    return route.abort();
                }
                route.continue();
            });
        };

        blockCookies(chromePage);
        blockCookies(firefoxPage);

        await Promise.all([
            chromePage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 }),
            firefoxPage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 })
        ]);

        await Promise.all([
            chromePage.setViewportSize({ width: 1080, height: 2280 }),
            firefoxPage.setViewportSize({ width: 1080, height: 2280 })
        ]);

        try { // Botón de sesión
            await chromePage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 30000 });
            await firefoxPage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 30000 });
            await chromePage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 30000 });
            await firefoxPage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 30000 });
        } catch (error) {
            console.error(`Error al hacer clic en el botón de sesión: ${error.message}`);
            logToFile(`Error al hacer clic en el botón de sesión: ${error.message}`);
        }

        console.log('Navegando en Chrome');
        logToFile('Navegando en Chrome');
        console.log('Navegando en Firefox');
        logToFile('Navegando en Firefox');

        try { // Rellenar campos y enviar formulario. ESPERA A QUE LOS CAMPOS ESTÉN DISPONIBLES.
            await chromePage.waitForSelector('#gigya-login-form .gigya-input-text', { timeout: 30000 });
            await firefoxPage.waitForSelector('#gigya-login-form .gigya-input-text', { timeout: 30000 });
            await chromePage.waitForSelector('#gigya-login-form .gigya-input-password', { timeout: 30000 });
            await firefoxPage.waitForSelector('#gigya-login-form .gigya-input-password', { timeout: 30000 });
            await chromePage.waitForSelector('#gigya-login-form .gigya-input-submit', { timeout: 30000 });
            await firefoxPage.waitForSelector('#gigya-login-form .gigya-input-submit', { timeout: 30000 });

            await chromePage.fill('#gigya-login-form .gigya-input-text', email);
            await firefoxPage.fill('#gigya-login-form .gigya-input-text', email);
            console.log('Correo ingresado en Chrome');
            logToFile('Correo ingresado en Chrome');
            console.log('Correo ingresado en Firefox');
            logToFile('Correo ingresado en Firefox');

            await chromePage.fill('#gigya-login-form .gigya-input-password', password);
            await firefoxPage.fill('#gigya-login-form .gigya-input-password', password);
            console.log('Contraseña ingresada en Chrome');
            logToFile('Contraseña ingresada en Chrome');
            console.log('Contraseña ingresada en Firefox');
            logToFile('Contraseña ingresada en Firefox');

            // Hacer clic en el botón de submit
            await chromePage.click('#gigya-login-form .gigya-input-submit');
            await firefoxPage.click('#gigya-login-form .gigya-input-submit');
            console.log('Formulario enviado en Chrome');
            logToFile('Formulario enviado en Chrome');
            console.log('Formulario enviado en Firefox');
            logToFile('Formulario enviado en Firefox');
        } catch (error) {
            console.error(`Error al rellenar los campos o enviar el formulario: ${error.message}`);
            logToFile(`Error al rellenar los campos o enviar el formulario: ${error.message}`);
        }

        await chromePage.waitForLoadState('networkidle', { timeout: 1000 });
        await firefoxPage.waitForLoadState('networkidle', { timeout: 1000 });
        console.log('Navegación completada en Chrome');
        logToFile('Navegación completada en Chrome');
        console.log('Navegación completada en Firefox');
        logToFile('Navegación completada en Firefox');

        // Cerrar los navegadores
        await chromeBrowser.close();
        await firefoxBrowser.close();
    } catch (error) {
        console.error(`Error al ejecutar el script: ${error.message}`);
        logToFile(`Error al ejecutar el script: ${error.message}`);
    }
})();
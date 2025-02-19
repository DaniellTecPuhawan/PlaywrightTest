const { chromium } = require('playwright');
const fs = require('fs');

const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync('AENA_Travel_Web_Windows_session-log.txt', `[${timestamp}] ${message}\n`);
};

const email = 'daniell.tec@entelgy.com';
const password = 'Arbust0@EN@1';

(async () => {
    try {
        console.log('Iniciando AENA_Travel_Web_Windows');
        logToFile('Iniciando AENA_Travel_Web_Windows');

        const [chromeBrowser, edgeBrowser] = await Promise.all([
            chromium.launch({
                headless: true,
                slowMo: 100
            }),
            chromium.launch({
                channel: 'msedge',
                headless: true,
                slowMo: 100
            })
        ]);

        const chromeContext = await chromeBrowser.newContext();
        const edgeContext = await edgeBrowser.newContext();

        const [chromePage, edgePage] = await Promise.all([
            chromeContext.newPage(),
            edgeContext.newPage()
        ]);

        const checkResponseStatus = async (page, url) => {
            try {
                const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
                if (response.status() === 200) {
                    console.log(`Respuesta 200 OK para la URL: ${url}`);
                    logToFile(`Respuesta 200 OK para la URL: ${url}`);
                } else {
                    console.log(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
                    logToFile(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
                }
            } catch (error) {
                console.error(`Error al navegar a ${url}: ${error.message}`);
                logToFile(`Error al navegar a ${url}: ${error.message}`);
            }
        };

        await checkResponseStatus(chromePage, 'https://aenatravel.aena.es/es/');
        await checkResponseStatus(edgePage, 'https://aenatravel.aena.es/es/');

        await chromePage.setViewportSize({ width: 1920, height: 1080 });
        await edgePage.setViewportSize({ width: 1920, height: 1080 });

        const clickSessionButton = async (page) => {
            try {
                const sessionButton = page.locator('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');

                await sessionButton.waitFor({ state: 'visible', timeout: 15000 });
                await sessionButton.waitFor({ state: 'enabled', timeout: 15000 });

                if (await sessionButton.count() > 0) {
                    const boundingBoxBefore = await sessionButton.boundingBox();
                    console.log('Bounding box antes del clic:', boundingBoxBefore);
                    logToFile(`Bounding box antes del clic: ${JSON.stringify(boundingBoxBefore)}`);

                    await sessionButton.click();
                    console.log('Botón de sesión clickeado.');
                    logToFile('Botón de sesión clickeado.');

                    await page.waitForTimeout(500);

                    const boundingBoxAfter = await sessionButton.boundingBox();
                    console.log('Bounding box después del clic:', boundingBoxAfter);
                    logToFile(`Bounding box después del clic: ${JSON.stringify(boundingBoxAfter)}`);

                    if (boundingBoxAfter && (!boundingBoxBefore || boundingBoxAfter.x !== boundingBoxBefore.x || boundingBoxAfter.y !== boundingBoxBefore.y || boundingBoxAfter.width !== boundingBoxBefore.width || boundingBoxAfter.height !== boundingBoxBefore.height)) {
                        console.log('El bounding box ha cambiado.  El clic probablemente tuvo efecto.');
                        logToFile('El bounding box ha cambiado. El clic probablemente tuvo efecto.');
                    } else {
                        console.log('El bounding box no ha cambiado o no se pudo obtener después del clic.  Verifica el comportamiento del sitio.');
                        logToFile('El bounding box no ha cambiado o no se pudo obtener después del clic. Verifica el comportamiento del sitio.');
                        await page.screenshot({ path: `error_session_button_no_change_${new Date().getTime()}.png` });
                    }
                } else {
                    console.log('Botón de sesión no encontrado.');
                    logToFile('Botón de sesión no encontrado.');
                    await page.screenshot({ path: `error_session_button_not_found_${new Date().getTime()}.png` });
                }
            } catch (error) {
                console.error('Error al hacer clic en el botón de sesión:', error);
                logToFile(`Error al hacer clic en el botón de sesión: ${error.message}`);
                await page.screenshot({ path: `error_session_button_error_${new Date().getTime()}.png` });
            }
        };

        await clickSessionButton(chromePage);
        await clickSessionButton(edgePage);

        console.log('Navegando en Chrome y Edge');
        logToFile('Navegando en Chrome y Edge');

        const fillLoginForm = async (page) => {
            try {
                await page.waitForSelector('#gigya-login-form', { state: 'visible', timeout: 30000 });

                const emailFieldLocator = page.locator('#gigya-login-form .gigya-input-text');
                if (await emailFieldLocator.count() > 0) {
                    const emailField = await emailFieldLocator.first();
                    await emailField.waitFor({ state: 'enabled', timeout: 30000 });

                    await emailField.fill(email);
                    console.log('Correo ingresado.');
                    logToFile('Correo ingresado.');
                } else {
                    console.log('Campo de correo no encontrado.');
                    logToFile('Campo de correo no encontrado.');
                    await page.screenshot({ path: `error_email_field_not_found_${new Date().getTime()}.png` });
                    return;
                }

                const passwordFieldLocator = page.locator('#gigya-login-form .gigya-input-password');
                if (await passwordFieldLocator.count() > 0) {
                    const passwordField = await passwordFieldLocator.first();
                    await passwordField.waitFor({ state: 'enabled', timeout: 30000 });

                    await passwordField.fill(password);
                    console.log('Contraseña ingresada.');
                    logToFile('Contraseña ingresada.');
                } else {
                    console.log('Campo de contraseña no encontrado.');
                    logToFile('Campo de contraseña no encontrado.');
                    await page.screenshot({ path: `error_password_field_not_found_${new Date().getTime()}.png` });
                    return;
                }

            } catch (error) {
                console.error('Error al rellenar el formulario de login:', error);
                logToFile(`Error al rellenar el formulario de login: ${error.message}`);
                await page.screenshot({ path: `error_login_${new Date().getTime()}.png` });
            }
        };

        await fillLoginForm(chromePage);
        await fillLoginForm(edgePage);

        const submitLoginForm = async (page) => {
            try {
                const submitButton = await page.locator('#gigya-login-form .gigya-input-submit');
                await submitButton.waitFor({ state: 'visible', timeout: 10000 });
                if (await submitButton.isEnabled()) {
                    await submitButton.click();
                    console.log('Formulario de login enviado.');
                    logToFile('Formulario de login enviado.');
                } else {
                    console.log('El botón de submit está deshabilitado.');
                    logToFile('El botón de submit está deshabilitado.');
                    await page.screenshot({ path: `error_submit_button_disabled_${new Date().getTime()}.png` });
                }
            } catch (error) {
                console.error('Error al enviar el formulario de login:', error);
                logToFile(`Error al enviar el formulario de login: ${error.message}`);
                await page.screenshot({ path: `error_submit_${new Date().getTime()}.png` });
            }
        };

        await submitLoginForm(chromePage);
        await submitLoginForm(edgePage);

        await chromePage.waitForTimeout(3000);
        await edgePage.waitForTimeout(3000);

        console.log('Navegación completada en Chrome y Edge');
        logToFile('Navegación completada en Chrome y Edge');

        await new Promise(() => { });
        console.log('Automatización AENA_Travel_Web_Windows realizada');
const { chromium, firefox, devices } = require('playwright');
const fs = require('fs');

// Función para agregar registros al archivo log
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync('session-log.txt', `[${timestamp}] ${message}\n`);
};

// Datos de login como variables separadas
const email = 'daniell.tec@entelgy.com';
const password = 'Arbust0@EN@1';

(async () => {
  try {
    console.log('Iniciando navegadores...');

    // Lanzamos ambos navegadores (Chromium y Firefox) en paralelo
    const [chromeBrowser, firefoxBrowser] = await Promise.all([
      chromium.launch({
        headless: false,
        slowMo: 100
      }),
      firefox.launch({
        headless: false,
        slowMo: 100,
      })
    ]);

    // Usamos el emulador del Pixel 4 para Chrome
    const chromeContext = await chromeBrowser.newContext({
      ...devices['Pixel 4'],  // Emular un dispositivo Android
    });

    // Emular un dispositivo móvil Android en Firefox
    const firefoxContext = await firefoxBrowser.newContext({
      userAgent: devices['Pixel 4'].userAgent,
      viewport: devices['Pixel 4'].viewport,
    });

    const [chromePage, firefoxPage] = await Promise.all([
      chromeContext.newPage(),
      firefoxContext.newPage()
    ]);

    // Función para bloquear cookies
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

    // Interceptar la respuesta y verificar el código de estado
    const checkResponseStatus = async (page, url) => {
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url() === url && response.status() === 200),
        page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
      ]);
      if (response.status() === 200) {
        console.log(`✅ Respuesta 200 OK para la URL: ${url}`);
        logToFile(`Respuesta 200 OK para la URL: ${url}`);
      } else {
        console.log(`❌ Respuesta inesperada: ${response.status()} para la URL: ${url}`);
        logToFile(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
      }
    };

    // Verificar el estado de la respuesta para Chrome y Firefox
    await checkResponseStatus(chromePage, 'https://aenatravel.aena.es/es/');
    await checkResponseStatus(firefoxPage, 'https://aenatravel.aena.es/es/');

    // Establecer el tamaño del viewport (ajustado para Pixel 4)
    await chromePage.setViewportSize({ width: 1080, height: 2280 });
    await firefoxPage.setViewportSize({ width: 1080, height: 2280 });

    // Hacer clic en el botón de sesión
    await chromePage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 30000 });
    await firefoxPage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 30000 });
    await chromePage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');
    await firefoxPage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');

    // Después de hacer clic, logeamos que estamos navegando
    console.log(`Navegando en Chrome`);
    logToFile(`Navegando en Chrome`);
    console.log(`Navegando en Firefox`);
    logToFile(`Navegando en Firefox`);

    // Llenar los campos de login (correo y contraseña) y enviar el formulario
    await chromePage.fill('#gigya-login-form .gigya-input-text', email);
    await firefoxPage.fill('#gigya-login-form .gigya-input-text', email);
    console.log('✉️ Correo ingresado en Chrome');
    logToFile('Correo ingresado en Chrome');
    console.log('✉️ Correo ingresado en Firefox');
    logToFile('Correo ingresado en Firefox');

    await chromePage.fill('#gigya-login-form .gigya-input-password', password);
    await firefoxPage.fill('#gigya-login-form .gigya-input-password', password);
    console.log('🔑 Contraseña ingresada en Chrome');
    logToFile('Contraseña ingresada en Chrome');
    console.log('🔑 Contraseña ingresada en Firefox');
    logToFile('Contraseña ingresada en Firefox');

    await chromePage.waitForTimeout(5000);
    await firefoxPage.waitForTimeout(5000);

    // Hacer clic en el botón de submit
    const chromeSubmitButton = await chromePage.locator('#gigya-login-form .gigya-input-submit');
    const firefoxSubmitButton = await firefoxPage.locator('#gigya-login-form .gigya-input-submit');

    await chromeSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await firefoxSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await chromePage.waitForTimeout(3000);
    await firefoxPage.waitForTimeout(3000);

    if (await chromeSubmitButton.isEnabled()) {
      await chromeSubmitButton.click();
      console.log('✅ Formulario de login enviado en Chrome');
      logToFile('Formulario de login enviado en Chrome');
    } else {
      console.log('⚠️ El botón de submit está deshabilitado en Chrome.');
      logToFile('El botón de submit está deshabilitado en Chrome.');
    }

    if (await firefoxSubmitButton.isEnabled()) {
      await firefoxSubmitButton.click();
      console.log('✅ Formulario de login enviado en Firefox');
      logToFile('Formulario de login enviado en Firefox');
    } else {
      console.log('⚠️ El botón de submit está deshabilitado en Firefox.');
      logToFile('El botón de submit está deshabilitado en Firefox.');
    }

    await chromePage.waitForLoadState('networkidle', { timeout: 1000 });
    await firefoxPage.waitForLoadState('networkidle', { timeout: 1000 });
    console.log('🔄 Navegación completada en Chrome');
    logToFile('Navegación completada en Chrome');
    console.log('🔄 Navegación completada en Firefox');
    logToFile('Navegación completada en Firefox');

    // Mantener los navegadores abiertos
    await new Promise(() => {});
  } catch (error) {
    console.error(`Error al ejecutar el script: ${error.message}`);
    logToFile(`Error al ejecutar el script: ${error.message}`);
  }
})();
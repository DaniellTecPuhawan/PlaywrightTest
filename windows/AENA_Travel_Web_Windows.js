const { chromium, firefox } = require('playwright');
const fs = require('fs');

// Crea un log donde se registre la automatización
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync('AENA_Travel_Web_Windows_session-log.txt', `[${timestamp}] ${message}\n`);
};

// Datos guardados en variables
const email = 'daniell.tec@entelgy.com';
const password = 'Arbust0@EN@1';

(async () => {
  try {
    console.log('Iniciando AENA_Travel_Web_Windows');

    // Abre el script en los diferentes navegadores en modo gráfico (sin headless)
    const [chromeBrowser, firefoxBrowser, edgeBrowser] = await Promise.all([
      chromium.launch({
        headless: false,  // Modo gráfico (con interfaz visible)
        slowMo: 100
      }),

      firefox.launch({
        headless: false,  // Modo gráfico (con interfaz visible)
        slowMo: 100,
      }),

      chromium.launch({
        channel: 'msedge', // Para Microsoft Edge
        headless: false,  // Modo gráfico (con interfaz visible)
        slowMo: 100
      })
    ]);

    // Crear contexto para cada navegador (sin emulación de dispositivo móvil)
    const chromeContext = await chromeBrowser.newContext();
    const firefoxContext = await firefoxBrowser.newContext();
    const edgeContext = await edgeBrowser.newContext();

    const [chromePage, firefoxPage, edgePage] = await Promise.all([
      chromeContext.newPage(),
      firefoxContext.newPage(),
      edgeContext.newPage()
    ]);

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
        console.log(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
        logToFile(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
      }
    };

    // Verificar el estado de la respuesta para Chrome, Firefox y Edge
    await checkResponseStatus(chromePage, 'https://aenatravel.aena.es/es/');
    await checkResponseStatus(firefoxPage, 'https://aenatravel.aena.es/es/');
    await checkResponseStatus(edgePage, 'https://aenatravel.aena.es/es/');

    // Establecer el tamaño del viewport para una pantalla de escritorio (1920x1080)
    await chromePage.setViewportSize({ width: 1920, height: 1080 });
    await firefoxPage.setViewportSize({ width: 1920, height: 1080 });
    await edgePage.setViewportSize({ width: 1920, height: 1080 });

    // Hacer clic en el botón de sesión
    await chromePage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 15000 });
    await firefoxPage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 15000 });
    await edgePage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 15000 });

    await chromePage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');
    await firefoxPage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');
    await edgePage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');

    console.log('Navegando en Chrome');
    logToFile('Navegando en Chrome');
    console.log('Navegando en Firefox');
    logToFile('Navegando en Firefox');
    console.log('Navegando en Edge');
    logToFile('Navegando en Edge');

    // Llenar los campos de login (correo y contraseña) y enviar el formulario
    await chromePage.fill('#gigya-login-form .gigya-input-text', email);
    await firefoxPage.fill('#gigya-login-form .gigya-input-text', email);
    await edgePage.fill('#gigya-login-form .gigya-input-text', email);

    console.log('Correo ingresado en Chrome');
    logToFile('Correo ingresado en Chrome');
    console.log('Correo ingresado en Firefox');
    logToFile('Correo ingresado en Firefox');
    console.log('Correo ingresado en Edge');
    logToFile('Correo ingresado en Edge');

    await chromePage.fill('#gigya-login-form .gigya-input-password', password);
    await firefoxPage.fill('#gigya-login-form .gigya-input-password', password);
    await edgePage.fill('#gigya-login-form .gigya-input-password', password);

    console.log('Contraseña ingresada en Chrome');
    logToFile('Contraseña ingresada en Chrome');
    console.log('Contraseña ingresada en Firefox');
    logToFile('Contraseña ingresada en Firefox');
    console.log('Contraseña ingresada en Edge');
    logToFile('Contraseña ingresada en Edge');

    await chromePage.waitForTimeout(5000);
    await firefoxPage.waitForTimeout(5000);
    await edgePage.waitForTimeout(5000);

    // Hacer clic en el botón de submit
    const chromeSubmitButton = await chromePage.locator('#gigya-login-form .gigya-input-submit');
    const firefoxSubmitButton = await firefoxPage.locator('#gigya-login-form .gigya-input-submit');
    const edgeSubmitButton = await edgePage.locator('#gigya-login-form .gigya-input-submit');

    await chromeSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await firefoxSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await edgeSubmitButton.waitFor({ state: 'visible', timeout: 10000 });

    if (await chromeSubmitButton.isEnabled()) {
      await chromeSubmitButton.click();
      console.log('Formulario de login enviado en Chrome');
      logToFile('Formulario de login enviado en Chrome');
    } else {
      console.log('El botón de submit está deshabilitado en Chrome.');
      logToFile('El botón de submit está deshabilitado en Chrome.');
    }

    if (await firefoxSubmitButton.isEnabled()) {
      await firefoxSubmitButton.click();
      console.log('Formulario de login enviado en Firefox');
      logToFile('Formulario de login enviado en Firefox');
    } else {
      console.log('El botón de submit está deshabilitado en Firefox.');
      logToFile('El botón de submit está deshabilitado en Firefox.');
    }

    if (await edgeSubmitButton.isEnabled()) {
      await edgeSubmitButton.click();
      console.log('Formulario de login enviado en Edge');
      logToFile('Formulario de login enviado en Edge');
    } else {
      console.log('El botón de submit está deshabilitado en Edge.');
      logToFile('El botón de submit está deshabilitado en Edge.');
    }

    await chromePage.waitForTimeout(3000); // Espera 3 segundos
    await firefoxPage.waitForTimeout(3000);
    await edgePage.waitForTimeout(3000);

    console.log('Navegación completada en Chrome');
    logToFile('Navegación completada en Chrome');
    console.log('Navegación completada en Firefox');
    logToFile('Navegación completada en Firefox');
    console.log('Navegación completada en Edge');
    logToFile('Navegación completada en Edge');

    // Mantener los navegadores abiertos
    await new Promise(() => {});
    console.log('Automatización AENA_Travel_Web_Windows realizada');
  } catch (error) {
    console.error(`Error al ejecutar el script: ${error.message}`);
    logToFile(`Error al ejecutar el script: ${error.message}`);
  }
})();

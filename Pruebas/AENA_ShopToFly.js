const { chromium } = require('playwright'); // Solo utilizamos Chromium (Chrome) y Edge
const fs = require('fs');

// Crea un log donde se registre la automatización
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync('../logs/AENA_VIP_Windows_log.txt', `[${timestamp}] ${message}\n`);
};

// Datos guardados en variables
const email = 'daniell.tec@entelgy.com';
const password = 'Arbust0@01';

(async () => {
  try {
    console.log('Iniciando AENA_Travel_Web_Windows');

    // Abre el script solo en Chrome y Edge en modo gráfico (sin headless)
    const [chromeBrowser, edgeBrowser] = await Promise.all([
      chromium.launch({
        headless: false,  // Modo gráfico (con interfaz visible)
        slowMo: 100
      }),

      chromium.launch({
        channel: 'msedge', // Para Microsoft Edge
        headless: false,  // Modo gráfico (con interfaz visible)
        slowMo: 100
      })
    ]);

    // Crear contexto para cada navegador (sin emulación de dispositivo móvil)
    const chromeContext = await chromeBrowser.newContext();
    const edgeContext = await edgeBrowser.newContext();

    const [chromePage, edgePage] = await Promise.all([
      chromeContext.newPage(),
      edgeContext.newPage()
    ]);

    // Interceptar la respuesta y verificar el código de estado
    const checkResponseStatus = async (page, url) => {
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url() === url && response.status() === 200),
        page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
      ]);

      if (response.status() === 200) {
        console.log(`Respuesta 200 OK para la URL: ${url}`);
        logToFile(`Respuesta 200 OK para la URL: ${url}`);
      } else {
        console.log(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
        logToFile(`Respuesta inesperada: ${response.status()} para la URL: ${url}`);
      }
    };

    // Verificar el estado de la respuesta para Chrome y Edge
    await checkResponseStatus(chromePage, 'https://shoptofly.aena.es/shop/es/');
    await checkResponseStatus(edgePage, 'https://shoptofly.aena.es/shop/es/');

    // Establecer el tamaño del viewport para una pantalla de escritorio (1920x1080)
    await chromePage.setViewportSize({ width: 1920, height: 1080 });
    await edgePage.setViewportSize({ width: 1920, height: 1080 });

    // Hacer clic en el botón de sesión
    await chromePage.waitForSelector('body > main > header > div.navigation.navigation--top > div > div > div.col-xs-8.col-sm-8.col-md-8 > div > ul > li.nav__button-user.nav__button-user--session > a', { timeout: 15000 });
    await edgePage.waitForSelector('body > main > header > div.navigation.navigation--top > div > div > div.col-xs-8.col-sm-8.col-md-8 > div > ul > li.nav__button-user.nav__button-user--session > a', { timeout: 15000 });

    await chromePage.click('body > main > header > div.navigation.navigation--top > div > div > div.col-xs-8.col-sm-8.col-md-8 > div > ul > li.nav__button-user.nav__button-user--session > a');
    await edgePage.click('body > main > header > div.navigation.navigation--top > div > div > div.col-xs-8.col-sm-8.col-md-8 > div > ul > li.nav__button-user.nav__button-user--session > a');

    await chromePage.screenshot({ path: 'screenshot_formulario1.png' });
    await edgePage.screenshot({ path: 'screenshot_formulario2.png' });

    console.log('Navegando en Chrome');
    logToFile('Navegando en Chrome');
    console.log('Navegando en Edge');
    logToFile('Navegando en Edge');

   



    // Llenar los campos de login (correo y contraseña) y enviar el formulario
    await chromePage.fill('#gigya-login-form .gigya-input-text', email);
    await edgePage.fill('#gigya-login-form .gigya-input-text', email);

    console.log('Correo ingresado en Chrome');
    logToFile('Correo ingresado en Chrome');
    console.log('Correo ingresado en Edge');
    logToFile('Correo ingresado en Edge');

    await chromePage.fill('#gigya-login-form .gigya-input-password', password);
    await edgePage.fill('#gigya-login-form .gigya-input-password', password);

    console.log('Contraseña ingresada en Chrome');
    logToFile('Contraseña ingresada en Chrome');
    console.log('Contraseña ingresada en Edge');
    logToFile('Contraseña ingresada en Edge');

    await chromePage.waitForTimeout(5000);
    await edgePage.waitForTimeout(5000);


    // Hacer clic en el botón de submit
    const chromeSubmitButton = await chromePage.locator('#gigya-login-form .gigya-input-submit');
    const edgeSubmitButton = await edgePage.locator('#gigya-login-form .gigya-input-submit');

    await chromeSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await edgeSubmitButton.waitFor({ state: 'visible', timeout: 10000 });

    if (await chromeSubmitButton.isEnabled()) {
      await chromeSubmitButton.click();
      console.log('Formulario de login enviado en Chrome');
      logToFile('Formulario de login enviado en Chrome');
    } else {
      console.log('El botón de submit está deshabilitado en Chrome.');
      logToFile('El botón de submit está deshabilitado en Chrome.');
    }

    if (await edgeSubmitButton.isEnabled()) {
      await edgeSubmitButton.click();
      console.log('Formulario de login enviado en Edge');
      logToFile('Formulario de login enviado en Edge');
    } else {
      console.log('El botón de submit está deshabilitado en Edge.');
      logToFile('El botón de submit está deshabilitado en Edge.');
    }

    await chromePage.waitForTimeout(3000);
    await edgePage.waitForTimeout(3000);


    await chromePage.check('#gigya-checkbox-113358906645430700');
    await edgePage.check('#gigya-checkbox-113358906645430700');
    
    
    await chromePage.click('#gigya-profile-form > div:nth-child(3) > div.gigya-composite-control.gigya-composite-control-submit.is-centered.is-aena-green > input');

    await edgePage.click('#gigya-profile-form > div:nth-child(3) > div.gigya-composite-control.gigya-composite-control-submit.is-centered.is-aena-green > input');

    console.log('Navegación completada en Chrome');
    logToFile('Navegación completada en Chrome');
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

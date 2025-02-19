const { chromium } = require('playwright'); // Solo utilizamos Chromium (Chrome)
const fs = require('fs');

// Crea un log donde se registre la automatización
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync('AENA_Travel_Web_Windows_Headless_session-log.txt', `[${timestamp}] ${message}\n`);
};

// Datos guardados en variables
const email = 'daniell.tec@entelgy.com';
const password = 'Arbust0@EN@1';

(async () => {
  try {
    console.log('Iniciando AENA_Travel_Web_Windows');

    // Abre el navegador en modo headless (sin interfaz visible)
    const chromeBrowser = await chromium.launch({
      headless: true,  // Modo headless (sin interfaz visible)
      slowMo: 100
    });

    // Crear contexto para el navegador (sin emulación de dispositivo móvil)
    const chromeContext = await chromeBrowser.newContext();
    const chromePage = await chromeContext.newPage();

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

    // Verificar el estado de la respuesta para Chrome
    await checkResponseStatus(chromePage, 'https://aenatravel.aena.es/es/');

    // Establecer el tamaño del viewport para una pantalla de escritorio (1920x1080)
    await chromePage.setViewportSize({ width: 1920, height: 1080 });

    // Hacer clic en el botón de sesión
    await chromePage.waitForSelector('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session', { timeout: 15000 });
    await chromePage.click('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session');

    // Tomar captura de pantalla
    await chromePage.screenshot({ path: 'screenshot_formulario.png' });

    console.log('Navegando en Chrome');
    logToFile('Navegando en Chrome');

    // Llenar los campos de login (correo y contraseña) y enviar el formulario
    await chromePage.fill('#gigya-login-form .gigya-input-text', email);
    console.log('Correo ingresado en Chrome');
    logToFile('Correo ingresado en Chrome');

    await chromePage.fill('#gigya-login-form .gigya-input-password', password);
    console.log('Contraseña ingresada en Chrome');
    logToFile('Contraseña ingresada en Chrome');

    await chromePage.waitForTimeout(5000);

    // Hacer clic en el botón de submit
    const chromeSubmitButton = await chromePage.locator('#gigya-login-form .gigya-input-submit');
    await chromeSubmitButton.waitFor({ state: 'visible', timeout: 10000 });

    if (await chromeSubmitButton.isEnabled()) {
      await chromeSubmitButton.click();
      console.log('Formulario de login enviado en Chrome');
      logToFile('Formulario de login enviado en Chrome');
    } else {
      console.log('El botón de submit está deshabilitado en Chrome.');
      logToFile('El botón de submit está deshabilitado en Chrome.');
    }

    await chromePage.waitForTimeout(3000);

    console.log('Navegación completada en Chrome');
    logToFile('Navegación completada en Chrome');

    // Cerrar el navegador
    await chromeBrowser.close();

    console.log('Automatización AENA_Travel_Web_Windows realizada');
  } catch (error) {
    console.error(`Error al ejecutar el script: ${error.message}`);
    logToFile(`Error al ejecutar el script: ${error.message}`);
  }
})();

const { Builder, By, until } = require('selenium-webdriver');
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

    // Lanzamos ambos navegadores (Chrome y Firefox) en paralelo
    const chromeDriver = new Builder().forBrowser('chrome').build();
    const firefoxDriver = new Builder().forBrowser('firefox').build();

    // Navegar a la página de inicio
    const url = 'https://aenatravel.aena.es/es/';
    await Promise.all([
      chromeDriver.get(url),
      firefoxDriver.get(url)
    ]);

    // Función para bloquear cookies - no es tan sencillo en Selenium como en Playwright
    // Pero se puede intentar manejar mediante interceptación o configuraciones de cookies
    // Aunque Selenium no tiene un método directo como Playwright, podríamos bloquear cookies mediante extensiones del navegador o configuraciones de cookies

    // Interceptar la respuesta y verificar el código de estado
    const checkResponseStatus = async (driver, url) => {
      await driver.get(url);
      const status = await driver.executeScript('return document.readyState');
      if (status === 'complete') {
        console.log(`✅ Respuesta 200 OK para la URL: ${url}`);
        logToFile(`Respuesta 200 OK para la URL: ${url}`);
      } else {
        console.log(`❌ Respuesta inesperada para la URL: ${url}`);
        logToFile(`Respuesta inesperada para la URL: ${url}`);
      }
    };

    // Verificar el estado de la respuesta para Chrome y Firefox
    await Promise.all([
      checkResponseStatus(chromeDriver, url),
      checkResponseStatus(firefoxDriver, url),
    ]);

    // Establecer el tamaño del viewport (ajustado para Pixel 4)
    await chromeDriver.manage().window().setRect({ width: 1080, height: 2280 });
    await firefoxDriver.manage().window().setRect({ width: 1080, height: 2280 });

    // Hacer clic en el botón de sesión
    const sessionButtonChrome = await chromeDriver.wait(until.elementLocated(By.css('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session')), 30000);
    const sessionButtonFirefox = await firefoxDriver.wait(until.elementLocated(By.css('.col-xs-5 > .nav__right > .nav__links > .nav__button-user > .c-button--session')), 30000);
    
    await sessionButtonChrome.click();
    await sessionButtonFirefox.click();

    // Después de hacer clic, logeamos que estamos navegando
    console.log(`Navegando en Chrome`);
    logToFile(`Navegando en Chrome`);
    console.log(`Navegando en Firefox`);
    logToFile(`Navegando en Firefox`);

    // Llenar los campos de login (correo y contraseña)
    const emailFieldChrome = await chromeDriver.findElement(By.css('#gigya-login-form .gigya-input-text'));
    const emailFieldFirefox = await firefoxDriver.findElement(By.css('#gigya-login-form .gigya-input-text'));
    
    await emailFieldChrome.sendKeys(email);
    await emailFieldFirefox.sendKeys(email);

    console.log('✉️ Correo ingresado en Chrome');
    logToFile('Correo ingresado en Chrome');
    console.log('✉️ Correo ingresado en Firefox');
    logToFile('Correo ingresado en Firefox');

    const passwordFieldChrome = await chromeDriver.findElement(By.css('#gigya-login-form .gigya-input-password'));
    const passwordFieldFirefox = await firefoxDriver.findElement(By.css('#gigya-login-form .gigya-input-password'));

    await passwordFieldChrome.sendKeys(password);
    await passwordFieldFirefox.sendKeys(password);

    console.log('🔑 Contraseña ingresada en Chrome');
    logToFile('Contraseña ingresada en Chrome');
    console.log('🔑 Contraseña ingresada en Firefox');
    logToFile('Contraseña ingresada en Firefox');

    // Esperar un poco
    await Promise.all([
      chromeDriver.sleep(5000),
      firefoxDriver.sleep(5000),
    ]);

    // Hacer clic en el botón de submit
    const submitButtonChrome = await chromeDriver.findElement(By.css('#gigya-login-form .gigya-input-submit'));
    const submitButtonFirefox = await firefoxDriver.findElement(By.css('#gigya-login-form .gigya-input-submit'));

    if (await submitButtonChrome.isEnabled()) {
      await submitButtonChrome.click();
      console.log('✅ Formulario de login enviado en Chrome');
      logToFile('Formulario de login enviado en Chrome');
    } else {
      console.log('⚠️ El botón de submit está deshabilitado en Chrome.');
      logToFile('El botón de submit está deshabilitado en Chrome.');
    }

    if (await submitButtonFirefox.isEnabled()) {
      await submitButtonFirefox.click();
      console.log('✅ Formulario de login enviado en Firefox');
      logToFile('Formulario de login enviado en Firefox');
    } else {
      console.log('⚠️ El botón de submit está deshabilitado en Firefox.');
      logToFile('El botón de submit está deshabilitado en Firefox.');
    }

    await Promise.all([
      chromeDriver.wait(until.urlContains('https://aenatravel.aena.es/es/'), 10000),
      firefoxDriver.wait(until.urlContains('https://aenatravel.aena.es/es/'), 10000)
    ]);

    console.log('🔄 Navegación completada en Chrome');
    logToFile('Navegación completada en Chrome');
    console.log('🔄 Navegación completada en Firefox');
    logToFile('Navegación completada en Firefox');

    // Mantener los navegadores abiertos
    await new Promise(() => {});
  } catch (error) {
    console.error(`Error al ejecutar el script: ${error.message}`);
    logToFile(`Error al ejecutar el script: ${error.message}`);
  } finally {
    // Cerramos los navegadores
    await chromeDriver.quit();
    await firefoxDriver.quit();
  }
})();

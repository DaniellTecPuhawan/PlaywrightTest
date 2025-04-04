const { chromium } = require('playwright');
const fs = require('fs');

const createTimestampFolder = () => {
  const timestamp = new Date();
  const hour = timestamp.getHours().toString().padStart(2, '0');
  const minute = timestamp.getMinutes().toString().padStart(2, '0');
  const second = timestamp.getSeconds().toString().padStart(2, '0');
  const day = timestamp.getDate().toString().padStart(2, '0');
  const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
  const year = timestamp.getFullYear();

  const folderName = `${hour}-${minute}-${second}-${day}-${month}-${year}`;
  const folderPath = `../screenshots/AENA_Club/${folderName}`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
};

const logToFile = (message) => {
  const timestamp = new Date();
  const formattedDate = `${timestamp.getDate().toString().padStart(2, '0')}/${(timestamp.getMonth() + 1).toString().padStart(2, '0')}/${timestamp.getFullYear()}`;
  const formattedTime = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
  const logMessage = `[${formattedDate} - ${formattedTime}] ${message}\n`;
  fs.appendFileSync('../logs/AENA_Club_log.txt', logMessage);
};

const loadUsers = () => {
  const rawData = fs.readFileSync('../utils/users.json');
  const users = JSON.parse(rawData);
  return users.slice(0, 2);
};

const [user1, user2] = loadUsers();

const checkResponseStatus = async (page, url) => {
  const response = await page.goto(url);
  if (response.status() !== 200) {
    console.error(`Error: La página no se cargó correctamente. Código de estado: ${response.status()}`);
    logToFile(`Error: La página no se cargó correctamente. Código de estado: ${response.status()}`);
    throw new Error(`La página no se cargó correctamente. Código de estado: ${response.status()}`);
  } else {
    console.log(`Página cargada con éxito: ${url}`);
    logToFile(`Página cargada con éxito: ${url}`);
  }
};

// DEFINICIÓN DE runTest QUE FALTABA (ÚNICO CAMBIO REALIZADO)
const runTest = async (user) => {
  let chromeBrowser, edgeBrowser, chromePage, edgePage;
  const folderPath = createTimestampFolder();

  try {
    console.log('Iniciando login AENA_Club');

    [chromeBrowser, edgeBrowser] = await Promise.all([
      chromium.launch({ headless: false, slowMo: 100 }),
      chromium.launch({ channel: 'msedge', headless: false, slowMo: 100 })
    ]);

    const chromeContext = await chromeBrowser.newContext();
    const edgeContext = await edgeBrowser.newContext();

    [chromePage, edgePage] = await Promise.all([
      chromeContext.newPage(),
      edgeContext.newPage()
    ]);

    await checkResponseStatus(chromePage, 'https://clubcliente.aena.es/AenaClub/es/');
    await checkResponseStatus(edgePage, 'https://clubcliente.aena.es/AenaClub/es/');

    await chromePage.setViewportSize({ width: 1920, height: 1080 });
    await edgePage.setViewportSize({ width: 1920, height: 1080 });

    await chromePage.waitForSelector('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header__top__nav__links__item--user.header__top__nav__links__item--session > a', { timeout: 15000 });
    await edgePage.waitForSelector('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header__top__nav__links__item--user.header__top__nav__links__item--session > a', { timeout: 15000 });

    await chromePage.click('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header__top__nav__links__item--user.header__top__nav__links__item--session > a');
    await edgePage.click('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header__top__nav__links__item--user.header__top__nav__links__item--session > a');

    await chromePage.waitForTimeout(3000);
    await edgePage.waitForTimeout(3000);

    await chromePage.screenshot({ path: `${folderPath}/screenshot_formulario_chrome.png` });
    await edgePage.screenshot({ path: `${folderPath}/screenshot_formulario_edge.png` });

    console.log('Navegando en Chrome');
    logToFile('Navegando en Chrome');
    console.log('Navegando en Edge');
    logToFile('Navegando en Edge');

    await chromePage.fill('#gigya-login-form .gigya-input-text', user.email);
    await edgePage.fill('#gigya-login-form .gigya-input-text', user.email);

    console.log('Correo ingresado en Chrome');
    logToFile('Correo ingresado en Chrome');
    console.log('Correo ingresado en Edge');
    logToFile('Correo ingresado en Edge');

    await chromePage.fill('#gigya-login-form .gigya-input-password', user.password);
    await edgePage.fill('#gigya-login-form .gigya-input-password', user.password);

    console.log('Contraseña ingresada en Chrome');
    logToFile('Contraseña ingresada en Chrome');
    console.log('Contraseña ingresada en Edge');
    logToFile('Contraseña ingresada en Edge');

    await chromePage.screenshot({ path: `${folderPath}/screenshot_formulario_rellenado_chrome.png` });
    await edgePage.screenshot({ path: `${folderPath}/screenshot_formulario_rellenado_edge.png` });

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

    await chromePage.waitForSelector('body > main > header > div > div > div.header__top__nav > div > div:nth-child(2) > a', { timeout: 15000 });
    await edgePage.waitForSelector('body > main > header > div > div > div.header__top__nav > div > div:nth-child(2) > a', { timeout: 15000 });

    await chromePage.click('body > main > header > div > div > div.header__top__nav > div > div:nth-child(2) > a');
    await edgePage.click('body > main > header > div > div > div.header__top__nav > div > div:nth-child(2) > a');

    console.log('Se accede al menú del usuario');
    logToFile('Se accede al menú del usuario');

    await chromePage.waitForSelector('body > main > div.main__inner-wrapper > div.color-bg > div:nth-child(3) > div > div:nth-child(1) > div > div.micuenta-pral__title > div.micuenta-pral__title__box > div.micuenta-pral__title__box__title > div', { timeout: 15000 });
    await edgePage.waitForSelector('body > main > div.main__inner-wrapper > div.color-bg > div:nth-child(3) > div > div:nth-child(1) > div > div.micuenta-pral__title > div.micuenta-pral__title__box > div.micuenta-pral__title__box__title > div', { timeout: 15000 });

    const chromeText = await chromePage.textContent('body > main > div.main__inner-wrapper > div.color-bg > div:nth-child(3) > div > div:nth-child(1) > div > div.micuenta-pral__title > div.micuenta-pral__title__box > div.micuenta-pral__title__box__title > div');
    const edgeText = await edgePage.textContent('body > main > div.main__inner-wrapper > div.color-bg > div:nth-child(3) > div > div:nth-child(1) > div > div.micuenta-pral__title > div.micuenta-pral__title__box > div.micuenta-pral__title__box__title > div');

    if (chromeText?.includes('Hola')) {
      await chromePage.screenshot({ path: `${folderPath}/screenshot_sesion_iniciada_chrome.png` });
      console.log('Sesión Iniciada con éxito');
      logToFile('Login Válido');
    } else {
      await chromePage.screenshot({ path: `${folderPath}/screenshot_sesion_erronea_chrome.png` });
      console.log('Sesión No Iniciada, inténtelo denuevo');
      logToFile('Login Inválido');
    }

    if (edgeText?.includes('Hola')) {
      await edgePage.screenshot({ path: `${folderPath}/screenshot_sesion_iniciada_edge.png` });
      console.log('Sesión Iniciada con éxito');
      logToFile('Login Válido');
    } else {
      await edgePage.screenshot({ path: `${folderPath}/screenshot_sesion_erronea_edge.png` });
      console.log('Sesión No Iniciada, inténtelo denuevo');
      logToFile('Login Inválido');
    }

    await chromePage.waitForSelector('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header-logout', { timeout: 15000 });
    await edgePage.waitForSelector('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header-logout', { timeout: 15000 });

    await chromePage.click('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header-logout');
    await edgePage.click('body > main > header > div > div > div.header__top__nav > div > div.header__top__nav__links__item.header-logout');

    await chromePage.waitForTimeout(3000);
    await edgePage.waitForTimeout(3000);

    console.log('Login completada en Chrome');
    logToFile('Login completada en Chrome\t\t\t');
    console.log('Login completada en Edge');
    logToFile('Login completada en Edge\t\t\t');

    await chromeBrowser.close();
    await edgeBrowser.close();

    console.log('Login en AENA Club realizada');
  } catch (error) {
    console.error(`Error al ejecutar el script: ${error.message}`);
    logToFile(`Error al ejecutar el script: ${error.message}`);
    if (chromeBrowser) await chromeBrowser.close();
    if (edgeBrowser) await edgeBrowser.close();
  }
};

// BLOQUE FINAL QUE YA TENÍAS (SIN MODIFICACIONES)
(async () => {
  for (const user of [user1, user2]) {
    await runTest(user);
  }
  console.log('Todos los tests completados');
  logToFile('Todos los tests completados');
})();
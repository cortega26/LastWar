const assert = require('assert');
const path = require('path');
const httpServer = require('http-server');
const { chromium } = require('playwright');

(async () => {
  const server = httpServer.createServer({ root: path.join(__dirname, '..') });
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.server.address().port;
  const baseUrl = `http://localhost:${port}/`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(baseUrl + 'pages/guides.html');
  await page.waitForSelector('.nav-container a', { state: 'attached' });
  const desktopHeight = await page.evaluate(() => document.querySelector('.nav-container').offsetHeight);
  assert(desktopHeight > 0, 'desktop navbar should be visible');

  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForSelector('.nav-container a', { state: 'attached' });
  const mobileHeight = await page.evaluate(() => document.querySelector('.nav-container').offsetHeight);
  assert(mobileHeight > 0, 'mobile navbar should be visible');

  await browser.close();
  server.close();
  console.log('Navbar Playwright E2E test passed');
})();

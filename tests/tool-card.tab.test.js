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
  const page = await browser.newPage();
  await page.goto(baseUrl + 'calculators/');
  await page.waitForSelector('.archive__item a', { state: 'attached' });

  const links = await page.$$eval('.archive__item a', els => els.map(e => e.getAttribute('href')));
  const hrefs = [
    '/calculators/protein-farm/',
    '/calculators/t10-research/',
    '/calculators/team-builder/'
  ];
  assert.deepStrictEqual(links.slice(0, hrefs.length), hrefs);

  await browser.close();
  server.close();
  console.log('Calculators listing test passed');
})();

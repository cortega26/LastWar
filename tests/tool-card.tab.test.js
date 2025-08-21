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
  await page.goto(baseUrl);
  await page.waitForSelector('.tool-grid a.tool-card', { state: 'attached' });

  // Ensure no tabindex attributes
  const hasTabindex = await page.$$eval('.tool-grid a.tool-card', els =>
    els.some(el => el.hasAttribute('tabindex'))
  );
  assert.strictEqual(hasTabindex, false, 'tool cards should not have tabindex');

  await page.focus('body');

  async function focusNextCard(expectedHref) {
    for (let i = 0; i < 10; i++) {
      const activeHref = await page.evaluate(() => document.activeElement.getAttribute('href'));
      if (activeHref === expectedHref) return;
      await page.keyboard.press('Tab');
    }
    const activeHrefFinal = await page.evaluate(() => document.activeElement.getAttribute('href'));
    assert.strictEqual(activeHrefFinal, expectedHref, `expected focus on ${expectedHref}`);
  }

  const hrefs = [
    '/pages/protein-farm-calculator.html',
    '/pages/T10-calculator.html',
    '/pages/team-builder.html'
  ];

  for (const href of hrefs) {
    await focusNextCard(href);
    // Move to next element for subsequent call
    await page.keyboard.press('Tab');
  }

  // Shift+Tab should move focus back to previous card
  await page.keyboard.press('Shift+Tab');
  const backHref = await page.evaluate(() => document.activeElement.getAttribute('href'));
  assert.strictEqual(backHref, '/pages/team-builder.html');
  await page.keyboard.press('Shift+Tab');
  const secondHref = await page.evaluate(() => document.activeElement.getAttribute('href'));
  assert.strictEqual(secondHref, '/pages/T10-calculator.html');

  await browser.close();
  server.close();
  console.log('Tool card keyboard navigation test passed');
})();

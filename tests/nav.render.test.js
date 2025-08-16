const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;

global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

global.fetch = (url) => {
  const filePath = path.join(__dirname, '..', url.replace(/^\//, ''));
  const data = fs.readFileSync(filePath, 'utf8');
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve(data),
    json: () => Promise.resolve(JSON.parse(data))
  });
};

const { loadPartials } = require('../assets/js/script.js');

function waitForNav() {
  return new Promise(resolve => {
    const check = () => {
      const nav = window.document.querySelector('.nav-container');
      if (nav && nav.querySelectorAll('a').length) {
        resolve(nav);
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
}

(async () => {
  loadPartials();
  const nav = await waitForNav();
  const height = nav.innerHTML.trim().length;
  assert(height > 0, 'nav container should have height > 0');
  assert(nav.querySelectorAll('a').length > 0, 'nav should contain links');
  console.log('Navbar render test passed');
})();

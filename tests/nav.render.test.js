const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { Liquid } = require('liquidjs');
const yaml = require('js-yaml');

const html = fs.readFileSync(path.join(__dirname, '../pages/guides.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/pages/guides.html', pretendToBeVisual: true });
const { window } = dom;

global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

const engine = new Liquid();
const navData = yaml.load(fs.readFileSync(path.join(__dirname, '../_data/navigation.yml'), 'utf8'));

global.fetch = (url) => {
  const rel = url.replace(/^\//, '');
  const abs = path.join(__dirname, '..', rel);
  let data = fs.readFileSync(abs, 'utf8');
  if (rel === 'partials/nav.html') {
    data = engine.parseAndRenderSync(data, { site: { data: { navigation: navData } } });
  }
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

const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { Liquid } = require('liquidjs');
const yaml = require('js-yaml');

const engine = new Liquid();
const tpl = fs.readFileSync(path.join(__dirname, '../partials/nav.html'), 'utf8');
const navData = yaml.load(fs.readFileSync(path.join(__dirname, '../_data/navigation.yml'), 'utf8'));
const rendered = engine.parseAndRenderSync(tpl, { site: { data: { navigation: navData } } });

const dom = new JSDOM(`<div class="nav-container">${rendered}</div>`, { url: 'http://example.com/', pretendToBeVisual: true });
const window = dom.window;

global.window = window;
global.document = window.document;

const { initNavigationInteractions } = require('../assets/js/script.js');
initNavigationInteractions();

const tools = window.document.querySelector('.nav-item.dropdown');
const toggle = tools.querySelector('.submenu-toggle');

// Hover test
tools.dispatchEvent(new window.Event('mouseover', { bubbles: true }));
assert.strictEqual(toggle.getAttribute('aria-expanded'), 'true');
tools.dispatchEvent(new window.Event('mouseout', { bubbles: true }));
assert.strictEqual(toggle.getAttribute('aria-expanded'), 'false');

// Mobile click test
window.innerWidth = 500;
toggle.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
assert(tools.classList.contains('active') && tools.querySelector('.dropdown-menu').classList.contains('show'));

// Keyboard navigation
window.innerWidth = 1200;
const link = tools.querySelector('.nav-link');
link.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
assert(window.document.activeElement.textContent.trim().startsWith('Protein Farm'));

console.log('Navbar E2E test passed');

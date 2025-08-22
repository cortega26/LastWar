const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const navHtml = fs.readFileSync(path.join(__dirname, '../partials/nav.html'), 'utf8');

const dom = new JSDOM(`<div class="nav-container">${navHtml}</div>`, { url: 'http://example.com/', pretendToBeVisual: true });
const window = dom.window;

global.window = window;
global.document = window.document;

const { initNavigationInteractions } = require('../assets/js/script.js');
initNavigationInteractions();

const tools = window.document.querySelector('.nav-item.dropdown');

// Hover test
tools.dispatchEvent(new window.Event('mouseover', { bubbles: true }));
assert.strictEqual(tools.querySelector('.nav-link').getAttribute('aria-expanded'), 'true');
tools.dispatchEvent(new window.Event('mouseout', { bubbles: true }));
assert.strictEqual(tools.querySelector('.nav-link').getAttribute('aria-expanded'), 'false');

// Mobile click test
window.innerWidth = 500;
const link = tools.querySelector('.nav-link');
link.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
assert(tools.classList.contains('active') && tools.querySelector('.dropdown-menu').classList.contains('show'));

// Keyboard navigation
window.innerWidth = 1200;
link.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
assert(window.document.activeElement.textContent.trim().startsWith('Protein Farm'));

console.log('Navbar E2E test passed');

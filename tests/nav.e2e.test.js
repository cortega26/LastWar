const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const navHtml = fs.readFileSync(path.join(__dirname, '../partials/nav.html'), 'utf8');

const dom = new JSDOM(`<div class="nav-container">${navHtml}</div>`, { url: 'http://example.com/', pretendToBeVisual: true });
const window = dom.window;
const $ = require('jquery')(window);

global.window = window;
global.document = window.document;
global.$ = $;

const { initNavigationInteractions } = require('../assets/js/script.js');
initNavigationInteractions();

const tools = $('.nav-item.dropdown').first();

// Hover test
tools.trigger('mouseenter');
assert.strictEqual(tools.find('> .nav-link').attr('aria-expanded'), 'true');
tools.trigger('mouseleave');
assert.strictEqual(tools.find('> .nav-link').attr('aria-expanded'), 'false');

// Mobile click test
window.innerWidth = 500;
const link = tools.find('> .nav-link');
link.trigger('click');
assert(tools.hasClass('active') && tools.find('.dropdown-menu').hasClass('show'));

// Keyboard navigation
window.innerWidth = 1200;
tools.find('> .nav-link').trigger($.Event('keydown', { key: 'ArrowDown' }));
assert(document.activeElement.textContent.trim().startsWith('Protein Farm'));

console.log('Navbar E2E test passed');

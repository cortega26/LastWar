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

const seasons = $('.nav-item.dropdown').first();

// Hover test
seasons.trigger('mouseenter');
assert.strictEqual(seasons.find('> .nav-link').attr('aria-expanded'), 'true');
seasons.trigger('mouseleave');
assert.strictEqual(seasons.find('> .nav-link').attr('aria-expanded'), 'false');

// Mobile click test
window.innerWidth = 500;
const link = seasons.find('> .nav-link');
link.trigger('click');
assert(seasons.hasClass('active') && seasons.find('.dropdown-menu').hasClass('show'));

// Keyboard navigation
window.innerWidth = 1200;
seasons.find('> .nav-link').trigger($.Event('keydown', { key: 'ArrowDown' }));
assert(document.activeElement.textContent.trim().startsWith('Season 4'));

console.log('Navbar E2E test passed');

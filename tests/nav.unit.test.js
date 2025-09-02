const assert = require('assert');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`
<ul id="navMenu">
  <li class="nav-item"><a class="nav-link" href="/foo.html">Foo</a></li>
  <li class="nav-item"><a class="nav-link" href="/bar.html">Bar</a></li>
</ul>
`, { url: 'http://example.com/bar.html' });

const window = dom.window;

global.window = window;
global.document = window.document;

const { markCurrentNav } = require('../my-site/assets/js/script.js');

markCurrentNav();

const current = window.document.querySelector('[aria-current="page"]');
assert(current && current.textContent.trim() === 'Bar');

console.log('Navbar unit test passed');

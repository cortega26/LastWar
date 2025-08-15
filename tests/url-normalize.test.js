const assert = require('assert');

const resolved = new URL('/assets/css/styles.css', 'https://tooltician.com//').href;
assert.strictEqual(resolved, 'https://tooltician.com/assets/css/styles.css');

console.log('URL normalization test passed');

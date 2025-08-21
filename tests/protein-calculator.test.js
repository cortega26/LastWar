const assert = require('assert');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html><body>
<form id="proteinFarmForm">
  <div class="target-section"></div>
  <input id="targetAmount" />
  <select id="farm1"></select>
  <select id="farm2"><option value="0">Not Built</option></select>
  <select id="farm3"><option value="0">Not Built</option></select>
  <select id="farm4"><option value="0">Not Built</option></select>
  <select id="farm5"><option value="0">Not Built</option></select>
  <div id="results-content"></div>
  <button type="submit" id="calculateBtn"></button>
</form>
<select id="vipBonus"><option value="10">VIP</option></select>
<input id="allianceTechBonus" value="0" />
<input id="heroBonus" value="0" />
<input id="equipmentBonus" value="0" />
<input id="eventBonus" value="0" />
<input id="decorationBonus" value="0" />
</body>`, { url: 'http://localhost' });

global.window = dom.window;
global.document = dom.window.document;

// Stub analytics to avoid errors
window.lastWarAnalytics = { trackEvent: () => {} };

const LastWarCalculators = require('../assets/js/calculators.js');

// Prevent automatic initialization side effects
LastWarCalculators.prototype.init = function() {};
LastWarCalculators.prototype.addProteinAdvancedOptions = function() {};
LastWarCalculators.prototype.addProteinOptimizationSuggestions = function() {};

const calc = new LastWarCalculators();
calc.initEnhancedProteinCalculator();

document.getElementById('farm1').value = '1';
document.getElementById('targetAmount').value = '1000';
document.getElementById('vipBonus').value = '10';

document.getElementById('proteinFarmForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

const resultText = document.getElementById('results-content').textContent.trim();
assert(resultText.includes('1h 15m'), `Expected time to include "1h 15m" but got "${resultText}"`);

console.log('Protein calculator regression test passed');

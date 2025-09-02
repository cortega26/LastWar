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

async function run() {
  const { initProteinCalculator } = await import('../my-site/assets/js/protein-calculator.js');

  initProteinCalculator();

  const farm1 = document.getElementById('farm1');
  farm1.value = '1';
  farm1.dispatchEvent(new window.Event('change', { bubbles: true }));

  const vipBonus = document.getElementById('vipBonus');
  vipBonus.value = '10';
  vipBonus.dispatchEvent(new window.Event('input', { bubbles: true }));

  const target = document.getElementById('targetAmount');
  target.value = '1000';
  target.dispatchEvent(new window.Event('input', { bubbles: true }));

  const resultText = document.getElementById('results-content').textContent.trim();
  assert(
    resultText.includes('1h 15m'),
    `Expected time to include "1h 15m" but got "${resultText}"`
  );

  console.log('Protein calculator regression test passed');
}

run();

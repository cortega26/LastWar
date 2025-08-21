const assert = require('assert');
const { JSDOM } = require('jsdom');

const buildOptions = () => {
  let opts = '';
  for (let i = 0; i <= 10; i++) {
    opts += `<option value="${i}">${i}</option>`;
  }
  return opts;
};

const dom = new JSDOM(`<!DOCTYPE html><body>
<select id="adv-prot-lvl">${buildOptions()}</select>
<div id="advProtGoldResultDiv"></div>
<div id="advProtValorResultDiv"></div>
<div id="advProtFoodResultDiv"></div>
<div id="advProtIronResultDiv"></div>

<select id="healthLvl">${buildOptions()}</select>
<div id="healthGoldResultDiv"></div>
<div id="healthValorResultDiv"></div>
<div id="healthFoodResultDiv"></div>
<div id="healthIronResultDiv"></div>

<select id="attackLvl">${buildOptions()}</select>
<div id="attackGoldResultDiv"></div>
<div id="attackValorResultDiv"></div>
<div id="attackFoodResultDiv"></div>
<div id="attackIronResultDiv"></div>

<select id="defenseLvl">${buildOptions()}</select>
<div id="defenseGoldResultDiv"></div>
<div id="defenseValorResultDiv"></div>
<div id="defenseFoodResultDiv"></div>
<div id="defenseIronResultDiv"></div>

<button class="reset-button"></button>
<div id="totalGoldRemainingDiv"></div>
<div id="totalValorRemainingDiv"></div>
<div id="totalFoodRemainingDiv"></div>
<div id="totalIronRemainingDiv"></div>
</body>`, { url: 'http://localhost' });

global.window = dom.window;
global.document = dom.window.document;

// stub analytics to avoid errors
window.lastWarAnalytics = { trackEvent: () => {} };

async function run() {
  const { initT10Calculator } = await import('../assets/js/t10-calculator.js');

  initT10Calculator();

  const setAndTrigger = (id, value) => {
    const el = document.getElementById(id);
    el.value = value;
    el.dispatchEvent(new window.Event('change'));
  };

  setAndTrigger('adv-prot-lvl', '5');
  setAndTrigger('healthLvl', '3');
  setAndTrigger('attackLvl', '10');
  setAndTrigger('defenseLvl', '0');

  const parse = id => parseInt(document.getElementById(id).textContent.replace(/,/g, ''), 10);

  assert.strictEqual(parse('advProtGoldResultDiv'), 4000);
  assert.strictEqual(parse('healthValorResultDiv'), 392);
  assert.strictEqual(parse('attackGoldResultDiv'), 0);
  assert.strictEqual(parse('defenseFoodResultDiv'), 38500);
  assert.strictEqual(parse('totalGoldRemainingDiv'), 11770);
  assert.strictEqual(parse('totalValorRemainingDiv'), 1177);
  assert.strictEqual(parse('totalFoodRemainingDiv'), 117700);
  assert.strictEqual(parse('totalIronRemainingDiv'), 58850);

  // test reset behaviour
  const resetBtn = document.querySelector('.reset-button');
  resetBtn.dispatchEvent(new window.Event('click'));

  assert.strictEqual(document.getElementById('adv-prot-lvl').value, '0');
  assert.strictEqual(parse('advProtGoldResultDiv'), 5500);
  assert.strictEqual(parse('totalGoldRemainingDiv'), 18700);

  console.log('T10 calculator tests passed');
}

run();

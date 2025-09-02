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
<div id="advProtIronResultDiv"></div>
<div id="advProtBreadResultDiv"></div>
<div id="advProtValorResultDiv"></div>

<select id="healthLvl">${buildOptions()}</select>
<div id="healthGoldResultDiv"></div>
<div id="healthIronResultDiv"></div>
<div id="healthBreadResultDiv"></div>
<div id="healthValorResultDiv"></div>

<select id="attackLvl">${buildOptions()}</select>
<div id="attackGoldResultDiv"></div>
<div id="attackIronResultDiv"></div>
<div id="attackBreadResultDiv"></div>
<div id="attackValorResultDiv"></div>

<select id="defenseLvl">${buildOptions()}</select>
<div id="defenseGoldResultDiv"></div>
<div id="defenseIronResultDiv"></div>
<div id="defenseBreadResultDiv"></div>
<div id="defenseValorResultDiv"></div>

<button class="reset-button"></button>
<div id="totalGoldRemainingDiv"></div>
<div id="totalIronRemainingDiv"></div>
<div id="totalBreadRemainingDiv"></div>
<div id="totalValorRemainingDiv"></div>
</body>`, { url: 'http://localhost' });

global.window = dom.window;
global.document = dom.window.document;

// stub analytics to avoid errors
window.lastWarAnalytics = { trackEvent: () => {} };

async function run() {
  const { initT10Calculator } = await import('../assets/js/t10-calculator.js');

  initT10Calculator();

  const parse = id => parseInt(document.getElementById(id).textContent.replace(/,/g, ''), 10);

  const initialGold = parse('totalGoldRemainingDiv');
  const initialIron = parse('totalIronRemainingDiv');
  const initialBread = parse('totalBreadRemainingDiv');
  const initialValor = parse('totalValorRemainingDiv');

  assert.strictEqual(initialGold, 10927100000);
  assert.strictEqual(initialValor, 76480);
  assert.strictEqual(initialBread, 3611700000);
  assert.strictEqual(initialIron, 3611700000);

  const setAndTrigger = (id, value) => {
    const el = document.getElementById(id);
    el.value = value;
    el.dispatchEvent(new window.Event('change'));
  };

  setAndTrigger('adv-prot-lvl', '5');
  assert(parse('totalGoldRemainingDiv') < initialGold);

  const resetBtn = document.querySelector('.reset-button');
  resetBtn.dispatchEvent(new window.Event('click'));

  assert.strictEqual(parse('totalGoldRemainingDiv'), initialGold);
  assert.strictEqual(parse('totalValorRemainingDiv'), initialValor);
  assert.strictEqual(parse('totalBreadRemainingDiv'), initialBread);
  assert.strictEqual(parse('totalIronRemainingDiv'), initialIron);

  console.log('T10 calculator tests passed');
}

run();

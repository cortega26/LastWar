export function initT10Calculator() {
    const guardianOutfitterGold = [
        0,
        64600000,
        92300000,
        92300000,
        158000000,
        158000000,
        221000000,
        221000000,
        287000000,
        287000000,
        403000000
    ];
    const guardianOutfitterValor = [
        0,
        1280,
        1440,
        1440,
        1600,
        1600,
        1800,
        1800,
        2000,
        2000,
        2000
    ];
    const guardianOutfitterBread = [
        0,
        21700000,
        31000000,
        31000000,
        53000000,
        53000000,
        74000000,
        74000000,
        96000000,
        96000000,
        134000000
    ];

    const costTables = {
        advProt: {
            gold: [0,64600000,92300000,92300000,158000000,158000000,221000000,221000000,287000000,287000000,403000000],
            valor: [0,1280,1440,1440,1600,1600,1800,1800,2000,2000,2000],
            bread: [0,21700000,31000000,31000000,53000000,53000000,74000000,74000000,96000000,96000000,134000000],
            iron: [0,21700000,31000000,31000000,53000000,53000000,74000000,74000000,96000000,96000000,134000000]
        },
        health: {
            gold: guardianOutfitterGold,
            valor: guardianOutfitterValor,
            bread: guardianOutfitterBread,
            iron: guardianOutfitterBread
        },
        attack: {
            gold: guardianOutfitterGold,
            valor: guardianOutfitterValor,
            bread: guardianOutfitterBread,
            iron: guardianOutfitterBread
        },
        defense: {
            gold: guardianOutfitterGold,
            valor: guardianOutfitterValor,
            bread: guardianOutfitterBread,
            iron: guardianOutfitterBread
        }
    };

    const selectors = {
        advProt: document.getElementById('adv-prot-lvl'),
        health: document.getElementById('healthLvl'),
        attack: document.getElementById('attackLvl'),
        defense: document.getElementById('defenseLvl')
    };

    const resultDivs = {
        advProt: {
            gold: document.getElementById('advProtGoldResultDiv'),
            valor: document.getElementById('advProtValorResultDiv'),
            bread: document.getElementById('advProtBreadResultDiv'),
            iron: document.getElementById('advProtIronResultDiv')
        },
        health: {
            gold: document.getElementById('healthGoldResultDiv'),
            valor: document.getElementById('healthValorResultDiv'),
            bread: document.getElementById('healthBreadResultDiv'),
            iron: document.getElementById('healthIronResultDiv')
        },
        attack: {
            gold: document.getElementById('attackGoldResultDiv'),
            valor: document.getElementById('attackValorResultDiv'),
            bread: document.getElementById('attackBreadResultDiv'),
            iron: document.getElementById('attackIronResultDiv')
        },
        defense: {
            gold: document.getElementById('defenseGoldResultDiv'),
            valor: document.getElementById('defenseValorResultDiv'),
            bread: document.getElementById('defenseBreadResultDiv'),
            iron: document.getElementById('defenseIronResultDiv')
        }
    };

    const totalDivs = {
        gold: document.getElementById('totalGoldRemainingDiv'),
        iron: document.getElementById('totalIronRemainingDiv'),
        bread: document.getElementById('totalBreadRemainingDiv'),
        valor: document.getElementById('totalValorRemainingDiv')
    };

    // Base tier-10 research costs (placeholder values)
    const tier10Gold = 0;
    const tier10Valor = 0;
    const tier10BreadIron = 0;

    const computeRemaining = (arr, level) => {
        if (!Array.isArray(arr)) return 0;
        if (level >= arr.length - 1) return 0;
        let sum = 0;
        for (let i = level + 1; i < arr.length; i++) {
            sum += arr[i] || 0;
        }
        return sum;
    };

    const update = () => {
        const totals = { gold: 0, valor: 0, bread: 0, iron: 0 };
        Object.keys(selectors).forEach(key => {
            const level = parseInt(selectors[key]?.value || '0', 10);
            const table = costTables[key];
            const remaining = {
                gold: computeRemaining(table.gold, level),
                valor: computeRemaining(table.valor, level),
                bread: computeRemaining(table.bread, level),
                iron: computeRemaining(table.iron, level)
            };

            resultDivs[key].gold.textContent = remaining.gold.toLocaleString();
            resultDivs[key].iron.textContent = remaining.iron.toLocaleString();
            resultDivs[key].bread.textContent = remaining.bread.toLocaleString();
            resultDivs[key].valor.textContent = remaining.valor.toLocaleString();

            totals.gold += remaining.gold;
            totals.valor += remaining.valor;
            totals.bread += remaining.bread;
            totals.iron += remaining.iron;
        });

        totals.gold += tier10Gold;
        totals.valor += tier10Valor;
        totals.bread += tier10BreadIron;
        totals.iron += tier10BreadIron;

        totalDivs.gold.textContent = totals.gold.toLocaleString();
        totalDivs.iron.textContent = totals.iron.toLocaleString();
        totalDivs.bread.textContent = totals.bread.toLocaleString();
        totalDivs.valor.textContent = totals.valor.toLocaleString();
    };

    Object.values(selectors).forEach(sel => {
        sel?.addEventListener('change', update);
    });

    document.querySelectorAll('.reset-button').forEach(btn => {
        btn.addEventListener('click', () => {
            Object.values(selectors).forEach(sel => {
                if (sel) sel.value = '0';
            });
            update();
        });
    });

    update();
}

if (typeof document !== 'undefined') {
    const runInit = () => {
        if (document.getElementById('adv-prot-lvl')) {
            initT10Calculator();
        }
    };

    if (document.readyState !== 'loading') {
        runInit();
    } else {
        document.addEventListener('DOMContentLoaded', runInit);
    }
}


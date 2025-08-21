(function() {
    function initT10Calculator() {
        const costTables = {
            advProt: {
                gold: [0,100,200,300,400,500,600,700,800,900,1000],
                valor: [0,10,20,30,40,50,60,70,80,90,100],
                food: [0,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000],
                iron: [0,500,1000,1500,2000,2500,3000,3500,4000,4500,5000]
            },
            health: {
                gold: [0,80,160,240,320,400,480,560,640,720,800],
                valor: [0,8,16,24,32,40,48,56,64,72,80],
                food: [0,800,1600,2400,3200,4000,4800,5600,6400,7200,8000],
                iron: [0,400,800,1200,1600,2000,2400,2800,3200,3600,4000]
            },
            attack: {
                gold: [0,90,180,270,360,450,540,630,720,810,900],
                valor: [0,9,18,27,36,45,54,63,72,81,90],
                food: [0,900,1800,2700,3600,4500,5400,6300,7200,8100,9000],
                iron: [0,450,900,1350,1800,2250,2700,3150,3600,4050,4500]
            },
            defense: {
                gold: [0,70,140,210,280,350,420,490,560,630,700],
                valor: [0,7,14,21,28,35,42,49,56,63,70],
                food: [0,700,1400,2100,2800,3500,4200,4900,5600,6300,7000],
                iron: [0,350,700,1050,1400,1750,2100,2450,2800,3150,3500]
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
                food: document.getElementById('advProtFoodResultDiv'),
                iron: document.getElementById('advProtIronResultDiv')
            },
            health: {
                gold: document.getElementById('healthGoldResultDiv'),
                valor: document.getElementById('healthValorResultDiv'),
                food: document.getElementById('healthFoodResultDiv'),
                iron: document.getElementById('healthIronResultDiv')
            },
            attack: {
                gold: document.getElementById('attackGoldResultDiv'),
                valor: document.getElementById('attackValorResultDiv'),
                food: document.getElementById('attackFoodResultDiv'),
                iron: document.getElementById('attackIronResultDiv')
            },
            defense: {
                gold: document.getElementById('defenseGoldResultDiv'),
                valor: document.getElementById('defenseValorResultDiv'),
                food: document.getElementById('defenseFoodResultDiv'),
                iron: document.getElementById('defenseIronResultDiv')
            }
        };

        const totalDivs = {
            gold: document.getElementById('totalGoldRemainingDiv'),
            valor: document.getElementById('totalValorRemainingDiv'),
            food: document.getElementById('totalFoodRemainingDiv'),
            iron: document.getElementById('totalIronRemainingDiv')
        };

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
            const totals = { gold: 0, valor: 0, food: 0, iron: 0 };
            Object.keys(selectors).forEach(key => {
                const level = parseInt(selectors[key]?.value || '0', 10);
                const table = costTables[key];
                const remaining = {
                    gold: computeRemaining(table.gold, level),
                    valor: computeRemaining(table.valor, level),
                    food: computeRemaining(table.food, level),
                    iron: computeRemaining(table.iron, level)
                };

                resultDivs[key].gold.textContent = remaining.gold.toLocaleString();
                resultDivs[key].valor.textContent = remaining.valor.toLocaleString();
                resultDivs[key].food.textContent = remaining.food.toLocaleString();
                resultDivs[key].iron.textContent = remaining.iron.toLocaleString();

                totals.gold += remaining.gold;
                totals.valor += remaining.valor;
                totals.food += remaining.food;
                totals.iron += remaining.iron;
            });

            totalDivs.gold.textContent = totals.gold.toLocaleString();
            totalDivs.valor.textContent = totals.valor.toLocaleString();
            totalDivs.food.textContent = totals.food.toLocaleString();
            totalDivs.iron.textContent = totals.iron.toLocaleString();
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
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('adv-prot-lvl')) {
                initT10Calculator();
            }
        });
    }

    if (typeof module !== 'undefined') {
        module.exports = { initT10Calculator };
    } else {
        window.initT10Calculator = initT10Calculator;
    }
})();

(function() {
    const utils = typeof require !== 'undefined'
        ? require('./calculator-utils.js')
        : window.calculatorUtils || {};
    const { calculateTotalProduction, formatTime } = utils;

    function getCurrentFarmConfiguration() {
        const farms = {};
        for (let i = 1; i <= 5; i++) {
            const farmElement = document.getElementById(`farm${i}`);
            farms[i] = farmElement ? parseInt(farmElement.value || 0) : 0;
        }
        return farms;
    }

    function calculateEnhancedRates(baseRates) {
        const vipBonus = parseInt(document.getElementById('vipBonus')?.value || 0);
        const allianceBonus = parseInt(document.getElementById('allianceTechBonus')?.value || 0);
        const heroBonus = parseInt(document.getElementById('heroBonus')?.value || 0);
        const equipmentBonus = parseInt(document.getElementById('equipmentBonus')?.value || 0);
        const eventBonus = parseInt(document.getElementById('eventBonus')?.value || 0);
        const decorationBonus = parseInt(document.getElementById('decorationBonus')?.value || 0);

        const totalBonusMultiplier = 1 + (vipBonus + allianceBonus + heroBonus + equipmentBonus + eventBonus + decorationBonus) / 100;

        const enhancedRates = {};
        for (const [level, rate] of Object.entries(baseRates)) {
            enhancedRates[level] = Math.round(rate * totalBonusMultiplier);
        }
        return enhancedRates;
    }

    function initProteinCalculator() {
        const productionRates = {
            1: 720, 2: 1440, 3: 2160, 4: 2880, 5: 3600,
            6: 4320, 7: 5040, 8: 5760, 9: 6480, 10: 7200,
            11: 7920, 12: 8640, 13: 9360, 14: 10080, 15: 10800,
            16: 11520, 17: 12240, 18: 12960, 19: 13680, 20: 14400,
            21: 15120, 22: 15840, 23: 16560, 24: 17280, 25: 18000,
            26: 18720, 27: 19440, 28: 20160, 29: 20880, 30: 21600
        };

        for (let i = 1; i <= 5; i++) {
            const select = document.getElementById(`farm${i}`);
            if (!select) continue;
            for (let level = 1; level <= 30; level++) {
                const option = document.createElement('option');
                option.value = level;
                option.textContent = `Level ${level}`;
                select.appendChild(option);
            }
        }

        const form = document.getElementById('proteinFarmForm');
        const resultsDiv = document.getElementById('results-content');
        if (!form || !resultsDiv || !calculateTotalProduction || !formatTime) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const farms = getCurrentFarmConfiguration();
            const targetAmount = parseInt(document.getElementById('targetAmount')?.value || 0);
            const enhancedRates = calculateEnhancedRates(productionRates);
            const totalProduction = calculateTotalProduction(farms, enhancedRates);

            if (totalProduction <= 0 || targetAmount <= 0) {
                resultsDiv.innerHTML = '<p>Please enter valid farm levels and target amount.</p>';
                return;
            }

            const hours = targetAmount / totalProduction;
            const formatted = formatTime(hours);
            resultsDiv.innerHTML = `<p>Estimated Time: <strong>${formatted}</strong></p>`;

            if (window.lastWarAnalytics) {
                window.lastWarAnalytics.trackEvent('calc_run', { calculator: 'protein_farm' });
            }
        });
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('proteinFarmForm')) {
                initProteinCalculator();
            }
        });
    }

    if (typeof module !== 'undefined') {
        module.exports = { initProteinCalculator };
    } else {
        window.initProteinCalculator = initProteinCalculator;
    }
})();

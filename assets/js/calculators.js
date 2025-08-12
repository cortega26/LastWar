// Enhanced Calculator System for Last War Tools
class LastWarCalculators {
    constructor() {
        this.savedData = this.loadSavedData();
        this.init();
    }

    init() {
        // Auto-save user inputs
        this.setupAutoSave();

        // Enhanced protein calculator
        if (document.getElementById('farm1')) {
            this.enhanceProteinCalculator();
        }

        // Enhanced T10 calculator
        if (document.getElementById('adv-prot-lvl')) {
            this.enhanceT10Calculator();
        }

        // Add new high-value calculators
        this.addHeroOptimizerCalculator();
        this.addResourceEfficiencyCalculator();
        this.addEventROICalculator();
    }

    // ENHANCED PROTEIN CALCULATOR
    enhanceProteinCalculator() {
        const calculator = this;

        // Add advanced features
        this.addProteinAdvancedOptions();
        this.addProteinOptimizationSuggestions();
        this.addProteinProgressTracking();

        // Enhance existing calculation with more data
        const originalCalculate = window.initProteinCalculator;
        if (originalCalculate) {
            // Override with enhanced version
            this.initEnhancedProteinCalculator();
        }
    }

    initEnhancedProteinCalculator() {
        const productionRates = {
            1: 720, 2: 1440, 3: 2160, 4: 2880, 5: 3600,
            6: 4320, 7: 5040, 8: 5760, 9: 6480, 10: 7200,
            11: 7920, 12: 8640, 13: 9360, 14: 10080, 15: 10800,
            16: 11520, 17: 12240, 18: 12960, 19: 13680, 20: 14400,
            21: 15120, 22: 15840, 23: 16560, 24: 17280, 25: 18000,
            26: 18720, 27: 19440, 28: 20160, 29: 20880, 30: 21600
        };

        // Enhanced production calculation with bonuses
        const enhancedRates = this.calculateEnhancedRates(productionRates);

        // Add bonus system
        this.addProteinBonusCalculator(enhancedRates);

        // Add efficiency recommendations
        this.addProteinEfficiencyAnalysis(enhancedRates);

        // Real-time optimization suggestions
        this.addProteinOptimizationEngine(enhancedRates);
    }

    addProteinAdvancedOptions() {
        const advancedSection = document.createElement('div');
        advancedSection.className = 'advanced-options';
        advancedSection.innerHTML = `
            <div class="card" style="margin-top: 1rem;">
                <div class="card-header">
                    <h3>Advanced Bonuses</h3>
                    <small>Include these bonuses for accurate calculations</small>
                </div>
                <div class="bonus-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div class="bonus-item">
                        <label>VIP Bonus (%)</label>
                        <select id="vipBonus">
                            <option value="0">No VIP</option>
                            <option value="5">VIP 1-3 (+5%)</option>
                            <option value="10">VIP 4-6 (+10%)</option>
                            <option value="15">VIP 7-9 (+15%)</option>
                            <option value="20">VIP 10+ (+20%)</option>
                        </select>
                    </div>
                    <div class="bonus-item">
                        <label>Alliance Tech (%)</label>
                        <input type="number" id="allianceTechBonus" value="0" min="0" max="50" placeholder="0-50%">
                    </div>
                    <div class="bonus-item">
                        <label>Hero Bonus (%)</label>
                        <input type="number" id="heroBonus" value="0" min="0" max="30" placeholder="0-30%">
                    </div>
                    <div class="bonus-item">
                        <label>Equipment Bonus (%)</label>
                        <input type="number" id="equipmentBonus" value="0" min="0" max="25" placeholder="0-25%">
                    </div>
                    <div class="bonus-item">
                        <label>Event Bonus (%)</label>
                        <input type="number" id="eventBonus" value="0" min="0" max="100" placeholder="0-100%">
                    </div>
                    <div class="bonus-item">
                        <label>Decoration Bonus (%)</label>
                        <input type="number" id="decorationBonus" value="0" min="0" max="15" placeholder="0-15%">
                    </div>
                </div>
            </div>
        `;

        const targetSection = document.querySelector('.target-section');
        if (targetSection) {
            targetSection.parentNode.insertBefore(advancedSection, targetSection.nextSibling);
        }
    }

    addProteinOptimizationSuggestions() {
        const optimizationDiv = document.createElement('div');
        optimizationDiv.id = 'proteinOptimization';
        optimizationDiv.className = 'optimization-panel';
        optimizationDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>🚀 Optimization Suggestions</h3>
                </div>
                <div id="optimizationContent">
                    <p>Configure your farms to see optimization suggestions...</p>
                </div>
            </div>
        `;

        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.appendChild(optimizationDiv);
        }
    }

    calculateEnhancedRates(baseRates) {
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

    addProteinOptimizationEngine(enhancedRates) {
        const analyzer = this;

        // Watch for changes and provide real-time suggestions
        const inputs = ['targetAmount', 'farm1', 'farm2', 'farm3', 'farm4', 'farm5', 'vipBonus', 'allianceTechBonus'];
        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('change', () => {
                    analyzer.updateProteinOptimization(enhancedRates);
                });
            }
        });
    }

    updateProteinOptimization(enhancedRates) {
        const farms = this.getCurrentFarmConfiguration();
        const targetAmount = parseInt(document.getElementById('targetAmount')?.value || 0);

        if (targetAmount > 0) {
            const suggestions = this.generateProteinOptimizationSuggestions(farms, targetAmount, enhancedRates);
            this.displayOptimizationSuggestions(suggestions);
        }
    }

    generateProteinOptimizationSuggestions(farms, targetAmount, enhancedRates) {
        const suggestions = [];
        const currentProduction = this.calculateTotalProduction(farms, enhancedRates);
        const timeRequired = targetAmount / currentProduction;

        // Suggestion 1: Optimize farm levels
        const optimizedFarms = this.optimizeFarmLevels(farms, enhancedRates);
        if (optimizedFarms.improvement > 0) {
            suggestions.push({
                type: 'farm_optimization',
                title: '🔧 Farm Level Optimization',
                description: `Adjusting farm levels could improve efficiency by ${optimizedFarms.improvement.toFixed(1)}%`,
                action: optimizedFarms.suggestion,
                priority: 'high'
            });
        }

        // Suggestion 2: Bonus optimization
        const bonusOptimization = this.analyzeBonusEfficiency();
        if (bonusOptimization) {
            suggestions.push({
                type: 'bonus_optimization',
                title: '⚡ Bonus Efficiency',
                description: bonusOptimization.description,
                action: bonusOptimization.action,
                priority: bonusOptimization.priority
            });
        }

        // Suggestion 3: Time optimization
        if (timeRequired > 24) {
            suggestions.push({
                type: 'time_optimization',
                title: '⏰ Time Optimization',
                description: `Current time required: ${this.formatTime(timeRequired)}. Consider these optimizations:`,
                action: this.generateTimeOptimizationSteps(timeRequired, currentProduction),
                priority: 'medium'
            });
        }

        return suggestions;
    }

    displayOptimizationSuggestions(suggestions) {
        const container = document.getElementById('optimizationContent');
        if (!container) return;

        if (suggestions.length === 0) {
            container.innerHTML = '<p class="text-success">✅ Your farm configuration is already optimized!</p>';
            return;
        }

        const html = suggestions.map(suggestion => `
            <div class="suggestion-item priority-${suggestion.priority}" style="margin-bottom: 1rem; padding: 1rem; border-left: 4px solid ${this.getPriorityColor(suggestion.priority)}; background: rgba(0,0,0,0.05);">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--primary);">${suggestion.title}</h4>
                <p style="margin: 0 0 0.5rem 0; color: var(--text);">${suggestion.description}</p>
                <div style="font-size: 0.9rem; color: var(--text-light);">${suggestion.action}</div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    // NEW HIGH-VALUE CALCULATORS

    addHeroOptimizerCalculator() {
        // Add hero optimization calculator if not on a calculator page
        if (!this.isCalculatorPage()) return;

        const heroCalculatorSection = document.createElement('section');
        heroCalculatorSection.id = 'heroOptimizer';
        heroCalculatorSection.innerHTML = `
            <div class="card" style="margin-top: 2rem;">
                <div class="card-header">
                    <h2>🦸 Hero Optimization Calculator</h2>
                    <p>Find the optimal hero upgrade path for your playstyle</p>
                </div>
                <div class="hero-optimizer-content">
                    <div class="hero-selection" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div class="input-group">
                            <label>Primary Hero</label>
                            <select id="primaryHero">
                                <option value="">Select Primary Hero</option>
                                <option value="marshall">Marshall (Tank/Support)</option>
                                <option value="kimberly">Kimberly (Tank/Attack)</option>
                                <option value="dva">DVA (Aircraft/Attack)</option>
                                <option value="morrison">Morrison (Aircraft/Attack)</option>
                                <option value="tesla">Tesla (Missile/Attack)</option>
                                <option value="fiona">Fiona (Missile/Attack)</option>
                                <option value="mason">Mason (Support)</option>
                                <option value="murphy">Murphy (Support)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Current Level</label>
                            <input type="number" id="heroCurrentLevel" min="1" max="60" value="1">
                        </div>
                        <div class="input-group">
                            <label>Target Level</label>
                            <input type="number" id="heroTargetLevel" min="1" max="60" value="60">
                        </div>
                        <div class="input-group">
                            <label>Current Shards</label>
                            <input type="number" id="heroCurrentShards" min="0" value="0">
                        </div>
                        <div class="input-group">
                            <label>Playstyle Focus</label>
                            <select id="playstyleFocus">
                                <option value="pve">PvE Content</option>
                                <option value="pvp">PvP/War</option>
                                <option value="balanced">Balanced</option>
                                <option value="events">Event Focus</option>
                            </select>
                        </div>
                    </div>
                    <button id="calculateHeroOptimization" class="btn" style="margin-top: 1rem;">Calculate Optimization</button>
                    <div id="heroOptimizationResults" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;

        document.querySelector('.main-content, .container').appendChild(heroCalculatorSection);
        this.setupHeroOptimizerEvents();
    }

    setupHeroOptimizerEvents() {
        const calculateBtn = document.getElementById('calculateHeroOptimization');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateHeroOptimization();
            });
        }
    }

    calculateHeroOptimization() {
        const primaryHero = document.getElementById('primaryHero').value;
        const currentLevel = parseInt(document.getElementById('heroCurrentLevel').value);
        const targetLevel = parseInt(document.getElementById('heroTargetLevel').value);
        const currentShards = parseInt(document.getElementById('heroCurrentShards').value);
        const playstyle = document.getElementById('playstyleFocus').value;

        if (!primaryHero || currentLevel >= targetLevel) {
            alert('Please select a hero and valid level range');
            return;
        }

        const optimization = this.performHeroOptimization(primaryHero, currentLevel, targetLevel, currentShards, playstyle);
        this.displayHeroOptimization(optimization);

        // Track the calculation
        if (window.lastWarAnalytics) {
            window.lastWarAnalytics.trackEvent('hero_optimization_calculated', {
                hero: primaryHero,
                level_gap: targetLevel - currentLevel,
                playstyle: playstyle
            });
            window.lastWarAnalytics.trackEvent('calc_run', { calculator: 'hero_optimization' });
        }
    }

    performHeroOptimization(hero, currentLevel, targetLevel, currentShards, playstyle) {
        // Hero upgrade costs (simplified - you'd want real data)
        const shardsNeeded = this.calculateShardsNeeded(currentLevel, targetLevel);
        const totalShardsRequired = shardsNeeded - currentShards;

        // Calculate resource requirements
        const goldRequired = this.calculateHeroGoldCost(currentLevel, targetLevel);
        const timeEstimate = this.calculateHeroUpgradeTime(totalShardsRequired, playstyle);

        // Generate recommendations based on playstyle
        const recommendations = this.generateHeroRecommendations(hero, playstyle, totalShardsRequired);

        return {
            hero,
            shardsNeeded: totalShardsRequired,
            goldRequired,
            timeEstimate,
            recommendations,
            priority: this.calculateHeroPriority(hero, playstyle)
        };
    }

    displayHeroOptimization(optimization) {
        const resultsDiv = document.getElementById('heroOptimizationResults');
        if (!resultsDiv) return;

        resultsDiv.innerHTML = `
            <div class="optimization-results">
                <h3>Optimization Results for ${optimization.hero.charAt(0).toUpperCase() + optimization.hero.slice(1)}</h3>
                <div class="results-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                    <div class="result-item">
                        <strong>Shards Needed:</strong><br>
                        ${optimization.shardsNeeded.toLocaleString()}
                    </div>
                    <div class="result-item">
                        <strong>Gold Required:</strong><br>
                        ${optimization.goldRequired.toLocaleString()}
                    </div>
                    <div class="result-item">
                        <strong>Time Estimate:</strong><br>
                        ${optimization.timeEstimate}
                    </div>
                    <div class="result-item">
                        <strong>Priority Level:</strong><br>
                        <span style="color: ${this.getPriorityColor(optimization.priority)}">${optimization.priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="recommendations">
                    <h4>📋 Upgrade Recommendations:</h4>
                    <ul>${optimization.recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
                </div>
            </div>
        `;
    }

    addResourceEfficiencyCalculator() {
        if (!this.isCalculatorPage()) return;

        // Add resource efficiency calculator
        const efficiencySection = document.createElement('section');
        efficiencySection.id = 'resourceEfficiency';
        efficiencySection.innerHTML = `
            <div class="card" style="margin-top: 2rem;">
                <div class="card-header">
                    <h2>📊 Resource Efficiency Calculator</h2>
                    <p>Optimize your resource allocation and spending priorities</p>
                </div>
                <div class="efficiency-calculator">
                    <div class="resource-inputs" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                        <div class="input-group">
                            <label>Current Gold</label>
                            <input type="number" id="currentGold" min="0" placeholder="0">
                        </div>
                        <div class="input-group">
                            <label>Current Food</label>
                            <input type="number" id="currentFood" min="0" placeholder="0">
                        </div>
                        <div class="input-group">
                            <label>Current Iron</label>
                            <input type="number" id="currentIron" min="0" placeholder="0">
                        </div>
                        <div class="input-group">
                            <label>Daily Production Goal</label>
                            <select id="productionGoal">
                                <option value="conservative">Conservative</option>
                                <option value="moderate">Moderate</option>
                                <option value="aggressive">Aggressive</option>
                                <option value="maximum">Maximum</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Priority Focus</label>
                            <select id="resourcePriority">
                                <option value="balanced">Balanced Growth</option>
                                <option value="military">Military Power</option>
                                <option value="economic">Economic Growth</option>
                                <option value="research">Research Speed</option>
                            </select>
                        </div>
                    </div>
                    <button id="calculateEfficiency" class="btn" style="margin-top: 1rem;">Calculate Efficiency</button>
                    <div id="efficiencyResults" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;

        document.querySelector('.main-content, .container').appendChild(efficiencySection);
        this.setupResourceEfficiencyEvents();
    }

    setupResourceEfficiencyEvents() {
        const calculateBtn = document.getElementById('calculateEfficiency');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateResourceEfficiency();
            });
        }
    }

    calculateResourceEfficiency() {
        const currentGold = parseInt(document.getElementById('currentGold').value || 0);
        const currentFood = parseInt(document.getElementById('currentFood').value || 0);
        const currentIron = parseInt(document.getElementById('currentIron').value || 0);
        const productionGoal = document.getElementById('productionGoal').value;
        const priority = document.getElementById('resourcePriority').value;

        const efficiency = this.performResourceEfficiencyAnalysis(
            { gold: currentGold, food: currentFood, iron: currentIron },
            productionGoal,
            priority
        );

        this.displayResourceEfficiency(efficiency);

        if (window.lastWarAnalytics) {
            window.lastWarAnalytics.trackEvent('calc_run', { calculator: 'resource_efficiency' });
        }
    }

    // Utility methods
    getCurrentFarmConfiguration() {
        const farms = {};
        for (let i = 1; i <= 5; i++) {
            const farmElement = document.getElementById(`farm${i}`);
            farms[i] = farmElement ? parseInt(farmElement.value || 0) : 0;
        }
        return farms;
    }

    calculateTotalProduction(farms, rates) {
        let total = 0;
        for (const [farmNum, level] of Object.entries(farms)) {
            if (level > 0) {
                total += rates[level] || 0;
            }
        }
        return total;
    }

    formatTime(hours) {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.floor(hours % 24);
        const minutes = Math.floor((hours % 1) * 60);

        if (days > 0) {
            return `${days}d ${remainingHours}h ${minutes}m`;
        } else if (remainingHours > 0) {
            return `${remainingHours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    getPriorityColor(priority) {
        const colors = {
            high: '#e74c3c',
            medium: '#f39c12',
            low: '#27ae60'
        };
        return colors[priority] || '#95a5a6';
    }

    isCalculatorPage() {
        return window.location.pathname.includes('calculator') ||
            document.querySelector('#farm1, #adv-prot-lvl') !== null;
    }

    // Auto-save functionality
    setupAutoSave() {
        // Save inputs automatically
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveInputValue(input.id, input.value);
            });

            // Load saved value
            const savedValue = this.getSavedInputValue(input.id);
            if (savedValue && input.value === '') {
                input.value = savedValue;
            }
        });
    }

    saveInputValue(inputId, value) {
        try {
            const saved = JSON.parse(localStorage.getItem('lw_calculator_data') || '{}');
            saved[inputId] = value;
            localStorage.setItem('lw_calculator_data', JSON.stringify(saved));
        } catch (error) {
            console.warn('Failed to save input value:', error);
        }
    }

    getSavedInputValue(inputId) {
        try {
            const saved = JSON.parse(localStorage.getItem('lw_calculator_data') || '{}');
            return saved[inputId];
        } catch (error) {
            return null;
        }
    }

    loadSavedData() {
        try {
            return JSON.parse(localStorage.getItem('lw_calculator_data') || '{}');
        } catch (error) {
            return {};
        }
    }
}

// Initialize enhanced calculators
document.addEventListener('DOMContentLoaded', () => {
    window.lastWarCalculators = new LastWarCalculators();
});

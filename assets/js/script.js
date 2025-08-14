/**
    * Last War: Survival - Main Script
    * Handles navigation, theme toggle, and all calculator functionality
    */

    // ===== NAVIGATION & THEME FUNCTIONALITY =====

    class Navigation {
        constructor() {
            this.init();
        }

        init() {
            this.setupMobileNavigation();
            this.setupThemeToggle();
            this.setupSearchFunctionality();
            this.setActiveNavItem();
        }

        setupMobileNavigation() {
            const $navToggle = $('.nav-toggle');
            const $navMenu = $('.nav-menu');
            const $dropdowns = $('.nav-item.dropdown');
            
            // Mobile menu toggle
            $navToggle.off('click.nav').on('click.nav', function() {
                const isExpanded = $(this).attr('aria-expanded') === 'true';
                $(this).attr('aria-expanded', !isExpanded);
                $navMenu.toggleClass('active');
                $('body').toggleClass('nav-open');
            });
            
            // Dropdown toggles for mobile
            $dropdowns.off('click.nav').on('click.nav', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    $(this).toggleClass('active');
                    $(this).siblings().removeClass('active');
                }
            });
            
            // Close menu when clicking outside
            $(document).off('click.nav').on('click.nav', (e) => {
                if (!$(e.target).closest('.nav-container').length) {
                    $navMenu.removeClass('active');
                    $dropdowns.removeClass('active');
                    $navToggle.attr('aria-expanded', 'false');
                    $('body').removeClass('nav-open');
                }
            });
            
            // Handle window resize
            $(window).off('resize.nav').on('resize.nav', () => {
                if (window.innerWidth > 768) {
                    $navMenu.removeClass('active');
                    $dropdowns.removeClass('active');
                    $navToggle.attr('aria-expanded', 'false');
                    $('body').removeClass('nav-open');
                }
            });
        }

        setupThemeToggle() {
            const $themeToggle = $('#themeToggle');
            const savedTheme = localStorage.getItem('theme') || 'dark';
            
            // Apply saved theme
            document.documentElement.setAttribute('data-theme', savedTheme);
            $themeToggle.attr('aria-pressed', savedTheme === 'dark');
            
            // Theme toggle handler
            $themeToggle.off('click').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (typeof window.toggleDarkMode === 'function') {
                    window.toggleDarkMode();
                }
            });

            // Keyboard support
            $themeToggle.off('keydown').on('keydown', function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                    e.preventDefault();
                    if (typeof window.toggleDarkMode === 'function') {
                        window.toggleDarkMode();
                    }
                }
            });
        }

        setupSearchFunctionality() {
            const $searchInput = $('.nav-search input');
            const $searchButton = $('.nav-search button');
            
            $searchButton.on('click', () => {
                const query = $searchInput.val().trim();
                if (query) {
                    this.performSearch(query);
                }
            });
            
            $searchInput.on('keypress', (e) => {
                if (e.which === 13) {
                    const query = $searchInput.val().trim();
                    if (query) {
                        this.performSearch(query);
                    }
                }
            });
        }

        performSearch(query) {
            // Basic search functionality - can be enhanced
            console.log('Searching for:', query);
            
            // Track search event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search', {
                    search_term: query,
                    event_category: 'engagement'
                });
            }
        }

        setActiveNavItem() {
            const currentPath = window.location.pathname;
            const fileName = currentPath.split('/').pop() || 'index.html';
            
            $('.nav-link').removeClass('active');
            $(`.nav-link[href*="${fileName}"]`).addClass('active');
        }
    }

    // ===== CALCULATOR DATA & FUNCTIONALITY =====

    // T10 Calculator Data Arrays
    const T10_DATA = {
        advancedProtection: {
            gold: [0, 12000, 24000, 36000, 48000, 60000, 72000, 84000, 96000, 108000, 120000],
            valor: [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000],
            foodIron: [0, 24000000, 48000000, 72000000, 96000000, 120000000, 144000000, 168000000, 192000000, 216000000, 240000000]
        },
        boostThree: {
            gold: [0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000, 72000, 80000],
            valor: [0, 150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500],
            foodIron: [0, 16000000, 32000000, 48000000, 64000000, 80000000, 96000000, 112000000, 128000000, 144000000, 160000000]
        },
        tierTen: {
            gold: 50000,
            valor: 1000,
            foodIron: 100000000
        }
    };

    // Protein Calculator Production Rates
    const PROTEIN_RATES = {
        1: 720, 2: 1440, 3: 2160, 4: 2880, 5: 3600,
        6: 4320, 7: 5040, 8: 5760, 9: 6480, 10: 7200,
        11: 7920, 12: 8640, 13: 9360, 14: 10080, 15: 10800,
        16: 11520, 17: 12240, 18: 12960, 19: 13680, 20: 14400,
        21: 15120, 22: 15840, 23: 16560, 24: 17280, 25: 18000,
        26: 18720, 27: 19440, 28: 20160, 29: 20880, 30: 21600
    };

    class T10Calculator {
        constructor() {
            this.state = {
                prot: { gold: 0, val: 0, food: 0, iron: 0 },
                health: { gold: 0, val: 0, food: 0, iron: 0 },
                attack: { gold: 0, val: 0, food: 0, iron: 0 },
                defense: { gold: 0, val: 0, food: 0, iron: 0 }
            };
            this.elements = {};
            this.init();
        }

        init() {
            this.getElements();
            if (this.elementsExist()) {
                this.setupEventListeners();
                this.initializeCalculator();
            }
        }

        getElements() {
            // Input elements
            this.elements.advProtLvl = document.getElementById('adv-prot-lvl');
            this.elements.hLvl = document.getElementById('healthLvl');
            this.elements.aLvl = document.getElementById('attackLvl');
            this.elements.dLvl = document.getElementById('defenseLvl');

            // Result divs - Advanced Protection
            this.elements.advProtGold = document.getElementById('advProtGoldResultDiv');
            this.elements.advProtValor = document.getElementById('advProtValorResultDiv');
            this.elements.advProtFood = document.getElementById('advProtFoodResultDiv');
            this.elements.advProtIron = document.getElementById('advProtIronResultDiv');

            // Result divs - Health
            this.elements.healthGold = document.getElementById('healthGoldResultDiv');
            this.elements.healthValor = document.getElementById('healthValorResultDiv');
            this.elements.healthFood = document.getElementById('healthFoodResultDiv');
            this.elements.healthIron = document.getElementById('healthIronResultDiv');

            // Result divs - Attack
            this.elements.attackGold = document.getElementById('attackGoldResultDiv');
            this.elements.attackValor = document.getElementById('attackValorResultDiv');
            this.elements.attackFood = document.getElementById('attackFoodResultDiv');
            this.elements.attackIron = document.getElementById('attackIronResultDiv');

            // Result divs - Defense
            this.elements.defenseGold = document.getElementById('defenseGoldResultDiv');
            this.elements.defenseValor = document.getElementById('defenseValorResultDiv');
            this.elements.defenseFood = document.getElementById('defenseFoodResultDiv');
            this.elements.defenseIron = document.getElementById('defenseIronResultDiv');

            // Total divs
            this.elements.totalGold = document.getElementById('totalGoldRemainingDiv');
            this.elements.totalValor = document.getElementById('totalValorRemainingDiv');
            this.elements.totalFood = document.getElementById('totalFoodRemainingDiv');
            this.elements.totalIron = document.getElementById('totalIronRemainingDiv');

            // Reset button
            this.elements.resetBtn = document.querySelector('.reset-button');
        }

        elementsExist() {
            return this.elements.advProtLvl && this.elements.hLvl && 
                this.elements.aLvl && this.elements.dLvl;
        }

        setupEventListeners() {
            // Advanced Protection
            this.elements.advProtLvl.addEventListener('change', (e) => {
                this.updateAdvancedProtection(e.target.value);
            });

            // Health Boost III
            this.elements.hLvl.addEventListener('change', (e) => {
                this.updateHealth(e.target.value);
            });

            // Attack Boost III
            this.elements.aLvl.addEventListener('change', (e) => {
                this.updateAttack(e.target.value);
            });

            // Defense Boost III
            this.elements.dLvl.addEventListener('change', (e) => {
                this.updateDefense(e.target.value);
            });

            // Reset button
            if (this.elements.resetBtn) {
                this.elements.resetBtn.addEventListener('click', () => {
                    this.resetAll();
                });
            }
        }

        updateAdvancedProtection(level) {
            this.state.prot.gold = this.updateDiv(level, T10_DATA.advancedProtection.gold, this.elements.advProtGold, '💰 Gold');
            this.state.prot.val = this.updateDiv(level, T10_DATA.advancedProtection.valor, this.elements.advProtValor, '🏆 Valor Badges');
            this.state.prot.food = this.updateDiv(level, T10_DATA.advancedProtection.foodIron, this.elements.advProtFood, '🍖 Food');
            this.state.prot.iron = this.updateDiv(level, T10_DATA.advancedProtection.foodIron, this.elements.advProtIron, '⚙️ Iron');
            this.updateTotals();
        }

        updateHealth(level) {
            this.state.health.gold = this.updateDiv(level, T10_DATA.boostThree.gold, this.elements.healthGold, '💰 Gold');
            this.state.health.val = this.updateDiv(level, T10_DATA.boostThree.valor, this.elements.healthValor, '🏆 Valor Badges');
            this.state.health.food = this.updateDiv(level, T10_DATA.boostThree.foodIron, this.elements.healthFood, '🍖 Food');
            this.state.health.iron = this.updateDiv(level, T10_DATA.boostThree.foodIron, this.elements.healthIron, '⚙️ Iron');
            this.updateTotals();
        }

        updateAttack(level) {
            this.state.attack.gold = this.updateDiv(level, T10_DATA.boostThree.gold, this.elements.attackGold, '💰 Gold');
            this.state.attack.val = this.updateDiv(level, T10_DATA.boostThree.valor, this.elements.attackValor, '🏆 Valor Badges');
            this.state.attack.food = this.updateDiv(level, T10_DATA.boostThree.foodIron, this.elements.attackFood, '🍖 Food');
            this.state.attack.iron = this.updateDiv(level, T10_DATA.boostThree.foodIron, this.elements.attackIron, '⚙️ Iron');
            this.updateTotals();
        }

        updateDefense(level) {
            this.state.defense.gold = this.updateDiv(level, T10_DATA.boostThree.gold, this.elements.defenseGold, '💰 Gold');
            this.state.defense.val = this.updateDiv(level, T10_DATA.boostThree.valor, this.elements.defenseValor, '🏆 Valor Badges');
            this.state.defense.food = this.updateDiv(level, T10_DATA.boostThree.foodIron, this.elements.defenseFood, '🍖 Food');
            this.state.defense.iron = this.updateDiv(level, T10_DATA.boostThree.foodIron, this.elements.defenseIron, '⚙️ Iron');
            this.updateTotals();
        }

        updateDiv(newValue, valuesArray, targetDiv, resourceLabel) {
            if (!targetDiv) return 0;
            
            const level = parseInt(newValue) || 0;
            targetDiv.classList.add('updating');
            
            setTimeout(() => {
                const needed = this.sumRange(valuesArray, level, valuesArray.length - 1);
                if (needed > 0) {
                    targetDiv.textContent = `${needed.toLocaleString()} ${resourceLabel}`;
                    targetDiv.style.opacity = '1';
                } else {
                    targetDiv.textContent = `✅ Complete`;
                    targetDiv.style.opacity = '0.7';
                }
                targetDiv.classList.remove('updating');
            }, 100);
            
            return this.sumRange(valuesArray, level, valuesArray.length - 1);
        }

        updateTotals() {
            const totalGold = this.state.health.gold + this.state.prot.gold + this.state.attack.gold + this.state.defense.gold + T10_DATA.tierTen.gold;
            const totalValor = this.state.health.val + this.state.prot.val + this.state.attack.val + this.state.defense.val + T10_DATA.tierTen.valor;
            const totalFood = this.state.health.food + this.state.prot.food + this.state.attack.food + this.state.defense.food + T10_DATA.tierTen.foodIron;
            const totalIron = this.state.health.iron + this.state.prot.iron + this.state.attack.iron + this.state.defense.iron + T10_DATA.tierTen.foodIron;

            this.animateValue(this.elements.totalGold, totalGold);
            this.animateValue(this.elements.totalValor, totalValor);
            this.animateValue(this.elements.totalFood, totalFood);
            this.animateValue(this.elements.totalIron, totalIron);

            // Track calculation completion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tier10_calculation_updated', {
                    event_category: 'calculator_usage',
                    total_gold: totalGold,
                    total_valor: totalValor
                });
            }
        }

        animateValue(element, targetValue) {
            if (!element) return;
            
            element.classList.add('updating');
            setTimeout(() => {
                element.textContent = targetValue > 0 ? targetValue.toLocaleString() : '0';
                element.classList.remove('updating');
            }, 100);
        }

        sumRange(arr, start, end) {
            if (start < 0 || end >= arr.length || start > end) {
                return 0;
            }
            let sum = 0;
            for (let i = start; i <= end; i++) {
                sum += arr[i];
            }
            return sum;
        }

        initializeCalculator() {
            // Initialize all calculations with current dropdown values
            this.updateAdvancedProtection(this.elements.advProtLvl.value);
            this.updateHealth(this.elements.hLvl.value);
            this.updateAttack(this.elements.aLvl.value);
            this.updateDefense(this.elements.dLvl.value);
        }

        resetAll() {
            // Reset dropdowns
            this.elements.advProtLvl.value = '0';
            this.elements.hLvl.value = '0';
            this.elements.aLvl.value = '0';
            this.elements.dLvl.value = '0';
            
            // Reset state
            Object.keys(this.state).forEach(key => {
                this.state[key] = { gold: 0, val: 0, food: 0, iron: 0 };
            });
            
            // Reinitialize
            this.initializeCalculator();
            
            // Visual feedback
            document.querySelectorAll('.tech-node').forEach(node => {
                node.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    node.style.transform = 'scale(1)';
                }, 150);
            });

            // Track reset
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tier10_calculator_reset', {
                    event_category: 'calculator_usage'
                });
            }
        }
    }

    class ProteinCalculator {
        constructor() {
            this.init();
        }

        init() {
            if (document.getElementById('farm1')) {
                this.populateDropdowns();
                this.setupEventListeners();
                this.calculateProduction();
            }
        }

        populateDropdowns() {
            // Populate Farm I dropdown (required)
            const farm1 = document.getElementById('farm1');
            if (farm1) {
                farm1.innerHTML = '<option value="0">Select Level</option>';
                for (let i = 1; i <= 30; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Level ${i} (${PROTEIN_RATES[i].toLocaleString()}/hr)`;
                    farm1.appendChild(option);
                }
            }

            // Populate other farm dropdowns (optional)
            for (let farmNum = 2; farmNum <= 5; farmNum++) {
                const farmSelect = document.getElementById(`farm${farmNum}`);
                if (farmSelect) {
                    farmSelect.innerHTML = '<option value="0">Not Built</option>';
                    for (let i = 1; i <= 30; i++) {
                        const option = document.createElement('option');
                        option.value = i;
                        option.textContent = `Level ${i} (${PROTEIN_RATES[i].toLocaleString()}/hr)`;
                        farmSelect.appendChild(option);
                    }
                }
            }
        }

        setupEventListeners() {
            // Target input
            const targetInput = document.getElementById('targetAmount');
            if (targetInput) {
                targetInput.addEventListener('input', () => this.calculateProduction());
            }

            // Farm selects
            for (let i = 1; i <= 5; i++) {
                const farmSelect = document.getElementById(`farm${i}`);
                if (farmSelect) {
                    farmSelect.addEventListener('change', () => this.calculateProduction());
                }
            }
        }

        updateProductionInfo() {
            for (let i = 1; i <= 5; i++) {
                const farmSelect = document.getElementById(`farm${i}`);
                const infoElement = document.getElementById(`farm${i}-info`);
                const containerElement = document.getElementById(`farm${i}-container`);
                
                if (!farmSelect || !infoElement || !containerElement) continue;
                
                const level = parseInt(farmSelect.value) || 0;
                
                if (level > 0) {
                    const rate = PROTEIN_RATES[level];
                    infoElement.textContent = `${rate.toLocaleString()} units/hour`;
                    containerElement.classList.add('active');
                } else {
                    infoElement.textContent = 'Not operational';
                    containerElement.classList.remove('active');
                }
            }
        }

        calculateProduction() {
            this.updateProductionInfo();
            
            const targetInput = document.getElementById('targetAmount');
            const resultsContent = document.getElementById('results-content');
            
            if (!targetInput || !resultsContent) return;
            
            const targetAmount = parseInt(targetInput.value) || 0;
            
            if (targetAmount <= 0) {
                resultsContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <p>Configure your farms and enter target amount</p>
                    </div>
                `;
                return;
            }

            let totalProduction = 0;
            let activeFarms = 0;
            
            for (let i = 1; i <= 5; i++) {
                const farmSelect = document.getElementById(`farm${i}`);
                if (farmSelect) {
                    const level = parseInt(farmSelect.value) || 0;
                    if (level > 0) {
                        totalProduction += PROTEIN_RATES[level];
                        activeFarms++;
                    }
                }
            }

            if (totalProduction === 0) {
                resultsContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <p>No active farms detected. Please select farm levels.</p>
                    </div>
                `;
                return;
            }

            const hoursNeeded = targetAmount / totalProduction;
            const days = Math.floor(hoursNeeded / 24);
            const remainingHours = Math.floor(hoursNeeded % 24);
            const minutes = Math.floor((hoursNeeded % 1) * 60);

            let timeDisplay = '';
            if (days > 0) {
                timeDisplay = `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
            } else if (remainingHours > 0) {
                timeDisplay = `${remainingHours} hour${remainingHours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
                timeDisplay = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }

            resultsContent.innerHTML = `
                <div class="result-summary">
                    <div class="result-item">
                        <div class="result-label">Total Production Rate</div>
                        <div class="result-value">${totalProduction.toLocaleString()} units/hour</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Active Farms</div>
                        <div class="result-value">${activeFarms} farm${activeFarms !== 1 ? 's' : ''}</div>
                    </div>
                    <div class="result-item highlight">
                        <div class="result-label">Time Required</div>
                        <div class="result-value">${timeDisplay}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Total Hours</div>
                        <div class="result-value">${hoursNeeded.toFixed(1)} hours</div>
                    </div>
                </div>
            `;

            // Track calculation completion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'protein_calculation_completed', {
                    event_category: 'calculator_usage',
                    target_amount: targetAmount,
                    active_farms: activeFarms,
                    time_hours: hoursNeeded.toFixed(1)
                });
            }
        }
    }

    // ===== GENERAL UTILITIES =====

    class Utils {
        static formatNumber(num) {
            return num.toLocaleString();
        }

        static formatTime(hours) {
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

        static trackEvent(eventName, parameters = {}) {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'user_interaction',
                    ...parameters
                });
            }
        }
    }

    // ===== INITIALIZATION =====

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize navigation
        new Navigation();
        
        // Initialize calculators based on page content
        if (document.getElementById('adv-prot-lvl')) {
            new T10Calculator();
        }
        
        if (document.getElementById('farm1')) {
            new ProteinCalculator();
        }

        // Building level selector for any pages that have it
        $('.building-level').click(function () {
            $(this).parent().find('.building-level').removeClass('active');
            $(this).addClass('active');
        });

        // Hero optimizer functionality (if present)
        if (typeof initHeroOptimizer === 'function') {
            initHeroOptimizer();
        }
    });

    // jQuery-based initialization for navigation loading
    $(document).ready(function () {
        // Load navigation and footer
        $("#nav-placeholder").load("../partials/nav.html", function() {
            // Re-initialize after nav loads
            setTimeout(() => {
                new Navigation();
                
                if (document.getElementById('adv-prot-lvl')) {
                    new T10Calculator();
                }
                if (document.getElementById('farm1')) {
                    new ProteinCalculator();
                }
            }, 100);
        });
        
        $("#footer-placeholder").load("../partials/footer.html");

        // Enhanced theme toggle handling for dynamically loaded content
        $(document).on("click", "#themeToggle", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof window.toggleDarkMode === 'function') {
                window.toggleDarkMode();
            }
        });

        // Keyboard support for theme toggle
        $(document).on("keydown", "#themeToggle", function (e) {
            if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                if (typeof window.toggleDarkMode === 'function') {
                    window.toggleDarkMode();
                }
            }
        });
    });

    // Global functions for backward compatibility
    window.Navigation = Navigation;
    window.T10Calculator = T10Calculator;
    window.ProteinCalculator = ProteinCalculator;
    window.Utils = Utils;
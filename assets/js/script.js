// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization functions
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// SEO Enhancement functions
function enhanceSEO() {
    addReadingTime();
    generateTableOfContents();
}

function generateTableOfContents() {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html')) return;

    const headings = document.querySelectorAll('h2, h3');
    if (headings.length < 3) return;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h3>📋 Table of Contents</h3>';

    const tocList = document.createElement('ul');
    tocContainer.appendChild(tocList);

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }

        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = heading.tagName.toLowerCase();

        li.appendChild(link);
        tocList.appendChild(li);
    });

    const intro = document.querySelector('.intro, .guide-intro');
    if (intro) {
        intro.insertAdjacentElement('afterend', tocContainer);
    }
}

function addReadingTime() {
    const content = document.querySelector('main .content, main .container');
    if (!content) return;

    const text = content.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const readingTimeEl = document.createElement('div');
    readingTimeEl.className = 'reading-time';
    readingTimeEl.innerHTML = `📖 ${readingTime} min read`;

    const title = document.querySelector('h1');
    if (title) {
        title.insertAdjacentElement('afterend', readingTimeEl);
    }
}

// User experience enhancements
function enhanceUserExperience() {
    addSmoothScrolling();
    addCopyButtons();
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre, .resource-result');
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Copy to clipboard';

        copyBtn.addEventListener('click', () => {
            const text = block.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '✅';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋';
                }, 2000);
            });
        });

        block.style.position = 'relative';
        block.appendChild(copyBtn);
    });
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);

    // Use StorageUtils if available, fallback to try-catch
    if (typeof StorageUtils !== 'undefined') {
        StorageUtils.setItem("theme", newTheme);
    } else {
        try {
            localStorage.setItem("theme", newTheme);
        } catch (e) {
            // Theme will reset on page reload but won't crash
        }
    }

    $("#themeToggle").attr("aria-pressed", newTheme === "dark");
}

$(document).ready(function () {
    // Initialize new enhancements
    optimizePerformance();
    enhanceSEO();
    enhanceUserExperience();

    // Add loading indicator
    document.body.classList.add('loaded');

    const isSubpage = window.location.pathname.includes('/pages/');
    const prefix = isSubpage ? '../' : '';
    const savedTheme = localStorage.getItem("theme");
    $("#nav-placeholder").load(prefix + "partials/nav.html", function () {
        if (isSubpage) {
            $("#nav-placeholder a").each(function () {
                const href = $(this).attr('href');
                if (!href.startsWith('http') && !href.startsWith('../')) {
                    $(this).attr('href', '../' + href);
                }
            });
        }
        if (savedTheme === "dark" || savedTheme === "light") {
            $("#themeToggle").attr("aria-pressed", savedTheme === "dark");
        }
    });
    $("#footer-placeholder").load(prefix + "partials/footer.html");
    if (savedTheme === "dark" || savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }


    // Clean mobile navigation toggle - no conflicts
    $("#navToggle").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const navMenu = $("#navMenu, .nav-menu");
        const isActive = navMenu.hasClass("active");

        navMenu.toggleClass("active");
        $(this).attr("aria-expanded", !isActive);
    });

    // Mobile dropdown handling - clean event delegation
    $(".nav-item.dropdown > .nav-link").on("click", function (e) {
        // Only handle on mobile
        if (window.innerWidth <= 767) {
            e.preventDefault();
            e.stopPropagation();

            const parentItem = $(this).parent();
            const isActive = parentItem.hasClass("active");

            // Close other dropdowns
            $(".nav-item.dropdown").removeClass("active");

            // Toggle current dropdown
            if (!isActive) {
                parentItem.addClass("active");
            }
        }
    });

    // Close mobile menu when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("nav").length) {
            $(".nav-menu").removeClass("active");
            $(".nav-item.dropdown").removeClass("active");
            $("#navToggle").attr("aria-expanded", "false");
        }
    });

    // Handle window resize - close mobile menu if switching to desktop
    $(window).on("resize", function () {
        if (window.innerWidth > 767) {
            $(".nav-menu").removeClass("active");
            $(".nav-item.dropdown").removeClass("active");
            $("#navToggle").attr("aria-expanded", "false");
        }
    });

    // FAQ Toggle with ARIA enhancement
    $(".faq-question").on("click keydown", function (e) {
        if (e.type === "keydown" && !/(13|32)/.test(e.keyCode)) return;
        e.preventDefault();
        const isExpanded = $(this).attr("aria-expanded") === "true";
        $(this).attr("aria-expanded", !isExpanded);
        $(this).toggleClass("active");
        $(this).next(".faq-answer").toggleClass("show");
    }).attr("tabindex", "0").attr("role", "button").attr("aria-expanded", "false");

    // Jump to Top Button: add aria-label for accessibility
    $("#jumpToTop").attr("aria-label", "Scroll to Top");

    // Scroll to Top Button Behavior
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $("#jumpToTop").addClass("visible");
        } else {
            $("#jumpToTop").removeClass("visible");
        }
    });

    $("#jumpToTop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });

    // Countdown Timer
    function updateCountdown() {
        const now = new Date();
        const seasonStart = new Date(2025, 5, 1); // May 1, 2025
        const diff = seasonStart - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        $("#countdown").text(`${days}d ${hours}h ${minutes}m`);

        // Current day calculation
        const serverStart = new Date(2024, 12, 31); // April 14, 2025
        const daysSinceStart = Math.floor((now - serverStart) / (1000 * 60 * 60 * 24)) + 1;
        $("#dayCount").text(daysSinceStart);

        // Progress calculation
        const totalDays = Math.floor((seasonStart - serverStart) / (1000 * 60 * 60 * 24));
        const progress = (daysSinceStart / totalDays) * 100;
        $("#progressFill").css("width", progress + "%");
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);

    // Resource Calculator
    $("#calculateBtn").click(function () {
        const currentLevel = parseInt($("#currentLevel").val());
        const targetLevel = parseInt($("#targetLevel").val());
        const currentResistance = parseInt($("#currentResistance").val());
        const targetResistance = parseInt($("#targetResistance").val());
        const proteinRate = parseInt($("#proteinRate").val());
        const crystalRate = parseInt($("#crystalRate").val());

        // Basic calculation logic
        const levelDiff = targetLevel - currentLevel;
        const resistanceDiff = targetResistance - currentResistance;

        let proteinRequired = levelDiff * 15000 + (resistanceDiff * 10000);
        let crystalRequired = levelDiff * 200 + (resistanceDiff * 150);
        let fragmentsRequired = levelDiff * 50 + (resistanceDiff * 75);

        // Apply diminishing returns for high resistance
        if (targetResistance > 65) {
            const extraResistance = targetResistance - 65;
            proteinRequired += extraResistance * 5000;
            crystalRequired += extraResistance * 100;
            fragmentsRequired += extraResistance * 50;
        }

        // Calculate time required
        const daysForProtein = Math.ceil(proteinRequired / (proteinRate * 24));
        const daysForCrystals = Math.ceil(crystalRequired / crystalRate);
        const timeRequired = Math.max(daysForProtein, daysForCrystals);

        // Display results
        $("#proteinRequired").text(proteinRequired.toLocaleString());
        $("#crystalRequired").text(crystalRequired.toLocaleString());
        $("#fragmentsRequired").text(fragmentsRequired.toLocaleString());
        $("#timeRequired").text(timeRequired + " days");

        // Generate recommendations
        let recommendations = "";
        if (daysForProtein > daysForCrystals) {
            recommendations = "Focus on improving Protein Farm production.";
        } else {
            recommendations = "Focus on increasing Mutant Crystal gathering efficiency.";
        }
        if (targetResistance > 75 && currentResistance < 60) {
            recommendations += " Consider a more gradual resistance upgrade path for better efficiency.";
        }
        $("#recommendations").text(recommendations);
    });

    // Building level selector
    $(".building-level").click(function () {
        $(this).parent().find(".building-level").removeClass("active");
        $(this).addClass("active");
    });

    if (document.getElementById("farm1")) {
        initProteinCalculator();
    }

    if (document.getElementById("adv-prot-lvl")) {
        initTier10Calculator();
    }
});

function initProteinCalculator() {
    const productionRates = {
        1: 720, 2: 1440, 3: 2160, 4: 2880, 5: 3600,
        6: 4320, 7: 5040, 8: 5760, 9: 6480, 10: 7200,
        11: 7920, 12: 8640, 13: 9360, 14: 10080, 15: 10800,
        16: 11520, 17: 12240, 18: 12960, 19: 13680, 20: 14400,
        21: 15120, 22: 15840, 23: 16560, 24: 17280, 25: 18000,
        26: 18720, 27: 19440, 28: 20160, 29: 20880, 30: 21600
    };

    function populateDropdowns() {
        const farm1 = $("#farm1");
        for (let i = 1; i <= 30; i++) {
            farm1.append($('<option>').val(i).text(`Level ${i} (${productionRates[i].toLocaleString()}/hr)`));
        }
        for (let farmNum = 2; farmNum <= 5; farmNum++) {
            const farmSelect = $(`#farm${farmNum}`);
            for (let i = 1; i <= 30; i++) {
                farmSelect.append($('<option>').val(i).text(`Level ${i} (${productionRates[i].toLocaleString()}/hr)`));
            }
        }
    }

    function updateProductionInfo() {
        for (let i = 1; i <= 5; i++) {
            const level = parseInt($(`#farm${i}`).val()) || 0;
            const infoElement = $(`#farm${i}-info`);
            const containerElement = $(`#farm${i}-container`);
            if (level > 0) {
                const rate = productionRates[level];
                infoElement.text(`${rate.toLocaleString()} units/hour`);
                containerElement.addClass('active');
            } else {
                infoElement.text('Not operational');
                containerElement.removeClass('active');
            }
        }
    }

    function calculateProduction() {
        updateProductionInfo();
        const targetAmount = parseInt($("#targetAmount").val()) || 0;
        const resultsContent = $("#results-content");
        if (targetAmount <= 0) {
            resultsContent.html(
                `<div class="empty-state"><div class="empty-state-icon">📊</div><p>Configure your farms and enter target amount</p></div>`
            );
            return;
        }

        let totalProduction = 0;
        for (let i = 1; i <= 5; i++) {
            const level = parseInt($(`#farm${i}`).val()) || 0;
            if (level > 0) {
                totalProduction += productionRates[level];
            }
        }

        if (totalProduction === 0) {
            resultsContent.html(
                `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>No active farms detected. Please configure at least one farm.</p></div>`
            );
            return;
        }

        const hoursNeeded = targetAmount / totalProduction;
        const hours = Math.floor(hoursNeeded);
        const minutes = Math.ceil((hoursNeeded - hours) * 60);
        const days = Math.floor(hoursNeeded / 24);
        const remainingHours = Math.floor(hoursNeeded % 24);

        let timeDisplay;
        if (days > 0) {
            timeDisplay = `${days}d ${remainingHours}h ${minutes}m`;
        } else if (hours === 0) {
            timeDisplay = `${minutes} minutes`;
        } else {
            timeDisplay = `${hours}h ${minutes}m`;
        }

        resultsContent.html(
            `<div class="metric"><span class="metric-label">Total Production Rate</span><span class="metric-value">${totalProduction.toLocaleString()}/hour</span></div>` +
            `<div class="metric"><span class="metric-label">Target Amount</span><span class="metric-value">${targetAmount.toLocaleString()} units</span></div>` +
            `<div class="time-estimate"><div class="time-value">${timeDisplay}</div><div class="time-label">Estimated completion time</div></div>`
        );
    }

    populateDropdowns();
    calculateProduction();

    $("#targetAmount").on("input", calculateProduction);
    $("#farm1, #farm2, #farm3, #farm4, #farm5").on("change", calculateProduction);
}

function initTier10Calculator() {
    const advancedProtectionGold = [64600000, 92300000, 92300000, 158000000, 158000000, 221000000, 221000000, 287000000, 287000000, 403000000];
    const advancedProtectionValor = [1280, 1440, 1440, 1600, 1600, 1800, 1800, 2000, 2000, 2000];
    const advancedProtectionFoodIron = [21700000, 31000000, 31000000, 53000000, 53000000, 74000000, 74000000, 96000000, 96000000, 134000000];
    const boostThreeGold = [92300000, 158000000, 158000000, 221000000, 221000000, 287000000, 287000000, 403000000, 403000000, 563000000];
    const boostThreeFoodIron = [31000000, 53000000, 53000000, 74000000, 74000000, 96000000, 96000000, 134000000, 134000000, 175000000];
    const boostThreeValor = [1440, 1600, 1600, 1800, 1800, 2000, 2000, 2200, 2200, 2400];
    const tierTenGold = 563000000;
    const tierTenFoodIron = 188000000;
    const tierTenValor = 2400;
    const maxTotalGold = 2767800000;
    const maxTotalValor = 16960;
    const maxTotalFoodIron = 922000000;

    // State variables for resource tracking
    const state = {
        prot: { val: 0, gold: 0, food: 0, iron: 0 },
        health: { val: 0, gold: 0, food: 0, iron: 0 },
        attack: { val: 0, gold: 0, food: 0, iron: 0 },
        defense: { val: 0, gold: 0, food: 0, iron: 0 }
    };

    const advProtLvl = document.getElementById('adv-prot-lvl');
    const hLvl = document.getElementById('healthLvl');
    const aLvl = document.getElementById('attackLvl');
    const dLvl = document.getElementById('defenseLvl');

    const advProtGoldResultDiv = document.getElementById('advProtGoldResultDiv');
    const advProtValorResultDiv = document.getElementById('advProtValorResultDiv');
    const advProtFoodResultDiv = document.getElementById('advProtFoodResultDiv');
    const advProtIronResultDiv = document.getElementById('advProtIronResultDiv');
    const healthGoldResultDiv = document.getElementById('healthGoldResultDiv');
    const healthValorResultDiv = document.getElementById('healthValorResultDiv');
    const healthFoodResultDiv = document.getElementById('healthFoodResultDiv');
    const healthIronResultDiv = document.getElementById('healthIronResultDiv');
    const attackGoldResultDiv = document.getElementById('attackGoldResultDiv');
    const attackValorResultDiv = document.getElementById('attackValorResultDiv');
    const attackFoodResultDiv = document.getElementById('attackFoodResultDiv');
    const attackIronResultDiv = document.getElementById('attackIronResultDiv');
    const defenseGoldResultDiv = document.getElementById('defenseGoldResultDiv');
    const defenseValorResultDiv = document.getElementById('defenseValorResultDiv');
    const defenseFoodResultDiv = document.getElementById('defenseFoodResultDiv');
    const defenseIronResultDiv = document.getElementById('defenseIronResultDiv');
    const totalGoldDiv = document.getElementById('totalGoldRemainingDiv');
    const totalValorDiv = document.getElementById('totalValorRemainingDiv');
    const totalFoodDiv = document.getElementById('totalFoodRemainingDiv');
    const totalIronDiv = document.getElementById('totalIronRemainingDiv');

    function initializeCalculator() {
        state.prot.gold = updateDiv(advProtLvl.value, advancedProtectionGold, advProtGoldResultDiv, '💰 Gold');
        state.prot.val = updateDiv(advProtLvl.value, advancedProtectionValor, advProtValorResultDiv, '🏆 Valor Badges');
        state.prot.food = updateDiv(advProtLvl.value, advancedProtectionFoodIron, advProtFoodResultDiv, '🍖 Food');
        state.prot.iron = updateDiv(advProtLvl.value, advancedProtectionFoodIron, advProtIronResultDiv, '⚙️ Iron');

        state.health.gold = updateDiv(hLvl.value, boostThreeGold, healthGoldResultDiv, '💰 Gold');
        state.health.val = updateDiv(hLvl.value, boostThreeValor, healthValorResultDiv, '🏆 Valor Badges');
        state.health.food = updateDiv(hLvl.value, boostThreeFoodIron, healthFoodResultDiv, '🍖 Food');
        state.health.iron = updateDiv(hLvl.value, boostThreeFoodIron, healthIronResultDiv, '⚙️ Iron');

        state.attack.gold = updateDiv(aLvl.value, boostThreeGold, attackGoldResultDiv, '💰 Gold');
        state.attack.val = updateDiv(aLvl.value, boostThreeValor, attackValorResultDiv, '🏆 Valor Badges');
        state.attack.food = updateDiv(aLvl.value, boostThreeFoodIron, attackFoodResultDiv, '🍖 Food');
        state.attack.iron = updateDiv(aLvl.value, boostThreeFoodIron, attackIronResultDiv, '⚙️ Iron');

        state.defense.gold = updateDiv(dLvl.value, boostThreeGold, defenseGoldResultDiv, '💰 Gold');
        state.defense.val = updateDiv(dLvl.value, boostThreeValor, defenseValorResultDiv, '🏆 Valor Badges');
        state.defense.food = updateDiv(dLvl.value, boostThreeFoodIron, defenseFoodResultDiv, '🍖 Food');
        state.defense.iron = updateDiv(dLvl.value, boostThreeFoodIron, defenseIronResultDiv, '⚙️ Iron');

        updateTotals();
    }

    function updateDiv(newValue, valuesArray, targetDiv, resource) {
        targetDiv.classList.add('updating');
        setTimeout(() => {
            const totaled = sumRange(valuesArray, newValue, valuesArray.length - 1);
            targetDiv.textContent = totaled.toLocaleString() + ' ' + resource;
            targetDiv.classList.remove('updating');
        }, 100);
        return sumRange(valuesArray, newValue, valuesArray.length - 1);
    }

    function updateTotals() {
        const totalGoldNum = state.health.gold + state.prot.gold + state.attack.gold + state.defense.gold + tierTenGold;
        const totalValorNum = state.health.val + state.prot.val + state.attack.val + state.defense.val + tierTenValor;
        const totalFoodNum = state.health.food + state.prot.food + state.attack.food + state.defense.food + tierTenFoodIron;
        const totalIronNum = state.health.iron + state.prot.iron + state.attack.iron + state.defense.iron + tierTenFoodIron;

        animateValue(totalGoldDiv, totalGoldNum);
        animateValue(totalValorDiv, totalValorNum);
        animateValue(totalFoodDiv, totalFoodNum);
        animateValue(totalIronDiv, totalIronNum);
    }

    function animateValue(element, targetValue) {
        element.classList.add('updating');
        setTimeout(() => {
            element.textContent = targetValue.toLocaleString();
            element.classList.remove('updating');
        }, 100);
    }

    function sumRange(arr, start, end) {
        if (start < 0 || end >= arr.length || start > end) {
            return 0;
        }
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += arr[i];
        }
        return sum;
    }

    function resetAll() {
        advProtLvl.value = '0';
        hLvl.value = '0';
        aLvl.value = '0';
        dLvl.value = '0';
        initializeCalculator();
        document.querySelectorAll('.tech-node').forEach(node => {
            node.style.transform = 'scale(0.98)';
            setTimeout(() => {
                node.style.transform = 'scale(1)';
            }, 150);
        });
    }

    initializeCalculator();

    advProtLvl.addEventListener('change', e => {
        state.prot.gold = updateDiv(e.target.value, advancedProtectionGold, advProtGoldResultDiv, '💰 Gold');
        state.prot.val = updateDiv(e.target.value, advancedProtectionValor, advProtValorResultDiv, '🏆 Valor Badges');
        state.prot.food = updateDiv(e.target.value, advancedProtectionFoodIron, advProtFoodResultDiv, '🍖 Food');
        state.prot.iron = updateDiv(e.target.value, advancedProtectionFoodIron, advProtIronResultDiv, '⚙️ Iron');
        updateTotals();
    });

    hLvl.addEventListener('change', e => {
        state.health.gold = updateDiv(e.target.value, boostThreeGold, healthGoldResultDiv, '💰 Gold');
        state.health.val = updateDiv(e.target.value, boostThreeValor, healthValorResultDiv, '🏆 Valor Badges');
        state.health.food = updateDiv(e.target.value, boostThreeFoodIron, healthFoodResultDiv, '🍖 Food');
        state.health.iron = updateDiv(e.target.value, boostThreeFoodIron, healthIronResultDiv, '⚙️ Iron');
        updateTotals();
    });

    aLvl.addEventListener('change', e => {
        state.attack.gold = updateDiv(e.target.value, boostThreeGold, attackGoldResultDiv, '💰 Gold');
        state.attack.val = updateDiv(e.target.value, boostThreeValor, attackValorResultDiv, '🏆 Valor Badges');
        state.attack.food = updateDiv(e.target.value, boostThreeFoodIron, attackFoodResultDiv, '🍖 Food');
        state.attack.iron = updateDiv(e.target.value, boostThreeFoodIron, attackIronResultDiv, '⚙️ Iron');
        updateTotals();
    });

    dLvl.addEventListener('change', e => {
        state.defense.gold = updateDiv(e.target.value, boostThreeGold, defenseGoldResultDiv, '💰 Gold');
        state.defense.val = updateDiv(e.target.value, boostThreeValor, defenseValorResultDiv, '🏆 Valor Badges');
        state.defense.food = updateDiv(e.target.value, boostThreeFoodIron, defenseFoodResultDiv, '🍖 Food');
        state.defense.iron = updateDiv(e.target.value, boostThreeFoodIron, defenseIronResultDiv, '⚙️ Iron');
        updateTotals();
    });

    document.querySelector('.reset-button').addEventListener('click', resetAll);
}

// Theme toggle initialization
$(document).ready(function () {
    // Initialize theme toggle click handler
    $(document).on("click", "#themeToggle", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Call the global toggle function
        if (typeof window.toggleDarkMode === 'function') {
            window.toggleDarkMode();
        }
    });

    // Keyboard support for theme toggle
    $(document).on("keydown", "#themeToggle", function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
            e.preventDefault();
            if (typeof window.toggleDarkMode === 'function') {
                window.toggleDarkMode();
            }
        }
    });

    // Initialize theme state when navigation loads
    $("#nav-placeholder").on("DOMNodeInserted", function () {
        const savedTheme = localStorage.getItem("theme") || 'light';
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', savedTheme === 'dark');
        }
    });
});

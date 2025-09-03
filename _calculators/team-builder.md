---
layout: single
title: "Team Builder"
permalink: /calculators/team-builder/
---

        <div class="header">
            <h1>üõ†Ô∏è Interactive Team Builder</h1>
            <p>Build and optimize your Last War: Survival formations</p>
        </div>

        <div class="team-builder-container">
            <!-- Formation Display -->
            <section class="formation-section">
                <h2>Your Formation</h2>
                <div class="formation-grid" id="formationGrid">
                    <div class="formation-slot" data-position="0">
                        <div class="slot-number">1</div>
                        <div class="slot-content">Click to add hero</div>
                    </div>
                    <div class="formation-slot" data-position="1">
                        <div class="slot-number">2</div>
                        <div class="slot-content">Click to add hero</div>
                    </div>
                    <div class="formation-slot" data-position="2">
                        <div class="slot-number">3</div>
                        <div class="slot-content">Click to add hero</div>
                    </div>
                    <div class="formation-slot" data-position="3">
                        <div class="slot-number">4</div>
                        <div class="slot-content">Click to add hero</div>
                    </div>
                    <div class="formation-slot" data-position="4">
                        <div class="slot-number">5</div>
                        <div class="slot-content">Click to add hero</div>
                    </div>
                    <div class="formation-slot" data-position="5">
                        <div class="slot-number">6</div>
                        <div class="slot-content">Click to add hero</div>
                    </div>
                </div>

                <div class="formation-stats" id="formationStats">
                    <div class="stat-item">
                        <span class="stat-label">Formation Type:</span>
                        <span class="stat-value" id="formationType">Balanced</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Synergy Score:</span>
                        <span class="stat-value" id="synergyScore">0/100</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Meta Rating:</span>
                        <span class="stat-value" id="metaRating">-</span>
                    </div>
                </div>
            </section>

            <!-- Hero Selection -->
            <section class="hero-selection">
                <h2>Available Heroes</h2>

                <div class="hero-filters">
                    <div class="filter-group">
                        <label for="tierFilter">Filter by Tier:</label>
                        <select id="tierFilter">
                            <option value="all">All Tiers</option>
                            <option value="SS">SS Tier</option>
                            <option value="S">S Tier</option>
                            <option value="A">A Tier</option>
                            <option value="B">B Tier</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="roleFilter">Filter by Role:</label>
                        <select id="roleFilter">
                            <option value="all">All Roles</option>
                            <option value="Tank">Tank</option>
                            <option value="DPS">DPS</option>
                            <option value="Support">Support</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="troopFilter">Filter by Troop Type:</label>
                        <select id="troopFilter">
                            <option value="all">All Types</option>
                            <option value="Infantry">Infantry</option>
                            <option value="Vehicle">Vehicle</option>
                            <option value="Aircraft">Aircraft</option>
                            <option value="Missile">Missile</option>
                        </select>
                    </div>
                </div>

                <div class="hero-grid" id="heroGrid">
                    <!-- Heroes will be populated by JavaScript -->
                </div>
            </section>

            <!-- Preset Formations -->
            <section class="presets-section">
                <h2>üìã Meta Formations</h2>
                <div class="preset-grid">
                    <div class="preset-card" data-preset="tank-heavy">
                        <h3>üõ°Ô∏è Tank Heavy (S4 Meta)</h3>
                        <p>Kimberly, Schuyler, Glenn + DPS</p>
                        <div class="preset-stats">Meta Rating: 95/100</div>
                        <button aria-label="Load Formation" class="load-preset-btn">Load Formation</button>
                    </div>

                    <div class="preset-card" data-preset="balanced">
                        <h3>‚öñÔ∏è Balanced</h3>
                        <p>2 Tank, 2 DPS, 2 Support</p>
                        <div class="preset-stats">Meta Rating: 80/100</div>
                        <button aria-label="Load Formation" class="load-preset-btn">Load Formation</button>
                    </div>

                    <div class="preset-card" data-preset="glass-cannon">
                        <h3>üí• Glass Cannon</h3>
                        <p>1 Tank, 4 DPS, 1 Support</p>
                        <div class="preset-stats">Meta Rating: 60/100</div>
                        <button aria-label="Load Formation" class="load-preset-btn">Load Formation</button>
                    </div>
                </div>
            </section>

            <!-- Analysis Panel -->
            <section class="analysis-panel">
                <h2>üìä Formation Analysis</h2>
                <div class="analysis-content" id="analysisContent">
                    <div class="analysis-item">
                        <h3>Strengths</h3>
                        <ul id="strengthsList">
                            <li>Select heroes to see analysis</li>
                        </ul>
                    </div>

                    <div class="analysis-item">
                        <h3>Weaknesses</h3>
                        <ul id="weaknessesList">
                            <li>Select heroes to see analysis</li>
                        </ul>
                    </div>

                    <div class="analysis-item">
                        <h3>Recommendations</h3>
                        <ul id="recommendationsList">
                            <li>Select heroes to see recommendations</li>
                        </ul>
                    </div>
                </div>

                <div class="share-section">
                    <button aria-label="üì§ Share Formation" id="shareFormation" class="btn-primary">üì§ Share Formation</button>
                    <button aria-label="üíæ Save Build" id="saveFormation" class="btn-secondary">üíæ Save Build</button>
                    <button aria-label="üóëÔ∏è Clear All" id="clearFormation" class="btn-danger">üóëÔ∏è Clear All</button>
                </div>
            </section>
        </div>

    <div id="footer-placeholder"></div>

        <script src="../assets/js/storage-utils.js?v=20250828" defer></script>
    <script src="../assets/js/script.js?v=20250828" defer></script>

    <script>
        // Team Builder JavaScript
        const heroes = [
            // SS Tier Heroes
            { name: "Kimberly", tier: "SS", role: "Tank", troopType: "Infantry", power: 95, cost: "$1", synergy: ["Schuyler", "Glenn"], image: "kimberly.jpg" },
            { name: "DVA", tier: "SS", role: "DPS", troopType: "Aircraft", power: 98, cost: "F2P", synergy: ["Morrison", "Tesla"], image: "dva.jpg" },
            { name: "Schuyler", tier: "SS", role: "Tank", troopType: "Infantry", power: 92, cost: "Medium", synergy: ["Kimberly", "Glenn"], image: "schuyler.jpg" },

            // S Tier Heroes
            { name: "Glenn", tier: "S", role: "Tank", troopType: "Infantry", power: 88, cost: "F2P", synergy: ["Kimberly", "Schuyler"], image: "glenn.jpg" },
            { name: "Tesla", tier: "S", role: "DPS", troopType: "Missile", power: 90, cost: "F2P", synergy: ["Fiona", "DVA"], image: "tesla.jpg" },
            { name: "Mason", tier: "S", role: "Support", troopType: "Infantry", power: 85, cost: "F2P", synergy: ["Any"], image: "mason.jpg" },
            { name: "Morrison", tier: "S", role: "DPS", troopType: "Aircraft", power: 87, cost: "Medium", synergy: ["DVA"], image: "morrison.jpg" },
            { name: "Fiona", tier: "S", role: "DPS", troopType: "Missile", power: 86, cost: "Medium", synergy: ["Tesla"], image: "fiona.jpg" },

            // A Tier Heroes
            { name: "Marshall", tier: "A", role: "Tank", troopType: "Infantry", power: 82, cost: "F2P", synergy: ["Mason"], image: "marshall.jpg" },
            { name: "Violet", tier: "A", role: "Support", troopType: "Infantry", power: 80, cost: "F2P", synergy: ["Mason"], image: "violet.jpg" },
            { name: "Williams", tier: "A", role: "DPS", troopType: "Vehicle", power: 79, cost: "Medium", synergy: [], image: "williams.jpg" },
            { name: "Murphy", tier: "A", role: "Support", troopType: "Infantry", power: 78, cost: "Medium", synergy: ["Marshall"], image: "murphy.jpg" }
        ];

        const formations = {
            "tank-heavy": [
                { position: 0, hero: "Kimberly" },
                { position: 1, hero: "Schuyler" },
                { position: 2, hero: "Glenn" },
                { position: 3, hero: "DVA" },
                { position: 4, hero: "Mason" },
                { position: 5, hero: "Tesla" }
            ],
            "balanced": [
                { position: 0, hero: "Kimberly" },
                { position: 1, hero: "Marshall" },
                { position: 2, hero: "DVA" },
                { position: 3, hero: "Tesla" },
                { position: 4, hero: "Mason" },
                { position: 5, hero: "Violet" }
            ],
            "glass-cannon": [
                { position: 0, hero: "Glenn" },
                { position: 1, hero: "DVA" },
                { position: 2, hero: "Tesla" },
                { position: 3, hero: "Morrison" },
                { position: 4, hero: "Fiona" },
                { position: 5, hero: "Mason" }
            ]
        };

        let currentFormation = [null, null, null, null, null, null];
        let selectedSlot = null;

        // Initialize Team Builder
        $(document).ready(function () {
            renderHeroGrid();
            setupEventListeners();
            updateFormationAnalysis();
        });

        function renderHeroGrid() {
            const heroGrid = document.getElementById('heroGrid');
            const tierFilter = document.getElementById('tierFilter').value;
            const roleFilter = document.getElementById('roleFilter').value;
            const troopFilter = document.getElementById('troopFilter').value;

            let filteredHeroes = heroes.filter(hero => {
                return (tierFilter === 'all' || hero.tier === tierFilter) &&
                    (roleFilter === 'all' || hero.role === roleFilter) &&
                    (troopFilter === 'all' || hero.troopType === troopFilter);
            });

            heroGrid.innerHTML = filteredHeroes.map(hero => `
            <div class="hero-card" data-hero="${hero.name}">
                <div class="hero-tier ${hero.tier.toLowerCase()}">${hero.tier}</div>
                <div class="hero-image">
                    <img src="../assets/images/heroes/${hero.image}" alt="${hero.name || 'Hero portrait'}" width="128" height="128" loading="lazy" onerror="this.src='../assets/images/hero-placeholder.jpg'">
                </div>
                <h3>${hero.name}</h3>
                <div class="hero-details">
                    <div class="hero-role ${hero.role.toLowerCase()}">${hero.role}</div>
                    <div class="hero-troop">${hero.troopType}</div>
                    <div class="hero-cost">${hero.cost}</div>
                </div>
                <div class="hero-power">Power: ${hero.power}</div>
            </div>
        `).join('');
        }

        function setupEventListeners() {
            // Formation slot clicks
            document.querySelectorAll('.formation-slot').forEach(slot => {
                slot.addEventListener('click', function () {
                    selectedSlot = parseInt(this.dataset.position);
                    document.querySelectorAll('.formation-slot').forEach(s => s.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // Hero card clicks
            document.addEventListener('click', function (e) {
                if (e.target.closest('.hero-card')) {
                    const heroName = e.target.closest('.hero-card').dataset.hero;
                    if (selectedSlot !== null) {
                        addHeroToFormation(selectedSlot, heroName);
                    }
                }
            });

            // Filter changes
            ['tierFilter', 'roleFilter', 'troopFilter'].forEach(filterId => {
                document.getElementById(filterId).addEventListener('change', renderHeroGrid);
            });

            // Preset formation buttons
            document.querySelectorAll('.load-preset-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const preset = this.closest('.preset-card').dataset.preset;
                    loadPresetFormation(preset);
                });
            });

            // Action buttons
            document.getElementById('shareFormation').addEventListener('click', shareFormation);
            document.getElementById('saveFormation').addEventListener('click', saveFormation);
            document.getElementById('clearFormation').addEventListener('click', clearFormation);
        }

        function addHeroToFormation(position, heroName) {
            const hero = heroes.find(h => h.name === heroName);
            currentFormation[position] = hero;

            updateFormationDisplay();
            updateFormationAnalysis();
        }

        function updateFormationDisplay() {
            document.querySelectorAll('.formation-slot').forEach((slot, index) => {
                const hero = currentFormation[index];
                if (hero) {
                    slot.innerHTML = `
                    <div class="slot-number">${index + 1}</div>
                    <div class="hero-in-slot">
                        <img src="../assets/images/heroes/${hero.image}" alt="${hero.name || 'Hero portrait'}" width="128" height="128" loading="lazy" onerror="this.src='../assets/images/hero-placeholder.jpg'">
                        <div class="hero-name">${hero.name}</div>
                        <div class="hero-role ${hero.role.toLowerCase()}">${hero.role}</div>
                    </div>
                    <button aria-label="√ó" class="remove-hero" onclick="removeHero(${index})">√ó</button>
                `;
                    slot.classList.add('filled');
                } else {
                    slot.innerHTML = `
                    <div class="slot-number">${index + 1}</div>
                    <div class="slot-content">Click to add hero</div>
                `;
                    slot.classList.remove('filled');
                }
            });
        }

        function removeHero(position) {
            currentFormation[position] = null;
            updateFormationDisplay();
            updateFormationAnalysis();
        }

        function updateFormationAnalysis() {
            const activeHeroes = currentFormation.filter(hero => hero !== null);

            // Calculate formation type
            const roles = activeHeroes.map(h => h.role);
            const tankCount = roles.filter(r => r === 'Tank').length;
            const dpsCount = roles.filter(r => r === 'DPS').length;
            const supportCount = roles.filter(r => r === 'Support').length;

            let formationType = 'Empty';
            if (activeHeroes.length > 0) {
                if (tankCount >= 3) formationType = 'Tank Heavy';
                else if (dpsCount >= 3) formationType = 'DPS Heavy';
                else if (tankCount === 2 && dpsCount === 2) formationType = 'Balanced';
                else formationType = 'Mixed';
            }

            // Calculate synergy score
            let synergyScore = 0;
            activeHeroes.forEach(hero => {
                activeHeroes.forEach(otherHero => {
                    if (hero !== otherHero && hero.synergy.includes(otherHero.name)) {
                        synergyScore += 15;
                    }
                });
            });

            // Calculate meta rating
            let metaRating = 'D';
            if (activeHeroes.length >= 4) {
                const avgPower = activeHeroes.reduce((sum, h) => sum + h.power, 0) / activeHeroes.length;
                if (avgPower >= 90) metaRating = 'S';
                else if (avgPower >= 85) metaRating = 'A';
                else if (avgPower >= 80) metaRating = 'B';
                else metaRating = 'C';
            }

            // Update display
            document.getElementById('formationType').textContent = formationType;
            document.getElementById('synergyScore').textContent = `${Math.min(synergyScore, 100)}/100`;
            document.getElementById('metaRating').textContent = metaRating;

            // Update analysis
            updateStrengthsWeaknesses(activeHeroes, tankCount, dpsCount, supportCount);
        }

        function updateStrengthsWeaknesses(heroes, tankCount, dpsCount, supportCount) {
            const strengths = [];
            const weaknesses = [];
            const recommendations = [];

            if (heroes.length === 0) {
                document.getElementById('strengthsList').innerHTML = '<li>Select heroes to see analysis</li>';
                document.getElementById('weaknessesList').innerHTML = '<li>Select heroes to see analysis</li>';
                document.getElementById('recommendationsList').innerHTML = '<li>Select heroes to see recommendations</li>';
                return;
            }

            // Analyze strengths
            if (tankCount >= 3) strengths.push('High survivability with tank-heavy formation');
            if (heroes.some(h => h.name === 'Kimberly')) strengths.push('Kimberly provides excellent Season 4 meta value');
            if (heroes.some(h => h.name === 'DVA')) strengths.push('DVA offers top-tier damage output');
            if (supportCount >= 1) strengths.push('Good team sustainability with support heroes');

            // Check for synergies
            const synergyPairs = [];
            heroes.forEach(hero => {
                heroes.forEach(otherHero => {
                    if (hero !== otherHero && hero.synergy.includes(otherHero.name)) {
                        synergyPairs.push(`${hero.name} + ${otherHero.name}`);
                    }
                });
            });
            if (synergyPairs.length > 0) strengths.push(`Strong synergies: ${synergyPairs.join(', ')}`);

            // Analyze weaknesses
            if (tankCount === 0) weaknesses.push('No tanks - formation will be very fragile');
            if (supportCount === 0) weaknesses.push('No support - limited healing and sustainability');
            if (dpsCount <= 1) weaknesses.push('Low damage output - battles will be slow');
            if (heroes.length < 6) weaknesses.push(`Formation incomplete - ${6 - heroes.length} slots empty`);

            // Generate recommendations
            if (tankCount === 0) recommendations.push('Add at least one tank (Kimberly, Schuyler, or Glenn)');
            if (supportCount === 0) recommendations.push('Add Mason for healing and team buffs');
            if (!heroes.some(h => h.tier === 'SS')) recommendations.push('Include at least one SS-tier hero for meta relevance');
            if (heroes.length < 6) recommendations.push('Fill remaining slots for optimal formation');

            // Update DOM
            document.getElementById('strengthsList').innerHTML = strengths.length > 0 ?
                strengths.map(s => `<li>${s}</li>`).join('') : '<li>No significant strengths identified</li>';

            document.getElementById('weaknessesList').innerHTML = weaknesses.length > 0 ?
                weaknesses.map(w => `<li>${w}</li>`).join('') : '<li>No major weaknesses found</li>';

            document.getElementById('recommendationsList').innerHTML = recommendations.length > 0 ?
                recommendations.map(r => `<li>${r}</li>`).join('') : '<li>Formation looks good!</li>';
        }

        function loadPresetFormation(presetName) {
            const preset = formations[presetName];
            if (!preset) return;

            // Clear current formation
            currentFormation = [null, null, null, null, null, null];

            // Load preset heroes
            preset.forEach(({ position, hero: heroName }) => {
                const hero = heroes.find(h => h.name === heroName);
                if (hero) {
                    currentFormation[position] = hero;
                }
            });

            updateFormationDisplay();
            updateFormationAnalysis();
        }

        function shareFormation() {
            const activeHeroes = currentFormation.filter(hero => hero !== null);
            if (activeHeroes.length === 0) {
                alert('Add some heroes to your formation first!');
                return;
            }

            const formationData = {
                heroes: currentFormation.map(hero => hero ? hero.name : null),
                timestamp: new Date().toISOString()
            };

            const shareUrl = `${window.location.origin}${window.location.pathname}?formation=${btoa(JSON.stringify(formationData))}`;

            if (navigator.share) {
                navigator.share({
                    title: 'My Last War: Survival Formation',
                    text: `Check out my formation: ${activeHeroes.map(h => h.name).join(', ')}`,
                    url: shareUrl
                });
            } else {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert('Formation link copied to clipboard!');
                });
            }
        }

        function saveFormation() {
            const activeHeroes = currentFormation.filter(hero => hero !== null);
            if (activeHeroes.length === 0) {
                alert('Add some heroes to your formation first!');
                return;
            }

            const savedFormations = JSON.parse(localStorage.getItem('lastWarFormations') || '[]');
            const formationName = prompt('Enter a name for this formation:');

            if (formationName) {
                savedFormations.push({
                    name: formationName,
                    heroes: currentFormation.map(hero => hero ? hero.name : null),
                    created: new Date().toISOString()
                });

                localStorage.setItem('lastWarFormations', JSON.stringify(savedFormations));
                alert('Formation saved successfully!');
            }
        }

        function clearFormation() {
            if (confirm('Are you sure you want to clear the current formation?')) {
                currentFormation = [null, null, null, null, null, null];
                updateFormationDisplay();
                updateFormationAnalysis();
            }
        }

        // Load formation from URL if present
        function loadFormationFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const formationParam = urlParams.get('formation');

            if (formationParam) {
                try {
                    const formationData = JSON.parse(atob(formationParam));
                    formationData.heroes.forEach((heroName, index) => {
                        if (heroName) {
                            const hero = heroes.find(h => h.name === heroName);
                            if (hero) {
                                currentFormation[index] = hero;
                            }
                        }
                    });
                    updateFormationDisplay();
                    updateFormationAnalysis();
                } catch (e) {
                    console.error('Failed to load formation from URL:', e);
                }
            }
        }

        // Initialize with URL formation if present
        $(document).ready(function () {
            loadFormationFromUrl();
        });
    </script>



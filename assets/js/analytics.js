// Enhanced Gaming Analytics for Last War Tools
class LastWarAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.userId = this.getOrCreateUserId();
        this.currentPage = window.location.pathname;
        this.calculatorSessions = new Map();
        this.init();
    }

    init() {
        // Initialize Google Analytics 4 with gaming events
        if (typeof gtag !== 'undefined') {
            this.setupGA4Gaming();
        }

        // Track page performance
        this.trackPagePerformance();

        // Setup calculator-specific tracking
        this.setupCalculatorTracking();

        // Track user engagement patterns
        this.setupEngagementTracking();

        // Track PWA installation
        this.setupPWATracking();
    }

    setupGA4Gaming() {
        // Configure GA4 for gaming site
        gtag('config', 'GA_MEASUREMENT_ID', {
            custom_map: {
                'custom_parameter_1': 'calculator_type',
                'custom_parameter_2': 'tool_efficiency',
                'custom_parameter_3': 'user_progression'
            },
            user_properties: {
                gaming_site_user: true,
                last_war_player: true
            }
        });

        // Track initial page load with gaming context
        this.trackEvent('page_view_gaming', {
            page_title: document.title,
            page_location: window.location.href,
            site_type: 'gaming_tools',
            game_name: 'last_war_survival'
        });
    }

    // Track calculator usage patterns
    setupCalculatorTracking() {
        // Enhanced protein calculator tracking
        if (document.getElementById('farm1')) {
            this.trackCalculatorStart('protein_farm');
            this.setupProteinCalculatorEvents();
        }

        // Enhanced T10 calculator tracking
        if (document.getElementById('adv-prot-lvl')) {
            this.trackCalculatorStart('tier10_research');
            this.setupT10CalculatorEvents();
        }

        // Track any new calculators
        this.setupGenericCalculatorTracking();
    }

    setupProteinCalculatorEvents() {
        const calculator = this;

        // Track farm configuration changes
        ['farm1', 'farm2', 'farm3', 'farm4', 'farm5'].forEach(farmId => {
            const farmSelect = document.getElementById(farmId);
            if (farmSelect) {
                farmSelect.addEventListener('change', function () {
                    calculator.trackEvent('protein_farm_configured', {
                        farm_number: farmId.replace('farm', ''),
                        farm_level: this.value,
                        calculator_type: 'protein_farm'
                    });
                });
            }
        });

        // Track target amount inputs with efficiency scoring
        const targetInput = document.getElementById('targetAmount');
        if (targetInput) {
            let inputTimer;
            targetInput.addEventListener('input', function () {
                clearTimeout(inputTimer);
                inputTimer = setTimeout(() => {
                    calculator.trackEvent('protein_target_set', {
                        target_amount: this.value,
                        calculator_type: 'protein_farm',
                        efficiency_category: calculator.categorizeProteinEfficiency(this.value)
                    });
                }, 1000);
            });
        }

        // Track calculation completion
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                calculator.trackCalculatorCompletion('protein_farm');
            });
        }
    }

    setupT10CalculatorEvents() {
        const calculator = this;
        const selectors = ['adv-prot-lvl', 'healthLvl', 'attackLvl', 'defenseLvl'];

        selectors.forEach(selectorId => {
            const element = document.getElementById(selectorId);
            if (element) {
                element.addEventListener('change', function () {
                    calculator.trackEvent('tier10_research_selected', {
                        research_type: selectorId.replace('Lvl', '').replace('adv-prot-', 'advanced_protection'),
                        research_level: this.value,
                        calculator_type: 'tier10_research'
                    });
                });
            }
        });

        // Track reset button usage
        const resetBtn = document.querySelector('.reset-button');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                calculator.trackEvent('tier10_calculator_reset', {
                    calculator_type: 'tier10_research',
                    session_duration: Date.now() - calculator.sessionStart
                });
            });
        }
    }

    setupGenericCalculatorTracking() {
        // Track any form submissions as potential new calculators
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackEvent('calculator_form_submitted', {
                    form_id: e.target.id || 'unknown',
                    page_path: window.location.pathname
                });
            }
        });

        // Track dropdown changes on calculator pages
        document.addEventListener('change', (e) => {
            if (e.target.tagName === 'SELECT' && this.isCalculatorPage()) {
                this.trackEvent('calculator_input_changed', {
                    input_type: 'select',
                    input_id: e.target.id,
                    new_value: e.target.value,
                    page_path: window.location.pathname
                });
            }
        });
    }

    setupEngagementTracking() {
        // Track scroll depth (important for long guides)
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
                maxScrollDepth = scrollDepth;
                this.trackEvent('scroll_depth', {
                    scroll_depth: scrollDepth,
                    page_type: this.getPageType()
                });
            }
        });

        // Track time on page milestones
        [30, 60, 180, 300].forEach(seconds => {
            setTimeout(() => {
                this.trackEvent('engagement_milestone', {
                    time_on_page: seconds,
                    page_type: this.getPageType(),
                    still_active: this.isUserActive()
                });
            }, seconds * 1000);
        });

        // Track navigation menu usage
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link')) {
                this.trackEvent('navigation_click', {
                    nav_item: e.target.textContent.trim(),
                    nav_type: e.target.closest('.dropdown-menu') ? 'dropdown' : 'main'
                });
            }
        });
    }

    setupPWATracking() {
        // Track PWA installation prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            this.trackEvent('pwa_install_prompt_shown', {
                platform: this.getPlatform()
            });
        });

        // Track PWA usage
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.trackEvent('pwa_usage', {
                display_mode: 'standalone',
                session_start: true
            });
        }
    }

    // Utility methods
    trackCalculatorStart(calculatorType) {
        const sessionId = this.generateSessionId();
        this.calculatorSessions.set(calculatorType, {
            sessionId,
            startTime: Date.now(),
            interactions: 0
        });

        this.trackEvent('calculator_session_start', {
            calculator_type: calculatorType,
            session_id: sessionId,
            user_type: this.getUserType()
        });
    }

    trackCalculatorCompletion(calculatorType) {
        const session = this.calculatorSessions.get(calculatorType);
        if (session) {
            const duration = Date.now() - session.startTime;
            this.trackEvent('calculator_session_complete', {
                calculator_type: calculatorType,
                session_id: session.sessionId,
                session_duration: duration,
                interactions: session.interactions,
                completion_rate: 100 // Completed
            });
        }
    }

    trackEvent(eventName, parameters = {}) {
        // Enhanced event tracking with gaming-specific context
        const enhancedParams = {
            ...parameters,
            timestamp: Date.now(),
            session_id: this.userId,
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            is_mobile: window.innerWidth < 768,
            page_load_time: this.getPageLoadTime()
        };

        // Send to Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, enhancedParams);
        }

        // Send to console for debugging
        console.log(`[Analytics] ${eventName}:`, enhancedParams);

        // Store locally for offline analysis
        this.storeEventLocally(eventName, enhancedParams);
    }

    // Helper methods
    categorizeProteinEfficiency(targetAmount) {
        const amount = parseInt(targetAmount);
        if (amount < 50000) return 'small_upgrade';
        if (amount < 200000) return 'medium_upgrade';
        if (amount < 500000) return 'large_upgrade';
        return 'massive_upgrade';
    }

    isCalculatorPage() {
        return window.location.pathname.includes('calculator') ||
            document.querySelector('#farm1, #adv-prot-lvl, .calculator');
    }

    getPageType() {
        const path = window.location.pathname;
        if (path.includes('calculator')) return 'calculator';
        if (path.includes('guides') || path.includes('tips') || path.includes('heroes')) return 'guide';
        if (path === '/' || path === '/index.html') return 'homepage';
        return 'other';
    }

    getUserType() {
        // Determine user type based on behavior
        const visits = localStorage.getItem('visit_count') || 0;
        if (visits < 3) return 'new_user';
        if (visits < 10) return 'returning_user';
        return 'power_user';
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('lw_user_id');
        if (!userId) {
            userId = 'lw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('lw_user_id', userId);
        }

        // Increment visit count
        const visits = parseInt(localStorage.getItem('visit_count') || '0') + 1;
        localStorage.setItem('visit_count', visits);

        return userId;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    getPlatform() {
        if (/Android/i.test(navigator.userAgent)) return 'android';
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return 'ios';
        if (/Windows/i.test(navigator.userAgent)) return 'windows';
        if (/Mac/i.test(navigator.userAgent)) return 'mac';
        return 'other';
    }

    getPageLoadTime() {
        if (window.performance && window.performance.timing) {
            return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        }
        return 0;
    }

    isUserActive() {
        // Simple activity detection
        return Date.now() - this.lastActivity < 30000; // 30 seconds
    }

    storeEventLocally(eventName, parameters) {
        try {
            const events = JSON.parse(localStorage.getItem('lw_analytics_events') || '[]');
            events.push({ event: eventName, params: parameters, timestamp: Date.now() });

            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }

            localStorage.setItem('lw_analytics_events', JSON.stringify(events));
        } catch (error) {
            console.warn('Failed to store analytics event locally:', error);
        }
    }

    trackPagePerformance() {
        // Track Core Web Vitals and gaming-specific metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        this.trackEvent('page_performance', {
                            dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            load_complete: perfData.loadEventEnd - perfData.loadEventStart,
                            first_paint: this.getFirstPaint(),
                            page_type: this.getPageType()
                        });
                    }
                }, 1000);
            });
        }
    }

    getFirstPaint() {
        try {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return firstPaint ? firstPaint.startTime : 0;
        } catch (error) {
            return 0;
        }
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.lastWarAnalytics = new LastWarAnalytics();
});

// Activity tracking
let lastActivity = Date.now();
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => {
        lastActivity = Date.now();
        if (window.lastWarAnalytics) {
            window.lastWarAnalytics.lastActivity = lastActivity;
        }
    }, { passive: true });
});

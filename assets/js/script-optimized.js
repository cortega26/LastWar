// LastWar Tools - Main Script (Optimized)
// Core functionality with performance improvements

(function() {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCore);
    } else {
        initCore();
    }

    function initCore() {
        const SiteCore = {
            init() {
                this.loadPartials();
                this.setupThemeToggle();
                this.setupNavigation();
                this.setupAnimations();
                this.trackPageView();

                console.log('✅ Core functionality initialized');
            },

            // Load navigation and footer
            async loadPartials() {
                const loadPartial = async (placeholder, file) => {
                    const element = document.getElementById(placeholder);
                    if (!element) return;

                    try {
                        const response = await fetch(file);
                        if (response.ok) {
                            const html = await response.text();
                            element.innerHTML = html;

                            // Initialize nav-specific features
                            if (placeholder === 'nav-placeholder') {
                                this.initNavFeatures();
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to load ${file}:`, error);
                    }
                };

                await Promise.all([
                    loadPartial('nav-placeholder', '/partials/nav.html'),
                    loadPartial('footer-placeholder', '/partials/footer.html')
                ]);
            },

            initNavFeatures() {
                // Mobile menu toggle
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                const navMenu = document.querySelector('.nav-menu');

                if (menuToggle && navMenu) {
                    menuToggle.addEventListener('click', () => {
                        navMenu.classList.toggle('active');
                        menuToggle.setAttribute('aria-expanded',
                            navMenu.classList.contains('active'));
                    });
                }

                // Active page highlighting
                const currentPath = window.location.pathname;
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    if (link.getAttribute('href') === currentPath) {
                        link.classList.add('active');
                    }
                });
            },

            setupThemeToggle() {
                const themeToggle = document.getElementById('theme-toggle');
                if (!themeToggle) return;

                const currentTheme = localStorage.getItem('theme') || 'dark';
                themeToggle.setAttribute('aria-pressed', currentTheme === 'dark');

                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    const newTheme = current === 'dark' ? 'light' : 'dark';

                    document.documentElement.setAttribute(
                        'data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');

                    // Smooth transition
                    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                    setTimeout(() => {
                        document.body.style.transition = '';
                    }, 300);
                });
            },

            setupNavigation() {
                // Smooth scroll for anchor links
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a[href^="#"]');
                    if (link) {
                        e.preventDefault();
                        const target = document.querySelector(link.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView(
                                { behavior: 'smooth', block: 'start' });
                        }
                    }
                });

                // Scroll to top button
                const scrollButton = document.createElement('button');
                scrollButton.className = 'scroll-to-top';
                scrollButton.innerHTML = '↑';
                scrollButton.setAttribute('aria-label', 'Scroll to top');
                scrollButton.style.display = 'none';
                document.body.appendChild(scrollButton);

                let scrollTimeout;
                window.addEventListener('scroll', () => {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        scrollButton.style.display = window.scrollY > 300 ? 'block' : 'none';
                    }, 100);
                });

                scrollButton.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            },

            setupAnimations() {
                // Intersection Observer for fade-in animations
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                // Observe elements with fade-in class
                document.querySelectorAll('.fade-in').forEach(el => {
                    observer.observe(el);
                });
            },

            trackPageView() {
                // Google Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_view', {
                        page_title: document.title,
                        page_location: window.location.href,
                        page_path: window.location.pathname
                    });
                }
            }
        };

        // Initialize
        SiteCore.init();

        // Expose globally
        window.SiteCore = SiteCore;
    }
})();
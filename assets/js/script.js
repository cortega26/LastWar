/**
 * Last War Tools - Unified Navigation & Component Loader
 * Handles dynamic loading of nav/footer with proper path resolution
 */

(function(global) {
    'use strict';
    const configUrl = '/assets/js/partials.config.json';
    const partialPaths = {
        nav: '/partials/nav.html',
        footer: '/partials/footer.html'
    };

    let partialsLoaded = false;

    // Partial loader using fetch and vanilla DOM
    function loadPartials() {
        if (partialsLoaded) return;
        partialsLoaded = true;

        const savedTheme = localStorage.getItem("theme");

        fetch(configUrl)
            .then(r => r.json())
            .then(cfg => {
                partialPaths.nav = cfg.nav || partialPaths.nav;
                partialPaths.footer = cfg.footer || partialPaths.footer;
            })
            .catch(() => {})
            .finally(() => {
                fetch(partialPaths.nav)
                    .then(r => {
                        if (!r.ok) throw r;
                        return r.text();
                    })
                    .then(html => {
                        const navContainer = document.getElementById('nav-placeholder');
                        if (navContainer) {
                            navContainer.insertAdjacentHTML('afterbegin', html);
                        }
                        if (savedTheme === "dark" || savedTheme === "light") {
                            const toggle = document.getElementById('themeToggle');
                            if (toggle) {
                                toggle.setAttribute('aria-pressed', savedTheme === "dark");
                            }
                        }
                        markCurrentNav();
                        initNavigationInteractions();
                    })
                    .catch(() => {
                        const navContainer = document.getElementById('nav-placeholder');
                        if (navContainer) {
                            navContainer.innerHTML = `
                                <nav style="background:#1a1a2e;padding:1rem;">
                                    <a href="/index.html" style="color:#fff;text-decoration:none;font-weight:bold;">Home</a>
                                </nav>
                            `;
                        }
                    });

                fetch(partialPaths.footer)
                    .then(r => {
                        if (!r.ok) throw r;
                        return r.text();
                    })
                    .then(html => {
                        const footerContainer = document.getElementById('footer-placeholder');
                        if (footerContainer) {
                            footerContainer.insertAdjacentHTML('afterbegin', html);
                        }
                    })
                    .catch(() => {
                        const footerContainer = document.getElementById('footer-placeholder');
                        if (footerContainer) {
                            footerContainer.innerHTML = `
                                <footer style="background:#f8fafc;text-align:center;padding:1rem;border-top:1px solid #e5e7eb;">
                                    <nav><a href="/index.html">Home</a></nav>
                                </footer>
                            `;
                        }
                    });
            });
    }

    function markCurrentNav() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;
        const normalize = p => p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
        const currentPath = normalize(window.location.pathname);
        navMenu.querySelectorAll('a.nav-link').forEach(link => {
            const normalizedHref = normalize(link.getAttribute('href'));
            if (normalizedHref === currentPath) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Navigation interaction handlers
    function initNavigationInteractions() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isActive = navMenu.classList.contains('active');
                navMenu.classList.toggle('active');
                navToggle.setAttribute('aria-expanded', String(!isActive));
            });
        }

        document.querySelectorAll('.nav-item.dropdown > .submenu-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = btn.parentElement;
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    dropdown.classList.toggle('active');
                    dropdownMenu.classList.toggle('show');
                    btn.setAttribute('aria-expanded', String(dropdown.classList.contains('active')));
                }
            });
        });

        document.querySelectorAll('.nav-item.dropdown').forEach(item => {
            const handleEnter = () => {
                if (window.innerWidth > 768) {
                    const toggle = item.querySelector('.submenu-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'true');
                    item.classList.add('active');
                    const menu = item.querySelector('.dropdown-menu');
                    if (menu) menu.classList.add('show');
                }
            };
            const handleLeave = () => {
                if (window.innerWidth > 768) {
                    const toggle = item.querySelector('.submenu-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    item.classList.remove('active');
                    const menu = item.querySelector('.dropdown-menu');
                    if (menu) menu.classList.remove('show');
                }
            };
            item.addEventListener('mouseenter', handleEnter);
            item.addEventListener('mouseleave', handleLeave);
            item.addEventListener('mouseover', handleEnter);
            item.addEventListener('mouseout', handleLeave);
        });

        document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
            link.addEventListener('keydown', (e) => {
                const key = e.key;
                const parentItem = link.parentElement;
                const dropdown = parentItem.classList.contains('dropdown') ? parentItem : null;
                if (key === 'ArrowRight') {
                    e.preventDefault();
                    const next = parentItem.nextElementSibling;
                    if (next) next.querySelector('> .nav-link').focus();
                } else if (key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = parentItem.previousElementSibling;
                    if (prev) prev.querySelector('> .nav-link').focus();
                } else if (dropdown && (key === 'Enter' || key === ' ' || key === 'ArrowDown')) {
                    e.preventDefault();
                    dropdown.classList.add('active');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) menu.classList.add('show');
                    const toggle = dropdown.querySelector('.submenu-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'true');
                    const first = menu ? menu.querySelector('a') : null;
                    if (first) first.focus();
                } else if (key === 'Escape') {
                    if (dropdown) {
                        dropdown.classList.remove('active');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        if (menu) menu.classList.remove('show');
                        const toggle = dropdown.querySelector('.submenu-toggle');
                        if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        document.querySelectorAll('.dropdown-menu a').forEach(a => {
            a.addEventListener('keydown', (e) => {
                const items = Array.from(a.closest('.dropdown-menu').querySelectorAll('a'));
                const index = items.indexOf(a);
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    items[(index + 1) % items.length].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    items[(index - 1 + items.length) % items.length].focus();
                } else if (e.key === 'Escape') {
                    const dropdown = a.closest('.nav-item.dropdown');
                    dropdown.classList.remove('active');
                    dropdown.querySelector('.dropdown-menu').classList.remove('show');
                    const toggle = dropdown.querySelector('.submenu-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    const link = dropdown.querySelector('.nav-link');
                    if (link) link.focus();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const next = a.closest('.nav-item.dropdown').nextElementSibling;
                    if (next) next.querySelector('> .nav-link').focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = a.closest('.nav-item.dropdown').previousElementSibling;
                    if (prev) prev.querySelector('> .nav-link').focus();
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                document.querySelectorAll('.nav-item.dropdown').forEach(dd => dd.classList.remove('active'));
                document.querySelectorAll('.nav-item.dropdown .submenu-toggle').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
                document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
            }
        });

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.toggleDarkMode === 'function') {
                    window.toggleDarkMode();
                }
            });
        }
    }
    
    const api = { loadPartials, initNavigationInteractions, markCurrentNav };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    const init = () => {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark" || savedTheme === "light") {
                document.documentElement.setAttribute("data-theme", savedTheme);
            }

            loadPartials();

      if (typeof window.SiteSearch !== 'undefined') {
        new window.SiteSearch();
      }

      // Register Service Worker for better repeat-visit performance
      if ('serviceWorker' in navigator) {
        // Delay slightly to avoid competing with initial rendering
        window.addEventListener('load', () => {
          const swUrl = '/sw.js?v=20250828';
          navigator.serviceWorker.register(swUrl).catch(() => {});
        });
      }
    };

    document.addEventListener('DOMContentLoaded', init);

        // Expose for manual triggering (idempotent)
        global.loadPartials = loadPartials;
        // Legacy compatibility exports
        global.loadComponents = function() {
            console.warn('loadComponents() is deprecated. Partials load automatically.');
            global.loadPartials();
        };
    }

})(typeof window !== 'undefined' ? window : this);

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

    // Partial loader that works with or without jQuery
    function loadPartials() {
        if (partialsLoaded) return;
        partialsLoaded = true;

        const savedTheme = localStorage.getItem("theme");

        if (window.$) {
            $.getJSON(configUrl)
                .done(cfg => {
                    partialPaths.nav = cfg.nav || partialPaths.nav;
                    partialPaths.footer = cfg.footer || partialPaths.footer;
                })
                .always(() => {
                    // Load navigation
                    $("#nav-placeholder").load(partialPaths.nav, function(response, status, xhr) {
                        if (status === "error") {
                            console.error("Failed to load navigation:", xhr.status, xhr.statusText);
                            $("#nav-placeholder").html(`
                                <nav style="background:#1a1a2e;padding:1rem;">
                                    <a href="/index.html" style="color:#fff;text-decoration:none;font-weight:bold;">Home</a>
                                </nav>
                            `);
                            return;
                        }

                        if (savedTheme === "dark" || savedTheme === "light") {
                            $("#themeToggle").attr("aria-pressed", savedTheme === "dark");
                        }

                        markCurrentNav();
                        initNavigationInteractions();
                    });

                    // Load footer
                    $("#footer-placeholder").load(partialPaths.footer, function(response, status, xhr) {
                        if (status === "error") {
                            console.error("Failed to load footer:", xhr.status, xhr.statusText);
                            $("#footer-placeholder").html(`
                                <footer style="background:#f8fafc;text-align:center;padding:1rem;border-top:1px solid #e5e7eb;">
                                    <nav><a href="/index.html">Home</a></nav>
                                </footer>
                            `);
                        }
                    });
                });
        } else {
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
    }

    function markCurrentNav() {
        const navMenu = $('#navMenu');
        if (!navMenu.length) return;
        const normalize = p => p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
        const currentPath = normalize(window.location.pathname);
        navMenu.find('a.nav-link').each(function() {
            const normalizedHref = normalize($(this).attr('href'));
            if (normalizedHref === currentPath) {
                $(this).attr('aria-current', 'page');
            }
        });
    }

    // Navigation interaction handlers
    function initNavigationInteractions() {
        // Mobile navigation toggle
        $(document).off('click', '#navToggle').on('click', '#navToggle', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const navMenu = $("#navMenu, .nav-menu");
            const isActive = navMenu.hasClass("active");
            
            navMenu.toggleClass("active");
            $(this).attr("aria-expanded", !isActive);
        });
        
        // Dropdown handling for mobile
        $(document).off('click', '.nav-item.dropdown > .nav-link').on('click', '.nav-item.dropdown > .nav-link', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = $(this).parent();
                const dropdownMenu = dropdown.find('.dropdown-menu');

                dropdown.toggleClass('active');
                dropdownMenu.toggleClass('show');
                $(this).attr('aria-expanded', dropdown.hasClass('active'));
            }
        });

        // Desktop hover aria sync
        $(document).off('mouseenter.nav mouseleave.nav', '.nav-item.dropdown').on('mouseenter.nav mouseleave.nav', '.nav-item.dropdown', function(e) {
            if (window.innerWidth > 768) {
                const link = $(this).children('.nav-link');
                link.attr('aria-expanded', e.type === 'mouseenter');
            }
        });

        // Keyboard navigation
        $(document).off('keydown', '.nav-item > .nav-link').on('keydown', '.nav-item > .nav-link', function(e) {
            const key = e.key;
            const parentItem = $(this).parent();
            const dropdown = parentItem.hasClass('dropdown') ? parentItem : null;
            if (key === 'ArrowRight') {
                e.preventDefault();
                parentItem.next().find('> .nav-link').focus();
            } else if (key === 'ArrowLeft') {
                e.preventDefault();
                parentItem.prev().find('> .nav-link').focus();
            } else if (dropdown && (key === 'Enter' || key === ' ' || key === 'ArrowDown')) {
                e.preventDefault();
                dropdown.addClass('active');
                dropdown.find('.dropdown-menu').addClass('show');
                $(this).attr('aria-expanded', 'true');
                dropdown.find('.dropdown-menu a').first().focus();
            } else if (key === 'Escape') {
                if (dropdown) {
                    dropdown.removeClass('active');
                    dropdown.find('.dropdown-menu').removeClass('show');
                    $(this).attr('aria-expanded', 'false');
                }
            }
        });

        $(document).off('keydown', '.dropdown-menu a').on('keydown', '.dropdown-menu a', function(e) {
            const items = $(this).closest('.dropdown-menu').find('a');
            const index = items.index(this);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                items.eq((index + 1) % items.length).focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                items.eq((index - 1 + items.length) % items.length).focus();
            } else if (e.key === 'Escape') {
                const dropdown = $(this).closest('.nav-item.dropdown');
                dropdown.removeClass('active');
                dropdown.find('.dropdown-menu').removeClass('show');
                const link = dropdown.children('.nav-link');
                link.attr('aria-expanded', 'false').focus();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                $(this).closest('.nav-item.dropdown').next().find('> .nav-link').focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                $(this).closest('.nav-item.dropdown').prev().find('> .nav-link').focus();
            }
        });
        
        // Close mobile menu when clicking outside
        $(document).off('click.navClose').on('click.navClose', function(e) {
            if (!$(e.target).closest('.nav-container').length) {
                $('.nav-menu').removeClass('active');
                $('#navToggle').attr('aria-expanded', 'false');
                $('.nav-item.dropdown').removeClass('active');
                $('.nav-item.dropdown > .nav-link').attr('aria-expanded', 'false');
                $('.dropdown-menu').removeClass('show');
            }
        });
        
        // Theme toggle handler
        $(document).off('click', '#themeToggle').on('click', '#themeToggle', function(e) {
            e.preventDefault();
            if (typeof window.toggleDarkMode === 'function') {
                window.toggleDarkMode();
            }
        });
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
        };

        if (window.$) {
            $(document).ready(init);
        } else {
            document.addEventListener('DOMContentLoaded', init);
        }

        // Expose for manual triggering (idempotent)
        global.loadPartials = loadPartials;
        // Legacy compatibility exports
        global.loadComponents = function() {
            console.warn('loadComponents() is deprecated. Partials load automatically.');
            global.loadPartials();
        };
    }

})(typeof window !== 'undefined' ? window : this);

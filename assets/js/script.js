/**
 * Last War Tools - Unified Navigation & Component Loader
 * Handles dynamic loading of nav/footer with proper path resolution
 */

(function() {
    'use strict';
    const configUrl = '/assets/js/partials.config.json';
    const partialPaths = {
        nav: '/partials/nav.html',
        footer: '/partials/footer.html'
    };
    const pagesUrl = '/assets/pages.json';

    let partialsLoaded = false;

    // Enhanced jQuery-based partial loader
    function loadPartials() {
        if (partialsLoaded) return;
        partialsLoaded = true;

        const savedTheme = localStorage.getItem("theme");

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

                    buildNavFromJson().always(initNavigationInteractions);
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
    }

    function buildNavFromJson() {
        return $.getJSON(pagesUrl)
            .done(pages => {
                const navMenu = $('#navMenu');
                if (!navMenu.length) return;
                navMenu.empty();
                pages.forEach(page => {
                    navMenu.append(
                        `<li class="nav-item"><a class="nav-link" href="${page.href}">${page.title}</a></li>`
                    );
                });
            })
            .fail(() => {
                console.warn('pages.json not found, using static navigation');
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
            }
        });
        
        // Close mobile menu when clicking outside
        $(document).off('click.navClose').on('click.navClose', function(e) {
            if (!$(e.target).closest('.nav-container').length) {
                $('.nav-menu').removeClass('active');
                $('#navToggle').attr('aria-expanded', 'false');
                $('.nav-item.dropdown').removeClass('active');
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
    
    // Initialize when document is ready
    $(document).ready(function() {
        // Apply theme immediately
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || savedTheme === "light") {
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
        
        // Load partials
        loadPartials();
        
        // Initialize search if available
        if (typeof window.SiteSearch !== 'undefined') {
            new window.SiteSearch();
        }
    });
    
    // Fallback initialization for older browsers
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof $ === 'undefined') {
                console.error('jQuery not loaded - navigation may not work properly');
                return;
            }
            loadPartials();
        });
    } else {
        if (typeof $ !== 'undefined') {
            loadPartials();
        }
    }
    
    // Expose for manual triggering (idempotent)
    window.loadPartials = loadPartials;

})();

// Legacy compatibility exports
window.loadComponents = function() {
    console.warn('loadComponents() is deprecated. Partials load automatically.');
    window.loadPartials();
};

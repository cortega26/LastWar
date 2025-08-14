// Last War Tools - Modern Frontend JavaScript
// Enhanced navigation, search integration, and interactions

$(document).ready(function() {
    'use strict';
    
    const LastWarUI = {
        // Configuration
        config: {
            breakpoint: 768,
            searchDelay: 300,
            animationDuration: 300
        },
        
        // Initialize all components
        init() {
            this.setupNavigation();
            this.setupThemeToggle();
            this.setupSearch();
            this.setupAnimations();
            this.setupAccessibility();
            this.loadPartials();
            
            console.log('🎮 Last War Tools UI initialized');
        },
        
        // Load navigation and footer partials
        loadPartials() {
            const isSubpage = window.location.pathname.includes('/pages/');
            const prefix = isSubpage ? '../' : '';
            
            // Load navigation
            $("#nav-placeholder").load(prefix + "partials/nav.html", () => {
                // Fix subpage links
                if (isSubpage) {
                    $("#nav-placeholder a").each(function() {
                        const href = $(this).attr('href');
                        if (!href.startsWith('http') && !href.startsWith('../')) {
                            $(this).attr('href', '../' + href);
                        }
                    });
                }
                
                // Re-initialize navigation after loading
                this.setupNavigation();
                this.setupSearch();
                this.setupThemeToggle();
            });
            
            // Load footer
            $("#footer-placeholder").load(prefix + "partials/footer.html");
        },
        
        // Enhanced navigation with mobile support
        setupNavigation() {
            const $navToggle = $('#navToggle');
            const $navMenu = $('#navMenu');
            const $dropdowns = $('.nav-item.dropdown');
            
            // Mobile menu toggle
            $navToggle.off('click').on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = $navToggle.attr('aria-expanded') === 'true';
                
                $navToggle.attr('aria-expanded', !isExpanded);
                $navMenu.toggleClass('active');
                
                // Close dropdowns when menu closes
                if (isExpanded) {
                    $dropdowns.removeClass('active');
                }
                
                // Prevent body scroll when menu is open
                if (!isExpanded) {
                    $('body').addClass('nav-open');
                } else {
                    $('body').removeClass('nav-open');
                }
            });
            
            // Dropdown handling
            $dropdowns.each(function() {
                const $dropdown = $(this);
                const $link = $dropdown.find('> .nav-link');
                
                // Desktop: hover behavior
                if (window.innerWidth > 768) {
                    $dropdown.off('mouseenter mouseleave').on({
                        mouseenter() {
                            $dropdown.addClass('active');
                            $link.attr('aria-expanded', 'true');
                        },
                        mouseleave() {
                            $dropdown.removeClass('active');
                            $link.attr('aria-expanded', 'false');
                        }
                    });
                }
                
                // Mobile: click behavior
                $link.off('click').on('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const isActive = $dropdown.hasClass('active');
                        
                        // Close other dropdowns
                        $dropdowns.not($dropdown).removeClass('active');
                        
                        // Toggle current dropdown
                        $dropdown.toggleClass('active');
                        $link.attr('aria-expanded', !isActive);
                    }
                });
            });
            
            // Close menu when clicking outside
            $(document).off('click.nav').on('click.nav', (e) => {
                if (!$(e.target).closest('.main-nav').length) {
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
            
            // Add active state to current page
            this.setActiveNavItem();
        },
        
        // Set active navigation item based on current page
        setActiveNavItem() {
            const currentPath = window.location.pathname;
            const fileName = currentPath.split('/').pop() || 'index.html';
            
            $('.nav-link').removeClass('active');
            $(`.nav-link[href*="${fileName}"]`).addClass('active');
        },
        
        // Enhanced theme toggle
        setupThemeToggle() {
            const $themeToggle = $('#themeToggle');
            const savedTheme = localStorage.getItem('theme');
            
            // Apply saved theme
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                $themeToggle.attr('aria-pressed', savedTheme === 'dark');
            } else {
                // Default to dark theme
                document.documentElement.setAttribute('data-theme', 'dark');
                $themeToggle.attr('aria-pressed', 'true');
                localStorage.setItem('theme', 'dark');
            }
            
            // Theme toggle handler
            $themeToggle.off('click').on('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                $themeToggle.attr('aria-pressed', newTheme === 'dark');
                
                // Animate the transition
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 300);
            });
        },
        
        // Search integration
        setupSearch() {
            // Wait for search.js to initialize
            setTimeout(() => {
                if (window.siteSearch && window.siteSearch.isInitialized) {
                    // Move search to nav-search container
                    const $searchContainer = $('#search-container');
                    const $navSearch = $('#nav-search');
                    
                    if ($searchContainer.length && $navSearch.length) {
                        $searchContainer.appendTo($navSearch);
                        console.log('✅ Search integrated into navigation');
                    }
                } else {
                    // Retry if search isn't ready
                    setTimeout(() => this.setupSearch(), 500);
                }
            }, 100);
        },
        
        // Smooth animations and effects
        setupAnimations() {
            // Fade in animation for cards
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe cards and other elements
            $('.card, .hero-section, .feature-grid').each(function() {
                observer.observe(this);
            });
            
            // Smooth scroll for anchor links
            $('a[href^="#"]').on('click', function(e) {
                const target = $(this.getAttribute('href'));
                if (target.length) {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 100
                    }, 500);
                }
            });
        },
        
        // Accessibility enhancements
        setupAccessibility() {
            // Keyboard navigation for dropdowns
            $('.nav-link').on('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    $(this).click();
                }
            });
            
            // Skip to main content link
            $('body').prepend(
                '<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-2 focus:bg-primary focus:text-white focus:rounded">Skip to main content</a>'
            );
            
            // Add main content landmark
            if (!$('#main-content').length) {
                $('.content, main').first().attr('id', 'main-content');
            }
            
            // Announce theme changes to screen readers
            $(document).on('themeChanged', function(e, theme) {
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.className = 'sr-only';
                announcement.textContent = `Theme changed to ${theme} mode`;
                document.body.appendChild(announcement);
                setTimeout(() => announcement.remove(), 1000);
            });
        },
        
        // Utility functions
        utils: {
            // Debounce function
            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },
            
            // Check if element is in viewport
            isInViewport(element) {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            },
            
            // Format numbers with commas
            formatNumber(num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
    };
    
    // Initialize the UI
    LastWarUI.init();
    
    // Make LastWarUI globally available
    window.LastWarUI = LastWarUI;
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.log('SW registration failed:', err));
    }
    
    // Analytics loading
    const analytics = document.createElement('script');
    analytics.src = 'assets/js/analytics.js';
    analytics.defer = true;
    document.head.appendChild(analytics);
});

// Add CSS for nav-open state
const navOpenCSS = `
.nav-open {
    overflow: hidden;
}

.nav-open .nav-menu {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
}
`;

const style = document.createElement('style');
style.textContent = navOpenCSS;
document.head.appendChild(style);
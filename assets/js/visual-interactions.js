// LastWar Tools - Enhanced Visual Interactions
// Advanced animations, loading states, and user feedback

$(document).ready(function() {
    'use strict';
    
    const VisualEnhancements = {
        // Configuration
        config: {
            animationDuration: 300,
            toastDuration: 4000,
            countUpDuration: 2000,
            loadingMinDuration: 800
        },
        
        // Initialize all enhancements
        init() {
            this.setupLoadingStates();
            this.setupToastSystem();
            this.setupCountUpAnimations();
            this.setupProgressBars();
            this.setupHoverEffects();
            this.setupClickFeedback();
            this.setupSearchEnhancements();
            this.hideInitialLoader();
            
            console.log('🎨 Visual enhancements initialized');
        },
        
        // Enhanced loading system
        setupLoadingStates() {
            // Show loading overlay on page navigation
            $(document).on('click', 'a[href$=".html"]', function(e) {
                const href = $(this).attr('href');
                if (href && !href.startsWith('#') && !e.ctrlKey && !e.metaKey) {
                    VisualEnhancements.showLoading('Loading page...');
                }
            });
            
            // Form submissions
            $('form').on('submit', function() {
                VisualEnhancements.showLoading('Processing...');
            });
            
            // Tool interactions
            $('.tool-card, .btn-enhanced').on('click', function() {
                const isExternal = $(this).find('a').attr('href');
                if (isExternal && isExternal.includes('.html')) {
                    VisualEnhancements.showLoading('Initializing tool...');
                }
            });
        },
        
        showLoading(message = 'Loading...') {
            const $overlay = $('#loadingOverlay');
            $overlay.find('.loading-text').text(message);
            $overlay.addClass('active');
            
            // Auto-hide after minimum duration
            setTimeout(() => {
                this.hideLoading();
            }, this.config.loadingMinDuration);
        },
        
        hideLoading() {
            $('#loadingOverlay').removeClass('active');
        },
        
        hideInitialLoader() {
            // Hide initial loading after page is ready
            setTimeout(() => {
                this.hideLoading();
            }, 500);
        },
        
        // Toast notification system
        setupToastSystem() {
            window.showToast = this.showToast.bind(this);
        },
        
        showToast(message, type = 'info', duration = null) {
            duration = duration || this.config.toastDuration;
            
            const toastId = 'toast_' + Date.now();
            const toast = $(`
                <div class="toast ${type}" id="${toastId}">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="toast-icon">${this.getToastIcon(type)}</span>
                        <span class="toast-message">${message}</span>
                        <button class="toast-close" onclick="VisualEnhancements.closeToast('${toastId}')" style="margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer;">×</button>
                    </div>
                </div>
            `);
            
            $('#toastContainer').append(toast);
            
            // Trigger show animation
            setTimeout(() => toast.addClass('show'), 10);
            
            // Auto-remove
            setTimeout(() => {
                this.closeToast(toastId);
            }, duration);
        },
        
        closeToast(toastId) {
            const $toast = $(`#${toastId}`);
            $toast.removeClass('show');
            setTimeout(() => $toast.remove(), 300);
        },
        
        getToastIcon(type) {
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            return icons[type] || icons.info;
        },
        
        // Animated counter
        setupCountUpAnimations() {
            const counters = $('.hero-stat-number[data-count]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter($(entry.target));
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counters.each(function() {
                observer.observe(this);
            });
        },
        
        animateCounter($element) {
            const target = parseInt($element.data('count'));
            const duration = this.config.countUpDuration;
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                $element.text(this.formatNumber(Math.floor(current)));
            }, 16);
        },
        
        formatNumber(num) {
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'k';
            }
            return num.toString();
        },
        
        // Progress bar animations
        setupProgressBars() {
            const progressBars = $('.progress-fill');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $bar = $(entry.target);
                        const width = $bar.css('width');
                        $bar.css('width', '0%');
                        setTimeout(() => {
                            $bar.css('width', width);
                        }, 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            progressBars.each(function() {
                observer.observe(this);
            });
        },
        
        // Enhanced hover effects
        setupHoverEffects() {
            // Tool card hover sound effect
            $('.tool-card').hover(
                function() {
                    $(this).addClass('pulse-effect');
                },
                function() {
                    $(this).removeClass('pulse-effect');
                }
            );
            
            // Button hover effects
            $('.btn-enhanced').hover(
                function() {
                    $(this).find('.btn-icon').addClass('bounce-in');
                },
                function() {
                    $(this).find('.btn-icon').removeClass('bounce-in');
                }
            );
            
            // Add parallax effect to hero
            $(window).on('scroll', this.parallaxEffect);
        },
        
        parallaxEffect() {
            const scrolled = $(window).scrollTop();
            const rate = scrolled * -0.5;
            $('.hero-enhanced::before').css('transform', `translateY(${rate}px)`);
        },
        
        // Click feedback animations
        setupClickFeedback() {
            $('.tool-card, .btn-enhanced').on('click', function(e) {
                const $this = $(this);
                const ripple = $('<span class="ripple-effect"></span>');
                
                // Calculate ripple position
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.css({
                    position: 'absolute',
                    width: size + 'px',
                    height: size + 'px',
                    left: x + 'px',
                    top: y + 'px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    transform: 'scale(0)',
                    animation: 'ripple 0.6s ease-out',
                    pointerEvents: 'none',
                    zIndex: 1000
                });
                
                $this.css('position', 'relative').append(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
            
            // Add ripple animation CSS
            $('<style>').text(`
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `).appendTo('head');
        },
        
        // Enhanced search functionality
        setupSearchEnhancements() {
            const $heroSearch = $('#heroSearch');
            
            $heroSearch.on('focus', function() {
                $(this).parent().addClass('search-focused');
                VisualEnhancements.showToast('Search through tools, guides, and strategies', 'info', 2000);
            });
            
            $heroSearch.on('blur', function() {
                $(this).parent().removeClass('search-focused');
            });
            
            $heroSearch.on('input', this.debounce(function() {
                const query = $(this).val();
                if (query.length > 2) {
                    VisualEnhancements.performEnhancedSearch(query);
                }
            }, 300));
        },
        
        performEnhancedSearch(query) {
            // Show typing indicator
            $('.search-icon-enhanced').html('⌨️');
            
            setTimeout(() => {
                $('.search-icon-enhanced').html('🔍');
                
                // Integrate with existing search system
                if (window.siteSearch && window.siteSearch.performSearch) {
                    window.siteSearch.performSearch(query);
                } else {
                    this.showToast(`Searching for "${query}"...`, 'info', 2000);
                }
            }, 500);
        },
        
        // Utility functions
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };
    
    // Global functions
    window.navigateToTool = function(toolPath) {
        VisualEnhancements.showLoading('Initializing tool...');
        setTimeout(() => {
            window.location.href = `pages/${toolPath}`;
        }, 300);
    };
    
    window.trackAction = function(action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'user_action', {
                action_type: action,
                content_group1: 'enhanced_ui'
            });
        }
        
        VisualEnhancements.showToast('Action tracked! 🎯', 'success', 2000);
    };
    
    // Initialize enhancements
    VisualEnhancements.init();
    
    // Make VisualEnhancements globally available
    window.VisualEnhancements = VisualEnhancements;
    
    // Show welcome message
    setTimeout(() => {
        VisualEnhancements.showToast('Welcome to LastWar Tools Strategic Command Center! 🎮', 'success', 3000);
    }, 1000);
});

// Additional CSS for enhanced interactions
const enhancedCSS = `
.search-focused {
    transform: scale(1.02);
}

.ripple-effect {
    animation: ripple 0.6s ease-out;
}

.toast-icon {
    font-size: 1.1rem;
}

.toast-close {
    font-size: 1.2rem;
    line-height: 1;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}
`;

const style = document.createElement('style');
style.textContent = enhancedCSS;
document.head.appendChild(style);
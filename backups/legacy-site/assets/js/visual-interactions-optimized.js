// LastWar Tools - Optimized Visual Interactions
// Refactored to remove errors and improve performance

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Defer non-critical operations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }

    function initEnhancements() {
        const VisualEnhancements = {
            config: {
                animationDuration: prefersReducedMotion ? 0 : 300,
                toastDuration: prefersReducedMotion ? 0 : 4000,
                loadingMinDuration: prefersReducedMotion ? 0 : 800
            },

            init() {
                this.setupLoadingStates();
                this.setupToastSystem();
                this.setupProgressBars();
                this.setupHoverEffects();
                this.hideInitialLoader();

                console.log('🎨 Visual enhancements initialized');
            },

            setupLoadingStates() {
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a[href$=".html"]');
                    if (link && !e.ctrlKey && !e.metaKey) {
                        this.showLoading('Loading page...');
                    }
                });
            },

            showLoading(message = 'Loading...') {
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) {
                    const textEl = overlay.querySelector('.loading-text');
                    if (textEl) textEl.textContent = message;
                    overlay.classList.add('active');

                    if (prefersReducedMotion) {
                        overlay.classList.remove('active');
                    } else {
                        setTimeout(() => {
                            overlay.classList.remove('active');
                        }, this.config.loadingMinDuration);
                    }
                }
            },

            hideInitialLoader() {
                window.addEventListener('load', () => {
                    const overlay = document.getElementById('loadingOverlay');
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                });
            },

            setupToastSystem() {
                if (!document.getElementById('toastContainer')) {
                    const container = document.createElement('div');
                    container.className = 'toast-container';
                    container.id = 'toastContainer';
                    document.body.appendChild(container);
                }
            },

            showToast(message, type = 'info', duration = null) {
                const container = document.getElementById('toastContainer');
                if (!container) return;

                const toast = document.createElement('div');
                toast.className = `toast toast-${type}${prefersReducedMotion ? '' : ' fade-in'}`;
                toast.innerHTML = `
                    <span class="toast-icon">${this.getToastIcon(type)}</span>
                    <span class="toast-message">${message}</span>
                    <button class="toast-close" aria-label="Close">×</button>
                `;

                container.appendChild(toast);

                const closeBtn = toast.querySelector('.toast-close');
                closeBtn.addEventListener('click', () => toast.remove());

                const displayDuration = duration || this.config.toastDuration;

                if (prefersReducedMotion) {
                    setTimeout(() => toast.remove(), displayDuration);
                } else {
                    setTimeout(() => {
                        toast.classList.add('fade-out');
                        setTimeout(() => toast.remove(), 300);
                    }, displayDuration);
                }
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

            setupProgressBars() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const bar = entry.target;
                            const fill = bar.querySelector('.progress-fill');
                            if (fill && !fill.classList.contains('animated')) {
                                fill.classList.add('animated');
                                const width = fill.style.width;
                                fill.style.width = '0';
                                if (prefersReducedMotion) {
                                    fill.style.transition = 'none';
                                    fill.style.width = width;
                                } else {
                                    requestAnimationFrame(() => {
                                        fill.style.transition = 'width 1.5s ease-out';
                                        fill.style.width = width;
                                    });
                                }
                            }
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.progress-bar').forEach(bar => {
                    observer.observe(bar);
                });
            },

            setupHoverEffects() {
                if (prefersReducedMotion) return;
                document.addEventListener('mouseover', (e) => {
                    const card = e.target.closest('.tool-card, .guide-card');
                    if (card && !card.classList.contains('hover-enhanced')) {
                        card.classList.add('hover-enhanced');
                        card.style.transform = 'translateY(-2px)';
                        card.style.transition = 'transform 0.3s ease';
                    }
                });

                document.addEventListener('mouseout', (e) => {
                    const card = e.target.closest('.tool-card, .guide-card');
                    if (card && card.classList.contains('hover-enhanced')) {
                        card.classList.remove('hover-enhanced');
                        card.style.transform = '';
                    }
                });
            },

            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func.apply(this, args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, prefersReducedMotion ? 0 : wait);
                };
            }
        };

        // Initialize
        VisualEnhancements.init();

        // Expose globally
        window.VisualEnhancements = VisualEnhancements;

        // Welcome message after a short delay
        if (!prefersReducedMotion) {
            setTimeout(() => {
                VisualEnhancements.showToast(
                    'Welcome to LastWar Tools! 🎮', 'success', 3000);
            }, 1000);
        }
    }
})();

(function () {
  // Add storage check first
  if (typeof StorageUtils === 'undefined') {
    // Fallback if StorageUtils not loaded
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {
      // Silent fail - use default theme
    }
  } else {
    var saved = StorageUtils.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
})();

(function () {
  // Get saved theme or default to dark
  function getSavedTheme() {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  // Apply theme immediately to prevent flash
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle state if it exists
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');
    }
  }

  // Initialize theme on page load
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);

  // Theme toggle function - make it global
  window.toggleDarkMode = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply new theme
    applyTheme(newTheme);

    // Save to localStorage
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }

    // Track the theme change
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_toggle', {
        event_category: 'ui_interaction',
        event_label: newTheme,
        new_theme: newTheme
      });
    }

    // Smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  // Setup theme toggle when DOM is ready
  function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      // Remove any existing listeners
      toggle.removeEventListener('click', window.toggleDarkMode);
      
      // Add click listener
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleDarkMode();
      });

      // Add keyboard support
      toggle.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
          e.preventDefault();
          window.toggleDarkMode();
        }
      });

      // Set initial state
      applyTheme(savedTheme);
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeToggle);
  } else {
    setupThemeToggle();
  }

  // Also setup when navigation placeholder loads (for SPAs)
  if (typeof $ !== 'undefined') {
    $(document).ready(function() {
      $("#nav-placeholder").on("DOMNodeInserted", setupThemeToggle);
    });
  }
})();
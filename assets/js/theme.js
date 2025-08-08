(function () {
  // Get saved theme or default to light
  function getSavedTheme() {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  }

  // Apply theme immediately to prevent flash
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle state if it exists
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');

      // Update visual state
      const thumb = toggle.querySelector('.toggle-thumb');
      if (thumb) {
        if (theme === 'dark') {
          thumb.style.transform = 'translateX(30px)';
        } else {
          thumb.style.transform = 'translateX(0)';
        }
      }
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

    // Smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyTheme(savedTheme);
    });
  }
})();

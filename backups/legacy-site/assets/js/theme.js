(function() {
  let theme;
  try {
    theme = localStorage.getItem('theme');
  } catch (e) {
    theme = null;
  }
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

(function() {
  function getSavedTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');
      const icon = toggle.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);

  window.toggleDarkMode = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);

    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      console.warn('Could not save theme preference');
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_toggle', {
        event_category: 'ui_interaction',
        event_label: next,
        new_theme: next
      });
    }

    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.removeEventListener('click', window.toggleDarkMode);
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleDarkMode();
      });

      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.toggleDarkMode();
        }
      });

      applyTheme(savedTheme);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeToggle);
  } else {
    setupThemeToggle();
  }

  if (typeof $ !== 'undefined') {
    $(document).ready(function() {
      $("#nav-placeholder").on("DOMNodeInserted", setupThemeToggle);
    });
  }
})();


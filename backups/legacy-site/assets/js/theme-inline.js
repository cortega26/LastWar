// Critical theme handler - inline in HTML to prevent FOUC
(function() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();
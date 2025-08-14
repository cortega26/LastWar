module.exports = {
  ci: {
    collect: {
      startServerCommand: 'python -m http.server 8080',
      url: ['http://localhost:8080'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Critical Web Vitals - Strict Budgets
        'largest-contentful-paint': ['error', { maxNumericValue: 1800 }], // <1.8s target
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }], // <0.05 target
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }], // <1.2s
        'total-blocking-time': ['error', { maxNumericValue: 200 }], // <200ms
        
        // Performance Scores
        'categories:performance': ['error', { minScore: 0.9 }], // 90+ performance score
        'categories:accessibility': ['error', { minScore: 0.95 }], // 95+ accessibility
        'categories:best-practices': ['error', { minScore: 0.9 }], // 90+ best practices
        'categories:seo': ['error', { minScore: 0.95 }], // 95+ SEO
        
        // Resource Optimization
        'render-blocking-resources': 'error', // No render-blocking resources
        'unused-javascript': ['warn', { maxLength: 1 }], // Minimal unused JS
        'unused-css-rules': ['warn', { maxLength: 1 }], // Minimal unused CSS
        'uses-optimized-images': 'error', // Optimized images required
        'uses-text-compression': 'error', // Text compression required
        'uses-responsive-images': 'error', // Responsive images required
        
        // Modern Web Standards
        'uses-http2': 'error', // HTTP/2 required
        'uses-passive-event-listeners': 'error', // Passive event listeners
        'no-document-write': 'error', // No document.write usage
        'uses-rel-preconnect': 'error', // Preconnect for external resources
        
        // Accessibility Requirements
        'color-contrast': 'error', // Color contrast compliance
        'image-alt': 'error', // Alt text for images
        'heading-order': 'error', // Proper heading hierarchy
        'link-name': 'error', // Accessible link names
        'button-name': 'error', // Accessible button names
        
        // SEO Requirements
        'meta-description': 'error', // Meta descriptions required
        'document-title': 'error', // Page titles required
        'hreflang': 'warn', // Hreflang for i18n
        'canonical': 'warn', // Canonical URLs
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: './lighthouse-results',
    },
  },
};
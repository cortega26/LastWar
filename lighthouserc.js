module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/pages/hero-optimizer.html',
        'http://localhost:3000/pages/team-builder.html',
        'http://localhost:3000/pages/T10-calculator.html',
        'http://localhost:3000/pages/season4.html'
      ],
      startServerCommand: 'npm run serve',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.85}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 1800}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.05}],
        'total-blocking-time': ['error', {maxNumericValue: 200}],
        
        // Other important metrics
        'speed-index': ['error', {maxNumericValue: 2500}],
        'interactive': ['error', {maxNumericValue: 3000}],
        'max-potential-fid': ['error', {maxNumericValue: 100}],
        
        // Resource optimization
        'unused-css-rules': ['error', {maxLength: 2}],
        'unused-javascript': ['error', {maxLength: 2}],
        'unminified-css': ['error', {maxLength: 0}],
        'unminified-javascript': ['error', {maxLength: 0}],
        'render-blocking-resources': ['error', {maxLength: 1}],
        
        // Image optimization
        'modern-image-formats': ['error', {maxLength: 0}],
        'uses-optimized-images': ['error', {maxLength: 0}],
        'uses-responsive-images': ['error', {maxLength: 1}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
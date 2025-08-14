#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BUDGETS = {
    LCP: 1800, // 1.8s
    FCP: 1200, // 1.2s  
    CLS: 0.05, // 0.05
    TBT: 200,  // 200ms
    performanceScore: 90
};

function checkPerformanceBudgets() {
    const manifestPath = path.join(__dirname, '../lighthouse-results/manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
        console.log('❌ No Lighthouse results found');
        process.exit(1);
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const results = manifest[0]; // Latest results
    
    const metrics = {
        LCP: results.summary.performance['largest-contentful-paint'],
        FCP: results.summary.performance['first-contentful-paint'], 
        CLS: results.summary.performance['cumulative-layout-shift'],
        TBT: results.summary.performance['total-blocking-time'],
        performanceScore: results.summary.performance.score * 100
    };
    
    let violations = [];
    
    Object.entries(BUDGETS).forEach(([metric, budget]) => {
        const actual = metrics[metric];
        if (actual > budget) {
            violations.push(`${metric}: ${actual} exceeds budget of ${budget}`);
        }
    });
    
    if (violations.length > 0) {
        console.log('🚨 Performance Budget Violations:');
        violations.forEach(v => console.log(`  • ${v}`));
        process.exit(1);
    } else {
        console.log('✅ All performance budgets passed!');
        console.log('📊 Metrics:', metrics);
    }
}

checkPerformanceBudgets();
#!/usr/bin/env node

/**
 * Performance monitoring script for Last War tools
 * Tracks Core Web Vitals and sends alerts for budget violations
 */

const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
    constructor() {
        this.budgets = {
            lcp: 1800, // milliseconds
            cls: 0.05, // unitless
            tbt: 200,  // milliseconds
            fcp: 1200, // milliseconds
            si: 2500   // milliseconds
        };
        
        this.alertThresholds = {
            lcp: 2500,
            cls: 0.1,
            tbt: 300,
            fcp: 2000,
            si: 3500
        };
    }
    
    async checkResults() {
        const resultsPath = '.lighthouseci';
        if (!fs.existsSync(resultsPath)) {
            console.log('No Lighthouse results found');
            return;
        }
        
        const manifestPath = path.join(resultsPath, 'manifest.json');
        if (!fs.existsSync(manifestPath)) {
            console.log('No manifest file found');
            return;
        }
        
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const issues = [];
        
        manifest.forEach(result => {
            const url = result.url.replace('http://localhost:3000', '') || 'Homepage';
            const audits = result.audits;
            
            // Check LCP
            if (audits['largest-contentful-paint']) {
                const lcp = Math.round(audits['largest-contentful-paint'].numericValue);
                if (lcp > this.budgets.lcp) {
                    issues.push(`${url}: LCP ${lcp}ms exceeds budget ${this.budgets.lcp}ms`);
                }
                if (lcp > this.alertThresholds.lcp) {
                    issues.push(`🚨 CRITICAL: ${url}: LCP ${lcp}ms exceeds alert threshold`);
                }
            }
            
            // Check CLS
            if (audits['cumulative-layout-shift']) {
                const cls = audits['cumulative-layout-shift'].numericValue;
                if (cls > this.budgets.cls) {
                    issues.push(`${url}: CLS ${cls.toFixed(3)} exceeds budget ${this.budgets.cls}`);
                }
                if (cls > this.alertThresholds.cls) {
                    issues.push(`🚨 CRITICAL: ${url}: CLS ${cls.toFixed(3)} exceeds alert threshold`);
                }
            }
            
            // Check TBT
            if (audits['total-blocking-time']) {
                const tbt = Math.round(audits['total-blocking-time'].numericValue);
                if (tbt > this.budgets.tbt) {
                    issues.push(`${url}: TBT ${tbt}ms exceeds budget ${this.budgets.tbt}ms`);
                }
            }
        });
        
        if (issues.length > 0) {
            console.log('\n⚠️  Performance Budget Violations:');
            issues.forEach(issue => console.log(`  ${issue}`));
            
            // Exit with error for CI
            if (issues.some(issue => issue.includes('CRITICAL'))) {
                process.exit(1);
            }
        } else {
            console.log('✅ All performance budgets met!');
        }
    }
    
    generateReport() {
        const resultsPath = '.lighthouseci';
        if (!fs.existsSync(resultsPath)) return;
        
        const manifestPath = path.join(resultsPath, 'manifest.json');
        if (!fs.existsSync(manifestPath)) return;
        
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const report = {
            timestamp: new Date().toISOString(),
            results: []
        };
        
        manifest.forEach(result => {
            const url = result.url.replace('http://localhost:3000', '') || 'Homepage';
            const audits = result.audits;
            
            report.results.push({
                url,
                performance: Math.round(result.summary.performance * 100),
                lcp: audits['largest-contentful-paint'] ? Math.round(audits['largest-contentful-paint'].numericValue) : null,
                cls: audits['cumulative-layout-shift'] ? audits['cumulative-layout-shift'].numericValue : null,
                tbt: audits['total-blocking-time'] ? Math.round(audits['total-blocking-time'].numericValue) : null,
                fcp: audits['first-contentful-paint'] ? Math.round(audits['first-contentful-paint'].numericValue) : null
            });
        });
        
        // Save historical data
        const historyPath = 'performance-history.json';
        let history = [];
        if (fs.existsSync(historyPath)) {
            history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        }
        
        history.push(report);
        
        // Keep only last 30 reports
        if (history.length > 30) {
            history = history.slice(-30);
        }
        
        fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
        console.log(`Performance report saved to ${historyPath}`);
    }
}

// Run the monitor
const monitor = new PerformanceMonitor();
if (process.argv.includes('--check')) {
    monitor.checkResults();
} else if (process.argv.includes('--report')) {
    monitor.generateReport();
} else {
    monitor.checkResults();
    monitor.generateReport();
}
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const baseURL = 'https://cortega26.github.io/LastWar/';
const outputPath = 'sitemap.xml';

// Priority mappings based on page type
const priorityMap = {
    'index.html': 1.0,
    'calculator': 0.9,
    'guide': 0.8,
    'tool': 0.9,
    'page': 0.7
};

// Change frequency mappings
const changeFreqMap = {
    'index.html': 'weekly',
    'calculator': 'monthly',
    'guide': 'monthly',
    'tool': 'monthly',
    'page': 'monthly'
};

function getPageType(filePath) {
    const fileName = path.basename(filePath);
    if (fileName === 'index.html') return 'index.html';
    if (filePath.includes('calculator')) return 'calculator';
    if (filePath.includes('pages/')) return 'guide';
    return 'page';
}

function getLastModified(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0];
    } catch (err) {
        return new Date().toISOString().split('T')[0];
    }
}

function scanForHTMLFiles(dir, baseDir = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(baseDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            // Recursively scan subdirectories
            files.push(...scanForHTMLFiles(fullPath, relativePath));
        } else if (stat.isFile() && item.endsWith('.html')) {
            files.push({
                path: relativePath,
                fullPath: fullPath,
                lastMod: getLastModified(fullPath)
            });
        }
    });

    return files;
}

function generateSitemap() {
    console.log('Generating sitemap...');

    // Scan for HTML files
    const htmlFiles = scanForHTMLFiles('.');

    // Generate XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    htmlFiles.forEach(file => {
        const pageType = getPageType(file.path);
        const priority = priorityMap[pageType] || 0.7;
        const changefreq = changeFreqMap[pageType] || 'monthly';

        // Convert file path to URL
        let url = baseURL + file.path.replace(/\\/g, '/');

        sitemap += '  <url>\n';
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <lastmod>${file.lastMod}</lastmod>\n`;
        sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
        sitemap += `    <priority>${priority}</priority>\n`;
        sitemap += '  </url>\n';
    });

    sitemap += '</urlset>\n';

    // Write sitemap
    fs.writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated with ${htmlFiles.length} URLs: ${outputPath}`);

    // Log summary
    console.log('\nSitemap contents:');
    htmlFiles.forEach(file => {
        const pageType = getPageType(file.path);
        console.log(`  ${file.path} (${pageType})`);
    });
}

// Run if called directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap };

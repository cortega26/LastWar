// Internal Linking Map System
class InternalLinkingSystem {
    constructor() {
        this.linkMap = {
            // Tools cross-references
            'hero-optimizer': {
                related: ['team-builder', 'heroes-guide', 'tier-list'],
                contextualLinks: [
                    { text: 'Build optimal teams', url: '/pages/team-builder.html' },
                    { text: 'Complete heroes guide', url: '/pages/heroes.html' },
                    { text: 'Hero tier rankings', url: '/pages/tier-list.html' }
                ]
            },
            'team-builder': {
                related: ['hero-optimizer', 'heroes-guide', 'formation-guide'],
                contextualLinks: [
                    { text: 'Optimize individual heroes', url: '/pages/hero-optimizer.html' },
                    { text: 'Hero abilities guide', url: '/pages/heroes.html' },
                    { text: 'Formation strategies', url: '/pages/formations.html' }
                ]
            },
            't10-calculator': {
                related: ['research-guide', 'resource-guide', 'base-building'],
                contextualLinks: [
                    { text: 'Research priority guide', url: '/pages/research.html' },
                    { text: 'Resource farming tips', url: '/pages/resources.html' },
                    { text: 'Base optimization', url: '/pages/base-building.html' }
                ]
            },
            'protein-farm': {
                related: ['resource-guide', 'base-building', 'efficiency-guide'],
                contextualLinks: [
                    { text: 'Complete resource guide', url: '/pages/resources.html' },
                    { text: 'Base layout optimization', url: '/pages/base-building.html' },
                    { text: 'Farm efficiency tips', url: '/pages/farming.html' }
                ]
            },
            
            // Guides cross-references
            'season4': {
                related: ['events-guide', 'rewards-guide', 'strategy-guide'],
                contextualLinks: [
                    { text: 'Event strategy guide', url: '/pages/events.html' },
                    { text: 'Maximize rewards', url: '/pages/rewards.html' },
                    { text: 'Advanced strategies', url: '/pages/strategy.html' }
                ]
            },
            'heroes': {
                related: ['hero-optimizer', 'team-builder', 'tier-list'],
                contextualLinks: [
                    { text: 'Optimize hero stats', url: '/pages/hero-optimizer.html' },
                    { text: 'Build winning teams', url: '/pages/team-builder.html' },
                    { text: 'Current tier rankings', url: '/pages/tier-list.html' }
                ]
            },
            'base-building': {
                related: ['t10-calculator', 'protein-farm', 'defense-guide'],
                contextualLinks: [
                    { text: 'Calculate research costs', url: '/pages/T10-calculator.html' },
                    { text: 'Optimize protein farms', url: '/pages/protein-farm-calculator.html' },
                    { text: 'Defense strategies', url: '/pages/defense.html' }
                ]
            }
        };
        
        this.initializeLinksystem();
    }
    
    initializeLinksystem() {
        document.addEventListener('DOMContentLoaded', () => {
            this.addRelatedContentSections();
            this.addContextualLinks();
            this.addBreadcrumbs();
            this.trackLinkClicks();
        });
    }
    
    getCurrentPageId() {
        const path = window.location.pathname;
        if (path.includes('hero-optimizer')) return 'hero-optimizer';
        if (path.includes('team-builder')) return 'team-builder';
        if (path.includes('T10-calculator')) return 't10-calculator';
        if (path.includes('protein-farm')) return 'protein-farm';
        if (path.includes('season4')) return 'season4';
        if (path.includes('heroes')) return 'heroes';
        if (path.includes('base-building')) return 'base-building';
        return null;
    }
    
    addRelatedContentSections() {
        const pageId = this.getCurrentPageId();
        if (!pageId || !this.linkMap[pageId]) return;
        
        const mainContent = document.querySelector('main') || document.querySelector('.content');
        if (!mainContent) return;
        
        const relatedSection = this.createRelatedSection(pageId);
        
        // Insert before footer or at end of main content
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(relatedSection, footer);
        } else {
            mainContent.appendChild(relatedSection);
        }
    }
    
    createRelatedSection(pageId) {
        const config = this.linkMap[pageId];
        const section = document.createElement('section');
        section.className = 'related-content-section';
        
        section.innerHTML = `
            <div class="related-content-container">
                <h3 class="related-content-title">
                    <span class="related-icon">🔗</span>
                    Related Tools & Guides
                </h3>
                <div class="related-content-grid">
                    ${config.contextualLinks.map(link => `
                        <a href="${link.url}" class="related-content-card" data-link-type="related">
                            <div class="related-card-content">
                                <span class="related-card-title">${link.text}</span>
                                <span class="related-card-arrow">→</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
                <div class="related-content-footer">
                    <p>Need more help? Join our <a href="/pages/discord.html" data-link-type="community">Discord community</a> for real-time strategy discussions.</p>
                </div>
            </div>
        `;
        
        return section;
    }
    
    addContextualLinks() {
        // Add contextual links within content
        const contentElements = document.querySelectorAll('p, li, td');
        
        const linkPatterns = [
            { pattern: /\b(hero|heroes)\b/gi, url: '/pages/heroes.html', text: 'heroes guide' },
            { pattern: /\b(team|formation|lineup)\b/gi, url: '/pages/team-builder.html', text: 'team builder' },
            { pattern: /\b(base|building|construction)\b/gi, url: '/pages/base-building.html', text: 'base building guide' },
            { pattern: /\b(research|tier 10|t10)\b/gi, url: '/pages/T10-calculator.html', text: 'research calculator' },
            { pattern: /\b(protein|farm|farming)\b/gi, url: '/pages/protein-farm-calculator.html', text: 'protein farm calculator' },
            { pattern: /\b(season|event|seasonal)\b/gi, url: '/pages/season4.html', text: 'season guide' },
            { pattern: /\b(discord|community|chat)\b/gi, url: '/pages/discord.html', text: 'Discord community' }
        ];
        
        contentElements.forEach(element => {
            if (element.querySelector('a')) return; // Skip if already has links
            
            let content = element.textContent;
            let hasChanges = false;
            
            linkPatterns.forEach(pattern => {
                if (pattern.pattern.test(content) && !element.innerHTML.includes(pattern.url)) {
                    const linkedContent = content.replace(pattern.pattern, (match) => {
                        hasChanges = true;
                        return `<a href="${pattern.url}" class="contextual-link" data-link-type="contextual">${match}</a>`;
                    });
                    
                    if (hasChanges) {
                        element.innerHTML = linkedContent;
                        return false; // Stop after first match to avoid over-linking
                    }
                }
            });
        });
    }
    
    addBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (breadcrumbContainer) return; // Already exists
        
        const pageId = this.getCurrentPageId();
        if (!pageId) return;
        
        const breadcrumbs = this.generateBreadcrumbs(pageId);
        if (!breadcrumbs) return;
        
        const nav = document.querySelector('nav') || document.querySelector('header');
        if (nav) {
            nav.insertAdjacentHTML('afterend', breadcrumbs);
        }
    }
    
    generateBreadcrumbs(pageId) {
        const breadcrumbMap = {
            'hero-optimizer': { category: 'Tools', title: 'Hero Optimizer' },
            'team-builder': { category: 'Tools', title: 'Team Builder' },
            't10-calculator': { category: 'Tools', title: 'Tier 10 Calculator' },
            'protein-farm': { category: 'Tools', title: 'Protein Farm Calculator' },
            'season4': { category: 'Guides', title: 'Season 4 Guide' },
            'heroes': { category: 'Guides', title: 'Heroes Guide' },
            'base-building': { category: 'Guides', title: 'Base Building' }
        };
        
        const config = breadcrumbMap[pageId];
        if (!config) return null;
        
        return `
            <nav class="breadcrumbs" aria-label="Breadcrumb">
                <ol class="breadcrumb-list">
                    <li class="breadcrumb-item">
                        <a href="/" data-link-type="breadcrumb">Home</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="/pages/${config.category.toLowerCase()}.html" data-link-type="breadcrumb">${config.category}</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        ${config.title}
                    </li>
                </ol>
            </nav>
        `;
    }
    
    trackLinkClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-link-type]');
            if (!link) return;
            
            const linkType = link.dataset.linkType;
            const url = link.href;
            
            // Track internal link clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'internal_link_click', {
                    link_type: linkType,
                    link_url: url,
                    source_page: window.location.pathname,
                    content_group1: 'internal_navigation'
                });
            }
        });
    }
}

// Initialize internal linking system
window.internalLinks = new InternalLinkingSystem();
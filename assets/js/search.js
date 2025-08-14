// On-site search implementation using Lunr.js
class SiteSearch {
    constructor() {
        this.index = null;
        this.documents = [];
        this.isInitialized = false;
        this.searchInput = null;
        this.searchResults = null;
        this.initializeSearch();
    }

    async initializeSearch() {
        try {
            // Load Lunr.js from CDN
            if (typeof lunr === 'undefined') {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js');
            }
            
            await this.buildSearchIndex();
            this.setupSearchUI();
            this.isInitialized = true;
            console.log('Search initialized successfully');
        } catch (error) {
            console.error('Search initialization failed:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async buildSearchIndex() {
        // Define searchable content structure
        const searchableContent = [
            // Tools & Calculators
            { 
                id: 'hero-optimizer', 
                title: 'Hero Optimizer', 
                url: '/pages/hero-optimizer.html',
                content: 'hero optimizer calculator stats skills tier list best heroes team composition formation',
                category: 'Tools'
            },
            { 
                id: 't10-calculator', 
                title: 'Tier 10 Research Calculator', 
                url: '/pages/T10-calculator.html',
                content: 'tier 10 research calculator cost requirements resources science points',
                category: 'Tools'
            },
            { 
                id: 'protein-farm', 
                title: 'Protein Farm Calculator', 
                url: '/pages/protein-farm-calculator.html',
                content: 'protein farm calculator efficiency resource production optimization',
                category: 'Tools'
            },
            { 
                id: 'team-builder', 
                title: 'Team Builder', 
                url: '/pages/team-builder.html',
                content: 'team builder formation lineup heroes strategy composition',
                category: 'Tools'
            },
            
            // Guides
            { 
                id: 'season4-guide', 
                title: 'Season 4 Complete Guide', 
                url: '/pages/season4.html',
                content: 'season 4 guide events rewards strategy tips tricks new features updates',
                category: 'Guides'
            },
            { 
                id: 'hero-guide', 
                title: 'Heroes & Tier List Guide', 
                url: '/pages/heroes.html',
                content: 'heroes guide tier list best heroes rankings skills awakening upgrades',
                category: 'Guides'
            },
            { 
                id: 'base-building', 
                title: 'Base Building Mastery', 
                url: '/pages/base-building.html',
                content: 'base building guide construction upgrades layout optimization defense strategy',
                category: 'Guides'
            },
            
            // Community
            { 
                id: 'discord', 
                title: 'Discord Community', 
                url: '/pages/discord.html',
                content: 'discord community chat strategies tips alliance recruitment events',
                category: 'Community'
            }
        ];

        this.documents = searchableContent;

        // Build Lunr index
        this.index = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('content', { boost: 5 });
            this.field('category', { boost: 3 });

            searchableContent.forEach(doc => {
                this.add(doc);
            });
        });
    }

    setupSearchUI() {
        // Create search container if it doesn't exist
        let searchContainer = document.getElementById('search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.id = 'search-container';
            searchContainer.className = 'search-container';
            
            // Insert into navigation
            const nav = document.querySelector('nav') || document.querySelector('.navbar');
            if (nav) {
                nav.appendChild(searchContainer);
            }
        }

        searchContainer.innerHTML = `
            <div class="search-wrapper">
                <div class="search-input-wrapper">
                    <input 
                        type="text" 
                        id="site-search" 
                        placeholder="Search tools, guides..."
                        autocomplete="off"
                        class="search-input"
                    >
                    <button type="button" class="search-clear" id="search-clear" style="display: none;">
                        ✕
                    </button>
                </div>
                <div id="search-results" class="search-results" style="display: none;"></div>
            </div>
        `;

        this.searchInput = document.getElementById('site-search');
        this.searchResults = document.getElementById('search-results');
        const searchClear = document.getElementById('search-clear');

        // Event listeners
        this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        this.searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
        searchClear.addEventListener('click', this.clearSearch.bind(this));
        
        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                this.hideResults();
            }
        });

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleSearch(event) {
        const query = event.target.value.trim();
        const searchClear = document.getElementById('search-clear');
        
        if (query.length === 0) {
            this.hideResults();
            searchClear.style.display = 'none';
            return;
        }

        searchClear.style.display = 'block';
        
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        this.performSearch(query);
        
        // Track search event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search_query', {
                search_term: query,
                content_group1: 'site_search'
            });
        }
    }

    performSearch(query) {
        try {
            const results = this.index.search(query + '*').slice(0, 8); // Limit to 8 results
            this.displayResults(results, query);
            
            // Track results count
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search_results', {
                    search_term: query,
                    search_results_count: results.length
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            this.displayError();
        }
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for "${query}"</p>
                    <p class="search-suggestion">Try searching for: "hero", "calculator", "guide", or "season"</p>
                </div>
            `;
        } else {
            const resultsHTML = results.map(result => {
                const doc = this.documents.find(d => d.id === result.ref);
                return `
                    <div class="search-result-item" data-url="${doc.url}">
                        <div class="search-result-category">${doc.category}</div>
                        <div class="search-result-title">${this.highlightQuery(doc.title, query)}</div>
                        <div class="search-result-url">${doc.url}</div>
                    </div>
                `;
            }).join('');
            
            this.searchResults.innerHTML = resultsHTML;
            
            // Add click handlers
            this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const url = e.currentTarget.dataset.url;
                    this.handleResultClick(url, query);
                });
            });
        }
        
        this.showResults();
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    handleResultClick(url, query) {
        // Track click event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search_click', {
                search_term: query,
                link_url: url,
                content_group1: 'site_search'
            });
        }
        
        // Navigate to result
        window.location.href = url;
        this.hideResults();
    }

    displayError() {
        this.searchResults.innerHTML = `
            <div class="search-error">
                <p>Search temporarily unavailable. Please try again.</p>
            </div>
        `;
        this.showResults();
    }

    handleSearchFocus() {
        if (this.searchInput.value.length >= 2) {
            this.showResults();
        }
    }

    showResults() {
        this.searchResults.style.display = 'block';
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }

    clearSearch() {
        this.searchInput.value = '';
        this.hideResults();
        document.getElementById('search-clear').style.display = 'none';
        this.searchInput.focus();
    }

    handleKeydown(event) {
        const results = this.searchResults.querySelectorAll('.search-result-item');
        const activeResult = this.searchResults.querySelector('.search-result-active');
        
        switch (event.key) {
            case 'Escape':
                this.hideResults();
                this.searchInput.blur();
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                if (activeResult) {
                    activeResult.classList.remove('search-result-active');
                    const next = activeResult.nextElementSibling;
                    if (next) {
                        next.classList.add('search-result-active');
                    } else {
                        results[0]?.classList.add('search-result-active');
                    }
                } else {
                    results[0]?.classList.add('search-result-active');
                }
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                if (activeResult) {
                    activeResult.classList.remove('search-result-active');
                    const prev = activeResult.previousElementSibling;
                    if (prev) {
                        prev.classList.add('search-result-active');
                    } else {
                        results[results.length - 1]?.classList.add('search-result-active');
                    }
                } else {
                    results[results.length - 1]?.classList.add('search-result-active');
                }
                break;
                
            case 'Enter':
                event.preventDefault();
                if (activeResult) {
                    activeResult.click();
                }
                break;
        }
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.siteSearch = new SiteSearch();
});
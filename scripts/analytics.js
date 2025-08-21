// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

// Production GA4 measurement ID
gtag('config', 'G-TV9L6C3VN7', {
    page_title: document.title,
    page_location: window.location.href
});

// Custom event tracking for Last War tools
function trackEvent(eventName, parameters = {}) {
    gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters.label || '',
        value: parameters.value || 1,
        ...parameters
    });
}

// Track tool usage
function trackToolOpen(toolName) {
    trackEvent('tool_open', {
        tool_name: toolName,
        page_title: document.title
    });
}

function trackCalculatorRun(calculatorType, inputs = {}) {
    trackEvent('calc_run', {
        calculator_type: calculatorType,
        ...inputs
    });
}

function trackDiscordClick() {
    trackEvent('discord_click', {
        event_category: 'social',
        event_label: 'discord_join'
    });
}

// Auto-track calculator usage
$(document).ready(function () {
    // Track T10 calculator usage
    $('.tech-node select').on('change', function () {
        const techType = $(this).attr('id');
        const level = parseInt($(this).val()) || 0;

        trackCalculatorRun('tier10', {
            tech_type: techType,
            level: level
        });
    });

    // Track Discord links
    $('a[href*="discord"]').on('click', trackDiscordClick);
});

// Track page engagement time
let startTime = Date.now();
let maxScrollPercent = 0;

window.addEventListener('scroll', function () {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    maxScrollPercent = Math.max(maxScrollPercent, scrollPercent);
});

window.addEventListener('beforeunload', function () {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (timeOnPage > 5) { // Only track if user stayed more than 5 seconds
        trackEvent('page_engagement', {
            time_on_page: timeOnPage,
            max_scroll_percent: maxScrollPercent,
            page_type: getPageType()
        });
    }
});

function getPageType() {
    const path = window.location.pathname;
    if (path.includes('calculator')) return 'calculator';
    if (path.includes('guide') || path.includes('pages/')) return 'guide';
    if (path === '/' || path.includes('index')) return 'homepage';
    return 'other';
}

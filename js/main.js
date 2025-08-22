// ===== MAIN JAVASCRIPT FILE =====
// This file handles global functionality and utilities

// ===== GLOBAL UTILITIES =====

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== GLOBAL EVENT LISTENERS =====

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent elements
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 250));

// Handle scroll events with throttling
window.addEventListener('scroll', throttle(() => {
    // Global scroll handling (component-specific scroll handling is in individual components)
    const scrollTop = window.pageYOffset;
    
    // Add scroll class to body for styling
    if (scrollTop > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 100));

// ===== ACCESSIBILITY FEATURES =====

// Skip to main content functionality
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && e.target === document.body) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.focus();
        }
    }
});

// Focus management for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===== PERFORMANCE OPTIMIZATION =====

// Intersection Observer for lazy loading
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Handle lazy images
            if (element.tagName === 'IMG' && element.dataset.src) {
                element.src = element.dataset.src;
                element.classList.remove('lazy');
                lazyLoadObserver.unobserve(element);
            }
            
            // Handle lazy backgrounds
            if (element.dataset.bg) {
                element.style.backgroundImage = `url(${element.dataset.bg})`;
                element.classList.remove('lazy-bg');
                lazyLoadObserver.unobserve(element);
            }
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyElements = document.querySelectorAll('.lazy, .lazy-bg');
    lazyElements.forEach(element => lazyLoadObserver.observe(element));
});

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send error reports to your analytics service here
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== ANALYTICS AND TRACKING =====

// Page view tracking
function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

// Event tracking
function trackEvent(eventName, eventCategory, eventLabel, eventValue) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: eventCategory,
            event_label: eventLabel,
            value: eventValue
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    }
}

// ===== THEME MANAGEMENT =====

// Check for user's preferred color scheme
function getPreferredColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = getPreferredColorScheme();
    const theme = savedTheme || preferredTheme;
    applyTheme(theme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// ===== INITIALIZATION =====

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Track initial page view
    trackPageView('Portfolio Home');
    
    // Set viewport height for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// Export utility functions for use in components
window.utils = {
    debounce,
    throttle,
    trapFocus,
    trackPageView,
    trackEvent,
    formatDate,
    formatCurrency,
    isValidEmail,
    copyToClipboard,
    applyTheme
};

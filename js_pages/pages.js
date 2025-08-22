// ===== PAGES JAVASCRIPT =====

// Initialize all pages
export function initializePages() {
    // Add CSS to head if not already present
    addPageStyles();
    
    // Initialize common page functionality
    initializeCommonFeatures();
    
    // Initialize page-specific features
    initializePageSpecificFeatures();
}

// Add page styles to head
function addPageStyles() {
    if (!document.querySelector('#pages-styles')) {
        const link = document.createElement('link');
        link.id = 'pages-styles';
        link.rel = 'stylesheet';
        link.href = 'css_pages/pages.css';
        document.head.appendChild(link);
    }
}

// Initialize common features for all pages
function initializeCommonFeatures() {
    // Animate elements on scroll
    initializeScrollAnimations();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .timeline-item, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // Card hover effects
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Badge hover effects
    document.querySelectorAll('.badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.1)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'scale(1)';
        });
    });

    // Button click effects
    document.querySelectorAll('.btn-page').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            btn.style.position = 'relative';
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Accessibility features
function initializeAccessibility() {
    // Add ARIA labels and roles
    document.querySelectorAll('.card').forEach((card, index) => {
        card.setAttribute('role', 'article');
        card.setAttribute('aria-labelledby', `card-title-${index}`);
    });

    // Add skip links for keyboard navigation
    addSkipLinks();

    // Announce page changes to screen readers
    announcePageChange();

    // Add focus management
    initializeFocusManagement();
}

// Add skip links
function addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-gold, #f39c12);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Announce page changes
function announcePageChange() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Page loaded: ${pageTitle.textContent}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
}

// Focus management
function initializeFocusManagement() {
    // Trap focus within modals if any
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    // Navigate cards with arrow keys
    document.addEventListener('keydown', (e) => {
        const cards = document.querySelectorAll('.card');
        const currentIndex = Array.from(cards).findIndex(card => 
            card.contains(document.activeElement)
        );
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % cards.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
                break;
            default:
                return;
        }
        
        e.preventDefault();
        cards[nextIndex].focus();
    });
}

// Page-specific features
function initializePageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'education':
            initializeEducationPage();
            break;
        case 'patents':
            initializePatentsPage();
            break;
        case 'papers':
            initializePapersPage();
            break;
        case 'features':
            initializeFeaturesPage();
            break;
        case 'events':
            initializeEventsPage();
            break;
        case 'corporates':
            initializeCorporatesPage();
            break;
    }
}

// Get current page from URL
function getCurrentPage() {
    const hash = window.location.hash;
    const match = hash.match(/#\/([^?#]+)/);
    return match ? match[1] : null;
}

// Education page specific features
function initializeEducationPage() {
    // Expand/collapse details for education items
    const toggleButtons = document.querySelectorAll('.edu-toggle');
    
    toggleButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('aria-controls');
            const panel = document.getElementById(id);
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            if (panel) {
                panel.hidden = expanded;
            }
        });
    });

    // Reveal on scroll (adds .is-visible for subtle entrance)
    const items = document.querySelectorAll('.edu-item');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.25 });

    items.forEach(i => io.observe(i));

    // Add timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add degree progress indicators
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
        bar.setAttribute('aria-valuenow', progress);
    });
}

// Patents page specific features
function initializePatentsPage() {
    // Add patent status indicators
    const patentCards = document.querySelectorAll('.patent-card');
    patentCards.forEach(card => {
        const status = card.getAttribute('data-status');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge status-${status}`;
        statusBadge.textContent = status;
        card.appendChild(statusBadge);
    });
    
    // Add search functionality
    initializePatentSearch();
}

// Patent search functionality
function initializePatentSearch() {
    const searchInput = document.querySelector('#patent-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const patentCards = document.querySelectorAll('.patent-card');
        
        patentCards.forEach(card => {
            const title = card.querySelector('.patent-title').textContent.toLowerCase();
            const description = card.querySelector('.patent-description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Papers page specific features
function initializePapersPage() {
    // Add paper download functionality
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const paperTitle = btn.getAttribute('data-paper');
            announceToScreenReader(`Downloading ${paperTitle}`);
            // Simulate download
            setTimeout(() => {
                announceToScreenReader(`${paperTitle} download complete`);
            }, 2000);
        });
    });
}

// Features page specific features
function initializeFeaturesPage() {
    // Add feature toggle functionality
    const featureToggles = document.querySelectorAll('.feature-toggle');
    featureToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            toggle.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
            
            if (!isExpanded) {
                content.style.animation = 'slideInDown 0.3s ease-out';
            }
        });
    });
}


// Corporates page specific features
function initializeCorporatesPage() {
    // Add award animations
    const awardCards = document.querySelectorAll('.award-card');
    awardCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.3}s`;
        
        // Add award year indicators
        const year = card.getAttribute('data-year');
        const yearBadge = document.createElement('span');
        yearBadge.className = 'year-badge';
        yearBadge.textContent = year;
        card.appendChild(yearBadge);
    });
}

// Utility functions
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Add CSS for screen reader only content
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .status-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-granted {
        background: #27ae60;
        color: white;
    }
    
    .status-pending {
        background: #f39c12;
        color: white;
    }
    
    .year-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--accent-gold, #f39c12);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

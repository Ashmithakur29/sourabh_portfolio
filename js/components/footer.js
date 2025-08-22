// ===== FOOTER COMPONENT =====
export function initializeFooter() {
    // Scroll to top functionality
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
                scrollToTopBtn.style.opacity = '1';
            } else {
                scrollToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    scrollToTopBtn.style.display = 'none';
                }, 300);
            }
        });

        // Smooth scroll to top
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Footer social links
    const footerSocialLinks = document.querySelectorAll('.footer-social a');
    footerSocialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.getAttribute('data-platform');
            const url = link.getAttribute('href');
            
            // Track footer social clicks
            trackFooterSocialClick(platform, url);
        });
    });

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                await subscribeToNewsletter(email);
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterForm.reset();
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
            }
        });
    }

    // Copyright year update
    const copyrightYear = document.querySelector('.copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Back to top animation
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                backToTopBtn.style.transform = 'scale(1)';
            }, 150);
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Footer links with proper navigation handling
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const href = link.getAttribute('href');
            
            // If we're currently on a page route, clear it to show home sections
            if (location.hash.startsWith('#/')) {
                // Set the hash to trigger router transition
                location.hash = href;
                
                // Wait for router to complete the transition, then scroll
                const checkAndScroll = () => {
                    // Check if home sections are now visible
                    const homeContainer = document.querySelector('#hero-container');
                    if (homeContainer && homeContainer.style.display !== 'none') {
                        // Home sections are visible, now scroll to target
                        const targetSection = document.querySelector(href);
                        if (targetSection) {
                            targetSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    } else {
                        // Still transitioning, wait a bit more
                        setTimeout(checkAndScroll, 50);
                    }
                };
                
                // Start checking after a short delay
                setTimeout(checkAndScroll, 150);
                return;
            }
            
            // Normal home section navigation
            const targetSection = document.querySelector(href);
            if (targetSection) {
                // Update URL to reflect the section
                if (typeof history.pushState === 'function') {
                    history.pushState(null, '', href);
                } else {
                    // Fallback: update hash
                    location.hash = href;
                }
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Footer contact info copy functionality
    const contactInfo = document.querySelectorAll('.contact-info .copy-btn');
    contactInfo.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const contactText = btn.previousElementSibling.textContent;
            copyToClipboard(contactText);
            
            // Show copied feedback
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = '#28a745';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        });
    });
}

// Track footer social clicks
function trackFooterSocialClick(platform, url) {
    console.log(`Footer social click: ${platform} - ${url}`);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'footer_social_click', {
            'event_category': 'engagement',
            'event_label': platform,
            'value': 1
        });
    }
}

// Newsletter subscription
async function subscribeToNewsletter(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate API call
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                console.log('Newsletter subscription:', email);
                resolve();
            } else {
                reject(new Error('Subscription service unavailable'));
            }
        }, 1500);
    });
}

// Copy to clipboard functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

// Email validation (reused from contact.js)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification function (reused from contact.js)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

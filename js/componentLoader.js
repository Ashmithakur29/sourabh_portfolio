// ===== COMPONENT LOADER =====

class ComponentLoader {
    constructor() {
        this.components = {};
        this.loadedComponents = new Set();
    }

    // Load a component from file
    async loadComponent(componentName, targetElement) {
        try {
            // Check if component is already loaded
            if (this.loadedComponents.has(componentName)) {
                this.renderComponent(componentName, targetElement);
                return;
            }

            // Load component HTML
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }

            const html = await response.text();
            this.components[componentName] = html;
            this.loadedComponents.add(componentName);

            // Render the component
            this.renderComponent(componentName, targetElement);

        } catch (error) {
            console.error('Error loading component:', error);
            this.showError(targetElement, `Failed to load ${componentName} component`);
        }
    }

    // Render component to target element
    renderComponent(componentName, targetElement) {
        if (!this.components[componentName]) {
            console.error(`Component ${componentName} not found`);
            return;
        }

        targetElement.innerHTML = this.components[componentName];
        
        // Initialize component-specific JavaScript
        this.initializeComponentJS(componentName);
        
        // Trigger custom event for component loaded
        const event = new CustomEvent('componentLoaded', {
            detail: { componentName, targetElement }
        });
        document.dispatchEvent(event);
    }

    // Initialize component-specific JavaScript
    async initializeComponentJS(componentName) {
        try {
            // Import and initialize component-specific JavaScript
            switch (componentName) {
                case 'navigation':
                    const { initializeNavigation } = await import('./components/navigation.js');
                    initializeNavigation();
                    break;
                case 'hero':
                    const { initializeHero } = await import('./components/hero.js');
                    initializeHero();
                    break;
                case 'skills':
                    const { initializeSkills } = await import('./components/skills.js');
                    initializeSkills();
                    break;
                case 'projects':
                    const { initializeExperience } = await import('./components/experience.js');
                    initializeExperience();
                    break;    
                case 'projects':
                    const { initializeProjects } = await import('./components/projects.js');
                    initializeProjects();
                    break;
                case 'contact':
                    const { initializeContact } = await import('./components/contact.js');
                    initializeContact();
                    break;
                case 'meeting':
                    const { initializeMeeting } = await import('./components/meeting.js');
                    initializeMeeting();
                    break;
                case 'footer':
                    const { initializeFooter } = await import('./components/footer.js');
                    initializeFooter();
                    break;
            }
        } catch (error) {
            console.warn(`Failed to initialize ${componentName} JavaScript:`, error);
        }
    }

    // Load multiple components
    async loadComponents(componentList) {
        const promises = componentList.map(({ name, target }) => {
            const element = document.querySelector(target);
            if (element) {
                return this.loadComponent(name, element);
            } else {
                console.warn(`Target element not found: ${target}`);
                return Promise.resolve();
            }
        });

        try {
            await Promise.all(promises);
            console.log('All components loaded successfully');
            // Notify others (e.g., router) that components are ready
            try { window.dispatchEvent(new Event('components:loaded')); } catch {}
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    // Show error message
    showError(targetElement, message) {
        targetElement.innerHTML = `
            <div class="error-message" style="
                padding: 2rem;
                text-align: center;
                color: #dc3545;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 10px;
                margin: 1rem 0;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>${message}</p>
            </div>
        `;
    }

    // Preload components for better performance
    async preloadComponents(componentNames) {
        const promises = componentNames.map(async (name) => {
            try {
                const response = await fetch(`components/${name}.html`);
                if (response.ok) {
                    const html = await response.text();
                    this.components[name] = html;
                    this.loadedComponents.add(name);
                }
            } catch (error) {
                console.warn(`Failed to preload component: ${name}`, error);
            }
        });

        await Promise.all(promises);
    }
}

// ===== INITIALIZATION =====

// Create global instance
window.componentLoader = new ComponentLoader();

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Preload all components for better performance
    const allComponents = [
        'navigation',
        'hero',
        'about',
        'skills',
        'experience',
        'projects',
        'contact',
        'meeting',
        'footer'
    ];

    await window.componentLoader.preloadComponents(allComponents);

    // Load components into their respective containers
    const componentList = [
        { name: 'navigation', target: '#navigation-container' },
        { name: 'hero', target: '#hero-container' },
        { name: 'about', target: '#about-container' },
        { name: 'skills', target: '#skills-container' },
        { name: 'experience', target: '#experience-container' },
        { name: 'projects', target: '#projects-container' },
        { name: 'contact', target: '#contact-container' },
        { name: 'meeting', target: '#meeting-container' },
        { name: 'footer', target: '#footer-container' }
    ];

    await window.componentLoader.loadComponents(componentList);

    // Initialize global features after all components are loaded
    initializeGlobalFeatures();
});

// ===== GLOBAL FEATURES =====

function initializeGlobalFeatures() {
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Performance optimization - debounced scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based features here
        }, 100);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal, .project-modal');
            modals.forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    });

    // Accessibility improvements
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--accent-gold)';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Check if component is loaded
function isComponentLoaded(componentName) {
    return window.componentLoader.loadedComponents.has(componentName);
}

// Get component HTML
function getComponentHTML(componentName) {
    return window.componentLoader.components[componentName] || null;
}

// Reload a specific component
async function reloadComponent(componentName, targetSelector) {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
        // Remove from loaded components to force reload
        window.componentLoader.loadedComponents.delete(componentName);
        delete window.componentLoader.components[componentName];
        
        // Reload the component
        await window.componentLoader.loadComponent(componentName, targetElement);
    }
}

// Export for use in other scripts
window.ComponentLoader = ComponentLoader;
window.isComponentLoaded = isComponentLoaded;
window.getComponentHTML = getComponentHTML;
window.reloadComponent = reloadComponent;

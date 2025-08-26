// js/router.js

// Cache for fetched page HTML
const CACHE  = new Map();

// Map logical route ids to actual file basenames in /pages
const ROUTE_TO_FILE = {
  experience: 'experience',
  education: 'eductaion',
  patents: 'patents',
  papers: 'paper',
  events: 'events',
  corporates: 'corporates_awards',
  skills: 'skills',
};

const PAGES  = Object.keys(ROUTE_TO_FILE);
const DEFAULT_ROUTE = 'experience';

function getView() {
  return document.getElementById('app-main');
}


function ensureStylesheet(id, href) {
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}


function setLoading(on) {
  const VIEW = getView();
  if (!VIEW) return;
  if (on) {
    VIEW.innerHTML = `
      <div class="page-loading" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <span class="sr-only">Loading…</span>
      </div>`;
  }
}

async function loadPageHTML(id) {
  if (CACHE.has(id)) return CACHE.get(id);
  const fileBase = ROUTE_TO_FILE[id] || id;
  const url = `pages/${fileBase}.html`;
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  CACHE.set(id, html);
  return html;
}

async function renderPage(id) {
  setLoading(true);
  try {
    const html = await loadPageHTML(id);
    const VIEW = getView();
    if (!VIEW) return; // viewport not ready yet
    VIEW.innerHTML = html;

    // Page-specific styles (Skills needs its own component CSS)
    if (id === 'skills') {
       ensureStylesheet('skills-styles', 'css/components/skills.css');
    }

    // Initialize page-specific JavaScript
    try {
      switch (id) {
        case 'experience':
          const { initializeExperience } = await import('./components/experience.js');
          initializeExperience();
          break;
        case 'skills':
          try {
            const skillsModule = await import('./components/skills.js');
            if (typeof skillsModule.initializeSkills === 'function') {
              skillsModule.initializeSkills();
            }
          } catch (e) {
            console.warn('Skills initializer not found or failed:', e);
          }
          break;
        case 'education':
        case 'patents':
        case 'papers':
        case 'events':
        case 'corporates':
          const { initializePages } = await import('../js_pages/pages.js');
          initializePages();
          break;
      }
    } catch (e) {
      console.warn(`Failed to initialize ${id} page scripts:`, e);
    }

    // focus mgmt
    const focusable = VIEW.querySelector('h1, h2, [tabindex], a, button') || VIEW;
    focusable.setAttribute('tabindex', '-1');
    focusable.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update navigation highlighting
    updateNavigationHighlight(id);
  } catch (e) {
    try {
      const html404 = await loadPageHTML('404');
      const VIEW = getView();
      if (VIEW) VIEW.innerHTML = html404;
    } catch {
      const VIEW = getView();
      if (VIEW) VIEW.textContent = 'Failed to load page.';
    }
  }
}

// Match "#/education" (allow extra params/fragments) OR fallback to default
function parsePageRoute() {
  const m = location.hash.match(/^#\/([^?#]+)/); // capture between "#/" and next ? or # or end
  if (!m) return null;
  const id = m[1];
  return PAGES.includes(id) ? id : '404';
}

function setHomeVisible(visible) {
  const ids = ['#hero-container', '#about-container', '#skills-container', '#projects-container', '#contact-container', '#meeting-container', '#page-container'];
  ids.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      if (visible) {
        el.style.display = 'block'; // Explicitly set to block instead of empty string
      } else {
        el.style.display = 'none';
      }
    }
  });
  const VIEW = getView();
  if (VIEW) {
    if (visible) {
      VIEW.style.display = 'none';
    } else {
      VIEW.style.display = 'block';
    }
  }
}

function updateNavigationHighlight(activePage = null) {
  // Clear all active states
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Highlight dropdown page if on a page route
  if (activePage) {
    const dropdownLink = document.querySelector(`.dropdown-menu a[aria-controls="${activePage}"]`);
    if (dropdownLink) dropdownLink.classList.add('active');
  }
}

function applyRoute() {
  const route = parsePageRoute();
  if (route) {
    setHomeVisible(false);
    renderPage(route);
    updateNavigationHighlight(route);
  } else {
    // No page route -> show homepage sections, hide page viewport
    setHomeVisible(true);
    const VIEW = getView();
    if (VIEW) VIEW.innerHTML = '';
    updateNavigationHighlight(); // Clear page highlighting
    
    // Small delay to ensure DOM is updated before any scrolling
    setTimeout(() => {
      // Trigger a small reflow to ensure elements are properly visible
      document.body.offsetHeight;
    }, 10);
  }
}

// --- NEW: Delegated prefetch + click handling ---
function enableDelegation() {
  // Prefetch on hover/focus (delegated)
  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('.dropdown-menu a[aria-controls]');
    if (!a) return;
    const id = a.getAttribute('aria-controls');
    if (id && !CACHE.has(id)) loadPageHTML(id).catch(()=>{});
  });
  document.addEventListener('focusin', (e) => {
    const a = e.target.closest('.dropdown-menu a[aria-controls]');
    if (!a) return;
    const id = a.getAttribute('aria-controls');
    if (id && !CACHE.has(id)) loadPageHTML(id).catch(()=>{});
  });

  // Route change on click (delegated)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.dropdown-menu a[aria-controls]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('aria-controls');
    if (!id) return;
    location.hash = `#/${id}`;
    closeMenus(); // close dropdown on navigate
  });
}

function closeMenus() {
  document.querySelectorAll('.has-dropdown.open').forEach(dd => {
    dd.classList.remove('open');
    dd.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false');
  });
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  if (navMenu?.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded','false');
  }
}

let _initialized = false;
function initRouter() {
  if (_initialized) return;

  // Ensure viewport exists (navigation component injects it)
  const view = getView();
  if (!view) {
    return; // try again when components finish loading
  }

  _initialized = true;

  enableDelegation();

  // Do not force default route; show home unless user selects a page
  applyRoute();

  window.addEventListener('hashchange', () => {
    closeMenus();
    applyRoute();
  });
}

// If components load asynchronously, DOMContentLoaded may be early.
// Safe to call multiple times; guarded by _initialized.
document.addEventListener('DOMContentLoaded', initRouter);

// Re-attempt init when all components are loaded
window.addEventListener('components:loaded', initRouter);

// Also attempt init as soon as navigation is injected
document.addEventListener('componentLoaded', (e) => {
  if (e?.detail?.componentName === 'navigation') {
    initRouter();
  }
});

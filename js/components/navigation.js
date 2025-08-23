// ===== NAVIGATION COMPONENT =====
export function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-menu a');

    if (!hamburger || !navMenu) return;

    // --- Focus helpers (NEW) ---
    const firstFocusable = (root) =>
      root.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    const focusSection = (el) => {
      if (!el) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); // allow programmatic focus
      el.focus({ preventScroll: true });
    };

    // NEW: same as your CSS mobile breakpoint
    const MOBILE_MAX = 768;
    const isMobile = () => window.innerWidth <= MOBILE_MAX;

    // NEW: progressive a11y attributes (HTML change ki zaroorat nahi)
    if (!navMenu.id) navMenu.id = 'primary-menu';
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('aria-controls', navMenu.id);
    hamburger.setAttribute('aria-expanded', 'false');

    // NEW: hide from screen readers when closed on mobile
    const setHiddenForSR = (open) => {
        if (isMobile()) {
            if (open) {
                navMenu.removeAttribute('hidden');
                navMenu.inert = false;
                // FOCUS: move to first item in menu
                const f = firstFocusable(navMenu);
                setTimeout(() => f?.focus(), 0);
            } else {
                navMenu.setAttribute('hidden', '');
                navMenu.inert = true;
                // FOCUS: return to hamburger
                hamburger.focus();
            }
        } else {
            // desktop: always visible + focusable
            navMenu.removeAttribute('hidden');
            navMenu.inert = false;
        }
    };

    // NEW: initial state based on viewport
    const applyByViewport = () => {
        if (isMobile()) {
            const open = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', String(open));
            setHiddenForSR(open);   // mobile default: closed -> hidden+inert
        } else {
            hamburger.setAttribute('aria-expanded', 'true');
            setHiddenForSR(true);   // desktop: always visible
        }
    };

    // Mobile navigation toggle (UNCHANGED + a11y sync)
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        const open = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(open)); // NEW
        setHiddenForSR(open);                                   // NEW
    });

    // Keyboard support for hamburger (no HTML change)
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });

    // Close mobile menu when clicking on a link (UNCHANGED + a11y sync)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            setHiddenForSR(false);                              // NEW
            hamburger.setAttribute('aria-expanded', 'false');   // NEW
        });
    });

    // Active navigation link highlighting (UNCHANGED)
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links (UNCHANGED)
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';


        // Routed pages (e.g. "#/experience") -> router handles it; then focus main
        if (href.startsWith('#/')) {
          // after route change, focus #app-main if available
          setTimeout(() => {
            const main = document.getElementById('app-main');
            if (main) focusSection(main);
          }, 120);
          return;
        }

        // In-page sections (e.g. "#contact", "#home", "#about", etc.)
        if (href.startsWith('#')) {
          e.preventDefault();

          const goScrollAndFocus = () => {
            const targetSection = document.querySelector(href);
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // ensure focus moves to the opened/visible thing for TalkBack
              setTimeout(() => focusSection(targetSection), 350);
            }
          };
          
          // If we're currently on a page route, clear it to show home sections
          if (location.hash.startsWith('#/')) {
            // Force a hash change to trigger router
            location.hash = href;
            // Small delay to ensure hashchange event fires
            setTimeout(goScrollAndFocus, 100);
            return;
          }
          
          // Update URL to reflect the section without invoking router logic
          if (typeof history.pushState === 'function') {
            history.pushState(null, '', href);
          } else {
            // Fallback: still update hash; router ignores non "#/" hashes
            location.hash = href;
          }
          goScrollAndFocus();
        }
      });
    });

    // ESC to close (mobile) + focus back to hamburger  (UPDATED)
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const isOpen = hamburger.classList.contains('active');
        if (isOpen && isMobile()) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            setHiddenForSR(false);   // also returns focus to hamburger
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // NEW: resize handling to keep SR-state correct
    window.addEventListener('resize', applyByViewport);
    applyByViewport(); // init once
}


// ===== Dropdown (click + keyboard + outside click) =====
const dropdowns = document.querySelectorAll('.has-dropdown');
dropdowns.forEach(dd => {
  const toggle = dd.querySelector('.dropdown-toggle');
  const menu   = dd.querySelector('.dropdown-menu');
  if (!toggle || !menu) return;

  // Click toggle
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !dd.classList.contains('open');
    // close others
    document.querySelectorAll('.has-dropdown.open').forEach(o => {
      if (o !== dd) {
        o.classList.remove('open');
        o.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
    dd.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) menu.querySelector('a')?.focus();
  });

  // Keyboard support on toggle
  toggle.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      dd.classList.add('open'); toggle.setAttribute('aria-expanded', 'true');
      menu.querySelector('a')?.focus();
    }
    if (e.key === 'Escape') {
      dd.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
    }
  });

  // Keyboard support inside menu
  const items = menu.querySelectorAll('a');
  items.forEach((item, idx) => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dd.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[idx + 1] || items[0];
        next.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[idx - 1] || items[items.length - 1];
        prev.focus();
      }
    });
  });
});

// Close any open dropdown if clicked outside
document.addEventListener('click', e => {
  document.querySelectorAll('.has-dropdown.open').forEach(dd => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      dd.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });
});

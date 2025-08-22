// ===== NAVIGATION COMPONENT =====
export function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Mobile navigation toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active navigation link highlighting
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

    // Smooth scrolling for navigation links
    // Smooth scrolling for navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href') || '';

    // ROUTED pages (e.g. "#/experience") -> router will handle via hashchange
    if (href.startsWith('#/')) {
      return; // allow default
    }

    // In-page sections (e.g. "#contact", "#home", "#about", etc.)
    if (href.startsWith('#')) {
      e.preventDefault();
      
      // If we're currently on a page route, clear it to show home sections
      if (location.hash.startsWith('#/')) {
        // Force a hash change to trigger router
        location.hash = href;
        // Small delay to ensure hashchange event fires
        setTimeout(() => {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        return;
      }
      
      // Update URL to reflect the section without invoking router logic
      if (typeof history.pushState === 'function') {
        history.pushState(null, '', href);
      } else {
        // Fallback: still update hash; router ignores non "#/" hashes
        location.hash = href;
      }
      const targetSection = document.querySelector(href);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

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

// ===== Experience component =====
export function initializeExperience() {
  // Expand/collapse details
  const toggleButtons = document.querySelectorAll('.exp-toggle');
  
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
  const items = document.querySelectorAll('.exp-item');
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
}

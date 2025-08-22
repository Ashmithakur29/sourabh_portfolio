// ===== Book Meeting =====
window.initializeMeeting = function () {
  const modal = document.getElementById('bookModal');
  const subtitle = document.getElementById('book-subtitle');
  const serviceInput = document.getElementById('serviceName');
  const ariaLive = document.getElementById('book-aria');
  let lastFocus = null;

  function openModal(service, duration, price) {
    lastFocus = document.activeElement;
    serviceInput.value = service;
    subtitle.textContent = `${service} • ${duration} mins • ₹${price}`;
    modal.hidden = false;
    ariaLive.textContent = `Booking form opened for ${service}`;
    modal.querySelector('.book-close').focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  // open from cards
  document.querySelectorAll('.price-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.service, btn.dataset.duration, btn.dataset.price);
    });
  });

  // close actions
  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  // simple submit (demo)
  const form = document.getElementById('bookForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Booking data:', data);
    ariaLive.textContent = 'Booking submitted. We will email you shortly.';
    form.reset();
    closeModal();
    alert('Thanks! Your meeting request has been submitted.');
  });
};

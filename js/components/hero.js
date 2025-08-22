// ===== HERO COMPONENT =====
export function initializeHero() {
    const downloadCvBtn = document.getElementById('download-cv');
    
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = 'assets/cv.pdf'; // Update with your actual CV file path
            link.download = 'YourName_CV.pdf'; // Update with your name
            link.target = '_blank';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success notification
            showNotification('CV downloaded successfully!', 'success');
        });
    }

    // Parallax effect for hero background
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

}

// Helper function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
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
        background: ${type === 'success' ? '#28a745' : '#007bff'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('.hero-stats .value');
  const animate = (el) => {
    const target = Number(el.dataset.target || el.textContent);
    const duration = 1200;
    const start = performance.now();
    const startVal = 0;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      el.textContent = Math.floor(startVal + (target - startVal) * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  // Trigger only when visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { 
      e.target.dataset.animated || (animate(e.target), e.target.dataset.animated = true);
    }});
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
});


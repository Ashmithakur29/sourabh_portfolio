// ===== CONTACT COMPONENT =====
export function initializeContact() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    // Form validation and submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Validate form
            const validation = validateContactForm(formData);
            if (!validation.isValid) {
                showNotification(validation.message, 'error');
                return;
            }

            // Debug: Log form data
            console.log('Form data before sending:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // >>> REAL EMAIL SEND (EmailJS)
            await sendEmailViaEmailJS(formData);

            // Success
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();

        } catch (error) {
            // Bubble up EmailJS error if present
            const msg = error?.text || error?.message || 'Failed to send message. Please try again.';
            showNotification(msg, 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Social links tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.getAttribute('data-platform');
            const url = link.getAttribute('href');
            trackSocialClick(platform, url);
        });
    });
}

// >>> NEW: EmailJS sender
async function sendEmailViaEmailJS(formData) {
    // Map your form fields to EmailJS template variables
    const payload = {
        name:  formData.get('name'),
        email: formData.get('email'),
        subject:    formData.get('subject'),
        message:    formData.get('message'),

        // ensure delivery to your inbox:
        // to_email:   'ashmithakur96@gmail.com'
    };

    // Replace with your actual IDs/keys from EmailJS dashboard
    const SERVICE_ID  = ''; // e.g., 'service_xxx'
    const TEMPLATE_ID = '';  // e.g., 'template_xxx'
    const PUBLIC_KEY  = '';   // e.g., 'qwe123abc...'

    // If you initialized in <head>, you can omit the third arg here.
    // Keeping it explicit is fine:
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY);
}


// validation helpers (unchanged)
function validateContactForm(formData) {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();

    if (!name || name.length < 2) {
        return { isValid: false, message: 'Please enter a valid name (at least 2 characters)' };
    }
    if (!email || !isValidEmail(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    if (!message || message.length < 10) {
        return { isValid: false, message: 'Please enter a message (at least 10 characters)' };
    }
    return { isValid: true };
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    let isValid = true, errorMessage = '';
    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) { isValid = false; errorMessage = 'Name must be at least 2 characters'; }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) { isValid = false; errorMessage = 'Please enter a valid email address'; }
            break;
        case 'message':
            if (!value || value.length < 10) { isValid = false; errorMessage = 'Message must be at least 10 characters'; }
            break;
    }

    if (!isValid) { showFieldError(field, errorMessage); } else { clearFieldError(field); }
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    `;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}

function trackSocialClick(platform, url) {
    console.log(`Social media click: ${platform} - ${url}`);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
            'event_category': 'engagement',
            'event_label': platform,
            'value': 1
        });
    }
}

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
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => { document.body.removeChild(notification); }, 300);
    }, 5000);
}

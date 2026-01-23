// DOM Elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    input.classList.remove('error');
    errorElement.textContent = '';
}

function clearAllErrors() {
    ['name', 'email', 'message'].forEach(clearError);
}

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();
    formSuccess.classList.remove('show');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Validate name
    if (!name) {
        showError('name', 'Please enter your name');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    if (!email) {
        showError('email', 'Please enter your email');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate message
    if (!message) {
        showError('message', 'Please enter your message');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }

    // If valid, submit to Formspree
    if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://formspree.io/info@vibeworks.ky', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                formSuccess.classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }

        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});

// Real-time validation
document.getElementById('name').addEventListener('input', function() {
    if (this.classList.contains('error')) {
        clearError('name');
    }
});

document.getElementById('email').addEventListener('input', function() {
    if (this.classList.contains('error')) {
        clearError('email');
    }
});

document.getElementById('message').addEventListener('input', function() {
    if (this.classList.contains('error')) {
        clearError('message');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to service cards and pricing cards
document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

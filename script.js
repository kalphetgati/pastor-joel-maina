// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }
});

// ===== NAVIGATION =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active link highlight on scroll
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');

function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
function updateNavbar() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', () => {
    updateActiveLink();
    updateNavbar();
});

// ===== HERO BACKGROUND SLIDER =====
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000); // Change slide every 5 seconds

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const speed = 200; // Lower = faster
        const increment = target / speed;
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about');
let countersAnimated = false;

function checkCounterVisibility() {
    if (countersAnimated) return;
    
    const rect = aboutSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
    
    if (isVisible) {
        animateCounters();
        countersAnimated = true;
    }
}

window.addEventListener('scroll', checkCounterVisibility);
window.addEventListener('load', checkCounterVisibility);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const ministry = document.getElementById('ministry').value;
    const message = document.getElementById('message').value.trim();
    
    // Validation
    if (!name || !email || !subject || !ministry || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate sending
    const submitBtn = contactForm.querySelector('.send-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#10b981';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            contactForm.reset();
        }, 3000);
        
        showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
    }, 2000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        transform: translateX(120%);
        transition: transform 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const title = this.querySelector('.gallery-overlay span').textContent;
        const icon = this.querySelector('.gallery-image i').cloneNode(true);
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 12, 41, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            text-align: center;
            color: white;
            padding: 40px;
        `;
        
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            font-size: 6rem;
            color: var(--gold);
            margin-bottom: 24px;
        `;
        iconContainer.appendChild(icon);
        
        const titleElement = document.createElement('h3');
        titleElement.style.cssText = `
            font-family: 'Cinzel', serif;
            font-size: 2rem;
            color: var(--gold);
            margin-bottom: 12px;
        `;
        titleElement.textContent = title;
        
        const subtitle = document.createElement('p');
        subtitle.style.cssText = `
            color: rgba(255,255,255,0.7);
            font-size: 1.1rem;
        `;
        subtitle.textContent = 'Click anywhere to close';
        
        content.appendChild(iconContainer);
        content.appendChild(titleElement);
        content.appendChild(subtitle);
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);
        
        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
        });
        
        // Close on click
        lightbox.addEventListener('click', () => {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        });
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.section');

function revealOnScroll() {
    revealElements.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Set initial state
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Close lightbox on Escape
    if (e.key === 'Escape') {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        }
        
        // Close mobile menu on Escape
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION: Debounce scroll events =====
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace scroll listeners with debounced versions
const debouncedUpdate = debounce(() => {
    updateActiveLink();
    updateNavbar();
    checkCounterVisibility();
    revealOnScroll();
}, 10);

window.removeEventListener('scroll', updateActiveLink);
window.removeEventListener('scroll', updateNavbar);
window.removeEventListener('scroll', checkCounterVisibility);

window.addEventListener('scroll', debouncedUpdate);

// ===== SERVICE WORKER REGISTRATION (for PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c Pastor Joel Maina Ministries ', 'background: #1a1a2e; color: #c9a84c; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;');
console.log('%c "For I know the plans I have for you..." — Jeremiah 29:11 ', 'color: #d4af37; font-style: italic; font-size: 14px;');

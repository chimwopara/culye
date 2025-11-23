// Main site functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeMain();
    initializeMobileMenu();
    initializeNavHighlight();
});

function initializeMain() {
    // Smooth scroll function
    window.smoothScroll = function(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Initialize click handlers
    const startAssessmentBtn = document.getElementById('start-assessment-btn');
    if (startAssessmentBtn) {
        startAssessmentBtn.addEventListener('click', () => {
            smoothScroll('#contact');
        });
    }

    const scrollHintBtn = document.getElementById('scroll-hint-btn');
    if (scrollHintBtn) {
        scrollHintBtn.addEventListener('click', () => {
            smoothScroll('#about');
        });
    }

    // Navigation link handlers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            smoothScroll(href);
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const openIcon = this.querySelector('svg:first-child');
            const closeIcon = this.querySelector('svg:last-child');
            
            if (mobileMenu.classList.contains('hidden')) {
                openIcon.classList.remove('hidden');
                openIcon.classList.add('block');
                closeIcon.classList.add('hidden');
                closeIcon.classList.remove('block');
            } else {
                openIcon.classList.add('hidden');
                openIcon.classList.remove('block');
                closeIcon.classList.remove('hidden');
                closeIcon.classList.add('block');
            }
        });
    }
}

function initializeNavHighlight() {
    // Highlight active navigation item based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNav() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg');
            header.style.backgroundColor = 'rgba(17, 24, 39, 0.95)';
        } else {
            header.classList.remove('shadow-lg');
            header.style.backgroundColor = 'rgba(17, 24, 39, 0.8)';
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateSections = document.querySelectorAll('section:not(#home)');
    animateSections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
});

// Add smooth reveal animation style
const style = document.createElement('style');
style.textContent = `
    section {
        transition: opacity 0.6s ease-out;
    }
    section.animate-fade-in-up {
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

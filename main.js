// Main site functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeMain();
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
        });
    });
}
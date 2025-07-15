// Fade in on scroll effect
const fadeElements = document.querySelectorAll('.stats, .features, .brand-showcase, .dashboard, .stat-card, .feature-card, .brand-card, .loan-card');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    element.classList.add('fade-in-up');
    fadeInObserver.observe(element);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.bg-animation');
    parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.stat-card, .feature-card, .loan-card').forEach(card => {
    observer.observe(card);
});

// Add fade in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Connect wallet functionality
document.querySelector('.connect-wallet').addEventListener('click', () => {
    alert('Wallet connection would be implemented here');
});

// CTA button interactions
document.querySelector('.cta-primary').addEventListener('click', () => {
    document.querySelector('.dashboard').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.cta-secondary').addEventListener('click', () => {
    alert('Loan request form would open here');
});

// Day/Night Theme Toggle - Added Only
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('p3-theme-mode') || 'dark';

if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.classList.add('light');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.classList.toggle('light');
    
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('p3-theme-mode', currentTheme);
});
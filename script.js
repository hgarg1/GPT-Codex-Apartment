// Codex Residences interactive behaviors

document.addEventListener('DOMContentLoaded', () => {
    console.log('Codex Residences experience initialized.');

    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const backToTop = document.querySelector('.back-to-top');

    // Handle sticky header appearance and back-to-top visibility
    const handleScrollState = () => {
        if (window.scrollY > 60) {
            header && header.classList.add('scrolled');
            backToTop && backToTop.classList.add('visible');
        } else {
            header && header.classList.remove('scrolled');
            backToTop && backToTop.classList.remove('visible');
        }
    };

    handleScrollState();
    window.addEventListener('scroll', handleScrollState);

    // Mobile navigation toggle
    navToggle && navToggle.addEventListener('click', () => {
        navMenu && navMenu.classList.toggle('open');
        navToggle.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            const id = targetId ? targetId.substring(1) : '';
            const targetSection = id ? document.getElementById(id) : null;

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            navMenu && navMenu.classList.remove('open');
            navToggle && navToggle.classList.remove('open');
        });
    });

    // CTA scroll behavior
    const ctaButton = document.getElementById('ctaButton');
    ctaButton && ctaButton.addEventListener('click', () => {
        const availability = document.getElementById('availability');
        availability && availability.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Back to top
    backToTop && backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Intersection observer for reveal animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(el => revealObserver.observe(el));

    // Animate statistics counter
    const counters = document.querySelectorAll('.stat-number');
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target || '0', 10);
        const duration = 1800;
        const startTime = performance.now();

        const updateCounter = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value.toString();
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target.toString();
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Availability filters
    const filterButtons = document.querySelectorAll('.filter-button');
    const suites = document.querySelectorAll('.suite');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter || 'all';
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            suites.forEach(suite => {
                const bedrooms = suite.dataset.bedrooms || '';
                if (filter === 'all' || bedrooms === filter) {
                    suite.classList.remove('hidden');
                } else {
                    suite.classList.add('hidden');
                }
            });
        });
    });

    // Floor plan data and interactions
    const floorplanButtonEls = document.querySelectorAll('.floorplan-button');
    const floorplanImage = document.querySelector('.floorplan-image');
    const floorplanTitle = document.querySelector('.floorplan-title');
    const floorplanSize = document.querySelector('.floorplan-size');
    const floorplanList = document.querySelector('.floorplan-list');

    const floorplanContent = {
        aurora: {
            title: 'Aurora Studio',
            size: '520 sq ft • Skyline Studio',
            features: [
                'Sun-drenched living with integrated workspace alcove',
                'Italian cabinetry with smart appliance suite',
                'Spa shower featuring digital temperature presets'
            ],
            gradient: 'linear-gradient(135deg, rgba(42,110,242,0.45), rgba(15,26,44,0.85))'
        },
        lumen: {
            title: 'Lumen One Bedroom',
            size: '810 sq ft • Corner One Bedroom',
            features: [
                'Dual exposure living room with winter garden',
                "Owner's suite with custom wardrobe system",
                'Signature quartz waterfall island and wine fridge'
            ],
            gradient: 'linear-gradient(135deg, rgba(246,195,67,0.4), rgba(42,110,242,0.7))'
        },
        horizon: {
            title: 'Horizon Two Bedroom',
            size: '1,240 sq ft • Terrace Residence',
            features: [
                'Wraparound terrace with outdoor fireplace',
                'Ensuite spa baths with soaking tub & radiant floors',
                'Private flex suite ideal for office or guest lounge'
            ],
            gradient: 'linear-gradient(135deg, rgba(45,212,191,0.45), rgba(15,23,42,0.9))'
        },
        zenith: {
            title: 'Zenith Penthouse',
            size: '2,580 sq ft • Sky Villa',
            features: [
                'Two-story solarium with retractable glass walls',
                "Catering kitchen with butler's pantry and wine wall",
                'Private elevator vestibule and wellness spa'
            ],
            gradient: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(15,23,42,0.92))'
        }
    };

    floorplanButtonEls.forEach(button => {
        button.addEventListener('click', () => {
            const planKey = button.dataset.plan || 'aurora';
            const plan = floorplanContent[planKey];
            if (!plan) return;

            floorplanButtonEls.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (floorplanImage) {
                floorplanImage.style.background = plan.gradient;
            }
            if (floorplanTitle) {
                floorplanTitle.textContent = plan.title;
            }
            if (floorplanSize) {
                floorplanSize.textContent = plan.size;
            }
            if (floorplanList) {
                floorplanList.innerHTML = plan.features.map(feature => `<li>${feature}</li>`).join('');
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm && contactForm.addEventListener('submit', event => {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput && 'value' in nameInput ? nameInput.value.trim() : '';
        const email = emailInput && 'value' in emailInput ? emailInput.value.trim() : '';
        const message = messageInput && 'value' in messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            alert('Please complete the required fields so we can tailor your experience.');
            return;
        }

        alert(`Thank you, ${name}! Our leasing atelier will reach out to ${email} shortly.`);
        contactForm.reset();
    });

    // Active navigation state on scroll
    const sections = document.querySelectorAll('section[id]');
    const setActiveNav = () => {
        const scrollPos = window.scrollY + 140;
        sections.forEach(section => {
            const id = section.getAttribute('id');
            if (!id) return;
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const link = document.querySelector(`.nav-menu a[href="\#${id}"]`);
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(nav => nav.classList.remove('active'));
                link && link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveNav);
    setActiveNav();
});

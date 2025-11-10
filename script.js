// Codex Residences interactive behaviors

document.addEventListener('DOMContentLoaded', () => {
    console.log('Codex Residences experience initialized.');

    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const backToTop = document.querySelector('.back-to-top');
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const bookingSummary = document.getElementById('bookingSummary');
    const galleryModal = document.getElementById('galleryModal');
    const galleryTrack = galleryModal ? galleryModal.querySelector('.gallery-carousel__track') : null;
    const galleryCaption = galleryModal ? galleryModal.querySelector('.gallery-modal__caption') : null;
    const galleryCounter = galleryModal ? galleryModal.querySelector('.gallery-modal__counter') : null;
    const galleryPrev = galleryModal ? galleryModal.querySelector('[data-gallery-prev]') : null;
    const galleryNext = galleryModal ? galleryModal.querySelector('[data-gallery-next]') : null;
    const galleryCloseButtons = galleryModal ? galleryModal.querySelectorAll('[data-gallery-close]') : [];
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

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

    // Gallery modal + carousel
    if (galleryModal && galleryTrack && galleryItems.length) {
        const gallerySlides = galleryItems.map((item, index) => {
            const image = item.dataset.image || '';
            const caption = item.dataset.caption || '';
            const alt = item.getAttribute('aria-label') || `Gallery image ${index + 1}`;
            return { image, caption, alt };
        });

        galleryTrack.innerHTML = gallerySlides.map((slide, idx) => `
            <div class="gallery-carousel__slide" role="listitem">
                <img src="${slide.image}" alt="${slide.alt}" loading="lazy" data-index="${idx}">
            </div>
        `).join('');

        const slides = Array.from(galleryTrack.querySelectorAll('.gallery-carousel__slide'));
        let activeIndex = 0;

        const focusModal = () => {
            const focusable = galleryModal.querySelector('button:not([disabled])');
            focusable && focusable.focus();
        };

        const updateModal = () => {
            if (!slides.length) return;
            slides.forEach((slide, index) => {
                slide.classList.toggle('is-active', index === activeIndex);
            });
            galleryTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
            const current = gallerySlides[activeIndex];
            if (galleryCaption) {
                galleryCaption.textContent = current.caption || '';
            }
            if (galleryCounter) {
                galleryCounter.textContent = `${activeIndex + 1} / ${gallerySlides.length}`;
            }
        };

        const openModal = (index) => {
            activeIndex = index;
            galleryModal.setAttribute('aria-hidden', 'false');
            galleryModal.classList.add('open');
            document.body.classList.add('modal-open');
            updateModal();
            focusModal();
        };

        const closeModal = () => {
            galleryModal.setAttribute('aria-hidden', 'true');
            galleryModal.classList.remove('open');
            document.body.classList.remove('modal-open');
        };

        const showNext = () => {
            activeIndex = (activeIndex + 1) % gallerySlides.length;
            updateModal();
        };

        const showPrev = () => {
            activeIndex = (activeIndex - 1 + gallerySlides.length) % gallerySlides.length;
            updateModal();
        };

        galleryItems.forEach((item, index) => {
            const handleActivate = (event) => {
                if (event instanceof KeyboardEvent && !['Enter', ' ', 'Spacebar'].includes(event.key)) {
                    return;
                }
                event.preventDefault();
                openModal(index);
            };

            item.addEventListener('click', (event) => {
                event.preventDefault();
                openModal(index);
            });

            item.addEventListener('keydown', handleActivate);
        });

        galleryCloseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                closeModal();
            });
        });

        galleryModal.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.dataset.galleryClose !== undefined) {
                closeModal();
            }
        });

        galleryPrev && galleryPrev.addEventListener('click', (event) => {
            event.preventDefault();
            showPrev();
        });

        galleryNext && galleryNext.addEventListener('click', (event) => {
            event.preventDefault();
            showNext();
        });

        document.addEventListener('keydown', (event) => {
            if (!galleryModal.classList.contains('open')) return;
            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'ArrowRight') {
                showNext();
            } else if (event.key === 'ArrowLeft') {
                showPrev();
            }
        });

        updateModal();
    }

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
            overlay: 'linear-gradient(135deg, rgba(42,110,242,0.45), rgba(15,26,44,0.85))',
            svg: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="presentation" focusable="false">
                    <rect x="30" y="30" width="740" height="460" fill="none" stroke="#9dbcf7" stroke-width="10"/>
                    <rect x="60" y="60" width="310" height="190" fill="rgba(15,23,42,0.4)" stroke="#e2e8f0" stroke-width="6"/>
                    <rect x="400" y="60" width="340" height="160" fill="rgba(15,23,42,0.25)" stroke="#cbd5f5" stroke-width="6"/>
                    <rect x="60" y="280" width="310" height="190" fill="rgba(15,23,42,0.25)" stroke="#cbd5f5" stroke-width="6"/>
                    <rect x="400" y="240" width="340" height="230" fill="rgba(15,23,42,0.4)" stroke="#e2e8f0" stroke-width="6"/>
                    <rect x="60" y="250" width="680" height="30" fill="#9dbcf7" opacity="0.15"/>
                    <rect x="370" y="60" width="30" height="410" fill="#9dbcf7" opacity="0.15"/>
                    <path d="M370 180 h-60" stroke="#e2e8f0" stroke-width="6"/>
                    <path d="M310 180 a40 40 0 0 1 40 -40" stroke="#e2e8f0" stroke-width="6" fill="none"/>
                    <path d="M400 360 h60" stroke="#e2e8f0" stroke-width="6"/>
                    <path d="M460 360 a40 40 0 0 0 -40 -40" stroke="#e2e8f0" stroke-width="6" fill="none"/>
                    <rect x="100" y="100" width="140" height="90" fill="#f1f5f9" opacity="0.1" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="450" y="90" width="180" height="70" fill="#f1f5f9" opacity="0.1" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="120" y="320" width="160" height="120" fill="#f1f5f9" opacity="0.1" stroke="#f8fafc" stroke-width="4" rx="12"/>
                    <rect x="470" y="300" width="210" height="150" fill="#f1f5f9" opacity="0.1" stroke="#f8fafc" stroke-width="4"/>
                    <text x="150" y="155" fill="#f8fafc" font-size="28" font-family="Poppins">Living</text>
                    <text x="470" y="135" fill="#f8fafc" font-size="26" font-family="Poppins">Culinary</text>
                    <text x="150" y="385" fill="#f8fafc" font-size="28" font-family="Poppins">Sleep</text>
                    <text x="470" y="370" fill="#f8fafc" font-size="28" font-family="Poppins">Bath Suite</text>
                </svg>
            `,
            alt: 'Aurora Studio floor plan layout'
        },
        lumen: {
            title: 'Lumen One Bedroom',
            size: '810 sq ft • Corner One Bedroom',
            features: [
                'Dual exposure living room with winter garden',
                "Owner's suite with custom wardrobe system",
                'Signature quartz waterfall island and wine fridge'
            ],
            overlay: 'linear-gradient(135deg, rgba(246,195,67,0.4), rgba(42,110,242,0.7))',
            svg: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 540" role="presentation" focusable="false">
                    <rect x="40" y="40" width="740" height="460" fill="none" stroke="#fde68a" stroke-width="10"/>
                    <rect x="70" y="70" width="260" height="180" fill="rgba(30,41,59,0.35)" stroke="#fde68a" stroke-width="6"/>
                    <rect x="360" y="70" width="360" height="200" fill="rgba(30,41,59,0.25)" stroke="#fbbf24" stroke-width="6"/>
                    <rect x="70" y="280" width="260" height="190" fill="rgba(30,41,59,0.25)" stroke="#bae6fd" stroke-width="6"/>
                    <rect x="360" y="300" width="360" height="180" fill="rgba(30,41,59,0.35)" stroke="#bae6fd" stroke-width="6"/>
                    <line x1="200" y1="70" x2="200" y2="250" stroke="#e2e8f0" stroke-width="5"/>
                    <line x1="70" y1="360" x2="330" y2="360" stroke="#e2e8f0" stroke-width="5"/>
                    <path d="M330 200 h-60" stroke="#e2e8f0" stroke-width="6"/>
                    <path d="M270 200 a40 40 0 0 1 40 -40" stroke="#e2e8f0" stroke-width="6" fill="none"/>
                    <path d="M360 360 h60" stroke="#e2e8f0" stroke-width="6"/>
                    <path d="M420 360 a40 40 0 0 0 -40 -40" stroke="#e2e8f0" stroke-width="6" fill="none"/>
                    <rect x="100" y="100" width="120" height="70" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4" rx="10"/>
                    <rect x="430" y="110" width="180" height="90" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="120" y="310" width="160" height="120" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4" rx="12"/>
                    <rect x="430" y="320" width="230" height="120" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="620" y="320" width="70" height="60" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <text x="110" y="160" fill="#fefce8" font-size="26" font-family="Poppins">Winter Garden</text>
                    <text x="420" y="155" fill="#fefce8" font-size="30" font-family="Poppins">Great Room</text>
                    <text x="120" y="380" fill="#fefce8" font-size="28" font-family="Poppins">Owner's Suite</text>
                    <text x="430" y="385" fill="#fefce8" font-size="26" font-family="Poppins">Culinary Atelier</text>
                    <text x="630" y="365" fill="#fefce8" font-size="20" font-family="Poppins">Pantry</text>
                </svg>
            `,
            alt: 'Lumen one bedroom residence floor plan'
        },
        horizon: {
            title: 'Horizon Two Bedroom',
            size: '1,240 sq ft • Terrace Residence',
            features: [
                'Wraparound terrace with outdoor fireplace',
                'Ensuite spa baths with soaking tub & radiant floors',
                'Private flex suite ideal for office or guest lounge'
            ],
            overlay: 'linear-gradient(135deg, rgba(45,212,191,0.45), rgba(15,23,42,0.9))',
            svg: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 560" role="presentation" focusable="false">
                    <rect x="40" y="40" width="780" height="480" fill="none" stroke="#5eead4" stroke-width="12"/>
                    <rect x="70" y="70" width="340" height="210" fill="rgba(15,23,42,0.35)" stroke="#34d399" stroke-width="6"/>
                    <rect x="430" y="70" width="340" height="210" fill="rgba(15,23,42,0.25)" stroke="#38bdf8" stroke-width="6"/>
                    <rect x="70" y="320" width="340" height="170" fill="rgba(15,23,42,0.25)" stroke="#facc15" stroke-width="6"/>
                    <rect x="430" y="300" width="340" height="190" fill="rgba(15,23,42,0.35)" stroke="#fb923c" stroke-width="6"/>
                    <rect x="320" y="280" width="220" height="80" fill="rgba(15,23,42,0.5)" stroke="#c4b5fd" stroke-width="6"/>
                    <line x1="410" y1="280" x2="410" y2="360" stroke="#e0f2fe" stroke-width="5"/>
                    <line x1="320" y1="320" x2="540" y2="320" stroke="#e0f2fe" stroke-width="5"/>
                    <path d="M410 320 h60" stroke="#e0f2fe" stroke-width="6"/>
                    <path d="M470 320 a40 40 0 0 0 -40 -40" stroke="#e0f2fe" stroke-width="6" fill="none"/>
                    <path d="M320 360 h-60" stroke="#e0f2fe" stroke-width="6"/>
                    <path d="M260 360 a40 40 0 0 1 40 -40" stroke="#e0f2fe" stroke-width="6" fill="none"/>
                    <rect x="110" y="100" width="200" height="90" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="470" y="100" width="210" height="90" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="130" y="350" width="220" height="110" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="470" y="330" width="230" height="120" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <text x="140" y="160" fill="#ecfeff" font-size="28" font-family="Poppins">Bedroom A</text>
                    <text x="500" y="160" fill="#ecfeff" font-size="28" font-family="Poppins">Bedroom B</text>
                    <text x="140" y="400" fill="#ecfeff" font-size="28" font-family="Poppins">Terrace Lounge</text>
                    <text x="500" y="390" fill="#ecfeff" font-size="28" font-family="Poppins">Great Room</text>
                    <text x="362" y="318" fill="#e0f2fe" font-size="20" font-family="Poppins">Gallery</text>
                </svg>
            `,
            alt: 'Horizon two bedroom residence floor plan'
        },
        zenith: {
            title: 'Zenith Penthouse',
            size: '2,580 sq ft • Sky Villa',
            features: [
                'Two-story solarium with retractable glass walls',
                "Catering kitchen with butler's pantry and wine wall",
                'Private elevator vestibule and wellness spa'
            ],
            overlay: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(15,23,42,0.92))',
            svg: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 580" role="presentation" focusable="false">
                    <rect x="50" y="50" width="780" height="480" fill="none" stroke="#c4b5fd" stroke-width="12"/>
                    <rect x="80" y="80" width="320" height="200" fill="rgba(30,27,75,0.35)" stroke="#a855f7" stroke-width="6"/>
                    <rect x="430" y="80" width="340" height="150" fill="rgba(30,27,75,0.25)" stroke="#fcd34d" stroke-width="6"/>
                    <rect x="80" y="330" width="320" height="180" fill="rgba(30,27,75,0.25)" stroke="#fb923c" stroke-width="6"/>
                    <rect x="430" y="300" width="340" height="210" fill="rgba(30,27,75,0.35)" stroke="#38bdf8" stroke-width="6"/>
                    <rect x="360" y="260" width="160" height="90" fill="rgba(30,27,75,0.45)" stroke="#fda4af" stroke-width="6"/>
                    <rect x="360" y="380" width="160" height="90" fill="rgba(30,27,75,0.45)" stroke="#fda4af" stroke-width="6"/>
                    <path d="M360 300 h-60" stroke="#ede9fe" stroke-width="6"/>
                    <path d="M300 300 a40 40 0 0 1 40 -40" stroke="#ede9fe" stroke-width="6" fill="none"/>
                    <path d="M520 300 h60" stroke="#ede9fe" stroke-width="6"/>
                    <path d="M580 300 a40 40 0 0 0 -40 -40" stroke="#ede9fe" stroke-width="6" fill="none"/>
                    <rect x="120" y="120" width="200" height="100" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="470" y="120" width="200" height="80" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="140" y="360" width="200" height="120" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <rect x="470" y="340" width="220" height="130" fill="#f8fafc" opacity="0.08" stroke="#f8fafc" stroke-width="4"/>
                    <text x="150" y="170" fill="#fdf4ff" font-size="30" font-family="Poppins">Solarium</text>
                    <text x="490" y="150" fill="#fdf4ff" font-size="28" font-family="Poppins">Grand Salon</text>
                    <text x="150" y="410" fill="#fdf4ff" font-size="28" font-family="Poppins">Wellness Spa</text>
                    <text x="500" y="400" fill="#fdf4ff" font-size="28" font-family="Poppins">Sky Lounge</text>
                    <text x="380" y="305" fill="#fdf4ff" font-size="20" font-family="Poppins">Elev.</text>
                    <text x="380" y="425" fill="#fdf4ff" font-size="20" font-family="Poppins">Pantry</text>
                </svg>
            `,
            alt: 'Zenith penthouse residence floor plan'
        }
    };

    const updateFloorplanDisplay = (planKey) => {
        const plan = floorplanContent[planKey];
        if (!plan) return;

        floorplanButtonEls.forEach(btn => {
            const isActive = btn.dataset.plan === planKey;
            btn.classList.toggle('active', isActive);
        });

        if (floorplanImage) {
            floorplanImage.style.backgroundImage = plan.overlay;
            floorplanImage.innerHTML = `<div class="floorplan-canvas" aria-hidden="true">${plan.svg}</div>`;
            floorplanImage.setAttribute('aria-label', plan.alt || plan.title);
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
    };

    floorplanButtonEls.forEach(button => {
        button.addEventListener('click', () => {
            const planKey = button.dataset.plan || 'aurora';
            updateFloorplanDisplay(planKey);
        });
    });

    const defaultPlanKey = document.querySelector('.floorplan-button.active')?.dataset.plan || 'aurora';
    updateFloorplanDisplay(defaultPlanKey);

    // Booking modal flow
    if (bookingModal && bookingForm) {
        const bookingTriggers = document.querySelectorAll('.booking-trigger');
        const bookingSteps = Array.from(bookingModal.querySelectorAll('.booking-step'));
        const nextButton = bookingModal.querySelector('[data-action="next"]');
        const prevButton = bookingModal.querySelector('[data-action="prev"]');
        const submitButton = bookingModal.querySelector('[data-action="submit"]');
        const closeButton = bookingModal.querySelector('.booking-modal__close');
        const bookingProgressBar = bookingModal.querySelector('.booking-progress__bar');
        const bookingFlowLabel = document.getElementById('bookingFlowLabel');
        const bookingTitle = document.getElementById('bookingTitle');
        const bookingSubtitle = document.getElementById('bookingSubtitle');
        const bookingStepTwoTitle = document.getElementById('bookingStepTwoTitle');
        const bookingStepTwoCopy = document.getElementById('bookingStepTwoCopy');
        const experienceDateLabel = document.getElementById('experienceDateLabel');
        const experienceTimeLabel = document.getElementById('experienceTimeLabel');
        const confirmationPanel = document.getElementById('bookingConfirmation');
        const confirmationClose = confirmationPanel ? confirmationPanel.querySelector('.booking-nav--close') : null;
        const confirmationSummary = document.getElementById('bookingConfirmationSummary');
        const confirmationTitle = document.getElementById('bookingConfirmationTitle');
        const confirmationCopy = document.getElementById('bookingConfirmationCopy');
        const tourTypeGroup = bookingModal.querySelector('[data-field="tourType"]');
        const dateGroup = bookingModal.querySelector('[data-field="date"]');
        const timeGroup = bookingModal.querySelector('[data-field="time"]');
        const residenceNotesInput = document.getElementById('residenceNotes');
        const preferenceInputs = Array.from(bookingModal.querySelectorAll('input[name="residencePreference"]'));
        const tourInputs = tourTypeGroup ? Array.from(tourTypeGroup.querySelectorAll('input[name="tourType"]')) : [];
        const dateInput = document.getElementById('experienceDate');
        const timeInput = document.getElementById('experienceTime');
        const guestSelect = document.getElementById('guestCount');

        let currentStep = 0;
        let activeFlow = 'tour';

        const hideElement = element => {
            if (!element) return;
            element.hidden = true;
            element.setAttribute('hidden', '');
            element.setAttribute('aria-hidden', 'true');
            element.classList.add('is-hidden');
        };

        const showElement = element => {
            if (!element) return;
            element.hidden = false;
            element.removeAttribute('hidden');
            element.setAttribute('aria-hidden', 'false');
            element.classList.remove('is-hidden');
        };

        const flowContent = {
            tour: {
                label: 'Private Tour',
                title: 'Book a Private Tour',
                subtitle: 'Select a residence focus and time so our concierge team can prepare a bespoke experience.',
                stepTwoTitle: 'Select your tour preferences',
                stepTwoCopy: "Choose how and when you'd like to experience Codex Residences.",
                dateLabel: 'Preferred tour date',
                dateType: 'date',
                dateRequired: true,
                timeLabel: 'Preferred time',
                timeRequired: true,
                showTourType: true,
                showTimeField: true,
                finalCta: 'Confirm Tour',
                confirmationTitle: "You're booked!",
                confirmationCopy: 'Our concierge team will confirm your private tour within one business day.'
            },
            consultation: {
                label: 'Design Consultation',
                title: 'Reserve a Design Consultation',
                subtitle: 'Collaborate with our leasing stylists to curate finishes and furnishings.',
                stepTwoTitle: 'Share your ideal consultation time',
                stepTwoCopy: 'Pick a day that works for a design call or in-person session.',
                dateLabel: 'Preferred consultation date',
                dateType: 'date',
                dateRequired: true,
                timeLabel: 'Preferred time',
                timeRequired: false,
                showTourType: false,
                showTimeField: true,
                finalCta: 'Reserve Consultation',
                confirmationTitle: 'Consultation Reserved',
                confirmationCopy: 'Our stylists will be in touch shortly to finalize your consultation.'
            },
            waitlist: {
                label: 'Waitlist Request',
                title: 'Join the Codex Waitlist',
                subtitle: 'Tell us about your timeline and we will reach out when residences open.',
                stepTwoTitle: 'Let us know your timing',
                stepTwoCopy: 'Share your ideal move-in window and any flexibility.',
                dateLabel: 'Preferred move-in month',
                dateType: 'month',
                dateRequired: false,
                timeLabel: 'Ideal move-in timing',
                timeRequired: false,
                showTourType: false,
                showTimeField: false,
                finalCta: 'Join Waitlist',
                confirmationTitle: 'Added to the Waitlist',
                confirmationCopy: 'We will contact you as soon as matching residences become available.'
            },
            private: {
                label: 'Private Showing',
                title: 'Request a Private Showing',
                subtitle: 'Coordinate an exclusive viewing with our concierge team.',
                stepTwoTitle: 'Select your private showing preferences',
                stepTwoCopy: 'Let us know when and how you would like to visit.',
                dateLabel: 'Preferred showing date',
                dateType: 'date',
                dateRequired: true,
                timeLabel: 'Preferred time',
                timeRequired: true,
                showTourType: true,
                showTimeField: true,
                finalCta: 'Request Showing',
                confirmationTitle: 'Request Received',
                confirmationCopy: 'Our concierge will reach out with tailored availability.'
            }
        };

        const formatDisplayDate = (value, type) => {
            if (!value) return '';
            try {
                if (type === 'month') {
                    const [year, month] = value.split('-').map(Number);
                    if (!year || !month) return value;
                    const date = new Date(year, month - 1, 1);
                    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
                }
                const date = new Date(value);
                if (Number.isNaN(date.getTime())) return value;
                return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
            } catch (error) {
                console.warn('Unable to format date', error);
                return value;
            }
        };

        const escapeHtml = (value) => {
            if (typeof value !== 'string') {
                return value;
            }
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return value.replace(/[&<>"']/g, char => map[char] || char);
        };

        const getActiveFlowConfig = () => flowContent[activeFlow] || flowContent.tour;

        const clearFieldErrors = () => {
            bookingModal.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
        };

        const setPreference = (value) => {
            let matched = false;
            preferenceInputs.forEach(input => {
                const isMatch = input.value === value;
                input.checked = isMatch;
                const option = input.closest('.booking-option');
                option && option.classList.remove('field-error');
                if (isMatch) {
                    matched = true;
                }
            });

            if (!matched) {
                preferenceInputs.forEach(input => {
                    const isDefault = input.value === 'Open to Options';
                    input.checked = isDefault;
                    const option = input.closest('.booking-option');
                    option && option.classList.remove('field-error');
                });
            }
        };

        const determinePreference = (residenceName) => {
            if (!residenceName) return 'Open to Options';
            const lower = residenceName.toLowerCase();
            if (lower.includes('penthouse') || lower.includes('sky')) return 'Penthouse Collection';
            if (lower.includes('two')) return 'Two Bedroom Residences';
            if (lower.includes('one')) return 'One Bedroom Residences';
            if (lower.includes('studio')) return 'Studio Residences';
            return 'Open to Options';
        };

        const updateProgress = () => {
            if (!bookingProgressBar) return;
            const progress = ((currentStep + 1) / bookingSteps.length) * 100;
            bookingProgressBar.style.width = `${progress}%`;
        };

        const updateSummary = () => {
            if (!bookingSummary) return;
            const config = getActiveFlowConfig();
            const preference = preferenceInputs.find(input => input.checked)?.value || 'Open to Options';
            const customResidence = residenceNotesInput ? residenceNotesInput.value.trim() : '';
            const selectedTour = config.showTourType && tourTypeGroup
                ? tourInputs.find(input => input.checked)?.value || ''
                : '';
            const dateValue = dateInput ? dateInput.value : '';
            const timeValue = timeInput ? timeInput.value : '';
            const guestValue = guestSelect ? guestSelect.value : '';

            const items = [];
            const focusText = customResidence ? `${preference} – ${customResidence}` : preference;
            if (customResidence || preference !== 'Open to Options') {
                items.push({ label: 'Residence focus', value: focusText });
            }

            if (selectedTour) {
                items.push({ label: 'Experience type', value: selectedTour });
            }
            if (dateValue) {
                items.push({ label: config.dateLabel, value: formatDisplayDate(dateValue, config.dateType) });
            }
            if (config.showTimeField !== false && timeValue) {
                items.push({ label: config.timeLabel, value: timeValue });
            }
            if (guestValue) {
                items.push({ label: 'Guests', value: guestValue });
            }

            const intro = '<strong>Experience Overview</strong>';
            if (!items.length) {
                bookingSummary.innerHTML = `${intro}<p>Share a few details to personalize your experience.</p>`;
                return;
            }

            const summaryHtml = items
                .map(item => `<p><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</p>`)
                .join('');

            bookingSummary.innerHTML = `${intro}${summaryHtml}`;
        };

        const toggleNavButtons = () => {
            if (!nextButton || !prevButton || !submitButton) return;
            prevButton.disabled = currentStep === 0;
            nextButton.style.display = currentStep >= bookingSteps.length - 1 ? 'none' : 'inline-flex';
            submitButton.style.display = currentStep >= bookingSteps.length - 1 ? 'inline-flex' : 'none';
        };

        const setStepVisibility = () => {
            bookingSteps.forEach((step, index) => {
                if (index === currentStep) {
                    step.classList.add('active');
                    step.removeAttribute('hidden');
                } else {
                    step.classList.remove('active');
                    step.setAttribute('hidden', '');
                }
            });
            updateProgress();
            toggleNavButtons();
            updateSummary();
        };

        const configureFlow = (flowKey, residenceName = '') => {
            const config = flowContent[flowKey] || flowContent.tour;
            activeFlow = flowKey in flowContent ? flowKey : 'tour';

            bookingFlowLabel && (bookingFlowLabel.textContent = config.label);
            bookingTitle && (bookingTitle.textContent = config.title);
            bookingSubtitle && (bookingSubtitle.textContent = config.subtitle);
            bookingStepTwoTitle && (bookingStepTwoTitle.textContent = config.stepTwoTitle);
            bookingStepTwoCopy && (bookingStepTwoCopy.textContent = config.stepTwoCopy);
            submitButton && (submitButton.textContent = config.finalCta);
            confirmationTitle && (confirmationTitle.textContent = config.confirmationTitle);
            confirmationCopy && (confirmationCopy.textContent = config.confirmationCopy);

            if (tourTypeGroup) {
                tourTypeGroup.hidden = !config.showTourType;
                tourInputs.forEach((input, index) => {
                    input.required = !!config.showTourType;
                    input.checked = config.showTourType && index === 0;
                    const chip = input.closest('.booking-chip');
                    chip && chip.classList.remove('field-error');
                });
            }

            if (experienceDateLabel) {
                experienceDateLabel.textContent = config.dateLabel;
            }
            if (dateInput) {
                dateInput.type = config.dateType || 'date';
                dateInput.value = '';
                if (dateInput.type === 'date') {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.min = today;
                } else {
                    dateInput.removeAttribute('min');
                }
                dateInput.required = !!config.dateRequired;
                dateInput.classList.remove('field-error');
            }
            if (dateGroup) {
                dateGroup.hidden = false;
            }

            if (experienceTimeLabel) {
                experienceTimeLabel.textContent = config.timeLabel;
            }
            if (timeGroup) {
                timeGroup.hidden = config.showTimeField === false;
            }
            if (timeInput) {
                timeInput.value = '';
                timeInput.required = config.showTimeField !== false && !!config.timeRequired;
                timeInput.classList.remove('field-error');
            }

            residenceNotesInput && (residenceNotesInput.value = residenceName || '');
            if (residenceNotesInput) {
                residenceNotesInput.classList.remove('field-error');
            }

            setPreference(determinePreference(residenceName));
            guestSelect && (guestSelect.value = guestSelect.options[0]?.value || 'Solo');
            updateSummary();
        };

        const resetFlow = () => {
            bookingForm.reset();
            clearFieldErrors();
            setPreference('Open to Options');
            tourInputs.forEach((input, index) => {
                input.checked = index === 0;
            });
            residenceNotesInput && (residenceNotesInput.value = '');
            guestSelect && (guestSelect.value = guestSelect.options[0]?.value || 'Solo');
            bookingSummary && (bookingSummary.innerHTML = '<strong>Experience Overview</strong><p>Share a few details to personalize your experience.</p>');
            confirmationSummary && (confirmationSummary.innerHTML = '');
            hideElement(confirmationPanel);
            showElement(bookingForm);
            currentStep = 0;
            setStepVisibility();
        };

        const openBooking = (flowKey, residenceName = '') => {
            resetFlow();
            configureFlow(flowKey, residenceName);
            bookingModal.classList.add('open');
            bookingModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            showElement(bookingForm);
            hideElement(confirmationPanel);
            bookingForm.scrollTop = 0;
        };

        const closeBooking = () => {
            bookingModal.classList.remove('open');
            bookingModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            clearFieldErrors();
            hideElement(confirmationPanel);
            showElement(bookingForm);
        };

        const validateStep = (stepIndex) => {
            const stepEl = bookingSteps[stepIndex];
            if (!stepEl) return true;
            let valid = true;
            const fields = stepEl.querySelectorAll('input, select, textarea');

            fields.forEach(field => {
                if (field.closest('[hidden]')) return;
                if (field.type === 'radio') {
                    if (!field.required) return;
                    const group = stepEl.querySelectorAll(`input[name="${field.name}"]`);
                    const isChecked = Array.from(group).some(input => input.checked);
                    group.forEach(input => {
                        const wrapper = input.closest('.booking-option, .booking-chip');
                        if (wrapper) {
                            wrapper.classList.toggle('field-error', !isChecked);
                        }
                    });
                    if (!isChecked) {
                        valid = false;
                    }
                    return;
                }

                const shouldValidate = field.required || field.value.trim().length > 0;
                if (!shouldValidate) {
                    field.classList.remove('field-error');
                    return;
                }

                if (!field.validity.valid || (field.required && !field.value.trim())) {
                    field.classList.add('field-error');
                    if (valid && typeof field.focus === 'function') {
                        field.focus();
                    }
                    valid = false;
                } else {
                    field.classList.remove('field-error');
                }
            });

            return valid;
        };

        const showConfirmation = (contactDetails) => {
            if (!confirmationPanel) return;
            hideElement(bookingForm);
            showElement(confirmationPanel);
            confirmationCopy && (confirmationCopy.textContent = getActiveFlowConfig().confirmationCopy);
            if (confirmationSummary && bookingSummary) {
                confirmationSummary.innerHTML = bookingSummary.innerHTML;
            }
            if (confirmationCopy && contactDetails && contactDetails.value) {
                confirmationCopy.textContent = `${getActiveFlowConfig().confirmationCopy} We'll reach out via ${contactDetails.method.toLowerCase()} at ${contactDetails.value}.`;
            }
            bookingModal.scrollTop = 0;
            confirmationPanel.scrollTop = 0;
        };

        bookingTriggers.forEach(trigger => {
            trigger.addEventListener('click', event => {
                event.preventDefault();
                const flowKey = trigger.dataset.flow || 'tour';
                const residenceName = trigger.dataset.residence || '';
                openBooking(flowKey, residenceName);
            });
        });

        nextButton && nextButton.addEventListener('click', () => {
            if (!validateStep(currentStep)) return;
            currentStep = Math.min(currentStep + 1, bookingSteps.length - 1);
            setStepVisibility();
            bookingForm.scrollTop = 0;
        });

        prevButton && prevButton.addEventListener('click', () => {
            currentStep = Math.max(currentStep - 1, 0);
            setStepVisibility();
            bookingForm.scrollTop = 0;
        });

        bookingForm.addEventListener('submit', event => {
            event.preventDefault();
            if (!validateStep(currentStep)) return;

            const formData = new FormData(bookingForm);
            const name = (formData.get('bookingName') || '').toString().trim();
            const email = (formData.get('bookingEmail') || '').toString().trim();
            const phone = (formData.get('bookingPhone') || '').toString().trim();
            const method = (formData.get('contactPreference') || 'Email').toString();

            if (!name || !email) {
                return;
            }

            let contactValue = email;
            let contactMethod = method;
            if ((method === 'Phone' || method === 'Text') && phone) {
                contactValue = phone;
            } else if (method === 'Phone' || method === 'Text') {
                contactMethod = 'Email';
            }

            showConfirmation({ method: contactMethod, value: contactValue });
        });

        bookingForm.addEventListener('input', event => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            target.classList.remove('field-error');
            const wrapper = target.closest('.booking-option, .booking-chip');
            wrapper && wrapper.classList.remove('field-error');
            updateSummary();
        });

        bookingForm.addEventListener('change', event => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            target.classList.remove('field-error');
            const wrapper = target.closest('.booking-option, .booking-chip');
            wrapper && wrapper.classList.remove('field-error');
            updateSummary();
        });

        closeButton && closeButton.addEventListener('click', closeBooking);
        confirmationClose && confirmationClose.addEventListener('click', closeBooking);

        bookingModal.addEventListener('click', event => {
            if (event.target === bookingModal) {
                closeBooking();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && bookingModal.classList.contains('open')) {
                closeBooking();
            }
        });

        // Initialize default state
        resetFlow();
    }

    // Team directory filtering
    const staffSection = document.querySelector('[data-staff-section]');
    if (staffSection) {
        const staffList = staffSection.querySelector('[data-staff-list]');
        const staffCount = staffSection.querySelector('[data-staff-count]');
        const emptyState = staffSection.querySelector('[data-staff-empty]');
        const searchInput = staffSection.querySelector('#staffSearch');
        const sortSelect = staffSection.querySelector('#staffSort');
        const filterForm = staffSection.querySelector('#teamFilters');
        const inlineReset = staffSection.querySelector('.team-reset--inline');
        const disciplineFilters = Array.from(staffSection.querySelectorAll('input[name="teamDiscipline"]'));
        const expertiseFilters = Array.from(staffSection.querySelectorAll('input[name="teamExpertise"]'));
        const availabilityFilters = Array.from(staffSection.querySelectorAll('input[name="teamAvailability"]'));
        const languageFilters = Array.from(staffSection.querySelectorAll('input[name="teamLanguage"]'));

        const parseValues = (value = '') => value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);

        const staffData = Array.from(staffSection.querySelectorAll('.team-member')).map(element => {
            const name = (element.querySelector('h3')?.textContent || '').trim();
            const role = (element.querySelector('.team-role')?.textContent || '').trim();
            const bio = (element.querySelector('.team-bio')?.textContent || '').trim();
            const highlights = Array.from(element.querySelectorAll('.team-highlights li'))
                .map(item => item.textContent?.trim() || '')
                .join(' ');
            return {
                element,
                name,
                role,
                bio,
                searchIndex: `${name} ${role} ${bio} ${highlights}`.toLowerCase(),
                team: parseValues(element.dataset.team),
                expertise: parseValues(element.dataset.expertise),
                languages: parseValues(element.dataset.languages),
                availability: parseValues(element.dataset.availability),
                tenure: Number(element.dataset.tenure || 0),
                specialtyDepth: Number(element.dataset.specialtyDepth || 0)
            };
        });

        const updateDirectory = () => {
            const query = (searchInput?.value || '').trim().toLowerCase();
            const selectedDisciplines = disciplineFilters.filter(input => input.checked).map(input => input.value);
            const selectedExpertise = expertiseFilters.filter(input => input.checked).map(input => input.value);
            const selectedAvailability = availabilityFilters.filter(input => input.checked).map(input => input.value);
            const selectedLanguages = languageFilters.filter(input => input.checked).map(input => input.value);
            const sortValue = sortSelect ? sortSelect.value : 'experience';

            let filtered = staffData.filter(member => {
                const matchesQuery = !query || member.searchIndex.includes(query);
                const matchesDiscipline = !selectedDisciplines.length || selectedDisciplines.some(value => member.team.includes(value));
                const matchesExpertise = !selectedExpertise.length || selectedExpertise.every(value => member.expertise.includes(value));
                const matchesAvailability = !selectedAvailability.length || selectedAvailability.every(value => member.availability.includes(value));
                const matchesLanguages = !selectedLanguages.length || selectedLanguages.every(value => member.languages.includes(value));
                return matchesQuery && matchesDiscipline && matchesExpertise && matchesAvailability && matchesLanguages;
            });

            const sorters = {
                experience: (a, b) => (b.tenure - a.tenure) || a.name.localeCompare(b.name),
                alphabetical: (a, b) => a.name.localeCompare(b.name),
                specialty: (a, b) => (b.specialtyDepth - a.specialtyDepth) || (b.expertise.length - a.expertise.length) || a.name.localeCompare(b.name)
            };

            const sorter = sorters[sortValue] || sorters.experience;
            filtered = filtered.sort(sorter);

            staffData.forEach(member => {
                const isVisible = filtered.includes(member);
                member.element.classList.toggle('is-hidden', !isVisible);
                if (isVisible) {
                    member.element.removeAttribute('hidden');
                } else {
                    member.element.setAttribute('hidden', '');
                }
            });

            if (staffList) {
                filtered.forEach(member => staffList.appendChild(member.element));
            }

            if (staffCount) {
                const total = staffData.length;
                const visible = filtered.length;
                const label = visible === 1 ? 'specialist' : 'specialists';
                staffCount.textContent = `Showing ${visible} of ${total} ${label}`;
            }

            if (emptyState) {
                if (!filtered.length) {
                    emptyState.hidden = false;
                    emptyState.removeAttribute('hidden');
                } else {
                    emptyState.hidden = true;
                    emptyState.setAttribute('hidden', '');
                }
            }
        };

        const filterInputs = [
            ...disciplineFilters,
            ...expertiseFilters,
            ...availabilityFilters,
            ...languageFilters
        ];

        searchInput && searchInput.addEventListener('input', () => updateDirectory());
        filterInputs.forEach(input => {
            input.addEventListener('change', updateDirectory);
        });
        sortSelect && sortSelect.addEventListener('change', updateDirectory);
        filterForm && filterForm.addEventListener('reset', () => {
            window.requestAnimationFrame(updateDirectory);
        });
        inlineReset && inlineReset.addEventListener('click', () => {
            if (filterForm) {
                filterForm.reset();
                window.requestAnimationFrame(updateDirectory);
            }
        });

        updateDirectory();
    }

    // Policy enhancements (table of contents + accordions)
    const policyPage = document.querySelector('.policy-page');
    if (policyPage) {
        const toc = document.querySelector('[data-policy-toc]');
        if (toc) {
            const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
            const observedSections = tocLinks
                .map(link => {
                    const id = link.getAttribute('href')?.substring(1);
                    if (!id) return null;
                    const section = document.getElementById(id);
                    if (section) {
                        link.addEventListener('click', event => {
                            event.preventDefault();
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });
                    }
                    return section;
                })
                .filter(section => section instanceof HTMLElement);

            const setActiveLink = (id) => {
                tocLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const isActive = href === `#${id}`;
                    link.classList.toggle('is-active', isActive);
                    if (isActive) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            };

            if (observedSections.length) {
                const tocObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setActiveLink(entry.target.id);
                        }
                    });
                }, { threshold: 0.45, rootMargin: '-20% 0px -50% 0px' });

                observedSections.forEach(section => tocObserver.observe(section));
            }
        }

        const accordionItems = Array.from(document.querySelectorAll('[data-policy-accordion] .policy-accordion__item'));
        accordionItems.forEach(item => {
            const trigger = item.querySelector('button');
            const content = item.querySelector('.policy-accordion__content');
            if (!trigger || !content) return;

            if (!trigger.hasAttribute('aria-expanded')) {
                trigger.setAttribute('aria-expanded', content.hasAttribute('hidden') ? 'false' : 'true');
            }

            trigger.addEventListener('click', () => {
                const expanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', String(!expanded));
                if (expanded) {
                    content.setAttribute('hidden', '');
                    item.classList.remove('is-open');
                } else {
                    content.removeAttribute('hidden');
                    item.classList.add('is-open');
                }
            });
        });
    }

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

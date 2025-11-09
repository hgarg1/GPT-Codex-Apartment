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
            if (confirmationPanel) {
                confirmationPanel.hidden = true;
            }
            bookingForm.hidden = false;
            currentStep = 0;
            setStepVisibility();
        };

        const openBooking = (flowKey, residenceName = '') => {
            resetFlow();
            configureFlow(flowKey, residenceName);
            bookingModal.classList.add('open');
            bookingModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            bookingForm.scrollTop = 0;
        };

        const closeBooking = () => {
            bookingModal.classList.remove('open');
            bookingModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            clearFieldErrors();
            if (confirmationPanel) {
                confirmationPanel.hidden = true;
            }
            bookingForm.hidden = false;
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
            bookingForm.hidden = true;
            confirmationPanel.hidden = false;
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

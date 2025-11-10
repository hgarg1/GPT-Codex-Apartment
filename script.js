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
    const portfolioGrid = document.getElementById('portfolioGrid');
    const portfolioCount = document.getElementById('portfolioCount');
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    const leasingGrid = document.getElementById('leasingGrid');
    const leaseFilters = document.querySelectorAll('.lease-filter');
    const leaseSortSelect = document.getElementById('leaseSort');
    const leaseModal = document.getElementById('leaseModal');
    const leaseForm = document.getElementById('leaseForm');
    const accountStatus = document.getElementById('accountStatus');
    const accountDetails = document.getElementById('accountDetails');
    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');
    const accountProperties = document.getElementById('accountProperties');
    const accountReset = document.getElementById('accountReset');
    let openLeaseApplication = () => {};

    const formatCurrency = (value) => {
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(value);
        } catch (error) {
            console.warn('Unable to format currency', error);
            return `$${value}`;
        }
    };

    const formatFullDate = (value) => {
        if (!value) return "";
        try {
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return value;
            return date.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric"
            });
        } catch (error) {
            console.warn('Unable to format date', error);
            return value;
        }
    };

    const portfolioResidences = [
        {
            id: "portfolio-hudson",
            name: "Codex Hudson Atelier",
            city: "New York, USA",
            signature: "skyline",
            signatureLabel: "Skyline",
            bedrooms: "Studios – 3 Bedrooms",
            size: "520 – 1,980",
            description: "Glass-clad residences hovering over the Hudson River with bespoke art installations and private winter gardens.",
            image: "https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-london",
            name: "Atelier Codex Mayfair",
            city: "London, UK",
            signature: "heritage",
            signatureLabel: "Heritage",
            bedrooms: "1 – 4 Bedrooms",
            size: "690 – 2,400",
            description: "Historic Georgian facades conceal modern sanctuaries curated with museum-quality lighting and private clubs.",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-dubai",
            name: "Codex Marina Horizon",
            city: "Dubai, UAE",
            signature: "resort",
            signatureLabel: "Resort",
            bedrooms: "2 – 5 Bedrooms",
            size: "1,450 – 3,800",
            description: "Private marina berths, floating lounges, and sunset terraces define this desert waterfront icon.",
            image: "https://images.unsplash.com/photo-1526481280695-3c4693f338aa?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-singapore",
            name: "Codex Botanica",
            city: "Singapore",
            signature: "wellness",
            signatureLabel: "Wellness",
            bedrooms: "Residences & Sky Villas",
            size: "710 – 2,900",
            description: "Vertical biophilic conservatories, restorative mineral pools, and sound baths in the clouds.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-tokyo",
            name: "Codex Lumina Shibuya",
            city: "Tokyo, Japan",
            signature: "skyline",
            signatureLabel: "Skyline",
            bedrooms: "Micro-Lofts – 2 Bedrooms",
            size: "420 – 1,120",
            description: "Kinetic facades with programmable lighting and tranquil meditation balconies above Shibuya Crossing.",
            image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-mexico",
            name: "Codex Riviera Residences",
            city: "Riviera Maya, Mexico",
            signature: "resort",
            signatureLabel: "Resort",
            bedrooms: "2 – 6 Bedrooms",
            size: "1,650 – 4,200",
            description: "Jungle-canopy villas with private cenote pools, curated spa rituals, and chef-partnered dining.",
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-sydney",
            name: "Codex Harbour Atelier",
            city: "Sydney, Australia",
            signature: "skyline",
            signatureLabel: "Skyline",
            bedrooms: "1 – 3 Bedrooms",
            size: "690 – 2,150",
            description: "Glass atriums cantilever over the harbour with yacht butler service and curated coastal retreats.",
            image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: "portfolio-zermatt",
            name: "Codex Alpine Sanctuary",
            city: "Zermatt, Switzerland",
            signature: "resort",
            signatureLabel: "Resort",
            bedrooms: "Residences & Chalets",
            size: "980 – 4,600",
            description: "Ski-in residences with private funicular access, onsen suites, and sommeliers of the Alps.",
            image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1400&q=80"
        }
    ];

    const leasingResidences = [
        {
            id: "lease-s4",
            name: "Residence S4 — Skyline Studio",
            type: "studio",
            bedrooms: "Studio",
            bathrooms: 1,
            size: 520,
            price: 2450,
            deposit: 3500,
            location: "Metropolis, NY",
            signature: "sky",
            signatureLabel: "Skyline",
            status: "Immediate",
            highlight: "Smart living layout with custom workstation and dawn-to-dusk lighting scenes.",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
            features: ["Juliet balcony overlooking the river", "Integrated storage wall with hidden bed", "Touchless entry with biometric access"]
        },
        {
            id: "lease-11b",
            name: "Residence 11B — Corner One Bedroom",
            type: "one",
            bedrooms: "1 Bedroom + Winter Garden",
            bathrooms: 1.5,
            size: 810,
            price: 3375,
            deposit: 4200,
            location: "Metropolis, NY",
            signature: "sky",
            signatureLabel: "Skyline",
            status: "30-Day Move-In",
            highlight: "Dual exposure great room with retractable glass and curated lighting.",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
            features: ["Chef's kitchen with quartz waterfall island", "Owner's suite with wardrobe atelier", "Integrated sound system throughout"]
        },
        {
            id: "lease-16a",
            name: "Residence 16A — Two Bedroom Atelier",
            type: "two",
            bedrooms: "2 Bedroom + Study",
            bathrooms: 2,
            size: 1280,
            price: 5150,
            deposit: 6200,
            location: "Metropolis, NY",
            signature: "wellness",
            signatureLabel: "Wellness",
            status: "Immediate",
            highlight: "Wellness wing with infrared sauna and customizable aromatherapy.",
            image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80",
            features: ["Wraparound terrace with herb garden planters", "Primary ensuite with soaking tub and steam shower", "Dedicated flex studio for fitness or office"]
        },
        {
            id: "lease-21c",
            name: "Residence 21C — Three Bedroom Gallery",
            type: "three",
            bedrooms: "3 Bedroom",
            bathrooms: 3,
            size: 1650,
            price: 7450,
            deposit: 9000,
            location: "Metropolis, NY",
            signature: "heritage",
            signatureLabel: "Heritage",
            status: "45-Day Move-In",
            highlight: "Corner great room framed by gallery walls and winter garden lounge.",
            image: "https://images.unsplash.com/photo-1522708323590-ff0c0d31f9ef?auto=format&fit=crop&w=1400&q=80",
            features: ["Dining salon with seating for ten", "Private vestibule with custom millwork", "Dedicated wine room with Sommelier storage"]
        },
        {
            id: "lease-28p",
            name: "Penthouse 28P — Sky Villa",
            type: "penthouse",
            bedrooms: "3 Bedroom + Library",
            bathrooms: 3.5,
            size: 2540,
            price: 14800,
            deposit: 18000,
            location: "Metropolis, NY",
            signature: "sky",
            signatureLabel: "Sky Collection",
            status: "Private Release",
            highlight: "Two-level solarium with infinity-edge plunge pool and private elevator.",
            image: "https://images.unsplash.com/photo-1521783985994-96a3360ce2a0?auto=format&fit=crop&w=1400&q=80",
            features: ["Panoramic rooftop terrace with outdoor kitchen", "Primary wing with dual dressing galleries", "In-residence wellness spa with cold plunge"]
        },
        {
            id: "lease-08l",
            name: "Residence 08L — Lofted Studio",
            type: "studio",
            bedrooms: "Studio + Loft",
            bathrooms: 1,
            size: 610,
            price: 2895,
            deposit: 3600,
            location: "Metropolis, NY",
            signature: "heritage",
            signatureLabel: "Heritage",
            status: "Immediate",
            highlight: "Double-height ceilings with mezzanine sleep loft and reading library.",
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
            features: ["Restored brickwork with integrated lighting", "Gourmet kitchen with brass fixtures", "Smart shades with voice control"]
        },
        {
            id: "lease-19d",
            name: "Residence 19D — Wellness Duplex",
            type: "two",
            bedrooms: "2 Bedroom Duplex",
            bathrooms: 2.5,
            size: 1420,
            price: 5980,
            deposit: 7200,
            location: "Metropolis, NY",
            signature: "wellness",
            signatureLabel: "Wellness",
            status: "Immediate",
            highlight: "Two-story living with a private meditation terrace and hydrotherapy bath.",
            image: "https://images.unsplash.com/photo-1526481280695-3c4693f338aa?auto=format&fit=crop&w=1400&q=80",
            features: ["Floating staircase with sculptural lighting", "Residence automation via Codex App", "Heated stone flooring throughout"]
        },
        {
            id: "lease-05g",
            name: "Residence 05G — Garden Three Bedroom",
            type: "three",
            bedrooms: "3 Bedroom + Garden",
            bathrooms: 2.5,
            size: 1580,
            price: 6890,
            deposit: 8400,
            location: "Metropolis, NY",
            signature: "resort",
            signatureLabel: "Resort",
            status: "Immediate",
            highlight: "Private terrace with plunge spa and outdoor kitchen for year-round entertaining.",
            image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
            features: ["Outdoor living room with fire feature", "Indoor/outdoor audio integration", "Primary suite with terrace access"]
        },
        {
            id: "lease-14f",
            name: "Residence 14F — River View One Bedroom",
            type: "one",
            bedrooms: "1 Bedroom + Den",
            bathrooms: 1.5,
            size: 890,
            price: 3625,
            deposit: 4500,
            location: "Metropolis, NY",
            signature: "sky",
            signatureLabel: "Skyline",
            status: "Immediate",
            highlight: "Riverfront den with built-in library and immersive soundscapes.",
            image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
            features: ["Corner entertaining lounge with skyline vistas", "Integrated wine refrigeration", "Primary suite with spa shower"]
        },
        {
            id: "lease-24e",
            name: "Residence 24E — Signature Two Bedroom",
            type: "two",
            bedrooms: "2 Bedroom + Atelier",
            bathrooms: 2.5,
            size: 1490,
            price: 6420,
            deposit: 7800,
            location: "Metropolis, NY",
            signature: "heritage",
            signatureLabel: "Heritage",
            status: "30-Day Move-In",
            highlight: "Grand salon with double-height library ladder and sculptural fireplace.",
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
            features: ["Custom millwork atelier for art or study", "Primary suite with dressing gallery", "Dedicated catering pantry"]
        },
        {
            id: "lease-30p",
            name: "Sky Residence 30P — Penthouse Duplex",
            type: "penthouse",
            bedrooms: "4 Bedroom Duplex",
            bathrooms: 4.5,
            size: 3120,
            price: 18650,
            deposit: 22500,
            location: "Metropolis, NY",
            signature: "sky",
            signatureLabel: "Sky Collection",
            status: "Private Release",
            highlight: "Two-story glass observatory with private tasting lounge and infinity-edge spa.",
            image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80",
            features: ["Double-height great room with floating fireplace", "Sky terrace with retractable canopy", "Private wellness suite with plunge pool"]
        }
    ];

    if (portfolioGrid) {
        let activePortfolioFilter = "all";

        const renderPortfolio = (filter = "all") => {
            activePortfolioFilter = filter;
            const filtered = portfolioResidences.filter(item => filter === "all" || item.signature === filter);
            if (portfolioCount) {
                const label = filtered.length === 1 ? "1 residence" : `${filtered.length} residences`;
                portfolioCount.textContent = label;
            }

            if (!filtered.length) {
                portfolioGrid.innerHTML = "<p class=\"portfolio-empty\">No residences match this signature at the moment.</p>";
                return;
            }

            portfolioGrid.innerHTML = filtered.map(item => `
                <article class="portfolio-card" data-signature="${item.signature}">
                    <div class="portfolio-card__media" style="background-image: url('${item.image}')" role="img" aria-label="${item.name}"></div>
                    <div class="portfolio-card__content">
                        <span class="portfolio-card__eyebrow">${item.city}</span>
                        <h3 class="portfolio-card__title">${item.name}</h3>
                        <p class="portfolio-card__description">${item.description}</p>
                        <ul class="portfolio-card__meta">
                            <li>${item.bedrooms}</li>
                            <li>${item.size} sq ft avg.</li>
                            <li>${item.signatureLabel} Signature</li>
                        </ul>
                    </div>
                </article>
            `).join("");
        };

        portfolioFilters.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.portfolioFilter || "all";
                portfolioFilters.forEach(btn => btn.classList.toggle('active', btn === button));
                renderPortfolio(filter);
            });
        });

        renderPortfolio(activePortfolioFilter);
    }

    if (leasingGrid) {
        let activeLeaseFilter = "all";

        const applyLeaseFilter = (collection, filter) => {
            if (filter === "all") return collection.slice();
            return collection.filter(item => item.type === filter || item.signature === filter);
        };

        const sortLeases = (collection) => {
            if (!leaseSortSelect) return collection;
            const value = leaseSortSelect.value;
            const sorted = collection.slice();
            if (value === "priceAsc") {
                sorted.sort((a, b) => a.price - b.price);
            } else if (value === "priceDesc") {
                sorted.sort((a, b) => b.price - a.price);
            } else if (value === "sizeDesc") {
                sorted.sort((a, b) => b.size - a.size);
            }
            return sorted;
        };

        const attachLeaseButtons = () => {
            const leaseButtons = leasingGrid.querySelectorAll('.lease-cta');
            leaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const propertyId = button.dataset.propertyId || "";
                    openLeaseApplication(propertyId);
                });
            });
        };

        const renderLeasing = () => {
            const filtered = applyLeaseFilter(leasingResidences, activeLeaseFilter);
            const sorted = sortLeases(filtered);

            if (!sorted.length) {
                leasingGrid.innerHTML = "<p class=\"leasing-empty\">No residences match your filters. Adjust the filters to explore more options.</p>";
                return;
            }

            leasingGrid.innerHTML = sorted.map(property => `
                <article class="lease-card" data-type="${property.type}">
                    <div class="lease-card__media" style="background-image: url('${property.image}')" role="img" aria-label="${property.name}"></div>
                    <div class="lease-card__body">
                        <div class="lease-card__header">
                            <h3>${property.name}</h3>
                            <span class="lease-card__badge lease-card__badge--${property.signature}">${property.signatureLabel}</span>
                        </div>
                        <p class="lease-card__location">${property.location}</p>
                        <p class="lease-card__price">${formatCurrency(property.price)}/mo</p>
                        <ul class="lease-card__meta">
                            <li>${property.bedrooms}</li>
                            <li>${property.size} sq ft</li>
                            <li>${property.bathrooms} bath${property.bathrooms > 1 ? 's' : ''}</li>
                        </ul>
                        <p class="lease-card__highlight">${property.highlight}</p>
                        <ul class="lease-card__features">
                            ${property.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <div class="lease-card__footer">
                            <span class="lease-card__status">Status: ${property.status}</span>
                            <button class="lease-cta" data-property-id="${property.id}" type="button">Apply to Lease</button>
                        </div>
                    </div>
                </article>
            `).join("");

            attachLeaseButtons();
        };

        leaseFilters.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.leaseFilter || "all";
                activeLeaseFilter = filter;
                leaseFilters.forEach(btn => btn.classList.toggle('active', btn === button));
                renderLeasing();
            });
        });

        leaseSortSelect && leaseSortSelect.addEventListener('change', () => renderLeasing());

        renderLeasing();
    }

    if (leaseModal && leaseForm) {
        const leaseSteps = Array.from(leaseForm.querySelectorAll('.lease-step'));
        const leaseProgressBar = leaseModal.querySelector('.lease-progress__bar');
        const leaseNextButton = leaseModal.querySelector('[data-lease-action="next"]');
        const leasePrevButton = leaseModal.querySelector('[data-lease-action="prev"]');
        const leaseSubmitButton = leaseModal.querySelector('[data-lease-action="submit"]');
        const leaseCloseButton = document.getElementById('leaseCloseButton');
        const leaseModalClose = leaseModal.querySelector('.lease-modal__close');
        const leaseConfirmation = document.getElementById('leaseConfirmation');
        const leasePropertySummary = document.getElementById('leasePropertySummary');
        const leaseModalEyebrow = document.getElementById('leaseModalEyebrow');
        const leaseModalTitle = document.getElementById('leaseModalTitle');
        const leaseModalSubtitle = document.getElementById('leaseModalSubtitle');
        const paymentStatus = document.getElementById('paymentStatus');
        const leaseConfirmationSummary = document.getElementById('leaseConfirmationSummary');
        const leaseConfirmationTitle = document.getElementById('leaseConfirmationTitle');
        const leaseConfirmationCopy = document.getElementById('leaseConfirmationCopy');
        const accountEmailConfirm = document.getElementById('accountEmailConfirm');
        const applicantEmailInput = document.getElementById('applicantEmail');
        const cardNameInput = document.getElementById('cardName');
        const cardNumberInput = document.getElementById('cardNumber');
        const cardExpiryInput = document.getElementById('cardExpiry');
        const cardCvcInput = document.getElementById('cardCvc');
        const billingZipInput = document.getElementById('billingZip');
        const moveInInput = document.getElementById('applicationMoveIn');

        let leaseCurrentStep = 0;
        let leaseActiveProperty = null;
        let mockPaymentAuthorized = false;

        const setDefaultMoveIn = () => {
            if (!moveInInput) return;
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            moveInInput.value = defaultDate.toISOString().split('T')[0];
        };

        const setLeaseStepVisibility = () => {
            leaseSteps.forEach((step, index) => {
                const isActive = index === leaseCurrentStep;
                step.hidden = !isActive;
                step.classList.toggle('is-hidden', !isActive);
                step.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            if (leasePrevButton) {
                leasePrevButton.disabled = leaseCurrentStep === 0;
                leasePrevButton.classList.toggle('is-hidden', leaseCurrentStep === 0);
            }

            if (leaseNextButton) {
                leaseNextButton.classList.toggle('is-hidden', leaseCurrentStep === leaseSteps.length - 1);
            }

            if (leaseSubmitButton) {
                leaseSubmitButton.classList.toggle('is-hidden', leaseCurrentStep !== leaseSteps.length - 1);
            }

            if (leaseProgressBar) {
                const progress = ((leaseCurrentStep + 1) / leaseSteps.length) * 100;
                leaseProgressBar.style.width = `${progress}%`;
            }

            if (leaseCurrentStep === leaseSteps.length - 1 && accountEmailConfirm && applicantEmailInput) {
                accountEmailConfirm.value = applicantEmailInput.value.trim();
            }
        };

        const resetLeaseForm = () => {
            leaseForm.reset();
            leaseCurrentStep = 0;
            mockPaymentAuthorized = false;
            if (paymentStatus) {
                paymentStatus.textContent = '';
                paymentStatus.classList.remove('is-success', 'is-error');
            }
            if (accountEmailConfirm) {
                accountEmailConfirm.value = '';
            }
            leaseForm.classList.remove('is-hidden');
            leaseForm.removeAttribute('hidden');
            if (leaseConfirmation) {
                leaseConfirmation.hidden = true;
                leaseConfirmation.setAttribute('hidden', '');
            }
            setDefaultMoveIn();
            setLeaseStepVisibility();
        };

        const closeLeaseModal = () => {
            resetLeaseForm();
            leaseActiveProperty = null;
            leaseModal.classList.remove('open');
            leaseModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        };

        const authorizeMockPayment = () => {
            if (!paymentStatus) return true;
            const number = (cardNumberInput?.value || '').replace(/\s+/g, '');
            const expiry = (cardExpiryInput?.value || '').trim();
            const cvc = (cardCvcInput?.value || '').trim();
            const zip = (billingZipInput?.value || '').trim();
            const cardName = (cardNameInput?.value || '').trim();

            const errors = [];
            if (!cardName) errors.push('Enter the name on the card.');
            if (!/^\d{13,19}$/.test(number)) errors.push('Enter a valid card number.');
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errors.push('Expiration must be in MM/YY format.');
            if (!/^\d{3,4}$/.test(cvc)) errors.push('CVC must be three or four digits.');
            if (!/^\d{5,10}$/.test(zip)) errors.push('Enter a valid ZIP or postal code.');

            if (errors.length) {
                paymentStatus.textContent = errors[0];
                paymentStatus.classList.remove('is-success');
                paymentStatus.classList.add('is-error');
                return false;
            }

            const depositText = formatCurrency(leaseActiveProperty ? leaseActiveProperty.deposit : 0);
            paymentStatus.textContent = `Mock payment of ${depositText} authorized.`;
            paymentStatus.classList.remove('is-error');
            paymentStatus.classList.add('is-success');
            mockPaymentAuthorized = true;
            return true;
        };

        const validateLeaseStep = (stepIndex) => {
            const stepEl = leaseSteps[stepIndex];
            if (!stepEl) return true;
            let valid = true;
            const fields = stepEl.querySelectorAll('input, select, textarea');

            fields.forEach(field => {
                if (field.disabled || field.closest('[hidden]')) return;

                if (field.type === 'checkbox') {
                    if (!field.required) return;
                    const wrapper = field.closest('.checkbox');
                    if (!field.checked) {
                        wrapper && wrapper.classList.add('field-error');
                        field.classList.add('field-error');
                        if (valid && typeof field.focus === 'function') {
                            field.focus();
                        }
                        valid = false;
                    } else {
                        wrapper && wrapper.classList.remove('field-error');
                        field.classList.remove('field-error');
                    }
                    return;
                }

                const value = field.value.trim();
                if (field.required && !value) {
                    field.classList.add('field-error');
                    if (valid && typeof field.focus === 'function') {
                        field.focus();
                    }
                    valid = false;
                } else {
                    field.classList.remove('field-error');
                }
            });

            if (!valid) {
                return false;
            }

            if (stepIndex === 3) {
                return authorizeMockPayment();
            }

            if (stepIndex === 4) {
                if (!mockPaymentAuthorized) {
                    if (paymentStatus) {
                        paymentStatus.textContent = 'Please authorize the mock deposit before creating your account.';
                        paymentStatus.classList.add('is-error');
                    }
                    return false;
                }
                const password = leaseForm.querySelector('#accountPassword');
                const confirm = leaseForm.querySelector('#accountPasswordConfirm');
                if (password && confirm && password.value !== confirm.value) {
                    confirm.classList.add('field-error');
                    confirm.focus();
                    return false;
                }
                confirm && confirm.classList.remove('field-error');
            }

            return true;
        };

        const buildConfirmationSummary = (formData) => {
            if (!leaseActiveProperty) return '';
            const moveIn = formData.get('applicationMoveIn');
            const leaseTerm = formData.get('leaseTerm');
            const applicantName = formData.get('applicantName');
            const applicantEmail = formData.get('applicantEmail');
            return `
                <div class="lease-confirmation__section">
                    <h4>Residence</h4>
                    <p>${leaseActiveProperty.name}</p>
                    <p>${leaseActiveProperty.location}</p>
                </div>
                <div class="lease-confirmation__section">
                    <h4>Move-In</h4>
                    <p>${moveIn ? formatFullDate(moveIn.toString()) : 'Pending'}</p>
                    <p>${leaseTerm || ''}</p>
                </div>
                <div class="lease-confirmation__section">
                    <h4>Mock Deposit</h4>
                    <p>${formatCurrency(leaseActiveProperty.deposit)}</p>
                    <p>Authorized</p>
                </div>
                <div class="lease-confirmation__section">
                    <h4>Account</h4>
                    <p>${applicantName || 'Codex Resident'}</p>
                    <p>${applicantEmail || ''}</p>
                </div>
            `;
        };

        const completeLeaseApplication = () => {
            if (!leaseActiveProperty) return;
            const formData = new FormData(leaseForm);
            const applicantName = (formData.get('applicantName') || '').toString().trim();
            const applicantEmail = (formData.get('applicantEmail') || '').toString().trim();
            const moveIn = (formData.get('applicationMoveIn') || '').toString();
            const leaseTerm = (formData.get('leaseTerm') || '').toString();

            const storedAccount = loadAccount();
            const baseAccount = storedAccount && storedAccount.email === applicantEmail ? storedAccount : {
                name: applicantName || 'Codex Resident',
                email: applicantEmail,
                properties: []
            };

            baseAccount.name = applicantName || baseAccount.name;
            baseAccount.email = applicantEmail || baseAccount.email;
            baseAccount.properties = baseAccount.properties || [];

            const propertyRecord = {
                id: leaseActiveProperty.id,
                name: leaseActiveProperty.name,
                location: leaseActiveProperty.location,
                price: leaseActiveProperty.price,
                moveIn,
                leaseTerm,
                image: leaseActiveProperty.image
            };

            const existingIndex = baseAccount.properties.findIndex(item => item.id === propertyRecord.id);
            if (existingIndex >= 0) {
                baseAccount.properties[existingIndex] = propertyRecord;
            } else {
                baseAccount.properties.push(propertyRecord);
            }

            saveAccount(baseAccount);
            syncResidentPortal();

            leaseForm.classList.add('is-hidden');
            leaseForm.setAttribute('hidden', '');
            if (leaseConfirmation) {
                leaseConfirmation.hidden = false;
                leaseConfirmation.removeAttribute('hidden');
            }
            if (leaseConfirmationSummary) {
                leaseConfirmationSummary.innerHTML = buildConfirmationSummary(formData);
            }
            if (leaseConfirmationTitle) {
                leaseConfirmationTitle.textContent = `Welcome to ${leaseActiveProperty.name}`;
            }
            if (leaseConfirmationCopy) {
                leaseConfirmationCopy.textContent = 'Your application is complete. Our concierge team will reach out to finalize next steps within one business day.';
            }
        };

        openLeaseApplication = (propertyId) => {
            const property = leasingResidences.find(item => item.id === propertyId) || null;
            if (!property) return;
            leaseActiveProperty = property;
            resetLeaseForm();

            if (leaseModalEyebrow) {
                leaseModalEyebrow.textContent = `${property.signatureLabel} • ${property.status}`;
            }
            if (leaseModalTitle) {
                leaseModalTitle.textContent = property.name;
            }
            if (leaseModalSubtitle) {
                const depositText = formatCurrency(property.deposit);
                leaseModalSubtitle.textContent = `Secure this residence today with a refundable mock deposit of ${depositText}.`;
            }
            if (leasePropertySummary) {
                const features = property.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('');
                leasePropertySummary.innerHTML = `
                    <div class="lease-property__media" style="background-image: url('${property.image}')" role="img" aria-label="${property.name}"></div>
                    <div class="lease-property__content">
                        <span class="lease-property__badge">${property.signatureLabel}</span>
                        <h4>${property.name}</h4>
                        <p class="lease-property__meta">${property.location} • ${property.bedrooms} • ${property.size} sq ft</p>
                        <p class="lease-property__price">${formatCurrency(property.price)}/mo</p>
                        <p class="lease-property__deposit">Refundable mock deposit: ${formatCurrency(property.deposit)}</p>
                        <ul class="lease-property__list">${features}</ul>
                    </div>
                `;
            }

            leaseModal.setAttribute('aria-hidden', 'false');
            leaseModal.classList.add('open');
            document.body.classList.add('modal-open');

            const firstField = leaseSteps[0]?.querySelector('input, select, textarea');
            if (firstField && typeof firstField.focus === 'function') {
                setTimeout(() => firstField.focus(), 120);
            }
        };

        leaseNextButton && leaseNextButton.addEventListener('click', () => {
            if (!validateLeaseStep(leaseCurrentStep)) return;
            leaseCurrentStep = Math.min(leaseCurrentStep + 1, leaseSteps.length - 1);
            setLeaseStepVisibility();
        });

        leasePrevButton && leasePrevButton.addEventListener('click', () => {
            leaseCurrentStep = Math.max(leaseCurrentStep - 1, 0);
            setLeaseStepVisibility();
        });

        leaseForm.addEventListener('submit', event => {
            event.preventDefault();
            if (!validateLeaseStep(leaseCurrentStep)) return;
            completeLeaseApplication();
        });

        leaseModalClose && leaseModalClose.addEventListener('click', closeLeaseModal);
        leaseCloseButton && leaseCloseButton.addEventListener('click', closeLeaseModal);

        leaseModal.addEventListener('click', event => {
            if (event.target === leaseModal) {
                closeLeaseModal();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && leaseModal.classList.contains('open')) {
                closeLeaseModal();
            }
        });
    }

    const loadAccount = () => {
        try {
            const stored = localStorage.getItem('codexResidentAccount');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.warn('Unable to parse account data', error);
            return null;
        }
    };

    const saveAccount = (account) => {
        try {
            localStorage.setItem('codexResidentAccount', JSON.stringify(account));
        } catch (error) {
            console.warn('Unable to persist account data', error);
        }
    };

    const renderAccountProperties = (properties = []) => {
        if (!accountProperties) return;
        if (!properties.length) {
            accountProperties.innerHTML = '<p class="portal-empty">No residences have been added yet. Start an application to reserve your home.</p>';
            return;
        }

        accountProperties.innerHTML = properties.map(property => `
            <div class="portal-residence">
                <div class="portal-residence__media" style="background-image: url('${property.image || ''}')" role="img" aria-label="${property.name}"></div>
                <div class="portal-residence__body">
                    <h4>${property.name}</h4>
                    <p class="portal-residence__location">${property.location || 'Codex Residences'}</p>
                    <ul class="portal-residence__meta">
                        <li>${property.leaseTerm || '12 Month Lease'}</li>
                        <li>${property.moveIn ? formatFullDate(property.moveIn) : 'Move-in pending'}</li>
                        <li>${property.price ? formatCurrency(property.price) + '/mo' : ''}</li>
                    </ul>
                </div>
            </div>
        `).join('');
    };

    const syncResidentPortal = () => {
        const account = loadAccount();
        if (!accountStatus || !accountDetails || !accountName || !accountEmail) {
            return;
        }

        if (!account) {
            accountStatus.textContent = 'Create an account after your mock payment to unlock the resident experience.';
            accountDetails.hidden = true;
            accountDetails.setAttribute('hidden', '');
            accountName.textContent = '—';
            accountEmail.textContent = '—';
            if (accountReset) {
                accountReset.hidden = true;
                accountReset.setAttribute('hidden', '');
                accountReset.setAttribute('aria-hidden', 'true');
            }
            renderAccountProperties([]);
            return;
        }

        const firstName = account.name ? account.name.split(' ')[0] : 'Resident';
        accountStatus.textContent = `Welcome back, ${firstName}! Your Codex account is active.`;
        accountDetails.hidden = false;
        accountDetails.removeAttribute('hidden');
        accountName.textContent = account.name || 'Codex Resident';
        accountEmail.textContent = account.email || '';
        if (accountReset) {
            accountReset.hidden = false;
            accountReset.removeAttribute('hidden');
            accountReset.setAttribute('aria-hidden', 'false');
        }
        renderAccountProperties(account.properties || []);
    };

    accountReset && accountReset.addEventListener('click', () => {
        localStorage.removeItem('codexResidentAccount');
        syncResidentPortal();
    });

    syncResidentPortal();

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

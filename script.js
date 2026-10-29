/**
 * THE MANCH NIET - Theatrical Portal JavaScript
 * ==========================================================================
 * Features:
 * - Mobile Navigation & Overlay Controller
 * - Stage Hero Slider with Touch & Auto-Rotation
 * - Live Performance Metrics Counter Animation (500+, 50+, 15+)
 * - Gallery & Video Filter System
 * - Script & Monologue Archive Filter & In-Browser Reader
 * - Production Cast & Crew Modal (Featuring SANGARCHNA)
 * - Audition Registration Modal & Form Handling with Toast Feedback
 * - Keyboard Navigation & Accessibility Support
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroSlider();
    initStickyHeader();
    initScrollToTop();
    initSmoothScroll();
    initCounterAnimation();
    initGalleryFilter();
    initScriptFilter();
    initFadeAnimations();
    initAuditionButtons();
    updateCopyrightYear();
});

/* --------------------------------------------------------------------------
   Mobile Menu Controller
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;

    // Create or locate overlay
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        body.appendChild(overlay);
    }

    if (mobileToggle && mainNav) {
        const toggleMenu = () => {
            const isActive = mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active', isActive);
            overlay.classList.toggle('active', isActive);
            body.style.overflow = isActive ? 'hidden' : '';
        };

        const closeMenu = () => {
            mainNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        };

        mobileToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close when clicking nav links
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // Mobile dropdown toggles
        const dropdowns = mainNav.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggleLink = dropdown.querySelector('.nav-link');
            if (toggleLink) {
                toggleLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
    }
}

/* --------------------------------------------------------------------------
   Hero Background Slider with Auto-Rotation & Touch Swipe
   -------------------------------------------------------------------------- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    if (!slides.length || !dotsContainer) return;

    let currentSlide = 0;
    let autoSlideTimer = null;

    // Generate indicator dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot${idx === 0 ? ' active' : ''}`;
        dot.setAttribute('data-slide-index', idx);
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Slide ${idx + 1}`);
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    const goToSlide = (index) => {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    };

    const next = () => goToSlide(currentSlide + 1);
    const prev = () => goToSlide(currentSlide - 1);

    const startAutoPlay = () => {
        stopAutoPlay();
        autoSlideTimer = setInterval(next, 5500);
    };

    const stopAutoPlay = () => {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            next();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prev();
            startAutoPlay();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            const targetIdx = parseInt(dot.getAttribute('data-slide-index'), 10);
            goToSlide(targetIdx);
            startAutoPlay();
        });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) next();
                else prev();
            }
            startAutoPlay();
        }, { passive: true });

        // Pause on mouse hover
        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
}

/* --------------------------------------------------------------------------
   Sticky Navigation Header with Frosted Glass Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   Scroll to Top Floating Button
   -------------------------------------------------------------------------- */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   Smooth Anchor Scrolling with Fixed Header Offset
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const navAnchors = document.querySelectorAll('a[href^="#"]');

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.startsWith('#')) {
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    if (this.classList.contains('nav-link')) {
                        this.classList.add('active');
                    }
                }
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Counter Animation for Stats (500+, 50+, 15+)
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 2000;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeOutProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = Math.floor(easeOutProgress * target);

            counter.textContent = currentVal;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   Gallery Filter Controller
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.events-filter .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const matches = (filter === 'all' || category === filter);

                if (matches) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 40);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   Script & Monologue Archive Filter Controller
   -------------------------------------------------------------------------- */
function initScriptFilter() {
    const scriptBtns = document.querySelectorAll('.scripts-filter .script-filter-btn');
    const scriptCards = document.querySelectorAll('.scripts-grid .script-card');

    if (!scriptBtns.length || !scriptCards.length) return;

    scriptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            scriptBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-script-filter');

            scriptCards.forEach(card => {
                const cat = card.getAttribute('data-script-cat');
                const matches = (filter === 'all' || cat === filter);

                if (matches) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 40);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   Audition Buttons Initialization
   -------------------------------------------------------------------------- */
function initAuditionButtons() {
    const navBtn = document.getElementById('navAuditionBtn');
    const heroBtn = document.getElementById('heroAuditionBtn');

    if (navBtn) {
        navBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuditionModal();
        });
    }

    if (heroBtn) {
        heroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuditionModal();
        });
    }
}

/* --------------------------------------------------------------------------
   Modal Window Controllers (Production, Audition, Script Reader, Video)
   -------------------------------------------------------------------------- */

// Production Data Store
const productionsData = {
    sangarchna: {
        title: 'SANGARCHNA: Nazar Nahi, Nazariya Badlo',
        subtitle: 'Featured Spotlight Production • Written by Roshani Srivastava & Samisti Mishra • Directed by Mohammad Aaftab',
        banner: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
        synopsis: 'A gripping social introspection dissecting patriarchal prejudices, generational expectations, and the silent pressures that warp human empathy. Premiered at SANGAM, "SANGARCHNA" challenges the audience not to fix their sight, but to transform their perspective ("Nazar Nahi, Nazariya Badlo"). Through heightened physical theatre, poetic dialogues, and dynamic choral blocks, the play has garnered widespread acclaim across collegiate circuits.',
        cast: [
            { name: 'Roshani Srivastava', role: 'Lead Character / Narrator' },
            { name: 'Samisti Mishra', role: 'Conscience / Core Ensemble' },
            { name: 'Aryan Verma', role: 'The Father / Tradition' },
            { name: 'Priya Sharma', role: 'Daughter / Rebel Voice' },
            { name: 'Devansh Saxena', role: 'Society Chorus Lead' },
            { name: 'Nikhil Kashyap', role: 'Street Interlocutor' }
        ],
        crew: [
            { name: 'Mohammad Aaftab', role: 'Director & Stage Blocking' },
            { name: 'Roshani Srivastava & Samisti Mishra', role: 'Original Playwrights' },
            { name: 'Kartik Mathur', role: 'Lighting Designer & Spot Operator' },
            { name: 'Ananya Rawat', role: 'Wardrobe & Character Makeup' },
            { name: 'Rishi Kapoor', role: 'Stage Manager & Prop Master' }
        ]
    },
    nukkad: {
        title: 'Nukkad Natak Awareness Drives',
        subtitle: 'High-Energy Social Activism Street Theatre • Performed Across NCR',
        banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
        synopsis: 'Our street play wing operates on the frontlines of community engagement. Using live acoustic dholak rhythms, synchronized rhythmic stepping, and thunderous choral chants, the ensemble tackles mental health stigma, voting integrity, substance abuse, and digital literacy in public squares and campus amphitheaters.',
        cast: [
            { name: 'Manch Street Ensemble', role: '22 Choral Performers' },
            { name: 'Harshit Tyagi', role: 'Dholak & Acoustic Lead' },
            { name: 'Kavya Singhania', role: 'Slogan & Voice Lead' }
        ],
        crew: [
            { name: 'Student Street Council', role: 'Creative Direction' },
            { name: 'Outdoor Logistics Team', role: 'Crowd & Circle Formation' }
        ]
    },
    monologue: {
        title: 'Monologue & Slam Poetry Nights',
        subtitle: 'Solo Performance Artistry • One Spotlight, One Unbroken Voice',
        banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
        synopsis: 'An intimate, stripped-down showcase designed to test individual stage command. Performers hold the entire auditorium captive with only voice modulation, facial nuance, and emotional memory, presenting original Hindi poetry, Urdu Nazms, and classic dramatic soliloquies.',
        cast: [
            { name: '18 Soloists', role: 'Writers & Actors' },
            { name: 'Rhea Sen', role: 'Opening Slam Poet' },
            { name: 'Vikram Joshi', role: 'Dramatic Soliloquist' }
        ],
        crew: [
            { name: 'Literary Wing Leads', role: 'Curation & Text Editing' },
            { name: 'Acoustics Lead', role: 'Condenser Mic & Reverb Tuning' }
        ]
    },
    mainstage: {
        title: 'The Annual Mainstage Showcase',
        subtitle: 'Flagship Multi-Act Theatrical Drama at Dr. APJ Abdul Kalam Auditorium',
        banner: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80',
        synopsis: 'The Manch\'s grand annual theatrical extravaganza featuring full proscenium staging, intricate multi-level set pieces, automated lighting transitions, and an original musical score performed before an audience of over 800 students and dignitaries.',
        cast: [
            { name: 'Ensemble Company', role: '18 Principal Actors' },
            { name: 'Supporting Guild', role: '12 Ensemble Members' }
        ],
        crew: [
            { name: 'Executive Council', role: 'Producer & Director' },
            { name: 'Technical Crew', role: '14 Stagehands & Sound Engineers' }
        ]
    },
    awaaz: {
        title: 'Awaaz: Inter-College Drama Fest',
        subtitle: 'The Premier NCR Collegiate Theatrical Battleground',
        banner: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
        synopsis: 'Awaaz brings together the sharpest collegiate theatre societies from Delhi University, IIT Delhi, Jamia, and premier private universities for high-stakes stage and street competitions judged by prominent NSD alumni and theatre veterans.',
        cast: [
            { name: 'Over 25 Colleges', role: 'Competing Delegations' },
            { name: 'The Manch NIET', role: 'Host Society & Showcase Act' }
        ],
        crew: [
            { name: 'Awaaz Organizing Committee', role: 'Event Execution' },
            { name: 'Jury Panel', role: 'Eminent NSD Alumni' }
        ]
    }
};

function openProductionModal(playKey) {
    const data = productionsData[playKey] || productionsData.sangarchna;
    const modal = document.getElementById('productionModal');
    if (!modal) return;

    document.getElementById('prodModalTitle').textContent = data.title;
    document.getElementById('prodModalSubtitle').textContent = data.subtitle;
    document.getElementById('prodModalBanner').src = data.banner;
    document.getElementById('prodModalSynopsis').textContent = data.synopsis;

    // Populate cast
    const castContainer = document.getElementById('prodModalCast');
    castContainer.innerHTML = '';
    data.cast.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span>${item.role}</span>`;
        castContainer.appendChild(li);
    });

    // Populate crew
    const crewContainer = document.getElementById('prodModalCrew');
    crewContainer.innerHTML = '';
    data.crew.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span>${item.role}</span>`;
        crewContainer.appendChild(li);
    });

    openModal('productionModal');
}

function openAuditionModal() {
    openModal('auditionModal');
}

function handleAuditionSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitAuditionBtn');
    const feedback = document.getElementById('auditionFeedback');
    const name = document.getElementById('auditionName').value.trim();

    if (!name) return;

    // Show simulated loading
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Registration...';
    }

    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Registration Successful!';
        }

        if (feedback) {
            feedback.className = 'form-feedback success';
            feedback.innerHTML = `<strong>Congratulations ${name}!</strong> Your audition slot has been reserved. Check your email & WhatsApp for audition room details in Mini Audi 2.`;
        }

        showToast(`Audition Registered for ${name}! Welcome to The Manch.`);

        setTimeout(() => {
            closeModal('auditionModal');
            document.getElementById('auditionForm').reset();
            if (feedback) feedback.className = 'form-feedback';
            if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Audition Registration';
        }, 2200);
    }, 1200);
}

// Script Viewer Controller
let currentScriptToDownload = { filename: 'script.txt', content: '' };

function readScript(title, category, content) {
    document.getElementById('scriptModalTitle').textContent = title;
    document.getElementById('scriptModalCategory').textContent = category;
    document.getElementById('scriptModalText').textContent = content;

    currentScriptToDownload = {
        filename: title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.txt',
        content: `THE MANCH NIET - SCRIPT ARCHIVE\n=========================================\nTITLE: ${title}\nCATEGORY: ${category}\n=========================================\n\n${content}\n\n---\nCopyright The Manch NIET. For educational & performance practice.`
    };

    const downloadBtn = document.getElementById('scriptDownloadModalBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            downloadFile(currentScriptToDownload.filename, currentScriptToDownload.content);
        };
    }

    openModal('scriptModal');
}

function downloadScript(filename) {
    const dummyContent = `THE MANCH NIET - PRACTICE SCRIPT (${filename})\n=========================================\nSpeak • Lead • Inspire\nFrom Stage Fear to Stage Star.\n\nPractice vocal modulation, articulation, and stage movement.\nFor official club scripts, join The Manch rehearsal sessions!`;
    downloadFile(filename, dummyContent);
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded: ${filename}`);
}

// Video Reel Preview Modal
function openVideoModal(title, desc) {
    const modalTitle = document.getElementById('videoModalTitle');
    const modalDesc = document.getElementById('videoModalDesc');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    openModal('videoModal');
}

// Generic Modal Helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

/* --------------------------------------------------------------------------
   Toast Notification Helper
   -------------------------------------------------------------------------- */
let toastTimeout = null;

function showToast(message) {
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* --------------------------------------------------------------------------
   Scroll Fade-in Animation Observer
   -------------------------------------------------------------------------- */
function initFadeAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.pillar-card, .benefit-item, .production-card, .gallery-item, .script-card, .team-card, .cta-card'
    );

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 3) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elementsToAnimate.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Dynamic Year in Footer
   -------------------------------------------------------------------------- */
function updateCopyrightYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

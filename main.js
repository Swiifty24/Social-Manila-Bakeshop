/* ============================
   The Social Manila — Main JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', function () {

    // ============================
    // HERO CAROUSEL
    // ============================
    const carousel = document.getElementById('hero-carousel');
    const slides = carousel ? carousel.querySelectorAll('.hero-slide') : [];
    const dotsContainer = document.getElementById('hero-dots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
        slides.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    if (slides.length > 1) {
        startAutoplay();

        // Dot clicks
        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                stopAutoplay();
                goToSlide(parseInt(this.dataset.slide));
                startAutoplay();
            });
        });

        // Pause on hover
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }
    }


    // ============================
    // STICKY HEADER
    // ============================
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;
        if (header) {
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScroll = currentScroll;
    });


    // ============================
    // MOBILE MENU
    // ============================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ============================
    // SCROLL ANIMATIONS
    // ============================
    const animatedElements = document.querySelectorAll('.fade-in, .stagger-children');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything
        animatedElements.forEach(el => el.classList.add('visible'));
    }


    // ============================
    // SMOOTH SCROLL FOR ANCHORS
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});

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

    // ============================
    // CART & MODAL SYSTEM
    // ============================
    let cart = JSON.parse(localStorage.getItem('socialManilaCart')) || [];

    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCloseBtn = document.getElementById('cart-close');
    const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
    const cartBody = document.getElementById('cart-body');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountDisplays = document.querySelectorAll('.cart-count');

    const modalContainer = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('product-modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalAddBtn = document.getElementById('modal-add-btn');

    let currentProduct = null;

    // Helper to format price
    const formatPrice = (price) => `₱${price.toFixed(2)}`;
    // Helper to parse price string to number ("From ₱120.00" -> 120)
    const parsePrice = (priceStr) => {
        const match = priceStr.match(/[\d,.]+/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    };

    function saveCart() {
        localStorage.setItem('socialManilaCart', JSON.stringify(cart));
        updateCartUI();
    }

    function toggleCart() {
        if (cartDrawer && cartOverlay) {
            const isActive = cartDrawer.classList.contains('active');
            cartDrawer.classList.toggle('active', !isActive);
            cartOverlay.classList.toggle('active', !isActive);
            if (!isActive) updateCartUI();
        }
    }

    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }

    function showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;

        container.appendChild(toast);

        // Trigger reflow to play transition
        void toast.offsetWidth;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 400); // Wait for transition
        }, 3000); // 3 seconds visible
    }

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1, note: '' });
        }
        saveCart();
        showToast(`Added ${product.name} to your cart.`);
    }

    function updateCartUI() {
        if (!cartBody) return;

        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="cart-empty-msg">Your cart is currently empty.</p>';
        } else {
            cartBody.innerHTML = '<div class="cart-items-container"></div>';
            const container = cartBody.querySelector('.cart-items-container');

            cart.forEach((item, index) => {
                totalItems += item.qty;
                totalPrice += item.price * item.qty;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';

                const hasNote = item.note && item.note.trim() !== '';

                itemDiv.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn minus" data-id="${item.id}">-</button>
                                <span class="qty-display">${item.qty}</span>
                                <button class="qty-btn plus" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                        <button class="customize-toggle" data-id="${item.id}">${hasNote ? '- Hide Customization' : '+ Add Customization'}</button>
                        <div class="cart-customization-container ${hasNote ? 'active' : ''}" id="customization-container-${item.id}">
                            <textarea class="cart-customization" data-id="${item.id}" placeholder="Add customization notes (e.g. no nuts, extra sweet...)" rows="2">${item.note}</textarea>
                        </div>
                    </div>
                `;
                container.appendChild(itemDiv);
            });

            // Attach listeners to injected elements
            container.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (e.target.classList.contains('plus')) item.qty += 1;
                    if (e.target.classList.contains('minus')) {
                        item.qty -= 1;
                        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
                    }
                    saveCart();
                });
            });

            container.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    cart = cart.filter(i => i.id !== e.target.dataset.id);
                    saveCart();
                });
            });

            container.querySelectorAll('.customize-toggle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const cContainer = document.getElementById('customization-container-' + id);
                    if (cContainer) {
                        const isActive = cContainer.classList.contains('active');
                        cContainer.classList.toggle('active');
                        e.target.textContent = isActive ? '+ Add Customization' : '- Hide Customization';
                    }
                });
            });

            container.querySelectorAll('.cart-customization').forEach(textarea => {
                textarea.addEventListener('change', (e) => {
                    const item = cart.find(i => i.id === e.target.dataset.id);
                    if (item) item.note = e.target.value;
                    localStorage.setItem('socialManilaCart', JSON.stringify(cart)); // save without re-render
                });
            });
        }

        if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(totalPrice);
        cartCountDisplays.forEach(display => display.textContent = totalItems);

        // Attach checkout handler if totalItems > 0
        document.querySelectorAll('.checkout-btn').forEach(btn => {
            btn.onclick = () => {
                if (cart.length > 0) {
                    window.location.href = 'bakehouse-checkout.html';
                } else {
                    showToast('Your cart is empty!');
                }
            };
        });
    }

    // Modal UI logic
    function openModal(product) {
        if (!modalContainer) return;
        currentProduct = product;
        if (modalImg) modalImg.src = product.img;
        if (modalTitle) modalTitle.textContent = product.name;
        modalContainer.classList.add('active');
    }

    function closeModal() {
        if (modalContainer) modalContainer.classList.remove('active');
    }

    // Attach base event listeners
    if (cartToggleBtns) {
        cartToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleCart();
            });
        });
    }
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });
    }

    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            closeModal();
            if (currentProduct) addToCart(currentProduct);
        });
    }

    // Product Click Interception
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore click if they click the details/ingredients accordion
            if (e.target.closest('.gallery-ingredients')) return;

            const isQuickAdd = e.target.classList.contains('quick-add') || e.target.closest('.quick-add');

            // Extract info
            const nameEl = card.querySelector('.product-card-name');
            const priceEl = card.querySelector('.product-card-price');
            let imgEl = card.querySelector('.product-img-primary') || card.querySelector('img');

            if (!nameEl || !priceEl || !imgEl) return;

            // Prevent default navigation
            e.preventDefault();

            const product = {
                id: nameEl.textContent.trim().toLowerCase().replace(/\s+/g, '-'),
                name: nameEl.textContent.trim(),
                price: parsePrice(priceEl.textContent),
                img: imgEl.src
            };

            const isMenuPage = window.location.pathname.includes('bakehouse-menu.html') || window.location.pathname.includes('bakehouse-studio.html');

            // Direct cart addition or open modal depending on page context
            // "In main page if click image, choose add to cart or view menu"
            if (isMenuPage || isQuickAdd) {
                addToCart(product);
            } else {
                openModal(product);
            }
        });
    });

    // Init UI from local storage
    updateCartUI();

});

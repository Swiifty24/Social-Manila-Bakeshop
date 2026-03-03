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
    // PRODUCT DATA & DYNAMIC LOADING
    // ============================
    const productData = {
        'signature-butter-croissant': {
            id: 'signature-butter-croissant',
            name: 'Signature Butter Croissant',
            price: 180.00,
            category: 'Viennoiserie',
            img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
            desc: 'Our iconic croissant, beloved for its hundreds of delicate, shatteringly crisp layers and deeply rich, buttery interior. Hand-laminated over 72 hours using imported premium butter to ensure absolute perfection in every bite.',
            ingredients: 'Premium French Butter, Artisan Flour, Local Free-range Eggs, Milk, Sugar, Salt, Yeast.',
            allergens: 'Contains dairy, gluten, and eggs. May contain traces of nuts.'
        },
        'pain-au-chocolat': {
            id: 'pain-au-chocolat',
            name: 'Pain au Chocolat',
            price: 220.00,
            category: 'Viennoiserie',
            img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=600&auto=format&fit=crop',
            desc: 'A masterpiece of French baking. Two batons of rich, 70% dark Valrhona chocolate wrapped elegantly in our signature laminated pastry dough. Baked until brilliantly golden and flaky.',
            ingredients: '70% Dark Valrhona Chocolate, Premium French Butter, Artisan Flour, Free-range Eggs, Milk, Sugar, Salt, Yeast.',
            allergens: 'Contains dairy, gluten, soy (in chocolate), and eggs.'
        },
        'almond-and-pear-tart': {
            id: 'almond-and-pear-tart',
            name: 'Almond & Pear Tart',
            price: 280.00,
            category: 'Tarts & Cakes',
            img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=600&auto=format&fit=crop',
            desc: 'A classic French tart featuring a buttery pâté sucrée shell, silky almond frangipane, and perfectly poached seasonal pears. A harmonious balance of textures and refined sweetness.',
            ingredients: 'Almond Flour, Pears, Premium French Butter, Artisan Flour, Eggs, Milk, Sugar, Vanilla.',
            allergens: 'Contains tree nuts (almonds), dairy, gluten, and eggs.'
        },
        'gateau-au-chocolat': {
            id: 'gateau-au-chocolat',
            name: 'Gâteau au Chocolat',
            price: 350.00,
            category: 'Tarts & Cakes',
            img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
            desc: 'A luxuriously dense and fudgy flourless chocolate cake. Made with ethically sourced single-origin cocoa, offering a deep, intense chocolate flavor profile with a crackly, delicate crust.',
            ingredients: 'Single-origin Dark Chocolate, Cocoa Powder, Premium Butter, Free-range Eggs, Fine Sugar.',
            allergens: 'Contains dairy and eggs. Naturally gluten-free but prepared in a kitchen that handles wheat.'
        },
        'seasonal-fruit-tartlette': {
            id: 'seasonal-fruit-tartlette',
            name: 'Seasonal Fruit Tartlette',
            price: 320.00,
            category: 'Tarts & Cakes',
            img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop',
            desc: 'A crisp, buttery pâte sucrée shell hugging a bed of silky vanilla bean pastry cream. Hand-arranged with the morning\'s freshest selection of vibrant, glazed berries and seasonal orchard fruits.',
            ingredients: 'Seasonal Berries/Fruits, Madagascar Vanilla Bean, Artisan Flour, Premium Butter, Eggs, Milk, Sugar, Apricot Glaze.',
            allergens: 'Contains dairy, gluten, and eggs.'
        },
        'assorted-macarons-(box-of-6)': {
            id: 'assorted-macarons-(box-of-6)',
            name: 'Assorted Macarons (Box of 6)',
            price: 650.00,
            category: 'Macarons',
            img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=600&auto=format&fit=crop',
            desc: 'A beautiful tasting box of our signature Parisian macarons. Six delicate, crisp almond meringue shells sandwiching exquisite ganaches, curds, and buttercreams in our most popular flavors.',
            ingredients: 'Almond Flour, Egg Whites, Sugar, Premium Butter, Heavy Cream, various flavorings (Vanilla, Chocolate, Pistachio, Raspberry, Lemon, Coffee).',
            allergens: 'Contains tree nuts (almonds, pistachios), dairy, and eggs. Naturally gluten-free.'
        },
        'rose-and-raspberry-macarons': {
            id: 'rose-and-raspberry-macarons',
            name: 'Rose & Raspberry Macarons',
            price: 700.00,
            category: 'Macarons',
            img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=600&auto=format&fit=crop',
            desc: 'Our signature floral dessert. Hand-piped almond meringue shells lightly infused with Bulgarian rose water, filled with a bright, tart house-made raspberry confit and white chocolate ganache.',
            ingredients: 'Almond Flour, Egg Whites, Sugar, White Chocolate, Raspberry Puree, Rose Water, Heavy Cream.',
            allergens: 'Contains tree nuts (almonds), dairy, and eggs.'
        }
    };

    function initProductPage() {
        if (!window.location.pathname.includes('bakehouse-product.html')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId || !productData[productId]) {
            showToast('Product not found.');
            setTimeout(() => window.location.href = 'bakehouse-menu.html', 2000);
            return;
        }

        const product = productData[productId];

        // Populate elements
        const titleEl = document.getElementById('p-title');
        const priceEl = document.getElementById('p-price');
        const catEl = document.getElementById('p-category');
        const descEl = document.getElementById('p-desc');
        const ingEl = document.getElementById('p-ingredients');
        const algEl = document.getElementById('p-allergens');
        const imgEl = document.getElementById('p-main-img');

        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) priceEl.textContent = `₱${product.price.toFixed(2)}`;
        if (catEl) catEl.textContent = product.category;
        if (descEl) descEl.textContent = product.desc;
        if (ingEl) ingEl.textContent = product.ingredients;
        if (algEl) algEl.textContent = product.allergens;
        if (imgEl) {
            imgEl.src = product.img;
            imgEl.alt = product.name;
        }

        // Controls
        const qtyInput = document.getElementById('qty-input');
        const plusBtn = document.getElementById('qty-plus');
        const minusBtn = document.getElementById('qty-minus');
        const addBtn = document.getElementById('add-to-cart-btn');

        if (plusBtn) plusBtn.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        if (minusBtn) minusBtn.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
        });

        if (addBtn) addBtn.addEventListener('click', () => {
            const qtyValue = parseInt(qtyInput.value);
            const noteValue = document.getElementById('custom-notes').value.trim();
            const fullItem = { ...product, qty: qtyValue, note: noteValue };
            addToCartWithDetails(fullItem);
        });

        // Hide loading, show content
        const loader = document.getElementById('loading');
        const content = document.getElementById('product-content');
        if (loader) loader.style.display = 'none';
        if (content) content.classList.add('loaded');
    }

    function addToCartWithDetails(fullItem) {
        // Check if item with SAME ID and SAME NOTE exists
        const existing = cart.find(i => i.id === fullItem.id && i.note === fullItem.note);
        if (existing) {
            existing.qty += fullItem.qty;
        } else {
            cart.push(fullItem);
        }
        saveCart();
    }

    initProductPage();

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
        const item = { ...product, qty: 1, note: '' };
        addToCartWithDetails(item);
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
                        ${hasNote ? `<div class="cart-item-note">Note: ${item.note}</div>` : ''}
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn minus" data-id="${item.id}" data-note="${item.note}">-</button>
                                <span class="qty-display">${item.qty}</span>
                                <button class="qty-btn plus" data-id="${item.id}" data-note="${item.note}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}" data-note="${item.note}">Remove</button>
                        </div>
                    </div>
                `;
                container.appendChild(itemDiv);
            });

            // Attach listeners to injected elements
            container.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const note = e.target.dataset.note;
                    const item = cart.find(i => i.id === id && i.note === note);
                    if (e.target.classList.contains('plus')) item.qty += 1;
                    if (e.target.classList.contains('minus')) {
                        item.qty -= 1;
                        if (item.qty <= 0) cart = cart.filter(i => !(i.id === id && i.note === note));
                    }
                    saveCart();
                });
            });

            container.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const note = e.target.dataset.note;
                    cart = cart.filter(i => !(i.id === id && i.note === note));
                    saveCart();
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

            const productIdentifier = nameEl.textContent.trim().toLowerCase()
                .replace(/&/g, 'and')
                .replace(/\s+/g, '-');
            const product = {
                id: productIdentifier,
                name: nameEl.textContent.trim(),
                price: parsePrice(priceEl.textContent),
                img: imgEl.src
            };

            const isMenuPage = window.location.pathname.includes('bakehouse-menu.html') || window.location.pathname.includes('bakehouse-studio.html');

            if (isQuickAdd) {
                e.preventDefault();
                addToCart(product);
            } else if (isMenuPage) {
                // Let the anchor href handle regular navigation to bakehouse-product.html?id=...
            } else {
                e.preventDefault();
                openModal(product);
            }
        });
    });

    // Init UI from local storage
    updateCartUI();

});

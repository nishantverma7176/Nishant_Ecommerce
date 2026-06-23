'use strict';

// ============================================
// 1. MODAL FUNCTIONALITY
// ============================================
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

const modalCloseFunc = function () { 
    modal.classList.add('closed') 
}

modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);

// ============================================
// 2. MOBILE MENU
// ============================================
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

    const mobileMenuCloseFunc = function () {
        mobileMenu[i].classList.remove('active');
        overlay.classList.remove('active');
    }

    mobileMenuOpenBtn[i].addEventListener('click', function () {
        mobileMenu[i].classList.add('active');
        overlay.classList.add('active');
    });

    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    overlay.addEventListener('click', mobileMenuCloseFunc);
}

// ============================================
// 3. ACCORDION MENU
// ============================================
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

    accordionBtn[i].addEventListener('click', function () {

        const clickedBtn = this.nextElementSibling.classList.contains('active');

        for (let i = 0; i < accordion.length; i++) {

            if (clickedBtn) break;

            if (accordion[i].classList.contains('active')) {

                accordion[i].classList.remove('active');
                accordionBtn[i].classList.remove('active');

            }

        }

        this.nextElementSibling.classList.toggle('active');
        this.classList.toggle('active');

    });

}

// ============================================
// 4. ADD TO CART - WITH REDIRECT & TRANSITION
// ============================================
function addToCart(product, buttonElement) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    // Button transition effect
    if (buttonElement) {
        buttonElement.style.transition = 'all 0.3s ease';
        buttonElement.style.transform = 'scale(0.9)';
        buttonElement.style.background = '#45a049';
        
        setTimeout(() => {
            buttonElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: product.category || 'Uncategorized',
            image: product.image || './assets/images/products/default.jpg',
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to cart page after short delay
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 400);
}

// ============================================
// 5. ADD TO WISHLIST - WITH TRANSITION
// ============================================
function addToWishlist(product, buttonElement) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = wishlist.find(item => item.id === product.id);
    
    if (buttonElement) {
        buttonElement.style.transition = 'all 0.3s ease';
    }
    
    if (!exists) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: product.category || 'Uncategorized',
            image: product.image || './assets/images/products/default.jpg'
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        
        // Success animation
        if (buttonElement) {
            buttonElement.style.transform = 'scale(1.3)';
            buttonElement.style.background = '#FF6B6B';
            buttonElement.style.color = 'white';
            
            setTimeout(() => {
                buttonElement.style.transform = 'scale(1)';
            }, 300);
        }
    } else {
        // Already exists animation
        if (buttonElement) {
            buttonElement.style.transform = 'scale(0.8)';
            buttonElement.style.background = '#FF9800';
            buttonElement.style.color = 'white';
            
            setTimeout(() => {
                buttonElement.style.transform = 'scale(1)';
                buttonElement.style.background = '';
                buttonElement.style.color = '';
            }, 300);
        }
    }
}

// ============================================
// 6. UPDATE CART COUNT
// ============================================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    document.querySelectorAll('.header-user-actions .count, .mobile-bottom-navigation .count')
        .forEach(badge => {
            const parent = badge.closest('.action-btn');
            if (parent && parent.querySelector('ion-icon[name="bag-handle-outline"]')) {
                badge.textContent = totalItems;
            }
        });
}

// ============================================
// 7. UPDATE WISHLIST COUNT
// ============================================
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const totalItems = wishlist.length;
    
    document.querySelectorAll('.header-user-actions .count, .mobile-bottom-navigation .count')
        .forEach(badge => {
            const parent = badge.closest('.action-btn');
            if (parent && parent.querySelector('ion-icon[name="heart-outline"]')) {
                badge.textContent = totalItems;
            }
        });
}

// ============================================
// 8. RENDER CART ITEMS (for cart.html)
// ============================================
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (summary) summary.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (summary) summary.style.display = 'flex';
    
    cart.forEach((item, index) => {
        container.appendChild(createCartItemHTML(item, index));
    });
    
    updateCartTotal();
}

// ============================================
// 9. CREATE CART ITEM HTML
// ============================================
function createCartItemHTML(item, index) {
    const div = document.createElement('div');
    div.className = 'showcase';
    div.style.cssText = 'display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eef2f6; margin-bottom: 0;';
    
    const originalPrice = item.originalPrice ? 
        `<del>$${item.originalPrice.toFixed(2)}</del>` : '';
    
    div.innerHTML = `
        <div class="showcase-banner" style="flex-shrink: 0;">
            <img src="${item.image}" alt="${item.name}" width="100" height="100" style="object-fit: contain; border-radius: 12px; background: #fafafa; padding: 6px;">
        </div>
        <div class="showcase-content" style="flex: 1;">
            <a href="#" class="showcase-category">${item.category}</a>
            <h3 class="showcase-title" style="font-size: 18px; font-weight: 600; margin: 4px 0;">${item.name}</h3>
            <div class="price-box">
                <p class="price">$${item.price.toFixed(2)}</p>
                ${originalPrice}
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 40px; overflow: hidden;">
                <button class="qty-btn minus" data-index="${index}" style="background: none; border: none; padding: 6px 14px; font-size: 22px; cursor: pointer; transition: all 0.3s ease;">−</button>
                <span class="qty-value" style="min-width: 36px; text-align: center; font-weight: 500;">${item.quantity}</span>
                <button class="qty-btn plus" data-index="${index}" style="background: none; border: none; padding: 6px 14px; font-size: 22px; cursor: pointer; transition: all 0.3s ease;">+</button>
            </div>
            <button class="remove-item" data-index="${index}" style="background: none; border: none; color: #b0b0b0; font-size: 20px; cursor: pointer; transition: all 0.3s ease;">
                <ion-icon name="trash-outline"></ion-icon>
            </button>
        </div>
    `;
    
    // Add hover effects for cart buttons
    const minusBtn = div.querySelector('.minus');
    const plusBtn = div.querySelector('.plus');
    const removeBtn = div.querySelector('.remove-item');
    
    minusBtn.addEventListener('mouseenter', () => {
        minusBtn.style.background = '#f0f0f0';
        minusBtn.style.transform = 'scale(1.1)';
    });
    minusBtn.addEventListener('mouseleave', () => {
        minusBtn.style.background = 'none';
        minusBtn.style.transform = 'scale(1)';
    });
    
    plusBtn.addEventListener('mouseenter', () => {
        plusBtn.style.background = '#f0f0f0';
        plusBtn.style.transform = 'scale(1.1)';
    });
    plusBtn.addEventListener('mouseleave', () => {
        plusBtn.style.background = 'none';
        plusBtn.style.transform = 'scale(1)';
    });
    
    removeBtn.addEventListener('mouseenter', () => {
        removeBtn.style.color = '#ff4444';
        removeBtn.style.transform = 'scale(1.2)';
    });
    removeBtn.addEventListener('mouseleave', () => {
        removeBtn.style.color = '#b0b0b0';
        removeBtn.style.transform = 'scale(1)';
    });
    
    div.querySelector('.minus').addEventListener('click', () => updateQuantity(index, -1));
    div.querySelector('.plus').addEventListener('click', () => updateQuantity(index, 1));
    div.querySelector('.remove-item').addEventListener('click', () => removeItem(index));
    
    return div;
}

// ============================================
// 10. UPDATE QUANTITY
// ============================================
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

// ============================================
// 11. REMOVE ITEM FROM CART
// ============================================
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

// ============================================
// 12. UPDATE CART TOTAL
// ============================================
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// ============================================
// 13. RENDER WISHLIST ITEMS (for wishlist.html)
// ============================================
function renderWishlistItems() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.getElementById('wishlist-items-container');
    const emptyWishlist = document.getElementById('empty-wishlist');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (wishlist.length === 0) {
        if (emptyWishlist) emptyWishlist.style.display = 'block';
        return;
    }
    
    if (emptyWishlist) emptyWishlist.style.display = 'none';
    
    wishlist.forEach((item, index) => {
        container.appendChild(createWishlistItemHTML(item, index));
    });
}

// ============================================
// 14. CREATE WISHLIST ITEM HTML
// ============================================
function createWishlistItemHTML(item, index) {
    const div = document.createElement('div');
    div.className = 'showcase';
    div.style.cssText = 'display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eef2f6; margin-bottom: 0;';
    
    div.innerHTML = `
        <div class="showcase-banner" style="flex-shrink: 0;">
            <img src="${item.image}" alt="${item.name}" width="100" height="100" style="object-fit: contain; border-radius: 12px; background: #fafafa; padding: 6px;">
        </div>
        <div class="showcase-content" style="flex: 1;">
            <a href="#" class="showcase-category">${item.category}</a>
            <h3 class="showcase-title" style="font-size: 18px; font-weight: 600; margin: 4px 0;">${item.name}</h3>
            <div class="price-box">
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
            <button class="move-to-cart-btn" data-index="${index}" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                🛒 Add to Cart
            </button>
            <button class="remove-wishlist-btn" data-index="${index}" style="background: none; border: none; color: #ff4444; font-size: 24px; cursor: pointer; transition: all 0.3s ease;">
                <ion-icon name="trash-outline"></ion-icon>
            </button>
        </div>
    `;
    
    // Add hover effects for wishlist buttons
    const moveBtn = div.querySelector('.move-to-cart-btn');
    const removeBtn = div.querySelector('.remove-wishlist-btn');
    
    moveBtn.addEventListener('mouseenter', () => {
        moveBtn.style.transform = 'scale(1.05)';
        moveBtn.style.background = '#45a049';
        moveBtn.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
    });
    moveBtn.addEventListener('mouseleave', () => {
        moveBtn.style.transform = 'scale(1)';
        moveBtn.style.background = '#4CAF50';
        moveBtn.style.boxShadow = 'none';
    });
    
    removeBtn.addEventListener('mouseenter', () => {
        removeBtn.style.transform = 'scale(1.3)';
        removeBtn.style.color = '#252222ff';
    });
    removeBtn.addEventListener('mouseleave', () => {
        removeBtn.style.transform = 'scale(1)';
        removeBtn.style.color = '#221919ff';
    });
    
    div.querySelector('.move-to-cart-btn').addEventListener('click', () => moveToCart(index));
    div.querySelector('.remove-wishlist-btn').addEventListener('click', () => removeFromWishlist(index));
    
    return div;
}

// ============================================
// 15. MOVE FROM WISHLIST TO CART
// ============================================
function moveToCart(index) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (wishlist[index]) {
        const item = wishlist[index];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        
        wishlist.splice(index, 1);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        renderWishlistItems();
        updateCartCount();
        updateWishlistCount();
        
        // Redirect to cart
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 300);
    }
}

// ============================================
// 16. REMOVE FROM WISHLIST
// ============================================
function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlistItems();
    updateWishlistCount();
}

// ============================================
// 17. ADD TRANSITIONS TO ALL BUTTONS ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Update counts
    updateCartCount();
    updateWishlistCount();
    
    // Add transitions to all buttons with specific classes
    const allButtons = document.querySelectorAll(
        '.add-to-cart-btn, .add-to-wishlist-btn, .btn-action, .add-cart-btn, .banner-btn, .action-btn'
    );
    
    allButtons.forEach(btn => {
        // Add transition
        btn.style.transition = 'all 0.3s ease';
        
        // Hover effect
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.25)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Click effect
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Check if on cart page
    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
    
    // Check if on wishlist page
    if (document.getElementById('wishlist-items-container')) {
        renderWishlistItems();
    }
});

// ============================================
// 18. PROCEED TO CHECKOUT
// ============================================
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout with ' + cart.length + ' items');
    // window.location.href = 'checkout.html';
}
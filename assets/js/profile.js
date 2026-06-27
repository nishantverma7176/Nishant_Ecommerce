// ============================================
// PROFILE DROPDOWN FUNCTIONS – MYNTRA STYLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    checkLoginStatus();
    updateCartCount();
    updateWishlistCount();
});

function loginUser() {
    window.location.href = 'login.html';
}

function logoutUser(event) {
    if (event) event.preventDefault();
    // Clear user data and token
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    checkLoginStatus();
    updateCartCount();
    updateWishlistCount();
    // Show notification
    showNotification('Logged out successfully! 👋');
    // Redirect to home page
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 500);
}

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dropdownHeader = document.getElementById('dropdownHeader');
    const profileActions = document.getElementById('profileActions');

    console.log('User:', user); // Debug: Check if user exists
    console.log('Profile Actions Element:', profileActions); // Debug: Check if element exists

    if (user && user.name) {
        // Logged in state - Myntra style
        if (dropdownHeader) {
            dropdownHeader.innerHTML = `
                <h4 class="user-name">Hello ${user.name}</h4>
                <p class="user-phone">${user.phoneNumber || user.phone || user.email || 'N/A'}</p>
                <span class="promo-badge"><ion-icon name="flame-outline"></ion-icon> FLAT 300 OFF ON FIRSTF</span>
            `;
        }
        if (profileActions) {
            profileActions.style.display = 'block';
            console.log('Profile actions shown'); // Debug
        }
    } else {
        // Logged out state - Myntra style
        if (dropdownHeader) {
            dropdownHeader.innerHTML = `
                <h4 class="user-name">Welcome!</h4>
                <p class="user-phone">To access account and manage orders</p>
                <button class="login-btn" onclick="window.location.href='login.html'">
                    LOGIN / SIGNUP
                </button>
            `;
        }
        if (profileActions) {
            profileActions.style.display = 'none';
            console.log('Profile actions hidden'); // Debug
        }
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    setTimeout(function() {
        window.location.href = 'cart.html';
    }, 500);
}

function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = wishlist.find(item => item.id === product.id);
    if (!exists) {
        wishlist.push({ ...product, addedDate: new Date().toISOString() });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        showNotification(`${product.name} added to wishlist! ❤️`);
    } else {
        showNotification(`${product.name} is already in your wishlist!`);
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.header-user-actions .count-badge, .mobile-bottom-navigation .count-badge')
        .forEach(badge => {
            const parent = badge.closest('.action-btn');
            if (parent && parent.querySelector('ion-icon[name="bag-handle-outline"]')) {
                badge.textContent = total;
            }
        });
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const total = wishlist.length;
    document.querySelectorAll('.header-user-actions .count-badge, .mobile-bottom-navigation .count-badge')
        .forEach(badge => {
            const parent = badge.closest('.action-btn');
            if (parent && parent.querySelector('ion-icon[name="heart-outline"]')) {
                badge.textContent = total;
            }
        });
}

function showNotification(message) {
    const toast = document.querySelector('[data-toast]');
    if (toast) {
        const msgElement = toast.querySelector('.toast-message');
        if (msgElement) msgElement.textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
    }
}

// ============================================
// ADDITIONAL FUNCTIONS - Moved from HTML
// ============================================

// Function to handle adding to cart with button animation
function addToCartWithAnimation(product, buttonElement) {
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

// Function to handle adding to wishlist with button animation
function addToWishlistWithAnimation(product, buttonElement) {
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
        showNotification(`${product.name} added to wishlist! ❤️`);
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
        showNotification(`${product.name} is already in your wishlist!`);
    }
}

// ============================================
// CART PAGE FUNCTIONS
// ============================================

// Render cart items on cart.html
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

// Create cart item HTML
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

// Update quantity in cart
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

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

// Update cart total
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout with ' + cart.length + ' items');
}

// ============================================
// WISHLIST PAGE FUNCTIONS
// ============================================

// Render wishlist items on wishlist.html
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

// Create wishlist item HTML
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
        removeBtn.style.color = '#ff0000';
    });
    removeBtn.addEventListener('mouseleave', () => {
        removeBtn.style.transform = 'scale(1)';
        removeBtn.style.color = '#ff4444';
    });
    
    div.querySelector('.move-to-cart-btn').addEventListener('click', () => moveToCart(index));
    div.querySelector('.remove-wishlist-btn').addEventListener('click', () => removeFromWishlist(index));
    
    return div;
}

// Move from wishlist to cart
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

// Remove from wishlist
function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlistItems();
    updateWishlistCount();
}

// ============================================
// BUTTON TRANSITIONS - Moved from HTML
// ============================================

// Add transitions to all buttons on page load
function addButtonTransitions() {
    const allButtons = document.querySelectorAll(
        '.add-to-cart-btn, .add-to-wishlist-btn, .btn-action, .add-cart-btn, .banner-btn, .action-btn'
    );
    
    allButtons.forEach(btn => {
        // Add transition
        btn.style.transition = 'all 0.3s ease';
        
        // Hover effect
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
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
}

// ============================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================

// Update profile dropdown (alias for checkLoginStatus)
function updateProfileDropdown() {
    checkLoginStatus();
}

// Re-run on page show (for back/forward navigation)
window.addEventListener('pageshow', function() {
    updateCartCount();
    updateWishlistCount();
    checkLoginStatus();
});

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if on cart page
    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
    
    // Check if on wishlist page
    if (document.getElementById('wishlist-items-container')) {
        renderWishlistItems();
    }
    
    // Add button transitions
    addButtonTransitions();
});
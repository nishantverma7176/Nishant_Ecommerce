// ============================================
// PROFILE DROPDOWN FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    updateCartCount();
    updateWishlistCount();
});

function loginUser() {
    window.location.href = 'login.html';
}

function logoutUser() {
    localStorage.removeItem('user');
    checkLoginStatus();
    updateCartCount();
    updateWishlistCount();
}

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loggedOut = document.getElementById('loggedOutMenu');
    const loggedIn = document.getElementById('loggedInMenu');
    
    if (user) {
        if (loggedOut) loggedOut.style.display = 'none';
        if (loggedIn) loggedIn.style.display = 'block';
        document.getElementById('userName').textContent = 'Hello ' + user.name;
        document.getElementById('userPhone').textContent = user.phone;
    } else {
        if (loggedOut) loggedOut.style.display = 'block';
        if (loggedIn) loggedIn.style.display = 'none';
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
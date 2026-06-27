'use strict';

// ============================================
// CURRENCY CONFIGURATION
// ============================================
const EXCHANGE_RATE = 95;
const CURRENCY_SYMBOLS = { usd: '$', inr: '₹' };
let currentCurrency = 'usd';
let originalPrices = [];

// ============================================
// 1. MODAL FUNCTIONALITY
// ============================================
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

const modalCloseFunc = function () {
  if (modal) modal.classList.add('closed');
};

if (modalCloseOverlay) modalCloseOverlay.addEventListener('click', modalCloseFunc);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', modalCloseFunc);

// ============================================
// 2. MOBILE MENU - FIXED FOR TWO MENUS (☰ and ⊞)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing mobile menus');

  // Get elements
  const menuBtn = document.getElementById('menuBtn');
  const gridBtn = document.getElementById('gridBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const gridMenu = document.getElementById('gridMenu');
  const closeMenu = document.getElementById('closeMenu');
  const closeGrid = document.getElementById('closeGrid');
  const overlay = document.querySelector('[data-overlay]');

  // ============================================
  // OPEN MENU (☰)
  // ============================================
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Menu button clicked');

      // Close grid menu if open
      if (gridMenu) gridMenu.classList.remove('active');

      // Toggle menu
      mobileMenu.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  // ============================================
  // OPEN GRID MENU (⊞)
  // ============================================
  if (gridBtn && gridMenu) {
    gridBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Grid button clicked');

      // Close menu if open
      if (mobileMenu) mobileMenu.classList.remove('active');

      // Toggle grid menu
      gridMenu.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  // ============================================
  // CLOSE MENU (✕)
  // ============================================
  if (closeMenu && mobileMenu) {
    closeMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileMenu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    });
  }

  // ============================================
  // CLOSE GRID MENU (✕)
  // ============================================
  if (closeGrid && gridMenu) {
    closeGrid.addEventListener('click', function(e) {
      e.stopPropagation();
      gridMenu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    });
  }

  // ============================================
  // OVERLAY CLOSE
  // ============================================
  if (overlay) {
    overlay.addEventListener('click', function() {
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (gridMenu) gridMenu.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // ============================================
  // ACCORDION MENU (for mobile menus)
  // ============================================
  const accordionBtns = document.querySelectorAll('.accordion-menu');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const submenu = this.nextElementSibling;
      const isActive = submenu.classList.contains('active');

      // Close all other submenus
      document.querySelectorAll('.submenu-category-list').forEach(el => {
        el.classList.remove('active');
      });
      document.querySelectorAll('.accordion-menu').forEach(el => {
        el.classList.remove('active');
      });

      if (!isActive) {
        submenu.classList.add('active');
        this.classList.add('active');
      }
    });
  });

  // ============================================
  // ESCAPE KEY CLOSE
  // ============================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (gridMenu) gridMenu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      // Also close profile dropdown
      const profileDropdown = document.getElementById('profileDropdown');
      if (profileDropdown) profileDropdown.classList.remove('active');
    }
  });

  console.log('Mobile menus initialized!');
});

// ============================================
// 3. SIDEBAR ACCORDION
// ============================================
function setupSidebarAccordion() {
  const sidebarAccordionBtns = document.querySelectorAll('.sidebar-accordion-menu');
  sidebarAccordionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const submenu = this.nextElementSibling;
      const isActive = submenu.classList.contains('active');
      
      // Close all other submenus in sidebar
      document.querySelectorAll('.sidebar-submenu-category-list').forEach(el => {
        el.classList.remove('active');
      });
      document.querySelectorAll('.sidebar-accordion-menu').forEach(el => {
        el.classList.remove('active');
      });
      
      if (!isActive) {
        submenu.classList.add('active');
        this.classList.add('active');
      }
    });
  });
}

// ============================================
// CURRENCY CONVERSION - COMPLETE FIX
// ============================================

// Make changeCurrency globally accessible
window.changeCurrency = function(currency) {
  console.log('💱 Currency changed to:', currency);
  currentCurrency = currency;
  localStorage.setItem('selectedCurrency', currency);

  const selector = document.getElementById('currencySelector');
  if (selector) selector.value = currency;

  // Convert all static prices
  convertAllPrices(currency);
  
  // Re-render cart if on cart page
  if (document.getElementById('cart-items-container')) {
    renderCartItems();
  }
  
  // Re-render wishlist if on wishlist page
  if (document.getElementById('wishlist-items-container')) {
    renderWishlistItems();
  }
  
  // Show notification
  showNotification('Currency changed to ' + (currency === 'inr' ? 'INR ₹' : 'USD $'));
};

function convertAllPrices(currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  
  console.log('🔄 Converting all prices to:', currency);
  
  // Get ALL price elements on the page (static elements)
  const priceElements = document.querySelectorAll(
    '.price, .price-box .price, .showcase .price, .product-grid .price, ' +
    '.product-price, .item-price, .cart-price, .total-price, ' +
    '.banner-text b, .showcase-price, #cart-total'
  );
  
  const delElements = document.querySelectorAll(
    '.price-box del, .showcase del, .product-grid del, ' +
    '.original-price, .old-price'
  );

  // Store original USD prices if not already stored
  // Check if we already have stored prices for these elements
  priceElements.forEach(el => {
    const priceText = el.textContent.replace(/[$,₹]/g, '').trim();
    const priceValue = parseFloat(priceText);
    if (!isNaN(priceValue) && priceValue > 0) {
      const exists = originalPrices.some(item => item.element === el && item.type === 'price');
      if (!exists) {
        // Check if it's already in INR (value > 1000)
        const usdValue = priceValue > 1000 ? priceValue / EXCHANGE_RATE : priceValue;
        originalPrices.push({ 
          element: el, 
          originalValue: usdValue, 
          type: 'price' 
        });
      }
    }
  });

  delElements.forEach(el => {
    const priceText = el.textContent.replace(/[$,₹]/g, '').trim();
    const priceValue = parseFloat(priceText);
    if (!isNaN(priceValue) && priceValue > 0) {
      const exists = originalPrices.some(item => item.element === el && item.type === 'del');
      if (!exists) {
        const usdValue = priceValue > 1000 ? priceValue / EXCHANGE_RATE : priceValue;
        originalPrices.push({ 
          element: el, 
          originalValue: usdValue, 
          type: 'del' 
        });
      }
    }
  });

  // Update all stored prices using the ORIGINAL USD values
  originalPrices.forEach(item => {
    try {
      const convertedPrice = currency === 'inr' ? item.originalValue * EXCHANGE_RATE : item.originalValue;
      const formattedPrice = currency === 'inr' ? Math.round(convertedPrice) : convertedPrice.toFixed(2);
      item.element.textContent = `${symbol}${formattedPrice}`;
    } catch(e) {
      console.warn('Error converting price:', e);
    }
  });
}

function getConvertedPrice(usdPrice) {
  const currency = localStorage.getItem('selectedCurrency') || 'usd';
  if (currency === 'inr') {
    return Math.round(usdPrice * EXCHANGE_RATE);
  }
  return usdPrice;
}

function getCurrencySymbol() {
  const currency = localStorage.getItem('selectedCurrency') || 'usd';
  return CURRENCY_SYMBOLS[currency] || '$';
}

// ============================================
// 5. PROFILE DROPDOWN - COMPLETE FIX
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing profile dropdown');
  
  // ============================================
  // PROFILE DROPDOWN TOGGLE - FIXED
  // ============================================
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileBtn && profileDropdown) {
    // Click to toggle - works on ALL devices
    profileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      // Toggle the dropdown
      profileDropdown.classList.toggle('active');
      console.log('Profile dropdown toggled:', profileDropdown.classList.contains('active'));
    });

    // Touch event for mobile
    profileBtn.addEventListener('touchstart', function(e) {
      // Small delay to prevent double firing with click
      setTimeout(() => {
        profileDropdown.classList.toggle('active');
        console.log('Profile dropdown toggled via touch');
      }, 10);
    }, { passive: true });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!profileDropdown.contains(e.target) && e.target !== profileBtn && !profileBtn.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });

    // Close dropdown on scroll
    window.addEventListener('scroll', function() {
      profileDropdown.classList.remove('active');
    });
  }

  // ============================================
  // CURRENCY INIT - FIXED
  // ============================================
  const savedCurrency = localStorage.getItem('selectedCurrency') || 'usd';
  currentCurrency = savedCurrency;
  const selector = document.getElementById('currencySelector');
  if (selector) {
    selector.value = savedCurrency;
    
    // Remove any existing listeners and add new one
    selector.removeEventListener('change', handleCurrencyChange);
    selector.addEventListener('change', handleCurrencyChange);
    
    // Also handle 'input' event for mobile
    selector.addEventListener('input', handleCurrencyChange);
  }

  setTimeout(() => convertAllPrices(savedCurrency), 100);

  checkLoginStatus();
  updateCartCount();
  updateWishlistCount();

  // Setup sidebar accordion
  setupSidebarAccordion();
});

function handleCurrencyChange(e) {
  const value = e.target.value;
  console.log('Currency select changed to:', value);
  window.changeCurrency(value);
}

// ============================================
// PROFILE FUNCTIONS
// ============================================
function loginUser() {
  window.location.href = 'login.html';
}

function logoutUser(event) {
  if (event) event.preventDefault();
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  checkLoginStatus();
  updateCartCount();
  updateWishlistCount();
  showNotification('Logged out successfully! 👋');
  setTimeout(() => window.location.href = 'index.html', 500);
}

function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const dropdownHeader = document.getElementById('dropdownHeader');
  const profileActions = document.getElementById('profileActions');

  if (user && user.name) {
    if (dropdownHeader) {
      dropdownHeader.innerHTML = `
        <h4 class="user-name">Hello ${user.name}</h4>
        <p class="user-phone">${user.phoneNumber || user.phone || user.email || 'N/A'}</p>
        <span class="promo-badge"><ion-icon name="flame-outline"></ion-icon> FLAT 300 OFF ON FIRSTF</span>
      `;
    }
    if (profileActions) profileActions.classList.add('show');
  } else {
    if (dropdownHeader) {
      dropdownHeader.innerHTML = `
        <h4 class="user-name">Welcome!</h4>
        <p class="user-phone">To access account and manage orders</p>
        <button class="login-btn" onclick="window.location.href='login.html'">LOGIN / SIGNUP</button>
      `;
    }
    if (profileActions) profileActions.classList.remove('show');
  }
}

// ============================================
// ADD TO CART - COMPLETE FIX
// ============================================
function addToCart(product) {
    console.log('Adding to cart:', product);
    
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Current cart:', cart);
    
    // Check if product already exists
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
        // Product exists - increment quantity
        cart[existingIndex].quantity += 1;
        console.log('Updated quantity for existing item');
    } else {
        // Add new product with USD price and quantity
        const newItem = { 
            id: product.id,
            name: product.name,
            price: product.price,
            usdPrice: product.price,
            image: product.image || './assets/images/products/default.jpg',
            category: product.category || 'Uncategorized',
            quantity: 1
        };
        cart.push(newItem);
        console.log('Added new item to cart');
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved:', JSON.parse(localStorage.getItem('cart')));
    
    // Update badge count
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart! 🛒`);
    
    // Redirect after short delay
    setTimeout(function() {
        window.location.href = 'cart.html';
    }, 600);
}

// ============================================
// ADD TO WISHLIST
// ============================================
function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const exists = wishlist.find(item => item.id === product.id);

  if (!exists) {
    wishlist.push({ 
      ...product, 
      usdPrice: product.price, 
      addedDate: new Date().toISOString() 
    });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    showNotification(`${product.name} added to wishlist! ❤️`);
  } else {
    showNotification(`${product.name} is already in your wishlist!`);
  }
}

// ============================================
// UPDATE CART COUNT
// ============================================
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

// ============================================
// UPDATE WISHLIST COUNT
// ============================================
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

// ============================================
// SHOW NOTIFICATION
// ============================================
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
// RENDER CART ITEMS - FIXED WITH CURRENCY
// ============================================
// ============================================
// RENDER CART ITEMS - FIXED WITH CURRENCY
// ============================================
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items-container');
  const emptyCart = document.getElementById('emptyCart');
  const summary = document.getElementById('cart-summary');
  const currency = localStorage.getItem('selectedCurrency') || 'usd';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  console.log('🛒 Rendering cart items with currency:', currency);

  if (!container) {
    console.log('⚠️ Container not found!');
    return;
  }

  container.innerHTML = '';

  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (summary) summary.style.display = 'none';
    updateCartCount();
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  if (summary) summary.style.display = 'flex';

  cart.forEach((item, index) => {
    // Get USD price from stored usdPrice or price
    const usdPrice = item.usdPrice || item.price || 0;
    let convertedPrice;
    let formattedPrice;
    
    if (currency === 'inr') {
      convertedPrice = Math.round(usdPrice * EXCHANGE_RATE);
      formattedPrice = convertedPrice;
    } else {
      convertedPrice = usdPrice;
      formattedPrice = convertedPrice.toFixed(2);
    }
    
    // Handle original price if exists
    let originalPriceHTML = '';
    if (item.originalPrice) {
      const origUsd = item.originalPrice;
      let origConverted;
      let origFormatted;
      if (currency === 'inr') {
        origConverted = Math.round(origUsd * EXCHANGE_RATE);
        origFormatted = origConverted;
      } else {
        origConverted = origUsd;
        origFormatted = origConverted.toFixed(2);
      }
      originalPriceHTML = `<del style="color: var(--sonic-silver); font-size: 14px; margin-left: 8px;">${symbol}${origFormatted}</del>`;
    }

    const div = document.createElement('div');
    div.className = 'showcase';
    div.style.cssText = 'display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eef2f6; margin-bottom: 0;';

    div.innerHTML = `
      <div class="showcase-banner" style="flex-shrink: 0;">
        <img src="${item.image || './assets/images/products/default.jpg'}" alt="${item.name}" width="100" height="100" style="object-fit: contain; border-radius: 12px; background: #fafafa; padding: 6px;">
      </div>
      <div class="showcase-content" style="flex: 1;">
        <a href="#" class="showcase-category">${item.category || 'Uncategorized'}</a>
        <h3 class="showcase-title" style="font-size: 18px; font-weight: 600; margin: 4px 0;">${item.name}</h3>
        <div class="price-box" style="display: flex; align-items: center;">
          <p class="price" data-usd="${usdPrice}" style="font-size: 20px; font-weight: 700; color: var(--salmon-pink);">${symbol}${formattedPrice}</p>
          ${originalPriceHTML}
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 40px; overflow: hidden;">
          <button class="qty-btn minus" data-index="${index}" style="background: none; border: none; padding: 6px 14px; font-size: 22px; cursor: pointer; transition: all 0.3s ease;">−</button>
          <span class="qty-value" style="min-width: 36px; text-align: center; font-weight: 500;">${item.quantity || 1}</span>
          <button class="qty-btn plus" data-index="${index}" style="background: none; border: none; padding: 6px 14px; font-size: 22px; cursor: pointer; transition: all 0.3s ease;">+</button>
        </div>
        <button class="remove-item" data-index="${index}" style="background: none; border: none; color: #b0b0b0; font-size: 20px; cursor: pointer; transition: all 0.3s ease;">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    `;

    div.querySelector('.minus').addEventListener('click', () => updateQuantity(index, -1));
    div.querySelector('.plus').addEventListener('click', () => updateQuantity(index, 1));
    div.querySelector('.remove-item').addEventListener('click', () => removeItem(index));

    container.appendChild(div);
  });

  updateCartTotal();
}

// ============================================
// UPDATE QUANTITY
// ============================================
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
  }
}

// ============================================
// REMOVE ITEM
// ============================================
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
  updateCartCount();
}

// ============================================
// UPDATE CART TOTAL - FIXED
// ============================================
// ============================================
// UPDATE CART TOTAL - FIXED
// ============================================
function updateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const currency = localStorage.getItem('selectedCurrency') || 'usd';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  let totalUSD = 0;

  cart.forEach(item => {
    const price = item.usdPrice || item.price || 0;
    totalUSD += price * (item.quantity || 1);
  });

  let total;
  let formattedTotal;
  
  if (currency === 'inr') {
    total = Math.round(totalUSD * EXCHANGE_RATE);
    formattedTotal = total;
  } else {
    total = totalUSD;
    formattedTotal = total.toFixed(2);
  }
  
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = `${symbol}${formattedTotal}`;
    totalElement.setAttribute('data-usd', totalUSD);
  }
  
  // Update cart count
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = `${totalItems} items`;
  }
}

// ============================================
// RENDER WISHLIST ITEMS - FIXED WITH CURRENCY
// ============================================
// ============================================
// RENDER WISHLIST ITEMS - FIXED WITH CURRENCY
// ============================================
function renderWishlistItems() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const container = document.getElementById('wishlist-items-container');
  const emptyWishlist = document.getElementById('emptyWishlist');
  const currency = localStorage.getItem('selectedCurrency') || 'usd';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  console.log('❤️ Rendering wishlist items with currency:', currency);

  if (!container) return;
  container.innerHTML = '';

  if (wishlist.length === 0) {
    if (emptyWishlist) emptyWishlist.style.display = 'block';
    return;
  }

  if (emptyWishlist) emptyWishlist.style.display = 'none';

  wishlist.forEach((item, index) => {
    const usdPrice = item.usdPrice || item.price || 0;
    let convertedPrice;
    let formattedPrice;
    
    if (currency === 'inr') {
      convertedPrice = Math.round(usdPrice * EXCHANGE_RATE);
      formattedPrice = convertedPrice;
    } else {
      convertedPrice = usdPrice;
      formattedPrice = convertedPrice.toFixed(2);
    }

    const div = document.createElement('div');
    div.className = 'showcase';
    div.style.cssText = 'display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eef2f6; margin-bottom: 0;';

    div.innerHTML = `
      <div class="showcase-banner" style="flex-shrink: 0;">
        <img src="${item.image || './assets/images/products/default.jpg'}" alt="${item.name}" width="100" height="100" style="object-fit: contain; border-radius: 12px; background: #fafafa; padding: 6px;">
      </div>
      <div class="showcase-content" style="flex: 1;">
        <a href="#" class="showcase-category">${item.category || 'Uncategorized'}</a>
        <h3 class="showcase-title" style="font-size: 18px; font-weight: 600; margin: 4px 0;">${item.name}</h3>
        <div class="price-box">
          <p class="price" data-usd="${usdPrice}" style="font-size: 20px; font-weight: 700; color: var(--salmon-pink);">${symbol}${formattedPrice}</p>
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

    div.querySelector('.move-to-cart-btn').addEventListener('click', () => moveToCart(index));
    div.querySelector('.remove-wishlist-btn').addEventListener('click', () => removeFromWishlist(index));

    container.appendChild(div);
  });
}

// ============================================
// MOVE TO CART FROM WISHLIST
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
            cart.push({ 
                ...item, 
                usdPrice: item.usdPrice || item.price,
                quantity: 1 
            });
        }

        wishlist.splice(index, 1);

        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        renderWishlistItems();
        updateCartCount();
        updateWishlistCount();
        showNotification(`${item.name} moved to cart! 🛒`);

        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 300);
    }
}

// ============================================
// REMOVE FROM WISHLIST
// ============================================
function removeFromWishlist(index) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist.splice(index, 1);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  renderWishlistItems();
  updateWishlistCount();
}

// ============================================
// PROCEED TO CHECKOUT
// ============================================
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Proceeding to checkout with ' + cart.length + ' items');
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing...');
  
  updateCartCount();
  updateWishlistCount();

  // Button transitions
  document.querySelectorAll('.add-to-cart-btn, .add-to-wishlist-btn, .btn-action, .add-cart-btn, .banner-btn, .action-btn')
    .forEach(btn => {
      btn.style.transition = 'all 0.3s ease';

      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      });

      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      });
    });

  // Cart page
  if (document.getElementById('cart-items-container')) {
    renderCartItems();
  }

  // Wishlist page
  if (document.getElementById('wishlist-items-container')) {
    renderWishlistItems();
  }
});

// ============================================
// CURRENCY INIT ON WINDOW LOAD
// ============================================
window.addEventListener('load', function() {
  console.log('🔁 Window loaded - checking currency');
  
  const savedCurrency = localStorage.getItem('selectedCurrency') || 'usd';
  const selector = document.getElementById('currencySelector');
  if (selector) {
    selector.value = savedCurrency;
    selector.removeEventListener('change', handleCurrencyChange);
    selector.addEventListener('change', handleCurrencyChange);
    selector.addEventListener('input', handleCurrencyChange);
  }
  
  // First convert all static prices
  convertAllPrices(savedCurrency);
  
  // Then render cart and wishlist with the correct currency
  setTimeout(() => {
    if (document.getElementById('cart-items-container')) {
      renderCartItems();
    }
    if (document.getElementById('wishlist-items-container')) {
      renderWishlistItems();
    }
  }, 50);
});

// ============================================
// MOBILE MENU CURRENCY CLICK HANDLER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Handle mobile menu currency options
  const mobileCurrencyOptions = document.querySelectorAll('.mobile-currency-option');
  
  mobileCurrencyOptions.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currency = this.dataset.currency;
      console.log('💰 Mobile currency selected:', currency);
      
      if (currency) {
        // Call the global changeCurrency function
        if (typeof window.changeCurrency === 'function') {
          window.changeCurrency(currency);
        } else {
          // Fallback
          localStorage.setItem('selectedCurrency', currency);
          const selector = document.getElementById('currencySelector');
          if (selector) selector.value = currency;
          if (typeof convertAllPrices === 'function') {
            convertAllPrices(currency);
          }
          if (typeof renderCartItems === 'function') {
            renderCartItems();
          }
          if (typeof renderWishlistItems === 'function') {
            renderWishlistItems();
          }
        }
        
        // Close mobile menu
        const mobileMenu = document.getElementById('mobileMenu');
        const gridMenu = document.getElementById('gridMenu');
        const overlay = document.querySelector('[data-overlay]');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (gridMenu) gridMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        
        // Show notification
        if (typeof showNotification === 'function') {
          const label = currency === 'inr' ? 'INR ₹' : 'USD $';
          showNotification('Currency changed to ' + label);
        }
      }
    });
  });
});
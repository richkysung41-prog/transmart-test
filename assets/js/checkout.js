// assets/js/checkout.js

const CART_API = '/api/cart.php';
const ORDERS_API = '/api/orders.php';
const USERS_API = '/api/users.php';

let orderData = {
    shipping_address: '',
    shipping_method: 'regular',
    payment_method: null,
    notes: '',
    agreedToTerms: false,
    discount_id: null
};

document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    console.log('🟢 [CHECKOUT] DOMContentLoaded fired - User:', user);
    
    if (!user) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    initializeCheckout();
    setupEventListeners();
    setupAddressEventListeners();
    
    // Always load fresh cart data - don't use cached version
    console.log('🟡 [CHECKOUT] About to load order summary...');
    loadOrderSummary();
    
    // Store the last seen timestamp
    let lastSeenTimestamp = localStorage.getItem('transmart_cart_modified');
    console.log('🟡 [CHECKOUT] Initial lastSeenTimestamp:', lastSeenTimestamp);
    
    // Listen for cart changes from other tabs/windows
    window.addEventListener('storage', function(e) {
        console.log('🔵 [CHECKOUT] Storage event detected:', e.key, 'new value:', e.newValue);
        if (e.key === 'transmart_cart_modified' || e.key === 'cart_summary') {
            console.log('🟠 [CHECKOUT] Cart was modified in another tab/window, reloading...');
            loadOrderSummary();
        }
    });
    
    // Reload cart when page becomes visible (user switches back to checkout tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('🟣 [CHECKOUT] Page became visible, checking for cart updates...');
            loadOrderSummary();
        }
    });
    
    // Aggressive polling every 300ms to catch modifications
    console.log('🟢 [CHECKOUT] Starting 300ms polling interval...');
    let pollCount = 0;
    setInterval(function() {
        pollCount++;
        if (!document.hidden) {
            const currentModified = localStorage.getItem('transmart_cart_modified');
            
            // Log every 10 polls to reduce console spam
            if (pollCount % 10 === 0) {
                console.log('🔵 [CHECKOUT] Poll #' + pollCount + ' - current timestamp:', currentModified);
            }
            
            // Check if timestamp has changed or is very recent
            if (currentModified) {
                const timeSinceModified = Date.now() - parseInt(currentModified);
                
                // If modified within last 3 seconds, reload
                if (timeSinceModified < 3000) {
                    console.log('🟠 [CHECKOUT] RECENT MODIFICATION DETECTED! (' + timeSinceModified + 'ms ago) - RELOADING NOW');
                    loadOrderSummary();
                }
                
                // If timestamp changed, reload even if older
                if (lastSeenTimestamp !== currentModified) {
                    console.log('🟠 [CHECKOUT] TIMESTAMP CHANGED! Old:', lastSeenTimestamp, 'New:', currentModified, '- RELOADING NOW');
                    lastSeenTimestamp = currentModified;
                    loadOrderSummary();
                }
            }
        }
    }, 300);
});

function setupAddressEventListeners() {
    const addNewAddressBtn = document.querySelector('.add-new-address');
    const cancelNewAddressBtn = document.querySelector('.cancel-new-address');
    const saveAddressBtn = document.querySelector('.save-address');
    
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', showNewAddressForm);
    }
    
    if (cancelNewAddressBtn) {
        cancelNewAddressBtn.addEventListener('click', hideNewAddressForm);
    }
    
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', saveNewAddress);
    }
}

function initializeCheckout() {
    // Restore saved order data
    const savedOrderData = localStorage.getItem('transmart_order_data');
    if (savedOrderData) {
        try {
            const parsed = JSON.parse(savedOrderData);
            orderData = { ...orderData, ...parsed };
            updateFormFromSavedData();
        } catch (e) {
            console.error('Error parsing saved order data:', e);
        }
    }
    
    // Load user profile for default address
    loadUserProfile();
}

function setupEventListeners() {
    // Shipping method selection
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', function() {
            orderData.shipping_method = this.value;
            updateOrderSummary();
            saveOrderData();
        });
    });

    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            orderData.payment_method = this.value;
            updatePaymentMethod();
            saveOrderData();
        });
    });

    // Order notes
    const orderNotesTextarea = document.querySelector('textarea');
    if (orderNotesTextarea) {
        orderNotesTextarea.addEventListener('input', function() {
            orderData.notes = this.value;
            saveOrderData();
        });
    }

    // Terms and conditions
    const termsCheckbox = document.querySelector('input[type="checkbox"]');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            orderData.agreedToTerms = this.checked;
            updatePlaceOrderButton();
            saveOrderData();
        });
    }

    // Place order button
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    // Promo code
    const applyPromoBtn = document.querySelector('.bg-gray-100');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoAtCheckout);
    }
}

function showNewAddressForm() {
    document.getElementById('newAddressForm').classList.remove('hidden');
    document.querySelector('.add-new-address').classList.add('hidden');
}

function hideNewAddressForm() {
    document.getElementById('newAddressForm').classList.add('hidden');
    document.querySelector('.add-new-address').classList.remove('hidden');
}

function saveNewAddress() {
    const form = document.getElementById('newAddressForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!isValid) {
        showNotification('Harap lengkapi semua field alamat', 'error');
        return;
    }

    // Simulate saving address
    showNotification('Alamat baru berhasil disimpan');
    hideNewAddressForm();
    
    // Clear form
    inputs.forEach(input => {
        input.value = '';
    });
}

// Load user profile for address
async function loadUserProfile() {
    try {
        const response = await fetch(USERS_API);
        const result = await response.json();
        
        if (result.success && result.data) {
            const user = result.data;
            const addressField = document.querySelector('textarea[placeholder*="alamat"]') 
                || document.querySelector('textarea');
            
            if (addressField && user.address) {
                addressField.value = user.address;
                orderData.shipping_address = user.address;
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

function updatePaymentMethod() {
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        const label = radio.closest('label');
        if (radio.checked) {
            label?.classList.add('border-blue-500', 'bg-blue-50');
            label?.classList.remove('border-gray-300');
        } else {
            label?.classList.remove('border-blue-500', 'bg-blue-50');
            label?.classList.add('border-gray-300');
        }
    });
}

function updatePlaceOrderButton() {
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        if (!orderData.agreedToTerms) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            placeOrderBtn.disabled = false;
            placeOrderBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

function updateOrderSummary() {
    loadCartAndRender();
}

async function loadCartAndRender() {
    try {
        console.log('🔴 [API] loadCartAndRender called - fetching from API...');
        const response = await fetch(CART_API, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        
        console.log('🔴 [API] === FULL API RESPONSE ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('🔴 [API] === END API RESPONSE ===');
        console.log('🔴 [API] Cart data items count:', result.data ? result.data.length : 0);
        
        // Check if cart is empty
        if (!result.data || result.data.length === 0) {
            console.warn('🟡 [API] Cart is empty! Redirecting to cart page...');
            showNotification('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.', 'error');
            setTimeout(() => {
                window.location.href = '/pages/cart.html';
            }, 2000);
            return;
        }
        
        if (result.success && result.data) {
            console.log('🟢 [API] API returned success, rendering items and updating totals...');
            renderOrderItems(result.data);
            updateOrderTotals(result.data);
        } else {
            console.error('❌ [API] API returned error:', result);
            showNotification('Gagal memuat keranjang', 'error');
        }
    } catch (error) {
        console.error('❌ [API] Error loading cart:', error);
        showNotification('Terjadi kesalahan', 'error');
    }
}

function renderOrderItems(cartItems) {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) {
        console.error('❌ [ITEMS] orderItems container NOT FOUND!');
        return;
    }
    
    console.log('🟣 [ITEMS] renderOrderItems called with:', cartItems.length, 'items');
    
    // Clear all items
    orderItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        console.warn('🟡 [ITEMS] Cart is empty!');
        orderItemsContainer.innerHTML = '<p class="text-gray-500 text-sm">Keranjang Anda kosong</p>';
        return;
    }
    
    cartItems.forEach((item, index) => {
        console.log(`🟣 [ITEMS] Rendering Item #${index+1}: ${item.name} - Qty: ${item.quantity}, Price: Rp${formatPrice(item.price)}`);
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-3';
        div.innerHTML = `
            <div class="w-16 h-16 flex-shrink-0">
                <img src="/assets/images/${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded">
            </div>
            <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">${item.name}</h3>
                <p class="text-xs text-gray-500">${item.quantity} x Rp${formatPrice(item.price)}</p>
            </div>
            <div class="text-sm font-semibold text-gray-900">Rp${formatPrice(item.price * item.quantity)}</div>
        `;
        orderItemsContainer.appendChild(div);
    });
    
    console.log('🟢 [ITEMS] Finished rendering', cartItems.length, 'items');
}

function updateOrderTotals(cartItems) {
    console.log('🟠 [TOTALS] updateOrderTotals called with', cartItems.length, 'items');
    
    // Calculate subtotal from actual items with proper float parsing
    let subtotal = 0;
    console.log('🟠 [TOTALS] === CALCULATING SUBTOTAL ===');
    cartItems.forEach((item, idx) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const itemTotal = price * quantity;
        console.log(`🟠 [TOTALS] Item #${idx+1}: ${item.name} - Rp${formatPrice(price)} x ${quantity} = Rp${formatPrice(itemTotal)}`);
        subtotal += itemTotal;
    });
    
    console.log('🟠 [TOTALS] SUBTOTAL CALCULATED:', formatPrice(subtotal));
    
    // Get shipping cost from selected radio button
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    let shippingCost = 25000; // default regular
    if (shippingRadio) {
        shippingCost = shippingRadio.value === 'express' ? 50000 : 25000;
    }
    
    console.log('🟠 [TOTALS] Shipping cost:', formatPrice(shippingCost));
    
    const discount = 0; // TODO: Implement promo logic
    const total = subtotal + shippingCost - discount;

    console.log('🟠 [TOTALS] FINAL TOTAL:', formatPrice(total), '(Subtotal + Shipping - Discount)');

    // Update summary elements using their IDs
    const subtotalEl = document.getElementById('subtotalAmount');
    const shippingEl = document.getElementById('shippingAmount');
    const discountEl = document.getElementById('discountAmount');
    const totalEl = document.getElementById('totalAmount');
    const paymentBtnEl = document.getElementById('paymentButtonText');
    
    console.log('🟠 [TOTALS] DOM Elements found:', {
        subtotalEl: !!subtotalEl,
        shippingEl: !!shippingEl,
        discountEl: !!discountEl,
        totalEl: !!totalEl,
        paymentBtnEl: !!paymentBtnEl
    });
    
    if (subtotalEl) {
        const newValue = `Rp${formatPrice(subtotal)}`;
        const oldValue = subtotalEl.textContent;
        subtotalEl.textContent = newValue;
        console.log(`🟠 [TOTALS] subtotalAmount updated: "${oldValue}" → "${newValue}"`);
    } else {
        console.error('❌ [TOTALS] subtotalAmount element NOT FOUND!');
    }
    
    if (shippingEl) {
        const newValue = `Rp${formatPrice(shippingCost)}`;
        const oldValue = shippingEl.textContent;
        shippingEl.textContent = newValue;
        console.log(`🟠 [TOTALS] shippingAmount updated: "${oldValue}" → "${newValue}"`);
    } else {
        console.error('❌ [TOTALS] shippingAmount element NOT FOUND!');
    }
    
    if (discountEl) {
        discountEl.textContent = `- Rp${formatPrice(discount)}`;
    }
    
    if (totalEl) {
        const newValue = `Rp${formatPrice(total)}`;
        const oldValue = totalEl.textContent;
        totalEl.textContent = newValue;
        console.log(`🟠 [TOTALS] totalAmount updated: "${oldValue}" → "${newValue}"`);
    } else {
        console.error('❌ [TOTALS] totalAmount element NOT FOUND!');
    }
    
    if (paymentBtnEl) {
        const newValue = `Bayar Sekarang - Rp${formatPrice(total)}`;
        const oldValue = paymentBtnEl.textContent;
        paymentBtnEl.textContent = newValue;
        console.log(`🟠 [TOTALS] paymentButton updated: "${oldValue}" → "${newValue}"`);
    }
}

function getShippingCost() {
    switch(orderData.shipping_method) {
        case 'express': return 50000;
        case 'same_day': return 75000;
        default: return 25000; // regular
    }
}

function updatePlaceOrderButton() {
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        if (!orderData.agreedToTerms) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            placeOrderBtn.disabled = false;
            placeOrderBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

function applyPromoAtCheckout() {
    const promoInput = document.querySelector('input[type="text"]');
    const code = promoInput?.value.trim();
    
    if (!code) {
        showNotification('Masukkan kode promo', 'error');
        return;
    }

    // For now, just show success message
    // In production, validate code with API
    showNotification(`Kode promo "${code}" berhasil diterapkan`);
    orderData.discount_id = code;
    saveOrderData();
}

async function placeOrder() {
    // Validation
    if (!orderData.agreedToTerms) {
        showNotification('Harap setujui syarat dan ketentuan', 'error');
        return;
    }

    if (!orderData.payment_method) {
        showNotification('Harap pilih metode pembayaran', 'error');
        return;
    }
    
    // Get shipping address from form
    const addressInput = document.querySelector('textarea');
    if (!addressInput?.value.trim()) {
        showNotification('Harap isi alamat pengiriman', 'error');
        return;
    }
    
    orderData.shipping_address = addressInput.value.trim();

    // Show loading state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.innerHTML = '⏳ Memproses...';
    placeOrderBtn.disabled = true;

    try {
        const response = await fetch(ORDERS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                shipping_address: orderData.shipping_address,
                payment_method: orderData.payment_method,
                notes: orderData.notes,
                discount_id: orderData.discount_id || null
            })
        });

        const result = await response.json();

        if (result.success) {
            showNotification('✓ Pesanan berhasil dibuat');
            
            // Clear saved data
            localStorage.removeItem('transmart_order_data');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = `/pages/checkout.html?order_id=${result.data.order_id}&success=true`;
            }, 1500);
        } else {
            showNotification(result.error || 'Gagal membuat pesanan', 'error');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Terjadi kesalahan', 'error');
    } finally {
        placeOrderBtn.innerHTML = originalText;
        placeOrderBtn.disabled = false;
    }
}

function updateFormFromSavedData() {
    // Restore shipping method
    if (orderData.shipping_method) {
        const shippingRadio = document.querySelector(`input[name="shipping"][value="${orderData.shipping_method}"]`);
        if (shippingRadio) {
            shippingRadio.checked = true;
        }
    }

    // Restore payment method
    if (orderData.payment_method) {
        const paymentRadio = document.querySelector(`input[name="payment"][value="${orderData.payment_method}"]`);
        if (paymentRadio) {
            paymentRadio.checked = true;
            updatePaymentMethod();
        }
    }

    // Restore order notes
    if (orderData.notes) {
        const notesTextarea = document.querySelector('textarea');
        if (notesTextarea) {
            notesTextarea.value = orderData.notes;
        }
    }

    // Restore terms agreement
    if (orderData.agreedToTerms) {
        const termsCheckbox = document.querySelector('input[type="checkbox"]');
        if (termsCheckbox) {
            termsCheckbox.checked = true;
        }
    }
    
    updatePlaceOrderButton();
}

function saveOrderData() {
    localStorage.setItem('transmart_order_data', JSON.stringify(orderData));
}

// Initialize checkout on page load
function loadOrderSummary() {
    // Check if we have recent cart data in localStorage from cart page
    const cartSummary = JSON.parse(localStorage.getItem('cart_summary') || '{}');
    const lastModified = localStorage.getItem('transmart_cart_modified');
    
    console.log('Cart Summary from localStorage:', cartSummary);
    console.log('Last Modified:', lastModified);
    
    // Always load fresh data from API to ensure accuracy
    loadCartAndRender();
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

function getCurrentUser() {
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    
    if (userId && userName) {
        return {
            id: userId,
            name: userName,
            email: localStorage.getItem('user_email'),
            role: localStorage.getItem('user_role')
        };
    }
    return null;
}

function showNotification(message, type = 'success') {
    let notif = document.getElementById('notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notification';
        document.body.appendChild(notif);
    }
    
    notif.textContent = message;
    notif.className = `fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notif.classList.remove('hidden');
    
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 3000);
}
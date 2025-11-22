// assets/js/cart.js

const CART_API = '/api/cart.php';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    loadCart();
    setupEventListeners();
    setupShippingListener();
});

// Setup shipping option change listener
function setupShippingListener() {
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const cartSummary = JSON.parse(localStorage.getItem('cart_summary') || '{}');
            if (cartSummary.subtotal !== undefined) {
                // Recalculate total with new shipping
                const shippingCost = this.value === 'express' ? 50000 : 25000;
                const finalTotal = cartSummary.subtotal + shippingCost;
                
                const totalAmount = document.getElementById('totalAmount');
                if (totalAmount) {
                    totalAmount.textContent = `Rp${formatPrice(finalTotal)}`;
                }
                
                // Update localStorage
                cartSummary.shipping = shippingCost;
                cartSummary.total = finalTotal;
                localStorage.setItem('cart_summary', JSON.stringify(cartSummary));
                localStorage.setItem('transmart_cart_modified', Date.now().toString());
            }
        });
    });
}

// Load cart items
async function loadCart() {
    try {
        const loader = document.getElementById('cartLoader');
        if (loader) loader.classList.remove('hidden');
        
        const response = await fetch(CART_API, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success) {
            renderCart(result.data, result.summary);
        } else {
            showError('Gagal memuat keranjang');
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        showError('Terjadi kesalahan');
    } finally {
        const loader = document.getElementById('cartLoader');
        if (loader) loader.classList.add('hidden');
    }
}

// Render cart items
function renderCart(items, summary) {
    const itemsContainer = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyCartMessage');
    
    if (!items || items.length === 0) {
        if (itemsContainer) itemsContainer.innerHTML = '';
        if (emptyMessage) emptyMessage.classList.remove('hidden');
        updateSummary(0, 0);
        return;
    }
    
    if (emptyMessage) emptyMessage.classList.add('hidden');
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    
    // Calculate totals from items (in case API summary is wrong)
    let totalItems = 0;
    let totalPrice = 0;
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50 transition-colors';
        row.setAttribute('data-cart-id', item.id);
        
        // Parse price properly
        const price = parseFloat(item.price);
        row.setAttribute('data-price', price);
        
        const subtotal = price * item.quantity;
        
        // Add to totals
        totalItems += item.quantity;
        totalPrice += subtotal;
        
        row.innerHTML = `
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <img src="/assets/images/${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded" onerror="this.src='/assets/images/placeholder.png'">
                    <div>
                        <h3 class="font-semibold text-gray-900">${item.name}</h3>
                        <p class="text-sm text-gray-600">Rp${formatPrice(item.price)}</p>
                    </div>
                </div>
            </td>
            <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button class="decrease-quantity-btn px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-all duration-200 hover:shadow-md" data-cart-id="${item.id}" title="Kurangi">−</button>
                    <input type="number" value="${item.quantity}" min="1" max="999" class="quantity-input w-12 text-center border rounded transition-all focus:ring-2 focus:ring-blue-500" data-cart-id="${item.id}">
                    <button class="increase-quantity-btn px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-all duration-200 hover:shadow-md" data-cart-id="${item.id}" title="Tambah">+</button>
                </div>
            </td>
            <td class="p-4 text-right font-semibold transition-all duration-300">Rp${formatPrice(subtotal)}</td>
            <td class="p-4 text-center">
                <button class="remove-item-btn text-red-600 hover:text-red-800 font-semibold transition-all duration-200 hover:scale-110" data-cart-id="${item.id}" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        itemsContainer.appendChild(row);
    });
    
    // Attach event listeners
    document.querySelectorAll('.increase-quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleIncreaseQuantity);
    });
    
    document.querySelectorAll('.decrease-quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleDecreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', handleQuantityChange);
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
    
    // Use calculated totals instead of API summary
    updateSummary(totalItems, totalPrice);
}

// Update cart summary
function updateSummary(totalItems, totalPrice) {
    const itemsCount = document.getElementById('itemsCount');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    
    // Get current shipping cost
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    let shippingCost = 25000; // default
    if (shippingRadio) {
        shippingCost = shippingRadio.value === 'express' ? 50000 : 25000;
    }
    
    // Calculate total: subtotal + shipping
    const finalTotal = totalPrice + shippingCost;
    
    if (itemsCount) itemsCount.textContent = totalItems;
    if (subtotalAmount) subtotalAmount.textContent = `Rp${formatPrice(totalPrice)}`;
    if (totalAmount) totalAmount.textContent = `Rp${formatPrice(finalTotal)}`;
    
    // Save to localStorage for checkout sync
    localStorage.setItem('cart_summary', JSON.stringify({
        items: totalItems,
        subtotal: totalPrice,
        shipping: shippingCost,
        total: finalTotal
    }));
}

// Increase quantity
async function handleIncreaseQuantity(e) {
    const cartId = e.target.dataset.cartId;
    const input = document.querySelector(`.quantity-input[data-cart-id="${cartId}"]`);
    const btn = e.target;
    const newQuantity = parseInt(input.value) + 1;
    
    if (newQuantity <= 999) {
        // Add visual feedback
        btn.style.transform = 'scale(0.95)';
        btn.disabled = true;
        
        input.value = newQuantity;
        await updateQuantity(cartId, newQuantity, btn);
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.disabled = false;
        }, 300);
    }
}

// Decrease quantity
async function handleDecreaseQuantity(e) {
    const cartId = e.target.dataset.cartId;
    const input = document.querySelector(`.quantity-input[data-cart-id="${cartId}"]`);
    const btn = e.target;
    const newQuantity = Math.max(1, parseInt(input.value) - 1);
    
    // Add visual feedback
    btn.style.transform = 'scale(0.95)';
    btn.disabled = true;
    
    input.value = newQuantity;
    await updateQuantity(cartId, newQuantity, btn);
    
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
        btn.disabled = false;
    }, 300);
}

// Update quantity from input
async function handleQuantityChange(e) {
    const cartId = e.target.dataset.cartId;
    let quantity = parseInt(e.target.value);
    
    // Validate
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        e.target.value = 1;
    } else if (quantity > 999) {
        quantity = 999;
        e.target.value = 999;
    }
    
    // Disable input during update
    e.target.disabled = true;
    await updateQuantity(cartId, quantity);
    e.target.disabled = false;
}

// Update quantity via API
async function updateQuantity(cartId, quantity, btn = null) {
    try {
        const response = await fetch(CART_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                cart_id: cartId,
                quantity: quantity
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mark cart as modified so checkout page knows to refresh
            const timestamp = Date.now().toString();
            localStorage.setItem('transmart_cart_modified', timestamp);
            console.log('🔵 [CART] Cart modified flag SET! Timestamp:', timestamp);
            
            // Update visual without full reload for better UX
            const row = document.querySelector(`tr[data-cart-id="${cartId}"]`);
            if (row) {
                const input = row.querySelector('.quantity-input');
                const subtotalCell = row.querySelector('td:nth-child(3)');
                if (input && subtotalCell) {
                    // Make sure quantity is set correctly
                    input.value = quantity;
                    const price = parseFloat(row.dataset.price) || 0;
                    const newSubtotal = price * quantity;
                    subtotalCell.textContent = `Rp${formatPrice(newSubtotal)}`;
                    subtotalCell.style.transition = 'all 0.2s ease';
                    subtotalCell.style.color = '#059669';
                    setTimeout(() => {
                        subtotalCell.style.color = 'inherit';
                    }, 500);
                }
            }
            // Only reload cart summary, not full re-render
            setTimeout(() => {
                reloadCartSummaryOnly();
            }, 500);
        } else {
            showError(result.error || 'Gagal update quantity');
            // Reload to restore previous state if update failed
            setTimeout(() => {
                loadCart();
            }, 300);
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        showError('Terjadi kesalahan');
        // Reload to restore previous state if update failed
        setTimeout(() => {
            loadCart();
        }, 300);
    }
}

// Reload only cart summary without re-rendering items
async function reloadCartSummaryOnly() {
    try {
        // Recalculate from visible items instead of trusting API summary
        let totalItems = 0;
        let totalPrice = 0;
        
        // Calculate from all visible cart rows
        document.querySelectorAll('tr[data-cart-id]').forEach(row => {
            const quantityInput = row.querySelector('.quantity-input');
            const priceStr = row.dataset.price;
            
            if (quantityInput && priceStr) {
                const quantity = parseInt(quantityInput.value) || 0;
                const price = parseFloat(priceStr) || 0;
                totalItems += quantity;
                totalPrice += (price * quantity);
            }
        });
        
        // Get current shipping cost
        const shippingRadio = document.querySelector('input[name="shipping"]:checked');
        let shippingCost = 25000; // default
        if (shippingRadio) {
            shippingCost = shippingRadio.value === 'express' ? 50000 : 25000;
        }
        
        const finalTotal = totalPrice + shippingCost;
        
        console.log('Cart Summary Update (Recalculated):', {
            items: totalItems,
            subtotal: totalPrice,
            shipping: shippingCost,
            total: finalTotal
        });
        
        // Update elements directly
        const itemsCount = document.getElementById('itemsCount');
        const subtotalAmount = document.getElementById('subtotalAmount');
        const totalAmount = document.getElementById('totalAmount');
        
        if (itemsCount) itemsCount.textContent = totalItems;
        if (subtotalAmount) subtotalAmount.textContent = `Rp${formatPrice(totalPrice)}`;
        if (totalAmount) totalAmount.textContent = `Rp${formatPrice(finalTotal)}`;
        
        // Save to localStorage for checkout sync
        localStorage.setItem('cart_summary', JSON.stringify({
            items: totalItems,
            subtotal: totalPrice,
            shipping: shippingCost,
            total: finalTotal
        }));
    } catch (error) {
        console.error('Error reloading cart summary:', error);
    }
}

// Remove item from cart
async function handleRemoveItem(e) {
    // Get the button or its parent if icon was clicked
    let btn = e.target;
    if (btn.tagName !== 'BUTTON') {
        btn = btn.closest('button');
    }
    
    if (!btn) return;
    
    const cartId = btn.dataset.cartId;
    const row = btn.closest('tr');
    
    if (!row || !cartId) {
        console.error('Missing row or cartId', { row, cartId });
        return;
    }
    
    // Add slide-out animation
    row.style.transition = 'all 0.3s ease-in-out';
    row.style.opacity = '0';
    row.style.transform = 'translateX(100%)';
    row.style.height = row.offsetHeight + 'px';
    
    // Wait for animation to complete
    setTimeout(async () => {
        try {
            const response = await fetch(`${CART_API}?cart_id=${cartId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('✓ Produk dihapus dari keranjang');
                // Mark cart as modified so checkout page knows to refresh
                localStorage.setItem('transmart_cart_modified', Date.now().toString());
                // Reload cart after animation
                setTimeout(() => {
                    loadCart();
                }, 200);
            } else {
                // Revert animation if failed
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
                showError(result.error || 'Gagal menghapus produk');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            // Revert animation if failed
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
            showError('Terjadi kesalahan');
        }
    }, 150);
}

// Apply discount code
async function handleApplyDiscount(e) {
    e.preventDefault();
    
    const discountCode = document.getElementById('discountCode')?.value;
    if (!discountCode) {
        showError('Masukkan kode diskon');
        return;
    }
    
    // For now, just show notification
    // In production, verify with API
    showNotification('✓ Diskon berhasil diterapkan');
}

// Setup event listeners
function setupEventListeners() {
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = '/pages/products/catalog.html';
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = document.getElementById('cartItems');
            if (!cart || cart.children.length === 0) {
                showError('Keranjang Anda kosong');
                return;
            }
            window.location.href = '/pages/checkout.html';
        });
    }
    
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', handleApplyDiscount);
    }
}

// Helper functions
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

function showError(message) {
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
    
    errorDiv.textContent = message;
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50 max-w-sm animate-slideInUp';
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

function showNotification(message) {
    let notif = document.getElementById('notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notification';
        document.body.appendChild(notif);
    }
    
    notif.textContent = message;
    notif.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50';
    notif.classList.remove('hidden');
    
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 3000);
}

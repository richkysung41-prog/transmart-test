// assets/js/product-detail.js

const CART_API = '/api/cart.php';
const PRODUCTS_API = '/api/products.php';

// Get product ID from URL parameter
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

document.addEventListener('DOMContentLoaded', function() {
    const productId = getProductId();
    if (productId) {
        loadProductDetails(productId);
    } else {
        // Redirect to catalog if no product ID
        window.location.href = '/pages/products/catalog.html';
    }
    
    setupEventListeners();
});

// Load product details
async function loadProductDetails(productId) {
    try {
        const response = await fetch(`${PRODUCTS_API}?id=${productId}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            const product = result.data[0];
            displayProductDetails(product);
        }
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

// Display product details
function displayProductDetails(product) {
    // Update title
    document.title = product.name + ' - Detail Produk';
    
    // Update breadcrumb (optional)
    // Update product name
    const nameElement = document.querySelector('h1');
    if (nameElement) {
        nameElement.textContent = product.name;
    }
    
    // Update description
    const descElement = document.querySelector('p.text-gray-600');
    if (descElement) {
        descElement.textContent = product.description || '';
    }
    
    // Store product data for later use
    window.currentProduct = product;
}

// Setup event listeners
function setupEventListeners() {
    // "Beli Sekarang" button
    const buyNowBtn = document.querySelector('button:has(i.fa-bolt)');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', handleBuyNow);
    }
    
    // "+ Keranjang" button
    const addToCartBtn = document.querySelector('button:has(i.fa-shopping-cart)');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }
}

// Handle add to cart
async function handleAddToCart(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('Silakan login terlebih dahulu');
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    if (!window.currentProduct) {
        alert('Produk tidak ditemukan');
        return;
    }
    
    const quantity = getSelectedQuantity();
    
    try {
        const response = await fetch(CART_API, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: window.currentProduct.id,
                quantity: quantity
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`✓ ${window.currentProduct.name} ditambahkan ke keranjang (${quantity} item)`);
        } else {
            showError(result.error || 'Gagal menambahkan ke keranjang');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Terjadi kesalahan');
    }
}

// Handle buy now
async function handleBuyNow(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('Silakan login terlebih dahulu');
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    if (!window.currentProduct) {
        alert('Produk tidak ditemukan');
        return;
    }
    
    const quantity = getSelectedQuantity();
    
    try {
        const response = await fetch(CART_API, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: window.currentProduct.id,
                quantity: quantity
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Redirect to checkout
            window.location.href = '/pages/checkout.html';
        } else {
            showError(result.error || 'Gagal menambahkan ke keranjang');
        }
    } catch (error) {
        console.error('Error buying product:', error);
        showError('Terjadi kesalahan');
    }
}

// Get selected quantity
function getSelectedQuantity() {
    const quantityInput = document.querySelector('[x-text="quantity"]')?.parentElement;
    if (quantityInput) {
        const quantityText = quantityInput.textContent.trim();
        const quantity = parseInt(quantityText);
        return isNaN(quantity) ? 1 : quantity;
    }
    return 1;
}

// Helper functions
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
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 4000);
    } else {
        alert(message);
    }
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
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

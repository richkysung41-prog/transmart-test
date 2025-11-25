# Frontend-Backend Integration Guide

## 📚 Daftar Isi
1. [Setup](#setup)
2. [Struktur Request/Response](#struktur-requestresponse)
3. [Authentication](#authentication)
4. [API Calls](#api-calls)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Setup

### JavaScript Konfigurasi
Buat file `assets/js/api.config.js`:

```javascript
// api.config.js
const API_BASE_URL = 'http://localhost:8000/api';

// Fetch with error handling
async function apiCall(endpoint, method = 'GET', data = null, requireAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies for sessions
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        if (response.status === 401 && requireAuth) {
            // Redirect to login
            window.location.href = '/pages/auth/login.html';
            return null;
        }
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API Error');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export for use in other files
window.API = {
    call: apiCall,
    baseUrl: API_BASE_URL
};
```

### HTML Template
```html
<!-- In index.html or your main template -->
<script src="assets/js/api.config.js"></script>
<script src="assets/js/auth.js"></script>
<script src="assets/js/products.js"></script>
<script src="assets/js/cart.js"></script>
```

---

## Struktur Request/Response

### Standard Response Format
Semua API mengembalikan JSON dengan format:

**Success Response (200):**
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { /* actual data */ }
}
```

**Error Response (4xx/5xx):**
```json
{
    "success": false,
    "error": "Error message",
    "details": {}
}
```

---

## Authentication

### 1. Login

**Frontend (JavaScript):**
```javascript
// assets/js/auth.js

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Redirect to home
            window.location.href = '/';
            return true;
        } else {
            alert('Login failed: ' + result.error);
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
        return false;
    }
}

// HTML Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    await loginUser(email, password);
});
```

### 2. Register

```javascript
async function registerUser(name, email, password, phone) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth.php?action=register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phone: phone
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Registration successful! Please login.');
            window.location.href = '/pages/auth/login.html';
            return true;
        } else {
            alert('Registration failed: ' + result.error);
            return false;
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('An error occurred during registration');
        return false;
    }
}
```

### 3. Check Authentication Status

```javascript
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function logout() {
    localStorage.removeItem('user');
    fetch(`${API_BASE_URL}/auth.php?action=logout`, {
        method: 'POST',
        credentials: 'include'
    });
    window.location.href = '/';
}
```

---

## API Calls

### 1. Fetch Products

**Frontend:**
```javascript
// assets/js/products.js

async function getProducts(page = 1, limit = 12) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products.php?action=get_all&page=${page}&limit=${limit}`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data);
            setupPagination(result.total, limit, page);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="assets/img/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">Rp ${formatPrice(product.price)}</p>
            ${product.discount > 0 ? `<span class="discount">${product.discount}% OFF</span>` : ''}
            <button onclick="addToCart(${product.id}, 1)">Add to Cart</button>
        </div>
    `).join('');
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    getProducts();
});
```

### 2. Search Products

```javascript
async function searchProducts(keyword) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products.php?action=search&keyword=${encodeURIComponent(keyword)}`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data);
        } else {
            console.log('No products found');
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Search form handler
document.getElementById('searchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.getElementById('searchInput').value;
    searchProducts(keyword);
});
```

### 3. Get Product Detail

```javascript
async function getProductDetail(productId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products.php?action=detail&id=${productId}`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayProductDetail(result.data);
        }
    } catch (error) {
        console.error('Error fetching product detail:', error);
    }
}

function displayProductDetail(product) {
    const container = document.getElementById('productDetail');
    container.innerHTML = `
        <div class="detail-container">
            <img src="assets/img/${product.image}" alt="${product.name}">
            <div class="detail-info">
                <h1>${product.name}</h1>
                <p class="description">${product.description}</p>
                <p class="price">Rp ${formatPrice(product.price)}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <p class="rating">⭐ ${product.rating}/5 (${product.total_sold} sold)</p>
                <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                <button onclick="addToCart(${product.id}, document.getElementById('quantity').value)">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}
```

### 4. Cart Operations

```javascript
// assets/js/cart.js

async function addToCart(productId, quantity) {
    if (!isLoggedIn()) {
        alert('Please login first');
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    const user = getCurrentUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart.php?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                user_id: user.id,
                product_id: productId,
                quantity: parseInt(quantity)
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Added to cart!');
            updateCartCount();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('An error occurred');
    }
}

async function getCart(userId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/cart.php?action=get&user_id=${userId}`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayCart(result.data);
            updateCartTotal(result.total);
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

async function removeFromCart(cartId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart.php?action=remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ cart_id: cartId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            getCart(getCurrentUser().id); // Refresh cart
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

function updateCartCount() {
    const user = getCurrentUser();
    if (user) {
        getCart(user.id).then(() => {
            // Update cart badge
            const badge = document.querySelector('.cart-badge');
            if (badge) {
                fetch(`${API_BASE_URL}/cart.php?action=get&user_id=${user.id}`, {
                    credentials: 'include'
                })
                .then(r => r.json())
                .then(data => {
                    badge.textContent = data.data.length;
                });
            }
        });
    }
}
```

### 5. Categories

```javascript
async function getCategories() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/categories.php?action=get_all`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayCategories(result.data);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function displayCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = categories.map(cat => `
        <a href="#" onclick="filterByCategory(${cat.id})">
            <div class="category-item">
                <h4>${cat.name}</h4>
            </div>
        </a>
    `).join('');
}

async function filterByCategory(categoryId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products.php?action=by_category&category_id=${categoryId}`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data);
        }
    } catch (error) {
        console.error('Error filtering by category:', error);
    }
}
```

### 6. Orders

```javascript
// assets/js/checkout.js

async function createOrder(shippingAddress, paymentMethod, items) {
    if (!isLoggedIn()) {
        alert('Please login first');
        return;
    }
    
    const user = getCurrentUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders.php?action=create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                user_id: user.id,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                items: items
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Order created! Order #' + result.order_number);
            localStorage.removeItem('cart');
            window.location.href = '/';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Order error:', error);
        alert('An error occurred while creating order');
    }
}

async function getUserOrders(userId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/orders.php?action=get_user_orders&user_id=${userId}`,
            { credentials: 'include' }
        );
        
        const result = await response.json();
        
        if (result.success) {
            displayOrders(result.data);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <p><strong>${order.order_number}</strong></p>
            <p>Total: Rp ${formatPrice(order.total_price)}</p>
            <p>Status: <span class="status-${order.status}">${order.status}</span></p>
            <p>Date: ${new Date(order.created_at).toLocaleDateString('id-ID')}</p>
            <button onclick="viewOrderDetail(${order.id})">View Detail</button>
        </div>
    `).join('');
}
```

---

## Error Handling

```javascript
// Global error handler
async function handleApiError(response) {
    if (!response.ok) {
        if (response.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('user');
            window.location.href = '/pages/auth/login.html';
        } else if (response.status === 403) {
            alert('You do not have permission to access this resource');
        } else if (response.status === 404) {
            alert('Resource not found');
        } else if (response.status === 500) {
            alert('Server error. Please try again later');
        }
    }
}

// Try-catch wrapper for API calls
async function safeApiCall(apiFunction) {
    try {
        return await apiFunction();
    } catch (error) {
        console.error('API Error:', error);
        
        if (error.message.includes('Failed to fetch')) {
            alert('Network error. Please check your connection');
        } else {
            alert('An error occurred: ' + error.message);
        }
        
        return null;
    }
}
```

---

## Best Practices

### 1. Security
```javascript
// ✅ DO: Use credentials include for session cookies
fetch(url, {
    credentials: 'include'
});

// ✅ DO: Validate user input
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ❌ DON'T: Store sensitive data in localStorage
// localStorage.setItem('password', password); // WRONG!

// ✅ DO: Use secure httpOnly cookies for auth tokens
```

### 2. Loading States
```javascript
async function getProducts() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE_URL}/products.php?action=get_all`);
        const result = await response.json();
        displayProducts(result.data);
    } finally {
        loader.style.display = 'none';
    }
}
```

### 3. Debouncing Search
```javascript
let searchTimeout;

function onSearchInput(keyword) {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        searchProducts(keyword);
    }, 500); // Wait 500ms after user stops typing
}

// Usage
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    onSearchInput(e.target.value);
});
```

### 4. Pagination
```javascript
function setupPagination(total, limit, currentPage) {
    const totalPages = Math.ceil(total / limit);
    const container = document.getElementById('pagination');
    
    let html = '';
    
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button 
                onclick="getProducts(${i}, ${limit})"
                class="${i === currentPage ? 'active' : ''}"
            >
                ${i}
            </button>
        `;
    }
    
    container.innerHTML = html;
}
```

### 5. Form Validation
```javascript
function validateLoginForm(email, password) {
    const errors = [];
    
    if (!email) {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }
    
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    return errors;
}

// Usage
const errors = validateLoginForm(email, password);
if (errors.length > 0) {
    alert(errors.join('\n'));
} else {
    loginUser(email, password);
}
```

---

## 📝 Example Complete Page

```html
<!-- pages/products/catalog.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Products - Transmart</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
    <div id="productsContainer" class="products-grid"></div>
    <div id="pagination" class="pagination"></div>
    <div id="loader" style="display:none;">Loading...</div>
    
    <script src="../../assets/js/api.config.js"></script>
    <script>
        async function getProducts(page = 1) {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';
            
            try {
                const response = await fetch(
                    `${API_BASE_URL}/products.php?action=get_all&page=${page}&limit=12`,
                    { credentials: 'include' }
                );
                const result = await response.json();
                
                if (result.success) {
                    const container = document.getElementById('productsContainer');
                    container.innerHTML = result.data.map(p => `
                        <div class="product-card">
                            <img src="../../assets/img/${p.image}" alt="${p.name}">
                            <h3>${p.name}</h3>
                            <p>Rp ${formatPrice(p.price)}</p>
                        </div>
                    `).join('');
                }
            } finally {
                loader.style.display = 'none';
            }
        }
        
        function formatPrice(p) {
            return new Intl.NumberFormat('id-ID').format(p);
        }
        
        getProducts();
    </script>
</body>
</html>
```

---

**Last Updated:** 25 November 2024

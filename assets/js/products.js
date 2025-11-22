// assets/js/products.js

const PRODUCTS_API = '/api/products.php';
const CATEGORIES_API = '/api/categories.php';
const CART_API = '/api/cart.php';

let currentPage = 1;
let currentFilters = {
    category_id: null,
    search: null,
    min_price: null,
    max_price: null,
    sort_by: 'created_at',
    sort_order: 'DESC'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadProducts();
    setupEventListeners();
});

// Load categories and populate filter sidebar
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_API);
        const result = await response.json();
        
        if (result.success && result.data) {
            const categoryList = document.getElementById('categoryList');
            if (!categoryList) return;
            
            categoryList.innerHTML = `
                <li class="mb-2">
                    <a href="#" class="category-filter text-blue-600 hover:underline font-semibold" data-id="">
                        Semua Kategori
                    </a>
                </li>
            `;
            
            result.data.forEach(cat => {
                const li = document.createElement('li');
                li.className = 'mb-2';
                li.innerHTML = `
                    <a href="#" class="category-filter text-gray-700 hover:text-blue-600" data-id="${cat.id}">
                        ${cat.name} <span class="text-gray-500 text-sm">(${cat.product_count})</span>
                    </a>
                `;
                categoryList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load products with current filters
async function loadProducts(page = 1) {
    try {
        const loader = document.getElementById('productsLoader');
        const grid = document.getElementById('productsGrid');
        
        if (loader) loader.classList.remove('hidden');
        
        // Build query string
        let query = new URLSearchParams();
        query.append('page', page);
        query.append('limit', 12);
        
        if (currentFilters.category_id) {
            query.append('category_id', currentFilters.category_id);
        }
        if (currentFilters.search) {
            query.append('search', currentFilters.search);
        }
        if (currentFilters.min_price !== null) {
            query.append('min_price', currentFilters.min_price);
        }
        if (currentFilters.max_price !== null) {
            query.append('max_price', currentFilters.max_price);
        }
        
        query.append('sort_by', currentFilters.sort_by);
        query.append('sort_order', currentFilters.sort_order);
        
        const response = await fetch(`${PRODUCTS_API}?${query.toString()}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            renderProducts(result.data);
            renderPagination(result.pagination);
        } else {
            if (grid) {
                grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">Produk tidak ditemukan</div>';
            }
        }
        
        currentPage = page;
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Gagal memuat produk');
    } finally {
        const loader = document.getElementById('productsLoader');
        if (loader) loader.classList.add('hidden');
    }
}

// Render product grid
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">Tidak ada produk yang sesuai</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden';
        
        const imageUrl = product.image.startsWith('http') 
            ? product.image 
            : `/assets/images/${product.image}`;
        
        const ratingStars = renderStars(product.rating || 0);
        
        card.innerHTML = `
            <div class="relative overflow-hidden bg-gray-100 h-48">
                <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover hover:scale-110 transition-transform">
                ${product.discount ? `<div class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">-${product.discount}%</div>` : ''}
                ${product.stock <= 0 ? '<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span class="text-white font-bold">Stok Habis</span></div>' : ''}
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-900 truncate mb-2">${product.name}</h3>
                <p class="text-sm text-gray-600 line-clamp-2 mb-3">${product.description || 'Deskripsi tidak tersedia'}</p>
                
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl font-bold text-blue-600">Rp${formatPrice(product.price)}</span>
                    <div class="text-yellow-400 text-sm">${ratingStars}</div>
                </div>
                
                <div class="flex gap-2">
                    <a href="/pages/products/detail.html?id=${product.id}" class="flex-1 bg-gray-200 text-gray-900 py-2 px-3 rounded text-center text-sm font-medium hover:bg-gray-300 transition-colors">
                        Lihat Detail
                    </a>
                    <button class="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors add-to-cart-btn" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
                        🛒 Tambah
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Attach event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
}

// Render pagination
function renderPagination(pagination) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const { page, total_pages } = pagination;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-3 py-2 rounded ${page > 1 ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`;
    prevBtn.textContent = '← Sebelumnya';
    prevBtn.disabled = page <= 1;
    prevBtn.addEventListener('click', () => {
        if (page > 1) loadProducts(page - 1);
    });
    container.appendChild(prevBtn);
    
    // Page numbers
    for (let i = Math.max(1, page - 2); i <= Math.min(total_pages, page + 2); i++) {
        const btn = document.createElement('button');
        btn.className = `px-3 py-2 rounded ${i === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.textContent = i;
        btn.disabled = i === page;
        btn.addEventListener('click', () => loadProducts(i));
        container.appendChild(btn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-3 py-2 rounded ${page < total_pages ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`;
    nextBtn.textContent = 'Berikutnya →';
    nextBtn.disabled = page >= total_pages;
    nextBtn.addEventListener('click', () => {
        if (page < total_pages) loadProducts(page + 1);
    });
    container.appendChild(nextBtn);
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-filter')) {
            e.preventDefault();
            currentFilters.category_id = e.target.dataset.id || null;
            loadProducts(1);
        }
    });
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = this.value || null;
                loadProducts(1);
            }, 300);
        });
    }
    
    // Price filter
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    const filterPriceBtn = document.getElementById('filterPriceBtn');
    
    if (filterPriceBtn) {
        filterPriceBtn.addEventListener('click', function() {
            currentFilters.min_price = minPriceInput?.value ? parseInt(minPriceInput.value) : null;
            currentFilters.max_price = maxPriceInput?.value ? parseInt(maxPriceInput.value) : null;
            loadProducts(1);
        });
    }
    
    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const [sort_by, sort_order] = this.value.split('_');
            currentFilters.sort_by = sort_by;
            currentFilters.sort_order = sort_order;
            loadProducts(1);
        });
    }
}

// Add to cart
async function handleAddToCart(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('Silakan login terlebih dahulu');
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    const productId = e.target.dataset.id;
    
    try {
        const response = await fetch(CART_API, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('✓ Produk ditambahkan ke keranjang');
            // Update cart count if exists
            updateCartCount();
        } else {
            showError(result.error || 'Gagal menambahkan ke keranjang');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Terjadi kesalahan');
    }
}

// Helper functions
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '☆';
    stars += '☆'.repeat(5 - Math.ceil(rating));
    return stars;
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

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    // This will be updated by cart.js when cart page loads
    // For now, fetch current count
    fetch(CART_API)
        .then(r => r.json())
        .then(data => {
            if (data.success && data.summary) {
                cartCount.textContent = data.summary.total_items;
            }
        })
        .catch(e => console.error('Error updating cart count:', e));
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 4000);
    }
}

function showNotification(message) {
    // Create notification element if it doesn't exist
    let notif = document.getElementById('notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notification';
        document.body.appendChild(notif);
    }
    
    notif.textContent = message;
    notif.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg';
    
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 3000);
}
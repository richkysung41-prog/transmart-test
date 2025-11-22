// assets/js/main.js - Homepage functionality

// Initialize Swiper for Hero Banner
let heroSwiper;

function initializeHeroSwiper() {
    heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        }
    });
}

// Load banners dynamically
async function loadBanners() {
    try {
        const response = await fetch('/api/homepage.php');
        const result = await response.json();

        if (result.success && result.banners && result.banners.length > 0) {
            const bannerSlides = document.getElementById('banner-slides');
            bannerSlides.innerHTML = '';

            result.banners.forEach(banner => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';

                const backgroundStyle = banner.image_url
                    ? `background-image: url('${banner.image_url}'); background-size: cover; background-position: center;`
                    : `background: ${banner.background_color || '#ff6b6b'};`;

                slide.innerHTML = `
                    <div class="relative h-48 md:h-80" style="${backgroundStyle}">
                        ${!banner.image_url ? '<div class="w-full h-full bg-gray-300 flex items-center justify-center"><span class="text-gray-600 text-lg">Banner</span></div>' : ''}
                        <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center">
                            <div class="max-w-lg mx-8 text-white">
                                <h2 class="text-2xl md:text-4xl font-bold mb-2 md:mb-4">${banner.title || 'Promo Spesial'}</h2>
                                ${banner.subtitle ? `<p class="text-sm md:text-lg mb-4 md:mb-6">${banner.subtitle}</p>` : ''}
                                ${banner.button_text ? `<button class="bg-white text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors banner-btn" data-url="${banner.button_url || '#'}">${banner.button_text}</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;

                bannerSlides.appendChild(slide);
            });

            // Reinitialize Swiper with new slides
            if (heroSwiper) {
                heroSwiper.destroy();
            }
            initializeHeroSwiper();

            // Add click handlers for banner buttons
            document.querySelectorAll('.banner-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = btn.dataset.url;
                    if (url && url !== '#') {
                        window.location.href = url;
                    }
                });
            });

        } else {
            // Fallback to default banners if no data
            console.log('No banners found, using default content');
            initializeHeroSwiper();
        }
    } catch (error) {
        console.error('Error loading banners:', error);
        // Fallback to default banners
        initializeHeroSwiper();
    }
}

// Get current user from localStorage
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

// Update header buttons based on auth state
function updateHeaderButtons() {
    const loginBtn = document.querySelector('button:has(i.fa-user)');
    
    if (loginBtn) {
        const user = getCurrentUser();
        
        if (user) {
            // User is logged in - change button to profile/logout
            loginBtn.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${user.name}</span>
            `;
            loginBtn.onclick = showUserMenu;
        } else {
            // User not logged in - button shows login
            loginBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = '/pages/auth/login.html';
            };
        }
    }
}

// Show user menu dropdown
function showUserMenu(e) {
    e.preventDefault();
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    // Remove existing menu if present
    const existing = document.querySelector('.user-dropdown-menu');
    if (existing) {
        existing.remove();
        return;
    }
    
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'user-dropdown-menu absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50';
    menu.innerHTML = `
        <div class="px-4 py-2 border-b text-gray-600 text-sm">
            👤 ${user.name}
        </div>
        <a href="/pages/user/profile.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
            <i class="fas fa-user mr-2"></i>Profil
        </a>
        <a href="/pages/user/orders.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
            <i class="fas fa-box mr-2"></i>Pesanan Saya
        </a>
        ${user.role === 'admin' ? `
            <a href="/pages/admin/dashboard.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
                <i class="fas fa-tachometer-alt mr-2"></i>Admin
            </a>
            <hr class="my-2">
        ` : ''}
        <button onclick="handleLogout()" class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors text-sm border-t">
            <i class="fas fa-sign-out-alt mr-2"></i>Keluar
        </button>
    `;
    
    const btn = e.target.closest('button');
    btn.parentElement.style.position = 'relative';
    btn.parentElement.appendChild(menu);
    
    // Close menu when clicking outside
    document.addEventListener('click', closeUserMenu, true);
}

function closeUserMenu(e) {
    if (!e.target.closest('button:has(i.fa-user)') && !e.target.closest('.user-dropdown-menu')) {
        const menu = document.querySelector('.user-dropdown-menu');
        if (menu) {
            menu.remove();
            document.removeEventListener('click', closeUserMenu, true);
        }
    }
}

// Logout handler
async function handleLogout() {
    try {
        await fetch('/api/auth.php?action=logout', {
            method: 'POST'
        });
        
        // Clear localStorage
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_phone');
        localStorage.removeItem('user_role');
        
        showNotification('✓ Berhasil logout');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('❌ Gagal logout', 'error');
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('input[placeholder*="Cari produk"]');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `/pages/products/catalog.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Cart button functionality
function setupCartButton() {
    const cartBtn = document.querySelector('button:has(i.fa-shopping-cart):not(.fixed)');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            
            if (!user) {
                alert('Silakan login terlebih dahulu');
                window.location.href = '/pages/auth/login.html';
                return;
            }
            
            window.location.href = '/pages/cart.html';
        });
    }
}

// Category navigation
function setupCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('nav.bg-white.border-b a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const categoryName = link.querySelector('span').textContent.toLowerCase();
            const categoryMap = {
                'buah & sayur': '1',
                'makanan': '2',
                'minuman': '3',
                'rumah tangga': '4',
                'elektronik': '5',
                'kesehatan': '6'
            };
            
            const categoryId = categoryMap[categoryName] || '';
            window.location.href = `/pages/products/catalog.html?category=${categoryId}`;
        });
    });
}

// Quick category tiles
function setupQuickCategories() {
    const categoryTiles = document.querySelectorAll('.grid.grid-cols-3.md\\:grid-cols-6 > div');
    
    categoryTiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            const categoryMap = {
                0: '1', // Buah Segar
                1: '2', // Roti & Kue
                2: '3', // Minuman
                3: '4', // Rumah Tangga
                4: '5', // Elektronik
                5: '6'  // Kesehatan
            };
            
            const categoryId = categoryMap[index];
            window.location.href = `/pages/products/catalog.html?category=${categoryId}`;
        });
    });
}

// Flash sale buttons
function setupFlashSaleButtons() {
    document.querySelectorAll('.bg-gradient-to-r button').forEach(btn => {
        if (btn.textContent.includes('Belanja') || btn.textContent.includes('Lihat') || btn.textContent.includes('Jelajahi')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/pages/products/catalog.html';
            });
        }
    });
}

// Add to cart from homepage products
function setupAddToCartButtons() {
    let cartButtonCount = 0;
    
    document.querySelectorAll('button').forEach((btn) => {
        const btnText = btn.textContent.trim();
        
        // Match "+ Keranjang" buttons (add to cart buttons)
        if (btnText === '+ Keranjang') {
            cartButtonCount++;
            
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const user = getCurrentUser();
                if (!user) {
                    alert('Silakan login terlebih dahulu');
                    window.location.href = '/pages/auth/login.html';
                    return;
                }
                
                // Get product card
                const card = btn.closest('.bg-white.rounded');
                if (!card) return;
                
                const productName = card.querySelector('h3')?.textContent?.trim() || 'Produk';
                const productId = cartButtonCount; // Use button index as product ID for demo
                
                try {
                    const response = await fetch('/api/cart.php', {
                        method: 'POST',
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
                        showNotification(`✓ ${productName} ditambahkan`);
                        updateCartCount();
                        
                        // Animate button
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = '✓ Ditambahkan!';
                        btn.classList.add('bg-green-600');
                        btn.classList.remove('bg-transmart-red', 'hover:bg-red-700');
                        
                        setTimeout(() => {
                            btn.innerHTML = originalHTML;
                            btn.classList.remove('bg-green-600');
                            btn.classList.add('bg-transmart-red', 'hover:bg-red-700');
                        }, 2000);
                    } else {
                        showNotification('❌ ' + (result.error || 'Gagal menambahkan'), 'error');
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    showNotification('❌ Terjadi kesalahan', 'error');
                }
            });
        }
    });
}

// Update cart count in header
async function updateCartCount() {
    try {
        const response = await fetch('/api/cart.php');
        const result = await response.json();
        
        if (result.success && result.summary) {
            const cartCountEl = document.querySelector('.fa-shopping-cart')?.parentElement?.querySelector('span:not(.text-xs)');
            if (cartCountEl) {
                cartCountEl.textContent = result.summary.total_items;
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Wishlist functionality
function setupWishlist() {
    document.querySelectorAll('button:has(i.fa-heart)').forEach(btn => {
        // Skip mobile nav buttons
        if (btn.classList.contains('fixed')) return;
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const icon = btn.querySelector('i');
            const productName = btn.closest('.bg-white')?.querySelector('h3')?.textContent?.trim() || 'Produk';
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-transmart-red');
                showNotification(`❤️ Ditambahkan ke wishlist`);
            } else {
                icon.classList.remove('fas', 'text-transmart-red');
                icon.classList.add('far');
                showNotification(`💔 Dihapus dari wishlist`);
            }
        });
    });
}

// Show notification
function showNotification(message, type = 'success') {
    let notif = document.getElementById('notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notification';
        document.body.appendChild(notif);
    }
    
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    notif.textContent = message;
    notif.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg z-50 md:bottom-6 md:right-6`;
    notif.style.display = 'block';
    
    setTimeout(() => {
        notif.style.display = 'none';
    }, 3000);
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuBtn = document.querySelector('button:has(i.fa-bars)');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            alert('Menu mobile akan dikembangkan lebih lanjut');
        });
    }
}

// Bottom navigation mobile
function setupBottomNavigation() {
    const bottomNav = document.querySelectorAll('nav.fixed.bottom-0 a');
    
    bottomNav.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (link.querySelector('i.fa-shopping-cart')) {
                // Cart
                const user = getCurrentUser();
                if (!user) {
                    alert('Silakan login terlebih dahulu');
                    window.location.href = '/pages/auth/login.html';
                    return;
                }
                window.location.href = '/pages/cart.html';
            } else if (link.querySelector('i.fa-user')) {
                // Account
                const user = getCurrentUser();
                if (!user) {
                    window.location.href = '/pages/auth/login.html';
                } else {
                    window.location.href = '/pages/user/profile.html';
                }
            } else if (link.querySelector('i.fa-th-large')) {
                // Categories
                window.location.href = '/pages/products/catalog.html';
            } else if (link.querySelector('i.fa-search')) {
                // Search
                const searchInput = document.querySelector('input[placeholder*="Cari produk"]');
                searchInput?.focus();
            }
        });
    });
}

// "Lihat Semua" button
function setupViewAllButtons() {
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Lihat Semua')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/pages/products/catalog.html';
            });
        }
    });
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Initializing homepage...');

    updateHeaderButtons();
    setupSearch();
    setupCartButton();
    setupCategoryNavigation();
    setupQuickCategories();
    setupFlashSaleButtons();
    setupAddToCartButtons();
    setupWishlist();
    setupMobileMenu();
    setupBottomNavigation();
    setupViewAllButtons();

    // Load dynamic content
    loadBanners();

    updateCartCount();

    console.log('✓ Homepage initialized successfully!');
});

// Refresh cart count when returning to page
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateCartCount();
    }
});
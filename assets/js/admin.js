// assets/js/admin.js

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadDashboardStats();
    initializeCharts();
    loadRecentOrders();
    loadTopProducts();
});

function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('transmart_current_user') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'admin') {
        window.location.href = '../pages/auth/login.html';
        return;
    }
    
    // Update admin name
    document.getElementById('adminName').textContent = currentUser.name;
}

async function loadDashboardStats() {
    try {
        // Simulate API call - in real app, this would fetch from your backend
        const stats = await simulateApiCall({
            total_revenue: 12500000,
            total_orders: 342,
            total_products: 156,
            total_customers: 289,
            revenue_change: 12.5,
            orders_change: 8.3,
            products_change: 5.2,
            customers_change: 15.7
        });

        updateStatsDisplay(stats);
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showNotification('Gagal memuat data dashboard', 'error');
    }
}

function updateStatsDisplay(stats) {
    document.getElementById('totalRevenue').textContent = formatPrice(stats.total_revenue);
    document.getElementById('totalOrders').textContent = stats.total_orders.toLocaleString();
    document.getElementById('totalProducts').textContent = stats.total_products.toLocaleString();
    document.getElementById('totalCustomers').textContent = stats.total_customers.toLocaleString();
    
    document.getElementById('revenueChange').textContent = `+${stats.revenue_change}%`;
    document.getElementById('ordersChange').textContent = `+${stats.orders_change}%`;
    document.getElementById('productsChange').textContent = `+${stats.products_change}%`;
    document.getElementById('customersChange').textContent = `+${stats.customers_change}%`;
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [{
                label: 'Pendapatan (Rp)',
                data: [8500000, 9200000, 7800000, 9500000, 11000000, 12500000, 13200000, 12800000, 14500000, 13800000, 15200000, 16800000],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + (value / 1000000).toFixed(1) + 'JT';
                        }
                    }
                }
            }
        }
    });

    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    const ordersChart = new Chart(ordersCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [{
                label: 'Jumlah Pesanan',
                data: [45, 52, 38, 48, 56, 62, 68, 65, 72, 70, 78, 85],
                backgroundColor: '#3B82F6',
                borderColor: '#3B82F6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadRecentOrders() {
    try {
        const orders = await simulateApiCall([
            {
                id: 'TRX-001',
                customer_name: 'Budi Santoso',
                total_amount: 1250000,
                status: 'delivered',
                created_at: '2024-01-15 14:30:00'
            },
            {
                id: 'TRX-002',
                customer_name: 'Siti Rahayu',
                total_amount: 890000,
                status: 'processing',
                created_at: '2024-01-15 13:15:00'
            },
            {
                id: 'TRX-003',
                customer_name: 'Ahmad Rizki',
                total_amount: 2450000,
                status: 'shipped',
                created_at: '2024-01-15 11:45:00'
            },
            {
                id: 'TRX-004',
                customer_name: 'Dewi Lestari',
                total_amount: 567000,
                status: 'pending',
                created_at: '2024-01-15 10:20:00'
            },
            {
                id: 'TRX-005',
                customer_name: 'Rudi Hartono',
                total_amount: 1780000,
                status: 'confirmed',
                created_at: '2024-01-15 09:30:00'
            }
        ]);

        displayRecentOrders(orders);
    } catch (error) {
        console.error('Error loading recent orders:', error);
    }
}

function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    
    const ordersHtml = orders.map(order => `
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                    <span class="font-semibold text-gray-900">${order.id}</span>
                    <span class="text-sm ${getStatusColor(order.status)}">${getStatusText(order.status)}</span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-600">
                    <span>${order.customer_name}</span>
                    <span>${formatPrice(order.total_amount)}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    ${formatDateTime(order.created_at)}
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = ordersHtml;
}

async function loadTopProducts() {
    try {
        const products = await simulateApiCall([
            {
                id: 1,
                name: 'Smartphone Android',
                sold_count: 120,
                revenue: 299880000
            },
            {
                id: 2,
                name: 'Headphone Wireless',
                sold_count: 89,
                revenue: 71111000
            },
            {
                id: 3,
                name: 'Laptop Gaming',
                sold_count: 45,
                revenue: 539955000
            },
            {
                id: 4,
                name: 'Sepatu Running',
                sold_count: 67,
                revenue: 26733000
            },
            {
                id: 5,
                name: 'Blender Multifungsi',
                sold_count: 34,
                revenue: 10166000
            }
        ]);

        displayTopProducts(products);
    } catch (error) {
        console.error('Error loading top products:', error);
    }
}

function displayTopProducts(products) {
    const container = document.getElementById('topProducts');
    
    const productsHtml = products.map((product, index) => `
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-3 flex-1">
                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600">
                    ${index + 1}
                </div>
                <div class="flex-1">
                    <div class="font-medium text-gray-900 text-sm">${product.name}</div>
                    <div class="text-xs text-gray-500">${product.sold_count} terjual</div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-semibold text-gray-900">${formatPrice(product.revenue)}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHtml;
}

// Utility functions
function getStatusColor(status) {
    const colors = {
        'pending': 'text-yellow-600 bg-yellow-100',
        'confirmed': 'text-blue-600 bg-blue-100',
        'processing': 'text-purple-600 bg-purple-100',
        'shipped': 'text-indigo-600 bg-indigo-100',
        'delivered': 'text-green-600 bg-green-100',
        'cancelled': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Menunggu',
        'confirmed': 'Dikonfirmasi',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'delivered': 'Sampai',
        'cancelled': 'Dibatalkan'
    };
    return texts[status] || status;
}

function formatPrice(price) {
    return 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function simulateApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function logout() {
    localStorage.removeItem('transmart_current_user');
    window.location.href = '../pages/auth/login.html';
}

// Make functions available globally
window.admin = {
    loadDashboardStats,
    logout
};
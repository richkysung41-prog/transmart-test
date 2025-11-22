// assets/js/admin-orders.js

let allOrders = [];
let selectedOrderId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadOrders();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('statusFilter').addEventListener('change', filterOrders);
}

async function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('transmart_current_user') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'admin') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
}

async function loadOrders() {
    try {
        const response = await fetch('/api/orders.php');
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        allOrders = data.data || [];
        
        displayOrders(allOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Gagal memuat pesanan', 'error');
    }
}

function filterOrders() {
    const status = document.getElementById('statusFilter').value;
    
    const filtered = status ? allOrders.filter(o => o.status === status) : allOrders;
    displayOrders(filtered);
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Tidak ada pesanan ditemukan</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#${order.id}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${order.user_name || 'N/A'}</td>
            <td class="px-6 py-4 text-sm font-medium text-transmart-red">Rp ${formatPrice(order.total_amount)}</td>
            <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(order.created_at)}</td>
            <td class="px-6 py-4 text-sm">
                <button onclick="viewOrder(${order.id})" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-eye mr-1"></i>Lihat
                </button>
            </td>
        </tr>
    `).join('');
}

function viewOrder(id) {
    const order = allOrders.find(o => o.id === id);
    if (!order) {
        showNotification('Pesanan tidak ditemukan', 'error');
        return;
    }
    
    selectedOrderId = id;
    document.getElementById('orderTitle').textContent = `Detail Pesanan #${order.id}`;
    document.getElementById('orderStatus').value = order.status;
    
    let itemsHtml = '';
    if (order.items && order.items.length > 0) {
        itemsHtml = order.items.map(item => `
            <tr>
                <td class="px-4 py-2">${item.product_name}</td>
                <td class="px-4 py-2 text-right">${item.quantity}</td>
                <td class="px-4 py-2 text-right">Rp ${formatPrice(item.price)}</td>
                <td class="px-4 py-2 text-right">Rp ${formatPrice(item.quantity * item.price)}</td>
            </tr>
        `).join('');
    }
    
    const content = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase">Nama Pelanggan</label>
                    <p class="text-gray-900">${order.user_name || '-'}</p>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase">Email</label>
                    <p class="text-gray-900">${order.user_email || '-'}</p>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase">Tanggal Pesanan</label>
                    <p class="text-gray-900">${formatDate(order.created_at)}</p>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase">Status</label>
                    <p class="text-gray-900">${getStatusText(order.status)}</p>
                </div>
            </div>
            
            <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-2">Alamat Pengiriman</label>
                <p class="text-gray-900">${order.shipping_address || '-'}</p>
            </div>
            
            <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-2">Produk</label>
                <table class="w-full text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-4 py-2 text-left">Produk</th>
                            <th class="px-4 py-2 text-right">Qty</th>
                            <th class="px-4 py-2 text-right">Harga</th>
                            <th class="px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml || '<tr><td colspan="4" class="px-4 py-2 text-center text-gray-500">Tidak ada item</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="bg-gray-100 p-3 rounded-lg">
                <div class="flex justify-between font-semibold">
                    <span>Total Pembayaran:</span>
                    <span class="text-transmart-red">Rp ${formatPrice(order.total_amount)}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailContent').innerHTML = content;
    document.getElementById('orderModal').classList.remove('hidden');
}

async function updateOrderStatus() {
    if (!selectedOrderId) return;
    
    const newStatus = document.getElementById('orderStatus').value;
    
    try {
        const formData = new FormData();
        formData.append('action', 'update_status');
        formData.append('order_id', selectedOrderId);
        formData.append('status', newStatus);
        
        const response = await fetch('/api/orders.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Status pesanan berhasil diperbarui', 'success');
            closeOrderModal();
            loadOrders();
        } else {
            showNotification(data.message || 'Gagal memperbarui status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Gagal memperbarui status pesanan', 'error');
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.add('hidden');
    selectedOrderId = null;
}

function getStatusBadge(status) {
    const badges = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Menunggu',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'delivered': 'Sampai',
        'cancelled': 'Dibatalkan'
    };
    return texts[status] || status;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('transmart_current_user');
    window.location.href = '../../pages/auth/login.html';
}

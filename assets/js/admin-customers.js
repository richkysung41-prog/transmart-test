// assets/js/admin-customers.js

let allCustomers = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadCustomers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterCustomers);
}

async function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('transmart_current_user') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'admin') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
}

async function loadCustomers() {
    try {
        const response = await fetch('/api/users.php');
        if (!response.ok) throw new Error('Failed to fetch customers');
        
        const data = await response.json();
        
        // Filter only customer role
        allCustomers = (data.data || []).filter(u => u.role === 'customer' || !u.role);
        
        displayCustomers(allCustomers);
    } catch (error) {
        console.error('Error loading customers:', error);
        showNotification('Gagal memuat pelanggan', 'error');
    }
}

function filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = allCustomers.filter(customer => {
        return customer.name.toLowerCase().includes(searchTerm) ||
               customer.email.toLowerCase().includes(searchTerm) ||
               (customer.phone || '').includes(searchTerm);
    });
    
    displayCustomers(filtered);
}

function displayCustomers(customers) {
    const tbody = document.getElementById('customersTableBody');
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Tidak ada pelanggan ditemukan</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map(customer => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${customer.name}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${customer.email}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${customer.phone || '-'}</td>
            <td class="px-6 py-4 text-sm font-medium text-transmart-red">
                Rp ${formatPrice(customer.total_spending || 0)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">${customer.order_count || 0} pesanan</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(customer.created_at)}</td>
        </tr>
    `).join('');
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
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

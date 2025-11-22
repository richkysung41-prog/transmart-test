// assets/js/admin-promo.js

let allPromos = [];
let editingPromoId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadPromos();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('promoForm').addEventListener('submit', savePromo);
}

async function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('transmart_current_user') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'admin') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
}

async function loadPromos() {
    try {
        const response = await fetch('/api/orders.php?action=get_discounts');
        if (response.ok) {
            const data = await response.json();
            allPromos = data.data || [];
        } else {
            // Default sample data
            allPromos = [
                {
                    id: 1,
                    code: 'SELAMAT10',
                    type: 'percentage',
                    value: 10,
                    min_purchase: 100000,
                    valid_from: '2024-01-01',
                    valid_until: '2024-12-31',
                    description: 'Diskon 10% untuk pembelian minimal Rp100.000'
                },
                {
                    id: 2,
                    code: 'GRATIS5K',
                    type: 'fixed',
                    value: 5000,
                    min_purchase: 50000,
                    valid_from: '2024-01-01',
                    valid_until: '2024-12-31',
                    description: 'Diskon Rp5.000 untuk pembelian minimal Rp50.000'
                }
            ];
        }
        
        displayPromos();
    } catch (error) {
        console.error('Error loading promos:', error);
        showNotification('Gagal memuat promo', 'error');
    }
}

function displayPromos() {
    const tbody = document.getElementById('promosTableBody');
    
    if (allPromos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Tidak ada promo ditemukan</td></tr>';
        return;
    }
    
    tbody.innerHTML = allPromos.map(promo => {
        const now = new Date();
        const validFrom = new Date(promo.valid_from);
        const validUntil = new Date(promo.valid_until);
        const isActive = now >= validFrom && now <= validUntil;
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${promo.code}</td>
                <td class="px-6 py-4 text-sm text-gray-700">
                    ${promo.type === 'percentage' ? promo.value + '%' : 'Rp' + formatPrice(promo.value)}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                    ${promo.type === 'percentage' ? 'Persentase' : 'Nominal'}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">${formatDate(promo.valid_from)}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${formatDate(promo.valid_until)}</td>
                <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }">
                        ${isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm space-x-2">
                    <button onclick="editPromo(${promo.id})" class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deletePromo(${promo.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddPromoModal() {
    editingPromoId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Promo Baru';
    document.getElementById('promoForm').reset();
    document.getElementById('promoModal').classList.remove('hidden');
}

function editPromo(id) {
    const promo = allPromos.find(p => p.id === id);
    if (!promo) {
        showNotification('Promo tidak ditemukan', 'error');
        return;
    }
    
    editingPromoId = id;
    document.getElementById('modalTitle').textContent = 'Edit Promo';
    document.getElementById('promoCode').value = promo.code;
    document.getElementById('promoType').value = promo.type;
    document.getElementById('promoValue').value = promo.value;
    document.getElementById('promoMinPurchase').value = promo.min_purchase || '';
    document.getElementById('promoValidFrom').value = promo.valid_from ? promo.valid_from.replace(' ', 'T').slice(0, 16) : '';
    document.getElementById('promoValidUntil').value = promo.valid_until ? promo.valid_until.replace(' ', 'T').slice(0, 16) : '';
    document.getElementById('promoDescription').value = promo.description || '';
    
    document.getElementById('promoModal').classList.remove('hidden');
}

async function deletePromo(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
        return;
    }
    
    allPromos = allPromos.filter(p => p.id !== id);
    displayPromos();
    showNotification('Promo berhasil dihapus', 'success');
}

async function savePromo(e) {
    e.preventDefault();
    
    const promo = {
        id: editingPromoId || Math.max(...allPromos.map(p => p.id), 0) + 1,
        code: document.getElementById('promoCode').value,
        type: document.getElementById('promoType').value,
        value: parseFloat(document.getElementById('promoValue').value),
        min_purchase: parseFloat(document.getElementById('promoMinPurchase').value) || 0,
        valid_from: document.getElementById('promoValidFrom').value,
        valid_until: document.getElementById('promoValidUntil').value,
        description: document.getElementById('promoDescription').value
    };
    
    if (editingPromoId) {
        const index = allPromos.findIndex(p => p.id === editingPromoId);
        if (index !== -1) {
            allPromos[index] = promo;
        }
        showNotification('Promo berhasil diperbarui', 'success');
    } else {
        allPromos.push(promo);
        showNotification('Promo berhasil ditambahkan', 'success');
    }
    
    displayPromos();
    closePromoModal();
}

function closePromoModal() {
    document.getElementById('promoModal').classList.add('hidden');
    document.getElementById('promoForm').reset();
    editingPromoId = null;
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
